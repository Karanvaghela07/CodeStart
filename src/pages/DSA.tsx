import { useState } from "react";
import { Lock, Zap, Lightbulb, Clock, ChevronRight, ChevronLeft, Menu, X, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { chapters, DSATopic } from "../data/dsaData";

// ── Flat topic list for prev/next navigation ──────────────────────────────────
const allTopics: { topic: DSATopic; chapterColor: string; chapterPlan: "free" | "pro"; chapterId: number }[] = [];
chapters.forEach(ch => ch.topics.forEach(t => allTopics.push({ topic: t, chapterColor: ch.color, chapterPlan: ch.plan, chapterId: ch.id })));

// ── Shared diagram wrapper ────────────────────────────────────────────────────
function DiagramBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#0d0d1a] border-4 border-black p-5 shadow-[4px_4px_0_0_#000] mb-8">
      <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-4">{title}</p>
      {children}
    </div>
  );
}

// ── Visual Diagrams ───────────────────────────────────────────────────────────
function Diagram({ topicId }: { topicId: string }) {

  // big-1: Data structure overview cards
  if (topicId === "big-1") return (
    <DiagramBox title="Visual: Data Structures at a Glance">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { name: "Array", icon: "▦", color: "#34d399", desc: "Indexed, O(1) access" },
          { name: "Stack", icon: "⬆", color: "#38bdf8", desc: "LIFO, push/pop" },
          { name: "Queue", icon: "➡", color: "#fde047", desc: "FIFO, enqueue/dequeue" },
          { name: "HashMap", icon: "#", color: "#fb923c", desc: "Key→value, O(1) lookup" },
          { name: "Tree", icon: "🌲", color: "#c084fc", desc: "Hierarchical, O(log n)" },
          { name: "Graph", icon: "⬡", color: "#f472b6", desc: "Nodes + edges, flexible" },
        ].map(ds => (
          <div key={ds.name} className="border-2 p-3 flex flex-col gap-1" style={{ borderColor: ds.color, backgroundColor: ds.color + "15" }}>
            <div className="text-xl">{ds.icon}</div>
            <div className="font-black text-sm" style={{ color: ds.color }}>{ds.name}</div>
            <div className="text-white/50 text-xs">{ds.desc}</div>
          </div>
        ))}
      </div>
    </DiagramBox>
  );

  // big-2: Brute force vs optimized
  if (topicId === "big-2") return (
    <DiagramBox title="Visual: Brute Force vs Optimized">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border-4 border-[#f472b6] bg-[#f472b6]/10 p-4">
          <div className="font-black text-[#f472b6] text-sm mb-2">Brute Force O(n²)</div>
          <div className="flex flex-col gap-1">
            {[0,1,2,3,4].map(i => (
              <div key={i} className="flex gap-1">
                {[0,1,2,3,4].map(j => (
                  <div key={j} className={`w-6 h-6 border flex items-center justify-center text-[10px] font-bold ${i===j?"border-[#f472b6] bg-[#f472b6]/30 text-[#f472b6]":"border-white/10 text-white/20"}`}>
                    {i===j?"✓":"·"}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="text-white/40 text-xs mt-2">Nested loops — n×n comparisons</div>
        </div>
        <div className="border-4 border-[#34d399] bg-[#34d399]/10 p-4">
          <div className="font-black text-[#34d399] text-sm mb-2">Optimized O(n)</div>
          <div className="flex flex-col gap-1">
            {[0,1,2,3,4].map(i => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-6 h-6 border-2 border-[#34d399] bg-[#34d399]/20 flex items-center justify-center text-[10px] font-bold text-[#34d399]">✓</div>
                <div className="text-white/40 text-xs">step {i+1}</div>
              </div>
            ))}
          </div>
          <div className="text-white/40 text-xs mt-2">Single pass — n comparisons</div>
        </div>
      </div>
    </DiagramBox>
  );

  // big-3: Big-O bar chart
  if (topicId === "big-3") return (
    <DiagramBox title="Visual: Big-O Growth Rates">
      <div className="flex flex-col gap-2">
        {[
          { label: "O(1)",      width: "5%",   color: "#34d399", desc: "Constant — array access" },
          { label: "O(log n)",  width: "18%",  color: "#38bdf8", desc: "Logarithmic — binary search" },
          { label: "O(n)",      width: "38%",  color: "#fde047", desc: "Linear — single loop" },
          { label: "O(n log n)",width: "58%",  color: "#fb923c", desc: "Merge sort, quick sort" },
          { label: "O(n²)",     width: "82%",  color: "#f472b6", desc: "Quadratic — nested loops" },
          { label: "O(2ⁿ)",     width: "100%", color: "#e94560", desc: "Exponential — avoid!" },
        ].map(row => (
          <div key={row.label} className="flex items-center gap-3">
            <span className="font-mono text-xs w-20 shrink-0" style={{ color: row.color }}>{row.label}</span>
            <div className="flex-1 bg-white/5 h-5 overflow-hidden">
              <div className="h-full" style={{ width: row.width, backgroundColor: row.color, opacity: 0.75 }} />
            </div>
            <span className="font-bold text-white/40 text-xs w-44 shrink-0 hidden sm:block">{row.desc}</span>
          </div>
        ))}
      </div>
    </DiagramBox>
  );

  // big-4: 4-step problem solving flow
  if (topicId === "big-4") return (
    <DiagramBox title="Visual: Problem Solving Framework">
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-0">
        {[
          { step: "1", label: "Understand", icon: "🔍", color: "#38bdf8", desc: "Read carefully, ask questions" },
          { step: "2", label: "Plan",       icon: "📝", color: "#c084fc", desc: "Brute force first, then optimize" },
          { step: "3", label: "Code",       icon: "💻", color: "#34d399", desc: "Write clean, readable code" },
          { step: "4", label: "Test",       icon: "✅", color: "#fde047", desc: "Edge cases, trace through" },
        ].map((s, i) => (
          <div key={s.step} className="flex sm:flex-col items-center gap-2 sm:gap-0 flex-1">
            <div className="flex sm:flex-col items-center gap-2 sm:gap-1 w-full sm:w-auto">
              <div className="w-14 h-14 border-4 flex flex-col items-center justify-center shrink-0" style={{ borderColor: s.color, backgroundColor: s.color + "20" }}>
                <span className="text-xl">{s.icon}</span>
              </div>
              <div className="sm:text-center">
                <div className="font-black text-sm" style={{ color: s.color }}>{s.label}</div>
                <div className="text-white/40 text-xs">{s.desc}</div>
              </div>
            </div>
            {i < 3 && <div className="text-white/30 font-black text-xl sm:rotate-90 shrink-0">→</div>}
          </div>
        ))}
      </div>
    </DiagramBox>
  );

  // arr-1: 1D array with indices
  if (topicId === "arr-1") return (
    <DiagramBox title="Visual: Array with Indices">
      <div className="flex items-end gap-0 overflow-x-auto pb-2">
        {[10,20,30,40,50].map((v, i) => (
          <div key={i} className="flex flex-col items-center shrink-0">
            <div className="w-14 h-14 border-4 border-[#34d399] bg-[#34d399]/10 flex items-center justify-center font-black text-[#34d399] text-lg">{v}</div>
            <div className="w-14 text-center font-mono text-[#fde047] text-xs mt-1">[{i}]</div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-4 flex-wrap">
        <span className="font-mono text-xs text-[#34d399]">arr[0] = 10</span>
        <span className="font-mono text-xs text-[#34d399]">arr[4] = 50</span>
        <span className="font-mono text-xs text-[#fde047]">arr.length = 5</span>
        <span className="font-mono text-xs text-white/40">← index starts at 0</span>
      </div>
    </DiagramBox>
  );

  // arr-2: 2D array grid
  if (topicId === "arr-2") return (
    <DiagramBox title="Visual: 2D Array — Row × Column">
      <div className="overflow-x-auto">
        <div className="flex gap-1 mb-1 ml-10">
          {[0,1,2].map(c => <div key={c} className="w-12 text-center font-mono text-xs text-[#38bdf8]">col {c}</div>)}
        </div>
        {[[1,2,3],[4,5,6],[7,8,9]].map((row, r) => (
          <div key={r} className="flex items-center gap-1 mb-1">
            <div className="w-10 font-mono text-xs text-[#fde047] text-right pr-1">row {r}</div>
            {row.map((v, c) => (
              <div key={c} className={`w-12 h-10 border-2 flex flex-col items-center justify-center font-black text-sm ${r===1&&c===2?"border-[#34d399] bg-[#34d399]/20 text-[#34d399]":"border-white/20 text-white/60"}`}>
                {v}
                {r===1&&c===2 && <span className="text-[9px] text-[#34d399] font-mono">[1][2]</span>}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-2 font-mono text-xs text-[#34d399]">grid[1][2] = 6 — row 1, column 2</div>
    </DiagramBox>
  );

  // arr-3: String as character array
  if (topicId === "arr-3") return (
    <DiagramBox title="Visual: String as Character Array">
      <div className="flex items-end gap-0 overflow-x-auto pb-2">
        {"hello".split("").map((ch, i) => (
          <div key={i} className="flex flex-col items-center shrink-0">
            <div className="w-12 h-12 border-4 border-[#fb923c] bg-[#fb923c]/10 flex items-center justify-center font-black text-[#fb923c] text-xl">{ch}</div>
            <div className="w-12 text-center font-mono text-[#fde047] text-xs mt-1">[{i}]</div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-4 flex-wrap">
        <span className="font-mono text-xs text-[#fb923c]">"hello"[0] = 'h'</span>
        <span className="font-mono text-xs text-[#fb923c]">"hello"[4] = 'o'</span>
        <span className="font-mono text-xs text-[#fde047]">length = 5</span>
      </div>
      <div className="mt-2 font-mono text-xs text-white/40">Reverse: "hello" → "olleh"</div>
    </DiagramBox>
  );

  // arr-4: Sliding window
  if (topicId === "arr-4") return (
    <DiagramBox title="Visual: Sliding Window — max sum of size 3">
      <div className="flex flex-col gap-4">
        {[
          { label: "Window 1", arr: [2,1,5,1,3,2], lo: 0, hi: 2, sum: 8 },
          { label: "Window 2", arr: [2,1,5,1,3,2], lo: 1, hi: 3, sum: 7 },
          { label: "Window 3", arr: [2,1,5,1,3,2], lo: 2, hi: 4, sum: 9 },
          { label: "Window 4", arr: [2,1,5,1,3,2], lo: 3, hi: 5, sum: 6 },
        ].map(w => (
          <div key={w.label} className="flex items-center gap-3">
            <span className="font-bold text-xs w-20 shrink-0 text-white/50">{w.label}</span>
            <div className="flex gap-1">
              {w.arr.map((v, i) => (
                <div key={i} className={`w-9 h-9 border-2 flex items-center justify-center font-black text-sm ${i>=w.lo&&i<=w.hi?"border-[#34d399] bg-[#34d399]/20 text-[#34d399]":"border-white/20 text-white/30"}`}>{v}</div>
              ))}
            </div>
            <span className="font-mono text-xs text-[#fde047]">sum={w.sum}{w.sum===9?" ✓ max":""}</span>
          </div>
        ))}
      </div>
    </DiagramBox>
  );

  // ll-1: Singly linked list
  if (topicId === "ll-1") return (
    <DiagramBox title="Visual: Singly Linked List">
      <div className="flex items-center gap-1 overflow-x-auto pb-2 flex-wrap">
        {[1,2,3].map((v, i) => (
          <div key={i} className="flex items-center shrink-0">
            <div className="border-4 border-[#fde047] bg-[#fde047]/10 flex">
              <div className="px-3 py-2 font-black text-[#fde047] text-base border-r-4 border-[#fde047]">{v}</div>
              <div className="px-3 py-2 font-mono text-[#fde047]/50 text-xs flex items-center">next</div>
            </div>
            <div className="text-[#34d399] font-black text-xl mx-1">→</div>
          </div>
        ))}
        <div className="font-mono text-white/30 text-sm font-black">null</div>
      </div>
      <div className="mt-3 flex gap-4 flex-wrap">
        <span className="font-mono text-xs text-[#fde047]">head → node(1)</span>
        <span className="font-mono text-xs text-white/40">Access: O(n) — must traverse</span>
        <span className="font-mono text-xs text-white/40">Insert at head: O(1)</span>
      </div>
    </DiagramBox>
  );

  // ll-2: Doubly linked list
  if (topicId === "ll-2") return (
    <DiagramBox title="Visual: Doubly Linked List">
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        <div className="font-mono text-white/30 text-xs shrink-0">null ←</div>
        {[1,2,3].map((v, i) => (
          <div key={i} className="flex items-center shrink-0">
            <div className="border-4 border-[#38bdf8] bg-[#38bdf8]/10 flex flex-col items-center">
              <div className="px-2 py-0.5 font-mono text-[#38bdf8]/50 text-[10px] border-b border-[#38bdf8]/30">prev</div>
              <div className="px-4 py-1 font-black text-[#38bdf8] text-base">{v}</div>
              <div className="px-2 py-0.5 font-mono text-[#38bdf8]/50 text-[10px] border-t border-[#38bdf8]/30">next</div>
            </div>
            {i < 2 && <div className="flex flex-col items-center mx-1">
              <span className="text-[#34d399] text-xs">→</span>
              <span className="text-[#f472b6] text-xs">←</span>
            </div>}
          </div>
        ))}
        <div className="font-mono text-white/30 text-xs shrink-0">→ null</div>
      </div>
      <div className="mt-3 flex gap-4 flex-wrap">
        <span className="font-mono text-xs text-[#38bdf8]">Traverse both directions</span>
        <span className="font-mono text-xs text-white/40">Delete with ref: O(1)</span>
      </div>
    </DiagramBox>
  );

  // ll-3: Reverse linked list
  if (topicId === "ll-3") return (
    <DiagramBox title="Visual: Reversing a Linked List">
      <div className="flex flex-col gap-4">
        <div>
          <div className="text-xs text-white/40 mb-2 font-bold">BEFORE:</div>
          <div className="flex items-center gap-1">
            {[1,2,3].map((v,i) => (
              <div key={i} className="flex items-center shrink-0">
                <div className="w-10 h-10 border-4 border-[#f472b6] bg-[#f472b6]/10 flex items-center justify-center font-black text-[#f472b6]">{v}</div>
                <span className="text-[#f472b6] font-black mx-1">→</span>
              </div>
            ))}
            <span className="font-mono text-white/30 text-sm">null</span>
          </div>
        </div>
        <div className="text-center text-[#fde047] font-black text-lg">↓ reverse()</div>
        <div>
          <div className="text-xs text-white/40 mb-2 font-bold">AFTER:</div>
          <div className="flex items-center gap-1">
            {[3,2,1].map((v,i) => (
              <div key={i} className="flex items-center shrink-0">
                <div className="w-10 h-10 border-4 border-[#34d399] bg-[#34d399]/10 flex items-center justify-center font-black text-[#34d399]">{v}</div>
                <span className="text-[#34d399] font-black mx-1">→</span>
              </div>
            ))}
            <span className="font-mono text-white/30 text-sm">null</span>
          </div>
        </div>
      </div>
      <div className="mt-3 font-mono text-xs text-white/40">Three pointers: prev=null, curr=head, next=curr.next</div>
    </DiagramBox>
  );

  // ll-4: Cycle detection with slow/fast pointers
  if (topicId === "ll-4") return (
    <DiagramBox title="Visual: Floyd's Cycle Detection">
      <svg viewBox="0 0 320 140" className="w-full max-w-sm mx-auto">
        {/* Nodes in a circle */}
        {[{x:160,y:20,v:1},{x:260,y:60,v:2},{x:240,y:120,v:3},{x:80,y:120,v:4},{x:60,y:60,v:5}].map((n,i,arr) => {
          const next = arr[(i+1)%arr.length];
          return <line key={i} x1={n.x} y1={n.y} x2={next.x} y2={next.y} stroke="#fde047" strokeWidth="2" markerEnd="url(#arrow)"/>;
        })}
        <defs><marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#fde047"/></marker></defs>
        {[{x:160,y:20,v:1},{x:260,y:60,v:2},{x:240,y:120,v:3},{x:80,y:120,v:4},{x:60,y:60,v:5}].map((n,i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r="16" fill={i===2?"#34d399":i===4?"#38bdf8":"#fde047"} stroke="black" strokeWidth="3"/>
            <text x={n.x} y={n.y+5} textAnchor="middle" fill="black" fontWeight="900" fontSize="12">{n.v}</text>
          </g>
        ))}
        <text x="240" y="145" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="700">slow</text>
        <text x="60" y="45" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="700">fast</text>
        <text x="160" y="75" textAnchor="middle" fill="#fde047" fontSize="9">cycle detected when slow=fast</text>
      </svg>
    </DiagramBox>
  );

  // sq-1: Stack
  if (topicId === "sq-1") return (
    <DiagramBox title="Visual: Stack (LIFO) — Like a Pile of Plates">
      <div className="flex gap-8 items-end flex-wrap">
        <div className="flex flex-col-reverse gap-0">
          {[1,2,3].map((v, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="font-mono text-[#38bdf8] text-xs w-20 text-right">push({v}) →</span>
              <div className={`w-20 h-10 border-4 flex items-center justify-center font-black text-base ${i===2?"border-[#34d399] bg-[#34d399]/20 text-[#34d399]":"border-white/30 bg-white/5 text-white/60"}`}>{v}</div>
              {i===2 && <span className="font-black text-[#34d399] text-xs">← TOP</span>}
            </div>
          ))}
          <div className="w-20 h-2 bg-white/20 ml-[88px]" />
        </div>
        <div className="flex flex-col gap-2 text-xs">
          <div className="font-bold text-white/40">Last In = First Out</div>
          <div className="font-mono text-[#34d399]">push(3) → top</div>
          <div className="font-mono text-[#f472b6]">pop() → 3 first</div>
          <div className="font-mono text-white/40">Like a pile of plates</div>
        </div>
      </div>
    </DiagramBox>
  );

  // sq-2: Queue
  if (topicId === "sq-2") return (
    <DiagramBox title="Visual: Queue (FIFO) — Like a Ticket Line">
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <div className="flex flex-col items-center shrink-0">
          <span className="font-black text-[#34d399] text-xs mb-1">FRONT</span>
          <span className="font-mono text-[#34d399] text-xs">← dequeue</span>
        </div>
        {[1,2,3,4].map((v, i) => (
          <div key={i} className={`w-12 h-12 border-4 flex items-center justify-center font-black text-base shrink-0 ${i===0?"border-[#34d399] bg-[#34d399]/20 text-[#34d399]":"border-white/30 bg-white/5 text-white/60"}`}>{v}</div>
        ))}
        <div className="flex flex-col items-center shrink-0">
          <span className="font-black text-[#f472b6] text-xs mb-1">BACK</span>
          <span className="font-mono text-[#f472b6] text-xs">enqueue →</span>
        </div>
      </div>
      <div className="mt-3 font-mono text-xs text-white/40">First In = First Out — 1 exits first, new items join at back</div>
    </DiagramBox>
  );

  // sq-3: Monotonic stack
  if (topicId === "sq-3") return (
    <DiagramBox title="Visual: Monotonic Stack — Next Greater Element">
      <div className="flex flex-col gap-3">
        <div className="flex gap-1 items-end">
          {[4,5,2,10,8].map((v,i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-10 h-10 border-2 border-[#38bdf8] bg-[#38bdf8]/10 flex items-center justify-center font-black text-[#38bdf8] text-sm">{v}</div>
              <div className="font-mono text-[10px] text-white/40">[{i}]</div>
            </div>
          ))}
          <div className="ml-4 text-xs text-white/40">Input array</div>
        </div>
        <div className="border-t border-white/10 pt-3">
          <div className="text-xs text-white/40 mb-2">Result (next greater for each):</div>
          <div className="flex gap-1 items-end">
            {[5,10,10,-1,-1].map((v,i) => (
              <div key={i} className="flex flex-col items-center">
                <div className={`w-10 h-10 border-2 flex items-center justify-center font-black text-sm ${v===-1?"border-white/20 text-white/30":"border-[#34d399] bg-[#34d399]/10 text-[#34d399]"}`}>{v}</div>
                <div className="font-mono text-[10px] text-white/40">[{i}]</div>
              </div>
            ))}
          </div>
        </div>
        <div className="font-mono text-xs text-[#fde047]">Stack stores indices, pop when arr[stack.top] &lt; arr[i]</div>
      </div>
    </DiagramBox>
  );

  // sq-4: Deque
  if (topicId === "sq-4") return (
    <DiagramBox title="Visual: Deque — Double-Ended Queue">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          <div className="flex flex-col items-center shrink-0 gap-1">
            <span className="font-mono text-[#34d399] text-xs">addFront ↓</span>
            <span className="font-mono text-[#f472b6] text-xs">removeFront ↑</span>
          </div>
          {[1,2,3,4,5].map((v,i) => (
            <div key={i} className={`w-11 h-11 border-4 flex items-center justify-center font-black text-base shrink-0 ${i===0?"border-[#34d399] bg-[#34d399]/20 text-[#34d399]":i===4?"border-[#fb923c] bg-[#fb923c]/20 text-[#fb923c]":"border-white/30 bg-white/5 text-white/60"}`}>{v}</div>
          ))}
          <div className="flex flex-col items-center shrink-0 gap-1">
            <span className="font-mono text-[#fb923c] text-xs">↓ addBack</span>
            <span className="font-mono text-[#c084fc] text-xs">↑ removeBack</span>
          </div>
        </div>
        <div className="font-mono text-xs text-white/40">Add/remove from BOTH ends — O(1) each operation</div>
      </div>
    </DiagramBox>
  );

  // rec-1: Call stack for factorial
  if (topicId === "rec-1") return (
    <DiagramBox title="Visual: Call Stack — factorial(3)">
      <div className="flex flex-col gap-1">
        {[
          { call: "factorial(3)", ret: "= 3 × 2 = 6", color: "#c084fc" },
          { call: "factorial(2)", ret: "= 2 × 1 = 2", color: "#fb923c" },
          { call: "factorial(1)", ret: "= 1 (base case)", color: "#34d399" },
        ].map((f, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="flex-1 border-4 p-2 flex justify-between items-center" style={{ borderColor: f.color, backgroundColor: f.color + "15" }}>
              <span className="font-mono text-sm font-black" style={{ color: f.color }}>{f.call}</span>
              <span className="font-mono text-xs text-white/50">{f.ret}</span>
            </div>
            {i < 2 && <span className="text-white/30 text-xs">calls ↓</span>}
          </div>
        ))}
      </div>
      <div className="mt-3 font-mono text-xs text-white/40">Stack unwinds bottom-up: 1 → 2 → 6</div>
    </DiagramBox>
  );

  // rec-2: Fibonacci recursion tree
  if (topicId === "rec-2") return (
    <DiagramBox title="Visual: Recursion Tree — fib(4) with Overlapping Subproblems">
      <svg viewBox="0 0 340 185" className="w-full max-w-sm mx-auto">
        <line x1="170" y1="25" x2="90" y2="65" stroke="#fb923c" strokeWidth="1.5"/>
        <line x1="170" y1="25" x2="250" y2="65" stroke="#fb923c" strokeWidth="1.5"/>
        <line x1="90" y1="65" x2="50" y2="110" stroke="#fb923c" strokeWidth="1.5"/>
        <line x1="90" y1="65" x2="130" y2="110" stroke="#fb923c" strokeWidth="1.5"/>
        <line x1="250" y1="65" x2="220" y2="110" stroke="#fb923c" strokeWidth="1.5"/>
        <line x1="250" y1="65" x2="280" y2="110" stroke="#fb923c" strokeWidth="1.5"/>
        <line x1="50" y1="110" x2="30" y2="150" stroke="#fb923c" strokeWidth="1.5"/>
        <line x1="50" y1="110" x2="70" y2="150" stroke="#fb923c" strokeWidth="1.5"/>
        {[
          {x:170,y:25,l:"fib(4)",c:"#c084fc"},
          {x:90,y:65,l:"fib(3)",c:"#fb923c"},
          {x:250,y:65,l:"fib(2)",c:"#fde047",dup:true},
          {x:50,y:110,l:"fib(2)",c:"#fde047",dup:true},
          {x:130,y:110,l:"fib(1)",c:"#34d399"},
          {x:220,y:110,l:"fib(1)",c:"#34d399"},
          {x:280,y:110,l:"fib(0)",c:"#34d399"},
          {x:30,y:150,l:"fib(1)",c:"#34d399"},
          {x:70,y:150,l:"fib(0)",c:"#34d399"},
        ].map((n,i) => (
          <g key={i}>
            <rect x={n.x-28} y={n.y-12} width="56" height="22" rx="3" fill={n.c} stroke={n.dup?"#e94560":"black"} strokeWidth={n.dup?3:2}/>
            <text x={n.x} y={n.y+4} textAnchor="middle" fill="black" fontWeight="700" fontSize="10">{n.l}</text>
          </g>
        ))}
        <text x="170" y="178" textAnchor="middle" fill="#e94560" fontSize="9" fontWeight="700">fib(2) computed twice! → memoize to fix</text>
      </svg>
    </DiagramBox>
  );

  // rec-3: Backtracking maze
  if (topicId === "rec-3") return (
    <DiagramBox title="Visual: Backtracking — Maze Solving">
      <div className="flex gap-6 flex-wrap items-start">
        <div>
          <div className="text-xs text-white/40 mb-2">Maze (S=start, E=end, X=wall)</div>
          <div className="font-mono text-sm leading-6">
            {[["S","·","X","·"],["·","X","·","·"],["·","·","·","X"],["X","·","·","E"]].map((row,r) => (
              <div key={r} className="flex gap-1">
                {row.map((cell,c) => (
                  <div key={c} className={`w-8 h-8 border-2 flex items-center justify-center font-black text-xs
                    ${cell==="S"?"border-[#34d399] bg-[#34d399]/20 text-[#34d399]":
                      cell==="E"?"border-[#fde047] bg-[#fde047]/20 text-[#fde047]":
                      cell==="X"?"border-white/10 bg-white/5 text-white/20":
                      "border-white/20 text-white/40"}`}>{cell}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2 text-xs">
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#34d399]"/><span className="text-white/60">Try path</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#e94560]"/><span className="text-white/60">Dead end → backtrack</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#fde047]"/><span className="text-white/60">Found exit!</span></div>
          <div className="mt-2 text-white/40">Try → fail → undo → try again</div>
        </div>
      </div>
    </DiagramBox>
  );

  // rec-4: N-Queens
  if (topicId === "rec-4") return (
    <DiagramBox title="Visual: N-Queens — 4×4 Solution">
      <div className="flex gap-6 flex-wrap items-start">
        <div>
          {[[0,1,0,0],[0,0,0,1],[1,0,0,0],[0,0,1,0]].map((row,r) => (
            <div key={r} className="flex">
              {row.map((cell,c) => (
                <div key={c} className={`w-10 h-10 border-2 flex items-center justify-center text-lg font-black ${(r+c)%2===0?"bg-white/5":"bg-white/10"} ${cell?"border-[#c084fc] text-[#c084fc]":"border-white/10 text-transparent"}`}>
                  {cell?"♛":"·"}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 text-xs text-white/50">
          <div className="font-bold text-[#c084fc]">Rules:</div>
          <div>No two queens share a row</div>
          <div>No two queens share a column</div>
          <div>No two queens share a diagonal</div>
          <div className="mt-2 text-white/40">Place → check → backtrack if conflict</div>
        </div>
      </div>
    </DiagramBox>
  );

  // sort-1: Bubble sort
  if (topicId === "sort-1") return (
    <DiagramBox title="Visual: Bubble Sort — Passes">
      <div className="flex flex-col gap-3">
        {[
          { label: "Unsorted", arr: [5,3,8,1,2], color: "#f472b6" },
          { label: "Pass 1",   arr: [3,5,1,2,8], color: "#fb923c", swap: 4 },
          { label: "Pass 2",   arr: [3,1,2,5,8], color: "#fde047", swap: 3 },
          { label: "Pass 3",   arr: [1,2,3,5,8], color: "#34d399", swap: -1 },
        ].map(row => (
          <div key={row.label} className="flex items-center gap-3">
            <span className="font-bold text-xs w-16 shrink-0" style={{ color: row.color }}>{row.label}</span>
            <div className="flex gap-1">
              {row.arr.map((v, i) => (
                <div key={i} className="w-9 h-9 border-2 flex items-center justify-center font-black text-sm" style={{ borderColor: row.color, color: row.color, backgroundColor: row.color + "20" }}>{v}</div>
              ))}
            </div>
            {row.swap !== undefined && row.swap >= 0 && <span className="text-white/30 text-xs">bubble {row.arr[row.swap]} to end</span>}
          </div>
        ))}
      </div>
      <div className="mt-2 font-mono text-xs text-white/40">Compare adjacent pairs, swap if out of order — O(n²)</div>
    </DiagramBox>
  );

  // sort-2: Selection sort
  if (topicId === "sort-2") return (
    <DiagramBox title="Visual: Selection Sort — Find Min Each Pass">
      <div className="flex flex-col gap-3">
        {[
          { label: "Start",  arr: [5,3,8,1,2], minIdx: 3, sortedTo: -1 },
          { label: "Pass 1", arr: [1,3,8,5,2], minIdx: 4, sortedTo: 0 },
          { label: "Pass 2", arr: [1,2,8,5,3], minIdx: 4, sortedTo: 1 },
          { label: "Done",   arr: [1,2,3,5,8], minIdx: -1, sortedTo: 4 },
        ].map(row => (
          <div key={row.label} className="flex items-center gap-3">
            <span className="font-bold text-xs w-14 shrink-0 text-white/50">{row.label}</span>
            <div className="flex gap-1">
              {row.arr.map((v, i) => (
                <div key={i} className={`w-9 h-9 border-2 flex items-center justify-center font-black text-sm
                  ${i<=row.sortedTo?"border-[#34d399] bg-[#34d399]/20 text-[#34d399]":
                    i===row.minIdx?"border-[#fde047] bg-[#fde047]/20 text-[#fde047]":
                    "border-white/20 text-white/50"}`}>{v}</div>
              ))}
            </div>
            {row.minIdx>=0 && <span className="text-[#fde047] text-xs">min={row.arr[row.minIdx]}</span>}
          </div>
        ))}
      </div>
    </DiagramBox>
  );

  // sort-3: Merge sort
  if (topicId === "sort-3") return (
    <DiagramBox title="Visual: Merge Sort — Divide and Conquer">
      <svg viewBox="0 0 340 180" className="w-full max-w-sm mx-auto">
        {/* Level 0 */}
        <rect x="110" y="5" width="120" height="24" rx="3" fill="#c084fc" stroke="black" strokeWidth="2"/>
        <text x="170" y="21" textAnchor="middle" fill="black" fontWeight="700" fontSize="11">[5,3,8,1,2,4]</text>
        {/* Level 1 */}
        <line x1="170" y1="29" x2="90" y2="50" stroke="#c084fc" strokeWidth="1.5"/>
        <line x1="170" y1="29" x2="250" y2="50" stroke="#c084fc" strokeWidth="1.5"/>
        <rect x="45" y="50" width="90" height="22" rx="3" fill="#38bdf8" stroke="black" strokeWidth="2"/>
        <text x="90" y="65" textAnchor="middle" fill="black" fontWeight="700" fontSize="11">[5,3,8]</text>
        <rect x="205" y="50" width="90" height="22" rx="3" fill="#38bdf8" stroke="black" strokeWidth="2"/>
        <text x="250" y="65" textAnchor="middle" fill="black" fontWeight="700" fontSize="11">[1,2,4]</text>
        {/* Level 2 */}
        <line x1="90" y1="72" x2="55" y2="95" stroke="#38bdf8" strokeWidth="1.5"/>
        <line x1="90" y1="72" x2="115" y2="95" stroke="#38bdf8" strokeWidth="1.5"/>
        <line x1="250" y1="72" x2="220" y2="95" stroke="#38bdf8" strokeWidth="1.5"/>
        <line x1="250" y1="72" x2="275" y2="95" stroke="#38bdf8" strokeWidth="1.5"/>
        {[[30,95,"[5]"],[100,95,"[3,8]"],[195,95,"[1,2]"],[255,95,"[4]"]].map(([x,y,l],i) => (
          <g key={i}><rect x={+x-25} y={+y} width="50" height="20" rx="2" fill="#34d399" stroke="black" strokeWidth="2"/>
          <text x={+x} y={+y+14} textAnchor="middle" fill="black" fontWeight="700" fontSize="10">{l as string}</text></g>
        ))}
        {/* Merge arrow */}
        <text x="170" y="135" textAnchor="middle" fill="#fde047" fontSize="10" fontWeight="700">↓ merge sorted halves</text>
        <rect x="90" y="145" width="160" height="22" rx="3" fill="#fde047" stroke="black" strokeWidth="2"/>
        <text x="170" y="160" textAnchor="middle" fill="black" fontWeight="700" fontSize="11">[1,2,3,4,5,8]</text>
      </svg>
    </DiagramBox>
  );

  // sort-4: Quick sort
  if (topicId === "sort-4") return (
    <DiagramBox title="Visual: Quick Sort — Partition Around Pivot">
      <div className="flex flex-col gap-4">
        <div>
          <div className="text-xs text-white/40 mb-2">Original: pivot = last element (4)</div>
          <div className="flex gap-1">
            {[3,6,8,10,1,2,4].map((v,i) => (
              <div key={i} className={`w-9 h-9 border-2 flex items-center justify-center font-black text-sm ${i===6?"border-[#fde047] bg-[#fde047]/20 text-[#fde047]":"border-white/20 text-white/50"}`}>{v}</div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs text-white/40 mb-2">After partition:</div>
          <div className="flex gap-2 items-center flex-wrap">
            <div className="flex gap-1">
              {[3,1,2].map((v,i) => <div key={i} className="w-9 h-9 border-2 border-[#34d399] bg-[#34d399]/10 flex items-center justify-center font-black text-sm text-[#34d399]">{v}</div>)}
            </div>
            <div className="w-9 h-9 border-4 border-[#fde047] bg-[#fde047]/20 flex items-center justify-center font-black text-sm text-[#fde047]">4</div>
            <div className="flex gap-1">
              {[6,8,10].map((v,i) => <div key={i} className="w-9 h-9 border-2 border-[#f472b6] bg-[#f472b6]/10 flex items-center justify-center font-black text-sm text-[#f472b6]">{v}</div>)}
            </div>
          </div>
          <div className="flex gap-2 mt-1 text-xs">
            <span className="text-[#34d399]">left &lt; pivot</span>
            <span className="text-[#fde047]">pivot=4</span>
            <span className="text-[#f472b6]">right &gt; pivot</span>
          </div>
        </div>
      </div>
    </DiagramBox>
  );

  // search-1: Linear search
  if (topicId === "search-1") return (
    <DiagramBox title="Visual: Linear Search — Find 7">
      <div className="flex flex-col gap-2">
        {[
          { step: "Check [0]", arr: [3,1,7,9,2], active: 0, found: false },
          { step: "Check [1]", arr: [3,1,7,9,2], active: 1, found: false },
          { step: "Found! [2]",arr: [3,1,7,9,2], active: 2, found: true },
        ].map(s => (
          <div key={s.step} className="flex items-center gap-3">
            <span className="font-bold text-xs w-20 shrink-0 text-white/50">{s.step}</span>
            <div className="flex gap-1">
              {s.arr.map((v,i) => (
                <div key={i} className={`w-9 h-9 border-2 flex items-center justify-center font-black text-sm
                  ${i===s.active&&s.found?"border-[#34d399] bg-[#34d399] text-black":
                    i===s.active?"border-[#fde047] bg-[#fde047]/20 text-[#fde047]":
                    i<s.active?"border-white/10 text-white/20":"border-white/20 text-white/50"}`}>{v}</div>
              ))}
            </div>
          </div>
        ))}
        <div className="font-mono text-xs text-white/40 mt-1">O(n) — scan left to right until found</div>
      </div>
    </DiagramBox>
  );

  // search-2: Binary search
  if (topicId === "search-2") return (
    <DiagramBox title="Visual: Binary Search — Find 7">
      <div className="flex flex-col gap-3">
        {[
          { label: "Step 1", arr: [1,3,5,7,9,11,13], lo: 0, hi: 6, mid: 3, note: "mid=7? No, 7>arr[3]=7 ✓" },
          { label: "Found!", arr: [1,3,5,7,9,11,13], lo: 0, hi: 6, mid: 3, found: true },
        ].map((step, si) => (
          <div key={si} className="flex items-center gap-3">
            <span className="font-bold text-xs w-14 shrink-0 text-white/50">{step.label}</span>
            <div className="flex gap-1">
              {step.arr.map((v, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className={`w-8 h-8 border-2 flex items-center justify-center font-black text-xs
                    ${step.found&&i===step.mid?"border-[#34d399] bg-[#34d399] text-black":
                      i===step.mid?"border-[#fde047] bg-[#fde047]/20 text-[#fde047]":
                      "border-white/20 text-white/50"}`}>{v}</div>
                  <span className="text-[9px] mt-0.5" style={{ color: i===step.lo?"#38bdf8":i===step.hi?"#f472b6":i===step.mid?"#fde047":"transparent" }}>
                    {i===step.lo?"lo":i===step.hi?"hi":i===step.mid?"mid":"."}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="font-mono text-xs text-white/40">O(log n) — halves search space each step</div>
      </div>
    </DiagramBox>
  );

  // search-3: Answer space binary search
  if (topicId === "search-3") return (
    <DiagramBox title="Visual: Binary Search on Answer Space">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs text-[#38bdf8]">lo = 1</span>
          <span className="font-mono text-xs text-white/40">←</span>
          <div className="flex gap-1">
            {[1,2,3,4,5,6,7,8,9,10].map(v => (
              <div key={v} className={`w-7 h-7 border-2 flex items-center justify-center font-black text-xs ${v===5?"border-[#fde047] bg-[#fde047]/20 text-[#fde047]":v<=5?"border-[#34d399]/40 text-[#34d399]/60":"border-[#f472b6]/40 text-[#f472b6]/60"}`}>{v}</div>
            ))}
          </div>
          <span className="font-mono text-xs text-[#f472b6]">hi = max</span>
        </div>
        <div className="flex flex-col gap-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-[#fde047] bg-[#fde047]/20"/>
            <span className="text-white/60">mid — check if valid answer</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-[#34d399]/40 bg-[#34d399]/10"/>
            <span className="text-white/60">valid range (search here)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-[#f472b6]/40 bg-[#f472b6]/10"/>
            <span className="text-white/60">invalid range (discard)</span>
          </div>
        </div>
        <div className="font-mono text-xs text-white/40">Binary search the answer, not the array — O(log(max) × check)</div>
      </div>
    </DiagramBox>
  );

  // search-4: Ternary search
  if (topicId === "search-4") return (
    <DiagramBox title="Visual: Ternary Search — Unimodal Function Peak">
      <svg viewBox="0 0 320 120" className="w-full max-w-sm mx-auto">
        <path d="M20,100 Q80,10 160,15 Q240,20 300,100" stroke="#38bdf8" strokeWidth="3" fill="none"/>
        <line x1="20" y1="100" x2="300" y2="100" stroke="white" strokeOpacity="0.2" strokeWidth="1"/>
        <line x1="107" y1="100" x2="107" y2="40" stroke="#34d399" strokeWidth="1.5" strokeDasharray="4"/>
        <line x1="213" y1="100" x2="213" y2="40" stroke="#34d399" strokeWidth="1.5" strokeDasharray="4"/>
        <circle cx="160" cy="15" r="5" fill="#fde047" stroke="black" strokeWidth="2"/>
        <text x="160" y="10" textAnchor="middle" fill="#fde047" fontSize="9" fontWeight="700">peak</text>
        <text x="107" y="112" textAnchor="middle" fill="#34d399" fontSize="9">m1</text>
        <text x="213" y="112" textAnchor="middle" fill="#34d399" fontSize="9">m2</text>
        <text x="20" y="112" textAnchor="middle" fill="#38bdf8" fontSize="9">lo</text>
        <text x="300" y="112" textAnchor="middle" fill="#f472b6" fontSize="9">hi</text>
        <text x="160" y="80" textAnchor="middle" fill="#fde047" fontSize="9">if f(m1)&lt;f(m2): lo=m1 else hi=m2</text>
      </svg>
      <div className="font-mono text-xs text-white/40 text-center">Divides into thirds — O(log n) to find peak</div>
    </DiagramBox>
  );

  // hash-1: Hash map key→bucket
  if (topicId === "hash-1") return (
    <DiagramBox title="Visual: Hash Map — Key → Hash → Bucket">
      <div className="flex gap-6 flex-wrap items-start">
        <div className="flex flex-col gap-2">
          <div className="text-white/40 text-xs mb-1">Keys → hash() → index</div>
          {[["apple","→","0"],["banana","→","2"],["cherry","→","4"]].map(([k,,i]) => (
            <div key={k} className="flex items-center gap-2 font-mono text-xs">
              <span className="text-[#fde047] w-16">{k}</span>
              <span className="text-white/30">→ hash →</span>
              <span className="text-[#34d399]">bucket[{i}]</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-white/40 text-xs mb-1">Buckets</div>
          {[["0","apple: 5"],["1","(empty)"],["2","banana: 3"],["3","(empty)"],["4","cherry: 8"]].map(([i, v]) => (
            <div key={i} className="flex items-center gap-2 font-mono text-xs">
              <span className="text-white/40 w-4">[{i}]</span>
              <div className={`px-2 py-0.5 border ${v==="(empty)"?"border-white/10 text-white/20":"border-[#34d399] text-[#34d399] bg-[#34d399]/10"}`}>{v}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 font-mono text-xs text-white/40">O(1) average lookup — hash function maps key to index</div>
    </DiagramBox>
  );

  // hash-2: Collision chaining
  if (topicId === "hash-2") return (
    <DiagramBox title="Visual: Hash Collision — Chaining Solution">
      <div className="flex flex-col gap-3">
        <div className="flex gap-4 flex-wrap">
          <div className="flex flex-col gap-1">
            <div className="text-white/40 text-xs mb-1">Two keys → same bucket!</div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-[#f472b6]">"cat"</span>
              <span className="text-white/30">→ hash →</span>
              <span className="text-[#fde047]">bucket[3]</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-[#f472b6]">"act"</span>
              <span className="text-white/30">→ hash →</span>
              <span className="text-[#fde047]">bucket[3]</span>
              <span className="text-[#e94560] font-bold">COLLISION!</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-white/40 text-xs mb-1">Chaining: bucket holds a linked list</div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-[#fde047]">bucket[3]</span>
            <span className="text-white/30">→</span>
            <div className="border-2 border-[#34d399] bg-[#34d399]/10 px-2 py-1 text-[#34d399]">cat:3</div>
            <span className="text-[#34d399]">→</span>
            <div className="border-2 border-[#34d399] bg-[#34d399]/10 px-2 py-1 text-[#34d399]">act:3</div>
            <span className="text-white/30">→ null</span>
          </div>
        </div>
        <div className="font-mono text-xs text-white/40">Worst case O(n) if all keys collide — good hash fn prevents this</div>
      </div>
    </DiagramBox>
  );

  // hash-3: Frequency map
  if (topicId === "hash-3") return (
    <DiagramBox title='Visual: Frequency Map — "banana"'>
      <div className="flex gap-6 flex-wrap items-start">
        <div>
          <div className="text-white/40 text-xs mb-2">Build char frequency:</div>
          <div className="flex gap-0 mb-4">
            {"banana".split("").map((ch, i) => (
              <div key={i} className="w-10 h-10 border-2 border-[#fb923c] bg-[#fb923c]/10 flex items-center justify-center font-black text-[#fb923c] text-base">{ch}</div>
            ))}
          </div>
          <div className="flex flex-col gap-1">
            {[["b","1","#38bdf8"],["a","3","#34d399"],["n","2","#fde047"]].map(([ch,cnt,color]) => (
              <div key={ch} className="flex items-center gap-3">
                <div className="w-8 h-8 border-2 flex items-center justify-center font-black text-base" style={{ borderColor: color, color, backgroundColor: color+"20" }}>{ch}</div>
                <div className="flex gap-1">
                  {Array.from({length: +cnt}).map((_,i) => <div key={i} className="w-5 h-5 border flex items-center justify-center text-xs font-bold" style={{ borderColor: color, color }}>{i+1}</div>)}
                </div>
                <span className="font-mono text-xs" style={{ color }}>count: {cnt}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="font-mono text-xs text-white/40 mt-4">&#123;b:1, a:3, n:2&#125;</div>
      </div>
    </DiagramBox>
  );

  // hash-4: Set operations
  if (topicId === "hash-4") return (
    <DiagramBox title="Visual: Set Operations">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { op: "Union A∪B", a: [1,2,3], b: [3,4,5], result: [1,2,3,4,5], color: "#34d399" },
          { op: "Intersection A∩B", a: [1,2,3], b: [3,4,5], result: [3], color: "#38bdf8" },
          { op: "Difference A-B", a: [1,2,3], b: [3,4,5], result: [1,2], color: "#f472b6" },
        ].map(s => (
          <div key={s.op} className="border-2 p-3" style={{ borderColor: s.color, backgroundColor: s.color+"10" }}>
            <div className="font-black text-xs mb-2" style={{ color: s.color }}>{s.op}</div>
            <div className="font-mono text-xs text-white/50 mb-1">A={JSON.stringify(s.a)}</div>
            <div className="font-mono text-xs text-white/50 mb-2">B={JSON.stringify(s.b)}</div>
            <div className="font-mono text-xs font-bold" style={{ color: s.color }}>{JSON.stringify(s.result)}</div>
          </div>
        ))}
      </div>
    </DiagramBox>
  );

  // tree-1: Binary tree anatomy
  if (topicId === "tree-1") return (
    <DiagramBox title="Visual: Binary Tree — Anatomy">
      <svg viewBox="0 0 320 190" className="w-full max-w-xs mx-auto">
        <line x1="160" y1="30" x2="90" y2="80" stroke="#c084fc" strokeWidth="2"/>
        <line x1="160" y1="30" x2="230" y2="80" stroke="#c084fc" strokeWidth="2"/>
        <line x1="90" y1="80" x2="55" y2="130" stroke="#c084fc" strokeWidth="2"/>
        <line x1="90" y1="80" x2="125" y2="130" stroke="#c084fc" strokeWidth="2"/>
        <line x1="230" y1="80" x2="265" y2="130" stroke="#c084fc" strokeWidth="2"/>
        {[{x:160,y:30,v:1,c:"#c084fc",lbl:"ROOT"},{x:90,y:80,v:2,c:"#38bdf8"},{x:230,y:80,v:3,c:"#38bdf8"},{x:55,y:130,v:4,c:"#34d399",lbl:"LEAF"},{x:125,y:130,v:5,c:"#34d399",lbl:"LEAF"},{x:265,y:130,v:6,c:"#34d399",lbl:"LEAF"}].map(n => (
          <g key={n.v}>
            <circle cx={n.x} cy={n.y} r="18" fill={n.c} stroke="black" strokeWidth="3"/>
            <text x={n.x} y={n.y+5} textAnchor="middle" fill="black" fontWeight="900" fontSize="13">{n.v}</text>
            {n.lbl && <text x={n.x} y={n.y+(n.lbl==="ROOT"?-24:22)} textAnchor="middle" fill={n.c} fontSize="9" fontWeight="700">{n.lbl}</text>}
          </g>
        ))}
        <text x="280" y="80" fill="#38bdf8" fontSize="9">height=2</text>
        <text x="160" y="175" textAnchor="middle" fill="#fde047" fontSize="9">Each node has at most 2 children</text>
      </svg>
    </DiagramBox>
  );

  // tree-2: BST property
  if (topicId === "tree-2") return (
    <DiagramBox title="Visual: Binary Search Tree — left < root < right">
      <svg viewBox="0 0 280 170" className="w-full max-w-xs mx-auto">
        <line x1="140" y1="30" x2="75" y2="80" stroke="#fde047" strokeWidth="2"/>
        <line x1="140" y1="30" x2="205" y2="80" stroke="#fde047" strokeWidth="2"/>
        <line x1="75" y1="80" x2="45" y2="130" stroke="#fde047" strokeWidth="2"/>
        <line x1="75" y1="80" x2="105" y2="130" stroke="#fde047" strokeWidth="2"/>
        <line x1="205" y1="80" x2="175" y2="130" stroke="#fde047" strokeWidth="2"/>
        <line x1="205" y1="80" x2="235" y2="130" stroke="#fde047" strokeWidth="2"/>
        {[{x:140,y:30,v:8},{x:75,y:80,v:3},{x:205,y:80,v:12},{x:45,y:130,v:1},{x:105,y:130,v:5},{x:175,y:130,v:10},{x:235,y:130,v:15}].map(n => (
          <g key={n.v}>
            <circle cx={n.x} cy={n.y} r="17" fill="#fde047" stroke="black" strokeWidth="3"/>
            <text x={n.x} y={n.y+5} textAnchor="middle" fill="black" fontWeight="900" fontSize="12">{n.v}</text>
          </g>
        ))}
        <text x="30" y="155" fill="#34d399" fontSize="9">1&lt;3&lt;5</text>
        <text x="140" y="155" textAnchor="middle" fill="#fde047" fontSize="9">left &lt; parent &lt; right</text>
        <text x="200" y="155" fill="#34d399" fontSize="9">10&lt;12&lt;15</text>
      </svg>
    </DiagramBox>
  );

  // tree-3: Tree traversals
  if (topicId === "tree-3") return (
    <DiagramBox title="Visual: Tree Traversal Orders">
      <div className="grid grid-cols-2 gap-3">
        {[
          { name: "Inorder (L→Root→R)", result: "1,3,5,8,10,12,15", color: "#34d399", desc: "Sorted order for BST" },
          { name: "Preorder (Root→L→R)", result: "8,3,1,5,12,10,15", color: "#38bdf8", desc: "Copy tree structure" },
          { name: "Postorder (L→R→Root)", result: "1,5,3,10,15,12,8", color: "#fb923c", desc: "Delete tree safely" },
          { name: "Level-order (BFS)", result: "8,3,12,1,5,10,15", color: "#c084fc", desc: "Shortest path, levels" },
        ].map(t => (
          <div key={t.name} className="border-2 p-2" style={{ borderColor: t.color, backgroundColor: t.color+"10" }}>
            <div className="font-black text-xs mb-1" style={{ color: t.color }}>{t.name}</div>
            <div className="font-mono text-xs text-white/70 mb-1">[{t.result}]</div>
            <div className="text-white/40 text-xs">{t.desc}</div>
          </div>
        ))}
      </div>
    </DiagramBox>
  );

  // tree-4: Min-heap
  if (topicId === "tree-4") return (
    <DiagramBox title="Visual: Min-Heap — Tree and Array Representation">
      <div className="flex gap-6 flex-wrap items-start">
        <svg viewBox="0 0 200 140" className="w-44 shrink-0">
          <line x1="100" y1="25" x2="55" y2="65" stroke="#fb923c" strokeWidth="2"/>
          <line x1="100" y1="25" x2="145" y2="65" stroke="#fb923c" strokeWidth="2"/>
          <line x1="55" y1="65" x2="30" y2="105" stroke="#fb923c" strokeWidth="2"/>
          <line x1="55" y1="65" x2="80" y2="105" stroke="#fb923c" strokeWidth="2"/>
          <line x1="145" y1="65" x2="120" y2="105" stroke="#fb923c" strokeWidth="2"/>
          {[{x:100,y:25,v:1},{x:55,y:65,v:3},{x:145,y:65,v:5},{x:30,y:105,v:7},{x:80,y:105,v:9},{x:120,y:105,v:8}].map(n => (
            <g key={n.v}>
              <circle cx={n.x} cy={n.y} r="16" fill="#fb923c" stroke="black" strokeWidth="3"/>
              <text x={n.x} y={n.y+5} textAnchor="middle" fill="black" fontWeight="900" fontSize="12">{n.v}</text>
            </g>
          ))}
          <text x="100" y="130" textAnchor="middle" fill="#fb923c" fontSize="9">parent ≤ children always</text>
        </svg>
        <div>
          <div className="text-white/40 text-xs mb-2">Array representation:</div>
          <div className="flex gap-1 mb-2">
            {[1,3,5,7,9,8].map((v,i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-9 h-9 border-2 border-[#fb923c] bg-[#fb923c]/10 flex items-center justify-center font-black text-sm text-[#fb923c]">{v}</div>
                <div className="font-mono text-[10px] text-white/40">[{i}]</div>
              </div>
            ))}
          </div>
          <div className="font-mono text-xs text-white/40">parent(i) = ⌊(i-1)/2⌋</div>
          <div className="font-mono text-xs text-white/40">left(i) = 2i+1</div>
          <div className="font-mono text-xs text-white/40">right(i) = 2i+2</div>
        </div>
      </div>
    </DiagramBox>
  );

  // graph-1: Undirected graph + adjacency list
  if (topicId === "graph-1") return (
    <DiagramBox title="Visual: Graph — Nodes, Edges, Adjacency List">
      <div className="flex gap-6 flex-wrap items-start">
        <svg viewBox="0 0 200 160" className="w-44 shrink-0">
          <line x1="100" y1="30" x2="40" y2="90" stroke="#38bdf8" strokeWidth="2"/>
          <line x1="100" y1="30" x2="160" y2="90" stroke="#38bdf8" strokeWidth="2"/>
          <line x1="40" y1="90" x2="100" y2="140" stroke="#38bdf8" strokeWidth="2"/>
          <line x1="160" y1="90" x2="100" y2="140" stroke="#38bdf8" strokeWidth="2"/>
          <line x1="40" y1="90" x2="160" y2="90" stroke="#38bdf8" strokeWidth="2"/>
          {[{x:100,y:30,v:"A"},{x:40,y:90,v:"B"},{x:160,y:90,v:"C"},{x:100,y:140,v:"D"}].map(n => (
            <g key={n.v}>
              <circle cx={n.x} cy={n.y} r="16" fill="#38bdf8" stroke="black" strokeWidth="3"/>
              <text x={n.x} y={n.y+5} textAnchor="middle" fill="black" fontWeight="900" fontSize="13">{n.v}</text>
            </g>
          ))}
        </svg>
        <div className="font-mono text-xs text-[#38bdf8] space-y-1">
          <div className="text-white/40 mb-2 font-bold">Adjacency List:</div>
          <div>A: [B, C]</div>
          <div>B: [A, C, D]</div>
          <div>C: [A, B, D]</div>
          <div>D: [B, C]</div>
          <div className="text-white/40 mt-2 text-xs">4 nodes, 5 edges</div>
        </div>
      </div>
    </DiagramBox>
  );

  // graph-2: BFS
  if (topicId === "graph-2") return (
    <DiagramBox title="Visual: BFS — Level-by-Level Exploration">
      <div className="flex flex-col gap-3">
        {[
          { level: "Level 0", nodes: ["A"], queue: "Queue: [A]", color: "#c084fc" },
          { level: "Level 1", nodes: ["B","C"], queue: "Queue: [B, C]", color: "#38bdf8" },
          { level: "Level 2", nodes: ["D","E"], queue: "Queue: [D, E]", color: "#34d399" },
        ].map(l => (
          <div key={l.level} className="flex items-center gap-3">
            <span className="font-bold text-xs w-16 shrink-0" style={{ color: l.color }}>{l.level}</span>
            <div className="flex gap-2">
              {l.nodes.map(n => (
                <div key={n} className="w-9 h-9 border-4 flex items-center justify-center font-black text-sm" style={{ borderColor: l.color, backgroundColor: l.color+"20", color: l.color }}>{n}</div>
              ))}
            </div>
            <span className="font-mono text-xs text-white/40">{l.queue}</span>
          </div>
        ))}
        <div className="font-mono text-xs text-white/40">Visits all nodes at distance d before distance d+1 — shortest path!</div>
      </div>
    </DiagramBox>
  );

  // graph-3: DFS
  if (topicId === "graph-3") return (
    <DiagramBox title="Visual: DFS — Deep Path Exploration">
      <div className="flex flex-col gap-3">
        <div className="flex gap-2 flex-wrap">
          {[
            { node: "A", step: 1, color: "#c084fc" },
            { node: "B", step: 2, color: "#fb923c" },
            { node: "D", step: 3, color: "#34d399" },
            { node: "E", step: 4, color: "#34d399" },
            { node: "C", step: 5, color: "#38bdf8" },
          ].map((n, i, arr) => (
            <div key={n.node} className="flex items-center gap-1">
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 border-4 flex items-center justify-center font-black text-sm" style={{ borderColor: n.color, backgroundColor: n.color+"20", color: n.color }}>{n.node}</div>
                <span className="text-[10px] text-white/40">step {n.step}</span>
              </div>
              {i < arr.length-1 && <span className="text-white/30 font-black">→</span>}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-1 text-xs">
          <div className="font-mono text-white/40">Stack: [A] → [A,B] → [A,B,D] → [A,B,D,E] → backtrack → [A,C]</div>
          <div className="font-mono text-white/40">Goes as deep as possible before backtracking</div>
        </div>
      </div>
    </DiagramBox>
  );

  // graph-4: Dijkstra
  if (topicId === "graph-4") return (
    <DiagramBox title="Visual: Dijkstra — Shortest Path Distance Table">
      <div className="overflow-x-auto">
        <table className="text-xs font-mono border-collapse">
          <thead>
            <tr>
              <th className="border border-white/20 px-3 py-1 text-white/40">Step</th>
              {["A","B","C","D"].map(n => <th key={n} className="border border-white/20 px-3 py-1 text-[#38bdf8]">{n}</th>)}
              <th className="border border-white/20 px-3 py-1 text-white/40">Visit</th>
            </tr>
          </thead>
          <tbody>
            {[
              { step: "Init", dists: ["0","∞","∞","∞"], visit: "A" },
              { step: "Visit A", dists: ["0","4","2","∞"], visit: "C" },
              { step: "Visit C", dists: ["0","3","2","7"], visit: "B" },
              { step: "Visit B", dists: ["0","3","2","6"], visit: "D" },
            ].map((row, i) => (
              <tr key={i} className={i===3?"bg-[#34d399]/10":""}>
                <td className="border border-white/20 px-3 py-1 text-white/50">{row.step}</td>
                {row.dists.map((d, j) => <td key={j} className={`border border-white/20 px-3 py-1 text-center ${d==="0"?"text-[#fde047]":d==="∞"?"text-white/20":"text-[#34d399]"}`}>{d}</td>)}
                <td className="border border-white/20 px-3 py-1 text-[#c084fc]">{row.visit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2 font-mono text-xs text-white/40">Always visit the unvisited node with smallest distance</div>
    </DiagramBox>
  );

  // dp-1: Climbing stairs DP table
  if (topicId === "dp-1") return (
    <DiagramBox title="Visual: DP Table — Climbing Stairs">
      <div className="flex flex-col gap-3">
        <div className="flex gap-2 items-center flex-wrap">
          <span className="font-bold text-white/40 text-xs w-16">Step n</span>
          {[0,1,2,3,4,5].map(n => <div key={n} className="w-10 h-8 border-2 border-white/20 flex items-center justify-center font-mono text-xs text-white/50">{n}</div>)}
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <span className="font-bold text-[#fde047] text-xs w-16">Ways</span>
          {[0,1,2,3,5,8].map((v,i) => <div key={i} className="w-10 h-8 border-2 border-[#fde047] bg-[#fde047]/10 flex items-center justify-center font-black text-xs text-[#fde047]">{v}</div>)}
        </div>
        <div className="flex flex-col gap-1 text-xs">
          <div className="font-mono text-white/40">dp[n] = dp[n-1] + dp[n-2]</div>
          <div className="font-mono text-white/40">Same as Fibonacci! 0,1,2,3,5,8,13...</div>
        </div>
      </div>
    </DiagramBox>
  );

  // dp-2: Coin change DP table
  if (topicId === "dp-2") return (
    <DiagramBox title="Visual: Coin Change DP — coins=[1,3,4], amount=6">
      <div className="overflow-x-auto">
        <div className="flex gap-1 mb-1 ml-16">
          {[0,1,2,3,4,5,6].map(a => <div key={a} className="w-9 text-center font-mono text-xs text-[#38bdf8]">{a}</div>)}
        </div>
        <div className="flex items-center gap-1 mb-1">
          <div className="w-16 font-mono text-xs text-white/40 text-right pr-1">dp[amt]</div>
          {[0,1,2,3,4,5,6].map((a,i) => (
            <div key={a} className={`w-9 h-8 border-2 flex items-center justify-center font-black text-xs ${a===0?"border-[#34d399] bg-[#34d399]/20 text-[#34d399]":a===6?"border-[#fde047] bg-[#fde047]/20 text-[#fde047]":"border-white/20 text-white/60"}`}>
              {[0,1,2,1,1,2,2][i]}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 font-mono text-xs text-white/40">dp[6]=2 means 2 coins needed (3+3 or 4+1+1)</div>
      <div className="font-mono text-xs text-white/40">dp[a] = min(dp[a-coin]+1) for each coin</div>
    </DiagramBox>
  );

  // dp-3: Knapsack 2D table
  if (topicId === "dp-3") return (
    <DiagramBox title="Visual: 0/1 Knapsack — 2D DP Table">
      <div className="overflow-x-auto">
        <div className="flex gap-1 mb-1">
          <div className="w-20 shrink-0"/>
          {[0,1,2,3,4,5].map(c => <div key={c} className="w-9 text-center font-mono text-xs text-[#38bdf8]">W={c}</div>)}
        </div>
        {[
          { item: "none", vals: [0,0,0,0,0,0] },
          { item: "item1(w=2,v=3)", vals: [0,0,3,3,3,3] },
          { item: "item2(w=3,v=4)", vals: [0,0,3,4,4,7] },
          { item: "item3(w=4,v=5)", vals: [0,0,3,4,5,7] },
        ].map((row, r) => (
          <div key={r} className="flex gap-1 mb-1">
            <div className="w-20 font-mono text-xs text-white/40 flex items-center shrink-0">{row.item}</div>
            {row.vals.map((v, c) => (
              <div key={c} className={`w-9 h-8 border-2 flex items-center justify-center font-black text-xs ${r===3&&c===5?"border-[#fde047] bg-[#fde047]/20 text-[#fde047]":v>0?"border-[#34d399]/50 text-[#34d399]":"border-white/10 text-white/20"}`}>{v}</div>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-1 font-mono text-xs text-[#fde047]">Max value = 7 (items 1+2)</div>
    </DiagramBox>
  );

  // dp-4: LCS table
  if (topicId === "dp-4") return (
    <DiagramBox title='Visual: LCS Table — "abcde" vs "ace"'>
      <div className="overflow-x-auto">
        <div className="flex gap-1 mb-1">
          <div className="w-8 shrink-0"/>
          <div className="w-8 text-center font-mono text-xs text-white/30">""</div>
          {"ace".split("").map(c => <div key={c} className="w-8 text-center font-mono text-xs text-[#38bdf8]">{c}</div>)}
        </div>
        {[["",0,0,0,0],["a",0,1,1,1],["b",0,1,1,1],["c",0,1,2,2],["d",0,1,2,2],["e",0,1,2,3]].map((row, r) => (
          <div key={r} className="flex gap-1 mb-1">
            <div className="w-8 font-mono text-xs text-[#c084fc] flex items-center justify-center">{row[0]}</div>
            {row.slice(1).map((v, c) => (
              <div key={c} className={`w-8 h-7 border-2 flex items-center justify-center font-black text-xs ${v===3?"border-[#fde047] bg-[#fde047]/20 text-[#fde047]":+v>0?"border-[#34d399]/50 text-[#34d399]":"border-white/10 text-white/20"}`}>{v}</div>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-1 font-mono text-xs text-[#fde047]">LCS = "ace", length = 3</div>
    </DiagramBox>
  );

  // adv-1: Jump game greedy
  if (topicId === "adv-1") return (
    <DiagramBox title="Visual: Jump Game — Greedy maxReach">
      <div className="flex flex-col gap-3">
        <div className="flex gap-1">
          {[2,3,1,1,4].map((v,i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-10 h-10 border-2 border-[#34d399] bg-[#34d399]/10 flex items-center justify-center font-black text-[#34d399] text-sm">{v}</div>
              <div className="font-mono text-[10px] text-white/40">[{i}]</div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-1 text-xs">
          {[
            { i: 0, reach: 2, note: "from [0]=2, maxReach=max(0,0+2)=2" },
            { i: 1, reach: 4, note: "from [1]=3, maxReach=max(2,1+3)=4" },
            { i: 2, reach: 4, note: "from [2]=1, maxReach=max(4,2+1)=4" },
            { i: 3, reach: 4, note: "from [3]=1, maxReach=max(4,3+1)=4 ✓ reached end" },
          ].map(s => (
            <div key={s.i} className="flex items-center gap-2">
              <span className="text-white/40 w-4">[{s.i}]</span>
              <div className="w-16 h-5 border border-[#34d399] bg-[#34d399]/10 flex items-center justify-center font-mono text-[10px] text-[#34d399]">reach={s.reach}</div>
              <span className="text-white/40">{s.note}</span>
            </div>
          ))}
        </div>
      </div>
    </DiagramBox>
  );

  // adv-2: Activity selection
  if (topicId === "adv-2") return (
    <DiagramBox title="Visual: Activity Selection — Greedy by End Time">
      <div className="flex flex-col gap-2">
        <div className="text-xs text-white/40 mb-1">Activities sorted by end time:</div>
        {[
          { name: "A1", start: 1, end: 3, selected: true },
          { name: "A2", start: 2, end: 5, selected: false },
          { name: "A3", start: 4, end: 6, selected: true },
          { name: "A4", start: 5, end: 8, selected: false },
          { name: "A5", start: 7, end: 9, selected: true },
        ].map(a => (
          <div key={a.name} className="flex items-center gap-3">
            <span className={`font-bold text-xs w-6 ${a.selected?"text-[#34d399]":"text-white/30"}`}>{a.name}</span>
            <div className="flex-1 relative h-6 bg-white/5">
              <div className="absolute h-full flex items-center justify-center font-mono text-xs font-bold"
                style={{ left: `${(a.start/10)*100}%`, width: `${((a.end-a.start)/10)*100}%`, backgroundColor: a.selected?"#34d399":"#f472b6", opacity: a.selected?0.7:0.3 }}>
                {a.start}-{a.end}
              </div>
            </div>
            {a.selected && <span className="text-[#34d399] text-xs font-bold">✓</span>}
          </div>
        ))}
        <div className="font-mono text-xs text-white/40 mt-1">Select activity with earliest end time that doesn't overlap</div>
      </div>
    </DiagramBox>
  );

  // adv-3: Segment tree
  if (topicId === "adv-3") return (
    <DiagramBox title="Visual: Segment Tree — Range Sum Queries">
      <svg viewBox="0 0 320 170" className="w-full max-w-sm mx-auto">
        {/* Root */}
        <line x1="160" y1="25" x2="90" y2="65" stroke="#c084fc" strokeWidth="1.5"/>
        <line x1="160" y1="25" x2="230" y2="65" stroke="#c084fc" strokeWidth="1.5"/>
        <line x1="90" y1="65" x2="55" y2="105" stroke="#c084fc" strokeWidth="1.5"/>
        <line x1="90" y1="65" x2="125" y2="105" stroke="#c084fc" strokeWidth="1.5"/>
        <line x1="230" y1="65" x2="195" y2="105" stroke="#c084fc" strokeWidth="1.5"/>
        <line x1="230" y1="65" x2="265" y2="105" stroke="#c084fc" strokeWidth="1.5"/>
        {[
          {x:160,y:25,v:"36",lbl:"[0,3]",c:"#c084fc"},
          {x:90,y:65,v:"16",lbl:"[0,1]",c:"#38bdf8"},
          {x:230,y:65,v:"20",lbl:"[2,3]",c:"#38bdf8"},
          {x:55,y:105,v:"5",lbl:"[0]",c:"#34d399"},
          {x:125,y:105,v:"11",lbl:"[1]",c:"#34d399"},
          {x:195,y:105,v:"8",lbl:"[2]",c:"#34d399"},
          {x:265,y:105,v:"12",lbl:"[3]",c:"#34d399"},
        ].map(n => (
          <g key={n.v+n.x}>
            <rect x={n.x-22} y={n.y-13} width="44" height="24" rx="3" fill={n.c} stroke="black" strokeWidth="2"/>
            <text x={n.x} y={n.y+2} textAnchor="middle" fill="black" fontWeight="900" fontSize="11">{n.v}</text>
            <text x={n.x} y={n.y+20} textAnchor="middle" fill={n.c} fontSize="8">{n.lbl}</text>
          </g>
        ))}
        <text x="160" y="160" textAnchor="middle" fill="#fde047" fontSize="9">Array: [5, 11, 8, 12] — range sum in O(log n)</text>
      </svg>
    </DiagramBox>
  );

  // adv-4: Bit manipulation
  if (topicId === "adv-4") return (
    <DiagramBox title="Visual: Bit Manipulation — 13 in Binary">
      <div className="flex flex-col gap-4">
        <div>
          <div className="text-xs text-white/40 mb-2">13 = 1101 in binary</div>
          <div className="flex gap-1">
            {["1","1","0","1"].map((b,i) => (
              <div key={i} className="flex flex-col items-center">
                <div className={`w-12 h-12 border-4 flex items-center justify-center font-black text-xl ${b==="1"?"border-[#fde047] bg-[#fde047]/20 text-[#fde047]":"border-white/20 text-white/20"}`}>{b}</div>
                <div className="font-mono text-xs text-white/40 mt-1">2^{3-i}={Math.pow(2,3-i)}</div>
              </div>
            ))}
            <div className="flex items-center ml-2 font-mono text-sm text-white/60">= 8+4+0+1 = 13</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          {[
            { op: "13 & 5", result: "5", desc: "AND: keep common bits" },
            { op: "13 | 5", result: "13", desc: "OR: keep any bit" },
            { op: "13 ^ 5", result: "8", desc: "XOR: flip different bits" },
            { op: "13 >> 1", result: "6", desc: "Right shift: divide by 2" },
            { op: "13 << 1", result: "26", desc: "Left shift: multiply by 2" },
            { op: "~13", result: "-14", desc: "NOT: flip all bits" },
          ].map(op => (
            <div key={op.op} className="border border-white/10 p-2">
              <span className="text-[#38bdf8]">{op.op}</span>
              <span className="text-white/40"> = </span>
              <span className="text-[#34d399] font-bold">{op.result}</span>
              <div className="text-white/30 text-[10px] mt-0.5">{op.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </DiagramBox>
  );

  // Generic fallback
  return (
    <DiagramBox title="Visual: Concept Overview">
      <div className="flex items-center justify-center h-24 text-white/20 font-bold text-sm">
        Diagram for {topicId}
      </div>
    </DiagramBox>
  );
}

// ── Quiz Component ────────────────────────────────────────────────────────────
function Quiz({ quiz }: { quiz: DSATopic["quiz"] }) {
  const [sel, setSel] = useState<number | null>(null);
  return (
    <div className="mt-8 border-4 border-black p-6 bg-[#1a1a2e] shadow-[6px_6px_0_0_#000]">
      <p className="font-black text-white text-base mb-4">Quick Check</p>
      <p className="font-bold text-white/80 text-sm mb-4">{quiz.q}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {quiz.options.map((opt, i) => (
          <button key={i} onClick={() => setSel(i)}
            className={`border-4 border-black px-4 py-3 font-bold text-sm text-left transition-all hover:-translate-y-0.5 shadow-[3px_3px_0_0_#000]
              ${sel === null ? "bg-white text-black"
                : i === quiz.answer ? "bg-[#34d399] text-black"
                : sel === i ? "bg-[#f472b6] text-black"
                : "bg-white/20 text-white/40"}`}>
            <span className="font-black mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
          </button>
        ))}
      </div>
      {sel !== null && (
        <div className={`mt-4 border-4 border-black px-4 py-3 font-black text-sm ${sel === quiz.answer ? "bg-[#34d399] text-black" : "bg-[#f472b6] text-black"}`}>
          {sel === quiz.answer ? "Correct! +50 XP" : `Wrong — correct answer: ${quiz.options[quiz.answer]}`}
        </div>
      )}
    </div>
  );
}

// ── ContentPanel ──────────────────────────────────────────────────────────────
interface ContentPanelProps {
  topic: DSATopic;
  chapterColor: string;
  planLocked: boolean;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

function NavBar({ onPrev, onNext, hasPrev, hasNext, chapterColor }: { onPrev: () => void; onNext: () => void; hasPrev: boolean; hasNext: boolean; chapterColor: string }) {
  const colorVal = chapterColor.replace("bg-[","").replace("]","");
  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <button
        onClick={onPrev}
        disabled={!hasPrev}
        className="flex items-center gap-2 px-4 py-2 border-4 border-black font-black text-sm bg-white text-black shadow-[4px_4px_0_0_#000] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" /> Previous
      </button>
      <button
        onClick={onNext}
        disabled={!hasNext}
        className="flex items-center gap-2 px-4 py-2 border-4 border-black font-black text-sm text-black shadow-[4px_4px_0_0_#000] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        style={{ backgroundColor: colorVal }}
      >
        Next <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function ContentPanel({ topic, chapterColor, planLocked, onPrev, onNext, hasPrev, hasNext }: ContentPanelProps) {
  if (planLocked) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
        <div className="w-20 h-20 bg-[#1a1a2e] border-4 border-black flex items-center justify-center shadow-[6px_6px_0_0_#000]">
          <Lock className="w-10 h-10 text-[#fde047]" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-black uppercase mb-2">Pro Content</h2>
          <p className="font-bold text-black/60 text-sm max-w-sm mb-6">
            This chapter requires Pro or Beginner Pack. Upgrade to unlock all 12 chapters and 48 topics.
          </p>
          <Link to="/pricing" className="inline-flex items-center gap-2 bg-[#fde047] border-4 border-black font-black text-base px-8 py-3 shadow-[4px_4px_0_0_#000] hover:-translate-y-0.5 transition-all text-black">
            View Plans <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavBar onPrev={onPrev} onNext={onNext} hasPrev={hasPrev} hasNext={hasNext} chapterColor={chapterColor} />

      {/* Topic title */}
      <div className={`${chapterColor} border-4 border-black px-6 py-5 mb-8 shadow-[6px_6px_0_0_#000]`}>
        <h1 className="text-3xl md:text-4xl font-black text-black uppercase leading-tight">{topic.title}</h1>
      </div>

      {/* 1. Simple Explanation */}
      <section className="mb-8">
        <h2 className="text-xs font-black uppercase tracking-widest text-black/40 mb-3 flex items-center gap-2">
          <span className="w-6 h-6 bg-black text-white flex items-center justify-center font-black text-xs">1</span>
          Simple Explanation
        </h2>
        <p className="font-bold text-black text-base leading-relaxed border-l-4 border-black pl-5">{topic.simple}</p>
      </section>

      {/* 2. Analogy */}
      <section className="mb-8">
        <h2 className="text-xs font-black uppercase tracking-widest text-black/40 mb-3 flex items-center gap-2">
          <span className="w-6 h-6 bg-black text-white flex items-center justify-center font-black text-xs">2</span>
          Real-Life Analogy
        </h2>
        <div className={`${chapterColor} border-4 border-black px-6 py-5 shadow-[4px_4px_0_0_#000]`}>
          <p className="font-bold text-black text-sm leading-relaxed">{topic.analogy}</p>
        </div>
      </section>

      {/* 3. Diagram */}
      <section className="mb-8">
        <h2 className="text-xs font-black uppercase tracking-widest text-black/40 mb-3 flex items-center gap-2">
          <span className="w-6 h-6 bg-black text-white flex items-center justify-center font-black text-xs">3</span>
          Visual Diagram
        </h2>
        <Diagram topicId={topic.id} />
      </section>

      {/* 4. Why It Matters */}
      <section className="mb-8">
        <h2 className="text-xs font-black uppercase tracking-widest text-black/40 mb-3 flex items-center gap-2">
          <span className="w-6 h-6 bg-black text-white flex items-center justify-center font-black text-xs">4</span>
          Why It Matters
        </h2>
        <div className="bg-[#fffbeb] border-4 border-black px-6 py-5 shadow-[4px_4px_0_0_#000]">
          <p className="font-bold text-black text-sm leading-relaxed">{topic.whyItMatters}</p>
        </div>
      </section>

      {/* 5. Code */}
      <section className="mb-8">
        <h2 className="text-xs font-black uppercase tracking-widest text-black/40 mb-3 flex items-center gap-2">
          <span className="w-6 h-6 bg-black text-white flex items-center justify-center font-black text-xs">5</span>
          Code Example
        </h2>
        <div className="bg-[#0d0d1a] border-4 border-black shadow-[6px_6px_0_0_#000]">
          <div className="flex items-center gap-2 px-4 py-3 border-b-2 border-white/10">
            <div className="w-3 h-3 rounded-full bg-[#e94560]" />
            <div className="w-3 h-3 rounded-full bg-[#fde047]" />
            <div className="w-3 h-3 rounded-full bg-[#34d399]" />
            <span className="font-mono text-white/30 text-xs ml-2">JavaScript</span>
            <Link to="/compiler" className="ml-auto font-black text-xs text-[#34d399] hover:underline flex items-center gap-1">
              Run in Compiler <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-5 overflow-x-auto">
            <pre className="font-mono text-sm text-[#34d399] leading-relaxed whitespace-pre">{topic.code}</pre>
          </div>
        </div>
      </section>

      {/* 6. Complexity */}
      <section className="mb-8">
        <h2 className="text-xs font-black uppercase tracking-widest text-black/40 mb-3 flex items-center gap-2">
          <span className="w-6 h-6 bg-black text-white flex items-center justify-center font-black text-xs">6</span>
          Complexity Analysis
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="border-4 border-black p-5 bg-white shadow-[4px_4px_0_0_#000]">
            <p className="text-xs font-black uppercase tracking-widest text-black/40 mb-2 flex items-center gap-1"><Clock className="w-3 h-3" /> Time</p>
            <p className="font-black text-black text-sm">{topic.complexity.time}</p>
          </div>
          <div className="border-4 border-black p-5 bg-white shadow-[4px_4px_0_0_#000]">
            <p className="text-xs font-black uppercase tracking-widest text-black/40 mb-2">Space</p>
            <p className="font-black text-black text-sm">{topic.complexity.space}</p>
          </div>
        </div>
      </section>

      {/* 7. Tips */}
      <section className="mb-8">
        <h2 className="text-xs font-black uppercase tracking-widest text-black/40 mb-3 flex items-center gap-2">
          <span className="w-6 h-6 bg-black text-white flex items-center justify-center font-black text-xs">7</span>
          Pro Tips
        </h2>
        <div className="border-4 border-black bg-white shadow-[4px_4px_0_0_#000]">
          {topic.tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-4 px-5 py-4 border-b-2 last:border-b-0 border-black/10">
              <Lightbulb className="w-4 h-4 text-[#fde047] shrink-0 mt-0.5" />
              <p className="font-bold text-black text-sm leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quiz */}
      <section className="mb-8">
        <Quiz quiz={topic.quiz} />
      </section>

      <NavBar onPrev={onPrev} onNext={onNext} hasPrev={hasPrev} hasNext={hasNext} chapterColor={chapterColor} />
      <div className="h-8" />
    </div>
  );
}

// ── Main DSA Page ─────────────────────────────────────────────────────────────
export default function DSA() {
  const { canAccess } = useAuth();
  const [activeTopicId, setActiveTopicId] = useState(allTopics[0].topic.id);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set([1]));

  const activeIndex = allTopics.findIndex(t => t.topic.id === activeTopicId);
  const { topic, chapterColor, chapterPlan } = allTopics[activeIndex];
  const planLocked = chapterPlan === "pro" && !canAccess("pro");

  const goTo = (id: string) => {
    setActiveTopicId(id);
    setSidebarOpen(false);
    const el = document.getElementById("dsa-content");
    if (el) el.scrollTo({ top: 0, behavior: "smooth" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goPrev = () => { if (activeIndex > 0) goTo(allTopics[activeIndex - 1].topic.id); };
  const goNext = () => { if (activeIndex < allTopics.length - 1) goTo(allTopics[activeIndex + 1].topic.id); };

  const toggleChapter = (id: number) => {
    setExpandedChapters(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="flex bg-white overflow-hidden" style={{ height: "calc(100vh - 80px)" }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Left sidebar ── */}
      <aside className={`
        shrink-0 bg-white border-r-4 border-black flex flex-col
        w-72 xl:w-80
        transition-transform duration-200
        lg:translate-x-0 lg:static lg:z-auto
        fixed inset-y-0 left-0 z-40
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `} style={{ top: "80px", height: "calc(100vh - 80px)" }}>

        {/* Sidebar header */}
        <div className="bg-[#1a1a2e] border-b-4 border-black px-5 py-4 flex items-center justify-between shrink-0">
          <div>
            <p className="font-black text-white text-sm uppercase tracking-widest">DSA Guide</p>
            <p className="font-bold text-white/40 text-xs">{allTopics.length} topics · {chapters.length} chapters</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/60 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chapter + topic list */}
        <div className="flex-1 overflow-y-auto">
          {chapters.map(ch => {
            const isExpanded = expandedChapters.has(ch.id);
            const colorVal = ch.color.replace("bg-[","").replace("]","");
            return (
              <div key={ch.id}>
                <button
                  onClick={() => toggleChapter(ch.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 border-b-2 border-black/10 hover:bg-black/5 transition-colors ${isExpanded ? "bg-black/5" : ""}`}
                >
                  <span className="text-base shrink-0">{ch.icon}</span>
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-black text-black text-xs uppercase tracking-wide truncate">{ch.title}</p>
                    <p className="font-bold text-black/40 text-xs truncate">{ch.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {ch.plan === "pro" && <Lock className="w-3 h-3 text-black/40" />}
                    <ChevronRight className={`w-3.5 h-3.5 text-black/40 transition-transform duration-150 ${isExpanded ? "rotate-90" : ""}`} />
                  </div>
                </button>

                {isExpanded && (
                  <div className="bg-black/[0.02]">
                    {ch.topics.map(t => {
                      const isActive = t.id === activeTopicId;
                      const locked = ch.plan === "pro" && !canAccess("pro");
                      return (
                        <button
                          key={t.id}
                          onClick={() => goTo(t.id)}
                          className={`w-full flex items-center gap-2 pl-9 pr-4 py-2.5 border-b border-black/5 text-left transition-colors
                            ${isActive
                              ? `border-l-4 border-l-black`
                              : "hover:bg-[#fde047]/30 border-l-4 border-l-transparent"}`}
                          style={isActive ? { backgroundColor: colorVal + "30" } : {}}
                        >
                          {isActive
                            ? <CheckCircle2 className="w-3 h-3 text-black shrink-0" />
                            : locked
                            ? <Lock className="w-3 h-3 text-black/25 shrink-0" />
                            : <div className="w-1.5 h-1.5 rounded-full bg-black/25 shrink-0" />}
                          <span className={`text-xs leading-snug ${isActive ? "font-black text-black" : locked ? "font-bold text-black/35" : "font-bold text-black/65"}`}>
                            {t.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sidebar footer */}
        <div className="border-t-4 border-black px-5 py-3 bg-white shrink-0">
          <Link to="/compiler" className="flex items-center gap-2 font-black text-xs text-black hover:text-[#34d399] transition-colors">
            <Zap className="w-4 h-4" /> Open Code Compiler
          </Link>
        </div>
      </aside>

      {/* ── Right content area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Breadcrumb bar */}
        <div className="bg-white border-b-4 border-black px-5 py-3 flex items-center gap-3 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden border-4 border-black p-1.5 bg-white shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5 transition-all shrink-0"
          >
            <Menu className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="font-bold text-black/40 text-sm hidden sm:block shrink-0">DSA Guide</span>
            <ChevronRight className="w-4 h-4 text-black/30 hidden sm:block shrink-0" />
            <span className="font-black text-black text-sm truncate">{topic.title}</span>
          </div>
          <span className="font-bold text-black/40 text-xs shrink-0 hidden sm:block">
            {activeIndex + 1} / {allTopics.length}
          </span>
          {!planLocked && (
            <span className="bg-[#34d399] border-4 border-black font-black text-xs px-3 py-1 shadow-[2px_2px_0_0_#000] shrink-0">
              +50 XP
            </span>
          )}
        </div>

        {/* Scrollable content */}
        <div id="dsa-content" className="flex-1 overflow-y-auto bg-white">
          <div className="max-w-3xl mx-auto px-6 py-8">
            <ContentPanel
              topic={topic}
              chapterColor={chapterColor}
              planLocked={planLocked}
              onPrev={goPrev}
              onNext={goNext}
              hasPrev={activeIndex > 0}
              hasNext={activeIndex < allTopics.length - 1}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
