import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ProxiJob Bénin - Services & Artisans de Proximité",
    short_name: "ProxiJob",
    description:
      "Trouvez rapidement des artisans et techniciens qualifiés près de chez vous au Bénin.",
    start_url: "/",
    display: "standalone",
    background_color: "#F8FAFC",
    theme_color: "#1E40AF",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon-192x192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "any maskable" as any,
      },
      {
        src: "/icons/icon-512x512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any maskable" as any,
      },
    ],
  };
}
