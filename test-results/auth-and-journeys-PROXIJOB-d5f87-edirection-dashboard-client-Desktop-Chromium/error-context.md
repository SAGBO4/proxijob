# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth-and-journeys.spec.ts >> PROXIJOB - Audit E2E & Scénarios Réels >> Test 2 : Portail Connexion & Sécurité - Authentification Client et redirection /dashboard/client
- Location: tests/e2e/auth-and-journeys.spec.ts:53:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('input[name="identifier"]')
Expected: visible
Timeout: 8000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('input[name="identifier"]') with timeout 8000ms
  - waiting for locator('input[name="identifier"]')

```

```yaml
- banner:
  - link "PROXIJOBBJ Services & Proximité":
    - /url: /
    - img
    - text: PROXIJOBBJ Services & Proximité
  - navigation:
    - link "Trouver un Jobeur":
      - /url: /jobeurs
    - link "Demandes en cours":
      - /url: /demandes
    - link "Comment ça marche":
      - /url: /#comment-ca-marche
  - link "Connexion":
    - /url: /connexion
    - img
    - text: Connexion
  - link "Inscription":
    - /url: /inscription
    - img
    - text: Inscription
  - button "Menu":
    - img
- main
- contentinfo:
  - img
  - heading "Label ProxyTrust Bénin" [level=4]
  - paragraph: Identité vérifiée via CIP / CNI (ANIP) et compétences contrôlées pour des interventions en toute sécurité.
  - img
  - heading "Zéro Carte — Économie de Data" [level=4]
  - paragraph: Localisation textuelle par communes et repères réels sans charger de carte lourde (Google Maps / Mapbox).
  - img
  - heading "Messagerie Sécurisée Pré-Accord" [level=4]
  - paragraph: Masquage algorithmique automatique des coordonnées directes jusqu'à la validation conjointe du devis.
  - link "PROXIJOBBJ":
    - /url: /
    - img
    - text: PROXIJOBBJ
  - paragraph: La plateforme de référence pour connecter rapidement ménages et entreprises avec des artisans locaux qualifiés à Cotonou, Calavi, Porto-Novo et partout au Bénin.
  - text: Fait avec passion au Bénin
  - img
  - heading "Zones de Proximité" [level=5]
  - list:
    - listitem:
      - link "Artisans à Cotonou (Haie Vive, Cadjèhoun, Akpakpa...)":
        - /url: /jobeurs?commune=Cotonou
    - listitem:
      - link "Artisans à Abomey-Calavi (Arconville, Kpota, Godomey...)":
        - /url: /jobeurs?commune=Abomey-Calavi
    - listitem:
      - link "Artisans à Porto-Novo (Ouando, Tokpota, Avakpa...)":
        - /url: /jobeurs?commune=Porto-Novo
    - listitem: Parakou & Bohicon (Prochainement)
  - heading "Métiers Populaires" [level=5]
  - list:
    - listitem:
      - link "Plomberie & Débouchage":
        - /url: /jobeurs?search=Plombier
    - listitem:
      - link "Électricité bâtiment & Solaire":
        - /url: /jobeurs?search=Électricien
    - listitem:
      - link "Climatisation & Froid Inverter":
        - /url: /jobeurs?search=Climatisation
    - listitem:
      - link "Couture Bazin & Kanvo":
        - /url: /jobeurs?search=Couture
    - listitem:
      - link "Mécanique auto & Diagnostic OBD2":
        - /url: /jobeurs?search=Mécanicien
  - heading "Légal & Réglementation" [level=5]
  - list:
    - listitem: Conformité Code du Numérique du Bénin (Loi n° 2017-20)
    - listitem: Protection des Données Personnelles (APDP Bénin)
    - listitem:
      - link "Charte de Confiance & Réputation":
        - /url: /#comment-ca-marche
    - listitem:
      - link "Portail Modération & Sécurité":
        - /url: /admin
        - text: Portail Modération & Sécurité
        - img
  - paragraph: © 2026 PROXIJOB Bénin. Tous droits réservés.
  - paragraph: Plateforme conforme Soft UI & TDR contractuels V1 — Zéro carte interactive lourde.
