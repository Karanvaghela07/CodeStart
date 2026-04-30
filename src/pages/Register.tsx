import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Rocket, Check, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const perks = [
  "Free roadmap — Stages 1 to 3 unlocked",
  "2 games playable immediately",
  "5 AI Explain uses per day",
  "XP tracking + leaderboard access",
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const result = register(username, email, password);
      if (result.ok) {
        navigate("/");
      } else {
        setError(result.error || "Registration failed.");
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-[#f472b6]">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left — perks */}
        <div className="bg-[#1a1a2e] border-4 border-black p-8 shadow-[12px_12px_0_0_#000] flex flex-col justify-between">
          <div>
            <div className="inline-block bg-[#34d399] border-4 border-black px-4 py-2 font-black text-sm uppercase mb-6 shadow-[4px_4px_0_0_#000]">
              Free Forever
            </div>
            <h2 className="text-3xl font-black text-white uppercase leading-tight mb-4">
              Start coding.<br />No credit card.
            </h2>
            <p className="font-bold text-white/60 text-sm mb-8">
              Join thousands of CSE students who stopped being confused and started actually writing code.
            </p>
            <div className="flex flex-col gap-3">
              {perks.map((p, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="bg-[#34d399] border-2 border-white/20 w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-black" />
                  </div>
                  <span className="font-bold text-white/80 text-sm">{p}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 bg-white/5 border-2 border-white/10 px-4 py-3">
            <p className="font-bold text-white/40 text-xs">
              Already have an account?{" "}
              <Link to="/login" className="text-[#34d399] font-black hover:underline">Log in</Link>
            </p>
          </div>
        </div>

        {/* Right — form */}
        <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0_0_#000] relative">
          <div className="absolute -top-5 -left-5 bg-[#fde047] border-4 border-black px-4 py-2 font-black text-sm shadow-[4px_4px_0_0_#000] -rotate-3 uppercase">
            Level 1 Start
          </div>
          <h1 className="text-3xl font-black text-black uppercase mb-1">Create Account</h1>
          <p className="font-bold text-black/50 text-sm mb-6">Takes 30 seconds.</p>

          {error && (
            <div className="flex items-center gap-2 bg-[#f472b6] border-4 border-black px-4 py-3 font-bold text-sm text-black mb-5 shadow-[3px_3px_0_0_#000]">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="font-black text-xs uppercase tracking-widest text-black/60">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="coderKaran"
                className="border-4 border-black p-3 font-bold text-black outline-none focus:bg-[#fde047]/20 transition-colors"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-black text-xs uppercase tracking-widest text-black/60">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@codestart.in"
                className="border-4 border-black p-3 font-bold text-black outline-none focus:bg-[#fde047]/20 transition-colors"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-black text-xs uppercase tracking-widest text-black/60">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="min. 6 characters"
                className="border-4 border-black p-3 font-bold text-black outline-none focus:bg-[#fde047]/20 transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#fde047] border-4 border-black py-4 font-black text-xl text-black shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000] transition-all flex items-center justify-center gap-3 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : <><Rocket className="w-5 h-5" /> Create Account</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
