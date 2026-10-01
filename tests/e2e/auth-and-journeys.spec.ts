import { test, expect } from "@playwright/test";

test.describe("PROXIJOB - Audit E2E & Scénarios Réels", () => {
  test.beforeEach(async ({ context }) => {
    // Nettoyer les cookies avant chaque test pour garantir l'indépendance de session
    await context.clearCookies();
  });

  // =========================================================================
  // TEST 1 : PWA & Layout (Manifest, Métadonnées Mobiles, Absence de Styles IA)
  // =========================================================================
  test("Test 1 : PWA & Layout - Manifest, métadonnées et absence totale de styles IA", async ({
    page,
    request,
  }) => {
    // 1.1 Vérification directe du fichier manifeste PWA
    const manifestRes = await request.get("/manifest.webmanifest");
    expect(manifestRes.ok()).toBeTruthy();
    expect(manifestRes.status()).toBe(200);

    const manifest = await manifestRes.json();
    expect(manifest.name).toContain("ProxiJob");
    expect(manifest.short_name).toBe("ProxiJob");
    expect(manifest.display).toBe("standalone");
    expect(manifest.theme_color).toBe("#1E40AF");
    expect(manifest.background_color).toBe("#F8FAFC");
    expect(Array.isArray(manifest.icons)).toBeTruthy();
    expect(manifest.icons.length).toBeGreaterThanOrEqual(2);

    // 1.2 Vérification des balises métadonnées et viewport sur la page d'accueil
    await page.goto("/");
    await expect(page).toHaveTitle(/PROXIJOB/i);

    const viewportMeta = page.locator('meta[name="viewport"]');
    await expect(viewportMeta).toHaveAttribute(
      "content",
      /width=device-width/i
    );

    const themeColorMeta = page.locator('meta[name="theme-color"]');
    await expect(themeColorMeta).toHaveAttribute("content", "#1E40AF");

    // 1.3 Absence totale de bordures ou styles "IA" (glow, borders magiques, sparkle gradients)
    const elementsWithAiGlow = await page.locator(
      '[class*="glow"], [class*="sparkle"], [class*="magic"], [class*="ai-"]'
    ).count();
    expect(elementsWithAiGlow).toBe(0);
  });

  // =========================================================================
  // TEST 2 : Portail Connexion & Sécurité (Rôle Client -> /dashboard/client)
  // =========================================================================
  test("Test 2 : Portail Connexion & Sécurité - Authentification Client et redirection /dashboard/client", async ({
    page,
  }) => {
    await page.goto("/connexion");

    // Vérification des champs requis
    const identifierInput = page.locator('input[name="identifier"]');
    const passwordInput = page.locator('input[name="password"]');
    const submitBtn = page.locator('button[type="submit"]');

    await expect(identifierInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitBtn).toBeVisible();

    // Saisie des identifiants réels Neon du client
    await identifierInput.fill("koffi.mensah@email.bj");
    await passwordInput.fill("Client@ProxiJob2026!");

    // Soumission du formulaire
    await submitBtn.click();

    // Vérification stricte de la redirection vers le dashboard client
    await page.waitForURL("**/dashboard/client", { timeout: 15000, waitUntil: "domcontentloaded" });
    expect(page.url()).toContain("/dashboard/client");

    // Vérification de la présence des éléments de l'espace client
    await expect(
      page.getByRole("heading", { name: /Tableau de bord Client/i })
    ).toBeVisible({ timeout: 15000 });
    await expect(
      page.getByText(/Espace Particulier & Entreprise/i)
    ).toBeVisible();
  });

  // =========================================================================
  // TEST 3 : Redirection Rôle Jobeur (Rôle Jobeur -> /dashboard/jobeur)
  // =========================================================================
  test("Test 3 : Redirection Rôle Jobeur - Authentification Prestataire et redirection /dashboard/jobeur", async ({
    page,
  }) => {
    await page.goto("/connexion");

    const identifierInput = page.locator('input[name="identifier"]');
    const passwordInput = page.locator('input[name="password"]');
    const submitBtn = page.locator('button[type="submit"]');

    // Saisie des identifiants réels Neon du jobeur
    await identifierInput.fill("sebastien.dossou@email.bj");
    await passwordInput.fill("Jobber@ProxiJob2026!");

    // Soumission du formulaire
    await submitBtn.click();

    // Vérification stricte de la redirection vers le dashboard jobeur
    await page.waitForURL("**/dashboard/jobeur", { timeout: 15000, waitUntil: "domcontentloaded" });
    expect(page.url()).toContain("/dashboard/jobeur");

    // Vérification de la présence des éléments de l'espace artisan
    await expect(
      page.getByRole("heading", { name: /Tableau de bord Prestataire/i })
    ).toBeVisible({ timeout: 15000 });
    await expect(
      page.getByText(/Espace Artisan & Prestataire/i)
    ).toBeVisible();
  });

  // =========================================================================
  // TEST 4 : Parcours Mot de passe oublié
  // =========================================================================
  test("Test 4 : Mot de passe oublié - Soumission email et validation du token", async ({
    page,
  }) => {
    await page.goto("/mot-de-passe-oublie");

    await expect(
      page.getByRole("heading", { name: /Mot de passe oublié/i })
    ).toBeVisible();

    const identifierInput = page.locator('input[name="identifier"]');
    const submitBtn = page.locator('button[type="submit"]');

    // Soumission d'une adresse email enregistrée
    await identifierInput.fill("koffi.mensah@email.bj");
    await submitBtn.click();

    // Vérification de la transition vers l'étape 2 avec token validé
    await expect(
      page.getByText(/Jeton de sécurité validé/i)
    ).toBeVisible({ timeout: 8000 });

    await expect(
      page.getByRole("heading", { name: /Définir un nouveau mot de passe/i })
    ).toBeVisible();

    // Vérification des champs du nouveau mot de passe
    await expect(
      page.locator('input[placeholder="6 caractères minimum"]')
    ).toBeVisible();
  });

  // =========================================================================
  // TEST 5 : Annuaire Réel Neon (Jobeurs, Landmarks, Étoiles, ProxyTrust)
  // =========================================================================
  test("Test 5 : Annuaire Réel Neon - Chargement des vrais artisans, repères et badges", async ({
    page,
  }) => {
    // Écoute de l'API /api/jobeurs pour confirmer les données Neon réelles
    const responsePromise = page.waitForResponse(
      (resp) => resp.url().includes("/api/jobeurs") && resp.status() === 200
    );

    await page.goto("/jobeurs");
    await responsePromise;

    // Attente que le décompte des artisans soit affiché
    await expect(page.locator("text=/artisan/i").first()).toBeVisible({ timeout: 10000 });

    // Vérification de la présence des cartes d'artisans chargées depuis Neon
    const jobberCards = page.locator('div.group.relative[class*="rounded-2xl"]');
    await expect(jobberCards.first()).toBeVisible({ timeout: 10000 });
    const count = await jobberCards.count();
    expect(count).toBeGreaterThan(0);

    // Vérification de la présence de repères géographiques (landmarks béninois)
    const landmarkBadge = page.locator("text=Repère").first();
    await expect(landmarkBadge).toBeVisible();

    // Vérification de la présence des notes étoiles
    const stars = page.locator("svg.lucide-star").first();
    await expect(stars).toBeVisible();

    // Vérification des badges ProxyTrust sur la carte artisan
    const trustBadge = jobberCards.first().locator("text=ProxyTrust");
    await expect(trustBadge).toBeVisible();
  });

  // =========================================================================
  // TEST 6 : Wizard de Création de Demande
  // =========================================================================
  test("Test 6 : Création de Demande - Progression du wizard et publication", async ({
    page,
  }) => {
    await page.goto("/demandes/nouvelle");

    // Étape 1 : Choix du métier
    await expect(
      page.getByRole("heading", { name: /Quel type d'artisan recherchez-vous/i })
    ).toBeVisible();

    // Clic sur "Continuer" pour passer à l'étape 2
    const nextBtn = page.getByRole("button", { name: /Continuer/i });
    await nextBtn.click();

    // Étape 2 : Description du besoin
    await expect(
      page.getByRole("heading", { name: /Détaillez votre besoin/i })
    ).toBeVisible();

    const titleInput = page.locator('input[placeholder*="Ex : Fuite d\'eau"]');
    const descTextarea = page.locator("textarea");

    await titleInput.fill("Dépannage plomberie - Fuite robinet mitigeur");
    await descTextarea.fill(
      "Fuite d'eau persistante sous le mitigeur de la cuisine nécessitant une intervention rapide."
    );

    await nextBtn.click();

    // Étape 3 : Localisation avec repère textuel
    await expect(
      page.getByRole("heading", { name: /Où doit se dérouler la prestation/i })
    ).toBeVisible();

    const landmarkInput = page.locator('input[placeholder*="Ex: Face Pharmacie"]');
    await landmarkInput.fill("Face Église Sacré-Cœur d'Akpakpa");

    await nextBtn.click();

    // Étape 4 : Budget indicatif & validation finale
    await expect(
      page.getByRole("heading", { name: /Budget estimé et validation/i })
    ).toBeVisible();

    // Vérification du récapitulatif
    await expect(
      page.getByText("Dépannage plomberie - Fuite robinet mitigeur")
    ).toBeVisible();
    await expect(
      page.getByText("Face Église Sacré-Cœur d'Akpakpa")
    ).toBeVisible();

    // Soumission du formulaire
    const submitBtn = page.getByRole("button", { name: /Confirmer & Publier/i });
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    // Confirmation de l'enregistrement en base Neon
    await expect(
      page.getByText(/Demande publiée en base réelle/i)
    ).toBeVisible({ timeout: 15000 });
  });
});
