import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

async function main() {
  console.log("🎬 Démarrage du tournage vidéo de présentation Mobile First PROXIJOB...");
  const tempDir = path.resolve("./public/videos/temp");
  const finalDir = path.resolve("./public/videos");
  fs.mkdirSync(tempDir, { recursive: true });
  fs.mkdirSync(finalDir, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  // Profil Mobile First réaliste (iPhone 14 / Safari)
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    recordVideo: {
      dir: tempDir,
      size: { width: 390, height: 844 },
    },
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
  });

  const page = await context.newPage();
  const baseUrl = process.env.BASE_URL || "https://proxijob-taupe.vercel.app";
  console.log(`🌐 Connexion sur l'application cible : ${baseUrl}`);

  try {
    // 1. Landing Page Mobile (Hero, Réassurance, Recherche textuelle sans carte)
    console.log("📱 Scène 1 : Découverte de la Landing Page Mobile First...");
    await page.goto(`${baseUrl}/`, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(2000);

    // Défilement doux sur la proposition de valeur et les 3 piliers
    await page.evaluate(() => window.scrollBy({ top: 350, behavior: "smooth" }));
    await page.waitForTimeout(1500);

    // Zoom sur la recherche de proximité
    await page.evaluate(() => window.scrollBy({ top: 350, behavior: "smooth" }));
    await page.waitForTimeout(1500);

    // Défilement sur les métiers populaires
    await page.evaluate(() => window.scrollBy({ top: 400, behavior: "smooth" }));
    await page.waitForTimeout(1500);

    // Défilement sur la section comment ça marche et réassurance
    await page.evaluate(() => window.scrollBy({ top: 500, behavior: "smooth" }));
    await page.waitForTimeout(1500);

    // Retour en haut
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
    await page.waitForTimeout(1000);

    // 2. Annuaire des Jobeurs (/jobeurs)
    console.log("🔍 Scène 2 : Navigation dans l'Annuaire & Filtres de Proximité sans carte...");
    await page.goto(`${baseUrl}/jobeurs`, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(2000);

    // Défilement sur les cartes d'artisans béninois avec badges ProxyTrust et tarifs FCFA
    await page.evaluate(() => window.scrollBy({ top: 400, behavior: "smooth" }));
    await page.waitForTimeout(1800);
    await page.evaluate(() => window.scrollBy({ top: 400, behavior: "smooth" }));
    await page.waitForTimeout(1800);

    // 3. Fiche détaillée d'un artisan (/jobeurs/job_01)
    console.log("🛠️ Scène 3 : Consultation de la Fiche Profil & Portfolio Avant / Après...");
    await page.goto(`${baseUrl}/jobeurs/job_01`, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(2000);

    // Défilement sur les coordonnées protégées et repère géographique (Landmark)
    await page.evaluate(() => window.scrollBy({ top: 350, behavior: "smooth" }));
    await page.waitForTimeout(1500);

    // 4. Bourse locale des Demandes (/demandes)
    console.log("📋 Scène 4 : Bourse des Demandes de Services Locales...");
    await page.goto(`${baseUrl}/demandes`, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollBy({ top: 350, behavior: "smooth" }));
    await page.waitForTimeout(1500);

    // 5. Wizard de Demande de Service (/demandes/nouvelle)
    console.log("✍️ Scène 5 : Wizard ergonomique de publication en 4 étapes (<90s)...");
    await page.goto(`${baseUrl}/demandes/nouvelle`, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollBy({ top: 250, behavior: "smooth" }));
    await page.waitForTimeout(1500);

    // 6. Portail de Connexion Professionnel (/connexion)
    console.log("🔐 Scène 6 : Portail de Connexion avec redirection dynamique par rôle...");
    await page.goto(`${baseUrl}/connexion`, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(2000);

    // 7. Portail d'Inscription (/inscription)
    console.log("👤 Scène 7 : Portail d'Inscription sans friction (Client vs Jobeur)...");
    await page.goto(`${baseUrl}/inscription`, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(2000);

    // Clôture triomphale sur la page d'accueil
    console.log("🏁 Scène Finale : Retour sur l'expérience d'accueil mobile...");
    await page.goto(`${baseUrl}/`, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(2000);

  } catch (error) {
    console.error("Erreur durant l'enregistrement :", error);
  } finally {
    await page.close();
    await context.close();
    await browser.close();
  }

  // Localisation du fichier vidéo enregistré
  const videoFiles = fs.readdirSync(tempDir).filter((f) => f.endsWith(".webm"));
  if (videoFiles.length > 0) {
    const rawVideo = path.join(tempDir, videoFiles[0]);
    const finalWebm = path.join(finalDir, "proxijob-mobile-presentation.webm");
    const finalMp4 = path.join(finalDir, "proxijob-mobile-presentation.mp4");

    fs.copyFileSync(rawVideo, finalWebm);
    console.log(`✅ Vidéo WebM prête : ${finalWebm}`);

    // Conversion MP4 haute qualité via ffmpeg
    try {
      console.log("🎞️ Encodage MP4 optimisé pour appareils mobiles...");
      execSync(`ffmpeg -y -i "${finalWebm}" -c:v libx264 -pix_fmt yuv420p -movflags faststart "${finalMp4}"`, {
        stdio: "inherit",
      });
      console.log(`🎉 Vidéo MP4 finale générée avec succès : ${finalMp4}`);
    } catch (e) {
      console.warn("Notice: Encodage ffmpeg optionnel terminé.", e.message);
    }
  } else {
    console.warn("Aucun fichier vidéo n'a été capturé.");
  }
}

main();
