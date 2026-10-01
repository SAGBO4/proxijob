import React from "react";
import Link from "next/link";
import { ArrowLeft, Smartphone, CheckCircle, ShieldCheck, Download, Share2 } from "lucide-react";

export const metadata = {
  title: "Vidéo Démo Mobile First — PROXIJOB Bénin",
  description: "Démonstration vidéo officielle Mobile First de la plateforme ProxiJob Bénin.",
};

export default function VideoShowcasePage() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Navigation retour */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 mb-6 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Retour à l'accueil ProxiJob</span>
        </Link>

        {/* En-tête */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Smartphone className="h-3.5 w-3.5 text-blue-700" />
            <span>Démonstration Officielle /brag Mobile First</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Découvrez ProxiJob en Action sur Smartphone
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto">
            Tournée en conditions réelles smartphone (viewport 390×844) : découvrez la navigation sans carte lourde, l'annuaire des artisans, le wizard de demande et le portail d'authentification.
          </p>
        </div>

        {/* Lecteur Vidéo Professionnel Mobile */}
        <div className="bg-slate-900 rounded-3xl p-4 sm:p-6 shadow-xl border border-slate-800 flex flex-col items-center">
          <div className="relative w-full max-w-[360px] aspect-[9/19.5] rounded-2xl overflow-hidden bg-black shadow-2xl border-4 border-slate-800">
            <video
              controls
              playsInline
              preload="metadata"
              poster="/videos/brag.jpg"
              className="w-full h-full object-cover"
            >
              <source src="/videos/brag.mp4" type="video/mp4" />
              <source src="/videos/proxijob-mobile-presentation.mp4" type="video/mp4" />
              Votre navigateur ne prend pas en charge la lecture vidéo.
            </video>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/videos/brag.mp4"
              download="proxijob-mobile-presentation.mp4"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-700 text-white text-xs font-bold shadow-sm hover:bg-blue-800 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Télécharger la vidéo (.mp4)</span>
            </a>
          </div>
        </div>

        {/* Points Clés Mis en Avant */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <CheckCircle className="h-5 w-5 text-emerald-600 mx-auto mb-2" />
            <h3 className="text-xs font-bold text-slate-900">100% Mobile First</h3>
            <p className="text-[11px] text-slate-500 mt-1">Conçu pour les pouces et les petits forfaits data au Bénin.</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <ShieldCheck className="h-5 w-5 text-blue-700 mx-auto mb-2" />
            <h3 className="text-xs font-bold text-slate-900">Zéro Carte Lourde</h3>
            <p className="text-[11px] text-slate-500 mt-1">Recherche textuelle par quartier, commune et rayon direct.</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <CheckCircle className="h-5 w-5 text-amber-600 mx-auto mb-2" />
            <h3 className="text-xs font-bold text-slate-900">Auth & Rôles Réels</h3>
            <p className="text-[11px] text-slate-500 mt-1">Redirection stricte Client, Jobeur ou Admin branchée sur Neon.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
