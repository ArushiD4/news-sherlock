import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";

function HomePage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (input.trim().length < 50) {
      alert("Please enter a valid headline or claim (at least 50 chars) for accurate detection.");
      return;
    }

    setLoading(true);

    // 1. Retrieve User ID from Local Storage
    let userId = null;
    const storedUser = localStorage.getItem("user");
    
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        // Supports both 'id' (virtual) or '_id' (raw MongoDB)
        userId = userObj.id || userObj._id; 
      } catch (err) {
        console.error("Could not parse user data from local storage", err);
      }
    }

    try {
      // 2. Send Text AND User ID to Node.js Backend
      const response = await fetch("http://localhost:5000/api/news/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            text: input.trim(),
            userId: userId // ✅ Sending the ID to link history
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 3. Success: Navigate to Results
        navigate("/results", { 
          state: { 
            originalText: input, 
            verdict: data.verdict,
            confidence: data.confidence,
            reasons: data.reasons,
            recommendation: data.recommendation || '',
            apiUsed: data.apiUsed
          } 
        });
      } else {
        // 4. Server Error
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