const express = require('express');
const router = express.Router();
const axios = require('axios');
const OpenAI = require('openai'); // Import OpenAI
const ScannedNews = require('../models/News');

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

// @route   POST /api/news/check
router.post('/check', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.length < 5) {
      return res.status(400).json({ msg: 'Text is too short.' });
    }

    console.log("------------------------------------------------");
    console.log("🔎 Checking Text:", text.substring(0, 50) + "...");

    // =========================================================
    // LAYER 1: GOOGLE FACT CHECK API
    // =========================================================
    let googleResult = null;
    try {
      const googleUrl = 'https://factchecktools.googleapis.com/v1alpha1/claims:search';
      const queryText = text.length > 200 ? text.substring(0, 200) : text;

      const response = await axios.get(googleUrl, {
        params: {
          query: queryText,
          key: process.env.GOOGLE_FACT_CHECK_KEY,
          languageCode: 'en'
        }
      });

      if (response.data.claims && response.data.claims.length > 0) {
        const bestMatch = response.data.claims[0];
        const review = bestMatch.claimReview[0];
        
        console.log("✅ Google Found Match:", review.textualRating);
        
        googleResult = {
          verdict: review.textualRating, 
          confidence: 100, 
          reasons: [
            `Fact checked by ${review.publisher.name}`,
            `Source: ${review.url}`
          ],
          apiUsed: "Google"
        };
      }
    } catch (googleError) {
      console.log("⚠️ Google API skipped or failed (Continuing to OpenAI)...");
    }

    // If Google found something, return it immediately!
    if (googleResult) {
      // TODO: Save to DB (We will add this in the next block)
      return res.json(googleResult);
    }

    // =========================================================
    // LAYER 2: OPENAI API (Fallback)
    // =========================================================
    console.log("🤖 Google found nothing. Asking OpenAI...");

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or "gpt-4o" if you have access
      messages: [
        {
          role: "system", 
          content: "You are a professional fact-checker. Analyze the news text provided. Return a JSON object with keys: 'verdict' (Real, Fake, Misleading), 'confidence' (integer 0-100), and 'reasons' (array of 3 short strings explaining why)."
        },
        {
          role: "user", 
          content: `Analyze this news: "${text}"`
        }
      ],
      temperature: 0.2, // Low temperature = more logical/strict
    });

    // Parse the string response from OpenAI into a real JSON object
    const aiResponseContent = completion.choices[0].message.content;
    let aiJson;
    
    try {
      // Sometimes AI adds markdown ```json ... ```, we clean it
      const cleanJson = aiResponseContent.replace(/```json|```/g, '').trim();
      aiJson = JSON.parse(cleanJson);
    } catch (parseError) {
      // Fallback if AI sends bad JSON
      aiJson = {
        verdict: "Unverified",
        confidence: 50,
        reasons: ["AI response format error", "Please try again"]
      };
    }

    const finalResult = {
      ...aiJson,
      apiUsed: "OpenAI"
    };

    console.log("✅ OpenAI Verdict:", finalResult.verdict);

    // TODO: Save to DB here (Next Step)

    res.json(finalResult);

  } catch (err) {
    console.error("❌ Server Error:", err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;