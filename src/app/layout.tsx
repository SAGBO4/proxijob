import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PROXIJOB — Artisans & Services Locaux de Confiance au Bénin",
  description:
    "Trouvez rapidement des artisans et techniciens qualifiés près de chez vous à Cotonou, Calavi, Porto-Novo et partout au Bénin sans carte interactive lourde.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={jakarta.variable}>
      <body className="min-h-screen font-sans bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
