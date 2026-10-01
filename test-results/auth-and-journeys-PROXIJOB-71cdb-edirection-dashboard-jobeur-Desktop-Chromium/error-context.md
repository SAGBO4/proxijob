# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth-and-journeys.spec.ts >> PROXIJOB - Audit E2E & Scénarios Réels >> Test 3 : Redirection Rôle Jobeur - Authentification Prestataire et redirection /dashboard/jobeur
- Location: tests/e2e/auth-and-journeys.spec.ts:90:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[name="identifier"]')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - generic [ref=e4]:
        - link "PROXIJOBBJ Services & Proximité" [ref=e5] [cursor=pointer]:
          - /url: /
          - generic [ref=e9]:
            - generic [ref=e10]: PROXIJOBBJ
            - text: Services & Proximité
        - navigation [ref=e11]:
          - link "Trouver un Jobeur" [ref=e12] [cursor=pointer]:
            - /url: /jobeurs
          - link "Demandes en cours" [ref=e13] [cursor=pointer]:
            - /url: /demandes
          - link "Comment ça marche" [ref=e14] [cursor=pointer]:
            - /url: /#comment-ca-marche
      - generic [ref=e15]:
        - link "Connexion" [ref=e16] [cursor=pointer]:
          - /url: /connexion
        - link "Inscription" [ref=e20] [cursor=pointer]:
          - /url: /inscription
        - button "Menu" [ref=e24]
  - main
  - contentinfo [ref=e26]:
    - generic [ref=e29]:
      - generic [ref=e35]:
        - heading "Label ProxyTrust Bénin" [level=4] [ref=e36]
        - paragraph [ref=e37]: Identité vérifiée via CIP / CNI (ANIP) et compétences contrôlées pour des interventions en toute sécurité.
      - generic [ref=e43]:
        - heading "Zéro Carte — Économie de Data" [level=4] [ref=e44]
        - paragraph [ref=e45]: Localisation textuelle par communes et repères réels sans charger de carte lourde (Google Maps / Mapbox).
      - generic [ref=e51]:
        - heading "Messagerie Sécurisée Pré-Accord" [level=4] [ref=e52]
        - paragraph [ref=e53]: Masquage algorithmique automatique des coordonnées directes jusqu'à la validation conjointe du devis.
    - generic [ref=e54]:
      - generic [ref=e55]:
        - generic [ref=e56]:
          - link "PROXIJOBBJ" [ref=e57] [cursor=pointer]:
            - /url: /
          - paragraph [ref=e62]: La plateforme de référence pour connecter rapidement ménages et entreprises avec des artisans locaux qualifiés à Cotonou, Calavi, Porto-Novo et partout au Bénin.
          - generic [ref=e63]: Fait avec passion au Bénin
        - generic [ref=e66]:
          - heading "Zones de Proximité" [level=5] [ref=e67]
          - list [ref=e68]:
            - listitem [ref=e69]:
              - link "Artisans à Cotonou (Haie Vive, Cadjèhoun, Akpakpa...)" [ref=e70] [cursor=pointer]:
                - /url: /jobeurs?commune=Cotonou
            - listitem [ref=e71]:
              - link "Artisans à Abomey-Calavi (Arconville, Kpota, Godomey...)" [ref=e72] [cursor=pointer]:
                - /url: /jobeurs?commune=Abomey-Calavi
            - listitem [ref=e73]:
              - link "Artisans à Porto-Novo (Ouando, Tokpota, Avakpa...)" [ref=e74] [cursor=pointer]:
                - /url: /jobeurs?commune=Porto-Novo
            - listitem [ref=e75]: Parakou & Bohicon (Prochainement)
        - generic [ref=e76]:
          - heading "Métiers Populaires" [level=5] [ref=e77]
          - list [ref=e78]:
            - listitem [ref=e79]:
              - link "Plomberie & Débouchage" [ref=e80] [cursor=pointer]:
                - /url: /jobeurs?search=Plombier
            - listitem [ref=e81]:
              - link "Électricité bâtiment & Solaire" [ref=e82] [cursor=pointer]:
                - /url: /jobeurs?search=Électricien
            - listitem [ref=e83]:
              - link "Climatisation & Froid Inverter" [ref=e84] [cursor=pointer]:
                - /url: /jobeurs?search=Climatisation
            - listitem [ref=e85]:
              - link "Couture Bazin & Kanvo" [ref=e86] [cursor=pointer]:
                - /url: /jobeurs?search=Couture
            - listitem [ref=e87]:
              - link "Mécanique auto & Diagnostic OBD2" [ref=e88] [cursor=pointer]:
                - /url: /jobeurs?search=Mécanicien
        - generic [ref=e89]:
          - heading "Légal & Réglementation" [level=5] [ref=e90]
          - list [ref=e91]:
            - listitem [ref=e92]: Conformité Code du Numérique du Bénin (Loi n° 2017-20)
            - listitem [ref=e93]: Protection des Données Personnelles (APDP Bénin)
            - listitem [ref=e94]:
              - link "Charte de Confiance & Réputation" [ref=e95] [cursor=pointer]:
                - /url: /#comment-ca-marche
            - listitem [ref=e96]:
              - link "Portail Modération & Sécurité" [ref=e97] [cursor=pointer]:
                - /url: /admin
      - generic [ref=e102]:
        - paragraph [ref=e103]: © 2026 PROXIJOB Bénin. Tous droits réservés.
        - paragraph [ref=e104]: Plateforme conforme Soft UI & TDR contractuels V1 — Zéro carte interactive lourde.
  - navigation [ref=e105]:
    - generic [ref=e106]:
      - link "Accueil" [ref=e107] [cursor=pointer]:
        - /url: /
      - link "Jobeurs" [ref=e111] [cursor=pointer]:
        - /url: /jobeurs
      - link "Poster" [ref=e115] [cursor=pointer]:
        - /url: /demandes/nouvelle
      - link "Demandes" [ref=e118] [cursor=pointer]:
        - /url: /demandes
      - link "Mon Espace" [ref=e122] [cursor=pointer]:
        - /url: /dashboard/client
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
  63  |     await expect(identifierInput).toBeVisible();
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
> 100 |     await identifierInput.fill("sebastien.dossou@email.bj");
      |                           ^ Error: locator.fill: Test timeout of 30000ms exceeded.
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
  164 |     await page.goto("/jobeurs");
  165 |     await responsePromise;
  166 | 
  167 |     // Attente que le décompte des artisans soit affiché
  168 |     await expect(page.locator("text=/artisan/i").first()).toBeVisible({ timeout: 10000 });
  169 | 
  170 |     // Vérification de la présence des cartes d'artisans chargées depuis Neon
  171 |     const jobberCards = page.locator('div.group.relative[class*="rounded-2xl"]');
  172 |     await expect(jobberCards.first()).toBeVisible({ timeout: 10000 });
  173 |     const count = await jobberCards.count();
  174 |     expect(count).toBeGreaterThan(0);
  175 | 
  176 |     // Vérification de la présence de repères géographiques (landmarks béninois)
  177 |     const landmarkBadge = page.locator("text=Repère").first();
  178 |     await expect(landmarkBadge).toBeVisible();
  179 | 
  180 |     // Vérification de la présence des notes étoiles
  181 |     const stars = page.locator("svg.lucide-star").first();
  182 |     await expect(stars).toBeVisible();
  183 | 
  184 |     // Vérification des badges ProxyTrust sur la carte artisan
  185 |     const trustBadge = jobberCards.first().locator("text=ProxyTrust");
  186 |     await expect(trustBadge).toBeVisible();
  187 |   });
  188 | 
  189 |   // =========================================================================
  190 |   // TEST 6 : Wizard de Création de Demande
  191 |   // =========================================================================
  192 |   test("Test 6 : Création de Demande - Progression du wizard et publication", async ({
  193 |     page,
  194 |   }) => {
  195 |     await page.goto("/demandes/nouvelle");
  196 | 
  197 |     // Étape 1 : Choix du métier
  198 |     await expect(
  199 |       page.getByRole("heading", { name: /Quel type d'artisan recherchez-vous/i })
  200 |     ).toBeVisible();
```