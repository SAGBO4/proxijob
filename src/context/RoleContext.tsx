"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { RoleType } from "@/lib/mock-data";

interface RoleContextValue {
  currentRole: RoleType;
  toggleRole: () => void;
  setRole: (role: RoleType) => void;
  isClient: boolean;
  isJobber: boolean;
  isAdmin: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    city: string;
    quarter: string;
  };
}

const defaultUser = {
  id: "usr_hybrid_bio",
  name: "Bio Bio Gounou",
  email: "bio.gounou@proxijob.bj",
  phone: "+229 97 11 22 44",
  avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80",
  city: "Cotonou",
  quarter: "Fidjrossè",
};

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<RoleType>("client");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  const value: RoleContextValue = {
    currentRole: mounted ? currentRole : "client",
    toggleRole,
    setRole,
    isClient: currentRole === "client",
    isJobber: currentRole === "jobber",
    isAdmin: currentRole === "admin",
    user: defaultUser,
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
