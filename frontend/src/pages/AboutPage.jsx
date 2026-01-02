import { Link } from "react-router-dom";
import bgImage from "../assets/images/bg.png";

const pillars = [
  {
    title: "News analysis",
    desc: "Detects misinformation through keyword patterns and fact checks",
    icon: "🔍",
  },
  {
    title: "Misinformation detection",
    desc: "Leverages the Google Fact Check API to identify and flag misinformation",
    icon: "🧭",
  },
  {
    title: "Transparent results",
    desc: "Every verdict comes with plain-language reasoning so you can judge credibility yourself.",
    icon: "✨",
  },
];

const steps = [
  { title: "Paste or drop a link", desc: "Add any article or headline—long or short." },
  { title: "We verify signals", desc: "Models cross-check claims, sources, and linguistic cues." },
  { title: "Get instant insight", desc: "See a credibility score." },
];

export default function AboutPage() {
  return (
    <div
      className="min-h-screen text-white_custom relative"
      style={{
        backgroundImage: `linear-gradient(rgba(7,17,36,0.85), rgba(7,17,36,0.85)), url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-16 space-y-16">
        {/* Hero */}
        <section className="grid md:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-white/70">
              About News Sherlock
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-lg">
            News Sherlock:<br />             Clarity in a world of Chaos.
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              News Sherlock is an automated verification platform designed to combat the spread of digital misinformation. 
              By leveraging the Google Fact Check API alongside  keyword analysis, it instantly flags suspicious articles and helps users distinguish credible journalism from fake news.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/detect"
                state={{ scrollToDetect: true }}
                className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-oxford_blue shadow-lg hover:scale-[1.02] transition-transform"
              >
                Try Detect
              </Link>
              <Link
                to="/"
                className="px-6 py-3 rounded-xl font-semibold border border-white/30 text-white_custom hover:bg-white/5 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </section>

        {/* Pillars */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">What makes News Sherlock different</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {pillars.map((card) => (
              <div
                key={card.title}
                className="bg-prussian_blue/70 border border-charcoal rounded-2xl p-6 shadow-xl hover:translate-y-[-4px] transition-transform"
              >
                <div className="text-2xl mb-3">{card.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                <p className="text-white/75 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">How it works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, idx) => (
              <div
                key={step.title}
                className="bg-oxford_blue/70 border border-yellow-500/20 rounded-2xl p-6 shadow-xl"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-lg font-bold">
                    {idx + 1}
                  </span>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                </div>
                <p className="text-white/75 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Commitment */}
        <section className="bg-black/30 border border-white/10 rounded-2xl p-8 shadow-xl space-y-4">
          <h2 className="text-3xl font-bold">Our commitment</h2>
          <p className="text-white/80 leading-relaxed">
            We believe trust is earned. That is why News Sherlock prioritizes transparency:
            models are benchmarked on open fact-check datasets, decisions are explainable, and
            no result is presented without its supporting signals. Use it to deepen your own
            judgment—not replace it.
          </p>
         
        </section>
      </div>
    </div>
  );
}
