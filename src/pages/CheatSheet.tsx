import { useState } from "react";
import { Copy, Check, Search, BookOpen } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Snippet {
  title: string;
  desc: string;
  code: string;
  tags: string[];
}

interface Category {
  id: string;
  label: string;
  color: string;
  snippets: Snippet[];
}

// ── Data ──────────────────────────────────────────────────────────────────────
const CATEGORIES: Category[] = [
  {
    id: "array",
    label: "Array Methods",
    color: "bg-[#34d399]",
    snippets: [
      {
        title: "map — transform each item",
        desc: "Returns a new array with each element transformed.",
        tags: ["map", "transform", "array"],
        code: `const nums = [1, 2, 3];
const doubled = nums.map(n => n * 2);
// [2, 4, 6]`,
      },
      {
        title: "filter — keep matching items",
        desc: "Returns a new array with only items that pass the test.",
        tags: ["filter", "array", "condition"],
        code: `const nums = [1, 2, 3, 4, 5];
const evens = nums.filter(n => n % 2 === 0);
// [2, 4]`,
      },
      {
        title: "reduce — collapse to single value",
        desc: "Accumulates array values into one result.",
        tags: ["reduce", "sum", "array"],
        code: `const nums = [1, 2, 3, 4];
const sum = nums.reduce((acc, n) => acc + n, 0);
// 10`,
      },
      {
        title: "find — first matching item",
        desc: "Returns the first element that satisfies the condition.",
        tags: ["find", "search", "array"],
        code: `const users = [{ id: 1 }, { id: 2 }, { id: 3 }];
const user = users.find(u => u.id === 2);
// { id: 2 }`,
      },
      {
        title: "some / every — boolean checks",
        desc: "some: at least one matches. every: all must match.",
        tags: ["some", "every", "boolean", "array"],
        code: `const nums = [1, 2, 3, 4];
nums.some(n => n > 3);   // true
nums.every(n => n > 0);  // true
nums.every(n => n > 2);  // false`,
      },
      {
        title: "flat / flatMap",
        desc: "flat flattens nested arrays. flatMap maps then flattens one level.",
        tags: ["flat", "flatMap", "nested", "array"],
        code: `[1, [2, [3]]].flat();      // [1, 2, [3]]
[1, [2, [3]]].flat(Infinity); // [1, 2, 3]

[1, 2, 3].flatMap(n => [n, n * 2]);
// [1, 2, 2, 4, 3, 6]`,
      },
      {
        title: "sort — sort in place",
        desc: "Sorts the array in place. Always pass a comparator for numbers.",
        tags: ["sort", "array", "order"],
        code: `// Strings (default)
["banana", "apple"].sort(); // ["apple", "banana"]

// Numbers (need comparator!)
[10, 1, 5].sort((a, b) => a - b); // [1, 5, 10]
[10, 1, 5].sort((a, b) => b - a); // [10, 5, 1]`,
      },
      {
        title: "spread & concat",
        desc: "Merge arrays without mutating originals.",
        tags: ["spread", "concat", "merge", "array"],
        code: `const a = [1, 2];
const b = [3, 4];

const merged = [...a, ...b];   // [1, 2, 3, 4]
const merged2 = a.concat(b);   // [1, 2, 3, 4]`,
      },
      {
        title: "Array.from — create from iterable",
        desc: "Create arrays from strings, Sets, Maps, or array-like objects.",
        tags: ["Array.from", "create", "array"],
        code: `Array.from("hello");        // ["h","e","l","l","o"]
Array.from({ length: 3 }, (_, i) => i); // [0, 1, 2]
Array.from(new Set([1,1,2])); // [1, 2]`,
      },
    ],
  },
  {
    id: "string",
    label: "String Methods",
    color: "bg-[#fde047]",
    snippets: [
      {
        title: "slice — extract substring",
        desc: "Extracts part of a string by start/end index.",
        tags: ["slice", "substring", "string"],
        code: `const s = "Hello, World!";
s.slice(0, 5);   // "Hello"
s.slice(7);      // "World!"
s.slice(-6);     // "World!"`,
      },
      {
        title: "split / join",
        desc: "split breaks a string into an array. join does the reverse.",
        tags: ["split", "join", "string", "array"],
        code: `"a,b,c".split(",");       // ["a", "b", "c"]
"hello".split("");        // ["h","e","l","l","o"]

["a", "b", "c"].join("-"); // "a-b-c"`,
      },
      {
        title: "replace / replaceAll",
        desc: "Replace first or all occurrences of a pattern.",
        tags: ["replace", "string"],
        code: `"foo foo".replace("foo", "bar");    // "bar foo"
"foo foo".replaceAll("foo", "bar"); // "bar bar"

// With regex
"Hello World".replace(/o/g, "0"); // "Hell0 W0rld"`,
      },
      {
        title: "trim / padStart / padEnd",
        desc: "Remove whitespace or pad a string to a target length.",
        tags: ["trim", "pad", "string"],
        code: `"  hello  ".trim();          // "hello"
"5".padStart(3, "0");        // "005"
"hi".padEnd(5, ".");         // "hi..."`,
      },
      {
        title: "includes / startsWith / endsWith",
        desc: "Check if a string contains, starts with, or ends with a value.",
        tags: ["includes", "startsWith", "endsWith", "string"],
        code: `const s = "Hello, World!";
s.includes("World");     // true
s.startsWith("Hello");   // true
s.endsWith("!");         // true`,
      },
      {
        title: "Template literals",
        desc: "Embed expressions directly in strings using backticks.",
        tags: ["template", "literal", "string", "interpolation"],
        code: `const name = "Karan";
const score = 95;

const msg = \`Hello, \${name}! Your score is \${score}.\`;
// "Hello, Karan! Your score is 95."

// Multi-line
const html = \`
  <div>
    <p>\${name}</p>
  </div>
\`;`,
      },
    ],
  },
  {
    id: "object",
    label: "Objects",
    color: "bg-[#c084fc]",
    snippets: [
      {
        title: "Destructuring",
        desc: "Extract values from objects into variables.",
        tags: ["destructuring", "object"],
        code: `const user = { name: "Karan", age: 20, city: "Mumbai" };

const { name, age } = user;
// name = "Karan", age = 20

// With rename
const { name: userName } = user;
// userName = "Karan"

// With default
const { role = "user" } = user;
// role = "user"`,
      },
      {
        title: "Spread & merge objects",
        desc: "Copy or merge objects without mutation.",
        tags: ["spread", "merge", "object"],
        code: `const a = { x: 1, y: 2 };
const b = { y: 3, z: 4 };

const merged = { ...a, ...b };
// { x: 1, y: 3, z: 4 }  (b overrides a)

// Clone
const clone = { ...a };`,
      },
      {
        title: "Object.keys / values / entries",
        desc: "Iterate over an object's keys, values, or both.",
        tags: ["keys", "values", "entries", "object"],
        code: `const obj = { a: 1, b: 2, c: 3 };

Object.keys(obj);    // ["a", "b", "c"]
Object.values(obj);  // [1, 2, 3]
Object.entries(obj); // [["a",1], ["b",2], ["c",3]]

// Loop
for (const [key, val] of Object.entries(obj)) {
  console.log(key, val);
}`,
      },
      {
        title: "Optional chaining (?.) & nullish coalescing (??)",
        desc: "Safely access nested properties and provide fallbacks.",
        tags: ["optional chaining", "nullish", "object"],
        code: `const user = { profile: { name: "Karan" } };

user?.profile?.name;   // "Karan"
user?.address?.city;   // undefined (no error)

// Nullish coalescing
const name = user?.name ?? "Anonymous";
// "Anonymous" (only if null/undefined)`,
      },
      {
        title: "Object.fromEntries",
        desc: "Convert an array of [key, value] pairs back into an object.",
        tags: ["fromEntries", "object", "convert"],
        code: `const entries = [["a", 1], ["b", 2]];
Object.fromEntries(entries); // { a: 1, b: 2 }

// Useful after .map on entries
const doubled = Object.fromEntries(
  Object.entries({ a: 1, b: 2 }).map(([k, v]) => [k, v * 2])
);
// { a: 2, b: 4 }`,
      },
    ],
  },
  {
    id: "async",
    label: "Async / Promises",
    color: "bg-[#38bdf8]",
    snippets: [
      {
        title: "async / await",
        desc: "Write async code that reads like synchronous code.",
        tags: ["async", "await", "promise"],
        code: `async function fetchUser(id) {
  try {
    const res = await fetch(\`/api/users/\${id}\`);
    if (!res.ok) throw new Error("Not found");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err.message);
  }
}`,
      },
      {
        title: "Promise.all — run in parallel",
        desc: "Run multiple promises at once. Fails if any one fails.",
        tags: ["Promise.all", "parallel", "async"],
        code: `const [users, posts] = await Promise.all([
  fetch("/api/users").then(r => r.json()),
  fetch("/api/posts").then(r => r.json()),
]);
// Both requests run simultaneously`,
      },
      {
        title: "Promise.allSettled",
        desc: "Like Promise.all but never rejects — gives result for each.",
        tags: ["Promise.allSettled", "async"],
        code: `const results = await Promise.allSettled([
  fetch("/api/a").then(r => r.json()),
  fetch("/api/broken"),
]);

results.forEach(r => {
  if (r.status === "fulfilled") console.log(r.value);
  else console.log("Failed:", r.reason);
});`,
      },
      {
        title: "Promise chain",
        desc: "Chain .then() calls for sequential async operations.",
        tags: ["then", "chain", "promise"],
        code: `fetch("/api/user")
  .then(res => res.json())
  .then(user => fetch(\`/api/posts?userId=\${user.id}\`))
  .then(res => res.json())
  .then(posts => console.log(posts))
  .catch(err => console.error(err));`,
      },
      {
        title: "Create a Promise",
        desc: "Wrap callback-based code in a Promise.",
        tags: ["new Promise", "resolve", "reject"],
        code: `function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

await delay(1000); // waits 1 second

function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}`,
      },
    ],
  },
  {
    id: "dsa",
    label: "DSA Patterns",
    color: "bg-[#f472b6]",
    snippets: [
      {
        title: "Two Pointers",
        desc: "Use two indices moving toward each other. Great for sorted arrays.",
        tags: ["two pointers", "array", "pattern"],
        code: `// Check if array has pair summing to target
function hasPairSum(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) return true;
    else if (sum < target) left++;
    else right--;
  }
  return false;
}
// O(n) time, O(1) space`,
      },
      {
        title: "Sliding Window",
        desc: "Maintain a window of elements as you iterate. Avoids nested loops.",
        tags: ["sliding window", "array", "pattern"],
        code: `// Max sum of k consecutive elements
function maxSum(arr, k) {
  let sum = arr.slice(0, k).reduce((a, b) => a + b, 0);
  let max = sum;
  for (let i = k; i < arr.length; i++) {
    sum += arr[i] - arr[i - k];
    max = Math.max(max, sum);
  }
  return max;
}
// O(n) time, O(1) space`,
      },
      {
        title: "Binary Search",
        desc: "Search a sorted array in O(log n) by halving the search space.",
        tags: ["binary search", "search", "sorted"],
        code: `function binarySearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
// O(log n) time, O(1) space`,
      },
      {
        title: "HashMap frequency count",
        desc: "Count occurrences of elements using a Map or object.",
        tags: ["hashmap", "frequency", "count", "pattern"],
        code: `function mostFrequent(arr) {
  const freq = {};
  for (const item of arr) {
    freq[item] = (freq[item] || 0) + 1;
  }
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])[0][0];
}
// O(n) time, O(n) space`,
      },
      {
        title: "DFS on a graph",
        desc: "Depth-first traversal using recursion or a stack.",
        tags: ["dfs", "graph", "traversal", "recursion"],
        code: `function dfs(graph, node, visited = new Set()) {
  if (visited.has(node)) return;
  visited.add(node);
  console.log(node);
  for (const neighbor of graph[node] || []) {
    dfs(graph, neighbor, visited);
  }
}

const graph = { A: ["B","C"], B: ["D"], C: [], D: [] };
dfs(graph, "A"); // A B D C`,
      },
      {
        title: "BFS on a graph",
        desc: "Breadth-first traversal using a queue. Finds shortest path.",
        tags: ["bfs", "graph", "traversal", "queue"],
        code: `function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  while (queue.length) {
    const node = queue.shift();
    console.log(node);
    for (const neighbor of graph[node] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}`,
      },
    ],
  },
  {
    id: "useful",
    label: "Useful Patterns",
    color: "bg-[#fb923c]",
    snippets: [
      {
        title: "Debounce",
        desc: "Delay execution until after a pause. Great for search inputs.",
        tags: ["debounce", "performance", "pattern"],
        code: `function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const search = debounce((query) => {
  console.log("Searching:", query);
}, 300);`,
      },
      {
        title: "Throttle",
        desc: "Limit how often a function runs. Great for scroll/resize events.",
        tags: ["throttle", "performance", "pattern"],
        code: `function throttle(fn, limit) {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn(...args);
    }
  };
}

const onScroll = throttle(() => console.log("scroll"), 200);`,
      },
      {
        title: "Deep clone an object",
        desc: "Create a fully independent copy of a nested object.",
        tags: ["clone", "deep copy", "object"],
        code: `// Simple (no functions/dates/undefined)
const clone = JSON.parse(JSON.stringify(obj));

// Modern (handles more types)
const clone2 = structuredClone(obj);`,
      },
      {
        title: "Group array by key",
        desc: "Group an array of objects by a shared property.",
        tags: ["group", "reduce", "array", "pattern"],
        code: `const people = [
  { name: "Karan", city: "Mumbai" },
  { name: "Priya", city: "Delhi" },
  { name: "Raj",   city: "Mumbai" },
];

const byCity = people.reduce((acc, p) => {
  (acc[p.city] ??= []).push(p);
  return acc;
}, {});
// { Mumbai: [...], Delhi: [...] }`,
      },
      {
        title: "Remove duplicates",
        desc: "Get unique values from an array.",
        tags: ["unique", "dedupe", "set", "array"],
        code: `const arr = [1, 2, 2, 3, 3, 4];

// Using Set
const unique = [...new Set(arr)]; // [1, 2, 3, 4]

// Objects by key
const users = [{ id: 1 }, { id: 2 }, { id: 1 }];
const uniqueUsers = [...new Map(users.map(u => [u.id, u])).values()];`,
      },
      {
        title: "Chunk an array",
        desc: "Split an array into smaller arrays of a given size.",
        tags: ["chunk", "split", "array", "pattern"],
        code: `function chunk(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

chunk([1,2,3,4,5], 2); // [[1,2],[3,4],[5]]`,
      },
    ],
  },
];

