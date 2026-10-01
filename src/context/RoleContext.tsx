"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { RoleType } from "@/lib/mock-data";

export interface AuthUser {
  id: string;
  name: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  avatar?: string;
  city: string;
  quarter: string;
  role?: string;
  activeRole?: string;
}

interface RoleContextValue {
  currentRole: RoleType;
  toggleRole: () => void;
  setRole: (role: RoleType) => void;
  isClient: boolean;
  isJobber: boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
  user: AuthUser;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const fallbackUser: AuthUser = {
  id: "usr_client_koffi",
  name: "Koffi Mensah",
  email: "koffi.mensah@gmail.com",
  phone: "+229 96 11 22 33",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
  city: "Cotonou",
  quarter: "Haie Vive",
};

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<RoleType>("client");
  const [user, setUser] = useState<AuthUser>(fallbackUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setIsAuthenticated(true);
          const mappedUser: AuthUser = {
            id: data.user.id,
            name: data.user.name || `${data.user.firstName || ""} ${data.user.lastName || ""}`.trim() || "Utilisateur ProxiJob",
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            email: data.user.email,
            phone: data.user.phone,
            avatar: data.user.image || fallbackUser.avatar,
            city: data.user.city || "Cotonou",
            quarter: data.user.quarter || "Haie Vive",
            role: data.user.role,
            activeRole: data.user.activeRole,
          };
          setUser(mappedUser);

          // Rôle effectif
          if (data.user.role === "ADMIN" || data.user.role === "MODERATOR") {
            setCurrentRole("admin");
          } else if (data.user.activeRole === "JOBBER" || data.user.role === "JOBBER") {
            setCurrentRole("jobber");
          } else {
            setCurrentRole("client");
          }
          return;
        }
      }
      setIsAuthenticated(false);
    } catch {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchCurrentUser();

    const saved = localStorage.getItem("proxijob_active_role") as RoleType;
    if (saved && (saved === "client" || saved === "jobber" || saved === "admin")) {
      setCurrentRole(saved);
    }
  }, []);

  const setRole = (role: RoleType) => {
    setCurrentRole(role);
    if (typeof window !== "undefined") {
      localStorage.setItem("proxijob_active_role", role);
    }
  };

  const toggleRole = () => {
    const nextRole: RoleType = currentRole === "client" ? "jobber" : "client";
    setRole(nextRole);
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignorer l'erreur réseau
    } finally {
      setIsAuthenticated(false);
      setUser(fallbackUser);
      localStorage.removeItem("proxijob_active_role");
      window.location.href = "/connexion";
    }
  };

  const value: RoleContextValue = {
    currentRole: mounted ? currentRole : "client",
    toggleRole,
    setRole,
    isClient: currentRole === "client",
    isJobber: currentRole === "jobber",
    isAdmin: currentRole === "admin",
    isAuthenticated,
    user,
    logout,
    refreshUser: fetchCurrentUser,
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
