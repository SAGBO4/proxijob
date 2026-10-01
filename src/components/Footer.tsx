import React from "react";
import Link from "next/link";
import { Wrench, ShieldCheck, MapPin, Heart, ExternalLink, Lock } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-white text-slate-600">
      {/* Bandeau de réassurance locale béninoise */}
      <div className="border-b border-border bg-slate-50/70 py-8">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shadow-soft">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">Label ProxyTrust Bénin</h4>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  Identité vérifiée via CIP / CNI (ANIP) et compétences contrôlées pour des interventions en toute sécurité.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-client shadow-soft">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">Zéro Carte — Économie de Data</h4>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  Localisation textuelle par communes et repères réels sans charger de carte lourde (Google Maps / Mapbox).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-800 shadow-soft">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">Messagerie Sécurisée Pré-Accord</h4>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  Masquage algorithmique automatique des coordonnées directes jusqu'à la validation conjointe du devis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Liens principaux et colonnes */}
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Marque */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-client text-white shadow-soft">
                <Wrench className="h-4 w-4" />
              </div>
              <div className="flex items-center font-extrabold text-lg leading-none tracking-tight">
                <span className="text-client">PROXI</span>
                <span className="text-jobber">JOB</span>
                <span className="ml-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  BJ
                </span>
              </div>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed">
              La plateforme de référence pour connecter rapidement ménages et entreprises avec des artisans locaux qualifiés à Cotonou, Calavi, Porto-Novo et partout au Bénin.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Fait avec passion au Bénin</span>
              <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" />
            </div>
          </div>

          {/* Villes couvertes */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Zones de Proximité
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/jobeurs?commune=Cotonou" className="hover:text-client transition-colors">
                  Artisans à Cotonou (Haie Vive, Cadjèhoun, Akpakpa...)
                </Link>
              </li>
              <li>
                <Link href="/jobeurs?commune=Abomey-Calavi" className="hover:text-client transition-colors">
                  Artisans à Abomey-Calavi (Arconville, Kpota, Godomey...)
                </Link>
              </li>
              <li>
                <Link href="/jobeurs?commune=Porto-Novo" className="hover:text-client transition-colors">
                  Artisans à Porto-Novo (Ouando, Tokpota, Avakpa...)
                </Link>
              </li>
              <li>
                <span className="text-slate-400">Parakou & Bohicon (Prochainement)</span>
              </li>
            </ul>
          </div>

          {/* Métiers populaires */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Métiers Populaires
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/jobeurs?search=Plombier" className="hover:text-client transition-colors">
                  Plomberie & Débouchage
                </Link>
              </li>
              <li>
                <Link href="/jobeurs?search=Électricien" className="hover:text-client transition-colors">
                  Électricité bâtiment & Solaire
                </Link>
              </li>
              <li>
                <Link href="/jobeurs?search=Climatisation" className="hover:text-client transition-colors">
                  Climatisation & Froid Inverter
                </Link>
              </li>
              <li>
                <Link href="/jobeurs?search=Couture" className="hover:text-client transition-colors">
                  Couture Bazin & Kanvo
                </Link>
              </li>
              <li>
                <Link href="/jobeurs?search=Mécanicien" className="hover:text-client transition-colors">
                  Mécanique auto & Diagnostic OBD2
                </Link>
              </li>
            </ul>
          </div>

          {/* Mentions légales & Conformité Bénin */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Légal & Réglementation
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-slate-500">
                  Conformité Code du Numérique du Bénin (Loi n° 2017-20)
                </span>
              </li>
              <li>
                <span className="text-slate-500">
                  Protection des Données Personnelles (APDP Bénin)
                </span>
              </li>
              <li>
                <Link href="/#comment-ca-marche" className="hover:text-client transition-colors">
                  Charte de Confiance & Réputation
                </Link>
              </li>
              <li>
                <Link href="/video" className="font-bold text-client hover:underline flex items-center gap-1">
                  <span>▶ Vidéo Démo Mobile First (/brag)</span>
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-client transition-colors flex items-center gap-1 text-slate-500">
                  <span>Portail Modération & Sécurité</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} PROXIJOB Bénin. Tous droits réservés.</p>
          <p className="text-slate-400">
            Plateforme conforme Soft UI & TDR contractuels V1 — Zéro carte interactive lourde.
          </p>
        </div>
      </div>
    </footer>
  );
}
