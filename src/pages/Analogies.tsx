import { useState } from "react";
import { Search, ChevronDown, ChevronUp, Lightbulb, Link as LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Concept {
  id: number;
  name: string;
  category: "Basics" | "Data Structures" | "Algorithms" | "OOP";
  emoji: string;
  technicalDef: string;
  englishAnalogy: string;
  hinglishAnalogy: string;
  funFact: string;
  dsaLink?: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const concepts: Concept[] = [
  {
    id: 1,
    name: "Array",
    category: "Basics",
    emoji: "📦",
    technicalDef: "An array is a linear data structure that stores elements at contiguous memory locations, each accessible by a numeric index starting at 0.",
    englishAnalogy: "A row of numbered lockers in a school — each locker has a fixed number and you can directly open any locker if you know its number.",
    hinglishAnalogy: "School ke numbered locker — har cheez ka ek fixed jagah hai. Locker number 3 chahiye? Seedha wahan jao, ek ek check karne ki zaroorat nahi!",
    funFact: "Arrays are the backbone of almost every program. Your contact list, your playlist, your Instagram feed — all stored as arrays under the hood.",
    dsaLink: "/dsa",
  },
  {
    id: 2,
    name: "Stack",
    category: "Data Structures",
    emoji: "🍽️",
    technicalDef: "A stack is a linear data structure that follows the Last In, First Out (LIFO) principle — the last element added is the first one removed.",
    englishAnalogy: "A stack of plates — you always add a new plate on top, and when you need one, you take from the top first. You can't grab the bottom plate without removing all the ones above.",
    hinglishAnalogy: "Dhabe mein plates ka stack — jo sabse upar rakhi hai woh pehle nikalti hai! LIFO matlab Last In, First Out. Neeche wali plate leni hai? Pehle upar wali hatao.",
    funFact: "Your browser's Back button uses a Stack! Every page you visit gets pushed onto the stack. Clicking Back pops the last page off.",
    dsaLink: "/dsa",
  },
  {
    id: 3,
    name: "Queue",
    category: "Data Structures",
    emoji: "🚌",
    technicalDef: "A queue is a linear data structure that follows the First In, First Out (FIFO) principle — the first element added is the first one removed.",
    englishAnalogy: "A bus stand line — whoever arrives first gets on the bus first. No cutting in line! New people join at the back, people leave from the front.",
    hinglishAnalogy: "Bus stand ki line — jo pehle aaya woh pehle jaega. Naya banda peeche lagta hai, aur aage wala pehle bus mein chadta hai. Queue mein cutting nahi chalti!",
    funFact: "Print queues, CPU task scheduling, and WhatsApp message delivery all use queues. Your messages are delivered in the exact order they were sent.",
    dsaLink: "/dsa",
  },
  {
    id: 4,
    name: "Linked List",
    category: "Data Structures",
    emoji: "🔗",
    technicalDef: "A linked list is a linear data structure where each element (node) contains a value and a pointer to the next node, forming a chain.",
    englishAnalogy: "Train bogies — each bogie is connected to the next one. To reach the 5th bogie, you have to walk through 1, 2, 3, 4. You can't jump directly.",
    hinglishAnalogy: "Train ke dibba — ek dusre se connected, sab ek chain mein. 5th dibba chahiye? Pehle 1, 2, 3, 4 se guzarna padega. Array ki tarah seedha jump nahi kar sakte.",
    funFact: "Music players use linked lists for playlists — each song points to the next. That's why 'Next' and 'Previous' buttons work so smoothly.",
    dsaLink: "/dsa",
  },
  {
    id: 5,
    name: "Tree",
    category: "Data Structures",
    emoji: "🌳",
    technicalDef: "A tree is a hierarchical data structure with a root node at the top, where each node can have child nodes, forming a parent-child relationship.",
    englishAnalogy: "Your family tree — your grandparents are at the top (root), their children are below, and their grandchildren are further below. Each person has exactly one parent (except the root).",
    hinglishAnalogy: "Family ka tree — dadi ke children, unke children, aur unke bhi children. Har insaan ka ek hi parent hota hai (root ko chhod ke). Ye hierarchy hi tree hai!",
    funFact: "Your computer's file system is a tree! C:/Users/Documents/Projects — each folder is a node with child folders and files.",
    dsaLink: "/dsa",
  },
  {
    id: 6,
    name: "Graph",
    category: "Data Structures",
    emoji: "🗺️",
    technicalDef: "A graph is a non-linear data structure consisting of nodes (vertices) connected by edges. Unlike trees, graphs can have cycles and multiple connections.",
    englishAnalogy: "Google Maps — cities are nodes, roads are edges. You can travel from Mumbai to Delhi via multiple routes. Some roads are one-way (directed graph).",
    hinglishAnalogy: "Google Maps — cities aur roads ka jaal. Mumbai se Delhi jaana hai? Multiple routes hain. Kuch roads one-way hain (directed graph). Ye sab graph hai!",
    funFact: "Facebook's friend network, LinkedIn connections, and Google's search algorithm (PageRank) are all based on graphs. You're literally living inside a graph!",
    dsaLink: "/dsa",
  },
  {
    id: 7,
    name: "Hash Map",
    category: "Data Structures",
    emoji: "📖",
    technicalDef: "A hash map (or hash table) stores key-value pairs and provides O(1) average time complexity for lookup, insertion, and deletion using a hash function.",
    englishAnalogy: "A dictionary — you look up a word (key) and instantly get its meaning (value). You don't read every word from page 1; you jump directly to the right page.",
    hinglishAnalogy: "Dictionary — word daalo, seedha meaning milti hai. Pura dictionary padhne ki zaroorat nahi. Hash map bhi aisa hi karta hai — key daalo, value seedha milti hai!",
    funFact: "Every time you log into a website, your password is checked using a hash map. Your username is the key, your hashed password is the value.",
    dsaLink: "/dsa",
  },
  {
    id: 8,
    name: "Loop",
    category: "Basics",
    emoji: "🔄",
    technicalDef: "A loop is a control structure that repeatedly executes a block of code as long as a specified condition is true, avoiding code repetition.",
    englishAnalogy: "An alarm clock that rings every morning — you set it once and it keeps ringing at the same time every day until you turn it off (the condition becomes false).",
    hinglishAnalogy: "Roz subah bajne wali ghadi — ek baar set karo, jab tak band na karo, bajti rahegi. Loop bhi aisa hi hai — condition true hai toh chalti rahegi!",
    funFact: "Without loops, to print numbers 1 to 1000, you'd need to write console.log() 1000 times. Loops let you do it in 3 lines.",
  },
  {
    id: 9,
    name: "Recursion",
    category: "Basics",
    emoji: "🪞",
    technicalDef: "Recursion is when a function calls itself with a smaller version of the same problem, until it reaches a base case that stops the recursion.",
    englishAnalogy: "Two mirrors facing each other — each mirror reflects the other's reflection, creating an infinite tunnel of images. Recursion is similar, but it stops at a base case.",
    hinglishAnalogy: "Do darpan aamne saamne — andar hi andar reflection jaata hai. Recursion bhi aisa hi hai, lekin ek base case hoti hai jahan ruk jaata hai, warna infinite loop!",
    funFact: "Google's search algorithm uses recursion to crawl the web. It visits a page, finds links, visits those pages, finds more links... until it's indexed the entire internet.",
  },
  {
    id: 10,
    name: "Function",
    category: "Basics",
    emoji: "🧰",
    technicalDef: "A function is a reusable, named block of code that performs a specific task. It can accept inputs (parameters) and return an output.",
    englishAnalogy: "A recipe — you write it once (define the function), and anyone can follow it as many times as they want (call the function). Change the ingredients (parameters) to get different results.",
    hinglishAnalogy: "Recipe — ek baar likho, baar baar banao. Ingredients (parameters) badlo, result alag milega. Function bhi aisa hi — ek baar define karo, baar baar call karo!",
    funFact: "The average professional codebase has thousands of functions. Without functions, every program would be millions of lines of repeated code.",
  },
  {
    id: 11,
    name: "Class & Object",
    category: "OOP",
    emoji: "🏭",
    technicalDef: "A class is a blueprint that defines properties and methods. An object is an instance of a class — the actual thing created from the blueprint.",
    englishAnalogy: "A blueprint of a house — the Class is the blueprint (defines rooms, doors, windows), and the Object is the actual house built from it. You can build many houses from one blueprint.",
    hinglishAnalogy: "Makaan ka naksha — Class naksha hai, Object actual ghar. Ek naksha se kai ghar ban sakte hain. Har ghar alag hai, lekin sab usi naksha se bane hain!",
    funFact: "Every button, input field, and image on a webpage is an object created from a class. The entire web is built on objects.",
  },
  {
    id: 12,
    name: "Inheritance",
    category: "OOP",
    emoji: "👨‍👦",
    technicalDef: "Inheritance allows a class (child) to inherit properties and methods from another class (parent), promoting code reuse and establishing a hierarchy.",
    englishAnalogy: "A son inherits his father's property and skills, but also adds his own. He doesn't start from zero — he builds on what his father already had.",
    hinglishAnalogy: "Beta pitaji ki property leta hai aur apni bhi banata hai. Zero se shuru nahi karta — pitaji ka sab kuch milta hai, plus apna naya bhi add karta hai. Yahi inheritance hai!",
    funFact: "React components use inheritance! Every component inherits from React.Component, which gives it setState, lifecycle methods, and more — for free.",
  },
  {
    id: 13,
    name: "Sorting",
    category: "Algorithms",
    emoji: "🃏",
    technicalDef: "Sorting algorithms arrange elements in a specific order (ascending or descending). Common ones include Bubble Sort O(n²), Merge Sort O(n log n), and Quick Sort O(n log n).",
    englishAnalogy: "Arranging playing cards in your hand by number — you pick up cards one by one and insert each in the right position. That's exactly how Insertion Sort works.",
    hinglishAnalogy: "Taash ke patton ko number ke hisaab se lagana — ek ek card uthao aur sahi jagah lagao. Yahi Insertion Sort hai. Bubble Sort mein bade cards 'bubble' karke end mein jaate hain!",
    funFact: "JavaScript's built-in .sort() uses TimSort — a hybrid of Merge Sort and Insertion Sort. It's so efficient that it's used in Python, Java, and Android too.",
    dsaLink: "/dsa",
  },
  {
    id: 14,
    name: "Binary Search",
    category: "Algorithms",
    emoji: "📚",
    technicalDef: "Binary search finds a target in a sorted array by repeatedly halving the search space. It runs in O(log n) — far faster than linear search's O(n).",
    englishAnalogy: "Finding a word in a dictionary — you open the middle, see if your word comes before or after, then open the middle of that half. You never read every word.",
    hinglishAnalogy: "Dictionary mein beech se kholna aur decide karna — upar ya neeche? Phir us half ke beech se kholna. Ek ek word padhne ki zaroorat nahi. Yahi binary search hai!",
    funFact: "Binary search can find any element in a sorted list of 1 billion items in just 30 steps. Linear search would take up to 1 billion steps.",
    dsaLink: "/dsa",
  },
  {
    id: 15,
    name: "Stack Overflow",
    category: "Basics",
    emoji: "🥞",
    technicalDef: "A stack overflow occurs when a program's call stack exceeds its memory limit, usually caused by infinite recursion or extremely deep function call chains.",
    englishAnalogy: "A pancake stack so tall it falls over — you keep adding pancakes (function calls) without ever removing any, until the stack collapses under its own weight.",
    hinglishAnalogy: "Itni zyada plates rakh di ki sab gir gayi! Recursion mein base case bhool gaye? Function khud ko call karta rahega jab tak memory full na ho jaye — Stack Overflow!",
    funFact: "The world's most popular programming Q&A site is named after this error — Stack Overflow. Every developer has caused one at least once.",
  },
  {
    id: 16,
    name: "Pointer",
    category: "Basics",
    emoji: "🏠",
    technicalDef: "A pointer is a variable that stores the memory address of another variable, rather than the value itself. It 'points to' where the data lives in memory.",
    englishAnalogy: "A person's home address — the address is not the house itself, it just tells you where the house is. You can share the address with many people without copying the house.",
    hinglishAnalogy: "Ghar ka address — ghar nahi, bas batata hai kahan hai. Address share karo, ghar copy nahi hota. Pointer bhi aisa — value nahi, memory address store karta hai!",
    funFact: "In JavaScript, objects and arrays are passed by reference (like a pointer). That's why modifying an object inside a function changes the original — you're working with the address, not a copy.",
  },
  {
    id: 17,
    name: "Time Complexity",
    category: "Algorithms",
    emoji: "⏱️",
    technicalDef: "Time complexity describes how the runtime of an algorithm grows as the input size (n) increases. Expressed in Big O notation: O(1), O(n), O(log n), O(n²), etc.",
    englishAnalogy: "Finding a friend in a crowd — if there are 10 people, it's quick. If there are 10,000 people, it takes much longer. Time complexity measures exactly how much longer.",
    hinglishAnalogy: "Bheed mein dost dhundhna — 10 log hain toh jaldi milega, 10,000 hain toh zyada time lagega. Time complexity batata hai — input badhne par kitna zyada time lagega!",
    funFact: "Google processes 8.5 billion searches per day. If their search algorithm was O(n) instead of O(log n), it would be millions of times slower. Big O literally runs the internet.",
    dsaLink: "/dsa",
  },
  {
    id: 18,
    name: "Space Complexity",
    category: "Algorithms",
    emoji: "🎒",
    technicalDef: "Space complexity measures how much extra memory an algorithm uses relative to the input size. O(1) means constant space; O(n) means space grows with input.",
    englishAnalogy: "Packing a bag for a trip — a minimalist packs the same small bag regardless of trip length (O(1) space). Someone who packs one outfit per day uses more space as the trip gets longer (O(n) space).",
    hinglishAnalogy: "Bag mein kitna saman — wahi space complexity. Ek hi bag leke jaate ho chahe 2 din ka trip ho ya 20 din ka? Woh O(1). Har din ke liye alag bag? Woh O(n)!",
    funFact: "The two-pointer technique is loved in interviews because it solves many array problems in O(1) extra space — no extra arrays needed, just two index variables.",
    dsaLink: "/dsa",
  },
];

const CATEGORIES = ["All", "Basics", "Data Structures", "Algorithms", "OOP"] as const;
const LANG_KEY = "codestart_lang";

// ── Card Component ────────────────────────────────────────────────────────────
function ConceptCard({ concept, hinglish }: { concept: Concept; hinglish: boolean }) {
  const [expanded, setExpanded] = useState(false);

  const categoryColors: Record<string, string> = {
    Basics: "bg-[#34d399]",
    "Data Structures": "bg-[#38bdf8]",
    Algorithms: "bg-[#f472b6]",
    OOP: "bg-[#c084fc]",
  };
  const color = categoryColors[concept.category] ?? "bg-[#fde047]";

  return (
    <div className="border-4 border-black shadow-[6px_6px_0_0_#000] bg-white flex flex-col hover:-translate-y-0.5 transition-all">
      {/* Card header */}
      <div className={`${color} border-b-4 border-black px-5 py-4 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{concept.emoji}</span>
          <div>
            <h3 className="font-black text-black text-lg uppercase">{concept.name}</h3>
            <span className="bg-black text-white font-black text-[10px] px-2 py-0.5 uppercase tracking-widest">
              {concept.category}
            </span>
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="px-5 py-5 flex flex-col gap-4 flex-1">
        {/* Technical definition */}
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-black/40 mb-1.5 flex items-center gap-1">
            📘 Technical Definition
          </p>
          <p className="font-bold text-black/80 text-sm leading-relaxed">{concept.technicalDef}</p>
        </div>

        {/* Analogy */}
        <div className="bg-[#fde047] border-4 border-black p-4 shadow-[3px_3px_0_0_#000]">
          <p className="text-xs font-black uppercase tracking-widest text-black/50 mb-1.5">
            🇮🇳 Real Life Analogy
          </p>
          <p className="font-bold text-black text-sm leading-relaxed">
            {hinglish ? concept.hinglishAnalogy : concept.englishAnalogy}
          </p>
        </div>

        {/* Fun fact (collapsible) */}
        <div className="border-4 border-black">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between px-4 py-3 bg-[#1a1a2e] hover:bg-[#1a1a2e]/80 transition-colors"
          >
            <span className="font-black text-[#fde047] text-xs flex items-center gap-2">
              <Lightbulb className="w-3.5 h-3.5" /> Fun Fact
            </span>
            {expanded
              ? <ChevronUp className="w-4 h-4 text-white/50" />
              : <ChevronDown className="w-4 h-4 text-white/50" />}
          </button>
          {expanded && (
            <div className="bg-[#0d0d1a] px-4 py-3 border-t-4 border-black">
              <p className="font-bold text-white/80 text-xs leading-relaxed">{concept.funFact}</p>
            </div>
          )}
        </div>
      </div>

      {/* Card footer */}
      {concept.dsaLink && (
        <div className="border-t-4 border-black px-5 py-3">
          <Link
            to={concept.dsaLink}
            className="flex items-center gap-2 font-black text-xs text-black hover:underline"
          >
            <LinkIcon className="w-3.5 h-3.5" /> See Code Example →
          </Link>
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Analogies() {
  const [hinglish, setHinglish] = useState(() => localStorage.getItem(LANG_KEY) === "hi");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");

  const query = search.toLowerCase().trim();
  const filtered = concepts.filter((c) => {
    const matchCat = category === "All" || c.category === category;
    const matchSearch =
      !query ||
      c.name.toLowerCase().includes(query) ||
      c.category.toLowerCase().includes(query) ||
      c.technicalDef.toLowerCase().includes(query) ||
      c.englishAnalogy.toLowerCase().includes(query) ||
      c.hinglishAnalogy.toLowerCase().includes(query);
    return matchCat && matchSearch;
  });

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-[#c084fc] border-b-4 border-black px-6 py-14 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(#000 2px, transparent 2px)", backgroundSize: "24px 24px" }}
        />
        <div className="max-w-5xl mx-auto relative z-10">
          <p className="text-sm font-black uppercase tracking-widest text-black/50 mb-3">Desi Analogies</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl md:text-7xl font-black text-black uppercase leading-tight mb-4">
                Coding In<br />Your Language.
              </h1>
              <p className="text-lg font-bold text-black/70 max-w-xl border-l-4 border-black pl-4">
                Every DSA concept explained with something you already know from real Indian life. No fear, no confusion.
              </p>
            </div>
            {/* Language toggle */}
            <div className="shrink-0">
              <div className="flex border-4 border-black shadow-[4px_4px_0_0_#000] overflow-hidden">
                <button
                  onClick={() => { setHinglish(false); localStorage.setItem(LANG_KEY, "en"); }}
                  className={`px-5 py-3 font-black text-sm transition-colors ${!hinglish ? "bg-black text-white" : "bg-white text-black hover:bg-black/10"}`}
                >
                  English
                </button>
                <button
                  onClick={() => { setHinglish(true); localStorage.setItem(LANG_KEY, "hi"); }}
                  className={`px-5 py-3 font-black text-sm transition-colors border-l-4 border-black ${hinglish ? "bg-black text-white" : "bg-white text-black hover:bg-black/10"}`}
                >
                  Hinglish 🇮🇳
                </button>
              </div>
              <p className="font-bold text-black/50 text-xs mt-2 text-center">
                {hinglish ? "Hinglish mode on!" : "Switch to Hinglish →"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="border-b-4 border-black bg-white sticky top-[80px] z-30 px-6 py-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex items-center gap-3 bg-white border-4 border-black shadow-[4px_4px_0_0_#000] px-4 py-2.5 flex-1">
            <Search className="w-4 h-4 text-black/40 shrink-0" />
            <input
              type="text"
              placeholder="Search concept... (e.g. Stack, Loop, Array)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 font-bold text-black text-sm outline-none placeholder:text-black/30 bg-transparent"
            />
            {search && (
              <button onClick={() => setSearch("")} className="font-black text-black/40 hover:text-black text-xs">✕</button>
            )}
          </div>
          {/* Category filters */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`font-black text-xs px-4 py-2.5 border-4 border-black shadow-[3px_3px_0_0_#000] transition-all hover:-translate-y-0.5
                  ${category === cat ? "bg-black text-white" : "bg-white text-black"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="max-w-5xl mx-auto px-6 pt-8 pb-2">
        <p className="font-black text-black/40 text-sm">
          {filtered.length} concept{filtered.length !== 1 ? "s" : ""}
          {category !== "All" ? ` in ${category}` : ""}
          {query ? ` matching "${search}"` : ""}
        </p>
      </div>

      {/* Cards grid */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🤔</p>
            <p className="font-black text-black/40 text-lg">No concepts found for "{search}"</p>
            <button onClick={() => { setSearch(""); setCategory("All"); }} className="mt-4 font-black text-sm text-black underline">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((concept) => (
              <ConceptCard key={concept.id} concept={concept} hinglish={hinglish} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="bg-[#1a1a2e] border-t-4 border-black px-6 py-14 text-center mt-8">
        <p className="text-sm font-black uppercase tracking-widest text-white/40 mb-3">Next Step</p>
        <h2 className="text-4xl font-black text-white uppercase mb-4">Now See It Moving</h2>
        <p className="font-bold text-white/60 mb-8 max-w-md mx-auto">
          Understanding the analogy is step one. Now watch these data structures come alive with animations.
        </p>
        <Link
          to="/playground"
          className="inline-flex items-center gap-3 bg-[#fde047] border-4 border-black font-black text-lg px-8 py-4 shadow-[6px_6px_0_0_#000] hover:-translate-y-1 hover:shadow-[10px_10px_0_0_#000] transition-all text-black"
        >
          Go to Visual Playground →
        </Link>
      </div>
    </div>
  );
}
