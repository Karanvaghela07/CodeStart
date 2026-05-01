import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
type TopicId =
  | "array" | "stack" | "queue" | "linkedlist" | "binarytree"
  | "bubblesort" | "selectionsort" | "insertionsort"
  | "linearsearch" | "binarysearch";

interface Topic {
  id: TopicId;
  label: string;
  emoji: string;
  group: "Data Structures" | "Sorting Algorithms" | "Searching";
}

const TOPICS: Topic[] = [
  { id: "array",          label: "Array",           emoji: "📦", group: "Data Structures"   },
  { id: "stack",          label: "Stack",           emoji: "🍽️", group: "Data Structures"   },
  { id: "queue",          label: "Queue",           emoji: "🚌", group: "Data Structures"   },
  { id: "linkedlist",     label: "Linked List",     emoji: "🔗", group: "Data Structures"   },
  { id: "binarytree",     label: "Binary Tree",     emoji: "🌳", group: "Data Structures"   },
  { id: "bubblesort",     label: "Bubble Sort",     emoji: "🫧", group: "Sorting Algorithms" },
  { id: "selectionsort",  label: "Selection Sort",  emoji: "🏆", group: "Sorting Algorithms" },
  { id: "insertionsort",  label: "Insertion Sort",  emoji: "🧩", group: "Sorting Algorithms" },
  { id: "linearsearch",   label: "Linear Search",   emoji: "🔍", group: "Searching"          },
  { id: "binarysearch",   label: "Binary Search",   emoji: "🎯", group: "Searching"          },
];

const GROUPS: Array<{ label: Topic["group"]; color: string }> = [
  { label: "Data Structures",   color: "bg-[#34d399]" },
  { label: "Sorting Algorithms", color: "bg-[#fde047]" },
  { label: "Searching",          color: "bg-[#38bdf8]" },
];

// ── Code snippets per topic ───────────────────────────────────────────────────
const CODE_SNIPPETS: Record<TopicId, string[]> = {
  array: [
    "const arr = [12, 5, 8, 3, 9, 7];",
    "// Access: O(1)",
    "const val = arr[index];",
    "// Insert at end: O(1) amortized",
    "arr.push(newValue);",
    "// Delete last: O(1)",
    "arr.pop();",
  ],
  stack: [
    "const stack = [];",
    "// Push: O(1)",
    "stack.push(value);",
    "// Pop: O(1)",
    "const top = stack.pop();",
    "// Peek: O(1)",
    "const peek = stack[stack.length - 1];",
  ],
  queue: [
    "const queue = [1, 7, 3, 9];",
    "// Enqueue (add to rear): O(1)",
    "queue.push(value);",
    "// Dequeue (remove from front): O(n)",
    "const front = queue.shift();",
    "// Peek front: O(1)",
    "const front = queue[0];",
  ],
  linkedlist: [
    "class Node { constructor(val) {",
    "  this.val = val; this.next = null; }}",
    "// Insert at head: O(1)",
    "newNode.next = head; head = newNode;",
    "// Insert at tail: O(n)",
    "let curr = head;",
    "while (curr.next) curr = curr.next;",
    "curr.next = newNode;",
  ],
  binarytree: [
    "class TreeNode { constructor(val) {",
    "  this.val = val;",
    "  this.left = this.right = null; }}",
    "// BST Insert: O(log n) avg",
    "function insert(root, val) {",
    "  if (!root) return new TreeNode(val);",
    "  if (val < root.val) root.left = insert(root.left, val);",
    "  else root.right = insert(root.right, val);",
    "  return root; }",
  ],
  bubblesort: [
    "function bubbleSort(arr) {",
    "  for (let i = 0; i < arr.length; i++) {",
    "    for (let j = 0; j < arr.length-i-1; j++) {",
    "      if (arr[j] > arr[j+1]) {",
    "        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];",
    "      }",
    "    }",
    "  }",
    "  return arr;",
    "}",
  ],
  selectionsort: [
    "function selectionSort(arr) {",
    "  for (let i = 0; i < arr.length; i++) {",
    "    let minIdx = i;",
    "    for (let j = i+1; j < arr.length; j++) {",
    "      if (arr[j] < arr[minIdx]) minIdx = j;",
    "    }",
    "    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];",
    "  }",
    "  return arr;",
    "}",
  ],
  insertionsort: [
    "function insertionSort(arr) {",
    "  for (let i = 1; i < arr.length; i++) {",
    "    let key = arr[i], j = i - 1;",
    "    while (j >= 0 && arr[j] > key) {",
    "      arr[j+1] = arr[j]; j--;",
    "    }",
    "    arr[j+1] = key;",
    "  }",
    "  return arr;",
    "}",
  ],
  linearsearch: [
    "function linearSearch(arr, target) {",
    "  for (let i = 0; i < arr.length; i++) {",
    "    // Check each element",
    "    if (arr[i] === target) {",
    "      return i; // Found at index i",
    "    }",
    "  }",
    "  return -1; // Not found",
    "}",
  ],
  binarysearch: [
    "function binarySearch(arr, target) {",
    "  let left = 0, right = arr.length - 1;",
    "  while (left <= right) {",
    "    const mid = Math.floor((left + right) / 2);",
    "    if (arr[mid] === target) return mid;",
    "    if (arr[mid] < target) left = mid + 1;",
    "    else right = mid - 1;",
    "  }",
    "  return -1;",
    "}",
  ],
};

// ── Utility ───────────────────────────────────────────────────────────────────
function getDelay(speed: number) {
  return 900 - speed * 160;
}

// ── Controls Bar ──────────────────────────────────────────────────────────────
interface ControlsBarProps {
  topic: Topic;
  speed: number;
  setSpeed: (s: number) => void;
  playing: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
}
function ControlsBar({ topic, speed, setSpeed, playing, onPlay, onPause, onStep, onReset }: ControlsBarProps) {
  const btnCls = "border-4 border-black shadow-[3px_3px_0_0_#000] font-black px-4 py-2 text-sm hover:-translate-y-0.5 transition-all active:shadow-none active:translate-y-0";
  return (
    <div className="border-4 border-black bg-white shadow-[6px_6px_0_0_#000] p-4 mb-4 flex flex-wrap items-center gap-3">
      <span className="font-black text-lg">{topic.emoji} {topic.label.toUpperCase()}</span>
      <div className="flex items-center gap-2 ml-auto flex-wrap">
        <span className="font-black text-xs text-black/50">🐢 SLOW</span>
        <input
          type="range" min={1} max={5} value={speed}
          onChange={e => setSpeed(Number(e.target.value))}
          className="w-24 accent-black cursor-pointer"
        />
        <span className="font-black text-xs text-black/50">FAST ⚡</span>
      </div>
      <div className="flex gap-2 flex-wrap">
        {!playing
          ? <button onClick={onPlay}  className={`${btnCls} bg-[#34d399]`}>▶ Play</button>
          : <button onClick={onPause} className={`${btnCls} bg-[#fde047]`}>⏸ Pause</button>
        }
        <button onClick={onStep}  className={`${btnCls} bg-[#38bdf8]`}>⏭ Step</button>
        <button onClick={onReset} className={`${btnCls} bg-[#f472b6]`}>🔄 Reset</button>
      </div>
    </div>
  );
}

// ── Info Panel ────────────────────────────────────────────────────────────────
function InfoPanel({ text }: { text: string }) {
  return (
    <div className="border-4 border-black bg-white p-3 mt-3 shadow-[3px_3px_0_0_#000]">
      <span className="font-black text-xs uppercase tracking-widest text-black/40 mr-2">ℹ</span>
      <span className="font-bold text-sm">{text}</span>
    </div>
  );
}

