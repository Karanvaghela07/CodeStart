import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, XCircle, Flame, Zap, Lock, Clock, ChevronRight, RotateCcw, Trophy } from "lucide-react";
import { useAuth } from "../context/AuthContext";

// ── Challenge data (keyed by day-of-year so it rotates daily) ─────────────────
const challenges = [
  {
    id: 1, difficulty: "Easy", tag: "Arrays", xp: 100,
    title: "Find the Maximum",
    desc: "Write a function that returns the largest number in an array.",
    example: "Input:  [3, 7, 1, 9, 4]\nOutput: 9",
    hint: "Loop through every element and keep track of the largest seen so far.",
    solution: "function findMax(arr) {\n  let max = arr[0];\n  for (let i = 1; i < arr.length; i++) {\n    if (arr[i] > max) max = arr[i];\n  }\n  return max;\n}",
    quiz: { q: "What is findMax([3,7,1,9,4])?", options: ["3","7","9","4"], answer: 2 },
  },
  {
    id: 2, difficulty: "Easy", tag: "Strings", xp: 100,
    title: "Reverse a String",
    desc: "Write a function that returns a string reversed.",
    example: "Input:  \"hello\"\nOutput: \"olleh\"",
    hint: "Split the string into characters, reverse the array, then join back.",
    solution: "function reverseStr(s) {\n  return s.split('').reverse().join('');\n}",
    quiz: { q: "What is reverseStr(\"abc\")?", options: ["abc","cba","bca","acb"], answer: 1 },
  },
  {
    id: 3, difficulty: "Easy", tag: "Math", xp: 100,
    title: "FizzBuzz",
    desc: "Print numbers 1–20. For multiples of 3 print Fizz, multiples of 5 print Buzz, both print FizzBuzz.",
    example: "1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz...",
    hint: "Use the modulo operator % to check divisibility.",
    solution: "for (let i = 1; i <= 20; i++) {\n  if (i % 15 === 0) console.log('FizzBuzz');\n  else if (i % 3 === 0) console.log('Fizz');\n  else if (i % 5 === 0) console.log('Buzz');\n  else console.log(i);\n}",
    quiz: { q: "What prints for i = 15?", options: ["Fizz","Buzz","FizzBuzz","15"], answer: 2 },
  },
  {
    id: 4, difficulty: "Medium", tag: "Arrays", xp: 200,
    title: "Two Sum",
    desc: "Given an array and a target, return the indices of two numbers that add up to the target.",
    example: "Input:  [2, 7, 11, 15], target = 9\nOutput: [0, 1]  (2 + 7 = 9)",
    hint: "Use a hashmap to store each number and its index. For each element, check if (target - element) is already in the map.",
    solution: "function twoSum(nums, target) {\n  const map = {};\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map[complement] !== undefined) {\n      return [map[complement], i];\n    }\n    map[nums[i]] = i;\n  }\n}",
    quiz: { q: "What is the time complexity of the hashmap approach?", options: ["O(n²)","O(n log n)","O(n)","O(1)"], answer: 2 },
  },
  {
    id: 5, difficulty: "Medium", tag: "Strings", xp: 200,
    title: "Check Palindrome",
    desc: "Write a function that returns true if a string reads the same forwards and backwards.",
    example: "Input:  \"racecar\"\nOutput: true\n\nInput:  \"hello\"\nOutput: false",
    hint: "Compare the string with its reverse. Or use two pointers from both ends.",
    solution: "function isPalindrome(s) {\n  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n  return clean === clean.split('').reverse().join('');\n}",
    quiz: { q: "Is \"A man a plan a canal Panama\" a palindrome (ignoring spaces/case)?", options: ["No","Yes","Only if lowercase","Depends"], answer: 1 },
  },
  {
    id: 6, difficulty: "Medium", tag: "Linked List", xp: 200,
    title: "Reverse a Linked List",
    desc: "Given the head of a singly linked list, reverse it and return the new head.",
    example: "Input:  1 -> 2 -> 3 -> null\nOutput: 3 -> 2 -> 1 -> null",
    hint: "Use three pointers: prev (null), curr (head), next. Flip each pointer as you walk forward.",
    solution: "function reverse(head) {\n  let prev = null, curr = head;\n  while (curr) {\n    let next = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = next;\n  }\n  return prev;\n}",
    quiz: { q: "After reversing 1->2->3, what is the new head value?", options: ["1","2","3","null"], answer: 2 },
  },
  {
    id: 7, difficulty: "Hard", tag: "DP", xp: 350,
    title: "Climbing Stairs",
    desc: "You can climb 1 or 2 steps at a time. How many distinct ways can you reach step n?",
    example: "Input:  n = 4\nOutput: 5\n(1+1+1+1, 1+1+2, 1+2+1, 2+1+1, 2+2)",
    hint: "This is Fibonacci! ways(n) = ways(n-1) + ways(n-2). Use DP to avoid recomputing.",
    solution: "function climbStairs(n) {\n  if (n <= 2) return n;\n  let dp = [0, 1, 2];\n  for (let i = 3; i <= n; i++) {\n    dp[i] = dp[i-1] + dp[i-2];\n  }\n  return dp[n];\n}",
    quiz: { q: "How many ways to climb 3 stairs?", options: ["2","3","4","5"], answer: 1 },
  },
];

