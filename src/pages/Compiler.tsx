import { useState, useRef, useCallback } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import {
  Play, Square, RotateCcw, Copy, Check, ChevronDown,
  Terminal, Clock, Zap, AlertCircle, Download
} from "lucide-react";

// ── Language definitions ──────────────────────────────────────────────────────
interface Language {
  id: number;       // Judge0 language id
  name: string;
  monaco: string;   // Monaco editor language id
  color: string;
  defaultCode: string;
}

const LANGUAGES: Language[] = [
  {
    id: 63, name: "JavaScript", monaco: "javascript", color: "bg-[#fde047]",
    defaultCode: `// JavaScript — runs instantly in your browser
function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("CodeStart"));

// Try a loop
for (let i = 1; i <= 5; i++) {
  console.log("Count: " + i);
}`,
  },
  {
    id: 71, name: "Python", monaco: "python", color: "bg-[#34d399]",
    defaultCode: `# Python
def greet(name):
    return f"Hello, {name}!"

print(greet("CodeStart"))

# Try a loop
for i in range(1, 6):
    print(f"Count: {i}")`,
  },
  {
    id: 54, name: "C++", monaco: "cpp", color: "bg-[#38bdf8]",
    defaultCode: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, CodeStart!" << endl;

    for (int i = 1; i <= 5; i++) {
        cout << "Count: " << i << endl;
    }
    return 0;
}`,
  },
  {
    id: 50, name: "C", monaco: "c", color: "bg-[#c084fc]",
    defaultCode: `#include <stdio.h>

int main() {
    printf("Hello, CodeStart!\\n");

    for (int i = 1; i <= 5; i++) {
        printf("Count: %d\\n", i);
    }
    return 0;
}`,
  },
  {
    id: 62, name: "Java", monaco: "java", color: "bg-[#fb923c]",
    defaultCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, CodeStart!");

        for (int i = 1; i <= 5; i++) {
            System.out.println("Count: " + i);
        }
    }
}`,
  },
  {
    id: 68, name: "PHP", monaco: "php", color: "bg-[#f472b6]",
    defaultCode: `<?php
function greet($name) {
    return "Hello, " . $name . "!";
}

echo greet("CodeStart") . "\\n";

for ($i = 1; $i <= 5; $i++) {
    echo "Count: " . $i . "\\n";
}`,
  },
  {
    id: 72, name: "Ruby", monaco: "ruby", color: "bg-[#e94560]",
    defaultCode: `def greet(name)
  "Hello, #{name}!"
end

puts greet("CodeStart")

(1..5).each do |i|
  puts "Count: #{i}"
end`,
  },
  {
    id: 60, name: "Go", monaco: "go", color: "bg-[#00d4ff]",
    defaultCode: `package main

import "fmt"

func greet(name string) string {
    return "Hello, " + name + "!"
}

func main() {
    fmt.Println(greet("CodeStart"))

    for i := 1; i <= 5; i++ {
        fmt.Printf("Count: %d\\n", i)
    }
}`,
  },
];

// ── Judge0 status map ─────────────────────────────────────────────────────────
const STATUS: Record<number, { label: string; color: string }> = {
  1:  { label: "In Queue",          color: "text-[#fde047]" },
  2:  { label: "Processing",        color: "text-[#38bdf8]" },
  3:  { label: "Accepted",          color: "text-[#34d399]" },
  4:  { label: "Wrong Answer",      color: "text-[#f472b6]" },
  5:  { label: "Time Limit",        color: "text-[#fb923c]" },
  6:  { label: "Compilation Error", color: "text-[#e94560]" },
  7:  { label: "Runtime Error",     color: "text-[#e94560]" },
  8:  { label: "Runtime Error",     color: "text-[#e94560]" },
  9:  { label: "Runtime Error",     color: "text-[#e94560]" },
  10: { label: "Runtime Error",     color: "text-[#e94560]" },
  11: { label: "Runtime Error",     color: "text-[#e94560]" },
  12: { label: "Runtime Error",     color: "text-[#e94560]" },
};

// ── Run JS locally (no API needed) ───────────────────────────────────────────
function runJSLocally(code: string): { output: string; error: string; time: number } {
  const logs: string[] = [];
  const start = performance.now();
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;
  let error = "";

  console.log = (...args: unknown[]) => logs.push(args.map(String).join(" "));
  console.error = (...args: unknown[]) => logs.push("[error] " + args.map(String).join(" "));
  console.warn = (...args: unknown[]) => logs.push("[warn] " + args.map(String).join(" "));

  try {
    // eslint-disable-next-line no-new-func
    new Function(code)();
  } catch (e: unknown) {
    error = e instanceof Error ? e.message : String(e);
  } finally {
    console.log = originalLog;
    console.error = originalError;
    console.warn = originalWarn;
  }

  return { output: logs.join("\n"), error, time: +(performance.now() - start).toFixed(2) };
}

