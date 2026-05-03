import { useState, useEffect, useRef } from "react";
import { Trophy, RotateCcw, Zap, CheckCircle2, XCircle, Timer, ArrowLeft, Lightbulb } from "lucide-react";
import { useAuth } from "../context/AuthContext";

// ─── Shared helpers ───────────────────────────────────────────────────────────
function BackBar({ title, score, total, color, onBack }: { title: string; score: number; total: number; color: string; onBack: () => void }) {
  return (
    <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
      <button onClick={onBack} className="flex items-center gap-2 font-black text-sm border-4 border-black px-4 py-2 bg-white shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5 transition-all">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <span className={`font-black text-sm ${color} border-4 border-black px-4 py-2 shadow-[3px_3px_0_0_#000]`}>{title} · {score}/{total}</span>
    </div>
  );
}

function ResultScreen({ emoji, title, score, total, xp, onReplay, onBack }: { emoji: string; title: string; score: number; total: number; xp: number; onReplay: () => void; onBack: () => void }) {
  const { addXP, updateStreak, incrementGamesPlayed, user } = useAuth();
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const msg = pct === 100 ? "Perfect score! You are a coding legend 🔥" : pct >= 70 ? "Great job! Keep it up 💪" : pct >= 40 ? "Not bad — try again to improve 📈" : "Keep practicing, you will get there! 🚀";
  const earned = score * xp;

  // Save XP exactly once when result screen mounts
  useEffect(() => {
    if (earned > 0 && user) {
      addXP(earned);
      updateStreak();
      incrementGamesPlayed();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 gap-5 text-center max-w-lg mx-auto">
      <div className="text-6xl">{emoji}</div>
      <Trophy className="w-12 h-12 text-[#fde047]" />
      <h2 className="text-4xl font-black text-black uppercase">{title}</h2>
      <p className="text-2xl font-black">{score}/{total} correct</p>
      <div className="bg-[#34d399] border-4 border-black px-6 py-3 font-black text-xl shadow-[4px_4px_0_0_#000]">+{earned} XP earned{user ? " & saved!" : " (login to save)"}</div>
      <p className="font-bold text-black/60 text-sm">{msg}</p>
      <div className="flex gap-4 flex-wrap justify-center">
        <button onClick={onReplay} className="bg-[#fde047] border-4 border-black font-black px-6 py-3 shadow-[4px_4px_0_0_#000] flex items-center gap-2 hover:-translate-y-0.5 transition-all"><RotateCcw className="w-4 h-4" /> Play Again</button>
        <button onClick={onBack} className="bg-white border-4 border-black font-black px-6 py-3 shadow-[4px_4px_0_0_#000] hover:-translate-y-0.5 transition-all">All Games</button>
      </div>
    </div>
  );
}

// ─── Main Games Page ──────────────────────────────────────────────────────────
type GameType = "guess" | "bug" | "complete" | "typing" | "sort" | "memory" | null;

const gameCards = [
  { id: "guess" as const,    emoji: "🤔", title: "Guess the Output",  desc: "Read code and pick what it prints. Trains mental code tracing — the #1 interview skill.", color: "bg-[#fde047]", xp: 150, difficulty: "Beginner",     count: "8 questions" },
  { id: "bug" as const,      emoji: "🐛", title: "Fix the Bug",       desc: "Broken code is shown. Find the mistake and pick the correct fix. Builds debugging instincts.", color: "bg-[#f472b6]", xp: 200, difficulty: "Beginner",     count: "8 questions" },
  { id: "complete" as const, emoji: "✏️", title: "Complete the Code", desc: "A code snippet has a blank. Fill it in correctly. Reinforces syntax and logic patterns.", color: "bg-[#38bdf8]", xp: 175, difficulty: "Beginner",     count: "8 questions" },
  { id: "typing" as const,   emoji: "⌨️", title: "Speed Typing",      desc: "Type the code exactly before the timer runs out. Builds muscle memory for real syntax.", color: "bg-[#c084fc]", xp: 160, difficulty: "Intermediate", count: "5 challenges" },
  { id: "sort" as const,     emoji: "📊", title: "Sort the Array",    desc: "Click bars to swap them and sort smallest to largest. Learn how sorting algorithms think.", color: "bg-[#fb923c]", xp: 200, difficulty: "Intermediate", count: "3 rounds" },
  { id: "memory" as const,   emoji: "🧠", title: "Memory Match",      desc: "Match coding terms to their definitions. Flip cards, find pairs, lock in the vocabulary.", color: "bg-[#34d399]", xp: 300, difficulty: "Beginner",     count: "6 pairs" },
];

export default function Games() {
  const [active, setActive] = useState<GameType>(null);

  if (active === "guess")    return <div className="bg-white min-h-screen"><GuessGame    onBack={() => setActive(null)} /></div>;
  if (active === "bug")      return <div className="bg-white min-h-screen"><BugGame      onBack={() => setActive(null)} /></div>;
  if (active === "complete") return <div className="bg-white min-h-screen"><CompleteGame onBack={() => setActive(null)} /></div>;
  if (active === "typing")   return <div className="bg-white min-h-screen"><TypingGame   onBack={() => setActive(null)} /></div>;
  if (active === "sort")     return <div className="bg-white min-h-screen"><SortGame     onBack={() => setActive(null)} /></div>;
  if (active === "memory")   return <div className="bg-white min-h-screen"><MemoryGame   onBack={() => setActive(null)} /></div>;

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-[#1a1a2e] border-b-4 border-black px-6 py-14 text-center">
        <p className="text-sm font-black uppercase tracking-widest text-white/40 mb-3">Coding Games</p>
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase leading-tight mb-4">Learn by<br />Playing.</h1>
        <p className="text-lg font-bold text-white/60 max-w-xl mx-auto mb-6">6 games designed to make coding concepts stick. Every correct answer earns XP toward your leaderboard rank.</p>
        <div className="flex flex-wrap justify-center gap-3">
          {["6 Games","Real Code","Earn XP","No Setup"].map((tag, i) => (
            <span key={i} className="bg-white/10 border-2 border-white/20 px-4 py-1 font-black text-white/70 text-sm">{tag}</span>
          ))}
        </div>
      </div>

      {/* Game grid */}
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gameCards.map(game => (
            <div key={game.id} className={`${game.color} border-4 border-black shadow-[8px_8px_0_0_#000] flex flex-col hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#000] transition-all`}>
              <div className="border-b-4 border-black px-6 py-4 flex items-center justify-between">
                <span className="text-3xl">{game.emoji}</span>
                <div className="flex items-center gap-2">
                  <span className="bg-white border-2 border-black font-black text-xs px-2 py-0.5">{game.difficulty}</span>
                  <span className="bg-black text-white font-black text-xs px-3 py-1 flex items-center gap-1"><Zap className="w-3 h-3" /> +{game.xp} XP</span>
                </div>
              </div>
              <div className="px-6 py-5 flex-1">
                <h2 className="text-xl font-black text-black uppercase mb-2">{game.title}</h2>
                <p className="font-bold text-black/70 text-sm leading-relaxed mb-3">{game.desc}</p>
                <p className="font-bold text-black/50 text-xs">{game.count}</p>
              </div>
              <div className="px-6 pb-6">
                <button onClick={() => setActive(game.id)} className="w-full bg-black text-white font-black text-base py-3 border-4 border-black shadow-[4px_4px_0_0_rgba(255,255,255,0.4)] hover:-translate-y-0.5 transition-all">
                  Play Now →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How XP works */}
      <div className="bg-[#fde047] border-t-4 border-black px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-black uppercase text-center mb-8">How XP Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "🎮", title: "Play a Game", desc: "Pick any game and start. Each correct answer earns XP instantly." },
              { icon: "⚡", title: "Earn XP", desc: "XP is added to your account. Speed bonuses apply in the typing game." },
              { icon: "🏆", title: "Climb the Leaderboard", desc: "Your XP builds your weekly rank. Top 3 get featured on the homepage." },
            ].map((item, i) => (
              <div key={i} className="bg-white border-4 border-black p-5 shadow-[4px_4px_0_0_#000]">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-black text-black uppercase mb-2">{item.title}</h3>
                <p className="font-bold text-black/60 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-black border-t-4 border-black px-6 py-6">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-8">
          {[{ n: "6", l: "Unique Games" }, { n: "33+", l: "Questions" }, { n: "XP", l: "Per Correct Answer" }, { n: "∞", l: "Replays" }].map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-3xl font-black text-[#34d399]">{s.n}</span>
              <span className="font-bold text-white/50 text-sm uppercase tracking-wide">{s.l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
const typingChallenges = [
  { label: "Print Hello World", target: 'console.log("Hello World");', xp: 100 },
  { label: "Declare a variable", target: "let score = 0;", xp: 80 },
  { label: "Write a for loop", target: "for (let i = 0; i < 5; i++) {}", xp: 150 },
  { label: "Write an if statement", target: "if (x > 10) { console.log(x); }", xp: 130 },
  { label: "Define a function", target: "function add(a, b) { return a + b; }", xp: 160 },
];

function TypingGame({ onBack }: { onBack: () => void }) {
  const { addXP, updateStreak, incrementGamesPlayed, user } = useAuth();
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [done, setDone] = useState(false);
  const [won, setWon] = useState(false);
  const [totalXP, setTotalXP] = useState(0);
  const [xpSaved, setXpSaved] = useState(false);
  const [started, setStarted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const ch = typingChallenges[idx];

  useEffect(() => {
    if (!started || done) return;
    if (timeLeft <= 0) { setDone(true); setWon(false); return; }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, started, done]);

  // Save XP once when game ends
  useEffect(() => {
    if (done && !xpSaved && totalXP > 0 && user) {
      addXP(totalXP);
      updateStreak();
      incrementGamesPlayed();
      setXpSaved(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const handleType = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTyped(val);
    if (val === ch.target) {
      const bonus = Math.round(ch.xp * (timeLeft / 30));
      setTotalXP(x => x + bonus);
      if (idx + 1 >= typingChallenges.length) { setDone(true); setWon(true); }
      else { setIdx(i => i + 1); setTyped(""); setTimeLeft(30); }
    }
  };

  const reset = () => { setIdx(0); setTyped(""); setTimeLeft(30); setDone(false); setWon(false); setTotalXP(0); setXpSaved(false); setStarted(false); };

  if (done) return (
    <div className="flex flex-col items-center justify-center py-16 px-4 gap-5 text-center max-w-lg mx-auto">
      <div className="text-6xl">{won ? "⌨️" : "⏰"}</div>
      <Trophy className="w-12 h-12 text-[#fde047]" />
      <h2 className="text-4xl font-black text-black uppercase">{won ? "Speed Coder!" : "Time is Up!"}</h2>
      <p className="text-xl font-black">{idx}/{typingChallenges.length} challenges done</p>
      <div className="bg-[#34d399] border-4 border-black px-6 py-3 font-black text-xl shadow-[4px_4px_0_0_#000]">+{totalXP} XP earned{user ? " & saved!" : " (login to save)"}</div>
      <div className="flex gap-4 flex-wrap justify-center">
        <button onClick={reset} className="bg-[#fde047] border-4 border-black font-black px-6 py-3 shadow-[4px_4px_0_0_#000] flex items-center gap-2 hover:-translate-y-0.5 transition-all"><RotateCcw className="w-4 h-4" /> Try Again</button>
        <button onClick={onBack} className="bg-white border-4 border-black font-black px-6 py-3 shadow-[4px_4px_0_0_#000] hover:-translate-y-0.5 transition-all">All Games</button>
      </div>
    </div>
  );

  if (!started) return (
    <div className="max-w-2xl mx-auto py-8 px-4 text-center">
      <BackBar title="Speed Typing" score={idx} total={typingChallenges.length} color="bg-[#c084fc]" onBack={onBack} />
      <div className="text-6xl mb-4">⌨️</div>
      <h2 className="text-3xl font-black text-black uppercase mb-3">Speed Typing Challenge</h2>
      <p className="font-bold text-black/60 mb-6 max-w-sm mx-auto">Type the code exactly as shown before the 30-second timer runs out. Speed bonus XP for finishing fast!</p>
      <button onClick={() => { setStarted(true); setTimeout(() => inputRef.current?.focus(), 100); }}
        className="bg-[#c084fc] border-4 border-black font-black text-xl px-8 py-4 shadow-[4px_4px_0_0_#000] hover:-translate-y-0.5 transition-all">
        Start Typing!
      </button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <BackBar title="Speed Typing" score={idx} total={typingChallenges.length} color="bg-[#c084fc]" onBack={onBack} />
      <div className="flex items-center justify-between mb-4">
        <span className="font-black text-sm bg-[#c084fc] border-4 border-black px-3 py-1">Challenge {idx + 1}/{typingChallenges.length}</span>
        <div className={`font-black text-xl border-4 border-black px-4 py-1 ${timeLeft <= 10 ? "bg-[#f472b6] animate-pulse" : "bg-white"}`}>
          {timeLeft}s
        </div>
      </div>
      <div className="bg-[#1a1a2e] border-4 border-black p-5 mb-4 shadow-[6px_6px_0_0_#000]">
        <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-2">{ch.label}</p>
        <p className="font-mono text-base text-white leading-relaxed break-all">
          {ch.target.split("").map((char, i) => (
            <span key={i} className={i < typed.length ? (typed[i] === char ? "text-[#34d399]" : "text-[#f472b6] bg-[#f472b6]/20") : i === typed.length ? "text-white underline" : "text-white/40"}>{char}</span>
          ))}
        </p>
      </div>
      <input ref={inputRef} value={typed} onChange={handleType}
        className="w-full border-4 border-black p-4 font-mono text-base outline-none focus:border-[#c084fc] transition-colors bg-white"
        placeholder="Start typing here..." autoComplete="off" spellCheck={false} />
      <div className="flex items-center justify-between mt-3">
        <span className="font-bold text-black/50 text-sm">+{ch.xp} XP on completion</span>
        <span className="font-bold text-black/50 text-sm">Total: +{totalXP} XP</span>
      </div>
    </div>
  );
}

// ─── Game 5: Sort the Array ───────────────────────────────────────────────────
function SortGame({ onBack }: { onBack: () => void }) {
  const { addXP, updateStreak, incrementGamesPlayed, user } = useAuth();
  const makeArr = () => Array.from({ length: 6 }, () => Math.floor(Math.random() * 80) + 15);
  const [arr, setArr] = useState(makeArr);
  const [selected, setSelected] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [round, setRound] = useState(1);
  const [totalXP, setTotalXP] = useState(0);
  const [xpSaved, setXpSaved] = useState(false);

  const isSorted = (a: number[]) => a.every((v, i) => i === 0 || a[i - 1] <= v);

  const handleClick = (i: number) => {
    if (won) return;
    if (selected === null) { setSelected(i); return; }
    if (selected === i) { setSelected(null); return; }
    const newArr = [...arr];
    [newArr[selected], newArr[i]] = [newArr[i], newArr[selected]];
    setArr(newArr);
    setMoves(m => m + 1);
    setSelected(null);
    if (isSorted(newArr)) {
      const xp = Math.max(50, 200 - moves * 10);
      setTotalXP(x => x + xp);
      setWon(true);
    }
  };

  const nextRound = () => { setArr(makeArr()); setSelected(null); setMoves(0); setWon(false); setRound(r => r + 1); };
  const reset = () => { setArr(makeArr()); setSelected(null); setMoves(0); setWon(false); setRound(1); setTotalXP(0); setXpSaved(false); };
  const maxVal = Math.max(...arr);

  // Save XP when all 3 rounds done
  const allDone = round >= 3 && won;
  useEffect(() => {
    if (allDone && !xpSaved && totalXP > 0 && user) {
      addXP(totalXP);
      updateStreak();
      incrementGamesPlayed();
      setXpSaved(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDone]);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <BackBar title="Sort the Array" score={round - 1} total={3} color="bg-[#fb923c]" onBack={onBack} />
      <div className="bg-[#1a1a2e] border-4 border-black p-4 mb-5 shadow-[4px_4px_0_0_#000]">
        <p className="font-bold text-white/70 text-sm">Click two bars to swap them. Sort all bars from smallest to largest. Fewer swaps = more XP!</p>
      </div>
      <div className="flex items-end justify-center gap-3 h-52 mb-4 bg-white border-4 border-black p-4 shadow-[4px_4px_0_0_#000]">
        {arr.map((val, i) => (
          <button key={i} onClick={() => handleClick(i)}
            className={`flex flex-col items-center justify-end transition-all hover:-translate-y-1 ${selected === i ? "opacity-60 scale-95" : ""}`}
            style={{ width: "14%" }}>
            <span className="font-black text-xs mb-1 text-black">{val}</span>
            <div className={`w-full border-4 border-black transition-all ${selected === i ? "bg-[#fde047]" : won ? "bg-[#34d399]" : "bg-[#38bdf8]"}`}
              style={{ height: `${(val / maxVal) * 150}px` }} />
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <span className="font-black text-sm">Moves: {moves}</span>
        <span className="font-black text-sm">Round {round}/3</span>
        <span className="font-black text-sm text-[#34d399]">+{totalXP} XP</span>
      </div>
      {won && (
        <div className="bg-[#34d399] border-4 border-black p-4 text-center shadow-[4px_4px_0_0_#000] mb-4">
          <p className="font-black text-black text-lg">Sorted in {moves} moves!</p>
          {round < 3
            ? <button onClick={nextRound} className="mt-3 bg-black text-white font-black px-6 py-2 border-4 border-black shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5 transition-all">Next Round →</button>
            : <div className="mt-3 flex gap-3 justify-center flex-wrap">
                <p className="font-black text-black w-full">All 3 rounds done! Total: +{totalXP} XP</p>
                <button onClick={reset} className="bg-[#fde047] border-4 border-black font-black px-5 py-2 shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5 transition-all flex items-center gap-2"><RotateCcw className="w-4 h-4" /> Play Again</button>
                <button onClick={onBack} className="bg-white border-4 border-black font-black px-5 py-2 shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5 transition-all">All Games</button>
              </div>}
        </div>
      )}
      {!won && <p className="text-center font-bold text-black/50 text-sm">{selected !== null ? "Now click another bar to swap" : "Click a bar to select it"}</p>}
    </div>
  );
}

// ─── Game 6: Memory Match ─────────────────────────────────────────────────────
const memoryPairs = [
  { term: "Array",    def: "Stores multiple values in one variable" },
  { term: "Loop",     def: "Repeats a block of code multiple times" },
  { term: "Function", def: "Reusable block of code with a name" },
  { term: "Variable", def: "Named container that stores a value" },
  { term: "if/else",  def: "Makes decisions based on a condition" },
  { term: "Object",   def: "Stores key-value pairs" },
];

type MemCard = { id: number; text: string; type: "term" | "def"; pairId: number; matched: boolean };

function MemoryGame({ onBack }: { onBack: () => void }) {
  const { addXP, updateStreak, incrementGamesPlayed, user } = useAuth();
  const makeCards = (): MemCard[] => {
    const cards: MemCard[] = [];
    memoryPairs.forEach((p, i) => {
      cards.push({ id: i * 2,     text: p.term, type: "term", pairId: i, matched: false });
      cards.push({ id: i * 2 + 1, text: p.def,  type: "def",  pairId: i, matched: false });
    });
    return cards.sort(() => Math.random() - 0.5);
  };

  const [cards, setCards] = useState<MemCard[]>(makeCards);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [done, setDone] = useState(false);
  const [xpSaved, setXpSaved] = useState(false);

  const flip = (id: number) => {
    const card = cards.find(c => c.id === id);
    if (!card || card.matched || flipped.includes(id) || flipped.length === 2) return;
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [a, b] = newFlipped.map(fid => cards.find(c => c.id === fid)!);
      if (a.pairId === b.pairId && a.type !== b.type) {
        const updated = cards.map(c => c.pairId === a.pairId ? { ...c, matched: true } : c);
        setCards(updated);
        setFlipped([]);
        if (updated.every(c => c.matched)) setDone(true);
      } else {
        setTimeout(() => setFlipped([]), 900);
      }
    }
  };

  const reset = () => { setCards(makeCards()); setFlipped([]); setMoves(0); setDone(false); setXpSaved(false); };
  const xp = Math.max(50, 300 - moves * 10);

  // Save XP once when done
  useEffect(() => {
    if (done && !xpSaved && xp > 0 && user) {
      addXP(xp);
      updateStreak();
      incrementGamesPlayed();
      setXpSaved(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  if (done) return (
    <div className="flex flex-col items-center justify-center py-16 px-4 gap-5 text-center max-w-lg mx-auto">
      <div className="text-6xl">🧠</div>
      <Trophy className="w-12 h-12 text-[#fde047]" />
      <h2 className="text-4xl font-black text-black uppercase">All Matched!</h2>
      <p className="text-xl font-black">{moves} moves</p>
      <div className="bg-[#34d399] border-4 border-black px-6 py-3 font-black text-xl shadow-[4px_4px_0_0_#000]">+{xp} XP earned{user ? " & saved!" : " (login to save)"}</div>
      <div className="flex gap-4 flex-wrap justify-center">
        <button onClick={reset} className="bg-[#fde047] border-4 border-black font-black px-6 py-3 shadow-[4px_4px_0_0_#000] flex items-center gap-2 hover:-translate-y-0.5 transition-all"><RotateCcw className="w-4 h-4" /> Play Again</button>
        <button onClick={onBack} className="bg-white border-4 border-black font-black px-6 py-3 shadow-[4px_4px_0_0_#000] hover:-translate-y-0.5 transition-all">All Games</button>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <BackBar title="Memory Match" score={cards.filter(c => c.matched).length / 2} total={memoryPairs.length} color="bg-[#34d399]" onBack={onBack} />
      <div className="bg-[#1a1a2e] border-4 border-black p-4 mb-5 shadow-[4px_4px_0_0_#000]">
        <p className="font-bold text-white/70 text-sm">Match each coding term with its definition. Click two cards — if they match, they stay revealed!</p>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
        {cards.map(card => {
          const isFlipped = flipped.includes(card.id) || card.matched;
          return (
            <button key={card.id} onClick={() => flip(card.id)}
              className={`border-4 border-black p-3 min-h-[80px] font-bold text-xs text-center transition-all shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5
                ${card.matched ? "bg-[#34d399] cursor-default" : isFlipped ? (card.type === "term" ? "bg-[#fde047]" : "bg-[#38bdf8]") : "bg-[#1a1a2e] text-[#1a1a2e]"}`}>
              {isFlipped ? card.text : "?"}
            </button>
          );
        })}
      </div>
      <p className="text-center font-bold text-black/50 text-sm">Moves: {moves} · Matched: {cards.filter(c => c.matched).length / 2}/{memoryPairs.length}</p>
    </div>
  );
}
const guessQs = [
  { code: "let x = 5;\nx = x + 3;\nconsole.log(x);", options: ["5","3","8","53"], answer: 2, exp: "x starts at 5, then 5+3 = 8." },
  { code: "for (let i = 0; i < 3; i++) {\n  console.log(i);\n}", options: ["1 2 3","0 1 2","0 1 2 3","1 2"], answer: 1, exp: "i starts at 0, runs while i < 3, so prints 0, 1, 2." },
  { code: "console.log(2 ** 10);", options: ["20","100","1024","512"], answer: 2, exp: "** is the power operator. 2^10 = 1024." },
  { code: "let arr = [1,2,3];\nconsole.log(arr.length);", options: ["2","3","4","0"], answer: 1, exp: "arr has 3 elements so .length is 3." },
  { code: "console.log(10 % 3);", options: ["3","1","0","7"], answer: 1, exp: "% is modulo — remainder of 10 divided by 3 = 1." },
  { code: "let s = \"hello\";\nconsole.log(s.toUpperCase());", options: ["hello","HELLO","Hello","undefined"], answer: 1, exp: ".toUpperCase() converts all letters to uppercase." },
  { code: "console.log(Boolean(0));", options: ["true","false","0","null"], answer: 1, exp: "0 is falsy in JavaScript, so Boolean(0) = false." },
  { code: "let a = [1,2,3];\na.push(4);\nconsole.log(a[3]);", options: ["3","undefined","4","1"], answer: 2, exp: ".push(4) adds 4 at index 3 (zero-indexed)." },
];

function GuessGame({ onBack }: { onBack: () => void }) {
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = guessQs[idx];
  const pick = (i: number) => { if (sel !== null) return; setSel(i); if (i === q.answer) setScore(s => s + 1); };
  const next = () => { if (idx + 1 >= guessQs.length) { setDone(true); return; } setIdx(i => i + 1); setSel(null); };
  const reset = () => { setIdx(0); setSel(null); setScore(0); setDone(false); };
  if (done) return <ResultScreen emoji="🤔" title="Round Over!" score={score} total={guessQs.length} xp={150} onReplay={reset} onBack={onBack} />;
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <BackBar title="Guess the Output" score={score} total={guessQs.length} color="bg-[#fde047]" onBack={onBack} />
      <div className="bg-[#1a1a2e] border-4 border-black p-6 mb-5 shadow-[6px_6px_0_0_#000]">
        <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-3 flex items-center gap-2"><Timer className="w-4 h-4" /> What does this print?</p>
        <pre className="font-mono text-[#34d399] text-sm leading-relaxed whitespace-pre">{q.code}</pre>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {q.options.map((opt, i) => (
          <button key={i} onClick={() => pick(i)} className={`border-4 border-black font-black text-lg py-4 shadow-[4px_4px_0_0_#000] transition-all ${sel === null ? "bg-white hover:-translate-y-0.5" : i === q.answer ? "bg-[#34d399]" : sel === i ? "bg-[#f472b6]" : "bg-white opacity-40"}`}>{opt}</button>
        ))}
      </div>
      {sel !== null && (
        <>
          <div className={`border-4 border-black p-4 font-bold text-sm mb-4 flex items-center gap-2 ${sel === q.answer ? "bg-[#34d399]" : "bg-[#f472b6]"}`}>
            {sel === q.answer ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />} {q.exp}
          </div>
          <button onClick={next} className="w-full bg-black text-white font-black text-lg py-3 border-4 border-black shadow-[4px_4px_0_0_#34d399] hover:-translate-y-0.5 transition-all">{idx + 1 >= guessQs.length ? "See Results" : "Next →"}</button>
        </>
      )}
    </div>
  );
}

// ─── Game 2: Fix the Bug ──────────────────────────────────────────────────────
const bugQs = [
  { broken: "for (let i = 0; i <= 3 i++) {\n  console.log(i);\n}", hint: "Look at the for loop syntax.", options: ["Missing ; after i <= 3","i should start at 1","console.log is wrong","i++ should be i--"], answer: 0 },
  { broken: "function add(a, b {\n  return a + b;\n}", hint: "Check the function parameters.", options: ["return should be print","Missing ) after b","function should be func","a + b should be a - b"], answer: 1 },
  { broken: "let name = Karan;\nconsole.log(name);", hint: "How should text values be written?", options: ["name is reserved","console.log is wrong","String needs quotes: \"Karan\"","let should be var"], answer: 2 },
  { broken: "let arr = [1, 2, 3]\nconsole.log(arr[3]);", hint: "Arrays are zero-indexed.", options: ["arr[3] should be arr[2]","Missing semicolon","arr is undefined","console.log is wrong"], answer: 0 },
  { broken: "if x > 5 {\n  console.log(\"big\");\n}", hint: "if statements need something around the condition.", options: ["Missing { }","Condition needs ( )","console.log is wrong","x should be let x"], answer: 1 },
  { broken: "function greet() {\n  console.log(\"Hi \" + name);\n}\ngreet(\"Karan\");", hint: "The function uses name but never receives it.", options: ["console.log is wrong","Function needs a parameter: name","greet() should be greet","\"Hi\" should be 'Hi'"], answer: 1 },
  { broken: "let x = 10;\nif (x = 5) {\n  console.log(\"five\");\n}", hint: "= and === are different things.", options: ["x should be let","Should use === not =","console.log is wrong","Missing ; after x = 10"], answer: 1 },
  { broken: "const arr = [1,2,3];\narr = [4,5,6];", hint: "const means you cannot reassign.", options: ["arr needs let not const","[4,5,6] is invalid","Missing semicolon","arr.push is needed"], answer: 0 },
];

function BugGame({ onBack }: { onBack: () => void }) {
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = bugQs[idx];
  const pick = (i: number) => { if (sel !== null) return; setSel(i); if (i === q.answer) setScore(s => s + 1); };
  const next = () => { if (idx + 1 >= bugQs.length) { setDone(true); return; } setIdx(i => i + 1); setSel(null); };
  const reset = () => { setIdx(0); setSel(null); setScore(0); setDone(false); };
  if (done) return <ResultScreen emoji="🐛" title="Bugs Squashed!" score={score} total={bugQs.length} xp={200} onReplay={reset} onBack={onBack} />;
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <BackBar title="Fix the Bug" score={score} total={bugQs.length} color="bg-[#f472b6]" onBack={onBack} />
      <div className="bg-[#1a1a2e] border-4 border-black p-6 mb-3 shadow-[6px_6px_0_0_#000]">
        <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-3">What is wrong with this code?</p>
        <pre className="font-mono text-[#f472b6] text-sm leading-relaxed whitespace-pre">{q.broken}</pre>
      </div>
      <div className="bg-[#fde047] border-4 border-black px-4 py-2 font-bold text-sm mb-5 flex items-center gap-2"><Lightbulb className="w-4 h-4 shrink-0" /> {q.hint}</div>
      <div className="flex flex-col gap-3 mb-4">
        {q.options.map((opt, i) => (
          <button key={i} onClick={() => pick(i)} className={`border-4 border-black font-bold text-sm py-3 px-4 text-left shadow-[4px_4px_0_0_#000] transition-all ${sel === null ? "bg-white hover:-translate-y-0.5" : i === q.answer ? "bg-[#34d399]" : sel === i ? "bg-[#f472b6]" : "bg-white opacity-40"}`}>{opt}</button>
        ))}
      </div>
      {sel !== null && <button onClick={next} className="w-full bg-black text-white font-black text-lg py-3 border-4 border-black shadow-[4px_4px_0_0_#f472b6] hover:-translate-y-0.5 transition-all">{idx + 1 >= bugQs.length ? "See Results" : "Next →"}</button>}
    </div>
  );
}

// ─── Game 3: Complete the Code ────────────────────────────────────────────────
const completeQs = [
  { prompt: "Return the square of n:", code: "function square(n) {\n  return ___;\n}", options: ["n*n","n+n","n^2","n/n"], answer: 0, exp: "n*n multiplies n by itself." },
  { prompt: "Check if a number is even:", code: "if (num ___ 0) {\n  console.log(\"Even\");\n}", options: ["/2==","% 2 ===","*2==","-2==="], answer: 1, exp: "% 2 === 0 checks if remainder is zero." },
  { prompt: "Add item to end of array:", code: "arr.___(4);", options: ["add","append","push","insert"], answer: 2, exp: ".push() adds to the end." },
  { prompt: "Get the length of a string:", code: "let len = str.___;", options: ["size","count","length","len"], answer: 2, exp: ".length gives the number of characters." },
  { prompt: "Convert string to number:", code: "let n = ___(\"42\");", options: ["int","float","Number","parse"], answer: 2, exp: "Number() converts a string to a number." },
  { prompt: "Loop from 1 to 5 inclusive:", code: "for (let i = 1; i ___ 5; i++) {}", options: ["<","<=",">",">="], answer: 1, exp: "i <= 5 includes 5 in the loop." },
  { prompt: "Return the larger of two numbers:", code: "return Math.___(a, b);", options: ["max","min","abs","ceil"], answer: 0, exp: "Math.max(a, b) returns the larger value." },
  { prompt: "Remove last item from array:", code: "arr.___;", options: ["remove()","delete()","pop()","shift()"], answer: 2, exp: ".pop() removes and returns the last element." },
];

function CompleteGame({ onBack }: { onBack: () => void }) {
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = completeQs[idx];
  const pick = (i: number) => { if (sel !== null) return; setSel(i); if (i === q.answer) setScore(s => s + 1); };
  const next = () => { if (idx + 1 >= completeQs.length) { setDone(true); return; } setIdx(i => i + 1); setSel(null); };
  const reset = () => { setIdx(0); setSel(null); setScore(0); setDone(false); };
  if (done) return <ResultScreen emoji="✏️" title="Code Complete!" score={score} total={completeQs.length} xp={175} onReplay={reset} onBack={onBack} />;
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <BackBar title="Complete the Code" score={score} total={completeQs.length} color="bg-[#38bdf8]" onBack={onBack} />
      <p className="font-black text-black text-base mb-4">{q.prompt}</p>
      <div className="bg-[#1a1a2e] border-4 border-black p-6 mb-5 shadow-[6px_6px_0_0_#000]">
        <pre className="font-mono text-[#38bdf8] text-sm leading-relaxed whitespace-pre">{q.code}</pre>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {q.options.map((opt, i) => (
          <button key={i} onClick={() => pick(i)} className={`border-4 border-black font-black text-base py-3 shadow-[4px_4px_0_0_#000] transition-all ${sel === null ? "bg-white hover:-translate-y-0.5" : i === q.answer ? "bg-[#34d399]" : sel === i ? "bg-[#f472b6]" : "bg-white opacity-40"}`}>{opt}</button>
        ))}
      </div>
      {sel !== null && (
        <>
          <div className={`border-4 border-black p-4 font-bold text-sm mb-4 flex items-center gap-2 ${sel === q.answer ? "bg-[#34d399]" : "bg-[#f472b6]"}`}>
            {sel === q.answer ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />} {q.exp}
          </div>
          <button onClick={next} className="w-full bg-black text-white font-black text-lg py-3 border-4 border-black shadow-[4px_4px_0_0_#38bdf8] hover:-translate-y-0.5 transition-all">{idx + 1 >= completeQs.length ? "See Results" : "Next →"}</button>
        </>
      )}
    </div>
  );
}
