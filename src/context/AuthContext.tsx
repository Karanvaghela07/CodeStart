import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type PlanType = "free" | "pro" | "pack";

export interface User {
  username: string;
  email: string;
  xp: number;
  streak: number;
  lastActiveDate: string;   // ISO date string — for streak tracking
  plan: PlanType;
  purchasedAt?: string;
  joinedAt: string;
  challengesDone: string[]; // array of "YYYY-MM-DD" dates completed
  gamesPlayed: number;
  aiExplainUsed: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  register: (username: string, email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  addXP: (amount: number) => void;
  upgradePlan: (plan: PlanType) => void;
  canAccess: (requiredPlan: PlanType) => boolean;
  updateStreak: () => void;
  updateUsername: (name: string) => void;
  markChallengeComplete: (date: string) => void;
  incrementGamesPlayed: () => void;
  incrementAIExplain: () => void;
  getAllUsers: () => User[];
}

const AuthContext = createContext<AuthContextType | null>(null);

const USERS_KEY = "codestart_users";
const SESSION_KEY = "codestart_session";

function getUsers(): Record<string, { password: string; user: User }> {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "{}"); }
  catch { return {}; }
}

function saveUsers(users: Record<string, { password: string; user: User }>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function persistUser(user: User) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  const users = getUsers();
  const key = user.email.toLowerCase();
  if (users[key]) { users[key].user = user; saveUsers(users); }
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function yesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try { const r = localStorage.getItem(SESSION_KEY); return r ? JSON.parse(r) : null; }
    catch { return null; }
  });

  useEffect(() => {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  }, [user]);

  const register = (username: string, email: string, password: string) => {
    if (!username.trim() || !email.trim() || !password.trim())
      return { ok: false, error: "All fields are required." };
    if (password.length < 6)
      return { ok: false, error: "Password must be at least 6 characters." };
    const users = getUsers();
    const key = email.toLowerCase();
    if (users[key]) return { ok: false, error: "An account with this email already exists." };
    const newUser: User = {
      username: username.trim(), email: key,
      xp: 0, streak: 0, plan: "free",
      joinedAt: new Date().toISOString(),
      lastActiveDate: todayStr(),
      challengesDone: [],
      gamesPlayed: 0,
      aiExplainUsed: 0,
    };
    users[key] = { password, user: newUser };
    saveUsers(users);
    setUser(newUser);
    return { ok: true };
  };

  const login = (email: string, password: string) => {
    if (!email.trim() || !password.trim())
      return { ok: false, error: "Email and password are required." };
    const users = getUsers();
    const record = users[email.toLowerCase()];
    if (!record) return { ok: false, error: "No account found with this email." };
    if (record.password !== password) return { ok: false, error: "Incorrect password." };
    // Migrate old users missing new fields
    const u = record.user;
    const migrated: User = {
      ...u,
      lastActiveDate: u.lastActiveDate ?? todayStr(),
      challengesDone: u.challengesDone ?? [],
      gamesPlayed: u.gamesPlayed ?? 0,
      aiExplainUsed: u.aiExplainUsed ?? 0,
    };
    setUser(migrated);
    persistUser(migrated);
    return { ok: true };
  };

  const logout = () => setUser(null);

  const addXP = (amount: number) => {
    if (!user) return;
    const updated = { ...user, xp: user.xp + amount };
    setUser(updated);
    persistUser(updated);
  };

  const upgradePlan = (plan: PlanType) => {
    if (!user) return;
    const updated = { ...user, plan, purchasedAt: new Date().toISOString() };
    setUser(updated);
    persistUser(updated);
  };

  // Call this whenever user does something active — updates streak
  const updateStreak = () => {
    if (!user) return;
    const today = todayStr();
    const yesterday = yesterdayStr();
    const last = user.lastActiveDate;
    let newStreak = user.streak;
    if (last === today) return; // already counted today
    if (last === yesterday) newStreak = user.streak + 1; // consecutive day
    else newStreak = 1; // streak broken, restart
    const updated = { ...user, streak: newStreak, lastActiveDate: today };
    setUser(updated);
    persistUser(updated);
  };

  const updateUsername = (name: string) => {
    if (!user) return;
    const updated = { ...user, username: name };
    setUser(updated);
    persistUser(updated);
  };

  const markChallengeComplete = (date: string) => {
    if (!user) return;
    if (user.challengesDone.includes(date)) return;
    const updated = { ...user, challengesDone: [...user.challengesDone, date] };
    setUser(updated);
    persistUser(updated);
  };

  const incrementGamesPlayed = () => {
    if (!user) return;
    const updated = { ...user, gamesPlayed: (user.gamesPlayed ?? 0) + 1 };
    setUser(updated);
    persistUser(updated);
  };

  const incrementAIExplain = () => {
    if (!user) return;
    const updated = { ...user, aiExplainUsed: (user.aiExplainUsed ?? 0) + 1 };
    setUser(updated);
    persistUser(updated);
  };

  const getAllUsers = (): User[] => {
    const users = getUsers();
    return Object.values(users).map(r => r.user);
  };

  const canAccess = (requiredPlan: PlanType): boolean => {
    if (requiredPlan === "free") return true;
    if (!user) return false;
    if (requiredPlan === "pro") return user.plan === "pro" || user.plan === "pack";
    if (requiredPlan === "pack") return user.plan === "pack";
    return false;
  };

  return (
    <AuthContext.Provider value={{
      user, login, register, logout, addXP, upgradePlan, canAccess,
      updateStreak, updateUsername, markChallengeComplete,
      incrementGamesPlayed, incrementAIExplain, getAllUsers,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
