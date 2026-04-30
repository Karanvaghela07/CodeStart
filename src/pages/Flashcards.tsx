import { useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle, Check, X, Zap } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface Flashcard {
  id: number;
  category: string;
  color: string;
  front: string;
  back: string;
  example?: string;
}

const allCards: Flashcard[] = [
  // ── Basics ──────────────────────────────────────────────────────────────────
  { id: 1,  category: "Basics",      color: "bg-[#34d399]", front: "What is a variable?",                back: "A named container that stores a value. You can change the value later (unless it's const).", example: "let score = 100;" },
  { id: 2,  category: "Basics",      color: "bg-[#34d399]", front: "What is the difference between let, const, and var?", back: "let: block-scoped, can be reassigned.\nconst: block-scoped, cannot be reassigned.\nvar: function-scoped, avoid using it.", example: "let x = 1;\nconst PI = 3.14;" },
  { id: 3,  category: "Basics",      color: "bg-[#34d399]", front: "What is a function?",               back: "A reusable block of code with a name. You define it once and call it whenever needed.", example: "function greet(name) {\n  return 'Hi ' + name;\n}" },
  { id: 4,  category: "Basics",      color: "bg-[#34d399]", front: "What does typeof do?",              back: "Returns the data type of a value as a string: 'number', 'string', 'boolean', 'object', 'undefined', 'function'.", example: "typeof 42      // 'number'\ntypeof 'hi'    // 'string'" },
  { id: 5,  category: "Basics",      color: "bg-[#34d399]", front: "What is a boolean?",                back: "A value that is either true or false. Used in conditions and comparisons.", example: "let isLoggedIn = true;\nlet isEmpty = false;" },
  // ── Arrays ──────────────────────────────────────────────────────────────────
  { id: 6,  category: "Arrays",      color: "bg-[#fde047]", front: "What is an array?",                 back: "An ordered list of values stored in one variable. Each value has an index starting at 0.", example: "let fruits = ['apple','mango','banana'];\nfruits[0] // 'apple'" },
  { id: 7,  category: "Arrays",      color: "bg-[#fde047]", front: "What does .push() do?",             back: "Adds one or more elements to the END of an array and returns the new length.", example: "let arr = [1,2,3];\narr.push(4); // [1,2,3,4]" },
  { id: 8,  category: "Arrays",      color: "bg-[#fde047]", front: "What does .pop() do?",              back: "Removes and returns the LAST element of an array.", example: "let arr = [1,2,3];\narr.pop(); // returns 3, arr = [1,2]" },
  { id: 9,  category: "Arrays",      color: "bg-[#fde047]", front: "What does .map() do?",              back: "Creates a NEW array by applying a function to every element. The original array is unchanged.", example: "let nums = [1,2,3];\nlet doubled = nums.map(n => n*2);\n// [2,4,6]" },
  { id: 10, category: "Arrays",      color: "bg-[#fde047]", front: "What does .filter() do?",           back: "Creates a NEW array with only the elements that pass a test (return true).", example: "let nums = [1,2,3,4,5];\nlet evens = nums.filter(n => n%2===0);\n// [2,4]" },
  { id: 11, category: "Arrays",      color: "bg-[#fde047]", front: "What does .reduce() do?",           back: "Reduces an array to a single value by applying a function to each element and accumulating the result.", example: "let sum = [1,2,3,4].reduce((acc,n) => acc+n, 0);\n// 10" },
  // ── Objects ─────────────────────────────────────────────────────────────────
  { id: 12, category: "Objects",     color: "bg-[#38bdf8]", front: "What is an object?",                back: "A collection of key-value pairs. Keys are strings (or symbols), values can be anything.", example: "let user = {\n  name: 'Karan',\n  age: 20\n};\nuser.name // 'Karan'" },
  { id: 13, category: "Objects",     color: "bg-[#38bdf8]", front: "How do you access object properties?", back: "Two ways: dot notation (obj.key) or bracket notation (obj['key']). Use bracket notation when the key is dynamic.", example: "user.name\nuser['name']" },
  { id: 14, category: "Objects",     color: "bg-[#38bdf8]", front: "What is destructuring?",            back: "A shorthand to extract values from objects or arrays into variables.", example: "const { name, age } = user;\nconst [first, second] = arr;" },
  // ── DSA ─────────────────────────────────────────────────────────────────────
  { id: 15, category: "DSA",         color: "bg-[#c084fc]", front: "What is Big O notation?",           back: "A way to describe how the runtime or space of an algorithm grows as input size grows. O(1) is constant, O(n) is linear, O(n²) is quadratic.", example: "O(1)  — array access\nO(n)  — linear search\nO(n²) — bubble sort" },
  { id: 16, category: "DSA",         color: "bg-[#c084fc]", front: "What is a stack?",                  back: "A data structure that follows LIFO — Last In, First Out. Like a pile of plates: you add and remove from the top only.", example: "push(1), push(2), push(3)\npop() → 3\npop() → 2" },
  { id: 17, category: "DSA",         color: "bg-[#c084fc]", front: "What is a queue?",                  back: "A data structure that follows FIFO — First In, First Out. Like a line at a counter: first person in is first served.", example: "enqueue(1), enqueue(2)\ndequeue() → 1\ndequeue() → 2" },
  { id: 18, category: "DSA",         color: "bg-[#c084fc]", front: "What is binary search?",            back: "An algorithm that finds a target in a SORTED array by repeatedly halving the search space. O(log n) — much faster than linear search.", example: "Array: [1,3,5,7,9]\nTarget: 7\nCheck middle (5) → go right\nCheck middle (7) → found!" },
  { id: 19, category: "DSA",         color: "bg-[#c084fc]", front: "What is a linked list?",            back: "A chain of nodes where each node holds a value and a pointer to the next node. Unlike arrays, elements are not stored contiguously in memory.", example: "1 → 2 → 3 → null\nAccess: O(n)\nInsert at head: O(1)" },
  { id: 20, category: "DSA",         color: "bg-[#c084fc]", front: "What is recursion?",                back: "A function that calls itself with a smaller version of the same problem. Every recursive function needs a base case (when to stop).", example: "function factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n-1);\n}" },
  // ── Concepts ────────────────────────────────────────────────────────────────
  { id: 21, category: "Concepts",    color: "bg-[#fb923c]", front: "What is time complexity?",          back: "How the runtime of an algorithm scales with input size. We care about the worst case. Expressed in Big O notation.", example: "Loop once → O(n)\nNested loops → O(n²)\nHalving each step → O(log n)" },
  { id: 22, category: "Concepts",    color: "bg-[#fb923c]", front: "What is space complexity?",         back: "How much extra memory an algorithm uses relative to input size. O(1) means constant extra space regardless of input.", example: "Two pointer → O(1) space\nRecursion depth n → O(n) space" },
  { id: 23, category: "Concepts",    color: "bg-[#fb923c]", front: "What is memoization?",              back: "Storing the results of expensive function calls so you don't recompute them. The core idea behind dynamic programming.", example: "fib(40) without memo: O(2^40)\nfib(40) with memo: O(40)" },
  { id: 24, category: "Concepts",    color: "bg-[#fb923c]", front: "What is the two-pointer technique?", back: "Using two variables (pointers) that move through an array — usually from both ends toward the middle. Reduces O(n²) to O(n).", example: "Pair sum, palindrome check,\nremove duplicates from sorted array" },
  { id: 25, category: "Concepts",    color: "bg-[#fb923c]", front: "What is a hash map?",               back: "A data structure that stores key-value pairs with O(1) average lookup, insert, and delete. Implemented as an object or Map in JavaScript.", example: "const map = {};\nmap['key'] = 'value';\nmap['key'] // 'value' — O(1)" },
];