// ── Code Panel ────────────────────────────────────────────────────────────────
function CodePanel({ topicId, highlightLine }: { topicId: TopicId; highlightLine: number }) {
  const lines = CODE_SNIPPETS[topicId];
  return (
    <div className="bg-[#0d0d1a] border-4 border-black shadow-[6px_6px_0_0_#000] p-4 mt-4 overflow-x-auto">
      <p className="text-xs font-black uppercase tracking-widest text-white/30 mb-3">Code</p>
      <pre className="font-mono text-sm leading-6">
        {lines.map((line, i) => (
          <div
            key={i}
            className={`px-2 rounded transition-all duration-300 ${i === highlightLine ? "bg-[#fde047] text-black font-black" : "text-[#34d399]"}`}
          >
            {line}
          </div>
        ))}
      </pre>
    </div>
  );
}

// ── What's Happening Box ──────────────────────────────────────────────────────
function ExplainBox({ text }: { text: string }) {
  return (
    <div className="bg-[#fde047] border-4 border-black p-4 mt-4 shadow-[4px_4px_0_0_#000]">
      <p className="font-black text-xs uppercase tracking-widest text-black/50 mb-1">What's Happening?</p>
      <p className="font-bold text-black text-sm leading-relaxed">{text}</p>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// VISUALIZATION 1: ARRAY
// ══════════════════════════════════════════════════════════════════════════════
function ArrayViz({ speed: _speed }: { speed: number }) {
  const [arr, setArr] = useState([12, 5, 8, 3, 9, 7]);
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const [deleted, setDeleted] = useState<number | null>(null);
  const [inserted, setInserted] = useState<number | null>(null);
  const [insertVal, setInsertVal] = useState("");
  const [accessIdx, setAccessIdx] = useState("");
  const [explain, setExplain] = useState("An array stores elements at numbered indices. Access any element in O(1) time using its index.");
  const [codeLine, setCodeLine] = useState(0);

  const handleInsert = () => {
    const v = parseInt(insertVal);
    if (isNaN(v)) return;
    setArr(a => [...a, v]);
    setInserted(arr.length);
    setExplain(`Inserted ${v} at index ${arr.length}. Arrays grow dynamically — push() is O(1) amortized.`);
    setCodeLine(4);
    setTimeout(() => setInserted(null), 1500);
    setInsertVal("");
  };

  const handleDelete = () => {
    if (arr.length === 0) return;
    const idx = arr.length - 1;
    setDeleted(idx);
    setExplain(`Deleting last element (${arr[idx]}) at index ${idx}. pop() is O(1).`);
    setCodeLine(6);
    setTimeout(() => { setArr(a => a.slice(0, -1)); setDeleted(null); }, 800);
  };

  const handleAccess = () => {
    const idx = parseInt(accessIdx);
    if (isNaN(idx) || idx < 0 || idx >= arr.length) return;
    setHighlighted(idx);
    setExplain(`Accessing arr[${idx}] = ${arr[idx]}. Direct index lookup — O(1) time, no traversal needed.`);
    setCodeLine(2);
    setTimeout(() => setHighlighted(null), 1500);
    setAccessIdx("");
  };

  const boxColor = (i: number) => {
    if (deleted === i) return "bg-[#f472b6] opacity-50";
    if (inserted === i) return "bg-[#fde047]";
    if (highlighted === i) return "bg-[#34d399]";
    return "bg-white";
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {arr.map((v, i) => (
          <div key={i} className={`border-4 border-black w-16 h-16 flex flex-col items-center justify-center transition-all duration-300 shadow-[3px_3px_0_0_#000] ${boxColor(i)}`}>
            <span className="text-[10px] font-bold text-black/40">[{i}]</span>
            <span className="text-xl font-black text-black">{v}</span>
          </div>
        ))}
        {arr.length === 0 && <div className="border-4 border-dashed border-black/30 w-16 h-16 flex items-center justify-center text-black/30 font-black text-xs">EMPTY</div>}
      </div>

      <div className="flex flex-wrap gap-3 mt-4">
        <div className="flex gap-2">
          <input
            value={insertVal} onChange={e => setInsertVal(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleInsert()}
            placeholder="Value"
            className="border-4 border-black w-20 px-2 py-1 font-bold text-sm outline-none focus:border-[#34d399]"
          />
          <button onClick={handleInsert} className="border-4 border-black bg-[#34d399] font-black text-sm px-3 py-1 shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5 transition-all">Insert</button>
        </div>
        <button onClick={handleDelete} className="border-4 border-black bg-[#f472b6] font-black text-sm px-3 py-1 shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5 transition-all">Delete Last</button>
        <div className="flex gap-2">
          <input
            value={accessIdx} onChange={e => setAccessIdx(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAccess()}
            placeholder="Index"
            className="border-4 border-black w-20 px-2 py-1 font-bold text-sm outline-none focus:border-[#38bdf8]"
          />
          <button onClick={handleAccess} className="border-4 border-black bg-[#38bdf8] font-black text-sm px-3 py-1 shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5 transition-all">Access</button>
        </div>
      </div>

      <InfoPanel text="Time Complexity: Access O(1) | Insert O(1) amortized | Delete O(n)" />
      <CodePanel topicId="array" highlightLine={codeLine} />
      <ExplainBox text={explain} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// VISUALIZATION 2: STACK
// ══════════════════════════════════════════════════════════════════════════════
function StackViz({ speed: _speed }: { speed: number }) {
  const [stack, setStack] = useState([3, 7, 1, 5]);
  const [pushVal, setPushVal] = useState("");
  const [bouncing, setBouncing] = useState(false);
  const [peeking, setPeeking] = useState(false);
  const [explain, setExplain] = useState("A stack is LIFO — Last In, First Out. Think of a pile of plates: you always add and remove from the top.");
  const [codeLine, setCodeLine] = useState(0);

  const handlePush = () => {
    const v = parseInt(pushVal);
    if (isNaN(v)) return;
    if (stack.length >= 8) { setExplain("Stack is full! Max 8 items shown."); return; }
    setStack(s => [...s, v]);
    setBouncing(true);
    setExplain(`Pushed ${v} onto the top of the stack. LIFO — this will be the next item popped.`);
    setCodeLine(2);
    setTimeout(() => setBouncing(false), 500);
    setPushVal("");
  };

  const handlePop = () => {
    if (stack.length === 0) { setExplain("Stack is empty! Nothing to pop."); return; }
    const top = stack[stack.length - 1];
    setStack(s => s.slice(0, -1));
    setExplain(`Popped ${top} from the top. The next item is now ${stack.length > 1 ? stack[stack.length - 2] : "nothing (stack empty)"}.`);
    setCodeLine(4);
  };

  const handlePeek = () => {
    if (stack.length === 0) { setExplain("Stack is empty!"); return; }
    setPeeking(true);
    setExplain(`Peek: top element is ${stack[stack.length - 1]}. Peek reads without removing — O(1).`);
    setCodeLine(6);
    setTimeout(() => setPeeking(false), 1500);
  };

  return (
    <div>
      <div className="flex flex-col-reverse items-center gap-1 mb-4 min-h-[200px] justify-end">
        {stack.length === 0 && (
          <div className="border-4 border-dashed border-black/30 w-32 h-12 flex items-center justify-center text-black/30 font-black text-xs">EMPTY</div>
        )}
        {stack.map((v, i) => {
          const isTop = i === stack.length - 1;
          return (
            <div
              key={i}
              className={`border-4 border-black w-32 h-12 flex items-center justify-center font-black text-lg transition-all duration-300 shadow-[3px_3px_0_0_#000]
                ${isTop && bouncing ? "animate-bounce" : ""}
                ${isTop && peeking ? "bg-[#fde047]" : isTop ? "bg-[#fde047]" : "bg-white"}`}
            >
              {v}
              {isTop && <span className="ml-2 text-xs font-black text-black/50">← TOP</span>}
            </div>
          );
        })}
        <div className="w-40 h-2 bg-black mt-1" />
        <span className="font-black text-xs text-black/40 mt-1">BOTTOM</span>
      </div>

      <div className="flex flex-wrap gap-3 mt-4">
        <div className="flex gap-2">
          <input
            value={pushVal} onChange={e => setPushVal(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handlePush()}
            placeholder="Value"
            className="border-4 border-black w-20 px-2 py-1 font-bold text-sm outline-none focus:border-[#34d399]"
          />
          <button onClick={handlePush} className="border-4 border-black bg-[#34d399] font-black text-sm px-3 py-1 shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5 transition-all">PUSH</button>
        </div>
        <button onClick={handlePop}  className="border-4 border-black bg-[#f472b6] font-black text-sm px-3 py-1 shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5 transition-all">POP</button>
        <button onClick={handlePeek} className="border-4 border-black bg-[#fde047] font-black text-sm px-3 py-1 shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5 transition-all">PEEK</button>
      </div>

      <InfoPanel text={`LIFO — Last In, First Out | Size: ${stack.length}`} />
      <CodePanel topicId="stack" highlightLine={codeLine} />
      <ExplainBox text={explain} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// VISUALIZATION 3: QUEUE
// ══════════════════════════════════════════════════════════════════════════════
function QueueViz({ speed: _speed }: { speed: number }) {
  const [queue, setQueue] = useState([1, 7, 3, 9]);
  const [enqVal, setEnqVal] = useState("");
  const [dequeuing, setDequeuing] = useState(false);
  const [enqueueing, setEnqueueing] = useState(false);
  const [explain, setExplain] = useState("A queue is FIFO — First In, First Out. Like a line at a ticket counter: first person in is first to be served.");
  const [codeLine, setCodeLine] = useState(0);

  const handleEnqueue = () => {
    const v = parseInt(enqVal);
    if (isNaN(v)) return;
    setQueue(q => [...q, v]);
    setEnqueueing(true);
    setExplain(`Enqueued ${v} at the rear. It will wait until all elements ahead of it are dequeued.`);
    setCodeLine(2);
    setTimeout(() => setEnqueueing(false), 600);
    setEnqVal("");
  };

  const handleDequeue = () => {
    if (queue.length === 0) { setExplain("Queue is empty!"); return; }
    const front = queue[0];
    setDequeuing(true);
    setExplain(`Dequeued ${front} from the front. The next element ${queue.length > 1 ? queue[1] : "(none)"} is now at the front.`);
    setCodeLine(4);
    setTimeout(() => { setQueue(q => q.slice(1)); setDequeuing(false); }, 600);
  };

  return (
    <div>
      <div className="flex items-center gap-2 flex-wrap mb-4">
        <div className="flex flex-col items-center">
          <span className="font-black text-xs text-[#34d399] mb-1">FRONT →</span>
        </div>
        {queue.length === 0 && (
          <div className="border-4 border-dashed border-black/30 w-14 h-14 flex items-center justify-center text-black/30 font-black text-xs">EMPTY</div>
        )}
        {queue.map((v, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className={`border-4 border-black w-14 h-14 flex items-center justify-center font-black text-lg transition-all duration-300 shadow-[3px_3px_0_0_#000]
              ${i === 0 && dequeuing ? "opacity-30 scale-90" : ""}
              ${i === queue.length - 1 && enqueueing ? "bg-[#fde047]" : i === 0 ? "bg-[#34d399]" : "bg-white"}`}>
              {v}
            </div>
            {i < queue.length - 1 && <span className="font-black text-black/40">→</span>}
          </div>
        ))}
        <div className="flex flex-col items-center">
          <span className="font-black text-xs text-[#f472b6] mb-1">← REAR</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-4">
        <div className="flex gap-2">
          <input
            value={enqVal} onChange={e => setEnqVal(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleEnqueue()}
            placeholder="Value"
            className="border-4 border-black w-20 px-2 py-1 font-bold text-sm outline-none focus:border-[#34d399]"
          />
          <button onClick={handleEnqueue} className="border-4 border-black bg-[#34d399] font-black text-sm px-3 py-1 shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5 transition-all">ENQUEUE</button>
        </div>
        <button onClick={handleDequeue} className="border-4 border-black bg-[#f472b6] font-black text-sm px-3 py-1 shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5 transition-all">DEQUEUE</button>
      </div>

      <InfoPanel text={`FIFO — First In, First Out | Size: ${queue.length}`} />
      <CodePanel topicId="queue" highlightLine={codeLine} />
      <ExplainBox text={explain} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// VISUALIZATION 4: LINKED LIST
// ══════════════════════════════════════════════════════════════════════════════
function LinkedListViz({ speed }: { speed: number }) {
  const [list, setList] = useState([12, 5, 8, 3]);
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const [headVal, setHeadVal] = useState("");
  const [tailVal, setTailVal] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [explain, setExplain] = useState("A linked list stores nodes where each node points to the next. No random access — you must traverse from the head.");
  const [codeLine, setCodeLine] = useState(0);
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleInsertHead = () => {
    const v = parseInt(headVal);
    if (isNaN(v)) return;
    setList(l => [v, ...l]);
    setHighlighted(0);
    setExplain(`Inserted ${v} at head. O(1) — just update the head pointer to the new node.`);
    setCodeLine(3);
    setTimeout(() => setHighlighted(null), 1000);
    setHeadVal("");
  };

  const handleInsertTail = () => {
    const v = parseInt(tailVal);
    if (isNaN(v)) return;
    setList(l => [...l, v]);
    setHighlighted(list.length);
    setExplain(`Inserted ${v} at tail. O(n) — must traverse to the last node first.`);
    setCodeLine(6);
    setTimeout(() => setHighlighted(null), 1000);
    setTailVal("");
  };

  const handleDeleteHead = () => {
    if (list.length === 0) return;
    const removed = list[0];
    setList(l => l.slice(1));
    setExplain(`Deleted head node (${removed}). O(1) — just move head pointer to the next node.`);
    setCodeLine(3);
  };

  const handleSearch = () => {
    const target = parseInt(searchVal);
    if (isNaN(target)) return;
    if (searchRef.current) clearTimeout(searchRef.current);
    setHighlighted(null);
    let i = 0;
    const step = () => {
      if (i >= list.length) {
        setExplain(`${target} not found in the list. Traversed all ${list.length} nodes — O(n).`);
        setHighlighted(null);
        return;
      }
      setHighlighted(i);
      if (list[i] === target) {
        setExplain(`Found ${target} at index ${i}! Took ${i + 1} step(s) — O(n) in worst case.`);
        setCodeLine(4);
        return;
      }
      setExplain(`Checking node ${i}: value is ${list[i]}, not ${target}. Moving to next...`);
      setCodeLine(6);
      i++;
      searchRef.current = setTimeout(step, getDelay(speed));
    };
    step();
    setSearchVal("");
  };

  return (
    <div>
      <div className="flex items-center gap-1 flex-wrap mb-4 overflow-x-auto pb-2">
        <span className="font-black text-xs text-[#34d399] mr-1">HEAD</span>
        {list.length === 0 && <span className="font-mono text-black/30 font-black">→ NULL</span>}
        {list.map((v, i) => (
          <div key={i} className="flex items-center shrink-0">
            <div className={`border-4 border-black flex transition-all duration-300 shadow-[3px_3px_0_0_#000] ${highlighted === i ? "bg-[#fde047]" : "bg-white"}`}>
              <div className="px-3 py-2 font-black text-base border-r-4 border-black">{v}</div>
              <div className="px-2 py-2 font-mono text-xs text-black/40 flex items-center">→</div>
            </div>
            {i < list.length - 1 && <span className="font-black text-black/40 mx-1">→</span>}
          </div>
        ))}
        {list.length > 0 && <span className="font-mono text-black/30 font-black ml-1">NULL</span>}
      </div>

      <div className="flex flex-wrap gap-3 mt-4">
        <div className="flex gap-2">
          <input value={headVal} onChange={e => setHeadVal(e.target.value)} onKeyDown={e => e.key === "Enter" && handleInsertHead()} placeholder="Value" className="border-4 border-black w-20 px-2 py-1 font-bold text-sm outline-none focus:border-[#34d399]" />
          <button onClick={handleInsertHead} className="border-4 border-black bg-[#34d399] font-black text-xs px-2 py-1 shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5 transition-all">Insert Head</button>
        </div>
        <div className="flex gap-2">
          <input value={tailVal} onChange={e => setTailVal(e.target.value)} onKeyDown={e => e.key === "Enter" && handleInsertTail()} placeholder="Value" className="border-4 border-black w-20 px-2 py-1 font-bold text-sm outline-none focus:border-[#38bdf8]" />
          <button onClick={handleInsertTail} className="border-4 border-black bg-[#38bdf8] font-black text-xs px-2 py-1 shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5 transition-all">Insert Tail</button>
        </div>
        <button onClick={handleDeleteHead} className="border-4 border-black bg-[#f472b6] font-black text-xs px-2 py-1 shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5 transition-all">Delete Head</button>
        <div className="flex gap-2">
          <input value={searchVal} onChange={e => setSearchVal(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()} placeholder="Search" className="border-4 border-black w-20 px-2 py-1 font-bold text-sm outline-none focus:border-[#fde047]" />
          <button onClick={handleSearch} className="border-4 border-black bg-[#fde047] font-black text-xs px-2 py-1 shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5 transition-all">Search</button>
        </div>
      </div>

      <InfoPanel text="Access: O(n) | Insert at Head: O(1) | Insert at Tail: O(n)" />
      <CodePanel topicId="linkedlist" highlightLine={codeLine} />
      <ExplainBox text={explain} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// VISUALIZATION 5: BUBBLE SORT
// ══════════════════════════════════════════════════════════════════════════════
interface SortStep {
  arr: number[];
  comparing: [number, number] | null;
  sorted: number[];
  swapped: boolean;
  comparisons: number;
  swaps: number;
}

function computeBubbleSortSteps(initial: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const arr = [...initial];
  const sorted: number[] = [];
  let comparisons = 0;
  let swaps = 0;

  steps.push({ arr: [...arr], comparing: null, sorted: [], swapped: false, comparisons, swaps });

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      comparisons++;
      const swapped = arr[j] > arr[j + 1];
      if (swapped) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swaps++;
      }
      steps.push({
        arr: [...arr],
        comparing: [j, j + 1],
        sorted: [...sorted],
        swapped,
        comparisons,
        swaps,
      });
    }
    sorted.unshift(arr.length - 1 - i);
  }
  steps.push({ arr: [...arr], comparing: null, sorted: arr.map((_, i) => i), swapped: false, comparisons, swaps });
  return steps;
}

function BubbleSortViz({ speed }: { speed: number }) {
  const DEFAULT = [64, 34, 25, 12, 22, 11, 90];
  const [steps] = useState(() => computeBubbleSortSteps(DEFAULT));
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const current = steps[stepIdx];
  const maxVal = Math.max(...DEFAULT);

  const clearTimer = () => { if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; } };

  const play = () => {
    if (stepIdx >= steps.length - 1) return;
    setPlaying(true);
    intervalRef.current = setInterval(() => {
      setStepIdx(prev => {
        if (prev >= steps.length - 1) { clearTimer(); setPlaying(false); return prev; }
        return prev + 1;
      });
    }, getDelay(speed));
  };

  const pause = () => { clearTimer(); setPlaying(false); };
  const step = () => { if (stepIdx < steps.length - 1) setStepIdx(s => s + 1); };
  const reset = () => { clearTimer(); setPlaying(false); setStepIdx(0); };

  useEffect(() => { return () => clearTimer(); }, []);

  const barColor = (i: number) => {
    if (current.sorted.includes(i)) return "bg-[#34d399]";
    if (current.comparing && (current.comparing[0] === i || current.comparing[1] === i)) return "bg-[#38bdf8]";
    return "bg-[#fb923c]";
  };

  const explainText = current.comparing
    ? current.swapped
      ? `Comparing arr[${current.comparing[0]}]=${current.arr[current.comparing[0]]} and arr[${current.comparing[1]}]=${current.arr[current.comparing[1]]}. Swapped! Larger element bubbles right.`
      : `Comparing arr[${current.comparing[0]}]=${current.arr[current.comparing[0]]} and arr[${current.comparing[1]}]=${current.arr[current.comparing[1]]}. Already in order — no swap needed.`
    : stepIdx === 0
      ? "Bubble Sort compares adjacent pairs and swaps them if out of order. Largest values 'bubble' to the end each pass."
      : "Sort complete! All elements are in their correct positions.";

  return (
    <div>
      <ControlsBar
        topic={TOPICS.find(t => t.id === "bubblesort")!}
        speed={speed} setSpeed={() => {}}
        playing={playing} onPlay={play} onPause={pause} onStep={step} onReset={reset}
      />

      <div className="flex items-end gap-2 h-56 bg-white border-4 border-black p-4 shadow-[4px_4px_0_0_#000]">
        {current.arr.map((v, i) => (
          <div key={i} className="flex flex-col items-center flex-1">
            <span className="font-black text-xs mb-1">{v}</span>
            <div
              className={`w-full border-2 border-black transition-all duration-300 ${barColor(i)}`}
              style={{ height: `${(v / maxVal) * 160}px` }}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-4 mt-3 flex-wrap">
        <span className="font-black text-sm bg-white border-4 border-black px-3 py-1 shadow-[2px_2px_0_0_#000]">Step: {stepIdx}/{steps.length - 1}</span>
        <span className="font-black text-sm bg-white border-4 border-black px-3 py-1 shadow-[2px_2px_0_0_#000]">Comparisons: {current.comparisons}</span>
        <span className="font-black text-sm bg-white border-4 border-black px-3 py-1 shadow-[2px_2px_0_0_#000]">Swaps: {current.swaps}</span>
      </div>

      <InfoPanel text="Bubble Sort — O(n²) time | O(1) space" />
      <CodePanel topicId="bubblesort" highlightLine={current.comparing ? 4 : stepIdx === 0 ? 0 : 9} />
      <ExplainBox text={explainText} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// VISUALIZATION 6: SELECTION SORT
// ══════════════════════════════════════════════════════════════════════════════
interface SelectionStep {
  arr: number[];
  currentI: number;
  currentJ: number | null;
  minIdx: number;
  sorted: number[];
  comparisons: number;
  swaps: number;
}

function computeSelectionSortSteps(initial: number[]): SelectionStep[] {
  const steps: SelectionStep[] = [];
  const arr = [...initial];
  const sorted: number[] = [];
  let comparisons = 0;
  let swaps = 0;

  steps.push({ arr: [...arr], currentI: 0, currentJ: null, minIdx: 0, sorted: [], comparisons, swaps });

  for (let i = 0; i < arr.length; i++) {
    let minIdx = i;
    for (let j = i + 1; j < arr.length; j++) {
      comparisons++;
      if (arr[j] < arr[minIdx]) minIdx = j;
      steps.push({ arr: [...arr], currentI: i, currentJ: j, minIdx, sorted: [...sorted], comparisons, swaps });
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      swaps++;
    }
    sorted.push(i);
    steps.push({ arr: [...arr], currentI: i, currentJ: null, minIdx: i, sorted: [...sorted], comparisons, swaps });
  }
  steps.push({ arr: [...arr], currentI: arr.length, currentJ: null, minIdx: -1, sorted: arr.map((_, i) => i), comparisons, swaps });
  return steps;
}

function SelectionSortViz({ speed }: { speed: number }) {
  const DEFAULT = [64, 25, 12, 22, 11];
  const [steps] = useState(() => computeSelectionSortSteps(DEFAULT));
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const current = steps[stepIdx];
  const maxVal = Math.max(...DEFAULT);

  const clearTimer = () => { if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; } };
  const play = () => {
    if (stepIdx >= steps.length - 1) return;
    setPlaying(true);
    intervalRef.current = setInterval(() => {
      setStepIdx(prev => {
        if (prev >= steps.length - 1) { clearTimer(); setPlaying(false); return prev; }
        return prev + 1;
      });
    }, getDelay(speed));
  };
  const pause = () => { clearTimer(); setPlaying(false); };
  const step = () => { if (stepIdx < steps.length - 1) setStepIdx(s => s + 1); };
  const reset = () => { clearTimer(); setPlaying(false); setStepIdx(0); };
  useEffect(() => () => clearTimer(), []);

  const barColor = (i: number) => {
    if (current.sorted.includes(i)) return "bg-[#34d399]";
    if (i === current.minIdx) return "bg-[#fde047]";
    if (i === current.currentJ) return "bg-[#38bdf8]";
    if (i === current.currentI) return "bg-[#c084fc]";
    return "bg-[#fb923c]";
  };

  const explainText = current.currentJ !== null
    ? `Scanning for minimum: comparing arr[${current.currentJ}]=${current.arr[current.currentJ]} with current min arr[${current.minIdx}]=${current.arr[current.minIdx]}.`
    : stepIdx === 0
      ? "Selection Sort finds the minimum element in the unsorted portion and places it at the front each pass."
      : current.sorted.length === DEFAULT.length
        ? "Sort complete! All elements placed in their correct positions."
        : `Placed minimum ${current.arr[current.currentI]} at position ${current.currentI}.`;

  return (
    <div>
      <ControlsBar
        topic={TOPICS.find(t => t.id === "selectionsort")!}
        speed={speed} setSpeed={() => {}}
        playing={playing} onPlay={play} onPause={pause} onStep={step} onReset={reset}
      />
      <div className="flex items-end gap-2 h-56 bg-white border-4 border-black p-4 shadow-[4px_4px_0_0_#000]">
        {current.arr.map((v, i) => (
          <div key={i} className="flex flex-col items-center flex-1">
            <span className="font-black text-xs mb-1">{v}</span>
            <div className={`w-full border-2 border-black transition-all duration-300 ${barColor(i)}`} style={{ height: `${(v / maxVal) * 160}px` }} />
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-3 flex-wrap">
        <span className="font-black text-sm bg-[#fde047] border-4 border-black px-3 py-1 shadow-[2px_2px_0_0_#000]">🏆 Min</span>
        <span className="font-black text-sm bg-[#38bdf8] border-4 border-black px-3 py-1 shadow-[2px_2px_0_0_#000]">Scanning</span>
        <span className="font-black text-sm bg-[#34d399] border-4 border-black px-3 py-1 shadow-[2px_2px_0_0_#000]">Sorted</span>
        <span className="font-black text-sm bg-white border-4 border-black px-3 py-1 shadow-[2px_2px_0_0_#000]">Comparisons: {current.comparisons}</span>
      </div>
      <InfoPanel text="Selection Sort — O(n²) time | O(1) space | Minimum swaps" />
      <CodePanel topicId="selectionsort" highlightLine={current.currentJ !== null ? 4 : 6} />
      <ExplainBox text={explainText} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// VISUALIZATION 7: INSERTION SORT
// ══════════════════════════════════════════════════════════════════════════════
interface InsertionStep {
  arr: number[];
  i: number;
  j: number;
  key: number;
  sorted: number[];
  comparisons: number;
}

function computeInsertionSortSteps(initial: number[]): InsertionStep[] {
  const steps: InsertionStep[] = [];
  const arr = [...initial];
  let comparisons = 0;

  steps.push({ arr: [...arr], i: 1, j: 0, key: arr[1], sorted: [0], comparisons });

  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      comparisons++;
      arr[j + 1] = arr[j];
      steps.push({ arr: [...arr], i, j, key, sorted: Array.from({ length: i }, (_, k) => k), comparisons });
      j--;
    }
    comparisons++;
    arr[j + 1] = key;
    steps.push({ arr: [...arr], i, j: j + 1, key, sorted: Array.from({ length: i + 1 }, (_, k) => k), comparisons });
  }
  steps.push({ arr: [...arr], i: arr.length, j: -1, key: -1, sorted: arr.map((_, k) => k), comparisons });
  return steps;
}

function InsertionSortViz({ speed }: { speed: number }) {
  const DEFAULT = [5, 2, 4, 6, 1, 3];
  const [steps] = useState(() => computeInsertionSortSteps(DEFAULT));
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const current = steps[stepIdx];
  const maxVal = Math.max(...DEFAULT);

  const clearTimer = () => { if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; } };
  const play = () => {
    if (stepIdx >= steps.length - 1) return;
    setPlaying(true);
    intervalRef.current = setInterval(() => {
      setStepIdx(prev => {
        if (prev >= steps.length - 1) { clearTimer(); setPlaying(false); return prev; }
        return prev + 1;
      });
    }, getDelay(speed));
  };
  const pause = () => { clearTimer(); setPlaying(false); };
  const step = () => { if (stepIdx < steps.length - 1) setStepIdx(s => s + 1); };
  const reset = () => { clearTimer(); setPlaying(false); setStepIdx(0); };
  useEffect(() => () => clearTimer(), []);

  const barColor = (i: number) => {
    if (current.sorted.includes(i) && i !== current.j) return "bg-[#34d399]";
    if (i === current.j) return "bg-[#fde047]";
    if (i === current.i) return "bg-[#c084fc]";
    return "bg-[#fb923c]";
  };

  const explainText = current.i >= DEFAULT.length
    ? "Sort complete! Insertion sort builds the sorted array one element at a time."
    : `Inserting key=${current.key} into the sorted portion. Shifting elements right to make room.`;

  return (
    <div>
      <ControlsBar
        topic={TOPICS.find(t => t.id === "insertionsort")!}
        speed={speed} setSpeed={() => {}}
        playing={playing} onPlay={play} onPause={pause} onStep={step} onReset={reset}
      />
      <div className="flex items-end gap-2 h-56 bg-white border-4 border-black p-4 shadow-[4px_4px_0_0_#000]">
        {current.arr.map((v, i) => (
          <div key={i} className="flex flex-col items-center flex-1">
            <span className="font-black text-xs mb-1">{v}</span>
            <div className={`w-full border-2 border-black transition-all duration-300 ${barColor(i)}`} style={{ height: `${(v / maxVal) * 160}px` }} />
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-3 flex-wrap">
        <span className="font-black text-sm bg-[#c084fc] border-4 border-black px-3 py-1 shadow-[2px_2px_0_0_#000]">Key</span>
        <span className="font-black text-sm bg-[#fde047] border-4 border-black px-3 py-1 shadow-[2px_2px_0_0_#000]">Inserting</span>
        <span className="font-black text-sm bg-[#34d399] border-4 border-black px-3 py-1 shadow-[2px_2px_0_0_#000]">Sorted</span>
        <span className="font-black text-sm bg-white border-4 border-black px-3 py-1 shadow-[2px_2px_0_0_#000]">Comparisons: {current.comparisons}</span>
      </div>
      <InfoPanel text="Insertion Sort — O(n²) worst | O(n) best (nearly sorted) | O(1) space" />
      <CodePanel topicId="insertionsort" highlightLine={current.i < DEFAULT.length ? 3 : 8} />
      <ExplainBox text={explainText} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// VISUALIZATION 8: LINEAR SEARCH
// ══════════════════════════════════════════════════════════════════════════════
function LinearSearchViz({ speed }: { speed: number }) {
  const ARR = [4, 2, 7, 1, 9, 3, 6, 8, 5];
  const [current, setCurrent] = useState<number | null>(null);
  const [found, setFound] = useState<number | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [target, setTarget] = useState("");
  const [playing, setPlaying] = useState(false);
  const [explain, setExplain] = useState("Linear search checks each element one by one from left to right until it finds the target or exhausts the array.");
  const [codeLine, setCodeLine] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = () => { if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; } };

  const handleSearch = () => {
    const t = parseInt(target);
    if (isNaN(t)) return;
    clearTimer();
    setCurrent(null); setFound(null); setNotFound(false);
    setPlaying(true);
    let i = 0;
    intervalRef.current = setInterval(() => {
      if (i >= ARR.length) {
        clearTimer(); setPlaying(false); setCurrent(null); setNotFound(true);
        setExplain(`${t} not found. Checked all ${ARR.length} elements — O(n) time.`);
        setCodeLine(7);
        return;
      }
      setCurrent(i);
      setCodeLine(2);
      if (ARR[i] === t) {
        clearTimer(); setPlaying(false); setFound(i);
        setExplain(`Found ${t} at index ${i}! Took ${i + 1} comparison(s). Best case O(1), worst case O(n).`);
        setCodeLine(4);
        return;
      }
      setExplain(`Checking index ${i}: value is ${ARR[i]}, not ${t}. Moving right...`);
      i++;
    }, getDelay(speed));
  };

  const reset = () => { clearTimer(); setPlaying(false); setCurrent(null); setFound(null); setNotFound(false); setTarget(""); setExplain("Linear search checks each element one by one from left to right."); setCodeLine(0); };

  const boxColor = (i: number) => {
    if (found === i) return "bg-[#34d399]";
    if (notFound) return "bg-white opacity-40";
    if (current === i) return "bg-[#fde047]";
    if (current !== null && i < current) return "bg-white opacity-40";
    return "bg-white";
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {ARR.map((v, i) => (
          <div key={i} className={`border-4 border-black w-14 h-14 flex flex-col items-center justify-center transition-all duration-300 shadow-[3px_3px_0_0_#000] ${boxColor(i)}`}>
            <span className="text-[10px] font-bold text-black/40">[{i}]</span>
            <span className="text-lg font-black">{v}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mt-4">
        <input
          value={target} onChange={e => setTarget(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !playing && handleSearch()}
          placeholder="Target"
          className="border-4 border-black w-24 px-2 py-1 font-bold text-sm outline-none focus:border-[#fde047]"
        />
        <button onClick={handleSearch} disabled={playing} className="border-4 border-black bg-[#fde047] font-black text-sm px-3 py-1 shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5 transition-all disabled:opacity-50">🔍 Search</button>
        <button onClick={reset} className="border-4 border-black bg-[#f472b6] font-black text-sm px-3 py-1 shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5 transition-all">🔄 Reset</button>
      </div>

      <InfoPanel text="Linear Search — O(n) time | O(1) space | Works on unsorted arrays" />
      <CodePanel topicId="linearsearch" highlightLine={codeLine} />
      <ExplainBox text={explain} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// VISUALIZATION 9: BINARY SEARCH
// ══════════════════════════════════════════════════════════════════════════════
interface BinaryStep {
  left: number;
  right: number;
  mid: number;
  eliminated: number[];
  found: number | null;
  message: string;
}

function BinarySearchViz({ speed }: { speed: number }) {
  const ARR = [2, 5, 8, 12, 15, 20, 25, 30];
  const [target, setTarget] = useState("");
  const [steps, setSteps] = useState<BinaryStep[]>([]);
  const [stepIdx, setStepIdx] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [explain, setExplain] = useState("Binary search works on sorted arrays. It repeatedly halves the search space by comparing the target with the middle element.");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = () => { if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; } };

  const computeSteps = (t: number): BinaryStep[] => {
    const result: BinaryStep[] = [];
    let left = 0, right = ARR.length - 1;
    const eliminated: number[] = [];
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (ARR[mid] === t) {
        result.push({ left, right, mid, eliminated: [...eliminated], found: mid, message: `Step ${result.length + 1}: Left=${left}, Right=${right}, Mid=${mid}, value=${ARR[mid]}. Found ${t}! ✓` });
        break;
      } else if (ARR[mid] < t) {
        result.push({ left, right, mid, eliminated: [...eliminated], found: null, message: `Step ${result.length + 1}: Left=${left}, Right=${right}, Mid=${mid}, value=${ARR[mid]}. Target ${t} > ${ARR[mid]} → Go Right` });
        for (let i = left; i <= mid; i++) eliminated.push(i);
        left = mid + 1;
      } else {
        result.push({ left, right, mid, eliminated: [...eliminated], found: null, message: `Step ${result.length + 1}: Left=${left}, Right=${right}, Mid=${mid}, value=${ARR[mid]}. Target ${t} < ${ARR[mid]} → Go Left` });
        for (let i = mid; i <= right; i++) eliminated.push(i);
        right = mid - 1;
      }
    }
    if (result.length === 0 || result[result.length - 1].found === null) {
      result.push({ left, right: left - 1, mid: -1, eliminated: Array.from({ length: ARR.length }, (_, i) => i), found: null, message: `${t} not found in the array.` });
    }
    return result;
  };

  const handleSearch = () => {
    const t = parseInt(target);
    if (isNaN(t)) return;
    clearTimer();
    const s = computeSteps(t);
    setSteps(s);
    setStepIdx(0);
    setPlaying(true);
    let i = 0;
    intervalRef.current = setInterval(() => {
      i++;
      if (i >= s.length) { clearTimer(); setPlaying(false); setStepIdx(s.length - 1); return; }
      setStepIdx(i);
    }, getDelay(speed));
  };

  const reset = () => { clearTimer(); setPlaying(false); setSteps([]); setStepIdx(-1); setTarget(""); setExplain("Binary search works on sorted arrays. It repeatedly halves the search space."); };

  const current = stepIdx >= 0 && steps[stepIdx] ? steps[stepIdx] : null;

  const boxColor = (i: number) => {
    if (!current) return "bg-white";
    if (current.found === i) return "bg-[#34d399]";
    if (current.eliminated.includes(i)) return "bg-white opacity-30";
    if (i === current.mid) return "bg-[#fde047]";
    return "bg-white";
  };

  const boxBorder = (i: number) => {
    if (!current) return "border-black";
    if (i === current.left) return "border-[#38bdf8] border-4";
    if (i === current.right) return "border-[#f472b6] border-4";
    return "border-black";
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {ARR.map((v, i) => (
          <div key={i} className={`border-4 w-14 h-14 flex flex-col items-center justify-center transition-all duration-300 shadow-[3px_3px_0_0_#000] ${boxColor(i)} ${boxBorder(i)}`}>
            <span className="text-[10px] font-bold text-black/40">[{i}]</span>
            <span className="text-lg font-black">{v}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap mb-2 text-xs font-bold">
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-[#38bdf8] border-2 border-black inline-block" /> Left boundary</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-[#f472b6] border-2 border-black inline-block" /> Right boundary</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-[#fde047] border-2 border-black inline-block" /> Mid</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-[#34d399] border-2 border-black inline-block" /> Found</span>
      </div>

      <div className="flex flex-wrap gap-3 mt-4">
        <input
          value={target} onChange={e => setTarget(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !playing && handleSearch()}
          placeholder="Target"
          className="border-4 border-black w-24 px-2 py-1 font-bold text-sm outline-none focus:border-[#fde047]"
        />
        <button onClick={handleSearch} disabled={playing} className="border-4 border-black bg-[#fde047] font-black text-sm px-3 py-1 shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5 transition-all disabled:opacity-50">🎯 Search</button>
        <button onClick={reset} className="border-4 border-black bg-[#f472b6] font-black text-sm px-3 py-1 shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5 transition-all">🔄 Reset</button>
      </div>

      {steps.length > 0 && (
        <div className="bg-[#0d0d1a] border-4 border-black p-4 mt-4 shadow-[4px_4px_0_0_#000]">
          <p className="text-xs font-black uppercase tracking-widest text-white/30 mb-2">Step Log</p>
          {steps.slice(0, stepIdx + 1).map((s, i) => (
            <div key={i} className={`font-mono text-xs py-1 px-2 mb-1 ${i === stepIdx ? "bg-[#fde047] text-black font-black" : "text-[#34d399]"}`}>
              {s.message}
            </div>
          ))}
        </div>
      )}

      <InfoPanel text="Binary Search — O(log n) | Array must be sorted" />
      <CodePanel topicId="binarysearch" highlightLine={current ? (current.found !== null ? 4 : current.mid === -1 ? 8 : 5) : 0} />
      <ExplainBox text={current ? current.message : explain} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// VISUALIZATION 10: BINARY TREE
// ══════════════════════════════════════════════════════════════════════════════
interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

function bstInsert(root: TreeNode | null, val: number): TreeNode {
  if (!root) return { val, left: null, right: null };
  if (val < root.val) return { ...root, left: bstInsert(root.left, val) };
  if (val > root.val) return { ...root, right: bstInsert(root.right, val) };
  return root;
}

function buildBST(values: number[]): TreeNode | null {
  let root: TreeNode | null = null;
  for (const v of values) root = bstInsert(root, v);
  return root;
}

function inorder(node: TreeNode | null, result: number[] = []): number[] {
  if (!node) return result;
  inorder(node.left, result);
  result.push(node.val);
  inorder(node.right, result);
  return result;
}

function preorder(node: TreeNode | null, result: number[] = []): number[] {
  if (!node) return result;
  result.push(node.val);
  preorder(node.left, result);
  preorder(node.right, result);
  return result;
}

function postorder(node: TreeNode | null, result: number[] = []): number[] {
  if (!node) return result;
  postorder(node.left, result);
  postorder(node.right, result);
  result.push(node.val);
  return result;
}

// Tree rendering with SVG
interface TreeRenderProps {
  node: TreeNode | null;
  x: number;
  y: number;
  dx: number;
  highlighted: number | null;
}

function TreeNodeSVG({ node, x, y, dx, highlighted }: TreeRenderProps) {
  if (!node) return null;
  const childY = y + 70;
  const isHighlighted = highlighted === node.val;

  return (
    <g>
      {node.left && (
        <line x1={x} y1={y} x2={x - dx} y2={childY} stroke="#000" strokeWidth="3" />
      )}
      {node.right && (
        <line x1={x} y1={y} x2={x + dx} y2={childY} stroke="#000" strokeWidth="3" />
      )}
      <circle
        cx={x} cy={y} r="22"
        fill={isHighlighted ? "#fde047" : "#fff"}
        stroke="#000" strokeWidth="4"
        className="transition-all duration-300"
      />
      <text x={x} y={y + 5} textAnchor="middle" fontWeight="900" fontSize="13" fill="#000">
        {node.val}
      </text>
      {node.left && (
        <TreeNodeSVG node={node.left} x={x - dx} y={childY} dx={dx * 0.55} highlighted={highlighted} />
      )}
      {node.right && (
        <TreeNodeSVG node={node.right} x={x + dx} y={childY} dx={dx * 0.55} highlighted={highlighted} />
      )}
    </g>
  );
}

function BinaryTreeViz({ speed }: { speed: number }) {
  const DEFAULT = [15, 8, 22, 4, 11, 18, 25];
  const [tree, setTree] = useState<TreeNode | null>(() => buildBST(DEFAULT));
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const [insertVal, setInsertVal] = useState("");
  const [explain, setExplain] = useState("A Binary Search Tree (BST) keeps elements ordered: left subtree < node < right subtree. This enables O(log n) search.");
  const [codeLine, setCodeLine] = useState(0);
  const traversalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleInsert = () => {
    const v = parseInt(insertVal);
    if (isNaN(v)) return;
    setTree(t => bstInsert(t, v));
    setHighlighted(v);
    setExplain(`Inserted ${v} into the BST. Compared with each node and placed in the correct position — O(log n) average.`);
    setCodeLine(4);
    setTimeout(() => setHighlighted(null), 1500);
    setInsertVal("");
  };

  const runTraversal = (order: number[]) => {
    if (traversalRef.current) clearTimeout(traversalRef.current);
    setHighlighted(null);
    let i = 0;
    const step = () => {
      if (i >= order.length) { setHighlighted(null); return; }
      setHighlighted(order[i]);
      i++;
      traversalRef.current = setTimeout(step, getDelay(speed));
    };
    step();
  };

  const handleInorder = () => {
    const order = inorder(tree);
    setExplain(`Inorder traversal: Left → Root → Right. Result: [${order.join(", ")}]. For a BST, inorder always gives sorted output!`);
    setCodeLine(5);
    runTraversal(order);
  };

  const handlePreorder = () => {
    const order = preorder(tree);
    setExplain(`Preorder traversal: Root → Left → Right. Result: [${order.join(", ")}]. Useful for copying or serializing a tree.`);
    setCodeLine(5);
    runTraversal(order);
  };

  const handlePostorder = () => {
    const order = postorder(tree);
    setExplain(`Postorder traversal: Left → Right → Root. Result: [${order.join(", ")}]. Useful for deleting a tree (children before parent).`);
    setCodeLine(5);
    runTraversal(order);
  };

  return (
    <div>
      <div className="bg-white border-4 border-black shadow-[4px_4px_0_0_#000] overflow-x-auto">
        <svg viewBox="0 0 500 260" className="w-full max-w-lg mx-auto block" style={{ minWidth: 300 }}>
          {tree && <TreeNodeSVG node={tree} x={250} y={40} dx={110} highlighted={highlighted} />}
          {!tree && <text x="250" y="130" textAnchor="middle" fill="#999" fontWeight="700" fontSize="14">Empty Tree</text>}
        </svg>
      </div>

      <div className="flex flex-wrap gap-3 mt-4">
        <div className="flex gap-2">
          <input
            value={insertVal} onChange={e => setInsertVal(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleInsert()}
            placeholder="Value"
            className="border-4 border-black w-20 px-2 py-1 font-bold text-sm outline-none focus:border-[#34d399]"
          />
          <button onClick={handleInsert} className="border-4 border-black bg-[#34d399] font-black text-sm px-3 py-1 shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5 transition-all">Insert</button>
        </div>
        <button onClick={handleInorder}   className="border-4 border-black bg-[#38bdf8] font-black text-sm px-3 py-1 shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5 transition-all">Inorder</button>
        <button onClick={handlePreorder}  className="border-4 border-black bg-[#c084fc] font-black text-sm px-3 py-1 shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5 transition-all">Preorder</button>
        <button onClick={handlePostorder} className="border-4 border-black bg-[#fb923c] font-black text-sm px-3 py-1 shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5 transition-all">Postorder</button>
        <button onClick={() => { setTree(buildBST(DEFAULT)); setHighlighted(null); setExplain("Reset to default BST."); }} className="border-4 border-black bg-[#f472b6] font-black text-sm px-3 py-1 shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5 transition-all">🔄 Reset</button>
      </div>

      <InfoPanel text="BST — Search O(log n) avg | Insert O(log n) avg | Inorder = sorted output" />
      <CodePanel topicId="binarytree" highlightLine={codeLine} />
      <ExplainBox text={explain} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN VISUALIZATION DISPATCHER
// ══════════════════════════════════════════════════════════════════════════════
function Visualization({ topicId, speed, setSpeed }: { topicId: TopicId; speed: number; setSpeed: (s: number) => void }) {
  const topic = TOPICS.find(t => t.id === topicId)!;

  // For non-sort topics, show the controls bar at the top (sort topics manage their own)
  const showTopBar = !["bubblesort", "selectionsort", "insertionsort"].includes(topicId);

  return (
    <div>
      {showTopBar && (
        <div className="border-4 border-black bg-white shadow-[6px_6px_0_0_#000] p-4 mb-4 flex flex-wrap items-center gap-3">
          <span className="font-black text-lg">{topic.emoji} {topic.label.toUpperCase()}</span>
          <div className="flex items-center gap-2 ml-auto flex-wrap">
            <span className="font-black text-xs text-black/50">🐢 SLOW</span>
            <input
              type="range" min={1} max={5} value={speed}
              onChange={e => setSpeed(Number(e.target.value))}
              className="w-24 accent-black cursor-pointer"
            />
            <span className="font-black text-xs text-black/50">FAST ⚡</span>
          </div>
        </div>
      )}

      {topicId === "array"         && <ArrayViz         speed={speed} />}
      {topicId === "stack"         && <StackViz         speed={speed} />}
      {topicId === "queue"         && <QueueViz         speed={speed} />}
      {topicId === "linkedlist"    && <LinkedListViz    speed={speed} />}
      {topicId === "binarytree"    && <BinaryTreeViz    speed={speed} />}
      {topicId === "bubblesort"    && <BubbleSortViz    speed={speed} />}
      {topicId === "selectionsort" && <SelectionSortViz speed={speed} />}
      {topicId === "insertionsort" && <InsertionSortViz speed={speed} />}
      {topicId === "linearsearch"  && <LinearSearchViz  speed={speed} />}
      {topicId === "binarysearch"  && <BinarySearchViz  speed={speed} />}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SIDEBAR
// ══════════════════════════════════════════════════════════════════════════════
function Sidebar({ activeTopic, onSelect }: { activeTopic: TopicId; onSelect: (id: TopicId) => void }) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleGroup = (label: string) => {
    setCollapsed(c => ({ ...c, [label]: !c[label] }));
  };

  return (
    <div className="w-full h-full bg-white border-r-4 border-black overflow-y-auto">
      <div className="bg-[#1a1a2e] border-b-4 border-black px-4 py-3">
        <p className="font-black text-white text-xs uppercase tracking-widest">Topics</p>
      </div>
      {GROUPS.map(group => {
        const groupTopics = TOPICS.filter(t => t.group === group.label);
        const isCollapsed = collapsed[group.label];
        return (
          <div key={group.label}>
            <button
              onClick={() => toggleGroup(group.label)}
              className={`w-full flex items-center justify-between px-4 py-3 border-b-4 border-black font-black text-xs uppercase tracking-widest text-black hover:opacity-80 transition-opacity ${group.color}`}
            >
              {group.label}
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {!isCollapsed && groupTopics.map(topic => (
              <button
                key={topic.id}
                onClick={() => onSelect(topic.id)}
                className={`w-full flex items-center gap-2 px-4 py-3 border-b-2 border-black/10 font-bold text-sm text-left transition-all hover:bg-[#fde047]
                  ${activeTopic === topic.id ? "bg-[#fde047] border-4 border-black font-black" : "bg-white"}`}
              >
                <span>{topic.emoji}</span>
                <span>{topic.label}</span>
              </button>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════════════════
export default function Playground() {
  const [activeTopic, setActiveTopic] = useState<TopicId>("array");
  const [speed, setSpeed] = useState(3);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const topic = TOPICS.find(t => t.id === activeTopic)!;

  const handleSelect = (id: TopicId) => {
    setActiveTopic(id);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* ── Header ── */}
      <div className="bg-[#1a1a2e] border-b-4 border-black px-6 py-10 text-center">
        <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-3">Visual Playground</p>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase leading-tight mb-3">
          See It. Understand It.
        </h1>
        <p className="text-base md:text-lg font-bold text-white/60 max-w-xl mx-auto">
          Watch data structures come to life — step by step
        </p>
      </div>

      {/* ── Mobile topic selector ── */}
      <div className="lg:hidden border-b-4 border-black bg-white px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => setMobileSidebarOpen(o => !o)}
          className="border-4 border-black bg-[#fde047] font-black text-sm px-4 py-2 shadow-[3px_3px_0_0_#000] flex items-center gap-2 hover:-translate-y-0.5 transition-all"
        >
          {topic.emoji} {topic.label}
          <ChevronDown className={`w-4 h-4 transition-transform ${mobileSidebarOpen ? "rotate-180" : ""}`} />
        </button>
        <span className="font-bold text-black/40 text-sm">Select a topic</span>
      </div>

      {/* ── Mobile dropdown ── */}
      {mobileSidebarOpen && (
        <div className="lg:hidden border-b-4 border-black bg-white z-30 shadow-[0_8px_0_0_#000]">
          <Sidebar activeTopic={activeTopic} onSelect={handleSelect} />
        </div>
      )}

      {/* ── Main layout ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <div className="hidden lg:block w-64 shrink-0 border-r-4 border-black">
          <Sidebar activeTopic={activeTopic} onSelect={handleSelect} />
        </div>

        {/* Main panel */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <Visualization topicId={activeTopic} speed={speed} setSpeed={setSpeed} />
        </div>
      </div>

      {/* ── Bottom CTA ── */}
      <div className="bg-[#1a1a2e] border-t-4 border-black px-6 py-10 text-center">
        <p className="font-black text-white/50 text-sm uppercase tracking-widest mb-3">Ready for the next step?</p>
        <h2 className="text-2xl md:text-3xl font-black text-white uppercase mb-4">
          Now find what to study for your dream company →
        </h2>
        <Link
          to="/placement"
          className="inline-block bg-[#34d399] border-4 border-black font-black text-black text-lg px-8 py-4 shadow-[6px_6px_0_0_#34d399] hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#34d399] transition-all"
        >
          View Placement Roadmap →
        </Link>
      </div>
    </div>
  );
}
