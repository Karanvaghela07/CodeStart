import { useState } from "react";
import { CheckCircle2, Lock, ChevronRight, ChevronDown, ChevronUp, Zap, Star, Trophy, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Stages 1-3 = free, 4-6 = pro/pack
const PLAN_GATE: Record<number, "free" | "pro"> = { 1: "free", 2: "free", 3: "free", 4: "pro", 5: "pro", 6: "pro" };

// ─── Data ────────────────────────────────────────────────────────────────────

interface Lesson {
  title: string;
  simple: string;
  analogy: string;
  code: string;
  quiz: { q: string; options: string[]; answer: number };
}

interface Stage {
  id: number;
  color: string;
  label: string;
  title: string;
  desc: string;
  xp: number;
  game: string;
  lessons: Lesson[];
}

const stages: Stage[] = [
  {
    id: 1,
    color: "bg-[#34d399]",
    label: "Stage 1 — Absolute Beginner",
    title: "Variables & Data Types",
    desc: "Understand what a variable is, how computers store data, and the difference between numbers, strings, and booleans.",
    xp: 100,
    game: "Guess the Output",
    lessons: [
      {
        title: "What is a Variable?",
        simple: "A variable is a named container that stores a value. You give it a name, assign a value, and use it anywhere in your code.",
        analogy: "Think of a variable like a labelled jar. The label is the name (e.g. age) and whatever is inside is the value (e.g. 20).",
        code: "let age = 20;\nlet name = \"Karan\";\nconsole.log(age);   // 20\nconsole.log(name);  // Karan",
        quiz: { q: "Which is a valid variable declaration?", options: ["let 1name = 5", "let myName = 5", "variable myName = 5", "int myName = 5"], answer: 1 },
      },
      {
        title: "Numbers & Strings",
        simple: "Numbers are for math. Strings are text wrapped in quotes. You can't do math on a string — \"5\" + \"3\" gives \"53\", not 8.",
        analogy: "Numbers are coins you can count. Strings are sticky notes — you can read them but not add them like numbers.",
        code: "let score = 95;         // Number\nlet city = \"Mumbai\";    // String\nconsole.log(score + 5); // 100\nconsole.log(\"Hi \" + city); // Hi Mumbai",
        quiz: { q: "What does console.log(\"5\" + \"3\") print?", options: ["8", "53", "\"53\"", "Error"], answer: 1 },
      },
      {
        title: "Booleans & typeof",
        simple: "A boolean is just true or false. Use typeof to check what type a value is.",
        analogy: "A boolean is like a light switch — it's either ON (true) or OFF (false). Nothing in between.",
        code: "let passed = true;\nlet failed = false;\nconsole.log(typeof 42);      // \"number\"\nconsole.log(typeof \"hello\"); // \"string\"\nconsole.log(typeof true);    // \"boolean\"",
        quiz: { q: "What does typeof 42 return?", options: ["\"int\"", "\"number\"", "42", "\"string\""], answer: 1 },
      },
    ],
  },
  {
    id: 2,
    color: "bg-[#fde047]",
    label: "Stage 2 — Making Decisions",
    title: "Conditions & Logic",
    desc: "Make your code make decisions. if/else, comparison operators, and logical thinking — the brain of every program.",
    xp: 150,
    game: "Fix the Bug",
    lessons: [
      {
        title: "if / else",
        simple: "if checks a condition. If it's true, run the first block. If false, run the else block.",
        analogy: "Like a traffic light — if green, go. If red, stop. Your code does the same based on conditions.",
        code: "let marks = 75;\nif (marks >= 60) {\n  console.log(\"Pass!\");\n} else {\n  console.log(\"Try again.\");\n}\n// Output: Pass!",
        quiz: { q: "What prints if marks = 45?", options: ["Pass!", "Try again.", "Error", "Nothing"], answer: 1 },
      },
      {
        title: "Comparison Operators",
        simple: "== checks value, === checks value AND type. Always prefer === to avoid bugs.",
        analogy: "== is like asking 'do you have the same amount of money?' === is asking 'do you have the exact same coin?'",
        code: "console.log(5 == \"5\");  // true  (loose)\nconsole.log(5 === \"5\"); // false (strict)\nconsole.log(10 > 5);    // true\nconsole.log(3 !== 4);   // true",
        quiz: { q: "What does 5 === \"5\" return?", options: ["true", "false", "Error", "undefined"], answer: 1 },
      },
      {
        title: "Logical AND, OR, NOT",
        simple: "&& means both must be true. || means at least one must be true. ! flips true to false.",
        analogy: "&& is like needing BOTH a ticket AND an ID to enter. || is like needing a ticket OR a pass — either works.",
        code: "let age = 20;\nlet hasID = true;\nif (age >= 18 && hasID) {\n  console.log(\"Entry allowed\");\n}\nconsole.log(!true);  // false\nconsole.log(true || false); // true",
        quiz: { q: "What does !false return?", options: ["false", "true", "0", "null"], answer: 1 },
      },
    ],
  },
  {
    id: 3,
    color: "bg-[#c084fc]",
    label: "Stage 3 — Loops & Repetition",
    title: "Loops",
    desc: "Stop writing the same line 100 times. for loops, while loops, and how to think in repetition.",
    xp: 200,
    game: "Complete the Code",
    lessons: [
      {
        title: "for Loop",
        simple: "A for loop runs a block of code a set number of times. You control the start, end, and step.",
        analogy: "Like setting an alarm to ring 5 times — you set it once, it repeats automatically.",
        code: "for (let i = 1; i <= 5; i++) {\n  console.log(\"Rep \" + i);\n}\n// Rep 1\n// Rep 2\n// Rep 3\n// Rep 4\n// Rep 5",
        quiz: { q: "How many times does this loop run: for(let i=0; i<3; i++)?", options: ["2", "3", "4", "0"], answer: 1 },
      },
      {
        title: "while Loop",
        simple: "A while loop keeps running as long as a condition is true. Be careful — if the condition never becomes false, it runs forever.",
        analogy: "Like eating chips while the bowl isn't empty. You keep going until the condition (bowl empty) is true.",
        code: "let count = 1;\nwhile (count <= 3) {\n  console.log(count);\n  count++;\n}\n// 1\n// 2\n// 3",
        quiz: { q: "What stops a while loop?", options: ["A return statement", "When its condition becomes false", "After 10 runs", "A break only"], answer: 1 },
      },
      {
        title: "break & continue",
        simple: "break exits the loop immediately. continue skips the current iteration and moves to the next.",
        analogy: "break is like leaving a queue entirely. continue is like skipping your turn and waiting for the next round.",
        code: "for (let i = 1; i <= 5; i++) {\n  if (i === 3) continue; // skip 3\n  if (i === 5) break;    // stop at 5\n  console.log(i);\n}\n// 1\n// 2\n// 4",
        quiz: { q: "What does continue do inside a loop?", options: ["Exits the loop", "Skips the current iteration", "Restarts the loop", "Pauses execution"], answer: 1 },
      },
    ],
  },
  {
    id: 4,
    color: "bg-[#38bdf8]",
    label: "Stage 4 — Organising Code",
    title: "Functions",
    desc: "Write code once, use it anywhere. Functions are the building blocks of every real program.",
    xp: 250,
    game: "Guess the Output",
    lessons: [
      {
        title: "Defining & Calling Functions",
        simple: "A function is a reusable block of code. Define it once with a name, then call it whenever you need it.",
        analogy: "Like a recipe — you write it once, and anyone can follow it as many times as they want.",
        code: "function greet(name) {\n  return \"Hello, \" + name + \"!\";\n}\nconsole.log(greet(\"Karan\")); // Hello, Karan!\nconsole.log(greet(\"Priya\")); // Hello, Priya!",
        quiz: { q: "What keyword is used to define a function?", options: ["var", "let", "function", "def"], answer: 2 },
      },
      {
        title: "Parameters & Return",
        simple: "Parameters are inputs to a function. return sends a value back to whoever called the function.",
        analogy: "A vending machine takes your input (coin + button) and returns an output (snack). Parameters are the input, return is the output.",
        code: "function add(a, b) {\n  return a + b;\n}\nlet result = add(3, 7);\nconsole.log(result); // 10",
        quiz: { q: "What does return do?", options: ["Prints a value", "Stops the program", "Sends a value back from the function", "Loops"], answer: 2 },
      },
      {
        title: "Arrow Functions",
        simple: "Arrow functions are a shorter way to write functions. Great for simple, one-line operations.",
        analogy: "Like a shorthand note — instead of writing a full sentence, you write a quick symbol that means the same thing.",
        code: "// Regular\nfunction square(n) { return n * n; }\n\n// Arrow\nconst square2 = (n) => n * n;\n\nconsole.log(square(4));  // 16\nconsole.log(square2(4)); // 16",
        quiz: { q: "Which is a valid arrow function?", options: ["function => (n) n*n", "const f = (n) => n*n", "arrow f(n) { n*n }", "def f = n => n*n"], answer: 1 },
      },
    ],
  },
  {
    id: 5,
    color: "bg-[#f472b6]",
    label: "Stage 5 — Collections",
    title: "Arrays & Objects",
    desc: "Store multiple values in one place. Arrays and objects power almost every feature you will ever build.",
    xp: 300,
    game: "Fix the Bug",
    lessons: [
      {
        title: "Arrays",
        simple: "An array stores multiple values in one variable. Each value has an index starting from 0.",
        analogy: "Like a row of lockers — each locker has a number (index) and something inside (value).",
        code: "let fruits = [\"apple\", \"mango\", \"banana\"];\nconsole.log(fruits[0]); // apple\nconsole.log(fruits[2]); // banana\nconsole.log(fruits.length); // 3\nfruits.push(\"grape\");\nconsole.log(fruits.length); // 4",
        quiz: { q: "What is fruits[1] if fruits = [\"apple\",\"mango\",\"banana\"]?", options: ["apple", "mango", "banana", "undefined"], answer: 1 },
      },
      {
        title: "Array Methods",
        simple: "Arrays have built-in methods: push adds to end, pop removes from end, map transforms each item, filter keeps items that match a condition.",
        analogy: "map is like a factory line — every item goes in, gets transformed, comes out changed. filter is like a bouncer — only items that pass the check get through.",
        code: "let nums = [1, 2, 3, 4, 5];\nlet doubled = nums.map(n => n * 2);\nconsole.log(doubled); // [2,4,6,8,10]\n\nlet evens = nums.filter(n => n % 2 === 0);\nconsole.log(evens); // [2,4]",
        quiz: { q: "What does .map() return?", options: ["The original array modified", "A new array with transformed items", "The first matching item", "A boolean"], answer: 1 },
      },
      {
        title: "Objects",
        simple: "An object stores key-value pairs. Instead of numbered indexes like arrays, you use named keys to access values.",
        analogy: "Like a student ID card — it has labelled fields: name, roll number, class. You look up values by their label, not a number.",
        code: "let student = {\n  name: \"Karan\",\n  age: 20,\n  city: \"Mumbai\"\n};\nconsole.log(student.name); // Karan\nconsole.log(student[\"age\"]); // 20\nstudent.xp = 500;\nconsole.log(student.xp); // 500",
        quiz: { q: "How do you access the name property of an object called user?", options: ["user[0]", "user->name", "user.name", "user::name"], answer: 2 },
      },
    ],
  },
  {
    id: 6,
    color: "bg-[#fb923c]",
    label: "Stage 6 — Logic Building",
    title: "DSA Basics",
    desc: "Pattern problems, step-by-step thinking, and visual explanations. Build the mindset interviewers look for.",
    xp: 500,
    game: "Complete the Code",
    lessons: [
      {
        title: "Time Complexity Basics",
        simple: "Time complexity describes how the runtime of an algorithm grows as input size grows. O(1) is constant, O(n) grows linearly, O(n²) grows quadratically.",
        analogy: "O(1) is finding your name on a list when you know the exact line number. O(n) is reading every name until you find yours. O(n²) is comparing every name with every other name.",
        code: "// O(1) — always one step\nfunction getFirst(arr) {\n  return arr[0];\n}\n\n// O(n) — grows with input\nfunction findItem(arr, target) {\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] === target) return i;\n  }\n  return -1;\n}",
        quiz: { q: "What is the time complexity of accessing arr[0]?", options: ["O(n)", "O(log n)", "O(1)", "O(n²)"], answer: 2 },
      },
      {
        title: "Linear Search",
        simple: "Linear search checks every element one by one until it finds the target. Simple but slow for large arrays.",
        analogy: "Like looking for your pen by checking every drawer one by one from left to right.",
        code: "function linearSearch(arr, target) {\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] === target) {\n      return i; // found at index i\n    }\n  }\n  return -1; // not found\n}\nconsole.log(linearSearch([3,7,1,9], 7)); // 1",
        quiz: { q: "What does linearSearch return if the item is not found?", options: ["0", "null", "-1", "false"], answer: 2 },
      },
      {
        title: "Bubble Sort",
        simple: "Bubble sort repeatedly compares adjacent elements and swaps them if they're in the wrong order. After each pass, the largest unsorted element 'bubbles' to the end.",
        analogy: "Like sorting a row of students by height — you walk down the line, swap any two neighbours who are out of order, and repeat until no swaps are needed.",
        code: "function bubbleSort(arr) {\n  let n = arr.length;\n  for (let i = 0; i < n - 1; i++) {\n    for (let j = 0; j < n - i - 1; j++) {\n      if (arr[j] > arr[j + 1]) {\n        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];\n      }\n    }\n  }\n  return arr;\n}\nconsole.log(bubbleSort([5,3,8,1])); // [1,3,5,8]",
        quiz: { q: "What is the time complexity of bubble sort?", options: ["O(1)", "O(n)", "O(n log n)", "O(n²)"], answer: 3 },
      },
    ],
  },
];

// ─── Progress helpers ─────────────────────────────────────────────────────────
const PROGRESS_KEY = "codestart_roadmap";

function loadProgress(): Record<number, number[]> {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}"); }
  catch { return {}; }
}

