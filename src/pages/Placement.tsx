import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Lightbulb, ChevronDown, ChevronUp, ExternalLink, CheckCircle2, Circle } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Topic {
  id: string;
  name: string;
  difficulty: 1 | 2 | 3 | 4;
  days: number;
  problems: string[];
}

interface Phase {
  name: string;
  color: string;
  topics: Topic[];
}

interface Company {
  id: string;
  name: string;
  difficulty: "beginner" | "easy-mid" | "medium" | "hard" | "very-hard";
  avgCTC: string;
  phases: Phase[];
}

interface Profile {
  name: string;
  year: string;
  level: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const TIPS = [
  "Solve 2 LeetCode problems daily — consistency beats cramming every time.",
  "For service companies, aptitude + communication matters as much as coding.",
  "Amazon loves STAR-format answers. Prepare 5 stories from your projects.",
  "Google expects you to think out loud. Practice explaining your approach.",
  "Start with easy problems, build confidence, then move to medium.",
];

const DIFFICULTY_CONFIG = {
  "beginner":  { label: "Beginner",   color: "bg-[#34d399]", emoji: "🟢" },
  "easy-mid":  { label: "Easy-Mid",   color: "bg-[#fde047]", emoji: "🟡" },
  "medium":    { label: "Medium",     color: "bg-[#fb923c]", emoji: "🟠" },
  "hard":      { label: "Hard",       color: "bg-[#e94560]", emoji: "🔴" },
  "very-hard": { label: "Very Hard",  color: "bg-[#c084fc]", emoji: "🔴" },
};

// ── Company Data ──────────────────────────────────────────────────────────────
const COMPANIES: Company[] = [
  {
    id: "tcs",
    name: "TCS",
    difficulty: "beginner",
    avgCTC: "₹3.5–7 LPA",
    phases: [
      {
        name: "Phase 1 — Foundation",
        color: "bg-[#34d399]",
        topics: [
          { id: "tcs-arrays", name: "Arrays", difficulty: 1, days: 3, problems: ["Reverse array", "Find max/min", "Rotate array"] },
          { id: "tcs-strings", name: "Strings", difficulty: 1, days: 3, problems: ["Palindrome check", "Anagram check", "Count vowels"] },
          { id: "tcs-math", name: "Basic Math", difficulty: 1, days: 2, problems: ["Prime check", "Factorial", "Fibonacci series"] },
          { id: "tcs-sorting", name: "Sorting", difficulty: 2, days: 3, problems: ["Bubble sort", "Selection sort"] },
          { id: "tcs-searching", name: "Searching", difficulty: 1, days: 2, problems: ["Linear search", "Binary search"] },
          { id: "tcs-recursion", name: "Recursion", difficulty: 2, days: 3, problems: ["Factorial via recursion", "Tower of Hanoi"] },
        ],
      },
      {
        name: "Phase 2 — Aptitude (TCS Specific)",
        color: "bg-[#38bdf8]",
        topics: [
          { id: "tcs-numsys", name: "Number System", difficulty: 1, days: 2, problems: ["Base conversions", "Divisibility rules"] },
          { id: "tcs-percent", name: "Percentages", difficulty: 1, days: 2, problems: ["Profit & loss", "Discount problems"] },
          { id: "tcs-tsd", name: "Time Speed Distance", difficulty: 2, days: 2, problems: ["Relative speed", "Train problems"] },
          { id: "tcs-logical", name: "Logical Reasoning", difficulty: 2, days: 3, problems: ["Syllogisms", "Blood relations", "Seating arrangement"] },
          { id: "tcs-verbal", name: "Verbal Ability", difficulty: 1, days: 2, problems: ["Reading comprehension", "Fill in the blanks"] },
        ],
      },
    ],
  },
  {
    id: "infosys",
    name: "Infosys",
    difficulty: "beginner",
    avgCTC: "₹3.6–8 LPA",
    phases: [
      {
        name: "Phase 1 — Foundation",
        color: "bg-[#34d399]",
        topics: [
          { id: "inf-arrays", name: "Arrays", difficulty: 1, days: 3, problems: ["Reverse array", "Find duplicates", "Merge sorted arrays"] },
          { id: "inf-strings", name: "Strings", difficulty: 1, days: 3, problems: ["Palindrome", "String reversal", "Count characters"] },
          { id: "inf-math", name: "Basic Math", difficulty: 1, days: 2, problems: ["GCD/LCM", "Prime numbers", "Power function"] },
          { id: "inf-sorting", name: "Sorting", difficulty: 2, days: 3, problems: ["Bubble sort", "Insertion sort"] },
          { id: "inf-searching", name: "Searching", difficulty: 1, days: 2, problems: ["Linear search", "Binary search"] },
        ],
      },
      {
        name: "Phase 2 — OOP Concepts",
        color: "bg-[#c084fc]",
        topics: [
          { id: "inf-classes", name: "Classes & Objects", difficulty: 2, days: 3, problems: ["Create a BankAccount class", "Student management system"] },
          { id: "inf-inherit", name: "Inheritance", difficulty: 2, days: 3, problems: ["Animal hierarchy", "Shape inheritance"] },
          { id: "inf-poly", name: "Polymorphism", difficulty: 2, days: 2, problems: ["Method overloading", "Method overriding"] },
          { id: "inf-encap", name: "Encapsulation", difficulty: 1, days: 2, problems: ["Getters/setters", "Private fields"] },
        ],
      },
      {
        name: "Phase 3 — Aptitude",
        color: "bg-[#38bdf8]",
        topics: [
          { id: "inf-quant", name: "Quantitative Aptitude", difficulty: 2, days: 3, problems: ["Percentages", "Ratios", "Time & work"] },
          { id: "inf-logical", name: "Logical Reasoning", difficulty: 2, days: 3, problems: ["Puzzles", "Data interpretation"] },
          { id: "inf-verbal", name: "Verbal Ability", difficulty: 1, days: 2, problems: ["Grammar", "Comprehension"] },
        ],
      },
    ],
  },
  {
    id: "wipro",
    name: "Wipro",
    difficulty: "easy-mid",
    avgCTC: "₹3.5–6.5 LPA",
    phases: [
      {
        name: "Phase 1 — Foundation",
        color: "bg-[#34d399]",
        topics: [
          { id: "wip-arrays", name: "Arrays", difficulty: 1, days: 3, problems: ["Array rotation", "Find missing number", "Pair sum"] },
          { id: "wip-strings", name: "Strings", difficulty: 1, days: 3, problems: ["Reverse words", "Longest common prefix"] },
          { id: "wip-sorting", name: "Sorting", difficulty: 2, days: 3, problems: ["Merge sort", "Quick sort basics"] },
          { id: "wip-searching", name: "Searching", difficulty: 1, days: 2, problems: ["Binary search variants"] },
          { id: "wip-recursion", name: "Recursion", difficulty: 2, days: 3, problems: ["Fibonacci", "Power of a number"] },
        ],
      },
      {
        name: "Phase 2 — Basic OOP",
        color: "bg-[#c084fc]",
        topics: [
          { id: "wip-oop1", name: "Classes & Objects", difficulty: 2, days: 2, problems: ["Library management", "Employee class"] },
          { id: "wip-oop2", name: "Inheritance & Polymorphism", difficulty: 2, days: 3, problems: ["Vehicle hierarchy", "Shape area calculator"] },
          { id: "wip-oop3", name: "Interfaces & Abstraction", difficulty: 2, days: 2, problems: ["Implement Comparable", "Abstract shapes"] },
        ],
      },
      {
        name: "Phase 3 — Aptitude",
        color: "bg-[#38bdf8]",
        topics: [
          { id: "wip-apt1", name: "Quantitative Aptitude", difficulty: 1, days: 3, problems: ["Number series", "Averages", "Profit & loss"] },
          { id: "wip-apt2", name: "Logical Reasoning", difficulty: 2, days: 2, problems: ["Coding-decoding", "Direction sense"] },
        ],
      },
    ],
  },
  {
    id: "cognizant",
    name: "Cognizant",
    difficulty: "easy-mid",
    avgCTC: "₹4–8 LPA",
    phases: [
      {
        name: "Phase 1 — Foundation",
        color: "bg-[#34d399]",
        topics: [
          { id: "cog-arrays", name: "Arrays", difficulty: 1, days: 3, problems: ["Subarray sum", "Kadane's algorithm", "Two sum"] },
          { id: "cog-strings", name: "Strings", difficulty: 1, days: 3, problems: ["String compression", "Valid parentheses"] },
          { id: "cog-math", name: "Basic Math", difficulty: 1, days: 2, problems: ["Number theory basics", "Modular arithmetic"] },
          { id: "cog-sorting", name: "Sorting", difficulty: 2, days: 2, problems: ["Sort by frequency", "Merge intervals"] },
        ],
      },
      {
        name: "Phase 2 — Basic DSA",
        color: "bg-[#fde047]",
        topics: [
          { id: "cog-stack", name: "Stack", difficulty: 2, days: 3, problems: ["Valid brackets", "Min stack", "Evaluate expression"] },
          { id: "cog-queue", name: "Queue", difficulty: 2, days: 2, problems: ["Circular queue", "Queue using stacks"] },
          { id: "cog-ll", name: "Linked List", difficulty: 2, days: 3, problems: ["Reverse linked list", "Find middle", "Merge two sorted lists"] },
        ],
      },
      {
        name: "Phase 3 — Aptitude",
        color: "bg-[#38bdf8]",
        topics: [
          { id: "cog-apt1", name: "Quantitative Aptitude", difficulty: 2, days: 3, problems: ["Permutations & combinations", "Probability basics"] },
          { id: "cog-apt2", name: "Verbal & Reasoning", difficulty: 1, days: 2, problems: ["Sentence correction", "Critical reasoning"] },
        ],
      },
    ],
  },
  {
    id: "accenture",
    name: "Accenture",
    difficulty: "medium",
    avgCTC: "₹4.5–10 LPA",
    phases: [
      {
        name: "Phase 1 — Foundation",
        color: "bg-[#34d399]",
        topics: [
          { id: "acc-arrays", name: "Arrays & Strings", difficulty: 2, days: 4, problems: ["Sliding window", "Two pointers", "String manipulation"] },
          { id: "acc-complexity", name: "Time & Space Complexity", difficulty: 2, days: 2, problems: ["Big O analysis", "Space optimization"] },
          { id: "acc-recursion", name: "Recursion & Backtracking", difficulty: 3, days: 3, problems: ["Subsets", "Permutations"] },
        ],
      },
      {
        name: "Phase 2 — Core DSA",
        color: "bg-[#fde047]",
        topics: [
          { id: "acc-stack", name: "Stack & Queue", difficulty: 2, days: 3, problems: ["LRU Cache", "Monotonic stack"] },
          { id: "acc-ll", name: "Linked List", difficulty: 2, days: 3, problems: ["Detect cycle", "Reverse in groups"] },
          { id: "acc-tree", name: "Trees", difficulty: 3, days: 4, problems: ["Level order traversal", "Diameter of tree"] },
          { id: "acc-hash", name: "Hashing", difficulty: 2, days: 2, problems: ["Group anagrams", "Longest consecutive sequence"] },
        ],
      },
      {
        name: "Phase 3 — System Design Basics",
        color: "bg-[#fb923c]",
        topics: [
          { id: "acc-sd1", name: "System Design Intro", difficulty: 3, days: 4, problems: ["Design URL shortener", "Design parking lot"] },
          { id: "acc-oop", name: "OOP Design", difficulty: 2, days: 3, problems: ["SOLID principles", "Design patterns intro"] },
          { id: "acc-sql", name: "SQL Basics", difficulty: 2, days: 2, problems: ["Joins", "Aggregations", "Subqueries"] },
        ],
      },
    ],
  },
  {
    id: "amazon",
    name: "Amazon",
    difficulty: "hard",
    avgCTC: "₹18–45 LPA",
    phases: [
      {
        name: "Phase 1 — Foundation",
        color: "bg-[#34d399]",
        topics: [
          { id: "amz-arrays", name: "Arrays", difficulty: 2, days: 3, problems: ["Kadane's algorithm", "Trapping rain water", "Product of array except self"] },
          { id: "amz-strings", name: "Strings", difficulty: 2, days: 3, problems: ["Longest substring without repeat", "Valid anagram", "Group anagrams"] },
          { id: "amz-complexity", name: "Time & Space Complexity", difficulty: 2, days: 2, problems: ["Analyze algorithm complexity", "Space optimization techniques"] },
          { id: "amz-recursion", name: "Recursion", difficulty: 2, days: 3, problems: ["Merge sort", "Quick sort", "Power function"] },
          { id: "amz-sorting", name: "Sorting", difficulty: 2, days: 3, problems: ["Merge sort", "Quick sort", "Counting sort"] },
          { id: "amz-searching", name: "Searching", difficulty: 2, days: 2, problems: ["Binary search variants", "Search in rotated array"] },
        ],
      },
      {
        name: "Phase 2 — Core DSA",
        color: "bg-[#fde047]",
        topics: [
          { id: "amz-stack", name: "Stack", difficulty: 2, days: 3, problems: ["Balanced brackets", "Next greater element", "Min stack"] },
          { id: "amz-queue", name: "Queue", difficulty: 2, days: 2, problems: ["Sliding window maximum", "Queue using stacks"] },
          { id: "amz-ll", name: "Linked List", difficulty: 3, days: 4, problems: ["Reverse linked list", "Detect cycle", "Merge K sorted lists"] },
          { id: "amz-hash", name: "Hashing", difficulty: 2, days: 3, problems: ["Frequency count", "Two sum", "Longest consecutive sequence"] },
          { id: "amz-tree", name: "Binary Trees", difficulty: 3, days: 4, problems: ["All traversals", "Height of tree", "LCA"] },
          { id: "amz-bst", name: "BST", difficulty: 3, days: 3, problems: ["Insert/delete in BST", "Validate BST", "Kth smallest element"] },
        ],
      },
      {
        name: "Phase 3 — Advanced",
        color: "bg-[#fb923c]",
        topics: [
          { id: "amz-dp", name: "Dynamic Programming", difficulty: 4, days: 7, problems: ["0/1 Knapsack", "LCS", "Coin change", "Edit distance"] },
          { id: "amz-graphs", name: "Graphs", difficulty: 4, days: 5, problems: ["BFS", "DFS", "Topological sort", "Dijkstra's algorithm"] },
          { id: "amz-heaps", name: "Heaps", difficulty: 3, days: 3, problems: ["K largest elements", "Merge K sorted arrays", "Median of stream"] },
          { id: "amz-backtrack", name: "Backtracking", difficulty: 4, days: 4, problems: ["N-Queens", "Sudoku solver", "Word search"] },
          { id: "amz-greedy", name: "Greedy", difficulty: 3, days: 3, problems: ["Activity selection", "Fractional knapsack", "Job scheduling"] },
          { id: "amz-sliding", name: "Sliding Window", difficulty: 3, days: 3, problems: ["Max sum subarray", "Longest substring", "Minimum window substring"] },
          { id: "amz-twoptr", name: "Two Pointers", difficulty: 2, days: 2, problems: ["3Sum", "Container with most water", "Remove duplicates"] },
        ],
      },
      {
        name: "Phase 4 — Amazon Specific",
        color: "bg-[#e94560]",
        topics: [
          { id: "amz-lp", name: "Leadership Principles", difficulty: 2, days: 2, problems: ["Prepare STAR stories", "Customer obsession examples", "Ownership examples"] },
          { id: "amz-sd", name: "System Design Basics", difficulty: 4, days: 5, problems: ["Design Amazon cart", "Design notification system", "Scalability concepts"] },
          { id: "amz-oop", name: "OOP Concepts", difficulty: 3, days: 3, problems: ["Design patterns", "SOLID principles", "Design parking lot"] },
          { id: "amz-sql", name: "SQL Basics", difficulty: 2, days: 2, problems: ["Complex joins", "Window functions", "Query optimization"] },
        ],
      },
    ],
  },
  {
    id: "flipkart",
    name: "Flipkart",
    difficulty: "hard",
    avgCTC: "₹20–40 LPA",
    phases: [
      {
        name: "Phase 1 — Foundation",
        color: "bg-[#34d399]",
        topics: [
          { id: "fk-arrays", name: "Arrays", difficulty: 2, days: 3, problems: ["Subarray problems", "Matrix operations", "Prefix sums"] },
          { id: "fk-strings", name: "Strings", difficulty: 2, days: 3, problems: ["KMP algorithm", "Rabin-Karp", "String hashing"] },
          { id: "fk-complexity", name: "Time & Space Complexity", difficulty: 2, days: 2, problems: ["Amortized analysis", "Space-time tradeoffs"] },
          { id: "fk-recursion", name: "Recursion", difficulty: 2, days: 3, problems: ["Divide and conquer", "Recursive tree problems"] },
          { id: "fk-sorting", name: "Sorting", difficulty: 2, days: 3, problems: ["Merge sort", "Heap sort", "Radix sort"] },
        ],
      },
      {
        name: "Phase 2 — Core DSA",
        color: "bg-[#fde047]",
        topics: [
          { id: "fk-stack", name: "Stack", difficulty: 2, days: 3, problems: ["Largest rectangle in histogram", "Stock span problem"] },
          { id: "fk-queue", name: "Queue", difficulty: 2, days: 2, problems: ["Deque problems", "BFS using queue"] },
          { id: "fk-ll", name: "Linked List", difficulty: 3, days: 4, problems: ["Reverse in K groups", "Flatten linked list", "Clone with random pointer"] },
          { id: "fk-hash", name: "Hashing", difficulty: 2, days: 3, problems: ["Consistent hashing", "Bloom filters intro"] },
          { id: "fk-tree", name: "Binary Trees", difficulty: 3, days: 4, problems: ["Serialize/deserialize", "Path sum problems", "Morris traversal"] },
          { id: "fk-bst", name: "BST & Balanced Trees", difficulty: 3, days: 3, problems: ["AVL tree concepts", "Red-black tree intro"] },
        ],
      },
      {
        name: "Phase 3 — Advanced",
        color: "bg-[#fb923c]",
        topics: [
          { id: "fk-dp", name: "Dynamic Programming", difficulty: 4, days: 7, problems: ["Matrix chain multiplication", "Palindrome partitioning", "Burst balloons"] },
          { id: "fk-graphs", name: "Graphs", difficulty: 4, days: 5, problems: ["Shortest path algorithms", "Minimum spanning tree", "Strongly connected components"] },
          { id: "fk-heaps", name: "Heaps & Priority Queue", difficulty: 3, days: 3, problems: ["K closest points", "Task scheduler"] },
          { id: "fk-backtrack", name: "Backtracking", difficulty: 4, days: 4, problems: ["Word break II", "Palindrome partitioning"] },
          { id: "fk-greedy", name: "Greedy", difficulty: 3, days: 3, problems: ["Jump game", "Gas station", "Candy distribution"] },
          { id: "fk-sliding", name: "Sliding Window & Two Pointers", difficulty: 3, days: 3, problems: ["Minimum window substring", "Longest subarray with sum K"] },
        ],
      },
      {
        name: "Phase 4 — Flipkart Specific",
        color: "bg-[#e94560]",
        topics: [
          { id: "fk-sd", name: "System Design", difficulty: 4, days: 5, problems: ["Design Flipkart search", "Design recommendation engine", "Design order management"] },
          { id: "fk-oop", name: "OOP & Design Patterns", difficulty: 3, days: 3, problems: ["Factory pattern", "Observer pattern", "Strategy pattern"] },
          { id: "fk-sql", name: "SQL & Databases", difficulty: 3, days: 3, problems: ["Query optimization", "Indexing", "Transactions"] },
        ],
      },
    ],
  },
  {
    id: "microsoft",
    name: "Microsoft",
    difficulty: "hard",
    avgCTC: "₹20–50 LPA",
    phases: [
      {
        name: "Phase 1 — Foundation",
        color: "bg-[#34d399]",
        topics: [
          { id: "ms-arrays", name: "Arrays & Strings", difficulty: 2, days: 4, problems: ["Spiral matrix", "Set matrix zeroes", "Longest palindromic substring"] },
          { id: "ms-complexity", name: "Complexity Analysis", difficulty: 2, days: 2, problems: ["Recurrence relations", "Master theorem"] },
          { id: "ms-recursion", name: "Recursion & Divide Conquer", difficulty: 3, days: 3, problems: ["Merge sort", "Binary search tree operations"] },
        ],
      },
      {
        name: "Phase 2 — Core DSA",
        color: "bg-[#fde047]",
        topics: [
          { id: "ms-stack", name: "Stack & Queue", difficulty: 2, days: 3, problems: ["Implement queue using stacks", "Largest rectangle in histogram"] },
          { id: "ms-ll", name: "Linked List", difficulty: 3, days: 4, problems: ["LRU cache", "Merge K sorted lists", "Copy list with random pointer"] },
          { id: "ms-tree", name: "Trees & BST", difficulty: 3, days: 5, problems: ["Lowest common ancestor", "Serialize tree", "Recover BST"] },
          { id: "ms-hash", name: "Hashing", difficulty: 2, days: 2, problems: ["Design HashMap", "Subarray sum equals K"] },
        ],
      },
      {
        name: "Phase 3 — Advanced",
        color: "bg-[#fb923c]",
        topics: [
          { id: "ms-dp", name: "Dynamic Programming", difficulty: 4, days: 7, problems: ["Longest increasing subsequence", "Word break", "Regular expression matching"] },
          { id: "ms-graphs", name: "Graphs", difficulty: 4, days: 5, problems: ["Clone graph", "Course schedule", "Number of islands"] },
          { id: "ms-heaps", name: "Heaps", difficulty: 3, days: 3, problems: ["Find median from data stream", "Reorganize string"] },
          { id: "ms-trie", name: "Trie", difficulty: 3, days: 3, problems: ["Implement trie", "Word search II", "Replace words"] },
        ],
      },
      {
        name: "Phase 4 — Microsoft Specific",
        color: "bg-[#e94560]",
        topics: [
          { id: "ms-sd", name: "System Design", difficulty: 4, days: 5, problems: ["Design OneDrive", "Design Teams messaging", "Design Azure load balancer"] },
          { id: "ms-oop", name: "OOP & Design Patterns", difficulty: 3, days: 4, problems: ["SOLID principles", "Design patterns", "Clean code practices"] },
          { id: "ms-sql", name: "SQL & Databases", difficulty: 3, days: 3, problems: ["Complex queries", "Database normalization", "Stored procedures"] },
          { id: "ms-os", name: "OS & Networking Basics", difficulty: 3, days: 3, problems: ["Process vs thread", "Deadlock", "TCP/IP basics"] },
        ],
      },
    ],
  },
  {
    id: "google",
    name: "Google",
    difficulty: "very-hard",
    avgCTC: "₹40–80 LPA",
    phases: [
      {
        name: "Phase 1 — Foundation",
        color: "bg-[#34d399]",
        topics: [
          { id: "goo-arrays", name: "Arrays & Strings", difficulty: 2, days: 4, problems: ["Median of two sorted arrays", "Minimum window substring", "Longest substring with K distinct"] },
          { id: "goo-complexity", name: "Complexity Analysis", difficulty: 3, days: 2, problems: ["Amortized analysis", "Space-time tradeoffs", "Recurrence solving"] },
          { id: "goo-recursion", name: "Recursion & Divide Conquer", difficulty: 3, days: 3, problems: ["Closest pair of points", "Strassen's matrix multiplication"] },
        ],
      },
      {
        name: "Phase 2 — Core DSA",
        color: "bg-[#fde047]",
        topics: [
          { id: "goo-stack", name: "Stack & Queue", difficulty: 3, days: 3, problems: ["Maximal rectangle", "Trapping rain water", "Sliding window maximum"] },
          { id: "goo-ll", name: "Linked List", difficulty: 3, days: 3, problems: ["Reverse nodes in K groups", "Flatten multilevel list"] },
          { id: "goo-tree", name: "Trees & BST", difficulty: 4, days: 5, problems: ["Binary tree cameras", "Vertical order traversal", "Count complete tree nodes"] },
          { id: "goo-hash", name: "Hashing", difficulty: 3, days: 3, problems: ["Alien dictionary", "Isomorphic strings", "Word pattern"] },
        ],
      },
      {
        name: "Phase 3 — Advanced",
        color: "bg-[#fb923c]",
        topics: [
          { id: "goo-dp", name: "Dynamic Programming", difficulty: 4, days: 8, problems: ["Burst balloons", "Strange printer", "Minimum cost to cut a stick"] },
          { id: "goo-graphs", name: "Graphs", difficulty: 4, days: 6, problems: ["Dijkstra", "Bellman-Ford", "Floyd-Warshall", "Tarjan's algorithm"] },
          { id: "goo-heaps", name: "Heaps & Priority Queue", difficulty: 3, days: 3, problems: ["Smallest range covering K lists", "IPO problem"] },
          { id: "goo-backtrack", name: "Backtracking", difficulty: 4, days: 4, problems: ["Word search II", "Remove invalid parentheses"] },
          { id: "goo-greedy", name: "Greedy & Intervals", difficulty: 3, days: 3, problems: ["Meeting rooms II", "Non-overlapping intervals"] },
        ],
      },
      {
        name: "Phase 4 — Expert Level",
        color: "bg-[#e94560]",
        topics: [
          { id: "goo-adv-graphs", name: "Advanced Graphs", difficulty: 4, days: 5, problems: ["Network flow", "Bipartite matching", "Euler path/circuit"] },
          { id: "goo-seg", name: "Segment Trees", difficulty: 4, days: 4, problems: ["Range sum query", "Range minimum query", "Lazy propagation"] },
          { id: "goo-trie", name: "Tries & Suffix Arrays", difficulty: 4, days: 4, problems: ["Implement trie", "Suffix array construction", "Longest common substring"] },
          { id: "goo-cp", name: "Competitive Programming Mindset", difficulty: 4, days: 5, problems: ["Bit manipulation tricks", "Number theory (Sieve, Euler)", "Combinatorics"] },
        ],
      },
      {
        name: "Phase 5 — Google Specific",
        color: "bg-[#c084fc]",
        topics: [
          { id: "goo-sd", name: "System Design (Expert)", difficulty: 4, days: 7, problems: ["Design Google Search", "Design YouTube", "Design Google Maps", "Design Bigtable"] },
          { id: "goo-distributed", name: "Distributed Systems", difficulty: 4, days: 5, problems: ["CAP theorem", "Consistent hashing", "MapReduce", "Paxos/Raft basics"] },
          { id: "goo-ml", name: "ML Basics (Bonus)", difficulty: 3, days: 3, problems: ["Linear regression", "Decision trees", "Evaluation metrics"] },
        ],
      },
    ],
  },
];

// ── Helper: get all topics flat ───────────────────────────────────────────────
function getAllTopics(company: Company): Topic[] {
  return company.phases.flatMap((p) => p.topics);
}

// ── Helper: count done topics ─────────────────────────────────────────────────
function countDone(companyId: string, topics: Topic[]): number {
  return topics.filter(
    (t) => localStorage.getItem(`codestart_progress_${companyId}_${t.id}`) === "done"
  ).length;
}

// ── Helper: estimate remaining days ──────────────────────────────────────────
function estimateRemainingDays(companyId: string, topics: Topic[]): number {
  return topics
    .filter((t) => localStorage.getItem(`codestart_progress_${companyId}_${t.id}`) !== "done")
    .reduce((sum, t) => sum + t.days, 0);
}

// ── Stars component ───────────────────────────────────────────────────────────
function Stars({ count }: { count: 1 | 2 | 3 | 4 }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4].map((i) => (
        <span key={i} className={`text-xs ${i <= count ? "text-[#fb923c]" : "text-black/20"}`}>★</span>
      ))}
    </span>
  );
}

