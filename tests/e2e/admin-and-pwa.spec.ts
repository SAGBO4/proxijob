import { test, expect, devices } from "@playwright/test";

test.describe("PROXIJOB - Certification E2E Authentification, Absence Démo & PWA Mobile", () => {
  test.beforeEach(async ({ context }) => {
    // Nettoyage systématique des cookies et du stockage local avant chaque test
    await context.clearCookies();
  });

  // =========================================================================
  // TEST 1 : Authentification Administrateur Réelle & Redirection Stricte /admin
  // =========================================================================
  test("Test 1 : Authentification réelle Administrateur (admin@proxijob.bj) et redirection stricte vers /admin", async ({
    page,
  }) => {
    await page.goto("/connexion");
    await page.waitForLoadState("domcontentloaded");

    const identifierInput = page.locator('input[name="identifier"]');
    const passwordInput = page.locator('input[name="password"]');
    const submitBtn = page.locator('button[type="submit"]');

    await expect(identifierInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitBtn).toBeVisible();

    // Saisie des identifiants stricts de l'administrateur
    await identifierInput.fill("admin@proxijob.bj");
    await passwordInput.fill("Admin@ProxiJob2026!");

    await submitBtn.click();

    // Redirection stricte attendue vers /admin
    await page.waitForURL("**/admin", { timeout: 15000, waitUntil: "domcontentloaded" });
    expect(page.url()).toContain("/admin");

    // Vérification de la présence de la console d'administration et de conformité
    await expect(
      page.getByRole("heading", { name: /Console d'Administration & Modération/i })
    ).toBeVisible({ timeout: 10000 });

    await expect(
      page.getByText(/Supervision régalienne/i)
    ).toBeVisible();

    // Vérification stricte de l'absence du bloc d'erreur 403
    const forbiddenCount = await page.getByText(/HTTP 403 Forbidden/i).count();
    expect(forbiddenCount).toBe(0);
  });

  // =========================================================================
  // TEST 2 : Authentification Client Réelle & Redirection /dashboard/client
  // =========================================================================
  test("Test 2 : Authentification réelle Client (koffi.mensah@email.bj) et redirection vers /dashboard/client", async ({
    page,
  }) => {
    await page.goto("/connexion");
    await page.waitForLoadState("domcontentloaded");

    const identifierInput = page.locator('input[name="identifier"]');
    const passwordInput = page.locator('input[name="password"]');
    const submitBtn = page.locator('button[type="submit"]');

    await identifierInput.fill("koffi.mensah@email.bj");
    await passwordInput.fill("Client@ProxiJob2026!");

    await submitBtn.click();

    // Redirection stricte attendue vers /dashboard/client
    await page.waitForURL("**/dashboard/client", { timeout: 15000, waitUntil: "domcontentloaded" });
    expect(page.url()).toContain("/dashboard/client");

    await expect(
      page.getByRole("heading", { name: /Tableau de bord Client/i })
    ).toBeVisible({ timeout: 10000 });
  });

  // =========================================================================
  // TEST 3 : Authentification Jobeur Réelle & Redirection /dashboard/jobeur
  // =========================================================================
  test("Test 3 : Authentification réelle Jobeur (sebastien.dossou@email.bj) et redirection vers /dashboard/jobeur", async ({
    page,
  }) => {
    await page.goto("/connexion");
    await page.waitForLoadState("domcontentloaded");

    const identifierInput = page.locator('input[name="identifier"]');
    const passwordInput = page.locator('input[name="password"]');
    const submitBtn = page.locator('button[type="submit"]');

    await identifierInput.fill("sebastien.dossou@email.bj");
    await passwordInput.fill("Jobber@ProxiJob2026!");

    await submitBtn.click();

    // Redirection stricte attendue vers /dashboard/jobeur
    await page.waitForURL("**/dashboard/jobeur", { timeout: 15000, waitUntil: "domcontentloaded" });
    expect(page.url()).toContain("/dashboard/jobeur");

    await expect(
      page.getByRole("heading", { name: /Tableau de bord Prestataire/i })
    ).toBeVisible({ timeout: 10000 });
  });

  // =========================================================================
  // TEST 4 : Absence Totale de Mention ou Bouton de "Compte de Test" ou "Démo"
  // =========================================================================
  test("Test 4 : Assertion formelle d'absence de blocs ou boutons 'Comptes de test' / 'Démo' sur /connexion", async ({
    page,
  }) => {
    await page.goto("/connexion");
    await page.waitForLoadState("domcontentloaded");

    // 1. Vérification de l'absence de tout texte "compte de test" ou "démo"
    const testAccountsMention = await page
      .locator("text=/comptes?\\s+de\\s+test/i")
      .count();
    expect(testAccountsMention).toBe(0);

    const demoMention = await page
      .locator("text=/\\bdémo\\b|\\bdemo\\b/i")
      .count();
    expect(demoMention).toBe(0);

    // 2. Vérification de l'absence de tout bouton de pré-remplissage ou d'auto-remplissage
    const autoFillButtons = await page
      .locator("button:has-text('Remplir'), button:has-text('Auto'), button:has-text('Test')")
      .count();
    expect(autoFillButtons).toBe(0);

    // 3. Vérification des seuls éléments interactifs légitimes : submit et mot de passe
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toContainText(/Se connecter/i);

    // 4. Vérification sur la page publique d'accueil qu'aucune mention intrusive de compte de test n'apparaît
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    const homeTestAccountsCount = await page
      .locator("text=/comptes?\\s+de\\s+test/i")
      .count();
    expect(homeTestAccountsCount).toBe(0);
  });

  // =========================================================================
  // TEST 5 : Simulation Android - Bannière PWA avec Bouton "Installer maintenant"
  // =========================================================================
  test("Test 5 : Simulation smartphone Android - Affichage bannière PWA et bouton 'Installer maintenant'", async ({
    browser,
    baseURL,
  }) => {
    const androidContext = await browser.newContext({
      baseURL,
      ...devices["Pixel 7"],
      userAgent:
        "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
    });
    const page = await androidContext.newPage();

    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // Attente de l'apparition de la bannière PWA adaptée aux smartphones Android
    const pwaBanner = page.locator('aside[aria-label="Installation de l\'application ProxiJob"]');
    await expect(pwaBanner).toBeVisible({ timeout: 10000 });

    // Vérification du titre de l'application
    await expect(page.getByText(/Installer ProxiJob Bénin/i)).toBeVisible();

    // Vérification de la présence du bouton d'action "Installer maintenant"
    const installBtn = page.getByRole("button", { name: /Installer maintenant/i });
    await expect(installBtn).toBeVisible();
    await expect(installBtn).toBeEnabled();

    // Vérification du bouton "Plus tard"
    const dismissBtn = page.getByRole("button", { name: /Plus tard/i });
    await expect(dismissBtn).toBeVisible();

    await androidContext.close();
  });

  // =========================================================================
  // TEST 6 : Simulation iPhone Safari - Guide d'Installation Pas-à-Pas iOS
  // =========================================================================
  test("Test 6 : Simulation iPhone Safari - Affichage du guide d'installation PWA spécifique à iOS (Partager, Sur l'écran d'accueil, Ajouter)", async ({
    browser,
    baseURL,
  }) => {
    const iosContext = await browser.newContext({
      baseURL,
      ...devices["iPhone 14"],
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    });
    const page = await iosContext.newPage();

    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // Attente de l'apparition de la bannière PWA iOS Safari
    const pwaBanner = page.locator('aside[aria-label="Installation de l\'application ProxiJob"]');
    await expect(pwaBanner).toBeVisible({ timeout: 10000 });

    // Vérification de l'intitulé du guide d'installation iOS
    await expect(
      page.getByText(/Pour installer sur votre iPhone ou iPad/i)
    ).toBeVisible();

    // Étape 1 : Partager dans Safari
    await expect(page.getByText(/Partager/i)).toBeVisible();
    await expect(page.getByText(/dans Safari/i)).toBeVisible();

    // Étape 2 : Sur l'écran d'accueil
    await expect(page.getByText(/Sur l'écran d'accueil/i)).toBeVisible();

    // Étape 3 : Ajouter
    await expect(page.getByText(/Ajouter/i)).toBeVisible();

    // Bouton de validation de lecture "C'est compris !"
    const ackBtn = page.getByRole("button", { name: /C'est compris !/i });
    await expect(ackBtn).toBeVisible();

    // Fermeture de la bannière au clic
    await ackBtn.click();
    await expect(pwaBanner).not.toBeVisible();

    await iosContext.close();
  });
});
