import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Zap, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      if (result.ok) {
        navigate("/");
      } else {
        setError(result.error || "Login failed.");
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-[#38bdf8]">
      <div className="w-full max-w-md">
        <div className="bg-white border-4 border-black p-8 md:p-10 shadow-[12px_12px_0_0_#000] relative">
          <div className="absolute -top-5 -right-5 bg-[#fde047] border-4 border-black px-4 py-2 font-black text-sm shadow-[4px_4px_0_0_#000] rotate-3 uppercase">
            Welcome Back
          </div>

          <h1 className="text-4xl font-black text-black uppercase mb-1">Log In</h1>
          <p className="font-bold text-black/50 text-sm mb-8">
            Continue your streak. Don&apos;t break the chain.
          </p>

          {error && (
            <div className="flex items-center gap-2 bg-[#f472b6] border-4 border-black px-4 py-3 font-bold text-sm text-black mb-5 shadow-[3px_3px_0_0_#000]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="font-black text-sm uppercase tracking-widest text-black/60">
                Email
              </label>
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
              <label className="font-black text-sm uppercase tracking-widest text-black/60">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="border-4 border-black p-3 font-bold text-black outline-none focus:bg-[#fde047]/20 transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#34d399] border-4 border-black py-4 font-black text-xl text-black shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000] transition-all flex items-center justify-center gap-3 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                "Logging in..."
              ) : (
                <>
                  <span>Enter</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t-4 border-black text-center">
            <p className="font-bold text-black/60 text-sm">
              No account yet?{" "}
              <Link
                to="/register"
                className="text-black font-black underline decoration-4 underline-offset-4 hover:bg-[#fde047] transition-colors"
              >
                Sign up free
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-4 bg-[#1a1a2e] border-4 border-black px-5 py-3 flex items-center gap-3 shadow-[4px_4px_0_0_#000]">
          <Zap className="w-5 h-5 text-[#fde047] shrink-0" />
          <p className="font-bold text-white/70 text-sm">
            Log in daily to protect your streak and keep earning XP.
          </p>
        </div>
      </div>
    </div>
  );
}
