import React from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import Navbar from "./components/navbar";
import Login from "./pages/LoginPage";       
import Register from "./pages/RegisterPage"; 
import HomePage from "./pages/HomePage";
import ResultsPage from "./pages/ResultsPage";
import AboutPage from "./pages/AboutPage";
import DigestPage from "./pages/DigestPage";
import HistoryPage from "./pages/HistoryPage";

function LandingScreen() {
  const navigate = useNavigate();

  const handleLoginRegister = () => navigate("/login");

  const handleDetect = () => {
    const token = localStorage.getItem("Token");

    if (token) {
      navigate("/detect", {state: { scrollToDetect: true }});
    } else {
      navigate("/login");
    }
  };


  return (
    <div
      className="min-h-screen bg-oxford_blue text-white_custom relative"
      style={{
        backgroundImage: `linear-gradient(rgba(7,17,36,0.55), rgba(7,17,36,0.55)), url(/src/assets/images/bg.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Navbar />

      <p className="absolute top-28 left-1/2 transform -translate-x-1/2 
                    text-center text-xl md:text-2xl font-semibold text-white_custom 
                    tracking-wide drop-shadow-md">
        "Unmask the truth behind every headline."
      </p>

      {/* DETECT button */}
      <button
        onClick={handleDetect}
        className="
          absolute left-1/2 top-[49%]
          transform -translate-x-[88%] -translate-y-1/2
          text-oxford_blue font-bold tracking-wide
          px-10 py-4 rounded-full
          bg-gradient-to-r from-[#d4af37] to-[#b8860b]
          shadow-[0_0_20px_rgba(212,175,55,0.4)]
          border border-yellow-500/70
          hover:shadow-[0_0_35px_rgba(212,175,55,0.8)]
          hover:scale-105
          hover:brightness-110
          transition-all duration-300
        "
      >
        DETECT
      </button>

      {/* LOGIN / REGISTER button */}
      <button
        onClick={handleLoginRegister}
        className="
          absolute bottom-12 left-1/2 
          transform -translate-x-1/2
          w-fit
          text-oxford_blue font-bold tracking-wide
          px-10 py-4 rounded-full
          bg-gradient-to-r from-[#d4af37] to-[#b8860b]
          shadow-[0_0_20px_rgba(212,175,55,0.4)]
          border border-yellow-500/70
          hover:shadow-[0_0_35px_rgba(212,175,55,0.8)]
          hover:scale-105
          hover:brightness-110
          transition-all duration-300
        "
      >
        LOGIN / REGISTER
      </button>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/detect" element={<HomePage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/digest" element={<DigestPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;