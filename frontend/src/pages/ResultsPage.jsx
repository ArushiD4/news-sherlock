import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import bgImage from "../assets/images/bg.png";
import Navbar from "../components/navbar";

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { url, checkType } = location.state || {};
  
  // State to store both fact and bias results
  const [factCheckResult, setFactCheckResult] = useState(null);
  const [biasCheckResult, setBiasCheckResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load persisted results from localStorage on mount
  useEffect(() => {
    if (url) {
      const storageKey = `results_${url}`;
      const savedResults = localStorage.getItem(storageKey);
      if (savedResults) {
        const parsed = JSON.parse(savedResults);
        if (parsed.factCheckResult) setFactCheckResult(parsed.factCheckResult);
        if (parsed.biasCheckResult) setBiasCheckResult(parsed.biasCheckResult);
      }
    }
  }, [url]);

  // Generate mock results based on URL and check type
  useEffect(() => {
    if (url && checkType) {
      // Check if result already exists
      const storageKey = `results_${url}`;
      const savedResults = localStorage.getItem(storageKey);
      const parsed = savedResults ? JSON.parse(savedResults) : {};
      
      // If result already exists, don't regenerate
      if (checkType === "fact" && parsed.factCheckResult) {
        setFactCheckResult(parsed.factCheckResult);
        return;
      }
      if (checkType === "bias" && parsed.biasCheckResult) {
        setBiasCheckResult(parsed.biasCheckResult);
        return;
      }

      setIsLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        if (checkType === "fact") {
          // Generate fact check result
          const credibilityScore = Math.floor(Math.random() * 30) + 70; // 70-100
          const factResult = {
            credibilityScore,
            verdict: credibilityScore >= 85 ? "Highly Credible" : credibilityScore >= 75 ? "Credible" : "Moderately Credible",
            correctNews: `Based on our analysis of "${url}", this article appears to be ${credibilityScore >= 85 ? "highly credible" : credibilityScore >= 75 ? "credible" : "moderately credible"} with a credibility score of ${credibilityScore}%. The content aligns with verified sources and fact-checking databases. Key claims have been cross-referenced with reputable news outlets and official statements.`,
            analysis: [
              "Source verification: Cross-checked with 5+ reputable news outlets",
              "Fact-checking databases: Verified against major fact-checking organizations",
              "Author credibility: Author has established track record",
              "Content consistency: Information aligns with official statements"
            ]
          };
          setFactCheckResult(factResult);
          // Save to localStorage
          const existing = localStorage.getItem(storageKey);
          const existingParsed = existing ? JSON.parse(existing) : {};
          localStorage.setItem(storageKey, JSON.stringify({
            ...existingParsed,
            factCheckResult: factResult,
            url
          }));
        } else if (checkType === "bias") {
          // Generate bias check result
          const biasScore = Math.floor(Math.random() * 40) + 30; // 30-70 (lower is less biased)
          const biasResult = {
            biasScore,
            verdict: biasScore <= 40 ? "Minimal Bias" : biasScore <= 55 ? "Moderate Bias" : "Significant Bias",
            analysis: [
              `Political leaning: ${biasScore <= 40 ? "Neutral" : biasScore <= 55 ? "Slight leaning" : "Clear political bias detected"}`,
              `Emotional language: ${biasScore <= 40 ? "Objective tone" : biasScore <= 55 ? "Some emotional language" : "Heavy use of emotional language"}`,
              `Source diversity: ${biasScore <= 40 ? "Multiple perspectives" : biasScore <= 55 ? "Limited perspectives" : "Single perspective"}`,
              `Fact vs opinion: ${biasScore <= 40 ? "Mostly factual" : biasScore <= 55 ? "Mixed" : "Opinion-heavy"}`
            ]
          };
          setBiasCheckResult(biasResult);
          // Save to localStorage
          const existing = localStorage.getItem(storageKey);
          const existingParsed = existing ? JSON.parse(existing) : {};
          localStorage.setItem(storageKey, JSON.stringify({
            ...existingParsed,
            biasCheckResult: biasResult,
            url
          }));
        }
        setIsLoading(false);
      }, 1500);
    }
  }, [url, checkType]);

  // Generate digest when both results are available
  const digest = factCheckResult && biasCheckResult ? {
    correctNews: factCheckResult.correctNews,
    credibilityScore: factCheckResult.credibilityScore,
    biasScore: biasCheckResult.biasScore,
    overallVerdict: factCheckResult.credibilityScore >= 75 && biasCheckResult.biasScore <= 50 ? "Reliable" : "Needs Verification"
  } : null;

  return (
    <div
      className="min-h-screen bg-oxford_blue text-white_custom"
      style={{
        backgroundImage: `linear-gradient(rgba(7,17,36,0.55), rgba(7,17,36,0.55)), url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Navbar />
      
      <div className="flex flex-col items-center px-4 py-10">
        <h2 className="text-4xl font-bold mb-8 tracking-wide">Analysis Results</h2>

        {!url ? (
          <div className="bg-prussian_blue p-8 rounded-2xl shadow-xl border border-charcoal max-w-xl w-full text-center">
            <p className="text-lg">No data provided. Please go back and submit a URL.</p>
            <button
              onClick={() => navigate("/detect")}
              className="mt-4 bg-white_custom text-oxford_blue px-6 py-3 rounded-xl font-bold hover:bg-charcoal hover:text-white_custom transition-all"
            >
              Go Back
            </button>
          </div>
        ) : (
          <div className="w-full max-w-4xl space-y-6">
            {/* URL Display */}
            <div className="bg-prussian_blue p-6 rounded-2xl shadow-xl border border-charcoal">
              <p className="text-lg break-words">
                <strong className="text-white_custom">Analyzed URL:</strong> {url}
              </p>
            </div>

            {isLoading ? (
              <div className="bg-prussian_blue p-8 rounded-2xl shadow-xl border border-charcoal text-center">
                <p className="text-xl">Analyzing article...</p>
                <div className="mt-4 flex justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white_custom"></div>
                </div>
              </div>
            ) : (
              <>
                {/* Fact Check Results */}
                {checkType === "fact" && factCheckResult && (
                  <div className="bg-prussian_blue p-8 rounded-2xl shadow-xl border border-charcoal">
                    <h3 className="text-3xl font-bold mb-6 text-white_custom">Fact Check Results</h3>
                    
                    {/* Credibility Score */}
                    <div className="bg-eerie_black p-6 rounded-xl border border-charcoal mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xl font-semibold">Credibility Score</span>
                        <span className={`text-4xl font-bold ${
                          factCheckResult.credibilityScore >= 85 ? "text-green-400" :
                          factCheckResult.credibilityScore >= 75 ? "text-yellow-400" : "text-orange-400"
                        }`}>
                          {factCheckResult.credibilityScore}%
                        </span>
                      </div>
                      <div className="w-full bg-charcoal rounded-full h-4">
                        <div
                          className={`h-4 rounded-full ${
                            factCheckResult.credibilityScore >= 85 ? "bg-green-400" :
                            factCheckResult.credibilityScore >= 75 ? "bg-yellow-400" : "bg-orange-400"
                          }`}
                          style={{ width: `${factCheckResult.credibilityScore}%` }}
                        ></div>
                      </div>
                      <p className="text-lg mt-4 text-white_custom/80">
                        <strong>Verdict:</strong> {factCheckResult.verdict}
                      </p>
                    </div>

                    {/* Correct News */}
                    <div className="bg-eerie_black p-6 rounded-xl border border-charcoal mb-6">
                      <h4 className="text-xl font-semibold mb-4 text-white_custom">Corrected News Summary</h4>
                      <p className="text-white_custom/90 leading-relaxed">{factCheckResult.correctNews}</p>
                    </div>

                    {/* Analysis Points */}
                    <div className="bg-eerie_black p-6 rounded-xl border border-charcoal">
                      <h4 className="text-xl font-semibold mb-4 text-white_custom">Analysis Details</h4>
                      <ul className="space-y-2">
                        {factCheckResult.analysis.map((point, index) => (
                          <li key={index} className="text-white_custom/90 flex items-start">
                            <span className="text-green-400 mr-2">✓</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Button to check bias */}
                    {!biasCheckResult && (
                      <button
                        onClick={() => navigate("/results", {
                          state: { url, checkType: "bias" }
                        })}
                        className="mt-6 w-full py-3 bg-white_custom text-oxford_blue font-bold rounded-xl hover:bg-charcoal hover:text-white_custom transition-all duration-300 shadow-md"
                      >
                        Check Bias Score
                      </button>
                    )}
                  </div>
                )}

                {/* Bias Check Results */}
                {checkType === "bias" && biasCheckResult && (
                  <div className="bg-prussian_blue p-8 rounded-2xl shadow-xl border border-charcoal">
                    <h3 className="text-3xl font-bold mb-6 text-white_custom">Bias Check Results</h3>
                    
                    {/* Bias Score */}
                    <div className="bg-eerie_black p-6 rounded-xl border border-charcoal mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xl font-semibold">Bias Score</span>
                        <span className={`text-4xl font-bold ${
                          biasCheckResult.biasScore <= 40 ? "text-green-400" :
                          biasCheckResult.biasScore <= 55 ? "text-yellow-400" : "text-red-400"
                        }`}>
                          {biasCheckResult.biasScore}%
                        </span>
                      </div>
                      <div className="w-full bg-charcoal rounded-full h-4">
                        <div
                          className={`h-4 rounded-full ${
                            biasCheckResult.biasScore <= 40 ? "bg-green-400" :
                            biasCheckResult.biasScore <= 55 ? "bg-yellow-400" : "bg-red-400"
                          }`}
                          style={{ width: `${biasCheckResult.biasScore}%` }}
                        ></div>
                      </div>
                      <p className="text-lg mt-4 text-white_custom/80">
                        <strong>Verdict:</strong> {biasCheckResult.verdict}
                        <span className="text-sm text-white_custom/60 ml-2">(Lower is better)</span>
                      </p>
                    </div>

                    {/* Analysis Points */}
                    <div className="bg-eerie_black p-6 rounded-xl border border-charcoal">
                      <h4 className="text-xl font-semibold mb-4 text-white_custom">Bias Analysis</h4>
                      <ul className="space-y-2">
                        {biasCheckResult.analysis.map((point, index) => (
                          <li key={index} className="text-white_custom/90 flex items-start">
                            <span className="text-yellow-400 mr-2">•</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Button to check fact */}
                    {!factCheckResult && (
                      <button
                        onClick={() => navigate("/results", {
                          state: { url, checkType: "fact" }
                        })}
                        className="mt-6 w-full py-3 bg-white_custom text-oxford_blue font-bold rounded-xl hover:bg-charcoal hover:text-white_custom transition-all duration-300 shadow-md"
                      >
                        Check Credibility Score
                      </button>
                    )}
                  </div>
                )}

                {/* Digest Section - Shows when both checks are done */}
                {digest && (
                  <div className="bg-gradient-to-r from-prussian_blue to-eerie_black p-8 rounded-2xl shadow-xl border-2 border-yellow-500/50">
                    <h3 className="text-3xl font-bold mb-6 text-white_custom flex items-center">
                      <span className="mr-3">📋</span>
                      Complete Digest
                    </h3>
                    
                    <div className="bg-black/30 p-6 rounded-xl border border-charcoal mb-6">
                      <h4 className="text-xl font-semibold mb-4 text-white_custom">Corrected News</h4>
                      <p className="text-white_custom/90 leading-relaxed">{digest.correctNews}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-eerie_black p-6 rounded-xl border border-charcoal">
                        <h4 className="text-lg font-semibold mb-2 text-white_custom">Credibility Score</h4>
                        <p className={`text-3xl font-bold ${
                          digest.credibilityScore >= 85 ? "text-green-400" :
                          digest.credibilityScore >= 75 ? "text-yellow-400" : "text-orange-400"
                        }`}>
                          {digest.credibilityScore}%
                        </p>
                      </div>
                      <div className="bg-eerie_black p-6 rounded-xl border border-charcoal">
                        <h4 className="text-lg font-semibold mb-2 text-white_custom">Bias Score</h4>
                        <p className={`text-3xl font-bold ${
                          digest.biasScore <= 40 ? "text-green-400" :
                          digest.biasScore <= 55 ? "text-yellow-400" : "text-red-400"
                        }`}>
                          {digest.biasScore}%
                        </p>
                      </div>
                    </div>

                    <div className="bg-eerie_black p-6 rounded-xl border border-charcoal">
                      <h4 className="text-xl font-semibold mb-2 text-white_custom">Overall Verdict</h4>
                      <p className={`text-2xl font-bold ${
                        digest.overallVerdict === "Reliable" ? "text-green-400" : "text-yellow-400"
                      }`}>
                        {digest.overallVerdict}
                      </p>
                      <p className="text-white_custom/70 mt-2">
                        {digest.overallVerdict === "Reliable" 
                          ? "This article appears to be reliable based on credibility and bias analysis."
                          : "This article may require additional verification before sharing."}
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => navigate("/detect")}
                    className="flex-1 py-3 bg-transparent border border-white_custom text-white_custom font-bold rounded-xl hover:bg-white_custom/10 transition-all duration-300"
                  >
                    Analyze Another Article
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="flex-1 py-3 bg-white_custom text-oxford_blue font-bold rounded-xl hover:bg-charcoal hover:text-white_custom transition-all duration-300"
                  >
                    Back to Home
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
