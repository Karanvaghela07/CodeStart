import { useState, useRef, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LogOut, User, Zap, Flame, ChevronDown, Crown, Package,
  BookOpen, Gamepad2, Bot, Trophy, IndianRupee,
  Rocket, Star, Brain, BarChart2, Menu, X, Terminal
} from "lucide-react";
import Footer from "./components/Footer";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Home from "./pages/Home";
import Learn from "./pages/Learn";
import Games from "./pages/Games";
import AIExplain from "./pages/AIExplain";
import Leaderboard from "./pages/Leaderboard";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import Compiler from "./pages/Compiler";
import DSA from "./pages/DSA";
import Challenges from "./pages/Challenges";
import Flashcards from "./pages/Flashcards";

// ── Mega menu data ────────────────────────────────────────────────────────────
interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  desc: string;
  badge?: string;
  badgeColor?: string;
}

interface NavGroup {
  trigger: string;
  color: string;         // accent color for the dropdown header
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    trigger: "Learn",
    color: "bg-[#34d399]",
    items: [
      { to: "/dsa",          icon: <Brain className="w-5 h-5" />,    label: "DSA Guide",        desc: "Complete DSA — Arrays to DP, simply explained",    badge: "Full Course", badgeColor: "bg-[#fb923c]" },
      { to: "/learn",        icon: <BookOpen className="w-5 h-5" />, label: "5-Min Concepts",   desc: "Bite-sized lessons with real-life analogies" },
      { to: "/flashcards",   icon: <Star className="w-5 h-5" />,     label: "Flashcards",       desc: "25 cards — flip, drill, and lock in concepts",     badge: "Study", badgeColor: "bg-[#fde047]" },
      { to: "/compiler",     icon: <Terminal className="w-5 h-5" />, label: "Code Compiler",    desc: "Write & run code in 8 languages instantly",        badge: "New", badgeColor: "bg-[#e94560]" },
      { to: "/explain",      icon: <Bot className="w-5 h-5" />,      label: "AI Explain",       desc: "Paste code, get plain-English breakdown",          badge: "AI", badgeColor: "bg-[#c084fc]" },
    ],
  },
  {
    trigger: "Play",
    color: "bg-[#fde047]",
    items: [
      { to: "/challenges",  icon: <Rocket className="w-5 h-5" />,   label: "Daily Challenge",  desc: "One new coding problem every day, earn XP",        badge: "Daily", badgeColor: "bg-[#e94560]" },
      { to: "/games",       icon: <Gamepad2 className="w-5 h-5" />, label: "Coding Games",     desc: "6 games — Guess Output, Fix Bug, Sort, Memory",    badge: "Fun", badgeColor: "bg-[#fde047]" },
      { to: "/leaderboard", icon: <Trophy className="w-5 h-5" />,   label: "Leaderboard",      desc: "Weekly XP rankings and city-based filters" },
    ],
  },
  {
    trigger: "Explore",
    color: "bg-[#c084fc]",
    items: [
      { to: "/pricing", icon: <IndianRupee className="w-5 h-5" />, label: "Pricing",       desc: "Free, Pro ₹99/mo, Beginner Pack ₹149 one-time" },
      { to: "/profile", icon: <User className="w-5 h-5" />,        label: "My Profile",    desc: "XP, streak, roadmap progress and plan details" },
    ],
  },
];