// ── Judge0 public instance (no key required) ─────────────────────────────────
// Uses the official free public Judge0 CE instance
const JUDGE0_URL = "https://ce.judge0.com";

async function runViaJudge0(
  code: string,
  languageId: number,
  stdin: string,
): Promise<{ output: string; error: string; time: number; memory: number; statusId: number }> {
  const encoded = btoa(unescape(encodeURIComponent(code)));
  const stdinEncoded = stdin ? btoa(unescape(encodeURIComponent(stdin))) : undefined;

  const { data: submission } = await axios.post(
    `${JUDGE0_URL}/submissions?base64_encoded=true&wait=false`,
    { source_code: encoded, language_id: languageId, stdin: stdinEncoded },
    { headers: { "Content-Type": "application/json" } }
  );

  const token = submission.token;
  // Poll until done (status > 2 means finished)
  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 800));
    const { data } = await axios.get(
      `${JUDGE0_URL}/submissions/${token}?base64_encoded=true`,
    );
    if (data.status.id > 2) {
      const decode = (s: string | null) => {
        if (!s) return "";
        try { return decodeURIComponent(escape(atob(s))); } catch { return atob(s); }
      };
      return {
        output: decode(data.stdout) || "",
        error: decode(data.stderr) || decode(data.compile_output) || "",
        time: parseFloat(data.time || "0") * 1000,
        memory: data.memory || 0,
        statusId: data.status.id,
      };
    }
  }
  throw new Error("Execution timed out. The server may be busy — try again.");
}

