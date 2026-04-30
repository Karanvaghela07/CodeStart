import { useState } from "react";
import { ChevronDown, ChevronUp, Zap, Lock, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// topics 1-3 = free, 4-6 = pro
const TOPIC_PLAN: Record<number, "free" | "pro"> = {
  1: "free", 2: "free", 3: "free",
  4: "pro",  5: "pro",  6: "pro",
};

const topics = [
  {
    id: 1,
    stage: "Stage 1",
    tag: "Variables",
    title: "What is a Variable?",
    color: "bg-[#34d399]",
    xp: 100,
    simple: "A variable is a named box that stores a value. You give it a name, and you can put any data inside it.",
    analogy: "Think of a variable like a labelled jar. The label is the name (e.g. age), and whatever is inside is the value (e.g. 20).",
    code: "let age = 20;\nlet name = \"Karan\";\nlet isStudent = true;\n\nconsole.log(age);    // 20\nconsole.log(name);   // Karan",
    questions: [
      { q: "Which of these is a valid variable name?", options: ["1name", "my-name", "myName", "my name"], answer: 2 },
      { q: "What does let score = 50 do?", options: ["Prints 50", "Creates a variable called score with value 50", "Deletes score", "None"], answer: 1 },
    ],
  },
  {
    id: 2,
    stage: "Stage 1",
    tag: "Data Types",
    title: "Numbers, Strings & Booleans",
    color: "bg-[#fde047]",
    xp: 100,
    simple: "Every value has a type. Numbers are for math, strings are for text (wrapped in quotes), and booleans are just true or false.",
    analogy: "Numbers are like coins, strings are like sticky notes with words, and booleans are like a light switch — on or off.",
    code: "let score = 95;          // Number\nlet city = \"Mumbai\";     // String\nlet passed = true;       // Boolean\n\nconsole.log(typeof score);  // \"number\"\nconsole.log(typeof city);   // \"string\"",
    questions: [
      { q: "What type is \"hello\"?", options: ["Number", "Boolean", "String", "Object"], answer: 2 },
      { q: "Which is a boolean?", options: ["42", "\"yes\"", "true", "null"], answer: 2 },
    ],
  },
  {
    id: 3,
    stage: "Stage 2",
    tag: "Conditions",
    title: "if / else — Making Decisions",
    color: "bg-[#c084fc]",
    xp: 150,
    simple: "if/else lets your code make decisions. If a condition is true, run one block. Otherwise, run another.",
    analogy: "Like a traffic light — if it's green, go. If it's red, stop. Your code does the same based on conditions.",
    code: "let marks = 75;\n\nif (marks >= 60) {\n  console.log(\"Pass!\");\n} else {\n  console.log(\"Try again.\");\n}\n// Output: Pass!",
    questions: [
      { q: "What prints if marks = 45?", options: ["Pass!", "Try again.", "Error", "Nothing"], answer: 1 },
      { q: "Which operator means 'greater than or equal to'?", options: ["==", ">=", "<=", "!="], answer: 1 },
    ],
  },
  {
    id: 4,
    stage: "Stage 3",
    tag: "Loops",
    title: "for Loop — Repeat Without Typing",
    color: "bg-[#38bdf8]",
    xp: 200,
    simple: "A for loop runs a block of code a set number of times. Instead of writing the same line 10 times, write it once inside a loop.",
    analogy: "Like setting an alarm to ring 5 times — you set it once, it repeats automatically.",
    code: "for (let i = 1; i <= 5; i++) {\n  console.log(\"Rep \" + i);\n}\n// Rep 1\n// Rep 2\n// Rep 3\n// Rep 4\n// Rep 5",
    questions: [
      { q: "How many times does the loop run if i goes from 1 to 5?", options: ["4", "5", "6", "10"], answer: 1 },
      { q: "What does i++ do?", options: ["Decreases i by 1", "Increases i by 1", "Resets i", "Stops the loop"], answer: 1 },
    ],
  },
  {
    id: 5,
    stage: "Stage 4",
    tag: "Functions",
    title: "Functions — Write Once, Use Anywhere",
    color: "bg-[#f472b6]",
    xp: 250,
    simple: "A function is a reusable block of code. You define it once with a name, then call it whenever you need it.",
    analogy: "Like a recipe — you write it once, and anyone can follow it as many times as they want.",
    code: "function greet(name) {\n  return \"Hello, \" + name + \"!\";\n}\n\nconsole.log(greet(\"Karan\")); // Hello, Karan!\nconsole.log(greet(\"Priya\")); // Hello, Priya!",
    questions: [
      { q: "What keyword defines a function?", options: ["var", "let", "function", "def"], answer: 2 },
      { q: "What does return do?", options: ["Stops the program", "Sends a value back from the function", "Prints to console", "Loops"], answer: 1 },
    ],
  },
  {
    id: 6,
    stage: "Stage 5",
    tag: "Arrays",
    title: "Arrays — Store Multiple Values",
    color: "bg-[#fb923c]",
    xp: 300,
    simple: "An array stores multiple values in one variable. Each value has an index starting from 0.",
    analogy: "Like a row of lockers — each locker has a number (index) and something inside (value).",
    code: "let fruits = [\"apple\", \"mango\", \"banana\"];\n\nconsole.log(fruits[0]); // apple\nconsole.log(fruits[2]); // banana\nconsole.log(fruits.length); // 3",
    questions: [
      { q: "What is fruits[1] if fruits = [\"apple\",\"mango\",\"banana\"]?", options: ["apple", "mango", "banana", "undefined"], answer: 1 },
      { q: "What does .length return?", options: ["Last item", "First item", "Number of items", "Index"], answer: 2 },
    ],
  },
];

function QuizQuestion({ q, options, answer }: { q: string; options: string[]; answer: number }) {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <div className="mt-4">
      <p className="font-black text-black mb-3 text-sm">{q}</p>
      <div className="grid grid-cols-2 gap-2">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`border-4 border-black px-3 py-2 font-bold text-sm text-left transition-all shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5
              ${selected === null ? "bg-white" : i === answer ? "bg-[#34d399]" : selected === i ? "bg-[#f472b6]" : "bg-white opacity-60"}`}
          >
            {opt}
          </button>
        ))}
      </div>
      {selected !== null && (
        <p className={`mt-2 font-black text-sm ${selected === answer ? "text-green-700" : "text-red-600"}`}>
          {selected === answer ? "Correct! +50 XP" : `Nope — correct answer: ${options[answer]}`}
        </p>
      )}
    </div>
  );
}

