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
  Loader2,
} from "lucide-react";
import { BENIN_COMMUNES, CATEGORIES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function NouvelleDemandePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // Enregistrement réel dans Neon PostgreSQL
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/demandes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          city: formData.commune,
          quarter: formData.quarter,
          landmark: formData.landmark,
          estUrgent: formData.isUrgent || formData.deadlineType === "urgent",
          budgetIndicatif: Number(formData.estimatedBudget) || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Une erreur est survenue lors de la publication.");
        setSubmitting(false);
        return;
      }

      setIsSubmitted(true);
      setTimeout(() => {
        router.push("/demandes");
      }, 2000);
    } catch {
      setError("Impossible d'enregistrer la demande. Vérifiez votre connexion.");
      setSubmitting(false);
    }
  };

  const steps = [
    { num: 1, title: "Métier" },
    { num: 2, title: "Description" },
    { num: 3, title: "Localisation" },
    { num: 4, title: "Budget & Validation" },
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-2xl border border-emerald-200 bg-white p-8 text-center shadow-soft animate-in zoom-in-95 duration-200">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-4 shadow-soft">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Demande publiée en base réelle !</h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            Votre besoin est maintenant persisté dans la base Neon PostgreSQL et visible par tous les artisans de votre quartier ({formData.quarter}, {formData.commune}).
          </p>
          <div className="mt-6 rounded-xl bg-slate-50 p-3 text-xs text-slate-500 font-medium">
            Redirection automatique vers les demandes en cours...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
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

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-sm flex items-start gap-2.5">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {/* Stepper épuré */}
        <div className="mb-6 sm:mb-8">
          <div className="flex sm:hidden items-center justify-between mb-2">
            <span className="text-xs font-bold text-client">
              Étape {currentStep} sur 4
            </span>
            <span className="text-xs font-semibold text-slate-700">
              {steps[currentStep - 1]?.title}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
            {steps.map((s) => (
              <div
                key={s.num}
                className={cn(
                  "flex flex-col border-t-4 pt-2 text-left transition-colors",
                  s.num <= currentStep ? "border-client" : "border-slate-200"
                )}
              >
                <span
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-wider hidden sm:inline",
                    s.num <= currentStep ? "text-client" : "text-slate-400"
                  )}
                >
                  Étape 0{s.num}
                </span>
                <span className="text-xs font-bold text-slate-800 hidden sm:inline truncate">
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-8 shadow-soft">
          {/* ÉTAPE 1 : CATÉGORIE & MÉTIER */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Quel type d'artisan recherchez-vous ?
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sélectionnez la catégorie principale correspondant à votre besoin.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CATEGORIES.map((cat) => {
                  const isSelected = formData.categorySlug === cat.slug;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          categorySlug: cat.slug,
                          trade: cat.subcategories[0] || cat.name,
                        })
                      }
                      className={cn(
                        "flex items-start gap-3 p-4 rounded-xl border text-left transition-all",
                        isSelected
                          ? "border-client bg-blue-50/50 shadow-soft"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-bold text-xs",
                          isSelected ? "bg-client text-white" : "bg-slate-100 text-slate-600"
                        )}
                      >
                        ✓
                      </div>
                      <div className="space-y-0.5">
                        <span className="font-bold text-xs sm:text-sm text-slate-900 block">
                          {cat.name}
                        </span>
                        <span className="text-[11px] text-slate-500 line-clamp-1 block">
                          {cat.description}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Sous-catégories associées */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Précisez la prestation requise :
                </label>
                <div className="flex flex-wrap gap-2">
                  {(CATEGORIES.find((c) => c.slug === formData.categorySlug)?.subcategories || []).map(
                    (sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => setFormData({ ...formData, trade: sub })}
                        className={cn(
                          "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                          formData.trade === sub
                            ? "bg-client text-white shadow-soft"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        )}
                      >
                        {sub}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ÉTAPE 2 : DESCRIPTION DU BESOIN */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Détaillez votre besoin
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Plus votre description est claire, plus les devis reçus seront précis.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Titre de votre demande *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Fuite d'eau sous évier cuisine ou Révision climatiseur split"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 outline-none focus:border-client focus:ring-1 focus:ring-client"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Description détaillée du problème *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Expliquez ce qui ne fonctionne pas, le matériel déjà en place, si vous avez des pièces de rechange..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 outline-none focus:border-client focus:ring-1 focus:ring-client leading-relaxed"
                />
              </div>

              {/* Urgence */}
              <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isUrgent}
                    onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })}
                    className="mt-1 rounded border-slate-300 text-red-600 focus:ring-red-500 h-4 w-4"
                  />
                  <div>
                    <span className="font-bold text-xs text-red-700 block">
                      Besoin d'intervention urgente (&lt; 2 heures)
                    </span>
                    <span className="text-[11px] text-slate-600">
                      Cochez si vous avez une fuite d'eau critique, une panne électrique totale ou une urgence de sécurité.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* ÉTAPE 3 : LOCALISATION SANS CARTE */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Où doit se dérouler la prestation ?
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Localisation toponymique par repères visuels habituels au Bénin.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Commune *
                  </label>
                  <select
                    value={formData.commune}
                    onChange={(e) => {
                      const comm = e.target.value;
                      const cData = BENIN_COMMUNES.find((c) => c.name === comm);
                      setFormData({
                        ...formData,
                        commune: comm,
                        quarter: cData && cData.quarters[0] ? cData.quarters[0].name : "Quartier",
                      });
                    }}
                    className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 outline-none focus:border-client bg-white"
                  >
                    {BENIN_COMMUNES.map((c) => (
                      <option key={c.slug} value={c.name}>
                        {c.name} ({c.department})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Quartier *
                  </label>
                  <select
                    value={formData.quarter}
                    onChange={(e) => setFormData({ ...formData, quarter: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 outline-none focus:border-client bg-white"
                  >
                    {quarters.map((q) => (
                      <option key={q.slug} value={q.name}>
                        {q.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Repère textuel de proximité *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Face Pharmacie Camp Guézo, 2ème ruelle après l'école"
                    value={formData.landmark}
                    onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                    className="w-full pl-9 rounded-xl border border-slate-300 p-3 text-sm text-slate-900 outline-none focus:border-client"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ÉTAPE 4 : BUDGET & VALIDATION */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Budget estimé et validation
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Indiquez votre budget indicatif en FCFA pour orienter les artisans.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Budget indicatif (FCFA)
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-300 px-3.5 py-2.5 bg-white max-w-xs">
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
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-xs">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    Récapitulatif de votre publication
                  </h4>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Métier :</span>
                    <span className="font-bold text-slate-900">{formData.trade}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Titre :</span>
                    <span className="font-semibold text-slate-900">{formData.title || "Non précisé"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Zone :</span>
                    <span className="font-semibold text-slate-900">
                      {formData.quarter || "Quartier"}, {formData.commune}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
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
                    Vos coordonnées restent protégées jusqu'à ce que vous validiez une proposition.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Boutons de navigation */}
          <div className="mt-8 pt-5 border-t border-slate-200 flex items-center justify-between gap-3">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 px-4 py-3 sm:py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition-all min-h-[46px]"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Précédent</span>
              </button>
            ) : (
              <div className="hidden sm:block" />
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={currentStep === 2 && !formData.title.trim()}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-client px-6 py-3 sm:py-2.5 text-xs sm:text-sm font-bold text-white shadow-soft hover:bg-client-hover active:scale-[0.98] disabled:opacity-50 transition-all min-h-[46px]"
              >
                <span>Continuer</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-6 py-3 sm:py-2.5 text-xs sm:text-sm font-bold text-white shadow-soft hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-60 transition-all min-h-[46px]"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Enregistrement...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Confirmer & Publier</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
