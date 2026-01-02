const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const Sentiment = require('sentiment');
const fs = require('fs');
const path = require('path');
const ScannedNews = require('../models/News'); 
const sentiment = new Sentiment();

let knownSites = { trusted: [], satire: [] };
try {
    knownSites = require('../data/knownSources.json');
} catch (e) { 
    console.warn("Could not load knownSources.json"); 
}

let stopWordsList = [];
try {
    stopWordsList = require('../data/stopwords.json');
} catch (e) { 
    stopWordsList = ["the", "is", "and", "to", "viral", "video", "claims"];
}
const stopWordsSet = new Set(stopWordsList);

let threatDB = {};
try {
  const dbPath = path.join(__dirname, '../data/suspicious_keywords.json');
  const rawData = fs.readFileSync(dbPath, 'utf8');
  threatDB = JSON.parse(rawData);
} catch (err) {
  threatDB = { factors: { topic_triggers: { 'General': ['alien', 'conspiracy'] } } };
}

function getSearchQuery(inputText) {
    const words = inputText
        .toLowerCase()
        .replace(/[^\w\s]/g, '') 
        .split(/\s+/);

    const keywords = words.filter(word => word.length > 2 && !stopWordsSet.has(word));
    return keywords.slice(0, 8).join(' ');
}

async function saveToDb(text, resultData, userId) {
  try {
    const newRecord = new ScannedNews({
      articleText: text,
      verdict: resultData.verdict,
      confidence: resultData.confidence,
      reasons: resultData.reasons,
      recommendation: resultData.recommendation || '',
      apiUsed: resultData.apiUsed,
      userId: userId || null
    });
    await newRecord.save();
  } catch (err) { 
    console.error("DB Save Error:", err.message); 
  }
}

router.post('/check', async (req, res) => {
  try {
    let { text, userId } = req.body;
    let detectedDomain = null; 

    if (!text || text.length < 5) return res.status(400).json({ msg: 'Text too short.' });

    if (text.trim().startsWith('http')) {
      try {
        const urlObj = new URL(text);
        detectedDomain = urlObj.hostname.replace('www.', '');
        
        const { data } = await axios.get(text, { 
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,text/plain'
            }, timeout: 5000 
        });

        const $ = cheerio.load(data);
        let scraped = "";
        $('p, h1, h2').each((i, el) => { scraped += $(el).text() + " "; });
        
        if (scraped.length < 50) {
             scraped = $('body').length > 0 ? $('body').text() : (typeof data === 'string' ? data : "");
        }

        if (scraped.length > 50) {
            text = scraped.trim();
        }
      } catch (e) { 
          console.error("Scraper Error:", e.message); 
      }
    }

    let result = null;

    try {
      const smartQuery = getSearchQuery(text); 
      const googleUrl = `https://factchecktools.googleapis.com/v1alpha1/claims:search?key=${process.env.GOOGLE_API_KEY}&query=${encodeURIComponent(smartQuery)}&languageCode=en`;      
      const googleRes = await axios.get(googleUrl);
      const claims = googleRes.data.claims;

      if (claims && claims.length > 0) {
        const bestClaim = claims[0];
        const review = bestClaim.claimReview[0];
        const rating = review.textualRating.toLowerCase();
        const badRatings = ['false', 'satire', 'labeled satire', 'fake', 'incorrect', 'misleading', 'pants on fire', 'scam', 'altered', 'hoax'];
        const isFake = badRatings.some(badWord => rating.includes(badWord));

        result = {
          verdict: isFake ? "Fake / Satire" : "Likely Real",
          confidence: 95,
          reasons: [
            `Fact Check by ${review.publisher.name}: "${review.textualRating}"`,
            `Source: ${review.url}`
          ],
          recommendation: `This claim has been verified by ${review.publisher.name}. Click the link in reasons to see the proof.`,
          apiUsed: "Google Fact Check API"
        };
      }
    } catch (googleErr) { 
        console.warn("Google API skipped:", googleErr.message); 
    }

    if (!result) {
      let reasons = [];
      let totalSuspicion = 0;

      if (detectedDomain) {
          if (knownSites.trusted.some(d => detectedDomain.includes(d))) {
              result = {
                  verdict: "Likely Real",
                  confidence: 90,
                  reasons: [`Source (${detectedDomain}) is on the Trusted Media whitelist.`],
                  recommendation: "This source is generally reliable.",
                  apiUsed: "Domain Reputation Engine"
              };
          } 
          else if (knownSites.satire.some(d => detectedDomain.includes(d))) {
              result = {
                  verdict: "Fake / Satire",
                  confidence: 100,
                  reasons: [`Source (${detectedDomain}) is a known satire publication.`],
                  recommendation: "This is entertainment, not news.",
                  apiUsed: "Domain Reputation Engine"
              };
          }
      }

      if (!result) {
          const lowerText = text.toLowerCase();
          const topics = threatDB.factors.topic_triggers || {};
          let matchCount = 0;
          
          Object.keys(topics).forEach(category => {
            const keywords = topics[category];
            const matches = keywords.filter(word => lowerText.includes(word));
            matchCount += matches.length;
          });
          
          if (matchCount > 0) {
            totalSuspicion += (matchCount * 10);
            reasons.push(`Found high-risk keywords (${matchCount} matches)`);
          }

          const sentimentResult = sentiment.analyze(text);
          if (sentimentResult.comparative < -0.5) {
            totalSuspicion += 20;
            reasons.push("Tone is significantly aggressive or negative.");
          }

          const upperCount = (text.match(/\b[A-Z]{4,}\b/g) || []).length;
          if (text.length > 50 && upperCount > 2) {
            totalSuspicion += 15;
            reasons.push("Excessive use of ALL CAPS.");
          }

          if (totalSuspicion >= 40) {
             result = {
                 verdict: "Fake / Suspicious",
                 confidence: Math.min(95, 60 + totalSuspicion),
                 reasons: reasons,
                 recommendation: "High threat levels detected. Treat with caution.",
                 apiUsed: "MultiFactorEngine"
             };
          } else {
             result = {
                 verdict: "Likely Real",
                 confidence: 75,
                 reasons: ["Content tone is neutral.", "No threat triggers detected.", "Structure aligns with standard reporting."],
                 recommendation: "Analysis found no obvious red flags.",
                 apiUsed: "MultiFactorEngine"
             };
          }
      }
    }

    await saveToDb(text, result, userId);
    res.json(result);

  } catch (err) {
    console.error("Server Error:", err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const history = await ScannedNews.find({ userId })
      .sort({ submittedAt: -1 })
      .limit(20);

    res.json(history);
  } catch (err) {
    console.error("History Error:", err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;