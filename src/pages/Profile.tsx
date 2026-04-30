import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Zap, Flame, Crown, Package, Trophy, BookOpen, Gamepad2,
  LogOut, ChevronRight, Check, Lock, AlertCircle, Edit2, X
} from "lucide-react";
import { useAuth, PlanType } from "../context/AuthContext";

// ── helpers ──────────────────────────────────────────────────────────────────
const PROGRESS_KEY = "codestart_roadmap";

function getRoadmapProgress(): Record<number, number[]> {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}"); }
  catch { return {}; }
}

const STAGE_LESSONS = 3; // each stage has 3 lessons
const TOTAL_STAGES = 6;
const TOTAL_LESSONS = TOTAL_STAGES * STAGE_LESSONS;

const planMeta: Record<PlanType, { label: string; color: string; textColor: string; icon: React.ReactNode; desc: string }> = {
  free: {
    label: "Free",
    color: "bg-white",
    textColor: "text-black",
    icon: null,
    desc: "Stages 1–3 unlocked · 2 games · 5 AI Explains/day",
  },
  pro: {
    label: "Pro",
    color: "bg-[#fde047]",
    textColor: "text-black",
    icon: <Crown className="w-4 h-4" />,
    desc: "All 6 stages · All games · Unlimited AI Explain · Monthly subscription",
  },
  pack: {
    label: "Beginner Pack",
    color: "bg-[#34d399]",
    textColor: "text-black",
    icon: <Package className="w-4 h-4" />,
    desc: "Everything in Pro · C from Zero · DSA Basics · Lifetime access",
  },
};

const stageNames: Record<number, string> = {
  1: "Variables & Data Types",
  2: "Conditions & Logic",
  3: "Loops",
  4: "Functions",
  5: "Arrays & Objects",
  6: "DSA Basics",
};

const stageColors: Record<number, string> = {
  1: "bg-[#34d399]", 2: "bg-[#fde047]", 3: "bg-[#c084fc]",
  4: "bg-[#38bdf8]", 5: "bg-[#f472b6]", 6: "bg-[#fb923c]",
};

