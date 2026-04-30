import { useState } from "react";
import { Bot, Clipboard, Sparkles } from "lucide-react";

const examples = [
  { label: "for loop", code: "for (let i = 0; i < 5; i++) {\n  console.log(i);\n}" },
  { label: "arrow function", code: "const add = (a, b) => a + b;\nconsole.log(add(3, 4));" },
  { label: "array map", code: "const nums = [1, 2, 3];\nconst doubled = nums.map(n => n * 2);\nconsole.log(doubled);" },
];

function getExplanation(code: string): string {
  const c = code.toLowerCase();
  if (c.includes("for") && c.includes("i++")) {
    return "This is a for loop.\n\n1. let i = 0  Start counting from 0.\n2. i < 5  Keep going as long as i is less than 5.\n3. i++  After each round, add 1 to i.\n4. console.log(i)  Print the current value of i.\n\nResult: prints 0, 1, 2, 3, 4 — five times total.\n\nReal-life analogy: Like doing 5 push-ups and counting each one out loud.";
  }
  if (c.includes("=>") && c.includes("a + b")) {
    return "This is an arrow function.\n\n1. const add = (a, b) => ...  Creates a function called add that takes two inputs: a and b.\n2. a + b  Returns the sum (no need to write return for single expressions).\n3. add(3, 4)  Calls the function with 3 and 4, so it returns 7.\n\nReal-life analogy: Like a calculator button — you press + with two numbers, it gives you the result.";
  }
  if (c.includes(".map")) {
    return "This uses the .map() array method.\n\n1. const nums = [1, 2, 3]  An array with three numbers.\n2. nums.map(n => n * 2)  Goes through every item, multiplies it by 2, builds a new array.\n3. The result is [2, 4, 6].\n\nReal-life analogy: Like a photocopier that doubles every page — original stays the same, you get a new copy with changes.";
  }
  if (c.trim().length === 0) return "";
  return (
    "Here's what this code does, step by step:\n\n" +
    code
      .split("\n")
      .filter(Boolean)
      .map((line, i) => "Line " + (i + 1) + ": " + line.trim() + "  This line runs as part of the program's logic.")
      .join("\n") +
    "\n\nTip: Paste a specific snippet (loop, function, condition) for a more detailed breakdown."
  );
}

export default function AIExplain() {
  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);

  const explain = () => {
    if (!code.trim()) return;
    setLoading(true);
    setExplanation("");
    setTimeout(() => {
      setExplanation(getExplanation(code));
      setLoading(false);
    }, 900);
  };

  const loadExample = (ex: typeof examples[0]) => {
    setCode(ex.code);
    setExplanation("");
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-[#1a1a2e] border-b-4 border-black px-6 py-14 text-center">
        <p className="text-sm font-black uppercase tracking-widest text-white/40 mb-3">AI Explain My Code</p>
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase leading-tight mb-4">
          Confused by<br />Code?
        </h1>
        <p className="text-lg font-bold text-white/60 max-w-xl mx-auto">
          Paste any snippet and get a plain-English breakdown. No jargon, no lectures. Your 11pm coding buddy.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-6">
          <p className="text-xs font-black uppercase tracking-widest text-black/40 mb-3">Try an example</p>
          <div className="flex flex-wrap gap-3">
            {examples.map((ex) => (
              <button
                key={ex.label}
                onClick={() => loadExample(ex)}
                className="bg-[#fde047] border-4 border-black font-black text-sm px-4 py-2 shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5 transition-all"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col border-4 border-black shadow-[8px_8px_0_0_#000]">
            <div className="bg-[#fde047] border-b-4 border-black px-5 py-3 flex items-center justify-between">
              <span className="font-black text-black flex items-center gap-2">
                <Clipboard className="w-5 h-5" /> Paste Your Code
              </span>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#f472b6] border-2 border-black" />
                <div className="w-3 h-3 rounded-full bg-[#fde047] border-2 border-black" />
                <div className="w-3 h-3 rounded-full bg-[#34d399] border-2 border-black" />
              </div>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 min-h-[280px] resize-none bg-[#1a1a2e] p-5 font-mono text-sm text-[#34d399] leading-relaxed focus:outline-none placeholder:text-white/20"
              placeholder={"// Paste any code here...\nconst x = 5;\nconsole.log(x);"}
            />
            <button
              onClick={explain}
              disabled={!code.trim() || loading}
              className="bg-[#34d399] border-t-4 border-black px-6 py-4 font-black text-lg text-black flex items-center justify-center gap-3 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? <span className="flex items-center gap-2"><Sparkles className="w-5 h-5 animate-spin" /> Thinking...</span>
                : <span className="flex items-center gap-2"><Bot className="w-5 h-5" /> Explain This Code</span>
              }
            </button>
          </div>

          <div className="flex flex-col border-4 border-black shadow-[8px_8px_0_0_#000]">
            <div className="bg-[#c084fc] border-b-4 border-black px-5 py-3 flex items-center gap-2">
              <Bot className="w-5 h-5 text-black" />
              <span className="font-black text-black">AI Breakdown</span>
            </div>
            <div className="flex-1 min-h-[280px] bg-white p-5 overflow-y-auto">
              {!explanation && !loading && (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-10">
                  <Bot className="w-12 h-12 text-black/20" />
                  <p className="font-bold text-black/40 text-sm max-w-xs">
                    Paste some code on the left and hit Explain — I'll break it down in plain English.
                  </p>
                </div>
              )}
              {loading && (
                <div className="flex flex-col items-center justify-center h-full gap-3 py-10">
                  <Sparkles className="w-10 h-10 text-[#c084fc] animate-spin" />
                  <p className="font-black text-black/50 text-sm">Reading your code...</p>
                </div>
              )}
              {explanation && !loading && (
                <pre className="font-bold text-black text-sm leading-relaxed whitespace-pre-wrap">{explanation}</pre>
              )}
            </div>
            {explanation && (
              <div className="bg-[#34d399] border-t-4 border-black px-5 py-3 font-black text-sm text-black flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> +100 XP earned for using AI Explain
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 bg-[#1a1a2e] border-4 border-black p-6 shadow-[6px_6px_0_0_#000]">
          <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-3">Why This Feature Exists</p>
          <p className="font-bold text-white/80 leading-relaxed text-sm max-w-2xl">
            Most students give up at 11pm when they're stuck and have no one to ask. This tool gives you an instant,
            jargon-free explanation of any code — so you never have to stop because you're confused.
          </p>
        </div>
      </div>
    </div>
  );
}