- navigation:
  - link "Accueil":
    - /url: /
    - img
    - text: Accueil
  - link "Jobeurs":
    - /url: /jobeurs
    - img
    - text: Jobeurs
  - link "Poster":
    - /url: /demandes/nouvelle
    - img
    - text: Poster
  - link "Demandes":
    - /url: /demandes
    - img
    - text: Demandes
  - link "Mon Espace":
    - /url: /dashboard/client
    - img
    - text: Mon Espace
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | 
  3   | test.describe("PROXIJOB - Audit E2E & Scénarios Réels", () => {
  4   |   test.beforeEach(async ({ context }) => {
  5   |     // Nettoyer les cookies avant chaque test pour garantir l'indépendance de session
  6   |     await context.clearCookies();
  7   |   });
  8   | 
  9   |   // =========================================================================
  10  |   // TEST 1 : PWA & Layout (Manifest, Métadonnées Mobiles, Absence de Styles IA)
  11  |   // =========================================================================
  12  |   test("Test 1 : PWA & Layout - Manifest, métadonnées et absence totale de styles IA", async ({
  13  |     page,
  14  |     request,
  15  |   }) => {
  16  |     // 1.1 Vérification directe du fichier manifeste PWA
  17  |     const manifestRes = await request.get("/manifest.webmanifest");
  18  |     expect(manifestRes.ok()).toBeTruthy();
  19  |     expect(manifestRes.status()).toBe(200);
  20  | 
  21  |     const manifest = await manifestRes.json();
  22  |     expect(manifest.name).toContain("ProxiJob");
  23  |     expect(manifest.short_name).toBe("ProxiJob");
  24  |     expect(manifest.display).toBe("standalone");
  25  |     expect(manifest.theme_color).toBe("#1E40AF");
  26  |     expect(manifest.background_color).toBe("#F8FAFC");
  27  |     expect(Array.isArray(manifest.icons)).toBeTruthy();
  28  |     expect(manifest.icons.length).toBeGreaterThanOrEqual(2);
  29  | 
  30  |     // 1.2 Vérification des balises métadonnées et viewport sur la page d'accueil
  31  |     await page.goto("/");
  32  |     await expect(page).toHaveTitle(/PROXIJOB/i);
  33  | 
  34  |     const viewportMeta = page.locator('meta[name="viewport"]');
  35  |     await expect(viewportMeta).toHaveAttribute(
  36  |       "content",
  37  |       /width=device-width/i
  38  |     );
  39  | 
  40  |     const themeColorMeta = page.locator('meta[name="theme-color"]');
  41  |     await expect(themeColorMeta).toHaveAttribute("content", "#1E40AF");
  42  | 
  43  |     // 1.3 Absence totale de bordures ou styles "IA" (glow, borders magiques, sparkle gradients)
  44  |     const elementsWithAiGlow = await page.locator(
  45  |       '[class*="glow"], [class*="sparkle"], [class*="magic"], [class*="ai-"]'
  46  |     ).count();
  47  |     expect(elementsWithAiGlow).toBe(0);
  48  |   });
  49  | 
  50  |   // =========================================================================
  51  |   // TEST 2 : Portail Connexion & Sécurité (Rôle Client -> /dashboard/client)
  52  |   // =========================================================================
  53  |   test("Test 2 : Portail Connexion & Sécurité - Authentification Client et redirection /dashboard/client", async ({
  54  |     page,
  55  |   }) => {
  56  |     await page.goto("/connexion");
  57  | 
  58  |     // Vérification des champs requis
  59  |     const identifierInput = page.locator('input[name="identifier"]');
  60  |     const passwordInput = page.locator('input[name="password"]');
  61  |     const submitBtn = page.locator('button[type="submit"]');
  62  | 
> 63  |     await expect(identifierInput).toBeVisible();
      |                                   ^ Error: expect(locator).toBeVisible() failed
  64  |     await expect(passwordInput).toBeVisible();
  65  |     await expect(submitBtn).toBeVisible();
  66  | 
  67  |     // Saisie des identifiants réels Neon du client de démo
  68  |     await identifierInput.fill("koffi.mensah@email.bj");
  69  |     await passwordInput.fill("ProxiJob@2026");
  70  | 
  71  |     // Soumission du formulaire
  72  |     await submitBtn.click();
  73  | 
  74  |     // Vérification stricte de la redirection vers le dashboard client
  75  |     await page.waitForURL("**/dashboard/client", { timeout: 10000 });
  76  |     expect(page.url()).toContain("/dashboard/client");
  77  | 
  78  |     // Vérification de la présence des éléments de l'espace client
  79  |     await expect(
  80  |       page.getByRole("heading", { name: /Tableau de bord Client/i })
  81  |     ).toBeVisible();
  82  |     await expect(
  83  |       page.getByText(/Espace Particulier & Entreprise/i)
  84  |     ).toBeVisible();
  85  |   });
  86  | 
  87  |   // =========================================================================
  88  |   // TEST 3 : Redirection Rôle Jobeur (Rôle Jobeur -> /dashboard/jobeur)
  89  |   // =========================================================================
  90  |   test("Test 3 : Redirection Rôle Jobeur - Authentification Prestataire et redirection /dashboard/jobeur", async ({
  91  |     page,
  92  |   }) => {
  93  |     await page.goto("/connexion");
  94  | 
  95  |     const identifierInput = page.locator('input[name="identifier"]');
  96  |     const passwordInput = page.locator('input[name="password"]');
  97  |     const submitBtn = page.locator('button[type="submit"]');
  98  | 
  99  |     // Saisie des identifiants réels Neon du jobeur de démo
  100 |     await identifierInput.fill("sebastien.dossou@email.bj");
  101 |     await passwordInput.fill("ProxiJob@2026");
  102 | 
  103 |     // Soumission du formulaire
  104 |     await submitBtn.click();
  105 | 
  106 |     // Vérification stricte de la redirection vers le dashboard jobeur
  107 |     await page.waitForURL("**/dashboard/jobeur", { timeout: 10000 });
  108 |     expect(page.url()).toContain("/dashboard/jobeur");
  109 | 
  110 |     // Vérification de la présence des éléments de l'espace artisan
  111 |     await expect(
  112 |       page.getByRole("heading", { name: /Tableau de bord Prestataire/i })
  113 |     ).toBeVisible();
  114 |     await expect(
  115 |       page.getByText(/Espace Artisan & Prestataire/i)
  116 |     ).toBeVisible();
  117 |   });
  118 | 
  119 |   // =========================================================================
  120 |   // TEST 4 : Parcours Mot de passe oublié
  121 |   // =========================================================================
  122 |   test("Test 4 : Mot de passe oublié - Soumission email et validation du token", async ({
  123 |     page,
  124 |   }) => {
  125 |     await page.goto("/mot-de-passe-oublie");
  126 | 
  127 |     await expect(
  128 |       page.getByRole("heading", { name: /Mot de passe oublié/i })
  129 |     ).toBeVisible();
  130 | 
  131 |     const identifierInput = page.locator('input[name="identifier"]');
  132 |     const submitBtn = page.locator('button[type="submit"]');
  133 | 
  134 |     // Soumission d'une adresse email enregistrée
  135 |     await identifierInput.fill("koffi.mensah@email.bj");
  136 |     await submitBtn.click();
  137 | 
  138 |     // Vérification de la transition vers l'étape 2 avec token validé
  139 |     await expect(
  140 |       page.getByText(/Jeton de sécurité validé/i)
  141 |     ).toBeVisible({ timeout: 8000 });
  142 | 
  143 |     await expect(
  144 |       page.getByRole("heading", { name: /Définir un nouveau mot de passe/i })
  145 |     ).toBeVisible();
  146 | 
  147 |     // Vérification des champs du nouveau mot de passe
  148 |     await expect(
  149 |       page.locator('input[placeholder="6 caractères minimum"]')
  150 |     ).toBeVisible();
  151 |   });
  152 | 
  153 |   // =========================================================================
  154 |   // TEST 5 : Annuaire Réel Neon (Jobeurs, Landmarks, Étoiles, ProxyTrust)
  155 |   // =========================================================================
  156 |   test("Test 5 : Annuaire Réel Neon - Chargement des vrais artisans, repères et badges", async ({
  157 |     page,
  158 |   }) => {
  159 |     // Écoute de l'API /api/jobeurs pour confirmer les données Neon réelles
  160 |     const responsePromise = page.waitForResponse(
  161 |       (resp) => resp.url().includes("/api/jobeurs") && resp.status() === 200
  162 |     );
  163 | 
```