// ── Edit username modal ───────────────────────────────────────────────────────
function EditUsernameModal({ current, onSave, onClose }: {
  current: string;
  onSave: (name: string) => void;
  onClose: () => void;
}) {
  const [val, setVal] = useState(current);
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!val.trim()) { setErr("Username cannot be empty."); return; }
    if (val.trim().length < 3) { setErr("At least 3 characters."); return; }
    onSave(val.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white border-4 border-black shadow-[12px_12px_0_0_#000] w-full max-w-sm">
        <div className="bg-[#fde047] border-b-4 border-black px-5 py-4 flex items-center justify-between">
          <span className="font-black text-black uppercase">Edit Username</span>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={submit} className="p-5 flex flex-col gap-4">
          {err && (
            <div className="flex items-center gap-2 bg-[#f472b6] border-4 border-black px-3 py-2 font-bold text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" /> {err}
            </div>
          )}
          <input
            value={val}
            onChange={e => { setVal(e.target.value); setErr(""); }}
            className="border-4 border-black p-3 font-bold text-black outline-none focus:bg-[#fde047]/20 transition-colors"
            placeholder="New username"
          />
          <button
            type="submit"
            className="bg-[#34d399] border-4 border-black py-3 font-black text-lg shadow-[4px_4px_0_0_#000] hover:-translate-y-0.5 transition-all"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Profile() {
  const { user, logout, upgradePlan } = useAuth();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);

  // We need to update username — add a local helper using localStorage directly
  // (AuthContext doesn't expose updateUsername, so we do it inline)
  const updateUsername = (newName: string) => {
    if (!user) return;
    const USERS_KEY = "codestart_users";
    const SESSION_KEY = "codestart_session";
    try {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
      const key = user.email.toLowerCase();
      if (users[key]) {
        users[key].user.username = newName;
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
      }
      const session = { ...user, username: newName };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      // Force page reload to reflect change
      window.location.reload();
    } catch { /* ignore */ }
  };

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-[#fde047]">
        <div className="bg-white border-4 border-black p-10 shadow-[12px_12px_0_0_#000] text-center max-w-md w-full">
          <Lock className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-3xl font-black uppercase mb-2">Not Logged In</h2>
          <p className="font-bold text-black/60 text-sm mb-6">You need an account to view your profile.</p>
          <Link to="/login" className="block bg-black text-white font-black text-lg py-3 border-4 border-black shadow-[4px_4px_0_0_#34d399] hover:-translate-y-0.5 transition-all">
            Log In
          </Link>
          <Link to="/register" className="block mt-3 font-bold text-black/60 text-sm hover:underline">
            Create a free account
          </Link>
        </div>
      </div>
    );
  }

  const progress = getRoadmapProgress();
  const completedLessons = Object.values(progress).reduce((a, arr) => a + arr.length, 0);
  const completedStages = Object.entries(progress).filter(([, arr]) => arr.length === STAGE_LESSONS).length;
  const totalXPFromRoadmap = Object.entries(progress).reduce((a, [id, arr]) => {
    const stageXP: Record<number, number> = { 1: 100, 2: 150, 3: 200, 4: 250, 5: 300, 6: 500 };
    const bonus = arr.length === STAGE_LESSONS ? (stageXP[Number(id)] ?? 0) : 0;
    return a + arr.length * 25 + bonus;
  }, 0);

  const initials = user.username.slice(0, 2).toUpperCase();
  const pm = planMeta[user.plan];
  const joinDate = new Date(user.joinedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const purchaseDate = user.purchasedAt
    ? new Date(user.purchasedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <div className="bg-white min-h-screen">
      {editOpen && (
        <EditUsernameModal
          current={user.username}
          onSave={(name) => { setEditOpen(false); updateUsername(name); }}
          onClose={() => setEditOpen(false)}
        />
      )}

      {/* Hero banner */}
      <div className="bg-[#1a1a2e] border-b-4 border-black px-6 py-14">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center md:items-end gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-full bg-[#34d399] border-4 border-white flex items-center justify-center font-black text-black text-4xl shadow-[6px_6px_0_0_#000]">
              {initials}
            </div>
            <div className={`absolute -bottom-2 -right-2 ${pm.color} border-4 border-black px-2 py-0.5 font-black text-xs flex items-center gap-1 shadow-[3px_3px_0_0_#000]`}>
              {pm.icon} {pm.label}
            </div>
          </div>

          {/* Name + meta */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <h1 className="text-4xl md:text-5xl font-black text-white uppercase">{user.username}</h1>
              <button
                onClick={() => setEditOpen(true)}
                className="bg-white/10 border-2 border-white/20 p-1.5 hover:bg-[#fde047] hover:border-[#fde047] transition-colors"
                title="Edit username"
              >
                <Edit2 className="w-4 h-4 text-white hover:text-black" />
              </button>
            </div>
            <p className="font-bold text-white/50 text-sm mt-1">{user.email}</p>
            <p className="font-bold text-white/30 text-xs mt-1">Member since {joinDate}</p>
          </div>

          {/* Quick stats */}
          <div className="flex gap-4 shrink-0">
            {[
              { icon: <Zap className="w-5 h-5 text-[#fde047]" />, val: user.xp, label: "XP" },
              { icon: <Flame className="w-5 h-5 text-[#fb923c]" />, val: user.streak, label: "Streak" },
              { icon: <Trophy className="w-5 h-5 text-[#34d399]" />, val: completedStages, label: "Stages" },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 border-2 border-white/20 px-4 py-3 text-center min-w-[70px]">
                <div className="flex justify-center mb-1">{s.icon}</div>
                <p className="font-black text-white text-xl">{s.val}</p>
                <p className="font-bold text-white/40 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left column */}
        <div className="flex flex-col gap-6">

          {/* Plan card */}
          <div className="border-4 border-black shadow-[6px_6px_0_0_#000]">
            <div className={`${pm.color} border-b-4 border-black px-5 py-3 flex items-center gap-2`}>
              {pm.icon}
              <span className="font-black text-black uppercase text-sm">Current Plan: {pm.label}</span>
            </div>
            <div className="bg-white px-5 py-4">
              <p className="font-bold text-black/60 text-sm leading-relaxed mb-3">{pm.desc}</p>
              {purchaseDate && (
                <p className="font-bold text-black/40 text-xs mb-3">Active since {purchaseDate}</p>
              )}
              {user.plan === "free" ? (
                <Link
                  to="/pricing"
                  className="block text-center bg-[#fde047] border-4 border-black font-black text-sm py-2 shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5 transition-all"
                >
                  Upgrade to Pro
                </Link>
              ) : (
                <div className="flex items-center gap-2 bg-[#34d399]/20 border-2 border-[#34d399] px-3 py-2 font-bold text-sm text-black">
                  <Check className="w-4 h-4 text-[#34d399]" /> Full access active
                </div>
              )}
            </div>
          </div>

          {/* Quick links */}
          <div className="border-4 border-black shadow-[6px_6px_0_0_#000]">
            <div className="bg-black text-white px-5 py-3 font-black text-sm uppercase tracking-widest">Quick Links</div>
            {[
              { to: "/roadmap", icon: <BookOpen className="w-4 h-4" />, label: "Continue Roadmap" },
              { to: "/games",   icon: <Gamepad2 className="w-4 h-4" />, label: "Play Games" },
              { to: "/leaderboard", icon: <Trophy className="w-4 h-4" />, label: "Leaderboard" },
              { to: "/pricing", icon: <Crown className="w-4 h-4" />,    label: "View Plans" },
            ].map((l, i) => (
              <Link
                key={i}
                to={l.to}
                className="flex items-center justify-between px-5 py-3 font-bold text-sm text-black hover:bg-[#fde047] transition-colors border-t-2 border-black/10"
              >
                <span className="flex items-center gap-2">{l.icon} {l.label}</span>
                <ChevronRight className="w-4 h-4 text-black/40" />
              </Link>
            ))}
          </div>

          {/* Danger zone */}
          <div className="border-4 border-black shadow-[6px_6px_0_0_#000]">
            <div className="bg-[#f472b6] border-b-4 border-black px-5 py-3 font-black text-black text-sm uppercase">Account</div>
            <div className="bg-white px-5 py-4">
              <button
                onClick={() => { logout(); navigate("/"); }}
                className="w-full flex items-center justify-center gap-2 bg-white border-4 border-black font-black text-sm py-3 shadow-[3px_3px_0_0_#000] hover:bg-[#f472b6] transition-colors"
              >
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* XP & stats overview */}
          <div className="border-4 border-black shadow-[6px_6px_0_0_#000]">
            <div className="bg-[#fde047] border-b-4 border-black px-5 py-3 font-black text-black uppercase text-sm">Your Stats</div>
            <div className="bg-white grid grid-cols-2 md:grid-cols-4">
              {[
                { label: "Total XP",       val: user.xp,              color: "text-[#fde047]",  bg: "bg-[#fde047]/10" },
                { label: "Day Streak",     val: user.streak,          color: "text-[#fb923c]",  bg: "bg-[#fb923c]/10" },
                { label: "Lessons Done",   val: completedLessons,     color: "text-[#34d399]",  bg: "bg-[#34d399]/10" },
                { label: "Stages Done",    val: `${completedStages}/${TOTAL_STAGES}`, color: "text-[#c084fc]", bg: "bg-[#c084fc]/10" },
              ].map((s, i) => (
                <div key={i} className={`${s.bg} border-r-2 last:border-r-0 border-black/10 px-5 py-5 text-center`}>
                  <p className={`font-black text-3xl ${s.color}`}>{s.val}</p>
                  <p className="font-bold text-black/50 text-xs mt-1 uppercase tracking-widest">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Roadmap progress */}
          <div className="border-4 border-black shadow-[6px_6px_0_0_#000]">
            <div className="bg-[#c084fc] border-b-4 border-black px-5 py-3 font-black text-black uppercase text-sm flex items-center justify-between">
              <span>Roadmap Progress</span>
              <span className="font-bold text-black/60 text-xs">{completedLessons}/{TOTAL_LESSONS} lessons</span>
            </div>
            <div className="bg-white px-5 py-4 flex flex-col gap-3">
              {/* Overall bar */}
              <div className="bg-black/10 border-2 border-black h-4 overflow-hidden mb-2">
                <div
                  className="h-full bg-[#34d399] transition-all duration-500"
                  style={{ width: `${TOTAL_LESSONS ? (completedLessons / TOTAL_LESSONS) * 100 : 0}%` }}
                />
              </div>
              {/* Per-stage rows */}
              {Array.from({ length: TOTAL_STAGES }, (_, i) => i + 1).map((id) => {
                const done = (progress[id] || []).length;
                const pct = Math.round((done / STAGE_LESSONS) * 100);
                const complete = done === STAGE_LESSONS;
                return (
                  <div key={id} className="flex items-center gap-3">
                    <div className={`${stageColors[id]} border-2 border-black w-6 h-6 flex items-center justify-center font-black text-xs shrink-0`}>
                      {complete ? <Check className="w-3 h-3" /> : id}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-black text-xs">{stageNames[id]}</span>
                        <span className="font-black text-black/50 text-xs">{done}/{STAGE_LESSONS}</span>
                      </div>
                      <div className="bg-black/10 border border-black/20 h-2 overflow-hidden">
                        <div className={`h-full ${stageColors[id]} transition-all`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
              <Link
                to="/roadmap"
                className="mt-2 inline-flex items-center gap-2 bg-black text-white font-black text-sm px-5 py-2 border-4 border-black shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5 transition-all w-fit"
              >
                Continue Learning <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* XP breakdown */}
          <div className="border-4 border-black shadow-[6px_6px_0_0_#000]">
            <div className="bg-[#38bdf8] border-b-4 border-black px-5 py-3 font-black text-black uppercase text-sm">XP Breakdown</div>
            <div className="bg-white px-5 py-4 flex flex-col gap-3">
              {[
                { label: "From roadmap lessons", val: completedLessons * 25, color: "bg-[#34d399]" },
                { label: "Stage completion bonuses", val: totalXPFromRoadmap - completedLessons * 25, color: "bg-[#fde047]" },
                { label: "Total XP on account", val: user.xp, color: "bg-[#c084fc]" },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between border-b-2 border-black/10 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 ${row.color} border-2 border-black`} />
                    <span className="font-bold text-black/70 text-sm">{row.label}</span>
                  </div>
                  <span className="font-black text-black text-sm flex items-center gap-1">
                    <Zap className="w-3 h-3 text-[#fde047]" /> {row.val}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
