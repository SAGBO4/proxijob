import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

async function runBragVideo() {
  console.log("🚀 [BRAG] Lancement du tournage vidéo Mobile First pour PROXIJOB...");
  const workDir = path.resolve("./brag-output/work");
  const outputDir = path.resolve("./brag-output");
  const publicVideoDir = path.resolve("./public/videos");

  fs.mkdirSync(workDir, { recursive: true });
  fs.mkdirSync(outputDir, { recursive: true });
  fs.mkdirSync(publicVideoDir, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  // Profil Mobile First standard (390 x 844, échelle 2x pour un rendu net)
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    recordVideo: {
      dir: workDir,
      size: { width: 390, height: 844 },
    },
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
  });

  const page = await context.newPage();
  const baseUrl = "https://proxijob-taupe.vercel.app";

  try {
    // SCÈNE 1 : Hook & Accueil Mobile (0s à 5s)
    console.log("🎬 Scène 1 : Accueil Mobile & Proposition de Valeur...");
    await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);

    // Défilement doux montrant la double entrée (Trouver un pro / Proposer mes services)
    await page.evaluate(() => window.scrollBy({ top: 320, behavior: "smooth" }));
    await page.waitForTimeout(1500);

    // Zoom sur les catégories populaires (Plomberie, Climatisation, Couture...)
    await page.evaluate(() => window.scrollBy({ top: 400, behavior: "smooth" }));
    await page.waitForTimeout(1500);

    // SCÈNE 2 : Annuaire des Jobeurs & Proximité sans carte (5s à 10s)
    console.log("🎬 Scène 2 : Annuaire des Artisans & Filtres de Proximité...");
    await page.goto(`${baseUrl}/jobeurs`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);

    // Défilement sur les profils d'artisans réels avec badges de confiance et tarifs FCFA
    await page.evaluate(() => window.scrollBy({ top: 380, behavior: "smooth" }));
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.scrollBy({ top: 380, behavior: "smooth" }));
    await page.waitForTimeout(1500);

    // SCÈNE 3 : Bourse des Demandes Locales (10s à 14s)
    console.log("🎬 Scène 3 : Bourse des Demandes avec badges Urgence...");
    await page.goto(`${baseUrl}/demandes`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.scrollBy({ top: 300, behavior: "smooth" }));
    await page.waitForTimeout(1500);

    // SCÈNE 4 : Publication Express d'une Demande en 4 étapes (14s à 18s)
    console.log("🎬 Scène 4 : Wizard de Publication en 4 étapes...");
    await page.goto(`${baseUrl}/demandes/nouvelle`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.scrollBy({ top: 250, behavior: "smooth" }));
    await page.waitForTimeout(1500);

    // SCÈNE 5 : Portail d'Authentification Sobre & Réel (18s à 22s)
    console.log("🎬 Scène 5 : Portail de Connexion avec redirection dynamique...");
    await page.goto(`${baseUrl}/connexion`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);

    // Navigation vers Inscription
    console.log("🎬 Scène 6 : Portail d'Inscription Client / Jobeur...");
    await page.goto(`${baseUrl}/inscription`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.scrollBy({ top: 250, behavior: "smooth" }));
    await page.waitForTimeout(1500);

    // SCÈNE 7 : Clôture & PWA (22s à 26s)
    console.log("🎬 Scène 7 : Retour sur l'Accueil Mobile & Clôture...");
    await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);
  } catch (error) {
    console.error("Erreur durant la capture:", error);
  } finally {
    await page.close();
    await context.close();
    await browser.close();
  }

  // Récupération de la vidéo brute enregistrée
  const files = fs.readdirSync(workDir).filter((f) => f.endsWith(".webm"));
  if (files.length > 0) {
    const rawWebm = path.join(workDir, files[0]);
    const finalMp4 = path.join(outputDir, "brag.mp4");
    const publicMp4 = path.join(publicVideoDir, "brag.mp4");
    const posterJpg = path.join(outputDir, "brag.jpg");
    const publicJpg = path.join(publicVideoDir, "brag.jpg");

    console.log("🎞️ Encodage MP4 optimisé pour appareils mobiles et réseaux sociaux...");
    execSync(
      `ffmpeg -y -i "${rawWebm}" -c:v libx264 -pix_fmt yuv420p -profile:v high -level 4.0 -movflags faststart "${finalMp4}"`,
      { stdio: "inherit" }
    );

    // Copie pour le répertoire public
    fs.copyFileSync(finalMp4, publicMp4);

    // Extraction du poster (image de couverture nette au tiers de la vidéo)
    console.log("📸 Extraction du poster de couverture (brag.jpg)...");
    execSync(`ffmpeg -y -ss 00:00:03 -i "${finalMp4}" -vframes 1 -q:v 2 "${posterJpg}"`, {
      stdio: "inherit",
    });
    fs.copyFileSync(posterJpg, publicJpg);

    console.log("🎉 [BRAG] Vidéo de présentation Mobile First générée avec succès !");
    console.log(`📁 Fichier vidéo : ${finalMp4}`);
    console.log(`🖼️ Poster : ${posterJpg}`);
  } else {
    console.error("Aucun flux vidéo n'a été produit.");
  }
}

runBragVideo();
