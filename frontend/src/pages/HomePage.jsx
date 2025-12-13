import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import bgImage from "../assets/images/bg.png";
import Navbar from "../components/navbar";

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [input, setInput] = useState("");

  // Reference to Detect section
  const detectSectionRef = useRef(null);

  // Scroll when coming from Navbar Detect
  useEffect(() => {
    if (location.state?.scrollToDetect) {
      detectSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  return (
    <div
      className="min-h-screen text-white_custom flex flex-col items-center px-4"
      style={{
        backgroundImage: `linear-gradient(rgba(7,17,36,0.55), rgba(7,17,36,0.55)), url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Navbar />
      
      {/* Header */}
      <header className="mt-12 text-center">
        <h1 className="text-5xl font-extrabold text-white_custom tracking-wide drop-shadow-lg">
          News Sherlock
        </h1>
        <p className="text-lg mt-3 text-white_custom max-w-xl mx-auto">
          Fact-check & bias analysis— detect misinformation instantly.
        </p>
      </header>

      {/* Main Content */}
      <main className="mt-16 w-full max-w-3xl flex flex-col items-center">
        {/* Card */}
        <div
          ref={detectSectionRef}
          className="w-full bg-prussian_blue p-8 rounded-2xl shadow-xl border border-charcoal"
        >
          <h2 className="text-2xl font-semibold mb-4">
            Paste Your News Article
          </h2>
          <textarea
            placeholder="Enter news content or URL here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-40 p-4 rounded-xl bg-oxford_blue text-white_custom border border-charcoal focus:outline-none focus:ring-2 focus:ring-white_custom/30"
          />

          {input.trim() === "" ? (
            <button
              disabled
              className="mt-6 w-full py-3 bg-white_custom text-oxford_blue font-bold rounded-xl opacity-60 cursor-not-allowed"
            >
              Analyze Now
            </button>
          ) : (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() =>
                  navigate("/results", {
                    state: { url: input.trim(), checkType: "fact" },
                  })
                }
                className="w-full py-3 bg-white_custom text-oxford_blue font-bold rounded-xl hover:bg-charcoal hover:text-white_custom transition-all duration-300 shadow-md"
              >
                Fact Check
              </button>

              <button
                onClick={() =>
                  navigate("/results", {
                    state: { url: input.trim(), checkType: "bias" },
                  })
                }
                className="w-full py-3 bg-transparent border border-white_custom text-white_custom font-bold rounded-xl hover:bg-white_custom/5 transition-all duration-300 shadow-md"
              >
                Bias Check
              </button>
            </div>
          )}
        </div>

        {/* Features Section */}
        <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <div className="bg-prussian_blue p-6 rounded-2xl shadow-md border border-charcoal text-center">
            <h3 className="text-xl font-semibold mb-2">Fake News Detection</h3>
            <p className="text-white_custom">
              AI model trained to detect misinformation patterns.
            </p>
          </div>
          <div className="bg-prussian_blue p-6 rounded-2xl shadow-md border border-charcoal text-center">
            <h3 className="text-xl font-semibold mb-2">Bias Analysis</h3>
            <p className="text-white_custom">
              Identify political or emotional bias in news text.
            </p>
          </div>
          <div className="bg-prussian_blue p-6 rounded-2xl shadow-md border border-charcoal text-center">
            <h3 className="text-xl font-semibold mb-2">Instant Insights</h3>
            <p className="text-white_custom">
              Get clear results in seconds with detailed scoring.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-20 mb-6 text-charcoal text-sm">
        © News Sherlock- Fake News Detection System
      </footer>
    </div>
  );
}
