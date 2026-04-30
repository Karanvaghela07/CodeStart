import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type PlanType = "free" | "pro" | "pack";

export interface User {
  username: string;
  email: string;
  xp: number;
  streak: number;
  plan: PlanType;
  purchasedAt?: string;
  joinedAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  register: (username: string, email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  addXP: (amount: number) => void;
  upgradePlan: (plan: PlanType) => void;
  canAccess: (requiredPlan: PlanType) => boolean;
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
      xp: 0, streak: 0, plan: "free", joinedAt: new Date().toISOString(),
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
    setUser(record.user);
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

  // free = everyone (logged in or not), pro = pro or pack users, pack = pack only
  const canAccess = (requiredPlan: PlanType): boolean => {
    if (requiredPlan === "free") return true; // always accessible
    if (!user) return false; // must be logged in for paid content
    if (requiredPlan === "pro") return user.plan === "pro" || user.plan === "pack";
    if (requiredPlan === "pack") return user.plan === "pack";
    return false;
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, addXP, upgradePlan, canAccess }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