// ── Progress Bar ──────────────────────────────────────────────────────────────
function ProgressBar({ done, total, color = "bg-[#34d399]" }: { done: number; total: number; color?: string }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div className="w-full bg-black/10 border-2 border-black h-3 overflow-hidden">
      <div
        className={`${color} h-full transition-all duration-500`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ── Compare Table ─────────────────────────────────────────────────────────────
const COMPARE_DATA = [
  { feature: "DSA Level",      tcs: "Basic",    infosys: "Basic",    amazon: "Advanced", google: "Expert" },
  { feature: "Aptitude",       tcs: "Yes ✓",    infosys: "Yes ✓",    amazon: "No ✗",     google: "No ✗" },
  { feature: "Coding Rounds",  tcs: "1",        infosys: "1",        amazon: "2–3",      google: "4–5" },
  { feature: "Behavioral",     tcs: "No ✗",     infosys: "No ✗",     amazon: "Yes ✓",    google: "Yes ✓" },
  { feature: "Avg CTC",        tcs: "₹4–7L",    infosys: "₹4–8L",    amazon: "₹20–45L",  google: "₹40–80L" },
];

function CompareTable({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <div className="border-4 border-black shadow-[6px_6px_0_0_#000]">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between bg-[#1a1a2e] px-6 py-4 hover:bg-[#1a1a2e]/90 transition-colors"
      >
        <span className="font-black text-white text-lg uppercase tracking-wide">📊 Compare Companies</span>
        {open ? <ChevronUp className="w-5 h-5 text-white/60" /> : <ChevronDown className="w-5 h-5 text-white/60" />}
      </button>
      {open && (
        <div className="overflow-x-auto bg-white">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-4 border-black">
                <th className="text-left px-5 py-3 font-black text-sm uppercase bg-black/5 border-r-4 border-black">Feature</th>
                {["TCS", "Infosys", "Amazon", "Google"].map((c) => (
                  <th key={c} className="px-5 py-3 font-black text-sm uppercase text-center border-r-2 last:border-r-0 border-black/20">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARE_DATA.map((row, i) => (
                <tr key={row.feature} className={`border-b-2 border-black/10 ${i % 2 === 0 ? "bg-white" : "bg-black/5"}`}>
                  <td className="px-5 py-3 font-black text-sm border-r-4 border-black">{row.feature}</td>
                  <td className="px-5 py-3 font-bold text-sm text-center border-r-2 border-black/20">{row.tcs}</td>
                  <td className="px-5 py-3 font-bold text-sm text-center border-r-2 border-black/20">{row.infosys}</td>
                  <td className="px-5 py-3 font-bold text-sm text-center border-r-2 border-black/20">{row.amazon}</td>
                  <td className="px-5 py-3 font-bold text-sm text-center">{row.google}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Testimonials ──────────────────────────────────────────────────────────────
const STORIES = [
  { quote: "I studied only TCS roadmap topics for 3 weeks and cleared their test!", name: "Priya", college: "VIT Pune", color: "bg-[#34d399]" },
  { quote: "Amazon was tough but the roadmap kept me focused. Got the offer!", name: "Rahul", college: "BITS Pilani", color: "bg-[#38bdf8]" },
  { quote: "Google took 6 months of prep. The roadmap showed me exactly what to study.", name: "Ananya", college: "IIT Delhi", color: "bg-[#c084fc]" },
];

function Testimonials() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {STORIES.map((s) => (
        <div key={s.name} className="border-4 border-black shadow-[6px_6px_0_0_#000] bg-white flex flex-col">
          <div className={`${s.color} border-b-4 border-black px-5 py-4`}>
            <span className="text-2xl">💬</span>
          </div>
          <div className="px-5 py-5 flex-1">
            <p className="font-bold text-black/80 text-sm leading-relaxed mb-4">"{s.quote}"</p>
            <div className="border-t-2 border-black/10 pt-3">
              <p className="font-black text-black text-sm">— {s.name}</p>
              <p className="font-bold text-black/50 text-xs">{s.college}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Topic Row ─────────────────────────────────────────────────────────────────
function TopicRow({
  topic,
  companyId,
  onToggle,
}: {
  topic: Topic;
  companyId: string;
  onToggle: (topicId: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const key = `codestart_progress_${companyId}_${topic.id}`;
  const done = localStorage.getItem(key) === "done";

  return (
    <div className={`border-2 border-black mb-2 transition-all ${done ? "bg-[#34d399]/10" : "bg-white"}`}>
      {/* Main row */}
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          onClick={() => onToggle(topic.id)}
          className="shrink-0 hover:scale-110 transition-transform"
          aria-label={done ? "Mark undone" : "Mark done"}
        >
          {done
            ? <CheckCircle2 className="w-5 h-5 text-[#34d399]" />
            : <Circle className="w-5 h-5 text-black/30" />}
        </button>
        <span className={`font-black text-sm flex-1 ${done ? "line-through text-black/40" : "text-black"}`}>
          {topic.name}
        </span>
        <Stars count={topic.difficulty} />
        <span className="font-bold text-xs text-black/50 whitespace-nowrap">~{topic.days}d</span>
        <button
          onClick={() => setExpanded(!expanded)}
          className="shrink-0 p-1 hover:bg-black/5 rounded transition-colors"
          aria-label="Expand topic"
        >
          {expanded
            ? <ChevronUp className="w-4 h-4 text-black/40" />
            : <ChevronDown className="w-4 h-4 text-black/40" />}
        </button>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t-2 border-black/10 bg-black/5 px-4 py-4">
          <p className="font-black text-xs uppercase tracking-widest text-black/40 mb-2">Key Problems</p>
          <ul className="mb-4 space-y-1">
            {topic.problems.map((p) => (
              <li key={p} className="flex items-start gap-2 font-bold text-sm text-black/70">
                <span className="text-[#fb923c] mt-0.5">▸</span> {p}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/dsa"
              className="inline-flex items-center gap-2 bg-[#fde047] border-2 border-black font-black text-xs px-4 py-2 shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5 transition-all"
            >
              Start Learning →
            </Link>
            <a
              href={`https://leetcode.com/problemset/all/?search=${encodeURIComponent(topic.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white border-2 border-black font-black text-xs px-4 py-2 shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5 transition-all"
            >
              Practice on LeetCode <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Roadmap View ──────────────────────────────────────────────────────────────
function RoadmapView({ company, onProgressChange }: { company: Company; onProgressChange: () => void }) {
  const [, forceUpdate] = useState(0);
  const allTopics = getAllTopics(company);
  const done = countDone(company.id, allTopics);
  const total = allTopics.length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  const remaining = estimateRemainingDays(company.id, allTopics);
  const diff = DIFFICULTY_CONFIG[company.difficulty];

  const handleToggle = (topicId: string) => {
    const key = `codestart_progress_${company.id}_${topicId}`;
    if (localStorage.getItem(key) === "done") {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, "done");
    }
    forceUpdate((n) => n + 1);
    onProgressChange();
  };

  return (
    <div className="mt-8 border-4 border-black shadow-[6px_6px_0_0_#000] bg-white">
      {/* Company header */}
      <div className={`${diff.color} border-b-4 border-black px-6 py-5`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-black text-black text-3xl uppercase">{company.name}</h2>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <span className="bg-black text-white font-black text-xs px-3 py-1 uppercase">
                {diff.emoji} {diff.label}
              </span>
              <span className="font-bold text-black/70 text-sm">{company.avgCTC}</span>
              <span className="font-bold text-black/70 text-sm">{total} topics</span>
            </div>
          </div>
          <div className="text-right">
            <p className="font-black text-black text-2xl">{pct}%</p>
            <p className="font-bold text-black/60 text-xs">ready</p>
          </div>
        </div>

        {/* Overall progress */}
        <div className="mt-4">
          <div className="flex justify-between mb-1">
            <span className="font-black text-xs text-black/60">{done} of {total} topics done</span>
            <span className="font-black text-xs text-black/60">~{remaining} days remaining</span>
          </div>
          <ProgressBar done={done} total={total} color="bg-black" />
        </div>
      </div>

      {/* Phases */}
      <div className="p-6 space-y-8">
        {company.phases.map((phase) => {
          const phaseDone = countDone(company.id, phase.topics);
          return (
            <div key={phase.name}>
              {/* Phase header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className={`${phase.color} border-2 border-black font-black text-xs px-3 py-1 uppercase`}>
                    {phase.name}
                  </span>
                </div>
                <span className="font-black text-xs text-black/50">
                  {phaseDone}/{phase.topics.length} done
                </span>
              </div>
              <ProgressBar done={phaseDone} total={phase.topics.length} color={phase.color} />
              <div className="mt-3">
                {phase.topics.map((topic) => (
                  <TopicRow
                    key={topic.id}
                    topic={topic}
                    companyId={company.id}
                    onToggle={handleToggle}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Placement() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formName, setFormName] = useState("");
  const [formYear, setFormYear] = useState("");
  const [formLevel, setFormLevel] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showCompare, setShowCompare] = useState(false);
  const [progressTick, setProgressTick] = useState(0);

  const todayTip = TIPS[new Date().getDate() % TIPS.length];

  // Load profile from localStorage on mount
  useEffect(() => {
    const raw = localStorage.getItem("codestart_profile");
    if (raw) {
      try {
        setProfile(JSON.parse(raw));
      } catch {
        // ignore malformed data
      }
    }
  }, []);

  const handleProfileSubmit = () => {
    if (!formName.trim() || !formYear || !formLevel) return;
    const p: Profile = { name: formName.trim(), year: formYear, level: formLevel };
    localStorage.setItem("codestart_profile", JSON.stringify(p));
    setProfile(p);
  };

  const handleProgressChange = () => setProgressTick((n) => n + 1);

  // Compute per-company progress for display on cards
  const getCardProgress = (company: Company) => {
    const topics = getAllTopics(company);
    const done = countDone(company.id, topics);
    return { done, total: topics.length };
  };

  // Suppress unused warning — progressTick is used to force re-render of cards
  void progressTick;

  return (
    <div className="bg-white min-h-screen">
      {/* ── Header ── */}
      <div className="bg-[#1a1a2e] border-b-4 border-black px-6 py-14 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "20px 20px" }}
        />
        <div className="max-w-5xl mx-auto relative z-10">
          <p className="text-sm font-black uppercase tracking-widest text-white/40 mb-3">Placement Prep</p>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase leading-tight mb-4">
            Your Placement<br />Roadmap
          </h1>
          <p className="text-lg font-bold text-white/60 mb-2 max-w-xl border-l-4 border-[#fde047] pl-4">
            Select your dream company → Get your exact study plan
          </p>
          <p className="font-black text-[#fde047] text-sm uppercase tracking-widest mb-6">
            Stop studying everything. Study the right things.
          </p>
          {/* Daily tip strip */}
          <div className="inline-flex items-center gap-3 bg-[#fde047] border-4 border-black px-5 py-3 shadow-[4px_4px_0_0_rgba(255,255,255,0.3)]">
            <Lightbulb className="w-4 h-4 text-black shrink-0" />
            <p className="font-bold text-black text-sm">{todayTip}</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-12">

        {/* ── Student Profile ── */}
        {!profile ? (
          <div className="border-4 border-black shadow-[6px_6px_0_0_#000] bg-white">
            <div className="bg-[#f472b6] border-b-4 border-black px-6 py-4">
              <h2 className="font-black text-black text-xl uppercase">👋 Set Up Your Profile</h2>
              <p className="font-bold text-black/60 text-sm mt-1">Takes 30 seconds. Personalises your roadmap.</p>
            </div>
            <div className="px-6 py-6 space-y-6">
              {/* Name */}
              <div>
                <label className="font-black text-xs uppercase tracking-widest text-black/50 block mb-2">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full border-4 border-black px-4 py-3 font-bold text-black text-sm outline-none focus:shadow-[4px_4px_0_0_#000] transition-all placeholder:text-black/30"
                />
              </div>
              {/* Year */}
              <div>
                <label className="font-black text-xs uppercase tracking-widest text-black/50 block mb-2">Current Year</label>
                <div className="flex flex-wrap gap-3">
                  {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((y) => (
                    <button
                      key={y}
                      onClick={() => setFormYear(y)}
                      className={`font-black text-sm px-5 py-2.5 border-4 border-black shadow-[3px_3px_0_0_#000] transition-all hover:-translate-y-0.5
                        ${formYear === y ? "bg-black text-white" : "bg-white text-black"}`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>
              {/* Level */}
              <div>
                <label className="font-black text-xs uppercase tracking-widest text-black/50 block mb-2">Your Current Level</label>
                <div className="flex flex-wrap gap-3">
                  {["Complete Beginner", "Know Basics", "Comfortable with DSA"].map((l) => (
                    <button
                      key={l}
                      onClick={() => setFormLevel(l)}
                      className={`font-black text-sm px-5 py-2.5 border-4 border-black shadow-[3px_3px_0_0_#000] transition-all hover:-translate-y-0.5
                        ${formLevel === l ? "bg-black text-white" : "bg-white text-black"}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              {/* Submit */}
              <button
                onClick={handleProfileSubmit}
                disabled={!formName.trim() || !formYear || !formLevel}
                className="bg-[#34d399] border-4 border-black font-black text-black px-8 py-4 shadow-[6px_6px_0_0_#000] hover:-translate-y-1 hover:shadow-[10px_10px_0_0_#000] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[6px_6px_0_0_#000] uppercase tracking-wide"
              >
                Start My Roadmap 🎯
              </button>
            </div>
          </div>
        ) : (
          <div className="border-4 border-black shadow-[6px_6px_0_0_#000] bg-[#fde047]">
            <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-black text-black text-2xl">Welcome back, {profile.name}! 🎯</h2>
                <p className="font-bold text-black/60 text-sm mt-1">
                  {profile.year} · {profile.level}
                  {selectedCompany && (
                    <span className="ml-2">
                      · Studying <span className="font-black text-black">{selectedCompany.name}</span>
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem("codestart_profile");
                  setProfile(null);
                  setFormName("");
                  setFormYear("");
                  setFormLevel("");
                }}
                className="font-black text-xs text-black/50 hover:text-black underline"
              >
                Reset Profile
              </button>
            </div>
          </div>
        )}

        {/* ── Company Selector Grid ── */}
        <div>
          <div className="mb-6">
            <h2 className="font-black text-black text-3xl uppercase">Choose Your Target Company</h2>
            <p className="font-bold text-black/50 text-sm mt-1">Click a company to see your personalised study roadmap</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {COMPANIES.map((company) => {
              const diff = DIFFICULTY_CONFIG[company.difficulty];
              const { done, total } = getCardProgress(company);
              const isActive = selectedCompany?.id === company.id;
              const hasStarted = done > 0;

              return (
                <button
                  key={company.id}
                  onClick={() => setSelectedCompany(isActive ? null : company)}
                  className={`text-left border-4 border-black shadow-[6px_6px_0_0_#000] transition-all hover:-translate-y-1 hover:shadow-[10px_10px_0_0_#000] p-5 flex flex-col gap-3
                    ${isActive ? "bg-[#fde047]" : "bg-white hover:bg-[#fde047]/30"}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-black text-black text-2xl uppercase">{company.name}</h3>
                    <span className={`${diff.color} border-2 border-black font-black text-[10px] px-2 py-1 uppercase whitespace-nowrap shrink-0`}>
                      {diff.emoji} {diff.label}
                    </span>
                  </div>
                  <p className="font-bold text-black/60 text-sm">{company.avgCTC}</p>
                  <p className="font-bold text-black/40 text-xs">{total} topics</p>
                  {hasStarted && (
                    <div className="w-full">
                      <div className="flex justify-between mb-1">
                        <span className="font-black text-xs text-black/50">{done}/{total} done</span>
                        <span className="font-black text-xs text-black/50">{Math.round((done / total) * 100)}%</span>
                      </div>
                      <ProgressBar done={done} total={total} color={diff.color} />
                    </div>
                  )}
                  {isActive && (
                    <span className="font-black text-xs text-black uppercase tracking-widest">▼ Viewing Roadmap</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Roadmap View ── */}
        {selectedCompany && (
          <RoadmapView
            company={selectedCompany}
            onProgressChange={handleProgressChange}
          />
        )}

        {/* ── Compare Table ── */}
        <CompareTable open={showCompare} onToggle={() => setShowCompare(!showCompare)} />

        {/* ── Placement Stories ── */}
        <div>
          <div className="mb-6">
            <h2 className="font-black text-black text-3xl uppercase">Placement Stories</h2>
            <p className="font-bold text-black/50 text-sm mt-1">Real students, real results</p>
          </div>
          <Testimonials />
        </div>

        {/* ── Bottom CTA ── */}
        <div className="bg-[#1a1a2e] border-4 border-black shadow-[6px_6px_0_0_#000] px-6 py-12 text-center">
          <p className="text-sm font-black uppercase tracking-widest text-white/40 mb-3">Keep Going</p>
          <h2 className="text-3xl font-black text-white uppercase mb-4">Build Your Skills</h2>
          <p className="font-bold text-white/60 mb-8 max-w-md mx-auto">
            Use our tools to actually learn the topics in your roadmap.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dsa"
              className="inline-flex items-center justify-center gap-3 bg-[#34d399] border-4 border-black font-black text-base px-8 py-4 shadow-[6px_6px_0_0_#000] hover:-translate-y-1 hover:shadow-[10px_10px_0_0_#000] transition-all text-black uppercase"
            >
              📚 DSA Guide →
            </Link>
            <Link
              to="/analogies"
              className="inline-flex items-center justify-center gap-3 bg-[#c084fc] border-4 border-black font-black text-base px-8 py-4 shadow-[6px_6px_0_0_#000] hover:-translate-y-1 hover:shadow-[10px_10px_0_0_#000] transition-all text-black uppercase"
            >
              🇮🇳 Desi Analogies →
            </Link>
            <Link
              to="/playground"
              className="inline-flex items-center justify-center gap-3 bg-[#fde047] border-4 border-black font-black text-base px-8 py-4 shadow-[6px_6px_0_0_#000] hover:-translate-y-1 hover:shadow-[10px_10px_0_0_#000] transition-all text-black uppercase"
            >
              🎮 Visual Playground →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
