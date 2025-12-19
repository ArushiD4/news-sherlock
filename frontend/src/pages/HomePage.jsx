import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";

function HomePage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Basic URL validation
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidUrl(input)) {
      alert("Please enter a valid URL (e.g., https://www.bbc.com/news/...)");
      return;
    }

    setLoading(true);

    try {
      // 1. Send URL to Python Backend
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: input.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        // 2. Success: Navigate to Results with REAL data
        navigate("/results", { 
          state: { 
            url: input, 
            prediction: data.prediction, 
            excerpt: data.excerpt 
          } 
        });
      } else {
        // 3. Server Error (e.g. scraping failed)
        alert(data.error || "Analysis failed. Please try again.");
      }

    } catch (error) {
      console.error("Connection error:", error);
      alert("Could not connect to the server. Is python app.py running?");
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
            placeholder="Paste news article URL here..."
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
            {loading ? "Scanning..." : "Scan News"}
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