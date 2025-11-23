import { useLocation } from "react-router-dom";

export default function ResultsPage() {
  const location = useLocation();
  const { url, checkType } = location.state || {};

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>Analysis Results</h2>

      {url ? (
        <>
          <p><strong>URL:</strong> {url}</p>
          <p><strong>Type of Check:</strong> {checkType === "fact" ? "Fact Check" : "Bias Check"}</p>
          <p>(Analysis results will appear here...)</p>
        </>
      ) : (
        <p>No data provided. Please go back and submit a URL.</p>
      )}
    </div>
  );
}
