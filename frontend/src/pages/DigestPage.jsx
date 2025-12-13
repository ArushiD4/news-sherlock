export default function DigestPage() {
  // Sample digest items (replace with API data later)
  const digestItems = [
    {
      title: "BBC News – Climate Report",
      verdict: "Credible",
      date: "2024-01-27",
    },
    {
      title: "Unverified Blog – Viral Claim",
      verdict: "Likely Fake",
      date: "2024-01-25",
    },
    {
      title: "Reuters – Market Update",
      verdict: "Credible",
      date: "2024-01-20",
    },
  ];

  return (
    <div className="min-h-screen bg-oxford_blue text-white_custom px-6 py-10 flex flex-col items-center">
      
      {/* Title */}
      <h2 className="text-4xl font-bold mb-6 tracking-wide">Your Digest</h2>
      <p className="text-charcoal text-lg mb-10 text-center max-w-xl">
        Summary of credible sources and previously analyzed articles.
      </p>

      {/* Digest List */}
      <div className="w-full max-w-3xl flex flex-col gap-6">
        {digestItems.map((item, index) => (
          <div
            key={index}
            className="bg-prussian_blue p-6 rounded-2xl shadow-xl border border-charcoal hover:bg-charcoal transition-all"
          >
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>

            <p className="text-white_custom mb-2">
              <strong>Verdict:</strong>{" "}
              <span
                className={
                  item.verdict === "Credible"
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                {item.verdict}
              </span>
            </p>

            <p className="text-charcoal text-sm">
              <strong>Date:</strong> {item.date}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}
