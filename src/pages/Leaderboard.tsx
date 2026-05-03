import { useState } from "react";
import { Trophy, Flame, Zap, Medal, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const podiumColors = ["bg-[#c0c0c0]", "bg-[#fde047]", "bg-[#fb923c]"];
const podiumLabels = ["2nd", "1st", "3rd"];
const podiumHeights = ["h-28", "h-36", "h-24"];
const podiumBadges = ["🥈", "🏆", "🥉"];

export default function Leaderboard() {
  const { getAllUsers, user: currentUser } = useAuth();
  const [filter, setFilter] = useState<"all" | "top10">("all");

  // Get all real registered users, sorted by XP descending
  const allUsers = getAllUsers()
    .sort((a, b) => b.xp - a.xp)
    .map((u, i) => ({ ...u, rank: i + 1 }));

  const displayed = filter === "top10" ? allUsers.slice(0, 10) : allUsers;
  const top3 = allUsers.slice(0, 3);

  // Find current user's rank
  const myRank = currentUser
    ? allUsers.findIndex(u => u.email === currentUser.email) + 1
    : null;

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-[#1a1a2e] border-b-4 border-black px-6 py-14 text-center">
        <p className="text-sm font-black uppercase tracking-widest text-white/40 mb-3">Leaderboard</p>
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase leading-tight mb-4">
          Top Coders
        </h1>
        <p className="text-lg font-bold text-white/60 max-w-xl mx-auto">
          Real students, real XP. Every point earned by actually learning and playing.
        </p>
        {currentUser && myRank && (
          <div className="mt-6 inline-flex items-center gap-3 bg-[#fde047] border-4 border-black px-6 py-3 shadow-[4px_4px_0_0_#000]">
            <Trophy className="w-5 h-5 text-black" />
            <span className="font-black text-black">You are ranked #{myRank} with {currentUser.xp.toLocaleString()} XP</span>
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Empty state */}
        {allUsers.length === 0 && (
          <div className="text-center py-24 border-4 border-black shadow-[6px_6px_0_0_#000] bg-white">
            <p className="text-5xl mb-4">🏆</p>
            <h2 className="font-black text-black text-2xl uppercase mb-2">No Players Yet</h2>
            <p className="font-bold text-black/50 text-sm mb-6">Be the first! Register and start earning XP.</p>
            <Link
              to="/register"
              className="inline-block bg-[#34d399] border-4 border-black font-black px-8 py-3 shadow-[4px_4px_0_0_#000] hover:-translate-y-0.5 transition-all"
            >
              Register Now →
            </Link>
          </div>
        )}

        {/* Podium — only show if 3+ users */}
        {top3.length >= 3 && (
          <div className="flex items-end justify-center gap-4 mb-12">
            {[top3[1], top3[0], top3[2]].map((p, i) => (
              <div key={p.email} className="flex flex-col items-center gap-2">
                <span className="text-2xl">{podiumBadges[i]}</span>
                <span className={`font-black text-black text-sm ${p.email === currentUser?.email ? "underline decoration-[#34d399] decoration-2" : ""}`}>
                  {p.username}
                </span>
                <span className="font-bold text-black/60 text-xs">{p.xp.toLocaleString()} XP</span>
                <div className={`${podiumColors[i]} border-4 border-black w-20 ${podiumHeights[i]} flex items-center justify-center font-black text-2xl shadow-[4px_4px_0_0_#000]`}>
                  {podiumLabels[i]}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Filter */}
        {allUsers.length > 10 && (
          <div className="mb-6 flex gap-3">
            <button
              onClick={() => setFilter("all")}
              className={`font-black text-sm px-4 py-2 border-4 border-black shadow-[3px_3px_0_0_#000] transition-all hover:-translate-y-0.5 ${filter === "all" ? "bg-black text-white" : "bg-white text-black"}`}
            >
              All Players ({allUsers.length})
            </button>
            <button
              onClick={() => setFilter("top10")}
              className={`font-black text-sm px-4 py-2 border-4 border-black shadow-[3px_3px_0_0_#000] transition-all hover:-translate-y-0.5 ${filter === "top10" ? "bg-black text-white" : "bg-white text-black"}`}
            >
              Top 10
            </button>
          </div>
        )}

        {/* Table */}
        {allUsers.length > 0 && (
          <div className="border-4 border-black shadow-[8px_8px_0_0_#000] overflow-hidden">
            <div className="bg-black text-white grid grid-cols-12 px-4 py-3 font-black text-xs uppercase tracking-widest">
              <span className="col-span-1">#</span>
              <span className="col-span-5">Player</span>
              <span className="col-span-2 flex items-center gap-1"><Flame className="w-3 h-3 text-[#fb923c]" /> Streak</span>
              <span className="col-span-2">Challenges</span>
              <span className="col-span-2 text-right flex items-center justify-end gap-1"><Zap className="w-3 h-3 text-[#fde047]" /> XP</span>
            </div>
            {displayed.map((p, i) => {
              const isMe = p.email === currentUser?.email;
              return (
                <div
                  key={p.email}
                  className={`grid grid-cols-12 px-4 py-4 border-t-4 border-black font-bold text-sm items-center transition-all hover:-translate-x-1
                    ${isMe ? "bg-[#34d399]" : i === 0 ? "bg-[#fde047]" : i === 1 ? "bg-white" : i === 2 ? "bg-[#fb923c]/20" : "bg-white"}`}
                >
                  <span className="col-span-1 font-black text-lg">
                    {i === 0 ? "🏆" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${p.rank}`}
                  </span>
                  <span className="col-span-5 font-black flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center font-black text-xs border-2 border-black shrink-0">
                      {p.username.slice(0, 2).toUpperCase()}
                    </div>
                    {p.username}
                    {isMe && <span className="bg-black text-white font-black text-[10px] px-1.5 py-0.5">YOU</span>}
                  </span>
                  <span className="col-span-2 flex items-center gap-1 text-[#fb923c] font-black">
                    <Flame className="w-4 h-4" /> {p.streak}d
                  </span>
                  <span className="col-span-2 font-black text-black/70">
                    {(p.challengesDone ?? []).length}
                  </span>
                  <span className="col-span-2 text-right font-black text-black">{p.xp.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Not logged in prompt */}
        {!currentUser && allUsers.length > 0 && (
          <div className="mt-6 bg-[#fde047] border-4 border-black p-5 shadow-[4px_4px_0_0_#000] flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="font-black text-black">Want to appear on the leaderboard?</p>
              <p className="font-bold text-black/60 text-sm">Register and start earning XP — every game, challenge, and lesson counts.</p>
            </div>
            <Link to="/register" className="bg-black text-white font-black px-6 py-3 border-4 border-black shadow-[4px_4px_0_0_#000] hover:-translate-y-0.5 transition-all whitespace-nowrap">
              Join Now →
            </Link>
          </div>
        )}

        {/* Info cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: <Zap className="w-5 h-5" />, title: "Earn Real XP", desc: "Complete challenges, play games, finish DSA topics — every action gives real XP.", color: "bg-[#fde047]" },
            { icon: <Flame className="w-5 h-5" />, title: "Build Streaks", desc: "Do at least one activity daily to keep your streak alive and climb the ranks.", color: "bg-[#f472b6]" },
            { icon: <Medal className="w-5 h-5" />, title: "Real Rankings", desc: "Only real registered students appear here. No fake players, no bots.", color: "bg-[#34d399]" },
          ].map((item, i) => (
            <div key={i} className={`${item.color} border-4 border-black p-4 shadow-[4px_4px_0_0_#000]`}>
              <div className="flex items-center gap-2 font-black text-black mb-1">{item.icon} {item.title}</div>
              <p className="font-bold text-black/70 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
