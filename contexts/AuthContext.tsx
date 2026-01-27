"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { apiFetch } from "@/lib/api";
import type { MeResponse } from "@/types/auth";

interface AuthContextType {
  user: MeResponse | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const refreshUser = useCallback(async () => {
    try {
      const data = await apiFetch<MeResponse>("/api/auth/me", {
        method: "GET",
      });
      setUser(data);
    } catch {
      setUser(null);
      // Only redirect to login if not on public pages
      const publicPaths = ["/", "/auth/login", "/auth/register/petowner", "/auth/register/staff"];
      if (!publicPaths.includes(pathname)) {
        router.replace("/auth/login");
      }
    }
  }, [pathname, router]);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      await refreshUser();
      setLoading(false);
    };

    loadUser();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    await apiFetch("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
    await refreshUser();
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