function saveProgress(p: Record<number, number[]>) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
}

// ─── Quiz component ───────────────────────────────────────────────────────────
function Quiz({
  quiz,
  onCorrect,
}: {
  quiz: Lesson["quiz"];
  onCorrect: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  const pick = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === quiz.answer) onCorrect();
  };

  return (
    <div className="mt-4 border-t-4 border-black pt-4">
      <p className="font-black text-black text-sm mb-3">Quick Check: {quiz.q}</p>
      <div className="grid grid-cols-2 gap-2">
        {quiz.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => pick(i)}
            className={`border-4 border-black px-3 py-2 font-bold text-sm text-left shadow-[3px_3px_0_0_#000] transition-all hover:-translate-y-0.5
              ${selected === null
                ? "bg-white"
                : i === quiz.answer
                ? "bg-[#34d399]"
                : selected === i
                ? "bg-[#f472b6]"
                : "bg-white opacity-50"}`}
          >
            {opt}
          </button>
        ))}
      </div>
      {selected !== null && (
        <p className={`mt-2 font-black text-xs ${selected === quiz.answer ? "text-green-700" : "text-red-600"}`}>
          {selected === quiz.answer ? "Correct! +25 XP" : `Wrong — correct: ${quiz.options[quiz.answer]}`}
        </p>
      )}
    </div>
  );
}

