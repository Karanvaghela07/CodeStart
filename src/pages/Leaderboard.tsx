import { useState } from "react";
import { Trophy, Flame, Zap, Medal } from "lucide-react";

const allPlayers = [
  { rank: 1, name: "KaranCodes", city: "Mumbai", xp: 15420, streak: 21, badge: "🏆" },
  { rank: 2, name: "PriyaDSA", city: "Delhi", xp: 14200, streak: 18, badge: "🥈" },
  { rank: 3, name: "ArjunJS", city: "Bangalore", xp: 13850, streak: 15, badge: "🥉" },
  { rank: 4, name: "NehaReact", city: "Pune", xp: 12100, streak: 12, badge: "" },
  { rank: 5, name: "RahulBug", city: "Hyderabad", xp: 11900, streak: 9, badge: "" },
  { rank: 6, name: "SnehaLoop", city: "Chennai", xp: 10750, streak: 7, badge: "" },
  { rank: 7, name: "VikramC++", city: "Mumbai", xp: 9800, streak: 5, badge: "" },
  { rank: 8, name: "AnanyaSQL", city: "Delhi", xp: 8650, streak: 4, badge: "" },
  { rank: 9, name: "RohanNode", city: "Bangalore", xp: 7400, streak: 3, badge: "" },
  { rank: 10, name: "TanyaPython", city: "Pune", xp: 6200, streak: 2, badge: "" },
];

const cities = ["All Cities", "Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Chennai"];

const podiumColors = ["bg-[#fde047]", "bg-white", "bg-[#fb923c]"];

export default function Leaderboard() {
  const [cityFilter, setCityFilter] = useState("All Cities");

  const filtered = cityFilter === "All Cities"
    ? allPlayers
    : allPlayers.filter((p) => p.city === cityFilter);

  const top3 = allPlayers.slice(0, 3);

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-[#1a1a2e] border-b-4 border-black px-6 py-14 text-center">
        <p className="text-sm font-black uppercase tracking-widest text-white/40 mb-3">Weekly Leaderboard</p>
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase leading-tight mb-4">
          Top Coders<br />This Week
        </h1>
        <p className="text-lg font-bold text-white/60 max-w-xl mx-auto">
          XP resets every Monday. Protect your streak, climb the ranks, get featured.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Podium */}
        <div className="flex items-end justify-center gap-4 mb-12">
          {[top3[1], top3[0], top3[2]].map((p, i) => {
            const heights = ["h-28", "h-36", "h-24"];
            const labels = ["2nd", "1st", "3rd"];
            return (
              <div key={p.rank} className="flex flex-col items-center gap-2">
                <span className="text-2xl">{p.badge || "🎖️"}</span>
                <span className="font-black text-black text-sm">{p.name}</span>
                <span className="font-bold text-black/60 text-xs">{p.xp.toLocaleString()} XP</span>
                <div className={`${podiumColors[i]} border-4 border-black w-20 ${heights[i]} flex items-center justify-center font-black text-2xl shadow-[4px_4px_0_0_#000]`}>
                  {labels[i]}
                </div>
              </div>
            );
          })}
        </div>

        {/* City filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          {cities.map((c) => (
            <button
              key={c}
              onClick={() => setCityFilter(c)}
              className={`font-black text-sm px-4 py-2 border-4 border-black shadow-[3px_3px_0_0_#000] transition-all hover:-translate-y-0.5
                ${cityFilter === c ? "bg-[#34d399]" : "bg-white"}`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="border-4 border-black shadow-[8px_8px_0_0_#000] overflow-hidden">
          <div className="bg-black text-white grid grid-cols-12 px-4 py-3 font-black text-xs uppercase tracking-widest">
            <span className="col-span-1">Rank</span>
            <span className="col-span-4">Player</span>
            <span className="col-span-3">City</span>
            <span className="col-span-2 flex items-center gap-1"><Flame className="w-3 h-3 text-[#fb923c]" /> Streak</span>
            <span className="col-span-2 text-right flex items-center justify-end gap-1"><Zap className="w-3 h-3 text-[#fde047]" /> XP</span>
          </div>
          {filtered.map((p, i) => (
            <div
              key={p.rank}
              className={`grid grid-cols-12 px-4 py-4 border-t-4 border-black font-bold text-sm items-center transition-all hover:-translate-x-1
                ${i === 0 ? "bg-[#fde047]" : i === 1 ? "bg-white" : i === 2 ? "bg-[#fb923c]/30" : "bg-white"}`}
            >
              <span className="col-span-1 font-black text-lg">{p.badge || "#" + p.rank}</span>
              <span className="col-span-4 font-black">{p.name}</span>
              <span className="col-span-3 text-black/60">{p.city}</span>
              <span className="col-span-2 flex items-center gap-1 text-[#fb923c] font-black">
                <Flame className="w-4 h-4" /> {p.streak}d
              </span>
              <span className="col-span-2 text-right font-black text-black">{p.xp.toLocaleString()}</span>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="px-4 py-10 text-center font-bold text-black/40">No players from {cityFilter} yet.</div>
          )}
        </div>

        {/* Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: <Zap className="w-5 h-5" />, title: "Earn XP", desc: "Complete topics, play games, use AI Explain — every action gives XP.", color: "bg-[#fde047]" },
            { icon: <Flame className="w-5 h-5" />, title: "Build Streaks", desc: "Log in and complete at least one activity daily to keep your streak alive.", color: "bg-[#f472b6]" },
            { icon: <Medal className="w-5 h-5" />, title: "Weekly Reset", desc: "Leaderboard resets every Monday. Top 3 get featured on the homepage.", color: "bg-[#34d399]" },
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