const categories = ["All", ...Array.from(new Set(allCards.map(c => c.category)))];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function Flashcards() {
  const { addXP, user } = useAuth();
  const [category, setCategory] = useState("All");
  const [deck, setDeck] = useState(allCards);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<number[]>([]);
  const [unknown, setUnknown] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const filtered = category === "All" ? deck : deck.filter(c => c.category === category);
  const card = filtered[idx];
  const progress = filtered.length > 0 ? Math.round(((known.length + unknown.length) / filtered.length) * 100) : 0;

  const changeCategory = (cat: string) => {
    setCategory(cat);
    setIdx(0);
    setFlipped(false);
    setKnown([]);
    setUnknown([]);
    setDone(false);
  };

  const next = (result: "know" | "dontknow") => {
    if (!card) return;
    if (result === "know") {
      setKnown(k => [...k, card.id]);
      if (user) addXP(10);
    } else {
      setUnknown(u => [...u, card.id]);
    }
    setFlipped(false);
    if (idx + 1 >= filtered.length) { setDone(true); return; }
    setIdx(i => i + 1);
  };

  const reset = () => { setIdx(0); setFlipped(false); setKnown([]); setUnknown([]); setDone(false); };
  const reshuffleUnknown = () => {
    const unknownCards = allCards.filter(c => unknown.includes(c.id));
    setDeck(shuffle(unknownCards));
    setIdx(0); setFlipped(false); setKnown([]); setUnknown([]); setDone(false);
  };
  const reshuffleAll = () => { setDeck(shuffle(allCards)); reset(); };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-[#fde047] border-b-4 border-black px-6 py-12 text-center">
        <p className="text-sm font-black uppercase tracking-widest text-black/50 mb-3">Flashcards</p>
        <h1 className="text-5xl md:text-6xl font-black text-black uppercase leading-tight mb-4">
          Study Smarter.
        </h1>
        <p className="text-lg font-bold text-black/70 max-w-xl mx-auto">
          {allCards.length} cards across {categories.length - 1} categories. Flip to reveal, mark what you know, drill what you don&apos;t.
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(cat => (
            <button key={cat} onClick={() => changeCategory(cat)}
              className={`font-black text-sm px-4 py-2 border-4 border-black shadow-[3px_3px_0_0_#000] transition-all hover:-translate-y-0.5
                ${category === cat ? "bg-black text-white" : "bg-white text-black"}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-black/50 text-xs">{known.length + unknown.length}/{filtered.length} reviewed</span>
            <span className="font-bold text-black/50 text-xs">{progress}%</span>
          </div>
          <div className="bg-black/10 border-2 border-black h-3 overflow-hidden">
            <div className="h-full bg-[#34d399] transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex items-center gap-4 mt-2">
            <span className="font-bold text-xs text-[#34d399] flex items-center gap-1"><Check className="w-3 h-3" /> {known.length} known</span>
            <span className="font-bold text-xs text-[#f472b6] flex items-center gap-1"><X className="w-3 h-3" /> {unknown.length} review</span>
          </div>
        </div>

        {/* Done screen */}
        {done ? (
          <div className="border-4 border-black shadow-[8px_8px_0_0_#000] bg-white p-8 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-3xl font-black text-black uppercase mb-2">Deck Complete!</h2>
            <p className="font-bold text-black/60 mb-2">{known.length} known · {unknown.length} need review</p>
            <p className="font-bold text-[#34d399] text-sm mb-6">+{known.length * 10} XP earned</p>
            <div className="flex flex-col gap-3">
              {unknown.length > 0 && (
                <button onClick={reshuffleUnknown}
                  className="w-full bg-[#f472b6] border-4 border-black font-black py-3 shadow-[4px_4px_0_0_#000] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                  <RotateCcw className="w-4 h-4" /> Drill {unknown.length} cards I missed
                </button>
              )}
              <button onClick={reset}
                className="w-full bg-[#fde047] border-4 border-black font-black py-3 shadow-[4px_4px_0_0_#000] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                <RotateCcw className="w-4 h-4" /> Restart this deck
              </button>
              <button onClick={reshuffleAll}
                className="w-full bg-white border-4 border-black font-black py-3 shadow-[4px_4px_0_0_#000] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                <Shuffle className="w-4 h-4" /> Shuffle all cards
              </button>
            </div>
          </div>
        ) : card ? (
          <>
            {/* Card counter */}
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-black/50 text-sm">Card {idx + 1} of {filtered.length}</span>
              <div className="flex gap-2">
                <button onClick={() => { if (idx > 0) { setIdx(i => i - 1); setFlipped(false); } }}
                  disabled={idx === 0}
                  className="border-4 border-black p-1.5 bg-white shadow-[2px_2px_0_0_#000] hover:-translate-y-0.5 transition-all disabled:opacity-30">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={reshuffleAll} className="border-4 border-black p-1.5 bg-white shadow-[2px_2px_0_0_#000] hover:-translate-y-0.5 transition-all">
                  <Shuffle className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Flashcard */}
            <div
              onClick={() => setFlipped(!flipped)}
              className={`border-4 border-black shadow-[8px_8px_0_0_#000] cursor-pointer transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#000] select-none min-h-[280px] flex flex-col`}
            >
              {/* Card header */}
              <div className={`${card.color} border-b-4 border-black px-5 py-3 flex items-center justify-between`}>
                <span className="bg-black text-white font-black text-xs px-3 py-1">{card.category}</span>
                <span className="font-bold text-black/60 text-xs">{flipped ? "Answer" : "Click to flip"}</span>
              </div>

              {/* Card body */}
              <div className="flex-1 flex flex-col justify-center px-6 py-8 bg-white">
                {!flipped ? (
                  <p className="font-black text-black text-xl text-center leading-snug">{card.front}</p>
                ) : (
                  <div className="flex flex-col gap-4">
                    <p className="font-bold text-black text-base leading-relaxed">{card.back}</p>
                    {card.example && (
                      <div className="bg-[#0d0d1a] border-4 border-black p-4">
                        <pre className="font-mono text-xs text-[#34d399] whitespace-pre">{card.example}</pre>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Flip indicator */}
              <div className="border-t-4 border-black px-5 py-3 bg-black/5 text-center">
                <span className="font-bold text-black/40 text-xs">{flipped ? "Did you know this?" : "Tap to see the answer"}</span>
              </div>
            </div>

            {/* Know / Don't know buttons */}
            {flipped && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <button onClick={() => next("dontknow")}
                  className="bg-[#f472b6] border-4 border-black font-black text-base py-4 shadow-[4px_4px_0_0_#000] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                  <X className="w-5 h-5" /> Still Learning
                </button>
                <button onClick={() => next("know")}
                  className="bg-[#34d399] border-4 border-black font-black text-base py-4 shadow-[4px_4px_0_0_#000] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                  <Check className="w-5 h-5" /> Got It! +10 XP
                </button>
              </div>
            )}

            {!flipped && (
              <p className="text-center font-bold text-black/40 text-sm mt-4">Click the card to reveal the answer</p>
            )}
          </>
        ) : (
          <p className="text-center font-bold text-black/50 py-10">No cards in this category.</p>
        )}
      </div>
    </div>
  );
}
