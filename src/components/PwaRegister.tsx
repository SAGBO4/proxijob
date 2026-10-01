"use client";

import React, { useEffect, useState } from "react";
import { Download, Share, PlusSquare, X, Smartphone, CheckCircle } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaRegister() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Enregistrement du Service Worker
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("ProxiJob PWA ServiceWorker actif:", registration.scope);
          })
          .catch((err) => {
            console.warn("Erreur ServiceWorker:", err);
          });
      });
    }

    // 2. Détection du mode autonome (déjà installé)
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia("(display-mode: standalone)").matches ||
        (navigator as unknown as { standalone?: boolean }).standalone === true ||
        document.referrer.includes("android-app://");
      setIsStandalone(Boolean(isStandaloneMode));
      return Boolean(isStandaloneMode);
    };

    if (checkStandalone()) {
      return;
    }

    // 3. Détection iOS Safari
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isIosDevice);

    // Vérifier si l'utilisateur a déjà fermé la bannière récemment (stockage session/local)
    const wasDismissed = sessionStorage.getItem("proxijob_pwa_dismissed");

    // 4. Écoute de l'événement natif Android / Chromium (beforeinstallprompt)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (!wasDismissed) {
        // Afficher avec un léger délai pour ne pas agresser au premier millième de seconde
        setTimeout(() => setShowPrompt(true), 1500);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 5. Sur iOS (Safari ne déclenche pas beforeinstallprompt)
    if (isIosDevice && !wasDismissed) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 2500);
      return () => clearTimeout(timer);
    }

    // 6. Écoute de l'installation réussie
    window.addEventListener("appinstalled", () => {
      setInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setInstalled(true);
      }
      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (err) {
      console.error("Erreur lors de l'installation PWA:", err);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem("proxijob_pwa_dismissed", "true");
  };

  // Ne rien afficher si l'application est déjà lancée en mode PWA autonome
  if (isStandalone || !showPrompt) {
    return null;
  }

  return (
    <aside
      aria-label="Installation de l'application ProxiJob"
      className="fixed z-50 bottom-20 md:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="bg-white border-2 border-client/30 rounded-2xl p-4 sm:p-5 shadow-2xl shadow-blue-950/15 backdrop-blur-md">
        {/* Header bannière */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-client text-white shadow-soft shrink-0">
              <Smartphone className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base text-slate-900">
                  Installer ProxiJob Bénin
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-client">
                  PWA
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Application mobile légère & accès rapide
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Corps spécifique selon l'OS (iOS vs Android / Chrome) */}
        {isIOS ? (
          // Guide visuel pas-à-pas pour Safari iOS
          <div className="mt-3.5 pt-3 border-t border-slate-100 text-xs text-slate-700 space-y-2">
            <p className="font-semibold text-slate-900">
              Pour installer sur votre iPhone ou iPad :
            </p>
            <div className="bg-slate-50 rounded-xl p-3 space-y-2 border border-slate-200">
              <div className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-client text-white font-bold text-[10px]">
                  1
                </span>
                <span>
                  Appuyez sur l'icône{" "}
                  <strong className="inline-flex items-center gap-1 text-client font-bold">
                    Partager <Share className="h-3.5 w-3.5 inline" />
                  </strong>{" "}
                  dans Safari
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-client text-white font-bold text-[10px]">
                  2
                </span>
                <span>
                  Faites défiler et touchez{" "}
                  <strong className="inline-flex items-center gap-1 text-slate-900 font-bold">
                    Sur l'écran d'accueil <PlusSquare className="h-3.5 w-3.5 inline text-slate-600" />
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-client text-white font-bold text-[10px]">
                  3
                </span>
                <span>
                  Touchez <strong className="text-client font-bold">Ajouter</strong> en haut à droite
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleDismiss}
                className="w-full py-2 px-3 rounded-xl bg-client text-white text-xs font-bold shadow-soft hover:bg-client-hover active:scale-95 transition-all text-center"
              >
                C'est compris !
              </button>
            </div>
          </div>
        ) : (
          // Bouton direct pour Android & Chromium
          <div className="mt-3.5 pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              Installez ProxiJob sur votre smartphone pour consulter vos demandes et recevoir vos notifications même sans bonne connexion.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleInstallClick}
                disabled={!deferredPrompt && !installed}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl bg-client hover:bg-client-hover text-white text-xs sm:text-sm font-bold shadow-soft active:scale-95 transition-all disabled:opacity-50"
              >
                {installed ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Application installée</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>Installer maintenant</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                className="py-2.5 px-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors"
              >
                Plus tard
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
