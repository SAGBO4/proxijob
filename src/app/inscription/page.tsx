"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Wrench,
  User,
  Briefcase,
  ArrowRight,
  Lock,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  // Type de compte : CLIENT ou JOBBER
  const [role, setRole] = useState<"CLIENT" | "JOBBER">("CLIENT");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [city, setCity] = useState("Cotonou");
  const [quarter, setQuarter] = useState("Fidjrossè");

  // Spécifique Jobeur
  const [headline, setHeadline] = useState("");
  const [hourlyRate, setHourlyRate] = useState("3500");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          phone,
          email: email || undefined,
          password,
          role,
          city,
          quarter,
          headline: role === "JOBBER" ? headline : undefined,
          hourlyRate: role === "JOBBER" ? Number(hourlyRate) : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Une erreur est survenue lors de l'inscription.");
        setLoading(false);
        return;
      }

      // Stocker le rôle actif
      if (data.user?.activeRole) {
        localStorage.setItem(
          "proxijob_active_role",
          data.user.activeRole.toLowerCase()
        );
      }

      // Redirection immédiate vers le dashboard
      window.location.href = data.redirectTo || (role === "JOBBER" ? "/dashboard/jobeur" : "/dashboard/client");
    } catch {
      setError("Impossible de joindre le serveur. Veuillez réessayer.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
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
              <span className="text-xs text-slate-500 font-medium">Inscription Sécurisée</span>
            </div>
          </Link>
        </div>

        <h1 className="mt-6 text-center text-2xl font-bold tracking-tight text-slate-900">
          Créer votre compte ProxiJob
        </h1>
        <p className="mt-2 text-center text-sm text-slate-600">
          Rejoignez la première communauté d'artisans et particuliers vérifiés au Bénin
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10">
          {/* Sélecteur de profil (Particulier vs Artisan) */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Vous vous inscrivez en tant que :
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("CLIENT")}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                  role === "CLIENT"
                    ? "border-blue-800 bg-blue-50/50 text-blue-900 ring-2 ring-blue-800"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <User className={`h-6 w-6 mb-1.5 ${role === "CLIENT" ? "text-blue-800" : "text-slate-500"}`} />
                <span className="font-bold text-sm">Particulier</span>
                <span className="text-[11px] text-slate-500 mt-0.5">
                  Je cherche un artisan qualifié
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRole("JOBBER")}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                  role === "JOBBER"
                    ? "border-amber-600 bg-amber-50/50 text-amber-900 ring-2 ring-amber-500"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Briefcase className={`h-6 w-6 mb-1.5 ${role === "JOBBER" ? "text-amber-600" : "text-slate-500"}`} />
                <span className="font-bold text-sm">Artisan / Jobeur</span>
                <span className="text-[11px] text-slate-500 mt-0.5">
                  Je propose mes services
                </span>
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-sm flex items-start gap-2.5">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Prénom & Nom */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-800">
                  Prénom *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Koffi"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 block w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800">
                  Nom de famille *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Mensah"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 block w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800"
                />
              </div>
            </div>

            {/* Téléphone & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-800">
                  Téléphone béninois (+229) *
                </label>
                <div className="mt-1 relative rounded-xl shadow-none">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="+229 97 00 00 00"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800">
                  Adresse email <span className="text-slate-400 text-xs">(Optionnel)</span>
                </label>
                <div className="mt-1 relative rounded-xl shadow-none">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    placeholder="nom@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800"
                  />
                </div>
              </div>
            </div>

            {/* Ville & Quartier */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-800">
                  Commune / Ville *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-1 block w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800 bg-white"
                >
                  <option value="Cotonou">Cotonou (Littoral)</option>
                  <option value="Abomey-Calavi">Abomey-Calavi (Atlantique)</option>
                  <option value="Porto-Novo">Porto-Novo (Ouémé)</option>
                  <option value="Parakou">Parakou (Borgou)</option>
                  <option value="Ouidah">Ouidah (Atlantique)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800">
                  Quartier / Repère textuel *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Fidjrossè, Haie Vive, Godomey..."
                  value={quarter}
                  onChange={(e) => setQuarter(e.target.value)}
                  className="mt-1 block w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800"
                />
              </div>
            </div>

            {/* Champs additionnels si Jobeur */}
            {role === "JOBBER" && (
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3 animate-in fade-in-50">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                  <Briefcase className="h-4 w-4 text-amber-700" />
                  <span>Détails de votre activité artisanale</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800">
                    Votre spécialité / Titre professionnel *
                  </label>
                  <input
                    type="text"
                    required={role === "JOBBER"}
                    placeholder="Ex: Plombier Sanitaire & Climatisation"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="mt-1 block w-full px-3.5 py-2 border border-slate-300 rounded-lg text-slate-900 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800">
                    Tarif horaire / d'intervention indicatif (FCFA)
                  </label>
                  <input
                    type="number"
                    step="500"
                    min="1000"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    className="mt-1 block w-full px-3.5 py-2 border border-slate-300 rounded-lg text-slate-900 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                  <p className="text-[11px] text-amber-800 mt-1">
                    Bonus d'inscription : 5 crédits de visibilité offerts immédiatement.
                  </p>
                </div>
              </div>
            )}

            {/* Mot de passe & confirmation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-800">
                  Mot de passe *
                </label>
                <div className="mt-1 relative rounded-xl shadow-none">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="6 caractères min."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800">
                  Confirmer mot de passe *
                </label>
                <div className="mt-1 relative rounded-xl shadow-none">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="Confirmer"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-soft text-sm font-bold text-white bg-blue-800 hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Créer mon compte {role === "JOBBER" ? "Jobeur" : "Client"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Lien vers Connexion */}
          <div className="mt-6 text-center text-sm text-slate-600 pt-4 border-t border-slate-100">
            Vous avez déjà un compte ?{" "}
            <Link
              href="/connexion"
              className="font-bold text-blue-800 hover:text-blue-900 hover:underline"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
