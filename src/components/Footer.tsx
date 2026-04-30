import { Link } from "react-router-dom";
import { Code2, Gamepad2, BookOpen, Bot, Trophy, IndianRupee, Github, Twitter, Instagram } from "lucide-react";

const links = {
  Learn: [
    { label: "DSA Guide", to: "/dsa" },
    { label: "5-Min Concepts", to: "/learn" },
    { label: "Flashcards", to: "/flashcards" },
    { label: "AI Explain", to: "/explain" },
  ],
  Play: [
    { label: "Daily Challenge", to: "/challenges" },
    { label: "Coding Games", to: "/games" },
    { label: "Leaderboard", to: "/leaderboard" },
  ],
  Account: [
    { label: "Login", to: "/login" },
    { label: "Register", to: "/register" },
    { label: "Pricing", to: "/pricing" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t-4 border-black">
      {/* Top */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <Link to="/" className="text-3xl font-black tracking-tighter text-white flex items-center gap-2 mb-3">
            <Code2 className="w-7 h-7 text-[#34d399]" /> CodeStart
          </Link>
          <p className="text-white/60 font-bold text-sm leading-relaxed max-w-xs">
            Coding shouldn't be scary. Learn by playing, earn XP, and actually understand what you're writing — built for CSE students.
          </p>
          <div className="flex gap-3 mt-5">
            <a href="#" aria-label="Twitter" className="w-10 h-10 bg-white/10 border-2 border-white/20 flex items-center justify-center hover:bg-[#34d399] hover:border-[#34d399] transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" aria-label="Instagram" className="w-10 h-10 bg-white/10 border-2 border-white/20 flex items-center justify-center hover:bg-[#34d399] hover:border-[#34d399] transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" aria-label="GitHub" className="w-10 h-10 bg-white/10 border-2 border-white/20 flex items-center justify-center hover:bg-[#34d399] hover:border-[#34d399] transition-colors">
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(links).map(([section, items]) => (
          <div key={section}>
            <h4 className="font-black text-sm uppercase tracking-widest text-white/40 mb-4">{section}</h4>
            <ul className="flex flex-col gap-3">
              {items.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="font-bold text-white/80 hover:text-[#34d399] transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t-2 border-white/10 px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3 max-w-7xl mx-auto">
        <p className="text-white/40 text-sm font-bold">
          © {new Date().getFullYear()} CodeStart. Built for confused CSE students everywhere.
        </p>
        <div className="flex items-center gap-2 text-sm font-bold text-white/40">
          <IndianRupee className="w-4 h-4 text-[#34d399]" />
          Free to start · Pro from ₹99/month
        </div>
      </div>
    </footer>
  );
}
