import React from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App'
import LoginPage from "./pages/LoginPage.jsx"
import HomePage from "./pages/HomePage.jsx"
import ResultsPage from "./pages/ResultsPage.jsx"
import AboutPage from "./pages/AboutPage.jsx"
import DigestPage from "./pages/DigestPage.jsx"
import './index.css'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/detect" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/digest" element={<DigestPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);