// ── Dropdown panel ────────────────────────────────────────────────────────────
function DropdownPanel({ group, onClose }: { group: NavGroup; onClose: () => void }) {
  return (
    <div
      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[340px] bg-white border-4 border-black shadow-[8px_8px_0_0_#000] z-50
        animate-[dropIn_0.18s_cubic-bezier(0.34,1.56,0.64,1)_both]"
      style={{ transformOrigin: "top center" }}
    >
      {/* Colored header */}
      <div className={`${group.color} border-b-4 border-black px-4 py-2`}>
        <span className="font-black text-black text-xs uppercase tracking-widest">{group.trigger}</span>
      </div>
      {/* Items */}
      {group.items.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onClose}
          className="flex items-start gap-3 px-4 py-3 hover:bg-[#fde047] transition-colors border-b-2 last:border-b-0 border-black/10 group"
        >
          <div className="w-9 h-9 bg-black/5 border-2 border-black flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
            {item.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-black text-black text-sm">{item.label}</span>
              {item.badge && (
                <span className={`${item.badgeColor} border-2 border-black font-black text-[10px] px-1.5 py-0.5 leading-none`}>
                  {item.badge}
                </span>
              )}
            </div>
            <p className="font-bold text-black/50 text-xs mt-0.5 leading-snug">{item.desc}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

// ── Nav trigger item ──────────────────────────────────────────────────────────
function NavTrigger({ group, active }: { group: NavGroup; active: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setOpen(true);
  };
  const hide = () => {
    timerRef.current = setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      <button
        className={`flex items-center gap-1 font-bold text-sm xl:text-base text-black px-2 py-1 transition-all
          ${active || open ? "bg-[#fde047] border-2 border-black shadow-[2px_2px_0_0_#000]" : "hover:underline decoration-2 underline-offset-4"}`}
      >
        {group.trigger}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <DropdownPanel group={group} onClose={() => setOpen(false)} />}
    </div>
  );
}

function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!user) {
    return (
      <>
        <Link
          to="/login"
          className="hidden lg:block font-bold text-black border-2 border-transparent hover:border-black px-4 py-2 rounded-lg transition-all whitespace-nowrap"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-[#34d399] px-6 py-2.5 border-2 border-black rounded-lg font-bold text-black shadow-[4px_4px_0_0_#000] hover:translate-y-[2px] hover:translate-x-[2px] transition-transform hover:shadow-[2px_2px_0_0_#000] active:shadow-none whitespace-nowrap"
        >
          Sign Up Free
        </Link>
      </>
    );
  }

  const planLabel: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    free:  { label: "Free",          color: "bg-white border-black text-black",    icon: null },
    pro:   { label: "Pro",           color: "bg-[#fde047] border-black text-black", icon: <Crown className="w-3 h-3" /> },
    pack:  { label: "Beginner Pack", color: "bg-[#34d399] border-black text-black", icon: <Package className="w-3 h-3" /> },
  };
  const pl = planLabel[user.plan] ?? planLabel.free;

  const initials = user.username.slice(0, 2).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 border-4 border-black bg-[#fde047] px-3 py-2 font-black shadow-[4px_4px_0_0_#000] hover:-translate-y-0.5 transition-all"
      >
        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-black text-sm border-2 border-black">
          {initials}
        </div>
        <span className="hidden sm:block text-sm font-black text-black max-w-[100px] truncate">{user.username}</span>
        <ChevronDown className={`w-4 h-4 text-black transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white border-4 border-black shadow-[8px_8px_0_0_#000] z-50">
          {/* Profile header */}
          <div className="bg-[#1a1a2e] px-4 py-4 border-b-4 border-black">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#34d399] border-4 border-white flex items-center justify-center font-black text-black text-lg">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="font-black text-white text-sm">{user.username}</p>
                <p className="font-bold text-white/50 text-xs truncate">{user.email}</p>
                <div className={`inline-flex items-center gap-1 border-2 px-2 py-0.5 font-black text-xs mt-1 ${pl.color}`}>
                  {pl.icon} {pl.label}
                </div>
              </div>
            </div>
          </div>

          {/* Plan info */}
          {user.plan !== "free" && user.purchasedAt && (
            <div className="bg-[#34d399]/20 border-b-4 border-black px-4 py-2">
              <p className="font-bold text-black/60 text-xs">
                Active since {new Date(user.purchasedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 border-b-4 border-black">
            <div className="px-4 py-3 border-r-4 border-black flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#fde047]" />
              <div>
                <p className="font-black text-black text-sm">{user.xp}</p>
                <p className="font-bold text-black/50 text-xs">XP</p>
              </div>
            </div>
            <div className="px-4 py-3 flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#fb923c]" />
              <div>
                <p className="font-black text-black text-sm">{user.streak}</p>
                <p className="font-bold text-black/50 text-xs">Day Streak</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col">
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 font-bold text-sm text-black hover:bg-[#fde047] transition-colors border-b-2 border-black/10"
            >
              <User className="w-4 h-4" /> My Profile
            </Link>
            {user.plan === "free" && (
              <Link
                to="/pricing"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 font-bold text-sm text-black hover:bg-[#34d399] transition-colors border-b-2 border-black/10"
              >
                <Crown className="w-4 h-4" /> Upgrade to Pro
              </Link>
            )}
            <button
              onClick={() => { logout(); setOpen(false); navigate("/"); }}
              className="flex items-center gap-3 px-4 py-3 font-bold text-sm text-black hover:bg-[#f472b6] transition-colors w-full text-left"
            >
              <LogOut className="w-4 h-4" /> Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // check if any item in a group is active
  const groupActive = (group: NavGroup) =>
    group.items.some((i) => location.pathname === i.to);

  return (
    <>
      <nav className="w-full bg-white border-b-2 border-black px-6 py-4 flex items-center justify-between z-50 sticky top-0 h-[80px]">
        {/* Logo */}
        <div className="flex shrink-0 items-center justify-start lg:w-48">
          <Link
            to="/"
            className="text-2xl lg:text-3xl font-black tracking-tighter text-black hover:-translate-y-1 transition-transform"
          >
            CodeStart
          </Link>
        </div>

        {/* Desktop mega-menu triggers */}
        <div className="hidden lg:flex flex-1 items-center justify-center gap-1 xl:gap-2">
          {NAV_GROUPS.map((group) => (
            <NavTrigger key={group.trigger} group={group} active={groupActive(group)} />
          ))}
        </div>

        {/* Right side */}
        <div className="flex shrink-0 items-center justify-end gap-2 xl:gap-4 lg:w-48">
          <UserMenu />
          {/* Mobile hamburger */}
          <button
            className="lg:hidden border-4 border-black p-2 bg-white shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5 transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-[80px] z-40 bg-white border-t-4 border-black overflow-y-auto">
          {NAV_GROUPS.map((group) => (
            <div key={group.trigger}>
              <div className={`${group.color} border-b-4 border-black px-5 py-3`}>
                <span className="font-black text-black text-xs uppercase tracking-widest">{group.trigger}</span>
              </div>
              {group.items.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-5 py-4 border-b-2 border-black/10 font-bold text-black hover:bg-[#fde047] transition-colors
                    ${location.pathname === item.to ? "bg-[#fde047]" : ""}`}
                >
                  <div className="w-8 h-8 bg-black/5 border-2 border-black flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-black text-sm">{item.label}</p>
                    <p className="font-bold text-black/50 text-xs">{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function AppShell() {
  const location = useLocation();
  const hideFooter = location.pathname === "/dsa" || location.pathname === "/compiler";
  return (
    <div className="min-h-screen flex flex-col text-black bg-white font-sans selection:bg-[#fde047] selection:text-black">
      <Navbar />
      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/games" element={<Games />} />
          <Route path="/explain" element={<AIExplain />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/compiler" element={<Compiler />} />
          <Route path="/dsa" element={<DSA />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/flashcards" element={<Flashcards />} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppShell />
      </Router>
    </AuthProvider>
  );
}