// ── Copy button ───────────────────────────────────────────────────────────────
function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1 font-black text-xs px-2 py-1 border-2 border-white/20 text-white/50 hover:text-white hover:border-white/50 transition-all"
    >
      {copied ? <Check className="w-3 h-3 text-[#34d399]" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

// ── Snippet card ──────────────────────────────────────────────────────────────
function SnippetCard({ snippet, color }: { snippet: Snippet; color: string }) {
  return (
    <div className="border-4 border-black shadow-[4px_4px_0_0_#000] bg-white flex flex-col">
      <div className={`${color} border-b-4 border-black px-4 py-3`}>
        <p className="font-black text-black text-sm">{snippet.title}</p>
        <p className="font-bold text-black/60 text-xs mt-0.5">{snippet.desc}</p>
      </div>
      <div className="bg-[#0d0d1a] flex-1 relative">
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#e94560]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#fde047]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#34d399]" />
          </div>
          <CopyButton code={snippet.code} />
        </div>
        <pre className="p-4 text-xs text-[#34d399] font-mono leading-relaxed whitespace-pre overflow-x-auto">{snippet.code}</pre>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function CheatSheet() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const query = search.toLowerCase().trim();

  const filtered = CATEGORIES.map((cat) => ({
    ...cat,
    snippets: cat.snippets.filter((s) => {
      const matchesCat = activeCategory === "all" || cat.id === activeCategory;
      if (!matchesCat) return false;
      if (!query) return true;
      return (
        s.title.toLowerCase().includes(query) ||
        s.desc.toLowerCase().includes(query) ||
        s.tags.some((t) => t.includes(query)) ||
        s.code.toLowerCase().includes(query)
      );
    }),
  })).filter((cat) => cat.snippets.length > 0);

  const totalShown = filtered.reduce((a, c) => a + c.snippets.length, 0);

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-[#1a1a2e] border-b-4 border-black px-6 py-14">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-black uppercase tracking-widest text-white/40 mb-3">Quick Reference</p>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase leading-tight mb-4">
            JS Cheat<br />Sheet
          </h1>
          <p className="text-lg font-bold text-white/60 max-w-xl border-l-4 border-[#34d399] pl-4">
            Copy-paste ready snippets for arrays, strings, objects, async, DSA patterns, and more. No fluff.
          </p>

          {/* Search */}
          <div className="mt-8 flex items-center gap-3 bg-white border-4 border-black shadow-[6px_6px_0_0_#34d399] px-4 py-3 max-w-lg">
            <Search className="w-5 h-5 text-black/40 shrink-0" />
            <input
              type="text"
              placeholder="Search snippets... (e.g. map, debounce, binary search)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 font-bold text-black text-sm outline-none placeholder:text-black/30 bg-transparent"
            />
            {search && (
              <button onClick={() => setSearch("")} className="font-black text-black/40 hover:text-black text-xs">✕</button>
            )}
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div className="border-b-4 border-black bg-white sticky top-[80px] z-30">
        <div className="max-w-5xl mx-auto px-6 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveCategory("all")}
            className={`shrink-0 font-black text-xs px-4 py-2 border-4 border-black transition-all shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5
              ${activeCategory === "all" ? "bg-black text-white" : "bg-white text-black"}`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`shrink-0 font-black text-xs px-4 py-2 border-4 border-black transition-all shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5
                ${activeCategory === cat.id ? `${cat.color} text-black` : "bg-white text-black"}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        {query && (
          <p className="font-black text-black/50 text-sm mb-6">
            {totalShown} result{totalShown !== 1 ? "s" : ""} for "{search}"
          </p>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-24">
            <BookOpen className="w-12 h-12 text-black/20 mx-auto mb-4" />
            <p className="font-black text-black/40 text-lg">No snippets found for "{search}"</p>
            <button onClick={() => setSearch("")} className="mt-4 font-black text-sm text-black underline">Clear search</button>
          </div>
        )}

        {filtered.map((cat) => (
          <div key={cat.id} className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <div className={`${cat.color} border-4 border-black px-4 py-2 shadow-[4px_4px_0_0_#000]`}>
                <h2 className="font-black text-black text-sm uppercase tracking-widest">{cat.label}</h2>
              </div>
              <span className="font-black text-black/30 text-sm">{cat.snippets.length} snippets</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {cat.snippets.map((snippet, i) => (
                <SnippetCard key={i} snippet={snippet} color={cat.color} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