// ─── Lesson card ──────────────────────────────────────────────────────────────
function LessonCard({
  lesson,
  index,
  done,
  onComplete,
}: {
  lesson: Lesson;
  index: number;
  done: boolean;
  onComplete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [quizDone, setQuizDone] = useState(done);

  return (
    <div className={`border-4 border-black shadow-[4px_4px_0_0_#000] transition-all ${done ? "opacity-90" : ""}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-black/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-7 h-7 rounded-full border-4 border-black flex items-center justify-center font-black text-xs shrink-0
            ${done ? "bg-[#34d399]" : "bg-white"}`}>
            {done ? <CheckCircle2 className="w-4 h-4 text-black" /> : index + 1}
          </div>
          <span className="font-black text-black text-sm">{lesson.title}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {open && (
        <div className="border-t-4 border-black bg-white px-5 py-5 flex flex-col gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-black/40 mb-1">Simple Explanation</p>
            <p className="font-bold text-black text-sm leading-relaxed">{lesson.simple}</p>
          </div>
          <div className="bg-[#fde047] border-4 border-black p-3 shadow-[3px_3px_0_0_#000]">
            <p className="text-xs font-black uppercase tracking-widest text-black/50 mb-1">Real-Life Analogy</p>
            <p className="font-bold text-black text-sm">{lesson.analogy}</p>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-black/40 mb-2">Code Example</p>
            <div className="bg-[#1a1a2e] border-4 border-black p-4 overflow-x-auto">
              <pre className="font-mono text-xs text-[#34d399] leading-relaxed whitespace-pre">{lesson.code}</pre>
            </div>
          </div>
          {!quizDone ? (
            <Quiz
              quiz={lesson.quiz}
              onCorrect={() => { setQuizDone(true); onComplete(); }}
            />
          ) : (
            <div className="flex items-center gap-2 bg-[#34d399] border-4 border-black px-4 py-2 font-black text-sm shadow-[3px_3px_0_0_#000]">
              <CheckCircle2 className="w-4 h-4" /> Lesson complete! +25 XP earned
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Stage card ───────────────────────────────────────────────────────────────
function StageCard({
  stage,
  unlocked,
  planLocked,
  completedLessons,
  onLessonComplete,
  onStageComplete,
}: {
  stage: Stage;
  unlocked: boolean;
  planLocked: boolean;
  completedLessons: number[];
  onLessonComplete: (lessonIdx: number) => void;
  onStageComplete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const total = stage.lessons.length;
  const done = completedLessons.length;
  const allDone = done === total;
  const pct = Math.round((done / total) * 100);
  const canOpen = unlocked && !planLocked;

  return (
    <div className={`border-4 border-black shadow-[8px_8px_0_0_#000] transition-all ${planLocked ? "opacity-70" : allDone ? "" : "hover:-translate-y-0.5"}`}>
      {/* Top bar */}
      <div className={`${stage.color} border-b-4 border-black px-6 py-3 flex items-center justify-between`}>
        <span className="font-black text-xs uppercase tracking-widest text-black/70">{stage.label}</span>
        <div className="flex items-center gap-2">
          {planLocked && (
            <span className="bg-[#e94560] text-white font-black text-xs px-3 py-1 flex items-center gap-1">
              <Lock className="w-3 h-3" /> PRO
            </span>
          )}
          <span className="bg-black text-white font-black text-xs px-3 py-1 flex items-center gap-1">
            <Zap className="w-3 h-3" /> +{stage.xp} XP
          </span>
          {allDone && !planLocked
            ? <Trophy className="w-5 h-5 text-black" />
            : canOpen
            ? <CheckCircle2 className="w-5 h-5 text-black/40" />
            : <Lock className="w-5 h-5 text-black/50" />}
        </div>
      </div>

      {/* Summary row */}
      <button
        onClick={() => canOpen && setOpen(!open)}
        className={`w-full bg-white px-6 py-5 flex flex-col md:flex-row md:items-center gap-4 text-left ${canOpen ? "cursor-pointer hover:bg-black/5 transition-colors" : "cursor-not-allowed"}`}
      >
        <div className="flex-1">
          <h2 className="text-2xl font-black text-black uppercase mb-1">{stage.title}</h2>
          <p className="text-black/60 font-bold text-sm leading-relaxed">{stage.desc}</p>
        </div>
        <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-32 bg-black/10 border-2 border-black h-3 overflow-hidden">
              <div className={`h-full ${stage.color} transition-all`} style={{ width: `${pct}%` }} />
            </div>
            <span className="font-black text-xs text-black/60">{done}/{total}</span>
          </div>
          <div className={`${stage.color} border-4 border-black px-3 py-1 font-black text-xs shadow-[3px_3px_0_0_#000] flex items-center gap-1`}>
            <Star className="w-3 h-3" /> {stage.game}
          </div>
          {canOpen && (
            <span className="font-black text-xs text-black/50 flex items-center gap-1">
              {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {open ? "Collapse" : "Open Stage"}
            </span>
          )}
          {planLocked && (
            <span className="font-black text-xs text-[#e94560] flex items-center gap-1">
              <Lock className="w-3 h-3" /> Upgrade to unlock
            </span>
          )}
          {!planLocked && !unlocked && (
            <span className="font-black text-xs text-black/40 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Complete previous stage
            </span>
          )}        </div>
      </button>

      {/* Plan-locked upgrade wall */}
      {planLocked && (
        <div className="border-t-4 border-black bg-[#1a1a2e] px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-black text-white text-base mb-1">This stage requires Pro or Beginner Pack</p>
            <p className="font-bold text-white/50 text-sm">Upgrade to unlock all 6 stages, unlimited AI Explain, and all games.</p>
          </div>
          <Link
            to="/pricing"
            className="shrink-0 bg-[#fde047] border-4 border-black font-black text-sm px-6 py-3 shadow-[4px_4px_0_0_#fde047] hover:-translate-y-0.5 transition-all text-black whitespace-nowrap"
          >
            View Plans →
          </Link>
        </div>
      )}

      {/* Lessons */}
      {open && canOpen && (
        <div className="border-t-4 border-black bg-black/5 px-6 py-5 flex flex-col gap-3">
          {stage.lessons.map((lesson, i) => (
            <LessonCard
              key={i}
              lesson={lesson}
              index={i}
              done={completedLessons.includes(i)}
              onComplete={() => {
                onLessonComplete(i);
                if (completedLessons.length + 1 === total) onStageComplete();
              }}
            />
          ))}
          {allDone && (
            <div className="bg-[#34d399] border-4 border-black px-5 py-4 font-black text-black flex items-center gap-3 shadow-[4px_4px_0_0_#000] mt-2">
              <Trophy className="w-6 h-6" />
              Stage complete! +{stage.xp} XP earned. Next stage unlocked.
            </div>
          )}
          {!allDone && (
            <Link
              to="/games"
              className="inline-flex items-center gap-2 bg-black text-white font-black text-sm px-5 py-3 border-4 border-black shadow-[4px_4px_0_0_#000] hover:-translate-y-0.5 transition-all mt-2 w-fit"
            >
              <Star className="w-4 h-4" /> Practice with {stage.game} game
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Roadmap() {
  const { user, addXP, canAccess } = useAuth();
  const [progress, setProgress] = useState<Record<number, number[]>>(loadProgress);
  const [xpToast, setXpToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setXpToast(msg);
    setTimeout(() => setXpToast(null), 2500);
  };

  const handleLessonComplete = (stageId: number, lessonIdx: number) => {
    setProgress((prev) => {
      const existing = prev[stageId] || [];
      if (existing.includes(lessonIdx)) return prev;
      const updated = { ...prev, [stageId]: [...existing, lessonIdx] };
      saveProgress(updated);
      if (user) addXP(25);
      showToast("+25 XP");
      return updated;
    });
  };

  const handleStageComplete = (stageId: number, xp: number) => {
    if (user) addXP(xp);
    showToast(`+${xp} XP — Stage ${stageId} complete!`);
  };

  // All stages are progression-open — only plan gates matter
  const isProgressionUnlocked = (_stageId: number) => true;

  // Stage is plan-locked if it requires pro and user doesn't have it
  const isPlanLocked = (stageId: number) => {
    const required = PLAN_GATE[stageId];
    return !canAccess(required);
  };

  const totalLessons = stages.reduce((a, s) => a + s.lessons.length, 0);
  const completedLessons = Object.values(progress).reduce((a, arr) => a + arr.length, 0);
  const totalXP = stages.reduce((a, s) => {
    const done = (progress[s.id] || []).length;
    return a + done * 25 + (done === s.lessons.length ? s.xp : 0);
  }, 0);

  const resetProgress = () => { localStorage.removeItem(PROGRESS_KEY); setProgress({}); };

  return (
    <div className="bg-white min-h-screen">
      {/* XP Toast */}
      {xpToast && (
        <div className="fixed top-24 right-6 z-50 bg-[#34d399] border-4 border-black px-5 py-3 font-black text-black shadow-[6px_6px_0_0_#000] animate-bounce">
          {xpToast}
        </div>
      )}

      {/* Header */}
      <div className="bg-[#1a1a2e] border-b-4 border-black px-6 py-14 text-center">
        <p className="text-sm font-black uppercase tracking-widest text-white/40 mb-3">Start From Zero</p>
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase leading-tight mb-4">
          Your Coding<br />Roadmap
        </h1>
        <p className="text-lg font-bold text-white/60 max-w-xl mx-auto mb-8">
          Complete every lesson, answer every quiz, earn XP. Each stage unlocks the next.
        </p>

        {/* Overall progress */}
        <div className="max-w-md mx-auto">
          <div className="bg-white/10 border-2 border-white/20 h-5 overflow-hidden mb-2">
            <div
              className="h-full bg-[#34d399] transition-all duration-500"
              style={{ width: `${totalLessons ? (completedLessons / totalLessons) * 100 : 0}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-white/50 font-bold text-sm">
            <span>{completedLessons}/{totalLessons} lessons done</span>
            <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-[#fde047]" /> {totalXP} XP earned</span>
          </div>
        </div>

        {!user && (
          <p className="mt-4 text-white/40 font-bold text-sm">
            <Link to="/register" className="text-[#34d399] underline">Sign up</Link> to save your progress across devices.
          </p>
        )}
      </div>

      {/* Stages */}
      <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col gap-6">
        {stages.map((stage, i) => (
          <div key={stage.id} className="relative">
            {i < stages.length - 1 && (
              <div className="absolute left-10 -bottom-7 w-1 h-7 bg-black z-10" />
            )}
            <StageCard
              stage={stage}
              unlocked={isProgressionUnlocked(stage.id)}
              planLocked={isPlanLocked(stage.id)}
              completedLessons={progress[stage.id] || []}
              onLessonComplete={(lessonIdx) => handleLessonComplete(stage.id, lessonIdx)}
              onStageComplete={() => handleStageComplete(stage.id, stage.xp)}
            />
          </div>
        ))}
      </div>

      {/* Bottom actions */}
      <div className="max-w-4xl mx-auto px-6 pb-12 flex items-center justify-between flex-wrap gap-4">
        <button
          onClick={resetProgress}
          className="flex items-center gap-2 border-4 border-black font-black text-sm px-4 py-2 bg-white shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5 transition-all text-black/60 hover:text-black"
        >
          <RotateCcw className="w-4 h-4" /> Reset Progress
        </button>
        <Link
          to="/games"
          className="flex items-center gap-2 bg-[#fde047] border-4 border-black font-black text-sm px-5 py-2 shadow-[4px_4px_0_0_#000] hover:-translate-y-0.5 transition-all"
        >
          <Star className="w-4 h-4" /> Practice with Games
        </Link>
      </div>

      {/* CTA */}
      <div className="bg-[#34d399] border-t-4 border-black px-6 py-14 text-center">
        <h2 className="text-4xl font-black text-black uppercase mb-3">
          {completedLessons === totalLessons && totalLessons > 0 ? "Roadmap Complete!" : "Ready to Start?"}
        </h2>
        <p className="text-black/70 font-bold mb-8 max-w-md mx-auto">
          {completedLessons === totalLessons && totalLessons > 0
            ? "You've completed all 6 stages. Check the leaderboard to see where you rank."
            : "Open Stage 1, read the lesson, answer the quiz, earn XP. Takes under 10 minutes."}
        </p>
        <Link
          to={completedLessons === totalLessons && totalLessons > 0 ? "/leaderboard" : "/games"}
          className="inline-flex items-center gap-3 bg-black text-white font-black text-xl px-8 py-4 border-4 border-black shadow-[6px_6px_0_0_#000] hover:-translate-y-1 hover:shadow-[10px_10px_0_0_#000] transition-all"
        >
          {completedLessons === totalLessons && totalLessons > 0 ? "View Leaderboard" : "Play Games"} <ChevronRight className="w-6 h-6" />
        </Link>
      </div>
    </div>
  );
}
