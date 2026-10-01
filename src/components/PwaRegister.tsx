"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("ProxiJob PWA ServiceWorker enregistré:", registration.scope);
          })
          .catch((error) => {
            console.warn("Échec d'enregistrement ServiceWorker:", error);
          });
      });
    }
  }, []);

  return null;
}
