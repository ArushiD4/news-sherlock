import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import { useNavigate } from "react-router-dom";

export default function HistoryPage() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      // 1. Get User ID
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;
      
      const userObj = JSON.parse(storedUser);
      const userId = userObj.id || userObj._id;

      try {
        // 2. Fetch Data from Backend
        const res = await fetch(`http://localhost:5000/api/news/history/${userId}`);
        const data = await res.json();
        setScans(data);
      } catch (err) {
        console.error("Failed to load history", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-oxford_blue text-white_custom">
      <Navbar />
      
      <div className="max-w-4xl mx-auto p-6 mt-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-[#d4af37]">Search History</h1>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : scans.length === 0 ? (
          <p className="text-center text-gray-400">No scans found. Go detect some news!</p>
        ) : (
          <div className="space-y-4">
            {scans.map((scan) => (
              <div 
                key={scan._id} 
                onClick={() => navigate("/results", { state: { ...scan, originalText: scan.articleText } })}
                className="bg-prussian_blue p-5 rounded-xl border border-charcoal hover:border-yellow-500 cursor-pointer transition-all hover:scale-[1.01]"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg line-clamp-1 w-3/4">{scan.articleText}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase
                    ${scan.verdict.includes("Fake") ? "bg-red-900 text-red-300" : "bg-green-900 text-green-300"}`}>
                    {scan.verdict}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  {new Date(scan.submittedAt).toLocaleDateString()} • {scan.apiUsed}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}