function TopicCard({ topic, isUnlocked }: { topic: typeof topics[0]; isUnlocked: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`border-4 border-black shadow-[6px_6px_0_0_#000] transition-all ${!isUnlocked ? "opacity-60" : "hover:-translate-y-0.5"}`}>
      {/* Header button */}
      <button
        onClick={() => isUnlocked && setOpen(!open)}
        className={`w-full ${topic.color} border-b-4 border-black px-6 py-4 flex items-center justify-between ${isUnlocked ? "cursor-pointer" : "cursor-not-allowed"}`}
      >
        <div className="flex items-center gap-3 flex-wrap">
          <span className="bg-black text-white font-black text-xs px-2 py-1 uppercase">{topic.stage}</span>
          <span className="bg-white border-2 border-black font-black text-xs px-2 py-1">{topic.tag}</span>
          <span className="font-black text-black text-base">{topic.title}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="bg-black text-white font-black text-xs px-3 py-1 flex items-center gap-1">
            <Zap className="w-3 h-3" /> +{topic.xp} XP
          </span>
          {!isUnlocked
            ? <Lock className="w-5 h-5 text-black" />
            : open
            ? <ChevronUp className="w-5 h-5" />
            : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {/* Upgrade wall for locked topics */}
      {!isUnlocked && (
        <div className="bg-[#1a1a2e] border-t-0 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-bold text-white/70 text-sm">This topic requires Pro or Beginner Pack.</p>
          <Link
            to="/pricing"
            className="shrink-0 bg-[#fde047] border-4 border-black font-black text-sm px-5 py-2 shadow-[3px_3px_0_0_#fde047] hover:-translate-y-0.5 transition-all text-black whitespace-nowrap"
          >
            View Plans &#8594;
          </Link>
        </div>
      )}

      {/* Content */}
      {open && isUnlocked && (
        <div className="bg-white px-6 py-6 flex flex-col gap-6">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-black/40 mb-2">Simple Explanation</p>
            <p className="font-bold text-black leading-relaxed">{topic.simple}</p>
          </div>
          <div className="bg-[#fde047] border-4 border-black p-4 shadow-[4px_4px_0_0_#000]">
            <p className="text-xs font-black uppercase tracking-widest text-black/50 mb-1">Real-Life Analogy</p>
            <p className="font-bold text-black">{topic.analogy}</p>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-black/40 mb-2">See It in Code</p>
            <div className="bg-[#1a1a2e] border-4 border-black p-4 overflow-x-auto">
              <pre className="font-mono text-sm text-[#34d399] leading-relaxed whitespace-pre">{topic.code}</pre>
            </div>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-black/40 mb-3">Practice Questions</p>
            <div className="flex flex-col gap-4">
              {topic.questions.map((q, i) => (
                <QuizQuestion key={i} {...q} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Learn() {
  const { canAccess } = useAuth();

  const unlockedCount = topics.filter((t) => canAccess(TOPIC_PLAN[t.id])).length;

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-[#fde047] border-b-4 border-black px-6 py-14">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-black uppercase tracking-widest text-black/50 mb-3">5-Minute Concepts</p>
          <h1 className="text-5xl md:text-7xl font-black text-black uppercase leading-tight mb-4">
            Learn Without<br />The Lecture.
          </h1>
          <p className="text-lg font-bold text-black/70 max-w-xl border-l-4 border-black pl-4">
            Every topic: simple explanation + real-life analogy + code example + 2 practice questions. No fluff.
          </p>
          <div className="flex items-center gap-4 mt-6 flex-wrap">
            <div className="bg-black text-white font-black px-4 py-2 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#34d399]" /> {unlockedCount}/{topics.length} topics unlocked
            </div>
            {unlockedCount < topics.length && (
              <Link to="/pricing" className="bg-white border-4 border-black font-black text-sm px-4 py-2 shadow-[4px_4px_0_0_#000] hover:-translate-y-0.5 transition-all">
                Unlock All →
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col gap-4">
        {topics.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            isUnlocked={canAccess(TOPIC_PLAN[topic.id])}
          />
        ))}
      </div>
    </div>
  );
}
