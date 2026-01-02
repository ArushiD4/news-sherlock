import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { originalText, verdict, confidence, reasons, recommendation, apiUsed } = location.state || {
    originalText: "No text provided",
    verdict: "Unknown", 
    confidence: 0,
    reasons: ["Please go back and scan a valid news text."],
    recommendation: "",
    apiUsed: "None"
  };

  const isFake = ["Fake", "False", "Pants on Fire", "Misleading", "Satire"].some(v => verdict?.includes(v));
  const isTrue = ["Real", "True", "Likely Real"].some(v => verdict?.includes(v));
  
  let resultColor = "text-yellow-500";
  let borderColor = "border-yellow-500";
  let badgeColor = "bg-yellow-500/10 text-yellow-500";
  
  if (isFake) {
    resultColor = "text-red-500";
    borderColor = "border-red-500";
    badgeColor = "bg-red-500/10 text-red-500";
  } else if (isTrue) {
    resultColor = "text-green-500";
    borderColor = "border-green-500";
    badgeColor = "bg-green-500/10 text-green-500";
  }

  return (
    <div className="min-h-screen bg-oxford_blue text-white_custom flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex flex-col items-center justify-center p-4 mt-8">
        <div className="w-full max-w-4xl">
          
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 tracking-wide">
            Analysis Report
          </h1>

          <div className={`bg-prussian_blue p-8 md:p-10 rounded-3xl shadow-2xl border-2 ${borderColor} relative overflow-hidden`}>
            
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-300 uppercase tracking-widest mb-4">
                Classification Result
              </h2>
              
              <div className={`text-5xl md:text-7xl font-extrabold ${resultColor} drop-shadow-lg mb-4 uppercase`}>
                {verdict}
              </div>

              <div className="flex justify-center gap-4 mb-8">
                <span className={`px-4 py-2 rounded-full font-mono text-sm border ${borderColor} ${badgeColor}`}>
                  Confidence: {confidence}%
                </span>
                <span className="px-4 py-2 rounded-full font-mono text-sm bg-gray-700 text-gray-300 border border-gray-600">
                  Source: {apiUsed}
                </span>
              </div>
            </div>

            {/* ✅ ADDED: Recommendation Section */}
            {recommendation && (
              <div className="mt-6 mb-6 p-6 rounded-xl border-2 border-dashed border-yellow-500/50 bg-yellow-500/5">
                <h3 className="text-lg font-bold text-yellow-500 mb-2 flex items-center">
                  💡 Suggestion
                </h3>
                <p className="text-gray-200 text-lg italic leading-relaxed">
                  {recommendation}
                </p>
              </div>
            )}

            {reasons && reasons.length > 0 && (
              <div className="mt-6 bg-oxford_blue p-6 rounded-xl border border-charcoal">
                <h3 className="text-lg font-semibold text-[#d4af37] mb-3">
                  🧐 Key Findings
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-300 text-lg">
                  {reasons.map((reason, index) => (
                    <li key={index}>{reason}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 p-6 rounded-xl border border-gray-700 bg-gray-900/50">
                <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase">
                  📝 Content Analyzed
                </h3>
                <p className="text-gray-300 italic leading-relaxed line-clamp-3">
                  "{originalText}"
                </p>
            </div>

          </div>

          <div className="mt-10 text-center pb-10">
            <button 
              onClick={() => navigate("/detect")}
              className="px-10 py-4 bg-white_custom text-oxford_blue font-bold text-lg rounded-full shadow-lg hover:bg-gray-200 transition-all duration-300"
            >
              Scan Another Article
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}