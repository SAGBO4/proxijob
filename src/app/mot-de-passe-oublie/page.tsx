"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Wrench,
  ArrowRight,
  Phone,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle2,
  KeyRound,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();

  // Étape 1 : Demande de réinitialisation
  // Étape 2 : Saisie du nouveau mot de passe
  const [step, setStep] = useState<1 | 2>(1);
  const [identifier, setIdentifier] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [userName, setUserName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Soumission de l'étape 1
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Compte introuvable.");
        setLoading(false);
        return;
      }

      setResetToken(data.resetToken);
      setUserName(data.userName);
      setStep(2);
      setLoading(false);
    } catch {
      setError("Erreur réseau. Impossible de contacter le serveur.");
      setLoading(false);
    }
  };

  // Soumission de l'étape 2 : Mise à jour du mot de passe
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Les deux mots de passe ne sont pas identiques.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Le nouveau mot de passe doit comporter au moins 6 caractères.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: resetToken,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Impossible de réinitialiser le mot de passe.");
        setLoading(false);
        return;
      }

      setSuccessMessage(data.message);
      setTimeout(() => {
        router.push("/connexion?reset=true");
      }, 1500);
    } catch {
      setError("Erreur lors de la mise à jour du mot de passe.");
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
              <span className="text-xs text-slate-500 font-medium">Récupération Sécurisée</span>
            </div>
          </Link>
        </div>

        <h1 className="mt-6 text-center text-2xl font-bold tracking-tight text-slate-900">
          {step === 1 ? "Mot de passe oublié" : "Définir un nouveau mot de passe"}
        </h1>
        <p className="mt-2 text-center text-sm text-slate-600">
          {step === 1
            ? "Indiquez votre email ou numéro de téléphone béninois pour réinitialiser votre accès"
            : `Compte vérifié : ${userName}. Choisissez votre nouveau mot de passe.`}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-sm flex items-start gap-2.5">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-start gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{successMessage}</p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Redirection automatique vers la connexion...
                </p>
              </div>
            </div>
          )}

          {step === 1 ? (
            <form className="space-y-5" onSubmit={handleRequestReset}>
              <div>
                <label
                  htmlFor="identifier"
                  className="block text-sm font-semibold text-slate-800"
                >
                  Téléphone (+229) ou Email de votre compte
                </label>
                <div className="mt-1.5 relative rounded-lg shadow-none">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    id="identifier"
                    name="identifier"
                    type="text"
                    required
                    placeholder="+229 97 00 00 00 ou email@domaine.com"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800 text-sm transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-soft text-sm font-bold text-white bg-blue-800 hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800 disabled:opacity-60 transition-all"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Vérifier mon compte</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleResetPassword}>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-2.5 text-xs text-blue-900 font-medium">
                <KeyRound className="h-4 w-4 text-blue-800 flex-shrink-0" />
                <span>Jeton de sécurité validé pour {userName}</span>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800">
                  Nouveau mot de passe
                </label>
                <div className="mt-1.5 relative rounded-lg shadow-none">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="6 caractères minimum"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800">
                  Confirmer le nouveau mot de passe
                </label>
                <div className="mt-1.5 relative rounded-lg shadow-none">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="Confirmer"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-soft text-sm font-bold text-white bg-blue-800 hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800 disabled:opacity-60 transition-all"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Mettre à jour mon mot de passe</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Retour connexion */}
          <div className="mt-6 text-center text-sm text-slate-600 pt-4 border-t border-slate-100">
            <Link
              href="/connexion"
              className="font-bold text-blue-800 hover:text-blue-900 hover:underline"
            >
              ← Retour à la page de connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