// ── Language selector dropdown ────────────────────────────────────────────────
function LangSelector({ selected, onChange }: { selected: Language; onChange: (l: Language) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 ${selected.color} border-4 border-black px-4 py-2 font-black text-sm shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5 transition-all`}
      >
        {selected.name}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-44 bg-white border-4 border-black shadow-[6px_6px_0_0_#000] z-30">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => { onChange(lang); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-4 py-2.5 font-bold text-sm text-left hover:bg-[#fde047] transition-colors border-b-2 last:border-b-0 border-black/10
                ${selected.id === lang.id ? "bg-[#fde047]" : ""}`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${lang.color} border-2 border-black shrink-0`} />
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main compiler page ────────────────────────────────────────────────────────
type RunStatus = "idle" | "running" | "done" | "error";

export default function Compiler() {
  const [lang, setLang] = useState<Language>(LANGUAGES[0]);
  const [code, setCode] = useState(LANGUAGES[0].defaultCode);
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState("");
  const [errOutput, setErrOutput] = useState("");
  const [status, setStatus] = useState<RunStatus>("idle");
  const [statusId, setStatusId] = useState<number>(3);
  const [execTime, setExecTime] = useState<number | null>(null);
  const [memory, setMemory] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [theme, setTheme] = useState<"vs-dark" | "light">("vs-dark");
  const [activeTab, setActiveTab] = useState<"output" | "input">("output");
  const abortRef = useRef(false);

  const handleLangChange = (l: Language) => {
    setLang(l);
    setCode(l.defaultCode);
    setOutput("");
    setErrOutput("");
    setStatus("idle");
  };

  const run = useCallback(async () => {
    if (status === "running") return;
    setStatus("running");
    setOutput("");
    setErrOutput("");
    setExecTime(null);
    setMemory(null);
    abortRef.current = false;
    setActiveTab("output");

    try {
      // JavaScript runs locally — instant, no API key needed
      if (lang.id === 63) {
        const result = runJSLocally(code);
        if (abortRef.current) return;
        setOutput(result.output);
        setErrOutput(result.error);
        setExecTime(result.time);
        setMemory(null);
        setStatusId(result.error ? 7 : 3);
        setStatus(result.error ? "error" : "done");
        return;
      }

      // Other languages — use free public Judge0 instance (no key needed)
      const result = await runViaJudge0(code, lang.id, stdin);
      if (abortRef.current) return;
      setOutput(result.output);
      setErrOutput(result.error);
      setExecTime(result.time);
      setMemory(result.memory);
      setStatusId(result.statusId);
      setStatus(result.error || result.statusId > 3 ? "error" : "done");
    } catch (e: unknown) {
      if (abortRef.current) return;
      setErrOutput(e instanceof Error ? e.message : "Unknown error");
      setStatus("error");
      setStatusId(7);
    }
  }, [code, lang, stdin, status]);

  const stop = () => { abortRef.current = true; setStatus("idle"); };

  const reset = () => {
    setCode(lang.defaultCode);
    setOutput("");
    setErrOutput("");
    setStatus("idle");
    setExecTime(null);
    setMemory(null);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadCode = () => {
    const ext: Record<string, string> = {
      javascript: "js", python: "py", cpp: "cpp", c: "c",
      java: "java", php: "php", ruby: "rb", go: "go",
    };
    const blob = new Blob([code], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `main.${ext[lang.monaco] || "txt"}`;
    a.click();
  };

  const statusInfo = STATUS[statusId] ?? { label: "Unknown", color: "text-white/50" };
  const displayOutput = output || errOutput;

  return (
    <div className="bg-[#1a1a2e] min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="border-b-4 border-black bg-[#0f0f1a] px-4 py-3 flex items-center gap-3 flex-wrap">
        <span className="font-black text-white text-lg tracking-tighter">CodeStart Compiler</span>
        <div className="w-px h-6 bg-white/20" />
        <LangSelector selected={lang} onChange={handleLangChange} />

        <div className="flex items-center gap-2 ml-auto flex-wrap">
          {/* Font size */}
          <div className="flex items-center gap-1 border-4 border-white/20 bg-white/5">
            <button onClick={() => setFontSize(s => Math.max(10, s - 1))} className="px-2 py-1 text-white font-black hover:bg-white/10 transition-colors">−</button>
            <span className="text-white font-bold text-xs px-1">{fontSize}px</span>
            <button onClick={() => setFontSize(s => Math.min(24, s + 1))} className="px-2 py-1 text-white font-black hover:bg-white/10 transition-colors">+</button>
          </div>

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(t => t === "vs-dark" ? "light" : "vs-dark")}
            className="border-4 border-white/20 bg-white/5 px-3 py-1.5 font-bold text-xs text-white hover:bg-white/10 transition-colors"
          >
            {theme === "vs-dark" ? "☀ Light" : "🌙 Dark"}
          </button>

          {/* Copy */}
          <button onClick={copyCode} className="border-4 border-white/20 bg-white/5 p-1.5 hover:bg-white/10 transition-colors">
            {copied ? <Check className="w-4 h-4 text-[#34d399]" /> : <Copy className="w-4 h-4 text-white" />}
          </button>

          {/* Download */}
          <button onClick={downloadCode} className="border-4 border-white/20 bg-white/5 p-1.5 hover:bg-white/10 transition-colors">
            <Download className="w-4 h-4 text-white" />
          </button>

          {/* Reset */}
          <button onClick={reset} className="border-4 border-white/20 bg-white/5 p-1.5 hover:bg-white/10 transition-colors">
            <RotateCcw className="w-4 h-4 text-white" />
          </button>

          {/* Run / Stop */}
          {status === "running" ? (
            <button onClick={stop} className="flex items-center gap-2 bg-[#e94560] border-4 border-black px-5 py-2 font-black text-white shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5 transition-all">
              <Square className="w-4 h-4" /> Stop
            </button>
          ) : (
            <button onClick={run} className="flex items-center gap-2 bg-[#34d399] border-4 border-black px-5 py-2 font-black text-black shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5 transition-all">
              <Play className="w-4 h-4" /> Run
            </button>
          )}
        </div>
      </div>

      {/* Editor + output */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Editor */}
        <div className="flex-1 flex flex-col min-h-[400px] lg:min-h-0 border-r-0 lg:border-r-4 border-black">
          <div className="bg-[#0f0f1a] border-b-2 border-white/10 px-4 py-2 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#e94560] border border-black/30" />
              <div className="w-3 h-3 rounded-full bg-[#fde047] border border-black/30" />
              <div className="w-3 h-3 rounded-full bg-[#34d399] border border-black/30" />
            </div>
            <span className="font-mono text-white/40 text-xs ml-2">main.{lang.monaco === "javascript" ? "js" : lang.monaco === "python" ? "py" : lang.monaco === "cpp" ? "cpp" : lang.monaco}</span>
          </div>
          <div className="flex-1">
            <Editor
              height="100%"
              language={lang.monaco}
              value={code}
              onChange={(v) => setCode(v || "")}
              theme={theme}
              options={{
                fontSize,
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
                fontLigatures: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                renderLineHighlight: "all",
                bracketPairColorization: { enabled: true },
                autoClosingBrackets: "always",
                autoClosingQuotes: "always",
                tabSize: 2,
                wordWrap: "on",
                padding: { top: 12, bottom: 12 },
                smoothScrolling: true,
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
              }}
            />
          </div>
        </div>

        {/* Right panel */}
        <div className="w-full lg:w-[420px] flex flex-col border-t-4 lg:border-t-0 border-black">
          {/* Tabs */}
          <div className="flex border-b-4 border-black bg-[#0f0f1a]">
            {(["output", "input"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 font-black text-sm uppercase tracking-widest transition-colors
                  ${activeTab === tab ? "bg-[#fde047] text-black" : "text-white/50 hover:text-white hover:bg-white/5"}`}
              >
                {tab === "output" ? <span className="flex items-center justify-center gap-2"><Terminal className="w-4 h-4" /> Output</span>
                  : <span className="flex items-center justify-center gap-2"><Zap className="w-4 h-4" /> Stdin</span>}
              </button>
            ))}
          </div>

          {/* Stats bar */}
          {status !== "idle" && (
            <div className="bg-[#0f0f1a] border-b-2 border-white/10 px-4 py-2 flex items-center gap-4 flex-wrap">
              <span className={`font-black text-xs flex items-center gap-1 ${statusInfo.color}`}>
                {status === "running"
                  ? <><span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse inline-block" /> Running...</>
                  : <>{status === "done" ? "✓" : "✗"} {statusInfo.label}</>}
              </span>
              {execTime !== null && (
                <span className="font-bold text-white/40 text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {execTime < 1 ? execTime + "ms" : (execTime / 1000).toFixed(2) + "s"}
                </span>
              )}
              {memory !== null && memory > 0 && (
                <span className="font-bold text-white/40 text-xs flex items-center gap-1">
                  <Zap className="w-3 h-3" /> {(memory / 1024).toFixed(1)} MB
                </span>
              )}
            </div>
          )}

          {/* Output / Stdin content */}
          <div className="flex-1 overflow-auto bg-[#0d0d1a] p-4 min-h-[200px]">
            {activeTab === "input" ? (
              <div className="h-full flex flex-col gap-2">
                <p className="font-black text-white/40 text-xs uppercase tracking-widest">Standard Input (stdin)</p>
                <textarea
                  value={stdin}
                  onChange={e => setStdin(e.target.value)}
                  placeholder={"Enter input for your program here...\nEach line = one input"}
                  className="flex-1 bg-white/5 border-4 border-white/10 p-3 font-mono text-sm text-white outline-none focus:border-[#34d399] transition-colors resize-none min-h-[200px]"
                />
              </div>
            ) : (
              <div className="h-full">
                {status === "idle" && !displayOutput && (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-10">
                    <Terminal className="w-10 h-10 text-white/20" />
                    <p className="font-bold text-white/30 text-sm">Hit Run to execute your code</p>
                    <p className="font-bold text-white/30 text-xs">JavaScript runs in browser · Other languages compile on free cloud servers</p>
                  </div>
                )}
                {status === "running" && (
                  <div className="flex flex-col items-center justify-center h-full gap-3 py-10">
                    <div className="w-10 h-10 border-4 border-[#34d399] border-t-transparent rounded-full animate-spin" />
                    <p className="font-black text-white/50 text-sm">Compiling and running...</p>
                  </div>
                )}
                {(status === "done" || status === "error") && (
                  <div className="flex flex-col gap-3">
                    {output && (
                      <div>
                        <p className="font-black text-[#34d399] text-xs uppercase tracking-widest mb-2">Output</p>
                        <pre className="font-mono text-sm text-white leading-relaxed whitespace-pre-wrap break-words">{output}</pre>
                      </div>
                    )}
                    {errOutput && (
                      <div className={output ? "border-t-2 border-white/10 pt-3" : ""}>
                        <p className="font-black text-[#e94560] text-xs uppercase tracking-widest mb-2 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {statusId === 6 ? "Compilation Error" : "Error / Stderr"}
                        </p>
                        <pre className="font-mono text-sm text-[#f472b6] leading-relaxed whitespace-pre-wrap break-words">{errOutput}</pre>
                      </div>
                    )}
                    {!output && !errOutput && (
                      <p className="font-bold text-white/40 text-sm italic">No output produced.</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Language info footer */}
          <div className={`${lang.color} border-t-4 border-black px-4 py-2 flex items-center justify-between`}>
            <span className="font-black text-black text-xs uppercase">{lang.name}</span>
            <span className="font-bold text-black/60 text-xs">
              {lang.id === 63 ? "Runs in browser" : "Powered by Judge0 CE (free)"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
