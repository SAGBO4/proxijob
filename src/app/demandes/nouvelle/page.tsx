"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Wrench,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Clock,
  AlertCircle,
  Camera,
  Coins,
  ShieldCheck,
  Send,
} from "lucide-react";
import { BENIN_COMMUNES, CATEGORIES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function NouvelleDemandePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    categorySlug: "batiment-construction",
    trade: "Plomberie sanitaire",
    title: "",
    description: "",
    commune: "Cotonou",
    quarter: "Haie Vive",
    landmark: "",
    isUrgent: false,
    estimatedBudget: "25000",
    deadlineType: "urgent", // 'urgent', 'today', 'week'
  });

  const selectedCommuneData = BENIN_COMMUNES.find((c) => c.name === formData.commune);
  const quarters = selectedCommuneData ? selectedCommuneData.quarters : [];

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      router.push("/dashboard/client");
    }, 2500);
  };

  const steps = [
    { num: 1, title: "Métier" },
    { num: 2, title: "Description" },
    { num: 3, title: "Localisation" },
    { num: 4, title: "Budget & Validation" },
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-2xl border border-emerald-200 bg-white p-8 text-center shadow-soft-md animate-in zoom-in-95 duration-200">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-4 shadow-soft">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Demande publiée avec succès !</h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            Votre besoin est maintenant visible par les artisans qualifiés de votre quartier ({formData.quarter}, {formData.commune}). Vous recevrez les premiers devis sous peu.
          </p>
          <div className="mt-6 rounded-xl bg-slate-50 p-3 text-xs text-slate-500 font-medium">
            Redirection automatique vers votre tableau de bord...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-8">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6">
        {/* Titre */}
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-client">
            Formulaire Rapide (&lt; 90 secondes)
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Publier une demande de service
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Décrivez précisément votre problème pour recevoir des devis sur-mesure.
          </p>
        </div>

        {/* Barre de progression aérée */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {steps.map((s) => (
              <div key={s.num} className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-200 shadow-soft",
                    currentStep === s.num
                      ? "bg-client text-white ring-4 ring-blue-100"
                      : currentStep > s.num
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 text-slate-600"
                  )}
                >
                  {currentStep > s.num ? "✓" : s.num}
                </div>
                <span
                  className={cn(
                    "text-[11px] font-semibold mt-1 hidden sm:block",
                    currentStep === s.num ? "text-client" : "text-slate-500"
                  )}
                >
                  {s.title}
                </span>
              </div>
            ))}
          </div>

          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-client transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Contenu du Wizard */}
        <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-soft">
          {/* ÉTAPE 1 : CHOIX DU MÉTIER */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Quel type de professionnel recherchez-vous ?
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sélectionnez le corps de métier correspondant à votre intervention.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { trade: "Plomberie sanitaire", desc: "Fuite d'eau, canalisations, sanitaires", slug: "batiment-construction" },
                  { trade: "Électricité bâtiment", desc: "Court-circuit, tableau SBEE, éclairage", slug: "batiment-construction" },
                  { trade: "Climatisation & Froid", desc: "Entretien split, recharge gaz R410A", slug: "batiment-construction" },
                  { trade: "Couture & Retouches", desc: "Tenue cérémonielle, pagne Kanvo, sur-mesure", slug: "mode-artisanat" },
                  { trade: "Mécanique auto & valise", desc: "Diagnostic moteur OBD2, freins, vidange", slug: "automobile-mobilite" },
                  { trade: "Maintenance informatique", desc: "Dépannage PC, Wi-Fi, câblage réseau", slug: "numerique-creation" },
                ].map((item) => (
                  <button
                    key={item.trade}
                    type="button"
                    onClick={() => setFormData({ ...formData, trade: item.trade, categorySlug: item.slug })}
                    className={cn(
                      "flex flex-col text-left p-4 rounded-xl border transition-all duration-150 active:scale-[0.98]",
                      formData.trade === item.trade
                        ? "border-client bg-blue-50/60 shadow-soft"
                        : "border-border hover:bg-slate-50"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">{item.trade}</span>
                      {formData.trade === item.trade && (
                        <CheckCircle2 className="h-4 w-4 text-client shrink-0" />
                      )}
                    </div>
                    <span className="text-xs text-slate-500 mt-1">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ÉTAPE 2 : DESCRIPTION DU BESOIN */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Décrivez votre problème
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Plus votre description est précise, plus les propositions de devis seront exactes.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Titre court de la demande *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Fuite importante sous évier cuisine"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-xl border border-input px-4 py-2.5 text-sm outline-none focus:border-client"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Détail du besoin ou de la panne *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Précisez la situation : depuis quand cela dure, le type d'équipement, les contraintes d'accès..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full rounded-xl border border-input p-3.5 text-sm outline-none focus:border-client leading-relaxed"
                  />
                </div>

                {/* Upload simulé de photos avec compression WebP (design.md §6.4) */}
                <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                  <Camera className="mx-auto h-6 w-6 text-slate-400 mb-1" />
                  <span className="block text-xs font-semibold text-slate-700">
                    Ajouter des photos du problème (optionnel)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    JPG, PNG — compression automatique basse consommation WebP
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ÉTAPE 3 : LOCALISATION BÉNINOISE & URGENCE (ACC-02, ACC-05) */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Où se situe l'intervention ?
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Indiquez votre commune, votre quartier et un repère visuel connu pour guider l'artisan sans carte lourde.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Commune / Ville *
                  </label>
                  <select
                    value={formData.commune}
                    onChange={(e) => setFormData({ ...formData, commune: e.target.value, quarter: "" })}
                    className="w-full rounded-xl border border-input px-3.5 py-2.5 text-sm outline-none focus:border-client bg-white text-slate-800"
                  >
                    {BENIN_COMMUNES.map((c) => (
                      <option key={c.slug} value={c.name}>
                        {c.name} ({c.department})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Quartier *
                  </label>
                  <select
                    value={formData.quarter}
                    onChange={(e) => setFormData({ ...formData, quarter: e.target.value })}
                    className="w-full rounded-xl border border-input px-3.5 py-2.5 text-sm outline-none focus:border-client bg-white text-slate-800"
                  >
                    <option value="">Sélectionnez un quartier</option>
                    {quarters.map((q) => (
                      <option key={q.slug} value={q.name}>
                        {q.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Repère géographique populaire (Landmark Bénin) *
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-input px-3.5 py-2.5 text-sm bg-white focus-within:border-client">
                  <MapPin className="h-4 w-4 text-client shrink-0" />
                  <input
                    type="text"
                    placeholder="Ex: Face pharmacie Camp Guézo, 2ème ruelle après l'école"
                    value={formData.landmark}
                    onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                    className="w-full text-xs sm:text-sm outline-none placeholder:text-slate-400 bg-transparent"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Permet à l'artisan de vous localiser immédiatement sans consommer de data sur une carte.
                </span>
              </div>

              {/* Toggle d'urgence < 2h */}
              <div className="p-4 rounded-xl border border-red-200 bg-red-50/60">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isUrgent}
                    onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })}
                    className="mt-0.5 h-4 w-4 rounded border-red-300 text-red-600 focus:ring-red-500"
                  />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-red-900 flex items-center gap-1.5">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span>Intervention Urgente (&lt; 2 heures)</span>
                    </span>
                    <p className="text-xs text-red-700 mt-0.5">
                      Cochez si vous avez un besoin critique (dégât des eaux, court-circuit, panne frigorifique). L'annonce sera mise en avant auprès des artisans disponibles immédiatement.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* ÉTAPE 4 : BUDGET & RÉCAPITULATIF */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Budget indicatif & Validation
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Aucun paiement n'est exigé en ligne. Le règlement s'effectuera directement avec l'artisan de gré à gré.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Budget indicatif estimé (en Francs CFA)
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-input px-3.5 py-2.5 text-sm bg-white focus-within:border-client">
                    <Coins className="h-4 w-4 text-amber-500 shrink-0" />
                    <input
                      type="number"
                      step="1000"
                      value={formData.estimatedBudget}
                      onChange={(e) => setFormData({ ...formData, estimatedBudget: e.target.value })}
                      className="w-full text-sm font-bold text-slate-900 outline-none bg-transparent"
                    />
                    <span className="text-xs font-bold text-slate-500">FCFA</span>
                  </div>
                </div>

                {/* Récapitulatif visuel */}
                <div className="rounded-xl border border-border bg-slate-50 p-4 space-y-2 text-xs">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    Récapitulatif de votre publication
                  </h4>
                  <div className="flex justify-between py-1 border-b border-border/60">
                    <span className="text-slate-500">Métier :</span>
                    <span className="font-bold text-slate-900">{formData.trade}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/60">
                    <span className="text-slate-500">Titre :</span>
                    <span className="font-semibold text-slate-900">{formData.title || "Non précisé"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/60">
                    <span className="text-slate-500">Zone :</span>
                    <span className="font-semibold text-slate-900">
                      {formData.quarter || "Quartier"}, {formData.commune}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/60">
                    <span className="text-slate-500">Repère :</span>
                    <span className="font-semibold text-slate-900">{formData.landmark || "Non renseigné"}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Priorité :</span>
                    <span className={cn("font-bold", formData.isUrgent ? "text-red-600" : "text-slate-700")}>
                      {formData.isUrgent ? "URGENT (< 2h)" : "Normale"}
                    </span>
                  </div>
                </div>

                {/* Réassurance de sécurité */}
                <div className="flex items-center gap-2 rounded-xl bg-blue-50 p-3 text-xs text-blue-900 border border-blue-100">
                  <ShieldCheck className="h-4 w-4 text-client shrink-0" />
                  <span>
                    Vos coordonnées téléphoniques restent automatiquement protégées jusqu'à ce que vous validiez une proposition.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Boutons de navigation du formulaire */}
          <div className="mt-8 pt-5 border-t border-border flex items-center justify-between gap-3">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="inline-flex items-center gap-1.5 rounded-xl border border-input px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Précédent</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={currentStep === 2 && !formData.title.trim()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-client px-5 py-2.5 text-xs font-bold text-white shadow-soft hover:bg-client-hover disabled:opacity-50 transition-all"
              >
                <span>Continuer</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-soft hover:bg-emerald-700 active:scale-[0.98] transition-all"
              >
                <Send className="h-4 w-4" />
                <span>Confirmer & Publier</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
