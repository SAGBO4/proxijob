# PROXIJOB — Spécification UI/UX & Design System (V1 à V3+)
## Framework "Soft UI & Clean Design" — Expérience Utilisateur Fluide et Professionnelle

> **Document Normatif Produit & Design System**  
> **Version :** 2.0.0 — Production-Ready & Client-Certified  
> **Cible Technique :** Next.js (App Router), React, Tailwind CSS v3.4+, shadcn/ui, Radix UI, Lucide Icons  
> **Marché de Référence :** Bénin (Cotonou, Abomey-Calavi, Porto-Novo) & Sous-région Ouest-Africaine  
> **Conformité Normative :** Conforme aux TDR (Section 4.1 & Matrice §6), au CdCF et au document original de cadrage PROXIJOB (Section 11 — Design & Identité Visuelle, Section 3 — Recherche sans carte, Section 7 — Confiance & ProxyTrust, Section 14 — Versions V1 à V3+).  
> **Directive Client Impérative :** Plateforme résolument **soft, aérée, et dotée d'une expérience utilisateur ultra fluide et professionnelle**.

---

## Sommaire

1. [Philosophie Produit, Soft UI & Clean Design](#1-philosophie-produit-soft-ui--clean-design)
   - 1.1 Les Piliers UX & Ergonomiques Fondamentaux
   - 1.2 Principes "Soft UI & Clean Design" (Zéro Agressivité, Respiration Visuelle)
   - 1.3 Calibrage d'une Expérience Utilisateur Ultra Fluide et Professionnelle
   - 1.4 Stratégie Géographique & Recherche de Proximité Sans Carte (V1)
2. [Identité Visuelle & Tokens Chromatiques](#2-identité-visuelle--tokens-chromatiques)
   - 2.1 Palette Principale (Bleu Client #1E40AF / Jaune-Ambre Jobeur #EAB308 / Blanc Lisibilité)
   - 2.2 Couleurs Sémantiques & Badges d'États
   - 2.3 Spécification des Tokens CSS & Variables Globales
3. [Typographie, Hiérarchie & Rythme Vertical](#3-typographie-hiérarchie--rythme-vertical)
   - 3.1 Choix Typographique (Plus Jakarta Sans)
   - 3.2 Échelle Typographique Équilibrée
4. [Design System & Composants Recommandés (shadcn/ui)](#4-design-system--composants-recommandés-shadcnui)
   - 4.1 Carte de Profil Jobeur (`JobberCard`)
   - 4.2 Carte de Demande de Service Client (`ServiceRequestCard`)
   - 4.3 Moteur de Recherche Textuel & Filtres de Proximité (Sans Carte)
   - 4.4 Système d'Avis & Score de Réputation
   - 4.5 Composant Badge & Label ProxyTrust (V3)
   - 4.6 Messagerie Instantanée Sécurisée & Masquage Automatique des Coordonnées
5. [Architecture des Écrans Clés & Wireframes Textuels](#5-architecture-des-écrans-clés--wireframes-textuels)
   - 5.1 Page d'Accueil (Landing Page Epurée)
   - 5.2 Page Résultats de Recherche & Listing Jobeurs
   - 5.3 Page Profil Public du Jobeur & Portfolio Avant / Après
   - 5.4 Formulaire de Demande de Service (Wizard Aéré en 4 Étapes)
   - 5.5 Tableaux de Bord Fluides (Client / Jobeur avec Commutateur 1-Clic)
   - 5.6 Console d'Administration & File de Modération
6. [États d'Interaction, Micro-Animations & Résilience Réseau](#6-états-dinteraction-micro-animations--résilience-réseau)
   - 6.1 Ergonomie Mobile-First & "Thumb Zone"
   - 6.2 Micro-Interactions Fluides (150-200ms ease-out) & États Standardisés
   - 6.3 Skeleton Loaders & Transitions Progressives sans CLS
   - 6.4 Stratégie "Low-Data" & Mode Hors-Ligne Résilient
7. [Configuration Technique Tailwind CSS](#7-configuration-technique-tailwind-css)
   - 7.1 Fichier `tailwind.config.ts`
8. [Matrice d'Alignement & Roadmap UI/UX par Version (V1 à V3+)](#8-matrice-dalignement--roadmap-uiux-par-version-v1-à-v3)

---

## 1. Philosophie Produit, Soft UI & Clean Design

ProxiJob est la plateforme de référence pour connecter rapidement ménages et entreprises avec des artisans et techniciens locaux qualifiés en Afrique de l'Ouest. L'expérience doit inspirer une **sécurité totale**, une **simplicité exemplaire** et une **élégance discrète**.

### 1.1 Les Piliers UX & Ergonomiques Fondamentaux

| Pilier | Principe Directeur | Traduction Visuelle & Interaction |
| :--- | :--- | :--- |
| **Human-Centered** | Priorité absolue aux besoins réels d'artisans de terrain et d'utilisateurs pressés. Zéro jargon, compréhension instantanée. | Avatars réels valorisés, intitulés de métiers en français clair, actions directes ("Demander un devis", "Discuter"). |
| **Mobile-First & Performance Réseau** | 85%+ du trafic sur smartphones Android d'entrée/milieu de gamme sous réseaux mobiles variables (3G / 4G instable). | Pages ultra légères (< 250 Ko au 1er chargement hors médias), cibles tactiles minimales de 48×48 px, zéro librairie lourde. |
| **Zéro Carte Interactive en V1** | La cartographie interactive vectorielle (Google Maps / Mapbox) est lente, consommatrice de data et inadaptée aux repères toponymiques locaux. | Moteur de proximité textuel : Villes, Communes, Quartiers, distance estimée en km, repères visuels réels (*"Face pharmacie X"*). |
| **Trust-Based Interface** | La confiance mutuelle est le premier frein à l'engagement d'un artisan à domicile ou sur chantier. | Labellisation claire (*ProxyTrust* V3), avis exclusivement vérifiés post-prestation, antécédents visibles, transparence tarifaire en FCFA. |
| **Bipolarité Chromatique Maîtrisée** | Deux écosystèmes complémentaires sur un compte unifié : Clients (recherche) et Jobeurs (offres). | Bleu Royal `#1E40AF` pour l'univers Client (sérénité, commande) ; Jaune/Ambre Chaud `#EAB308` pour l'univers Jobeur (énergie, opportunité). |

### 1.2 Principes "Soft UI & Clean Design" (Zéro Agressivité, Respiration Visuelle)

Conformément à la directive formelle du client, l'esthétique générale de ProxiJob bannit tout artifice agressif ou surchargé au profit d'un design doux, reposant et premium :
1. **Nuances Chromatiques Adoucies :**
   - Remplacement de tout jaune fluo ou criard par un **Ambre / Or chaleureux et soft (`#EAB308`)**, équilibré par des textes à fort contraste lisible (`#854D0E` ou `#713F12`).
   - Le Bleu Client s'ancre sur un **Bleu Royal profond et rassurant (`#1E40AF`)**, adouci de nuances légères (`#EFF6FF`).
2. **Surfaces Neutres et Apaisantes :**
   - Les fonds d'écran évitent le blanc pur clinique en intégrant des surfaces douces `slate-50` (`#F8FAFC`) ou `zinc-50` (`#FAFAFA`).
   - Les cartes blanches reposent sur ces fonds avec une démarcation nette mais soyeuse.
3. **Ombres Portées Ultra Subtiles ("Soft Shadows") :**
   - Élimination des ombres noires dures. Utilisation exclusive d'ombres diffuses, aériennes et translucides :
     `box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02);`
4. **Bordures Fines Délicates :**
   - Séparateurs et contours d'inputs limités à **1px `slate-200` (`#E2E8F0`)**, offrant une délimitation géométrique précise sans alourdir la page.
5. **Respiration Visuelle ("Soft Whitespace") :**
   - Espacements généreux (paddings de cartes `p-5` à `p-6`, marges inter-sections `gap-6` à `gap-8`) empêchant toute sensation d'étouffement informationnel.

### 1.3 Calibrage d'une Expérience Utilisateur Ultra Fluide et Professionnelle

Une navigation professionnelle se mesure à sa fluidité de réaction :
* **Zéro Friction Cognitive :** Chaque écran n'a qu'un seul objectif d'action primaire évident (Primary Call-to-Action).
* **Transitions Temporelles Harmoniques :** Toutes les transitions interactives (hover, focus, ouverture de drawer, affichage de modal) sont calibrées entre **150ms et 200ms avec courbe d'accélération `ease-out`**, garantissant un ressenti réactif sans saccade.
* **Micro-Interactions Bienveillantes :** Les boutons s'enfoncent subtilement au toucher mobile (`active:scale-[0.98]`), les champs de formulaire s'illuminent d'un halo doux au focus (`focus:ring-2 focus:ring-blue-100`).
* **Feedbacks d'États Clairs :** Messages d'erreur formulés de manière constructive et positive, notifications Toast douces avec icônes signifiantes.

### 1.4 Stratégie Géographique & Recherche De Proximité Sans Carte (V1)

Conformément à la Section 3 du document de cadrage et aux TDR contractuels, **aucune carte interactive (Google Maps, Leaflet, Mapbox) n'est chargée en V1** :
1. **Arborescence Administrative Béninoise :**  
   `Département > Commune/Ville > Arrondissement > Quartier`  
   *(Exemple : Littoral > Cotonou > 12ème Arrondissement > Cadjèhoun / Haie Vive / Fidjrossè).*
2. **Repères Géographiques Réels :** Champ textuel libre permettant au Client de préciser un repère populaire (*"À 100m du carrefour Étoile Rouge"*, *"Face pharmacie Camp Guézo"*).
3. **Curseur Dynamique de Rayon (Slider Textuel) :**  
   Graduations nettes : `2 km` (voisinage direct), `5 km` (quartiers limitrophes), `10 km` (agglomération), `25 km` (grand pôle urbain Cotonou-Calavi).
4. **Distance Estimée Restituée :** Calculée côté serveur (algorithme Haversine) et restituée sous format textuel épuré : *"À ~2.4 km de votre position"*.

---

## 2. Identité Visuelle & Tokens Chromatiques

### 2.1 Palette Principale

```
      BLEU CLIENT (#1E40AF)          JAUNE-AMBRE JOBEUR (#EAB308)         NEUTRES DOUX (SLATE)
   [ #1E40AF ]    [ #3B82F6 ]         [ #EAB308 ]    [ #CA8A04 ]       [ #FFFFFF ]   [ #F8FAFC ]
     Confiance & Stabilité               Énergie Artisanale & Soft         Clarté, Respiration & Soft UI
```

#### Palette Client — Bleu Royal Confiance
- **Primary Client (`client-600` / Base) :** `#1E40AF` (Bleu Royal soutenu, sérieux, institutionnel et hautement accessible)
- **Deep Navy / En-têtes (`client-900`) :** `#0F2F4E` (Titres majeurs, contraste optimal)
- **Soft Light Blue (`client-50`) :** `#EFF6FF` (Fonds de cartes actifs, messages client dans le chat)
- **Hover Client (`client-700`) :** `#1D4ED8` (Survol des boutons primaires)

#### Palette Jobeur — Jaune / Ambre Doux & Chaleureux
- **Primary Jobeur (`jobber-500` / Base) :** `#EAB308` (Jaune-Ambre doux, chaleureux, valorisant le savoir-faire sans éblouir)
- **Dark Accessible Text (`jobber-800`) :** `#854D0E` (Texte lisible certifié WCAG AA sur fonds clairs)
- **Soft Amber Surface (`jobber-50`) :** `#FFFBEB` (Fonds de notification pros, opportunités de missions)
- **Focus / Hover Jobeur (`jobber-600`) :** `#CA8A04` (Survol bouton pro, badges d'urgence)

#### Surfaces, Fonds & Textes Soft UI
- **Surface Pure (`surface-card`) :** `#FFFFFF` (Fonds des cartes, inputs, conteneurs principaux)
- **Surface Douce (`surface-bg`) :** `#F8FAFC` (Slate 50 — Fond général reposant pour l'œil)
- **Bordures Délicates (`border-soft`) :** `#E2E8F0` (Slate 200 — Lignes de délimitation ultra fines 1px)
- **Bordures Inputs (`border-input`) :** `#CBD5E1` (Slate 300 — Contours de saisie au repos)
- **Texte Majeur (`text-slate-900`) :** `#0F172A` (Slate 900 — Lisibilité optimale même en plein soleil)
- **Texte Secondaire (`text-slate-600`) :** `#475569` (Slate 600 — Sous-titres et métadonnées)
- **Texte Muted (`text-slate-400`) :** `#94A3B8` (Placeholders, éléments désactivés)

### 2.2 Couleurs Sémantiques & Badges d'États

| État | Token CSS | Valeur Hex | Usage Interface |
| :--- | :--- | :--- | :--- |
| **Succès / ProxyTrust** | `--color-success` | `#059669` (Emerald 600) | Badge identité vérifiée, validation de mission |
| **Succès Fond Doux** | `--color-success-bg` | `#ECFDF5` (Emerald 50) | Conteneur de confirmation, pastille vérifiée |
| **Alerte / Attente** | `--color-warning` | `#D97706` (Amber 600) | Devis en cours de négociation, validation requise |
| **Urgence / Critique** | `--color-danger` | `#DC2626` (Red 600) | Tag "Intervention Urgente (< 2h)", signalement, litige |
| **Urgence Fond Doux** | `--color-danger-bg` | `#FEF2F2` (Red 50) | Tag d'annonce urgente aérée |
| **Information / Proximité** | `--color-info` | `#0284C7` (Sky 600) | Indicateur kilométrique, info logistique |

### 2.3 Spécification des Tokens CSS & Variables Globales

```css
:root {
  /* Surfaces & Base Soft UI */
  --background: 210 40% 98%;          /* #F8FAFC - Slate 50 */
  --foreground: 222.2 84% 4.9%;        /* #0F172A - Slate 900 */
  --card: 0 0% 100%;                  /* #FFFFFF */
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;

  /* Univers Client (Bleu Royal #1E40AF) */
  --client-primary: 224 71% 40%;       /* #1E40AF */
  --client-primary-foreground: 0 0% 100%;
  --client-hover: 224 76% 48%;         /* #1D4ED8 */
  --client-surface: 214 100% 97%;      /* #EFF6FF */

  /* Univers Jobeur (Ambre Doux #EAB308) */
  --jobber-primary: 43 96% 48%;        /* #EAB308 */
  --jobber-primary-foreground: 222.2 84% 4.9%;
  --jobber-hover: 37 91% 40%;          /* #CA8A04 */
  --jobber-text: 35 92% 29%;           /* #854D0E */
  --jobber-surface: 48 100% 96%;       /* #FFFBEB */

  /* Statuts Sémantiques */
  --success: 160 84% 39%;              /* #059669 */
  --success-foreground: 0 0% 100%;
  --destructive: 0 84.2% 60.2%;        /* #DC2626 */
  --destructive-foreground: 210 40% 98%;
  --warning: 43 96% 48%;               /* #EAB308 */
  --warning-foreground: 35 92% 29%;

  /* Contours & Rayons */
  --border: 214.3 31.8% 91.4%;         /* #E2E8F0 */
  --input: 214.3 31.8% 85%;          /* #CBD5E1 */
  --ring: 224 71% 40%;                 /* #1E40AF */
  --radius: 0.625rem;                  /* 10px - Rayon doux */

  /* Ombres Portées Soft UI */
  --shadow-soft: 0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02);
  --shadow-soft-md: 0 4px 12px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -2px rgba(15, 23, 42, 0.03);
  --shadow-soft-lg: 0 12px 24px -4px rgba(15, 23, 42, 0.06), 0 4px 8px -2px rgba(15, 23, 42, 0.02);
}
```

---

## 3. Typographie, Hiérarchie & Rythme Vertical

### 3.1 Choix Typographique (Plus Jakarta Sans)

- **Famille Typographique Principale :** `Plus Jakarta Sans` (Google Fonts / Variable Font).
- **Rationale Technique & Produit :**
  - Géométrie équilibrée et humaniste : lisibilité irréprochable sur écrans AMOLED ou LCD d'entrée de gamme.
  - Chiffres à espacement régulier : fondamental pour la lecture instantanée des montants en FCFA et des distances en kilomètres.
  - Poids réduits pour le bundle : inclusion exclusive des graisses `400 (Regular)`, `500 (Medium)`, `600 (SemiBold)` et `700 (Bold)`.
- **Police de Repli :** `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`.

### 3.2 Échelle Typographique Équilibrée

| Niveau | Mobile | Desktop | Graisse | Interlignage | Usage Type |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display / H1** | 28px (`1.75rem`) | 38px (`2.375rem`) | Bold (700) | 1.15 | Accroche héroïque Landing Page |
| **H2 Section** | 22px (`1.375rem`) | 26px (`1.625rem`) | SemiBold (600) | 1.25 | Titres de sections, nom artisan |
| **H3 Bloc / Card** | 18px (`1.125rem`) | 20px (`1.25rem`) | SemiBold (600) | 1.30 | Intitulé service, titre de demande |
| **Body Large** | 16px (`1.0rem`) | 16px (`1.0rem`) | Regular (400) | 1.50 | Descriptions de projets, devis |
| **Body Base** | 14px (`0.875rem`) | 14px (`0.875rem`) | Regular (400) | 1.45 | Texte courant, inputs, listes |
| **Caption / Meta** | 12px (`0.75rem`) | 12px (`0.75rem`) | Medium (500) | 1.40 | Quartiers, distances, dates |
| **Badge Micro** | 11px (`0.6875rem`) | 11px (`0.6875rem`) | SemiBold (600) | 1.20 | Étiquettes statut, tags urgence |

---

## 4. Design System & Composants Recommandés (shadcn/ui)

### 4.1 Carte de Profil Jobeur (`JobberCard`)

Composant clé de découverte des prestataires. Épuré, aéré, lecture instantanée en 3 secondes.

```
+-----------------------------------------------------------------------+
| [Avatar 56x56]  Koffi MENSAH                      [ 4.9 ★★★★★ (42) ]  |
|  [Badge Pro]    Électricien Bâtiment & Climatisation                  |
|                 📍 Cotonou, Cadjèhoun • à 1.8 km                      |
|                                                                       |
| [✓ ProxyTrust Identité Vérifiée]   [⚡ Dispo Immédiate]                |
|                                                                       |
| Spécialités: Dépannage tableau, Câblage triphasé, Pose groupe électrogène |
|                                                                       |
| Tarif indicatif : Dès 5 000 FCFA / intervention                       |
| [ Voir le profil ]                             [ Contacter le Jobeur ]|
+-----------------------------------------------------------------------+
```

#### Anatomie & Spécifications Soft UI :
- **Conteneur :** Fond blanc, bordure 1px `#E2E8F0`, coins arrondis `rounded-xl` (10px), ombre douce `shadow-soft` évoluant en `shadow-soft-md` au hover avec transition 200ms ease-out.
- **En-tête de Carte :**
  - Avatar circulaire 56×56 px avec photo de l'artisan ou initiales neutres.
  - Nom & Prénom en `text-slate-900 font-semibold text-base`.
  - Métier en `text-slate-600 text-sm`.
  - Évaluation : Note dorée (`#EAB308`), nombre d'avis vérifiés entre parenthèses (`(42)`).
- **Pastilles & Badges :**
  - **Badge ProxyTrust :** Fond `#ECFDF5`, texte `#065F46`, icône bouclier vert `ShieldCheck`.
  - **Badge Proximité :** Fond `#EFF6FF`, texte `#1E40AF`, icône `MapPin` avec distance calculée.
- **Pied de Carte :**
  - Tarif de départ indicatif en FCFA (`Dès 5 000 FCFA`).
  - Bouton Secondaire *"Voir le profil"* (fond transparent, bordure fine `#CBD5E1`, hover fond `#F8FAFC`).
  - Bouton Primaire *"Contacter"* (fond Bleu Royal `#1E40AF`, texte blanc, padding tactile 48px min).

### 4.2 Carte de Demande de Service Client (`ServiceRequestCard`)

```
+-----------------------------------------------------------------------+
| [URGENT < 2H]   Plomberie — Fuite d'eau importante sous évier         |
| Publiée il y a 20 min par Aimé K. • Réf: #DEM-9104                    |
| 📍 Abomey-Calavi, Tankpè (à ~3.2 km de votre position)                |
|                                                                       |
| "Recherche plombier qualifié pour remplacer raccord PVC percé         |
| sous évier cuisine. Arrivée d'eau coupée."                            |
|                                                                       |
| Budget indicatif Client : 10 000 – 15 000 FCFA                        |
| Clôture : Aujourd'hui avant 18h                 [ Postuler / Devis ]  |
+-----------------------------------------------------------------------+
```

- **Tag Urgence :** Fond `#FEF2F2`, texte `#DC2626`, icône chronomètre ou flamme rouge.
- **Action Jobeur :** Bouton jaune-ambre `#EAB308` hover `#CA8A04` avec texte contrasté sombre `#0F172A` *"Postuler à cette mission"*.

### 4.3 Moteur de Recherche Textuel & Filtres de Proximité (Sans Carte)

```
+-----------------------------------------------------------------------------------------------+
| [ 🔍 Métier (ex: Plombier) ] | [ 📍 Ville / Quartier (ex: Akpakpa) ] | [ Rayon: 5 km ▼ ] | [ Rechercher ] |
+-----------------------------------------------------------------------------------------------+
```

- **Champs aérés :** Hauteur 48px, fond blanc pur, bordure 1px `slate-300`, focus ring bleu royal.
- **Slider Kilométrique :** Sélecteur cranté fluide (2 km, 5 km, 10 km, 25 km, Tout le département).
- **Zéro Cartographie :** Tout le repérage s'opère par nom de quartier et distance relative calculée.

### 4.4 Système d'Avis & Score de Réputation

- **Condition Inconditionnelle :** Dépôt d'évaluation accessible **uniquement après passage de la mission à l'état `Terminée`**.
- **Composant Étoiles :** 5 étoiles jaunes `#EAB308` cliquables avec note globale sur 5.
- **Critères Dédiés :** Ponctualité, Qualité d'exécution, Propreté & Relationnel (jauges 0 à 100%).
- **Droit de Réponse :** Bloc réponse du Jobeur en retrait avec fond doux `#F8FAFC`.

### 4.5 Composant Badge & Label ProxyTrust (V3)

- **Variante Compacte :** Tag inline `[ ✓ ProxyTrust ]` sur fond vert d'eau `#ECFDF5`.
- **Variante Complète (Fiche Profil) :**
  ```
  +-----------------------------------------------------------------------+
  | [ ✓ ARTISAN CERTIFIÉ PROXYTRUST ]                                     |
  | Pièce d'identité nationale béninoise (CIP / CNI) vérifiée par l'équipe|
  | Références professionnelles et compétences techniques auditées.       |
  +-----------------------------------------------------------------------+
  ```

### 4.6 Messagerie Instantanée Sécurisée & Masquage Automatique des Coordonnées

- **Règle de Sécurité Pré-Accord :**
  - Tout numéro de téléphone (+229, 8 ou 10 chiffres), adresse email ou lien WhatsApp envoyé avant acceptation d'une proposition est **remplacé visuellement par `[Coordonnées masquées avant accord]`**.
  - Bannière d'aide bienveillante en tête :  
    *"🔒 Pour votre sécurité mutuelle, échangez via la messagerie ProxiJob. Les coordonnées directes seront automatiquement dévoilées dès validation de la mission."*
- **Bulles de Chat Épurées :**
  - Messages Client : Fond Bleu doux `#EFF6FF`, texte `#0F2F4E`, alignés à droite.
  - Messages Jobeur : Fond blanc pur avec liseré fin `#E2E8F0`, alignés à gauche.
  - Transitions fluides à l'envoi, double coche de réception/lecture.

---

## 5. Architecture des Écrans Clés & Wireframes Textuels

### 5.1 Page d'Accueil (Landing Page Epurée)

1. **Header Épuré :** Logo ProxiJob, liens textuels aérés, commutateur Client/Jobeur, CTA connexion/inscription.
2. **Hero Soft UI :**
   - Accroche : *"Trouvez un artisan qualifié et fiable à deux pas de chez vous."*
   - Barre de recherche centrale aérée (Métier + Quartier + Rayon).
3. **Bandeau de Réassurance (Trust Bar) :**
   - 4 arguments soft : *Artisans locaux vérifiés* • *Recherche ultra rapide sans carte* • *Avis 100% réels* • *Tarifs transparents*.
4. **Catégories Populaires :**
   - Grille 4×2 de cartes douces (Plomberie, Électricité, Climatisation, Menuiserie, Peinture, Mécanique, Électroménager, Entretien).
5. **Jobeurs Recommandés du Quartier :** Cartes de profils horizontales aérées.
6. **Double Parcours Explicatif :**
   - Onglet *"Je cherche un artisan"* vs *"Je propose mes services"*.
7. **Footer Institutionnel :** Villes couvertes (Cotonou, Calavi, Porto-Novo), sécurité, mentions légales.

### 5.2 Page Résultats de Recherche & Listing Jobeurs

- **Vue Mobile :** Sticky header compact avec filtres rapides horizontaux (`Chips`).
- **Vue Desktop (2 Colonnes) :**
  - Colonne gauche (300px) : Panneau de filtres doux (Quartiers, slider distance, ProxyTrust uniquement, fourchette tarifaire).
  - Colonne droite : Compteur de résultats (*"28 artisans disponibles à Calavi dans un rayon de 5 km"*), liste verticale des `JobberCard` espacées de 20px.

### 5.3 Page Profil Public du Jobeur & Portfolio Avant / Après

- **En-tête de Profil :** Photo de couverture de chantier, avatar 80×80 px, nom, badges ProxyTrust & proximité.
- **Onglets Aérés :**
  - *Présentation & Spécialités* : Bio, équipements, grille indicative de tarifs en FCFA.
  - *Portfolio Réalisations* : Galerie d'images haute résolution avec module interactif de comparaison **"Avant / Après"** (slider glissant entre l'état initial du chantier et le résultat final).
  - *Avis Clients Vérifiés* : Commentaires horodatés avec réponses du Jobeur.
- **Cartouche Fixe d'Action :** Bouton *"Demander un devis"* ou *"Envoyer un message"*.

### 5.4 Formulaire de Demande de Service (Wizard Aéré en 4 Étapes)

Conçu pour être complété en moins de 90 secondes sur mobile, avec barre de progression douce :
- **Étape 1 — Métier :** Sélection par cartes illustrées.
- **Étape 2 — Description :** Champ texte aéré avec suggestions guidées + téléversement de photos du problème (compression automatique).
- **Étape 3 — Localisation & Urgence :** Sélection Commune / Quartier + Repère visuel + Toggle *"Besoin urgent (< 2h)"*.
- **Étape 4 — Récapitulatif :** Budget estimatif indicatif et validation sans paiement préalable en V1.

### 5.5 Tableaux de Bord Fluides & Profil Hybride (Client ↔ Jobeur en 1 Clic)

- **Architecture de Compte Hybride Unifié :** Un utilisateur unique dispose d'une identité centralisée lui permettant d'agir alternativement comme demandeur (Client) ou comme prestataire (Jobeur).
- **Commutateur de Contexte Hybride (`SwitchRoleButton`) :** Élément interactif persistant dans la barre supérieure et le tiroir mobile permettant de basculer instantanément : `[ Mode Client 🔄 Mode Jobeur ]` sans aucune déconnexion, avec transition chromatique douce (Bleu Royal `#1E40AF` $\leftrightarrow$ Jaune-Ambre `#EAB308`).
- **Dashboard Client :** Suivi en temps réel des demandes émises (`Ouverte`, `En cours`, `Terminée`), carnet de Jobeurs favoris et historique des échanges.
- **Dashboard Jobeur :** Flux en direct des opportunités d'intervention locales, gestion des propositions et devis, consultation des statistiques de vues et édition du portfolio.

### 5.6 Console d'Administration & File de Modération

- Interface dédiée aux modérateurs pour :
  - Auditer les signalements d'utilisateurs ou de messages abusifs.
  - Modérer les photos de portfolio avant ou après mise en ligne.
  - Examiner les pièces d'identité (CIP/CNI) pour la certification des badges ProxyTrust (V3).

---

## 6. États d'Interaction, Micro-Animations & Résilience Réseau

### 6.1 Ergonomie Mobile-First & "Thumb Zone"

- Toutes les commandes primaires sont situées dans les deux tiers inférieurs de l'écran tactile.
- Cible tactile minimale : **48 × 48 px**.
- Espacement minimal entre contrôles cliquables : **12 px**.
- Barre de navigation mobile inférieure (Bottom Navigation) fixe à 4 items clairs :
  `[ 🔍 Rechercher ] [ 📋 Mes Demandes ] [ 💬 Discussions ] [ 👤 Mon Profil ]`.

### 6.2 Micro-Interactions Fluides (150-200ms ease-out) & États Standardisés

| Composant | Normal | Hover / Survol | Active / Pression tactile | Focus Clavier / Touch | Disabled |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Bouton Bleu Client** | Fond `#1E40AF`, texte blanc | Fond `#1D4ED8`, transition 150ms | `scale(0.98)` | Ring 2px `#93C5FD`, offset 2px | Opacité 40%, curseur interdit |
| **Bouton Ambre Jobeur**| Fond `#EAB308`, texte `#0F172A`| Fond `#CA8A04`, transition 150ms | `scale(0.98)` | Ring 2px `#FDE047`, offset 2px | Opacité 40%, curseur interdit |
| **Input de Saisie** | Bordure `#CBD5E1`, fond blanc | Bordure `#94A3B8` | Fond blanc | Bordure `#1E40AF`, halo ring doux | Fond `#F1F5F9`, texte `#94A3B8` |
| **Carte de Profil** | Bordure `#E2E8F0`, `shadow-soft`| `shadow-soft-md`, border `#CBD5E1`| `scale(0.995)` | Ring 2px `#1E40AF` | Opacité 50% |

### 6.3 Skeleton Loaders & Transitions Progressives sans CLS

- Élimination des spinners tournants anxiogènes au profit de **Skeletons rectangulaires doux pulsants (`animate-pulse`)**, reproduisant au pixel près la silhouette de la `JobberCard`.
- Préservation absolue du layout pour garantir un score CLS (*Cumulative Layout Shift*) inférieur à 0.05.

### 6.4 Stratégie "Low-Data" & Mode Hors-Ligne Résilient

1. **Compression CDN Immédiate :** Toutes les photos uploadées sont automatiquement compressées en WebP (qualité 75, max 600px de large) réduisant le poids par 5.
2. **Sauvegarde Locale Anti-Perte (Local Storage / IndexedDB) :** Les formulaires en cours de saisie sont sauvegardés localement. En cas de micro-coupure 3G/4G, le contenu n'est jamais perdu.
3. **Notification Réseau Non Intrusive :** Toast discret en cas de déconnexion : *"Réseau interrompu. Vos actions seront synchronisées dès reconnexion."*

---

## 7. Configuration Technique Tailwind CSS

### 7.1 Fichier `tailwind.config.ts`

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // Univers Client (Bleu Royal Soft & Pro)
        client: {
          DEFAULT: "#1E40AF",   // Blue 800 - Identité majeure
          hover: "#1D4ED8",     // Blue 700 - Hover fluide
          dark: "#0F2F4E",      // Deep Navy - Titres
          light: "#EFF6FF",     // Blue 50 - Surface douce
        },
        
        // Univers Jobeur (Ambre/Jaune Chaleureux & Doux)
        jobber: {
          DEFAULT: "#EAB308",   // Yellow 500 - Chaleur sans éblouir
          hover: "#CA8A04",     // Yellow 600 - Hover interactif
          dark: "#854D0E",      // Yellow 800 - Texte contrasté accessible
          light: "#FEF9C3",     // Yellow 100 - Fond doux
          surface: "#FFFBEB",   // Amber 50 - Surface d'alerte pro
        },
        
        // Statuts & Confiance
        trust: {
          DEFAULT: "#059669",   // Emerald 600 - ProxyTrust certifié
          light: "#ECFDF5",     // Emerald 50 - Fond pastille
        },
        urgency: {
          DEFAULT: "#DC2626",   // Red 600 - Urgent < 2h
          light: "#FEF2F2",     // Red 50 - Fond tag urgence
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02)",
        "soft-md": "0 4px 12px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -2px rgba(15, 23, 42, 0.03)",
        "soft-lg": "0 12px 24px -4px rgba(15, 23, 42, 0.06), 0 4px 8px -2px rgba(15, 23, 42, 0.02)",
      },
      transitionTimingFunction: {
        "soft-out": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        "150": "150ms",
        "200": "200ms",
      },
      borderRadius: {
        xl: "0.625rem",         // 10px
        "2xl": "0.875rem",       // 14px
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

---

## 8. Matrice d'Alignement & Roadmap UI/UX par Version (V1 à V3+)

| Version | Focus Produit & Ergonomique | Composants UI Spécifiques Livrés | Règles Métier Associées |
| :---: | :--- | :--- | :--- |
| **V1** | **Socle Marketplace Essentiel (Soft & Épuré)** | `JobberCard`, `ServiceRequestCard`, `SearchProximityBar`, `BeforeAfterPortfolio`, `SimpleChat` avec masquage, `SwitchRoleButton` | **Zéro carte Maps**, **Zéro paiement en ligne** (cash de gré à gré), masquage automatique des coordonnées dans le chat, avis réservés aux missions terminées. |
| **V2** | **Engagement & Richesse des Échanges** | `VoiceNotePlayer` (chat audio), `RealTimeAvailabilityCalendar`, `FilterDrawerAdvanced`, `PushNotificationToast` | Notes vocales pour les artisans, planning dynamique des créneaux horaires, alertes push instantanées. |
| **V2.5** | **Monétisation, Crédits & Packs Commerciaux** | `CreditCounterBadge`, `CommercialPackCard` (Démarrage 500 FCFA, Visibilité 1 000 FCFA, Vidéo 2 500 FCFA), `AdFreePassBanner` (Pass sans pub : 100 FCFA / 7j, 300 FCFA / 30j, 500 FCFA / 90j), `SponsoredBannerAd` | Crédits de publication (validité 15 jours consécutifs), gestion des boosts de visibilité, forfaits d'annonces et désactivation des publicités via pass temporel. |
| **V3** | **ProxyTrust & Confiance Institutionnelle** | `ProxyTrustVerifiedBadge`, `KycUploadModal` (CIP / CNI béninoise), `ContractModelViewer`, `DisputeMediationPanel` | Badge de vérification d'identité officielle, surclassement algorithmique des profils certifiés, modèles de contrat types. |
| **V3+** | **Transactions Intégrées & Mobile Money** | `MobileMoneyModal` (MTN MoMo, Moov Money, Celtiis Cash), `EscrowStatusTracker`, `InAppWalletCard`, `InvoiceReceiptDownload` | Séquestre financier (Escrow), déblocage automatique des fonds après validation du client, portefeuille électronique in-app. |

---
*Fin du document normatif de Design System PROXIJOB — Certifié conforme aux TDR et aux directives de l'autorité émettrice.*
