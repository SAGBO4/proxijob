"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Wrench, ArrowRight, Lock, Phone, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { useRole } from "@/context/RoleContext";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registeredSuccess = searchParams.get("registered") === "true";
  const resetSuccess = searchParams.get("reset") === "true";

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Une erreur est survenue lors de la connexion.");
        setLoading(false);
        return;
      }

      // Stocker le rôle actif localement pour synchroniser le contexte
      if (data.user?.activeRole) {
        localStorage.setItem(
          "proxijob_active_role",
          data.user.activeRole.toLowerCase()
        );
      }

      // Redirection stricte selon le rôle renvoyé par l'API
      const destination = data.redirectTo || "/dashboard/client";
      window.location.href = destination;
    } catch {
      setError("Impossible de joindre le serveur. Vérifiez votre connexion internet.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-client text-white shadow-soft transition-transform group-hover:scale-105">
              <Wrench className="h-6 w-6" />
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center font-extrabold text-2xl tracking-tight leading-none">
                <span className="text-client">PROXI</span>
                <span className="text-jobber">JOB</span>
                <span className="ml-1 text-[11px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  BJ
                </span>
              </div>
              <span className="text-xs text-slate-500 font-medium">Portail Sécurisé Bénin</span>
            </div>
          </Link>
        </div>

        <h1 className="mt-6 text-center text-2xl font-bold tracking-tight text-slate-900">
          Connexion à votre espace
        </h1>
        <p className="mt-2 text-center text-sm text-slate-600">
          Accédez à vos chantiers, demandes et messages sécurisés
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10">
          {registeredSuccess && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-start gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Compte créé avec succès !</p>
                <p className="text-emerald-700 text-xs mt-0.5">
                  Connectez-vous maintenant avec vos identifiants.
                </p>
              </div>
            </div>
          )}

          {resetSuccess && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-start gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Mot de passe réinitialisé !</p>
                <p className="text-emerald-700 text-xs mt-0.5">
                  Votre mot de passe a bien été mis à jour.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-sm flex items-start gap-2.5 animate-in fade-in-50">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="identifier"
                className="block text-sm font-semibold text-slate-800"
              >
                Numéro de téléphone ou Email
              </label>
              <div className="mt-1.5 relative rounded-lg shadow-none">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="h-4 w-4" />
                </div>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  autoComplete="username"
                  required
                  placeholder="+229 97 00 00 01 ou email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm transition-all"
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                Format téléphone Bénin : +229 XX XX XX XX ou direct sans indicatif.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-800"
                >
                  Mot de passe
                </label>
                <Link
                  href="/mot-de-passe-oublie"
                  className="text-xs font-semibold text-blue-800 hover:text-blue-900 hover:underline"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="mt-1.5 relative rounded-lg shadow-none">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-soft text-sm font-bold text-white bg-blue-800 hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Se connecter</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Lien vers Inscription */}
          <div className="mt-6 text-center text-sm text-slate-600 pt-4 border-t border-slate-100">
            Vous n'avez pas encore de compte ?{" "}
            <Link
              href="/inscription"
              className="font-bold text-blue-800 hover:text-blue-900 hover:underline"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-client border-r-transparent" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
