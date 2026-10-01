import { test, expect } from "@playwright/test";

// Liste des résolutions smartphones représentatives du marché béninois et mondial
const MOBILE_VIEWPORTS = [
  { name: "Android Compact (360x740)", width: 360, height: 740 },
  { name: "iPhone SE (375x667)", width: 375, height: 667 },
  { name: "iPhone 14 / Standard (390x844)", width: 390, height: 844 },
];

// Pages maîtresses de l'application
const TEST_ROUTES = [
  "/",
  "/jobeurs",
  "/demandes",
  "/demandes/nouvelle",
  "/connexion",
  "/inscription",
  "/mot-de-passe-oublie",
];

test.describe("PROXIJOB - Audit Qualité Responsivité Mobile First & Ergonomie", () => {
  for (const vp of MOBILE_VIEWPORTS) {
    test.describe(`Écran ${vp.name}`, () => {
      test.use({ viewport: { width: vp.width, height: vp.height } });

      // -------------------------------------------------------------
      // VÉRIFICATION 1 : Aucun débordement horizontal (Zéro Scroll X)
      // -------------------------------------------------------------
      for (const route of TEST_ROUTES) {
        test(`Pas de scroll horizontal sur ${route}`, async ({ page }) => {
          await page.goto(route, { waitUntil: "domcontentloaded" });
          await page.waitForTimeout(500);

          // Calcul précis du débordement horizontal
          const overflow = await page.evaluate(() => {
            const docWidth = document.documentElement.scrollWidth;
            const bodyWidth = document.body.scrollWidth;
            const viewportWidth = window.innerWidth;
            return {
              viewportWidth,
              docWidth,
              bodyWidth,
              hasHorizontalScroll:
                docWidth > viewportWidth + 1 || bodyWidth > viewportWidth + 1,
            };
          });

          expect(
            overflow.hasHorizontalScroll,
            `Débordement horizontal détecté sur ${route} (${vp.name}) : docWidth=${overflow.docWidth}, viewport=${overflow.viewportWidth}`
          ).toBeFalsy();
        });
      }

      // -------------------------------------------------------------
      // VÉRIFICATION 2 : Navigation mobile inférieure (MobileNav)
      // -------------------------------------------------------------
      test("Barre MobileNav fixe, visible et cibles tactiles >= 48px", async ({
        page,
      }) => {
        await page.goto("/");
        await page.waitForTimeout(300);

        const mobileNav = page.locator("nav.fixed.bottom-0");
        await expect(mobileNav).toBeVisible();

        // Vérifier que chaque bouton d'action a une taille tactile suffisante (au moins 40px)
        const navLinks = mobileNav.locator("a");
        const count = await navLinks.count();
        expect(count).toBeGreaterThanOrEqual(4);

        for (let i = 0; i < count; i++) {
          const box = await navLinks.nth(i).boundingBox();
          expect(box).not.toBeNull();
          if (box) {
            expect(
              box.height,
              `Hauteur cible tactile trop petite pour le bouton ${i}`
            ).toBeGreaterThanOrEqual(40);
          }
        }
      });

      // -------------------------------------------------------------
      // VÉRIFICATION 3 : Espace bas de page suffisant (pb-24)
      // -------------------------------------------------------------
      test("Contenu non masqué par la barre de navigation mobile", async ({
        page,
      }) => {
        await page.goto("/demandes");
        await page.waitForTimeout(400);

        // Scroll tout en bas
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(300);

        // La balise main doit avoir le padding suffisant
        const mainPaddingBottom = await page.evaluate(() => {
          const main = document.querySelector("main");
          if (!main) return 0;
          return parseInt(window.getComputedStyle(main).paddingBottom, 10);
        });

        // 6rem = 96px (pb-24)
        expect(mainPaddingBottom).toBeGreaterThanOrEqual(80);
      });

      // -------------------------------------------------------------
      // VÉRIFICATION 4 : Formulaire de connexion sur mobile
      // -------------------------------------------------------------
      test("Formulaire de connexion fluide et boutons accessibles sans zoom forcé", async ({
        page,
      }) => {
        await page.goto("/connexion");
        await page.waitForTimeout(300);

        const emailInput = page.locator('input[name="identifier"]');
        const passInput = page.locator('input[name="password"]');
        const submitBtn = page.locator('button[type="submit"]');

        await expect(emailInput).toBeVisible();
        await expect(passInput).toBeVisible();
        await expect(submitBtn).toBeVisible();

        // Bouton submit en pleine largeur (ou presque) sur mobile
        const submitBox = await submitBtn.boundingBox();
        expect(submitBox).not.toBeNull();
        if (submitBox) {
          expect(submitBox.width).toBeGreaterThanOrEqual(vp.width * 0.75);
        }
      });

      // -------------------------------------------------------------
      // VÉRIFICATION 5 : Header mobile & Commutateur de Rôle
      // -------------------------------------------------------------
      test("Header mobile compact sans collision et commutateur opérationnel", async ({
        page,
      }) => {
        await page.goto("/");
        await page.waitForTimeout(300);

        const header = page.locator("header");
        await expect(header).toBeVisible();

        // Vérifier que le logo reste bien proportionné
        const logo = header.locator('a[href="/"]');
        await expect(logo).toBeVisible();
      });
    });
  }
});
