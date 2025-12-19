import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Get Real Data from Router State
  // If state is null (direct access), use fallback/dummy data
  const { url, prediction, excerpt } = location.state || {
    url: "No URL provided",
    prediction: "Unknown", 
    excerpt: "Please go back and scan a valid news URL."
  };

  // 2. Determine Styling based on Result
  const isFake = prediction === "Fake News";
  const isTrue = prediction === "True News";
  
  // Default to gray if unknown
  let resultColor = "text-gray-400";
  let borderColor = "border-gray-500";
  
  if (isFake) {
    resultColor = "text-red-500";
    borderColor = "border-red-500";
  } else if (isTrue) {
    resultColor = "text-green-500";
    borderColor = "border-green-500";
  }

  return (
    <div className="min-h-screen bg-oxford_blue text-white_custom flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex flex-col items-center justify-center p-4 mt-8">
        <div className="w-full max-w-4xl">
          
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 tracking-wide">
            Analysis Report
          </h1>

          {/* Result Card */}
          <div className={`bg-prussian_blue p-8 md:p-10 rounded-3xl shadow-2xl border-2 ${borderColor} relative overflow-hidden`}>
            
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-300 uppercase tracking-widest mb-4">
                Classification Result
              </h2>
              
              <div className={`text-5xl md:text-7xl font-extrabold ${resultColor} drop-shadow-lg mb-8 uppercase`}>
                {prediction}
              </div>

              {/* Source Link */}
              <div className="bg-oxford_blue/50 p-4 rounded-xl border border-charcoal inline-block max-w-full overflow-hidden text-ellipsis mb-8">
                <span className="text-gray-400 mr-2">Source:</span>
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline truncate">
                  {url}
                </a>
              </div>
            </div>

            {/* Excerpt Section */}
            {excerpt && (
              <div className="mt-6 bg-oxford_blue p-6 rounded-xl border border-charcoal">
                <h3 className="text-lg font-semibold text-[#d4af37] mb-3">
                  📝 Content Analyzed
                </h3>
                <p className="text-gray-300 italic leading-relaxed text-lg">
                  "{excerpt}"
                </p>
              </div>
            )}
          </div>

          {/* Back Button */}
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