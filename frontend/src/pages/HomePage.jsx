import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-oxford_blue text-white flex flex-col items-center">
      
      {/* Header */}
      <h1 className="text-4xl font-bold mt-10">News Sherlock</h1>
      <p className="text-lg mt-2 text-charcoal">Fact-check & bias analysis in one click</p>

      {/* Card */}
      <div className="bg-prussian_blue mt-12 p-8 rounded-xl w-[90%] max-w-xl shadow-xl">
        <label className="block text-lg mb-2">Paste Article URL</label>
        <input
          type="text"
          placeholder="https://example.com/article"
          className="w-full p-3 rounded bg-eerie_black text-white outline-none focus:ring-2 focus:ring-charcoal"
        />

        {/* Select option */}
        <div className="mt-6">
          <label className="block text-lg mb-2">Choose Analysis Type</label>
          <select className="w-full p-3 rounded bg-eerie_black text-white">
            <option>Fact Check</option>
            <option>Bias Check</option>
            <option>Both</option>
          </select>
        </div>

        {/* Button */}
        <button className="w-full bg-charcoal hover:bg-oxford_blue transition p-3 rounded mt-8 font-semibold">
          Analyze
        </button>
      </div>
    </div>
  );
}
