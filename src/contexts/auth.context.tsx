import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { clearSession, getStoredSession, logoutUser, refreshAccessToken } from "@/services/auth.service";
import type { User } from "@/types";

interface AuthContextValue {
  user: User | null;
  isAuthLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const stored = getStoredSession();
      if (!stored) {
        setIsAuthLoading(false);
        return;
      }

      setUser(stored.user);

      const result = await refreshAccessToken();
      if (result === "invalid") {
        clearSession();
        setUser(null);
        toast.error("Session expired. Please sign in again.");
      }

      setIsAuthLoading(false);
    }

    restoreSession();
  }, []);

  async function logout() {
    try {
      await logoutUser();
    } catch {
      // best-effort — clear the local session regardless of server result
    }
    clearSession();
    setUser(null);
    toast.success("Signed out successfully");
  }

  return (
    <AuthContext.Provider value={{ user, isAuthLoading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
