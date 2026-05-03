import { useState } from "react";
import { Bot, Clipboard, Sparkles, Copy, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const examples = [
  { label: "for loop",       code: "for (let i = 0; i < 5; i++) {\n  console.log(i);\n}" },
  { label: "arrow function", code: "const add = (a, b) => a + b;\nconsole.log(add(3, 4));" },
  { label: "array map",      code: "const nums = [1, 2, 3];\nconst doubled = nums.map(n => n * 2);\nconsole.log(doubled);" },
  { label: "fetch API",      code: "async function getUser(id) {\n  const res = await fetch(`/api/users/${id}`);\n  const data = await res.json();\n  return data;\n}" },
  { label: "recursion",      code: "function factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}" },
];

// ── Real code analyzer ────────────────────────────────────────────────────────

interface LineExplanation {
  lineNum: number;
  code: string;
  explanation: string;
  type: "comment" | "declaration" | "function" | "loop" | "condition" | "return" | "call" | "class" | "import" | "other";
}

interface CodeAnalysis {
  summary: string;
  language: string;
  concepts: string[];
  lines: LineExplanation[];
  analogy: string;
  tip: string;
  purpose: string;
}

function detectLanguage(code: string): string {
  if (/^\s*(import|from|def |class |print\(|elif|lambda)/.test(code)) return "Python";
  if (/^\s*(#include|int main|cout|cin|std::)/.test(code)) return "C++";
  if (/^\s*(public class|System\.out|void main|import java)/.test(code)) return "Java";
  if (/<\/?[a-z][\s\S]*>/i.test(code) && !code.includes("=>")) return "HTML";
  if (/^\s*(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)/i.test(code)) return "SQL";
  return "JavaScript / TypeScript";
}

function classifyLine(line: string): LineExplanation["type"] {
  const t = line.trim();
  if (!t || t.startsWith("//") || t.startsWith("#") || t.startsWith("/*") || t.startsWith("*")) return "comment";
  if (/^(import|from|require)/.test(t)) return "import";
  if (/^(class\s)/.test(t)) return "class";
  if (/^(function\s|const\s+\w+\s*=\s*(async\s*)?\(|async\s+function|\w+\s*\(.*\)\s*\{|def\s)/.test(t)) return "function";
  if (/^(for\s*\(|while\s*\(|for\s+\w+\s+in\s|\.forEach|\.map\(|\.filter\(|\.reduce\()/.test(t)) return "loop";
  if (/^(if\s*\(|else\s*\{|else\s+if|switch\s*\(|\?\s)/.test(t)) return "condition";
  if (/^return\s/.test(t)) return "return";
  if (/^(const|let|var|int|float|string|bool|auto)\s/.test(t)) return "declaration";
  if (/\w+\s*\(/.test(t) && !t.includes("=>")) return "call";
  return "other";
}

function explainLine(line: string, idx: number, allLines: string[]): string {
  const t = line.trim();
  if (!t) return "Empty line — used for readability.";
  if (t.startsWith("//")) return `Comment: "${t.slice(2).trim()}" — this is a note for developers, not executed.`;
  if (t.startsWith("#") && !t.startsWith("#include")) return `Comment: "${t.slice(1).trim()}"`;

  // imports
  if (/^import\s+(.+)\s+from\s+['"](.+)['"]/.test(t)) {
    const m = t.match(/^import\s+\{?([^}]+)\}?\s+from\s+['"](.+)['"]/);
    if (m) return `Imports ${m[1].trim()} from the "${m[2]}" package/module.`;
  }
  if (/^const\s+(.+)\s*=\s*require\(['"](.+)['"]\)/.test(t)) {
    const m = t.match(/^const\s+(\w+)\s*=\s*require\(['"](.+)['"]\)/);
    if (m) return `Loads the "${m[2]}" module and stores it in "${m[1]}".`;
  }

  // variable declarations
  const varMatch = t.match(/^(const|let|var)\s+(\w+)\s*=\s*(.+)/);
  if (varMatch) {
    const [, keyword, name, value] = varMatch;
    const valueDesc = describeValue(value.replace(/;$/, "").trim());
    const kwDesc = keyword === "const" ? "a constant (cannot be reassigned)" : keyword === "let" ? "a block-scoped variable" : "a function-scoped variable (avoid var)";
    return `Declares ${kwDesc} named "${name}" and sets it to ${valueDesc}.`;
  }

  // function declarations
  const fnMatch = t.match(/^(async\s+)?function\s+(\w+)\s*\(([^)]*)\)/);
  if (fnMatch) {
    const [, async_, name, params] = fnMatch;
    const paramList = params.trim() ? `takes ${params.split(",").length} parameter(s): ${params.trim()}` : "takes no parameters";
    return `Defines ${async_ ? "an async " : "a "}function named "${name}" that ${paramList}.`;
  }

  // arrow functions
  const arrowMatch = t.match(/^(const|let)\s+(\w+)\s*=\s*(async\s*)?\(([^)]*)\)\s*=>/);
  if (arrowMatch) {
    const [, , name, async_, params] = arrowMatch;
    const paramList = params.trim() ? `with parameter(s): ${params.trim()}` : "with no parameters";
    return `Creates ${async_ ? "an async " : "an "}arrow function named "${name}" ${paramList}.`;
  }

  // for loop
  const forMatch = t.match(/^for\s*\(\s*(let|var|const)\s+(\w+)\s*=\s*([^;]+);\s*([^;]+);\s*([^)]+)\)/);
  if (forMatch) {
    const [, , varName, start, condition, increment] = forMatch;
    return `Starts a for loop: "${varName}" begins at ${start.trim()}, runs while ${condition.trim()}, and ${increment.trim()} after each iteration.`;
  }

  // for...of / for...in
  const forOfMatch = t.match(/^for\s*\(\s*(const|let)\s+(\w+)\s+(of|in)\s+(\w+)\s*\)/);
  if (forOfMatch) {
    const [, , item, ofIn, collection] = forOfMatch;
    return `Loops ${ofIn === "of" ? "over each value" : "over each key"} in "${collection}", calling each one "${item}".`;
  }

  // while loop
  const whileMatch = t.match(/^while\s*\((.+)\)/);
  if (whileMatch) return `Runs the block repeatedly while ${whileMatch[1].trim()} is true.`;

  // if / else if
  const ifMatch = t.match(/^(else\s+)?if\s*\((.+)\)/);
  if (ifMatch) return `${ifMatch[1] ? "Otherwise, checks" : "Checks"} if ${ifMatch[2].trim()} is true — if so, runs the block below.`;
  if (t === "} else {" || t === "else {") return `If the previous condition was false, runs this block instead.`;

  // return
  const retMatch = t.match(/^return\s+(.*)/);
  if (retMatch) {
    const val = retMatch[1].replace(/;$/, "").trim();
    return `Returns ${val ? describeValue(val) : "nothing (undefined)"} from the function — execution stops here.`;
  }

  // console.log
  const logMatch = t.match(/^console\.(log|warn|error)\((.+)\)/);
  if (logMatch) {
    const [, method, args] = logMatch;
    return `Prints ${args.trim()} to the ${method === "log" ? "console" : method === "warn" ? "console as a warning" : "console as an error"}.`;
  }

  // await
  if (t.startsWith("const") && t.includes("await")) {
    const awaitMatch = t.match(/^(const|let)\s+(\w+)\s*=\s*await\s+(.+)/);
    if (awaitMatch) return `Waits for "${awaitMatch[3].replace(/;$/, "").trim()}" to finish, then stores the result in "${awaitMatch[2]}".`;
  }
  if (t.startsWith("await ")) return `Pauses execution until "${t.slice(6).replace(/;$/, "").trim()}" resolves.`;

  // array methods
  if (t.includes(".map(")) return `Transforms each element in the array using the provided function, returning a new array.`;
  if (t.includes(".filter(")) return `Filters the array, keeping only elements where the function returns true.`;
  if (t.includes(".reduce(")) return `Reduces the array to a single value by accumulating results through the function.`;
  if (t.includes(".forEach(")) return `Iterates over each element in the array and runs the function for each one.`;
  if (t.includes(".push(")) return `Adds a new element to the end of the array.`;
  if (t.includes(".pop()")) return `Removes and returns the last element from the array.`;
  if (t.includes(".find(")) return `Finds and returns the first element that satisfies the condition.`;
  if (t.includes(".includes(")) return `Checks if the array/string contains the specified value, returns true or false.`;
  if (t.includes(".split(")) return `Splits the string into an array of substrings based on the separator.`;
  if (t.includes(".join(")) return `Joins all array elements into a single string using the separator.`;

  // class
  const classMatch = t.match(/^class\s+(\w+)(\s+extends\s+(\w+))?/);
  if (classMatch) return `Defines a class named "${classMatch[1]}"${classMatch[3] ? ` that inherits from "${classMatch[3]}"` : ""}.`;

  // constructor
  if (t.startsWith("constructor(")) {
    const params = t.match(/constructor\(([^)]*)\)/)?.[1] || "";
    return `The constructor runs when a new object is created${params ? `, receiving: ${params}` : ""}.`;
  }

  // this.x = y
  const thisMatch = t.match(/^this\.(\w+)\s*=\s*(.+)/);
  if (thisMatch) return `Sets the "${thisMatch[1]}" property on this object to ${describeValue(thisMatch[2].replace(/;$/, "").trim())}.`;

  // assignment
  const assignMatch = t.match(/^(\w+)\s*=\s*(.+)/);
  if (assignMatch && !t.includes("==") && !t.includes("=>")) {
    return `Updates "${assignMatch[1]}" to ${describeValue(assignMatch[2].replace(/;$/, "").trim())}.`;
  }

  // function call
  const callMatch = t.match(/^(\w+(?:\.\w+)*)\s*\((.*)?\)/);
  if (callMatch) {
    const args = callMatch[2]?.trim();
    return `Calls "${callMatch[1]}"${args ? ` with argument(s): ${args}` : ""}.`;
  }

  // closing brace
  if (t === "}" || t === "};") return `Closes the block above (function, loop, or condition).`;
  if (t === "{") return `Opens a new block of code.`;

  // fallback — describe what we see
  return `Executes: ${t.length > 60 ? t.slice(0, 60) + "..." : t}`;

  // suppress unused warning
  void idx; void allLines;
}

function describeValue(val: string): string {
  if (!val) return "an empty value";
  if (val === "true" || val === "false") return `the boolean ${val}`;
  if (val === "null") return "null (intentionally empty)";
  if (val === "undefined") return "undefined";
  if (/^\d+$/.test(val)) return `the number ${val}`;
  if (/^['"`]/.test(val)) return `the string ${val}`;
  if (val.startsWith("[")) return "an array";
  if (val.startsWith("{")) return "an object";
  if (val.includes("=>") || val.includes("function")) return "a function";
  if (val.startsWith("new ")) return `a new instance of ${val.slice(4).split("(")[0]}`;
  if (val.startsWith("await ")) return `the resolved value of ${val.slice(6)}`;
  return `"${val}"`;
}

function detectConcepts(code: string): string[] {
  const concepts: string[] = [];
  if (/\bfor\s*\(/.test(code)) concepts.push("for loop");
  if (/\bwhile\s*\(/.test(code)) concepts.push("while loop");
  if (/\bfor\s+\w+\s+of\b/.test(code)) concepts.push("for...of loop");
  if (/\bfunction\s+\w+/.test(code)) concepts.push("function declaration");
  if (/=>\s/.test(code)) concepts.push("arrow function");
  if (/\basync\b/.test(code)) concepts.push("async/await");
  if (/\bawait\b/.test(code)) concepts.push("promises");
  if (/\bif\s*\(/.test(code)) concepts.push("conditional logic");
  if (/\bclass\s+\w+/.test(code)) concepts.push("class / OOP");
  if (/\.map\(/.test(code)) concepts.push("Array.map()");
  if (/\.filter\(/.test(code)) concepts.push("Array.filter()");
  if (/\.reduce\(/.test(code)) concepts.push("Array.reduce()");
  if (/\bfetch\(/.test(code)) concepts.push("fetch API");
  if (/\bimport\b/.test(code)) concepts.push("ES modules");
  if (/\brecursion|factorial|fibonacci/.test(code.toLowerCase())) concepts.push("recursion");
  if (/\btry\s*\{/.test(code)) concepts.push("error handling");
  if (/\bPromise\b/.test(code)) concepts.push("Promises");
  return concepts;
}

function buildSummary(code: string, language: string): string {
  const lines = code.split("\n").filter(l => l.trim() && !l.trim().startsWith("//"));
  const hasFn = /\bfunction\s+\w+|const\s+\w+\s*=\s*(async\s*)?\(/.test(code);
  const hasClass = /\bclass\s+\w+/.test(code);
  const hasLoop = /\bfor\s*\(|\bwhile\s*\(/.test(code);
  const hasAsync = /\basync\b|\bawait\b/.test(code);
  const hasCondition = /\bif\s*\(/.test(code);

  const parts: string[] = [];
  if (hasClass) parts.push("defines a class");
  if (hasFn) parts.push(`defines ${(code.match(/\bfunction\s+\w+|const\s+\w+\s*=\s*(async\s*)?\(/g) || []).length} function(s)`);
  if (hasLoop) parts.push("uses loops to repeat operations");
  if (hasAsync) parts.push("uses async/await for asynchronous operations");
  if (hasCondition) parts.push("uses conditional logic");

  const summary = parts.length
    ? `This ${language} snippet ${parts.join(", ")}. It has ${lines.length} executable line(s).`
    : `This ${language} snippet has ${lines.length} line(s) of code.`;

  return summary;
}

function buildAnalogy(code: string): string {
  if (/\bfor\s*\(/.test(code)) return "🔄 Think of this like a factory conveyor belt — it processes each item one by one until the job is done.";
  if (/\bwhile\s*\(/.test(code)) return "⏰ Like an alarm that keeps ringing until you turn it off — it runs as long as the condition is true.";
  if (/\bclass\s+\w+/.test(code)) return "🏭 Like a blueprint for a house — the class is the blueprint, and each new object is a house built from it.";
  if (/\basync\b|\bawait\b/.test(code)) return "📦 Like ordering food online — you place the order (async call), do other things, then pick it up when it's ready (await).";
  if (/\.map\(/.test(code)) return "🏭 Like a factory line — every item goes in, gets transformed, and comes out changed. The original stays untouched.";
  if (/\.filter\(/.test(code)) return "🚪 Like a bouncer at a club — only items that pass the check get through.";
  if (/\.reduce\(/.test(code)) return "🧮 Like a running total on a receipt — each item adds to the accumulator until you have one final result.";
  if (/\bfetch\(/.test(code)) return "📬 Like sending a letter and waiting for a reply — you send a request and wait for the server to respond.";
  if (/\bif\s*\(/.test(code)) return "🚦 Like a traffic light — if the condition is green, go one way; if red, take the other path.";
  if (/\bfunction\s+\w+|const\s+\w+\s*=.*=>/.test(code)) return "🧰 Like a recipe — you write it once and can use it as many times as you want with different ingredients.";
  return "💡 Think of this code as a set of instructions — the computer follows them top to bottom, one line at a time.";
}

function buildTip(concepts: string[]): string {
  if (concepts.includes("async/await")) return "💡 Tip: async/await is just cleaner syntax for Promises. Every async function returns a Promise under the hood.";
  if (concepts.includes("Array.map()")) return "💡 Tip: .map() never modifies the original array — it always returns a brand new one.";
  if (concepts.includes("Array.filter()")) return "💡 Tip: .filter() returns an empty array (not null) if nothing matches — safe to chain with .map().";
  if (concepts.includes("recursion")) return "💡 Tip: Every recursive function needs a base case — without it, you'll get a Stack Overflow error.";
  if (concepts.includes("class / OOP")) return "💡 Tip: Classes are just syntactic sugar over JavaScript's prototype-based inheritance.";
  if (concepts.includes("for loop")) return "💡 Tip: Prefer for...of over a traditional for loop when you don't need the index — it's cleaner.";
  if (concepts.includes("promises")) return "💡 Tip: Always handle promise rejections with try/catch or .catch() to avoid unhandled promise errors.";
  return "💡 Tip: Read code top to bottom — variables are declared before they're used, functions before they're called.";
}

function buildPurpose(code: string, concepts: string[]): string {
  // Extract function names
  const fnNames = [...code.matchAll(/(?:function\s+(\w+)|const\s+(\w+)\s*=\s*(?:async\s*)?\()/g)]
    .map(m => m[1] || m[2])
    .filter(Boolean);

  // Extract variable names and their values for context
  const vars = [...code.matchAll(/(?:const|let|var)\s+(\w+)\s*=\s*([^;\n]+)/g)]
    .map(m => ({ name: m[1], value: m[2].trim() }));

  // Detect what the code is doing at a high level
  const hasFetch = /\bfetch\(/.test(code);
  const hasAsync = /\basync\b|\bawait\b/.test(code);
  const hasClass = /\bclass\s+(\w+)/.test(code);
  const hasRecursion = fnNames.some(fn => new RegExp(`\\b${fn}\\s*\\(`).test(code.replace(new RegExp(`function\\s+${fn}`), "")));
  const hasSort = /\.sort\(|bubble|selection|insertion|merge|quick/.test(code.toLowerCase());
  const hasSearch = /binary.?search|linear.?search|\.find\(|\.indexOf\(/.test(code.toLowerCase());
  const hasMap = /\.map\(/.test(code);
  const hasFilter = /\.filter\(/.test(code);
  const hasReduce = /\.reduce\(/.test(code);
  const hasLoop = /\bfor\s*\(|\bwhile\s*\(/.test(code);
  const hasCondition = /\bif\s*\(/.test(code);
  const hasConsoleLog = /console\.log/.test(code);
  const hasReturn = /\breturn\b/.test(code);
  const className = code.match(/class\s+(\w+)/)?.[1];
  const mainFn = fnNames[0];

  // Build a specific, meaningful purpose statement
  if (hasFetch && hasAsync) {
    const endpoint = code.match(/fetch\(`?['"]?([^'"`)\s]+)/)?.[1] || "an API";
    return `This code fetches data from ${endpoint.includes("$") ? "a dynamic URL" : `"${endpoint}"`} asynchronously. It sends an HTTP request, waits for the response, parses it as JSON, and returns the data. This is the standard pattern for loading data from a server or external API in modern JavaScript.`;
  }

  if (hasClass && className) {
    const methods = [...code.matchAll(/(?:^\s+)(\w+)\s*\([^)]*\)\s*\{/gm)].map(m => m[1]).filter(m => m !== "constructor" && m !== "if" && m !== "for");
    return `This code defines a "${className}" class — a reusable blueprint for creating objects. ${methods.length > 0 ? `It has ${methods.length} method(s): ${methods.slice(0, 3).join(", ")}${methods.length > 3 ? "..." : ""}. ` : ""}When you write \`new ${className}()\`, JavaScript creates a new object with all these properties and methods. This is Object-Oriented Programming (OOP).`;
  }

  if (hasRecursion && mainFn) {
    return `This code defines a recursive function called "${mainFn}" — a function that calls itself with a smaller version of the problem. It has a base case (the stopping condition) and a recursive case. This pattern is commonly used for problems like calculating factorials, Fibonacci numbers, tree traversal, and divide-and-conquer algorithms.`;
  }

  if (hasSort) {
    return `This code implements a sorting algorithm. It takes an array of values and rearranges them in order (typically ascending). Sorting is one of the most fundamental operations in programming — it makes searching faster and data easier to work with.`;
  }

  if (hasSearch) {
    return `This code implements a search algorithm. It looks through a collection of data to find a specific value and returns its position (or -1 if not found). Efficient searching is critical in real applications — databases, search engines, and file systems all rely on it.`;
  }

  if (hasMap && hasFilter) {
    const inputVar = vars.find(v => v.value.startsWith("["))?.name || "an array";
    return `This code processes ${inputVar === "an array" ? "an array" : `the "${inputVar}" array`} using functional programming methods. It transforms elements with .map() and filters them with .filter(), producing a new array without modifying the original. This is a clean, modern way to work with collections of data.`;
  }

  if (hasMap && mainFn) {
    const inputVar = vars.find(v => v.value.startsWith("["))?.name;
    return `This code transforms ${inputVar ? `the "${inputVar}" array` : "an array"} using .map() — creating a new array where each element has been processed by the function. The original array is never changed. This pattern is used everywhere: rendering lists in React, formatting data, converting units, etc.`;
  }

  if (hasFilter) {
    return `This code filters an array, keeping only the elements that match a condition. The result is a new array — the original is untouched. Filtering is used constantly in real apps: showing only active users, filtering products by price, finding matching search results, etc.`;
  }

  if (hasReduce) {
    return `This code uses .reduce() to collapse an array into a single value — like summing all numbers, building an object from an array, or finding the maximum. It's the most powerful array method and can replicate what .map() and .filter() do, though it's harder to read.`;
  }

  if (hasAsync && !hasFetch) {
    return `This code uses async/await to handle asynchronous operations — tasks that take time (like reading files, querying databases, or waiting for timers). Instead of blocking the program, it pauses only the current function and lets other code run. The \`await\` keyword waits for a Promise to resolve before continuing.`;
  }

  if (hasLoop && hasCondition && mainFn) {
    return `This code defines a function "${mainFn}" that uses a loop and conditional logic to process data. It iterates through values, checks conditions, and produces a result. This is the classic imperative programming pattern — step by step instructions telling the computer exactly what to do.`;
  }

  if (hasLoop && !mainFn) {
    const loopVar = code.match(/for\s*\(\s*(?:let|var|const)\s+(\w+)/)?.[1] || "i";
    return `This code uses a loop to repeat an operation multiple times. The variable "${loopVar}" tracks the current iteration. Loops are fundamental to programming — without them, you'd have to write the same code hundreds of times manually.`;
  }

  if (mainFn && hasReturn) {
    const params = code.match(new RegExp(`function\\s+${mainFn}\\s*\\(([^)]*)\\)`))?.[1]?.trim();
    return `This code defines a function called "${mainFn}"${params ? ` that accepts "${params}" as input` : ""}. It performs some computation and returns a result. Functions are the building blocks of every program — they let you write logic once and reuse it anywhere.`;
  }

  if (hasConsoleLog && vars.length > 0) {
    const varList = vars.slice(0, 3).map(v => `"${v.name}"`).join(", ");
    return `This code declares ${vars.length > 1 ? `${vars.length} variables` : "a variable"} (${varList}) and prints ${vars.length > 1 ? "their values" : "its value"} to the console. This is a basic demonstration of variable declaration and output — the foundation of every program.`;
  }

  // Generic fallback based on concepts
  if (concepts.length > 0) {
    return `This code demonstrates ${concepts.slice(0, 3).join(", ")}. ${
      concepts.includes("conditional logic") ? "It makes decisions based on conditions. " : ""
    }${
      concepts.includes("function declaration") || concepts.includes("arrow function") ? "It organises logic into reusable functions. " : ""
    }Understanding this pattern is essential for writing real-world applications.`;
  }

  return `This code is a self-contained snippet that performs a specific task. Read it top to bottom — each line builds on the previous one. The best way to understand it fully is to run it and observe the output.`;
}

function analyzeCode(code: string): CodeAnalysis {
  const language = detectLanguage(code);
  const rawLines = code.split("\n");
  const concepts = detectConcepts(code);

  const lines: LineExplanation[] = rawLines.map((line, i) => ({
    lineNum: i + 1,
    code: line,
    explanation: explainLine(line, i, rawLines),
    type: classifyLine(line),
  }));

  return {
    summary: buildSummary(code, language),
    language,
    concepts,
    lines,
    analogy: buildAnalogy(code),
    tip: buildTip(concepts),
    purpose: buildPurpose(code, concepts),
  };
}

const TYPE_COLORS: Record<LineExplanation["type"], string> = {
  comment:     "text-[#34d399]/60",
  declaration: "text-[#38bdf8]",
  function:    "text-[#c084fc]",
  loop:        "text-[#fb923c]",
  condition:   "text-[#fde047]",
  return:      "text-[#f472b6]",
  call:        "text-[#34d399]",
  class:       "text-[#e94560]",
  import:      "text-white/50",
  other:       "text-white/70",
};

const TYPE_BADGE: Record<LineExplanation["type"], string> = {
  comment:     "bg-[#34d399]/20 text-[#34d399]",
  declaration: "bg-[#38bdf8]/20 text-[#38bdf8]",
  function:    "bg-[#c084fc]/20 text-[#c084fc]",
  loop:        "bg-[#fb923c]/20 text-[#fb923c]",
  condition:   "bg-[#fde047]/20 text-[#fde047]",
  return:      "bg-[#f472b6]/20 text-[#f472b6]",
  call:        "bg-[#34d399]/20 text-[#34d399]",
  class:       "bg-[#e94560]/20 text-[#e94560]",
  import:      "bg-white/10 text-white/50",
  other:       "bg-white/10 text-white/50",
};

export default function AIExplain() {
  const { addXP, user, incrementAIExplain } = useAuth();
  const [code, setCode] = useState("");
  const [analysis, setAnalysis] = useState<CodeAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [xpGiven, setXpGiven] = useState(false);

  const explain = () => {
    if (!code.trim()) return;
    setLoading(true);
    setAnalysis(null);
    // Small delay to feel responsive
    setTimeout(() => {
      const result = analyzeCode(code);
      setAnalysis(result);
      setLoading(false);
      if (!xpGiven && user) {
        addXP(100);
        incrementAIExplain();
        setXpGiven(true);
      }
    }, 700);
  };

  const loadExample = (ex: typeof examples[0]) => {
    setCode(ex.code);
    setAnalysis(null);
    setXpGiven(false);
  };

  const copyExplanation = () => {
    if (!analysis) return;
    const text = [
      `=== Code Analysis ===`,
      `Language: ${analysis.language}`,
      `Summary: ${analysis.summary}`,
      ``,
      `Concepts: ${analysis.concepts.join(", ") || "None detected"}`,
      ``,
      `=== Line by Line ===`,
      ...analysis.lines.map(l => `Line ${l.lineNum}: ${l.code.trim()}\n  → ${l.explanation}`),
      ``,
      `=== What This Code Actually Does ===`,
      analysis.purpose,
      ``,
      analysis.analogy,
      analysis.tip,
    ].join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-[#1a1a2e] border-b-4 border-black px-6 py-14 text-center">
        <p className="text-sm font-black uppercase tracking-widest text-white/40 mb-3">AI Explain My Code</p>
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase leading-tight mb-4">
          Confused by<br />Code?
        </h1>
        <p className="text-lg font-bold text-white/60 max-w-xl mx-auto">
          Paste any snippet and get a real line-by-line breakdown. No jargon, no lectures.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Example buttons */}
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
          {/* Input panel */}
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
              onChange={(e) => { setCode(e.target.value); setAnalysis(null); setXpGiven(false); }}
              className="flex-1 min-h-[320px] resize-none bg-[#0d0d1a] p-5 font-mono text-sm text-[#34d399] leading-relaxed focus:outline-none placeholder:text-white/20"
              placeholder={"// Paste any code here...\nconst x = 5;\nconsole.log(x);"}
              spellCheck={false}
            />
            <button
              onClick={explain}
              disabled={!code.trim() || loading}
              className="bg-[#34d399] border-t-4 border-black px-6 py-4 font-black text-lg text-black flex items-center justify-center gap-3 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? <><Sparkles className="w-5 h-5 animate-spin" /> Analysing...</>
                : <><Bot className="w-5 h-5" /> Explain This Code</>
              }
            </button>
          </div>

          {/* Output panel */}
          <div className="flex flex-col border-4 border-black shadow-[8px_8px_0_0_#000]">
            <div className="bg-[#c084fc] border-b-4 border-black px-5 py-3 flex items-center justify-between">
              <span className="font-black text-black flex items-center gap-2">
                <Bot className="w-5 h-5" /> AI Breakdown
              </span>
              {analysis && (
                <button
                  onClick={copyExplanation}
                  className="flex items-center gap-1.5 border-2 border-black bg-white font-black text-xs px-3 py-1.5 shadow-[2px_2px_0_0_#000] hover:-translate-y-0.5 transition-all"
                >
                  {copied ? <Check className="w-3 h-3 text-[#34d399]" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              )}
            </div>

            <div className="flex-1 min-h-[320px] bg-[#0d0d1a] overflow-y-auto">
              {/* Empty state */}
              {!analysis && !loading && (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16 px-6">
                  <Bot className="w-12 h-12 text-white/20" />
                  <p className="font-bold text-white/40 text-sm max-w-xs">
                    Paste any code on the left and hit "Explain" — I'll break it down line by line.
                  </p>
                </div>
              )}

              {/* Loading */}
              {loading && (
                <div className="flex flex-col items-center justify-center h-full gap-3 py-16">
                  <Sparkles className="w-10 h-10 text-[#c084fc] animate-spin" />
                  <p className="font-black text-white/50 text-sm">Reading your code...</p>
                </div>
              )}

              {/* Analysis result */}
              {analysis && !loading && (
                <div className="p-5 space-y-5">
                  {/* Summary */}
                  <div className="bg-white/5 border-2 border-white/10 p-4">
                    <p className="font-black text-[#fde047] text-xs uppercase tracking-widest mb-2">Summary</p>
                    <p className="font-bold text-white text-sm leading-relaxed">{analysis.summary}</p>
                  </div>

                  {/* Language + Concepts */}
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-[#c084fc] border-2 border-black font-black text-xs px-3 py-1 text-black">
                      {analysis.language}
                    </span>
                    {analysis.concepts.map(c => (
                      <span key={c} className="bg-white/10 border border-white/20 font-bold text-xs px-2 py-1 text-white/70">
                        {c}
                      </span>
                    ))}
                  </div>

                  {/* Line by line */}
                  <div>
                    <p className="font-black text-white/40 text-xs uppercase tracking-widest mb-3">Line by Line</p>
                    <div className="space-y-1">
                      {analysis.lines.map((line) => (
                        <div key={line.lineNum} className="group">
                          {/* Code line */}
                          <div className="flex items-start gap-2 font-mono text-xs">
                            <span className="text-white/20 w-6 shrink-0 text-right pt-0.5">{line.lineNum}</span>
                            <span className={`flex-1 ${TYPE_COLORS[line.type]} ${!line.code.trim() ? "opacity-0" : ""}`}>
                              {line.code || " "}
                            </span>
                            {line.type !== "other" && line.code.trim() && (
                              <span className={`shrink-0 text-[9px] font-black px-1.5 py-0.5 uppercase ${TYPE_BADGE[line.type]}`}>
                                {line.type}
                              </span>
                            )}
                          </div>
                          {/* Explanation */}
                          {line.code.trim() && (
                            <div className="flex items-start gap-2 mt-0.5 mb-2">
                              <span className="w-6 shrink-0" />
                              <p className="text-white/50 text-xs leading-relaxed font-bold">
                                → {line.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Analogy */}
                  <div className="bg-[#fde047] border-2 border-black p-4">
                    <p className="font-black text-black text-xs uppercase tracking-widest mb-1">Real-Life Analogy</p>
                    <p className="font-bold text-black text-sm">{analysis.analogy}</p>
                  </div>

                  {/* Purpose — what is this code actually for */}
                  <div className="bg-[#34d399] border-2 border-black p-4 shadow-[3px_3px_0_0_#000]">
                    <p className="font-black text-black text-xs uppercase tracking-widest mb-2">🎯 What This Code Actually Does</p>
                    <p className="font-bold text-black text-sm leading-relaxed">{analysis.purpose}</p>
                  </div>

                  {/* Tip */}
                  <div className="bg-white/5 border-l-4 border-[#34d399] pl-4 py-3">
                    <p className="font-bold text-white/70 text-sm">{analysis.tip}</p>
                  </div>
                </div>
              )}
            </div>

            {/* XP footer */}
            {analysis && (
              <div className="bg-[#34d399] border-t-4 border-black px-5 py-3 font-black text-sm text-black flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> +100 XP earned for using AI Explain
              </div>
            )}
          </div>
        </div>

        {/* Why section */}
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
