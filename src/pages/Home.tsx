import { Rocket, Gamepad2, Bot, Map, Zap, Trophy, Code2, Brain } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: <Map className="w-7 h-7" />,
    title: "Start From Zero Roadmap",
    desc: "No confusion. Step-by-step path: Variables → Loops → Logic → DSA basics. Always know what's next.",
    color: "bg-[#fde047]",
  },
  {
    icon: <Gamepad2 className="w-7 h-7" />,
    title: "Coding Games",
    desc: '"Guess the Output", "Fix the Bug", "Complete the Code" — makes learning addictive, not boring.',
    color: "bg-[#34d399]",
  },
  {
    icon: <Zap className="w-7 h-7" />,
    title: "5-Minute Concepts",
    desc: "Simple explanation + real-life example + 2 practice questions. Zero long lectures.",
    color: "bg-[#c084fc]",
  },
  {
    icon: <Bot className="w-7 h-7" />,
    title: "AI Explain My Code",
    desc: "Paste any code → get a plain-English breakdown instantly. Your 11pm coding buddy.",
    color: "bg-[#38bdf8]",
  },
  {
    icon: <Trophy className="w-7 h-7" />,
    title: "Leaderboard & Streaks",
    desc: "Weekly XP resets, daily streaks, city-based rankings. Come back every day to protect your streak.",
    color: "bg-[#f472b6]",
  },
  {
    icon: <Brain className="w-7 h-7" />,
    title: "Logic Builder",
    desc: "Pattern problems, step-by-step thinking, visual explanations. Build the mindset, not just syntax.",
    color: "bg-[#fb923c]",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col bg-white">

      {/* Hero */}
      <div className="flex flex-col lg:flex-row border-b-2 border-black lg:min-h-[calc(100vh-80px)]">

        {/* Left — headline */}
        <div className="w-full lg:w-1/2 bg-[#34d399] p-8 lg:p-12 xl:p-16 flex flex-col justify-center border-b-2 lg:border-b-0 lg:border-r-2 border-black relative">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#000 2px, transparent 2px)", backgroundSize: "24px 24px" }}></div>

          <div className="relative z-10 max-w-xl xl:max-w-2xl">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 bg-black text-white font-bold text-sm px-4 py-2 mb-6 border-2 border-black shadow-[4px_4px_0_0_#fde047]">
              <Code2 className="w-4 h-4" /> For CSE Students Who Are Tired of Being Confused
            </div>

            <h1 className="text-[3.5rem] lg:text-[5rem] xl:text-[6rem] font-black text-black leading-[0.95] mb-6 uppercase tracking-tighter">
              Coding<br />Shouldn't<br />
              <span className="relative inline-block mt-2">
                <span className="absolute -inset-1 bg-black -rotate-1 rounded-sm"></span>
                <span className="relative z-10 text-[#34d399]">Be Scary.</span>
              </span>
            </h1>

            <p className="text-lg lg:text-xl font-bold text-black/80 mb-8 border-l-4 border-black pl-4 max-w-md">
              CodeStart turns coding into a game. Learn by playing, earn XP, beat the leaderboard — and actually understand what you're writing.
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <Link
                to="/roadmap"
                className="bg-[#fde047] px-6 py-3 lg:px-8 lg:py-4 border-4 border-black font-black text-lg lg:text-xl text-black shadow-[6px_6px_0_0_#000] hover:-translate-y-1 hover:shadow-[10px_10px_0_0_#000] transition-all flex items-center gap-3"
              >
                <Rocket className="w-5 h-5 lg:w-6 lg:h-6" /> Start From Zero
              </Link>
              <Link
                to="/games"
                className="bg-white border-4 border-black px-6 py-3 lg:px-8 lg:py-4 font-black text-lg lg:text-xl shadow-[6px_6px_0_0_#000] hover:-translate-y-1 transition-all flex items-center gap-3"
              >
                <Gamepad2 className="w-5 h-5" /> Play Games
              </Link>
            </div>
          </div>
        </div>

        {/* Right — visual */}
        <div className="w-full lg:w-1/2 bg-[#c084fc] relative flex items-center justify-center p-8 lg:p-12 min-h-[500px]">
          {/* Spinning star */}
          <div className="absolute top-10 right-10 animate-spin-slow opacity-80">
            <svg width="120" height="120" viewBox="0 0 100 100" fill="#fde047" stroke="black" strokeWidth="4">
              <path d="M50 0L64 36L100 50L64 64L50 100L36 64L0 50L36 36Z" />
            </svg>
          </div>

          <div className="relative w-full max-w-sm xl:max-w-md">
            {/* Fake editor */}
            <div className="bg-white border-4 border-black rounded-xl p-4 shadow-[12px_12px_0_0_#000] relative z-10 flex flex-col">
              <div className="flex gap-2 mb-4 border-b-4 border-black pb-4">
                <div className="w-4 h-4 rounded-full bg-[#f472b6] border-2 border-black"></div>
                <div className="w-4 h-4 rounded-full bg-[#fde047] border-2 border-black"></div>
                <div className="w-4 h-4 rounded-full bg-[#34d399] border-2 border-black"></div>
              </div>
              <div className="font-mono text-sm xl:text-base font-bold text-black flex-1 py-4">
                <span className="text-[#34d399]">// Guess the output 🤔</span><br />
                <span className="text-[#c084fc]">for</span> (<span className="text-[#f472b6]">let</span> i = <span className="text-[#fde047]">1</span>; i &lt;= <span className="text-[#fde047]">3</span>; i++) {"{"}<br />
                &nbsp;&nbsp;console.<span className="text-[#34d399]">log</span>(i * i);<br />
                {"}"}<br /><br />
                <span className="text-[#38bdf8]">// A) 1 2 3 &nbsp; B) 1 4 9</span>
              </div>
              <div className="absolute -bottom-6 -right-6 lg:-bottom-8 lg:-right-8 bg-[#38bdf8] border-4 border-black px-4 py-2 lg:px-6 lg:py-3 font-black text-xl lg:text-2xl shadow-[6px_6px_0_0_#000] rotate-3 text-white z-20 whitespace-nowrap">
                +150 XP! 🎯
              </div>
            </div>

            <div className="absolute -top-6 -left-6 lg:top-4 lg:-left-12 xl:-left-16 bg-white border-4 border-black px-4 py-2 font-bold text-sm lg:text-lg shadow-[6px_6px_0_0_#000] -rotate-6 z-20 whitespace-nowrap">
              AI Explains This 🤖
            </div>
          </div>
        </div>
      </div>

      {/* Stats banner */}
      <div className="bg-black text-white border-b-2 border-black py-6 px-6">
        <div className="flex flex-wrap lg:flex-nowrap justify-center gap-8 lg:gap-16 max-w-6xl mx-auto">
          {[
            { n: "50+", l: "Coding Games" },
            { n: "24/7", l: "AI Code Explainer" },
            { n: "XP", l: "Leaderboard & Streaks" },
            { n: "Free", l: "Start, No Credit Card" },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-4 hover:scale-105 transition-transform cursor-default">
              <div className="text-3xl lg:text-4xl font-black text-[#34d399]">{stat.n}</div>
              <div className="text-sm lg:text-base font-bold uppercase tracking-wider text-white/70 w-28 leading-tight">{stat.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Problem section */}
      <div className="bg-[#fde047] border-b-2 border-black py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-black uppercase tracking-widest mb-4 text-black/60">The Real Problem</p>
          <h2 className="text-4xl lg:text-5xl font-black text-black uppercase leading-tight mb-6">
            Students Don't Fail Because<br />Coding Is Hard.
          </h2>
          <p className="text-xl font-bold text-black/80 max-w-2xl mx-auto">
            They fail because they don't know where to start, tutorials are boring, and there's no one to ask at 11pm when they're stuck.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            {["No idea where to start", "Long boring lectures", "Complex explanations", "No one to ask for help"].map((pain, i) => (
              <div key={i} className="bg-white border-4 border-black px-5 py-3 font-black text-base shadow-[4px_4px_0_0_#000]">
                ❌ {pain}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features grid */}
      <div className="bg-white border-b-2 border-black py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm font-black uppercase tracking-widest mb-4 text-black/50 text-center">What Makes CodeStart Different</p>
          <h2 className="text-4xl lg:text-5xl font-black text-black uppercase text-center mb-12">
            Your Edge Over Everyone Else
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className={`${f.color} border-4 border-black p-6 shadow-[6px_6px_0_0_#000] hover:-translate-y-1 hover:shadow-[10px_10px_0_0_#000] transition-all`}>
                <div className="bg-white border-4 border-black w-14 h-14 flex items-center justify-center mb-4 shadow-[4px_4px_0_0_#000]">
                  {f.icon}
                </div>
                <h3 className="text-xl font-black text-black mb-2 uppercase">{f.title}</h3>
                <p className="text-black/80 font-bold text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-[#1a1a2e] border-b-2 border-black py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-black uppercase tracking-widest mb-4 text-white/40 text-center">Simple Process</p>
          <h2 className="text-4xl lg:text-5xl font-black text-white uppercase text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Pick Your Start Point", desc: "Total beginner? Start at Variables. Know some basics? Jump ahead. The roadmap adapts to you.", color: "bg-[#34d399]" },
              { step: "02", title: "Learn by Playing", desc: "Every concept comes with a game. Guess outputs, fix bugs, complete code — earn XP for every win.", color: "bg-[#e94560]" },
              { step: "03", title: "Track & Compete", desc: "Watch your XP grow, protect your daily streak, and climb the leaderboard against students in your city.", color: "bg-[#00d4ff]" },
            ].map((s, i) => (
              <div key={i} className={`${s.color} border-4 border-black p-6 shadow-[6px_6px_0_0_#fff]`}>
                <div className="text-6xl font-black text-black/20 mb-2">{s.step}</div>
                <h3 className="text-xl font-black text-black uppercase mb-2">{s.title}</h3>
                <p className="text-black/80 font-bold text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-[#e94560] border-b-2 border-black py-16 px-6 text-center">
        <h2 className="text-4xl lg:text-6xl font-black text-white uppercase leading-tight mb-4">
          Stop Being Afraid.<br />Start Writing Code.
        </h2>
        <p className="text-xl font-bold text-white/80 mb-10 max-w-xl mx-auto">
          Free to start. No credit card. Just you, some games, and a roadmap that actually makes sense.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/register"
            className="bg-[#fde047] px-8 py-4 border-4 border-black font-black text-xl text-black shadow-[6px_6px_0_0_#000] hover:-translate-y-1 hover:shadow-[10px_10px_0_0_#000] transition-all flex items-center gap-3"
          >
            <Rocket className="w-6 h-6" /> Start for Free
          </Link>
          <Link
            to="/learn"
            className="bg-white border-4 border-black px-8 py-4 font-black text-xl shadow-[6px_6px_0_0_#000] hover:-translate-y-1 transition-all"
          >
            Browse Topics
          </Link>
        </div>
      </div>

    </div>
  );
}
