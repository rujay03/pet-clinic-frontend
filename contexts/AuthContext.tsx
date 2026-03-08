"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { apiFetch } from "@/lib/api";
import type { MeResponse } from "@/types/auth";

interface AuthContextType {
  user: MeResponse | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<MeResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  const initialLoadDoneRef = useRef(false);

  // Keep pathname ref updated
  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  const refreshUser = useCallback(async () => {
    try {
      const data = await apiFetch<MeResponse>("/api/auth/me", {
        method: "GET",
      });
      setUser(data);
    } catch {
      setUser(null);
    }
  }, []);

  // Initial load - runs only once
  useEffect(() => {
    if (initialLoadDoneRef.current) return;
    initialLoadDoneRef.current = true;

    const loadUser = async () => {
      setLoading(true);
      try {
        const data = await apiFetch<MeResponse>("/api/auth/me", {
          method: "GET",
        });
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<MeResponse> => {
    await apiFetch("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
    const data = await apiFetch<MeResponse>("/api/auth/me", {
      method: "GET",
    });
    setUser(data);
    return data;
  };

  const logout = async () => {
    try {
      await apiFetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setUser(null);
      router.replace("/auth/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

