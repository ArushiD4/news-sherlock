import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";

function HomePage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // VALIDATION: We now accept text OR URLs, so we just check length
    if (input.trim().length < 20) {
      alert("Please enter a valid headline or claim (at least 20 chars) for accurate detection.");
      return;
    }

    setLoading(true);

    try {
      // 1. Send Text to Node.js Backend
      // ⚠️ UPDATED: Port 5000 and /api/news/check endpoint
      const response = await fetch("http://localhost:5000/api/news/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // ⚠️ UPDATED: Backend expects 'text', not 'url'
        body: JSON.stringify({ text: input.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        // 2. Success: Navigate to Results with NEW data structure
        navigate("/results", { 
          state: { 
            originalText: input, 
            verdict: data.verdict,       // e.g. "Fake", "Real"
            confidence: data.confidence, // e.g. 85
            reasons: data.reasons,       // Array of strings
            apiUsed: data.apiUsed        // e.g. "Google" or "KeywordAnalysis"
          } 
        });
      } else {
        // 3. Server Error
        alert(data.msg || "Analysis failed. Please try again.");
      }

    } catch (error) {
      console.error("Connection error:", error);
      alert("Could not connect to the backend. Is 'node server.js' running on port 5000?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-oxford_blue text-white_custom relative"
      style={{
        backgroundImage: `linear-gradient(rgba(7,17,36,0.55), rgba(7,17,36,0.55)), url(/src/assets/images/bg.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Navbar />

      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center drop-shadow-lg">
          Validate Your News
        </h1>

        <form onSubmit={handleSubmit} className="w-full max-w-2xl flex flex-col gap-6">
          <input
            type="text"
            // ⚠️ UPDATED: Placeholder to reflect text capability
            placeholder="Paste news URL, headline or claim here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full py-6 px-4 rounded-xl text-oxford_blue focus:outline-none focus:ring-4 focus:ring-yellow-500/50 shadow-lg text-lg"
          />
          <button
            type="submit"
            disabled={loading}
            className={`
              w-3/4 mx-auto py-4 rounded-full font-bold text-oxford_blue shadow-lg transition-all duration-300 text-lg uppercase tracking-wide
              ${loading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-gradient-to-r from-[#d4af37] to-[#b8860b] hover:scale-105 hover:shadow-yellow-500/50"
              }
            `}
          >
            {loading ? "Analyzing..." : "Scan News"}
          </button>
        </form>
        
        <p className="mt-6 text-gray-300 text-lg max-w-xl text-center">
          "Unmask the truth behind every headline."
        </p>
      </div>
    </div>
  );
}

export default HomePage;