// Pick today's challenge based on day of year
function getTodayChallenge() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return challenges[dayOfYear % challenges.length];
}

const DONE_KEY = "codestart_challenge_done";

function getTodayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function getDoneToday(): boolean {
  try {
    const data = JSON.parse(localStorage.getItem(DONE_KEY) || "{}");
    return data.date === getTodayStr() && data.done === true;
  } catch { return false; }
}

function markDoneToday() {
  localStorage.setItem(DONE_KEY, JSON.stringify({ date: getTodayStr(), done: true }));
}

const diffColor: Record<string, string> = {
  Easy: "bg-[#34d399]", Medium: "bg-[#fde047]", Hard: "bg-[#f472b6]",
};

export default function Challenges() {
  const { user, addXP, canAccess, updateStreak, markChallengeComplete } = useAuth();
  const [challenge] = useState(getTodayChallenge);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [quizSel, setQuizSel] = useState<number | null>(null);
  const [completed, setCompleted] = useState(getDoneToday);
  const [timeLeft, setTimeLeft] = useState(() => {
    const now = new Date();
    const midnight = new Date(now); midnight.setHours(24, 0, 0, 0);
    return Math.floor((midnight.getTime() - now.getTime()) / 1000);
  });

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = (s: number) => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return `${h}h ${m}m ${sec}s`;
  };

  const handleComplete = () => {
    if (completed) return;
    const today = getTodayStr();
    markDoneToday();
    setCompleted(true);
    if (user) {
      addXP(challenge.xp);
      updateStreak();
      markChallengeComplete(today);
    }
  };

  const isPro = canAccess("pro");
  const streak = user?.streak ?? 0;

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-[#1a1a2e] border-b-4 border-black px-6 py-12 text-center">
        <p className="text-sm font-black uppercase tracking-widest text-white/40 mb-3">Daily Challenge</p>
        <h1 className="text-5xl md:text-6xl font-black text-white uppercase leading-tight mb-4">
          Today&apos;s<br />Challenge
        </h1>
        <p className="text-lg font-bold text-white/60 max-w-xl mx-auto mb-6">
          One new problem every day. Solve it, earn XP, build your streak.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="bg-white/10 border-2 border-white/20 px-5 py-3 flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#fb923c]" />
            <span className="font-black text-white">{streak} day streak</span>
          </div>
          <div className="bg-white/10 border-2 border-white/20 px-5 py-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#38bdf8]" />
            <span className="font-black text-white">Resets in {fmt(timeLeft)}</span>
          </div>
          <div className="bg-white/10 border-2 border-white/20 px-5 py-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#fde047]" />
            <span className="font-black text-white">+{challenge.xp} XP today</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Challenge card */}
        <div className="border-4 border-black shadow-[8px_8px_0_0_#000] mb-6">
          {/* Top bar */}
          <div className={`${diffColor[challenge.difficulty]} border-b-4 border-black px-6 py-3 flex items-center justify-between flex-wrap gap-2`}>
            <div className="flex items-center gap-3">
              <span className="bg-black text-white font-black text-xs px-3 py-1">{challenge.difficulty}</span>
              <span className="bg-white border-2 border-black font-black text-xs px-3 py-1">{challenge.tag}</span>
            </div>
            <span className="font-black text-black text-sm flex items-center gap-1"><Zap className="w-4 h-4" /> +{challenge.xp} XP</span>
          </div>

          <div className="bg-white px-6 py-6">
            <h2 className="text-3xl font-black text-black uppercase mb-3">{challenge.title}</h2>
            <p className="font-bold text-black/70 text-base leading-relaxed mb-5">{challenge.desc}</p>

            {/* Example */}
            <div className="bg-[#0d0d1a] border-4 border-black p-5 mb-5 shadow-[4px_4px_0_0_#000]">
              <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-2">Example</p>
              <pre className="font-mono text-sm text-[#34d399] whitespace-pre">{challenge.example}</pre>
            </div>

            {/* Hint */}
            <button onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-2 font-black text-sm border-4 border-black px-4 py-2 bg-[#fde047] shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5 transition-all mb-3">
              💡 {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            {showHint && (
              <div className="bg-[#fde047] border-4 border-black px-5 py-4 mb-4 shadow-[3px_3px_0_0_#000]">
                <p className="font-bold text-black text-sm">{challenge.hint}</p>
              </div>
            )}

            {/* Solution (pro only) */}
            {!isPro ? (
              <div className="border-4 border-black bg-[#1a1a2e] px-5 py-4 flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-[#fde047]" />
                  <p className="font-bold text-white/70 text-sm">Solution is available on Pro plan</p>
                </div>
                <Link to="/pricing" className="bg-[#fde047] border-4 border-black font-black text-xs px-4 py-2 shadow-[3px_3px_0_0_#fde047] hover:-translate-y-0.5 transition-all text-black whitespace-nowrap">
                  Upgrade
                </Link>
              </div>
            ) : (
              <>
                <button onClick={() => setShowSolution(!showSolution)}
                  className="flex items-center gap-2 font-black text-sm border-4 border-black px-4 py-2 bg-[#c084fc] shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5 transition-all mb-3">
                  {showSolution ? "Hide Solution" : "Show Solution"}
                </button>
                {showSolution && (
                  <div className="bg-[#0d0d1a] border-4 border-black p-5 mb-4 shadow-[4px_4px_0_0_#000]">
                    <pre className="font-mono text-sm text-[#c084fc] whitespace-pre">{challenge.solution}</pre>
                  </div>
                )}
              </>
            )}

            {/* Quiz */}
            <div className="border-t-4 border-black pt-5 mt-2">
              <p className="font-black text-black text-sm mb-3">Quick Check: {challenge.quiz.q}</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {challenge.quiz.options.map((opt, i) => (
                  <button key={i} onClick={() => setQuizSel(i)}
                    className={`border-4 border-black px-3 py-2 font-bold text-sm text-left shadow-[3px_3px_0_0_#000] transition-all hover:-translate-y-0.5
                      ${quizSel === null ? "bg-white" : i === challenge.quiz.answer ? "bg-[#34d399]" : quizSel === i ? "bg-[#f472b6]" : "bg-white opacity-50"}`}>
                    {opt}
                  </button>
                ))}
              </div>
              {quizSel !== null && (
                <div className={`border-4 border-black px-4 py-3 font-bold text-sm flex items-center gap-2 mb-4 ${quizSel === challenge.quiz.answer ? "bg-[#34d399]" : "bg-[#f472b6]"}`}>
                  {quizSel === challenge.quiz.answer ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
                  {quizSel === challenge.quiz.answer ? "Correct!" : `Wrong — correct: ${challenge.quiz.options[challenge.quiz.answer]}`}
                </div>
              )}
            </div>

            {/* Mark complete */}
            {!completed ? (
              <button onClick={handleComplete}
                className="w-full bg-[#34d399] border-4 border-black font-black text-xl py-4 shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000] transition-all flex items-center justify-center gap-3">
                <CheckCircle2 className="w-6 h-6" /> Mark as Complete (+{challenge.xp} XP)
              </button>
            ) : (
              <div className="w-full bg-[#34d399] border-4 border-black font-black text-xl py-4 flex items-center justify-center gap-3 text-black">
                <Trophy className="w-6 h-6" /> Challenge Complete! Come back tomorrow.
              </div>
            )}
          </div>
        </div>

        {/* Past challenges preview */}
        <div className="border-4 border-black shadow-[6px_6px_0_0_#000]">
          <div className="bg-black text-white px-5 py-3 font-black uppercase tracking-widest text-sm">More Challenges</div>
          {challenges.filter(c => c.id !== challenge.id).slice(0, 4).map(c => (
            <div key={c.id} className="flex items-center justify-between px-5 py-4 border-t-2 border-black/10 hover:bg-[#fde047]/20 transition-colors">
              <div className="flex items-center gap-3">
                <span className={`${diffColor[c.difficulty]} border-2 border-black font-black text-xs px-2 py-0.5`}>{c.difficulty}</span>
                <span className="font-black text-black text-sm">{c.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-black/50 text-xs">+{c.xp} XP</span>
                <ChevronRight className="w-4 h-4 text-black/40" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
