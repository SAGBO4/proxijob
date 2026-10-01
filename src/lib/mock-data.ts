// =========================================================================
// PROXIJOB — RÉFÉRENTIEL DES DONNÉES & MOCK SERVICE LOCAL (BÉNIN)
// Conforme au CdCF, design.md et aux 14 critères d'acceptation du TDR (V1 à V3)
// =========================================================================

export type RoleType = "client" | "jobber" | "admin";

export type TrustLevel = "LEVEL_1_PHONE" | "LEVEL_2_IDENTITY" | "LEVEL_3_EXPERT";

export type RequestStatus = "OPEN" | "IN_PROGRESS" | "COMPLETED" | "DISPUTED" | "CANCELLED";

export type ProposalStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export type LegalStatus = "PARTICULIER" | "ENTREPRISE";

export interface Quarter {
  name: string;
  slug: string;
  commune: string;
  latitude: number;
  longitude: number;
  landmarks: string[];
}

export interface Commune {
  name: string;
  slug: string;
  department: string;
  latitude: number;
  longitude: number;
  quarters: Quarter[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  displayOrder: number;
  subcategories: string[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  avantUrl: string;
  apresUrl: string;
  date: string;
  isVerified: boolean;
}

export interface ReviewItem {
  id: string;
  requestId: string;
  clientName: string;
  clientQuarter: string;
  rating: number; // 1 à 5
  qualite: number;
  ponctualite: number;
  prix: number;
  communication: number;
  comment: string;
  date: string;
  jobberReply?: string;
  jobberReplyDate?: string;
  isVerifiedMission: boolean; // ACC-08
}

export interface Jobber {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  avatar: string;
  headline: string;
  trade: string; // Ex: Plombier, Électricien
  categorySlug: string;
  bio: string;
  skills: string[];
  legalStatus: LegalStatus;
  companyName?: string;
  ifu?: string;
  rccm?: string;
  phone: string;
  email: string;
  city: string;
  quarter: string;
  landmark: string;
  latitude: number;
  longitude: number;
  serviceZones: string[];
  hourlyRate: number; // en FCFA
  startingPrice: number; // en FCFA
  isAvailable: boolean;
  availabilityDetails: string;
  averageRating: number;
  totalReviews: number;
  trustBadge: TrustLevel;
  completedJobs: number;
  responseRate: number; // %
  responseTime: string;
  isVerified: boolean;
  portfolio: PortfolioItem[];
  reviews: ReviewItem[];
  credits: number;
  boostActiveUntil?: string;
}

export interface Proposal {
  id: string;
  requestId: string;
  jobberId: string;
  jobberName: string;
  jobberAvatar: string;
  jobberTrade: string;
  jobberRating: number;
  amount: number; // en FCFA
  delayDays: number;
  message: string;
  status: ProposalStatus;
  createdAt: string;
  acceptedAt?: string;
}

export interface ServiceRequest {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  clientPhone: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  city: string;
  quarter: string;
  landmark: string;
  latitude: number;
  longitude: number;
  estimatedBudget: number; // en FCFA
  isUrgent: boolean; // < 2h
  createdAt: string;
  deadline: string;
  status: RequestStatus;
  proposalsCount: number;
  photos: string[];
  proposals?: Proposal[];
}

export interface VerificationRequest {
  id: string;
  jobberId: string;
  jobberName: string;
  jobberAvatar: string;
  trade: string;
  type: "CIP" | "CNI" | "RCCM" | "DIPLOME" | "IFU";
  documentNumber: string;
  documentUrl: string;
  status: "PENDING" | "VERIFIED" | "REJECTED";
  submittedAt: string;
  comment?: string;
}

export interface ModerationAuditLog {
  id: string;
  adminName: string;
  action: string;
  targetType: string;
  targetName: string;
  motif: string;
  date: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderRole: "client" | "jobber";
  contentOriginal: string;
  contentFiltered: string;
  isMasked: boolean;
  timestamp: string;
}

export interface Conversation {
  id: string;
  requestId: string;
  requestTitle: string;
  jobberId: string;
  jobberName: string;
  jobberAvatar: string;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  isContactUnlocked: boolean; // ACC-06 & ACC-07
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
}

// =========================================================================
// RÉFÉRENTIEL TERRITORIAL BÉNINOIS (SANS CARTE INTERACTIVE)
// =========================================================================

export const BENIN_COMMUNES: Commune[] = [
  {
    name: "Cotonou",
    slug: "cotonou",
    department: "Littoral",
    latitude: 6.3654,
    longitude: 2.4183,
    quarters: [
      {
        name: "Akpakpa Dodomè",
        slug: "akpakpa-dodome",
        commune: "Cotonou",
        latitude: 6.3685,
        longitude: 2.4502,
        landmarks: ["Face Église Sacré-Cœur d'Akpakpa", "Ciné Concorde", "Pharmacie de l'Étoile", "Marché Dandji"],
      },
      {
        name: "Cadjèhoun",
        slug: "cadjehoun",
        commune: "Cotonou",
        latitude: 6.3615,
        longitude: 2.4095,
        landmarks: ["Derrière Collège Père Aupiais", "Ambassade des USA", "Carrefour Cadjèhoun", "Camp Guézo"],
      },
      {
        name: "Haie Vive",
        slug: "haie-vive",
        commune: "Cotonou",
        latitude: 6.3533,
        longitude: 2.4182,
        landmarks: ["Face Pharmacie Camp Guézo", "Rue des Ambassades", "Place du Souvenir", "Les Cocotiers"],
      },
      {
        name: "Fidjrossè",
        slug: "fidjrosse",
        commune: "Cotonou",
        latitude: 6.3591,
        longitude: 2.3789,
        landmarks: ["Carrefour Club des Rois", "Calvaire Fidjrossè", "Plage de Fidjrossè", "Pharmacie Fidjrossè"],
      },
      {
        name: "Sainte-Rita",
        slug: "sainte-rita",
        commune: "Cotonou",
        latitude: 6.3762,
        longitude: 2.4089,
        landmarks: ["Carrefour Sainte-Rita", "Église Sainte-Rita", "Clinique Mahouna", "Marché Sainte-Rita"],
      },
      {
        name: "Saint-Michel",
        slug: "saint-michel",
        commune: "Cotonou",
        latitude: 6.3654,
        longitude: 2.4271,
        landmarks: ["Église Saint-Michel", "Face Clinique Boni", "Avenue Steinmetz", "Grand Marché Dantokpa"],
      },
      {
        name: "Menontin",
        slug: "menontin",
        commune: "Cotonou",
        latitude: 6.3812,
        longitude: 2.3889,
        landmarks: ["Hôpital de Zone Menontin", "Marché Menontin", "Carrefour Menontin"],
      },
      {
        name: "Agla",
        slug: "agla",
        commune: "Cotonou",
        latitude: 6.3785,
        longitude: 2.3755,
        landmarks: ["Carrefour Agla Les Pylônes", "Goudron Agla", "Pharmacie Agla"],
      },
    ],
  },
  {
    name: "Abomey-Calavi",
    slug: "abomey-calavi",
    department: "Atlantique",
    latitude: 6.4485,
    longitude: 2.3557,
    quarters: [
      {
        name: "Arconville",
        slug: "arconville",
        commune: "Abomey-Calavi",
        latitude: 6.4485,
        longitude: 2.3557,
        landmarks: ["Près Carrefour IITA Calavi", "Face Station JNP Calavi", "Calavi Kpota"],
      },
      {
        name: "Calavi Kpota",
        slug: "calavi-kpota",
        commune: "Abomey-Calavi",
        latitude: 6.4451,
        longitude: 2.3612,
        landmarks: ["Marché Calavi Kpota", "Carrefour Kpota", "Carrefour Arconville"],
      },
      {
        name: "Godomey-Togoudo",
        slug: "godomey-togoudo",
        commune: "Abomey-Calavi",
        latitude: 6.4012,
        longitude: 2.3395,
        landmarks: ["Échangeur de Godomey", "Carrefour Dépôt", "Station Bénin Petro Godomey"],
      },
      {
        name: "Tankpè",
        slug: "tankpe",
        commune: "Abomey-Calavi",
        latitude: 6.4255,
        longitude: 2.3289,
        landmarks: ["Carrefour Tankpè", "Goudron Tankpè", "Carrefour Séminaire"],
      },
      {
        name: "Zogbadjè",
        slug: "zogbadje",
        commune: "Abomey-Calavi",
        latitude: 6.4385,
        longitude: 2.3421,
        landmarks: ["Campus Universitaire UAC", "Entrée Principale UAC", "Carrefour Zogbadjè"],
      },
    ],
  },
  {
    name: "Porto-Novo",
    slug: "porto-novo",
    department: "Ouémé",
    latitude: 6.4969,
    longitude: 2.6289,
    quarters: [
      {
        name: "Avakpa",
        slug: "avakpa",
        commune: "Porto-Novo",
        latitude: 6.4912,
        longitude: 2.6212,
        landmarks: ["Carrefour Cinquantenaire", "Stade Charles de Gaulle", "Marché Ouando"],
      },
      {
        name: "Tokpota",
        slug: "tokpota",
        commune: "Porto-Novo",
        latitude: 6.5123,
        longitude: 2.6315,
        landmarks: ["Carrefour Tokpota", "Lycée Béhanzin", "Carrefour Catchi"],
      },
      {
        name: "Ouando",
        slug: "ouando",
        commune: "Porto-Novo",
        latitude: 6.5215,
        longitude: 2.6189,
        landmarks: ["Grand Marché de Ouando", "Carrefour Ouando", "Gare routière"],
      },
    ],
  },
];

// =========================================================================
// CATÉGORIES DE MÉTIERS (CONFORME TAXONOMIE BÉNIN)
// =========================================================================

export const CATEGORIES: Category[] = [
  {
    id: "cat_batiment",
    name: "Bâtiment & Dépannage",
    slug: "batiment-construction",
    description: "Plomberie, électricité, climatisation, carrelage et maçonnerie.",
    icon: "Hammer",
    displayOrder: 1,
    subcategories: [
      "Plomberie sanitaire",
      "Électricité bâtiment",
      "Climatisation & Froid",
      "Maçonnerie & Peinture",
      "Menuiserie alu & bois",
    ],
  },
  {
    id: "cat_mode",
    name: "Mode & Couture",
    slug: "mode-artisanat",
    description: "Stylisme béninois, confection Bazin/Kanvo, broderie et retouches.",
    icon: "Scissors",
    displayOrder: 2,
    subcategories: [
      "Couture homme & femme",
      "Stylisme & Broderie",
      "Pagne tissé Kanvo",
      "Maroquinerie & Chaussures",
    ],
  },
  {
    id: "cat_auto",
    name: "Auto & Mobilité",
    slug: "automobile-mobilite",
    description: "Mécanique auto/moto, diagnostic valise, dépannage et électricité auto.",
    icon: "Car",
    displayOrder: 3,
    subcategories: [
      "Mécanique générale",
      "Diagnostic valise OBD2",
      "Carrosserie & Tôlerie",
      "Dépannage express",
    ],
  },
  {
    id: "cat_numerique",
    name: "Numérique & Tech",
    slug: "numerique-creation",
    description: "Maintenance PC/Mac, réseaux Wi-Fi, caméras de surveillance et infographie.",
    icon: "Laptop",
    displayOrder: 4,
    subcategories: [
      "Maintenance informatique",
      "Réseaux & Caméras IP",
      "Graphisme & Flyers",
      "Création de sites vitrines",
    ],
  },
  {
    id: "cat_maison",
    name: "Maison & Entretien",
    slug: "maison-entretien",
    description: "Nettoyage fin de chantier, pressing canapés, électroménager et déménagement.",
    icon: "Home",
    displayOrder: 5,
    subcategories: [
      "Nettoyage résidentiel",
      "Dépannage électroménager",
      "Déménagement & Porteurs",
      "Jardinage & Espaces verts",
    ],
  },
];

// =========================================================================
// JOBEURS DÉMONSTRATION RÉELS (BÉNINOIS)
// =========================================================================

export const MOCK_JOBBERS: Jobber[] = [
  {
    id: "jobber_prof_dossou",
    name: "Sébastien Dossou",
    firstName: "Sébastien",
    lastName: "Dossou",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    headline: "Plombier Sanitaire Expert & Canalisations",
    trade: "Plombier Sanitaire",
    categorySlug: "batiment-construction",
    bio: "Artisan plombier avec 12 ans d'expérience dans le Grand Cotonou. Spécialisé dans les dépannages urgents de fuite d'eau, l'installation de sanitaires modernes, le débouchage haute pression et les chauffe-eau solaires. Travail soigné, réactif et garanti.",
    skills: ["Plomberie sanitaire", "Chauffe-eau solaire", "Débouchage express", "Tuyauterie PPR & multicouche"],
    legalStatus: "PARTICULIER",
    ifu: "0201810459812",
    phone: "+229 97 23 45 67",
    email: "sebastien.dossou@proxijob.bj",
    city: "Cotonou",
    quarter: "Akpakpa Dodomè",
    landmark: "Face Église Sacré-Cœur d'Akpakpa",
    latitude: 6.3685,
    longitude: 2.4502,
    serviceZones: ["Akpakpa", "Haie Vive", "Cadjèhoun", "Saint-Michel", "Plakodji"],
    hourlyRate: 8500,
    startingPrice: 15000,
    isAvailable: true,
    availabilityDetails: "Lun-Sam : 07h00 - 19h00 (Urgences 24/7)",
    averageRating: 4.95,
    totalReviews: 24,
    trustBadge: "LEVEL_2_IDENTITY",
    completedJobs: 48,
    responseRate: 98.5,
    responseTime: "< 15 min",
    isVerified: true,
    credits: 25,
    boostActiveUntil: "2026-10-15T23:59:59Z",
    portfolio: [
      {
        id: "port_dossou_01",
        title: "Rénovation plomberie et tuyauterie villa Haie Vive",
        description: "Remplacement complet de canalisations galvanisées corrodées par du PPR thermo-soudé haute pression avec vannes d'arrêt indépendantes.",
        avantUrl: "https://images.unsplash.com/photo-1542013936693-884638332954?w=800&auto=format&fit=crop&q=80",
        apresUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80",
        date: "Septembre 2026",
        isVerified: true,
      },
    ],
    reviews: [
      {
        id: "rev_dossou_01",
        requestId: "req_plomb_haievive_01",
        clientName: "Koffi Mensah",
        clientQuarter: "Haie Vive, Cotonou",
        rating: 5,
        qualite: 5,
        ponctualite: 5,
        prix: 5,
        communication: 5,
        comment: "Intervention remarquable de M. Dossou ! Arrivé en moins de 35 minutes à Haie Vive avec ses pièces de rechange d'origine. La fuite sous évier a été réparée proprement et la zone a été laissée impeccable. Je recommande vivement pour son sérieux !",
        date: "Il y a 3 jours",
        jobberReply: "Merci beaucoup M. Koffi pour votre accueil et votre confiance. Ce fut un plaisir de vous dépanner rapidement. Restant à votre entière disposition !",
        jobberReplyDate: "Il y a 2 jours",
        isVerifiedMission: true,
      },
      {
        id: "rev_dossou_02",
        requestId: "req_plomb_cadjehoun_prev",
        clientName: "Béatrice Alihonou",
        clientQuarter: "Cadjèhoun, Cotonou",
        rating: 4.9,
        qualite: 5,
        ponctualite: 5,
        prix: 4.8,
        communication: 5,
        comment: "Pose impeccable de notre robinetterie de salle de bains et test d'étanchéité réalisé avec minutie. Devis clair et respecté au franc près.",
        date: "Il y a 2 semaines",
        isVerifiedMission: true,
      },
    ],
  },
  {
    id: "jobber_prof_hounnou",
    name: "Brice Hounnou",
    firstName: "Brice",
    lastName: "Hounnou",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80",
    headline: "Électricien Bâtiment Certifié & Systèmes Solaires",
    trade: "Électricien Bâtiment",
    categorySlug: "batiment-construction",
    bio: "Ingénieur technicien en génie électrique. Mise aux normes de tableaux de distribution SBEE, installation d'onduleurs, batteries lithium et panneaux solaires photovoltaïques. Câblage de résidences privées et locaux commerciaux.",
    skills: ["Électricité bâtiment", "Tableaux SBEE", "Énergie Solaire", "Dépannage court-circuit"],
    legalStatus: "ENTREPRISE",
    companyName: "Hounnou Énergie & Services SARL",
    ifu: "3202111894215",
    rccm: "RB/COT/21 B 28914",
    phone: "+229 97 34 56 78",
    email: "brice.hounnou@proxijob.bj",
    city: "Cotonou",
    quarter: "Fidjrossè",
    landmark: "Carrefour Club des Rois",
    latitude: 6.3591,
    longitude: 2.3789,
    serviceZones: ["Fidjrossè", "Haie Vive", "Agla", "Cocotiers", "Calavi"],
    hourlyRate: 10000,
    startingPrice: 30000,
    isAvailable: true,
    availabilityDetails: "Lun-Ven : 08h00 - 18h00 | Sam : 08h00 - 14h00",
    averageRating: 4.88,
    totalReviews: 18,
    trustBadge: "LEVEL_3_EXPERT",
    completedJobs: 35,
    responseRate: 96.0,
    responseTime: "< 30 min",
    isVerified: true,
    credits: 40,
    boostActiveUntil: "2026-10-20T23:59:59Z",
    portfolio: [
      {
        id: "port_hounnou_01",
        title: "Remplacement tableau électrique vétuste à Fidjrossè",
        description: "Rénovation d'un coffret à fusibles porcelaine vers un tableau Legrand étanche avec disjoncteurs différentiels 30mA et parafoudre secteur.",
        avantUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
        apresUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80",
        date: "Août 2026",
        isVerified: true,
      },
    ],
    reviews: [
      {
        id: "rev_hounnou_01",
        requestId: "req_elec_haie_prev",
        clientName: "Dénis Agbo",
        clientQuarter: "Cocotiers, Cotonou",
        rating: 5,
        qualite: 5,
        ponctualite: 5,
        prix: 4.8,
        communication: 5,
        comment: "Excellent professionnel. Le diagnostic de surtension a été fait en 20 minutes avec un équipement de mesure de pointe. Plus aucune coupure inopinée.",
        date: "Il y a 1 semaine",
        isVerifiedMission: true,
      },
    ],
  },
  {
    id: "jobber_prof_zinsou",
    name: "Yannick Zinsou",
    firstName: "Yannick",
    lastName: "Zinsou",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80",
    headline: "Frigoriste Spécialiste Climatisation & Froid Commercial",
    trade: "Frigoriste & Climatisation",
    categorySlug: "batiment-construction",
    bio: "Spécialiste agréé en dépannage de splits Inverter (Samsung, LG, Gree, Midea) et chambres froides. Traitement antibactérien, détection ultrason des micro-fuites et recharge précise de gaz R410A et R32. Disponible 7j/7 pour les urgences froid.",
    skills: ["Climatisation Inverter", "Recharge gaz R410A / R32", "Chambre froide", "Entretien préventif"],
    legalStatus: "PARTICULIER",
    ifu: "0202211984533",
    phone: "+229 95 67 89 01",
    email: "yannick.zinsou@proxijob.bj",
    city: "Cotonou",
    quarter: "Saint-Michel",
    landmark: "Face Clinique Boni Saint-Michel",
    latitude: 6.3654,
    longitude: 2.4271,
    serviceZones: ["Saint-Michel", "Gbégamey", "Haie Vive", "Akpakpa", "Marjorelle"],
    hourlyRate: 12500,
    startingPrice: 12000,
    isAvailable: true,
    availabilityDetails: "Disponible 7j/7 pour les urgences froid",
    averageRating: 4.92,
    totalReviews: 27,
    trustBadge: "LEVEL_3_EXPERT",
    completedJobs: 53,
    responseRate: 99.0,
    responseTime: "< 20 min",
    isVerified: true,
    credits: 30,
    portfolio: [
      {
        id: "port_zinsou_01",
        title: "Décrassage et recharge split Inverter 1.5 CV",
        description: "Nettoyage chimique de l'évaporateur et condenseur encrassés par l'air marin de Cotonou, et appoint précis de 850g de gaz écologique.",
        avantUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
        apresUrl: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&auto=format&fit=crop&q=80",
        date: "Septembre 2026",
        isVerified: true,
      },
    ],
    reviews: [
      {
        id: "rev_zinsou_01",
        requestId: "req_clim_prev",
        clientName: "Amina Bello",
        clientQuarter: "Fidjrossè, Cotonou",
        rating: 5,
        qualite: 5,
        ponctualite: 5,
        prix: 4.8,
        communication: 5,
        comment: "Le climatiseur du salon était à l'arrêt depuis 3 jours. Yannick est venu avec son manomètre et a remis l'appareil à neuf. Température glaciale retrouvée !",
        date: "Il y a 5 jours",
        jobberReply: "Merci Mme Amina ! Pensez à dépoussiérer les filtres lavables une fois par mois pour préserver le compresseur.",
        jobberReplyDate: "Il y a 4 jours",
        isVerifiedMission: true,
      },
    ],
  },
  {
    id: "jobber_prof_agossa",
    name: "Chantal Agossa",
    firstName: "Chantal",
    lastName: "Agossa",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
    headline: "Styliste Modéliste & Confection Haute Couture Béninoise",
    trade: "Couturière & Styliste",
    categorySlug: "mode-artisanat",
    bio: "Styliste diplômée avec atelier moderne à Cadjèhoun. Création de tenues traditionnelles chic (Agbada, Kaba, tailleurs en pagne tissé Kanvo d'Abomey), broderies fines sur bazin riche et robes de mariée sur mesure.",
    skills: ["Couture femme & homme", "Tissu Kanvo", "Broderie moderne", "Retouches express"],
    legalStatus: "PARTICULIER",
    ifu: "1201910543201",
    phone: "+229 96 45 67 89",
    email: "chantal.agossa@proxijob.bj",
    city: "Cotonou",
    quarter: "Cadjèhoun",
    landmark: "Derrière le Collège Père Aupiais",
    latitude: 6.3615,
    longitude: 2.4095,
    serviceZones: ["Cadjèhoun", "Haie Vive", "Gbégamey", "Kouhounou", "Zogbo"],
    hourlyRate: 12000,
    startingPrice: 20000,
    isAvailable: true,
    availabilityDetails: "Mar-Sam : 09h00 - 19h00 sur rendez-vous",
    averageRating: 5.0,
    totalReviews: 31,
    trustBadge: "LEVEL_2_IDENTITY",
    completedJobs: 62,
    responseRate: 100.0,
    responseTime: "< 10 min",
    isVerified: true,
    credits: 50,
    portfolio: [
      {
        id: "port_agossa_01",
        title: "Création Kanvo pour mariage traditionnel à Cadjèhoun",
        description: "Conception complète d'un ensemble pour mariés en pagne traditionnel Kanvo tissé main avec broderies dorées au col.",
        avantUrl: "https://images.unsplash.com/photo-1520006403909-838d6b92c22e?w=800&auto=format&fit=crop&q=80",
        apresUrl: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80",
        date: "Août 2026",
        isVerified: true,
      },
    ],
    reviews: [
      {
        id: "rev_agossa_01",
        requestId: "req_couture_prev",
        clientName: "Sika Gbaguidi",
        clientQuarter: "Haie Vive, Cotonou",
        rating: 5,
        qualite: 5,
        ponctualite: 5,
        prix: 5,
        communication: 5,
        comment: "Finition digne d'une grande maison de couture internationale ! Les finitions intérieures du kaba sont impeccables. La livraison a été faite 2 jours avant l'événement.",
        date: "Il y a 3 semaines",
        isVerifiedMission: true,
      },
    ],
  },
  {
    id: "jobber_prof_lokossou",
    name: "Marc Lokossou",
    firstName: "Marc",
    lastName: "Lokossou",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80",
    headline: "Mécanicien Auto Polyvalent & Diagnostic Valise OBD2",
    trade: "Mécanicien Auto",
    categorySlug: "automobile-mobilite",
    bio: "Garage moderne équipé de valises multimarques OBD2 (Toyota, Hyundai, Mercedes, Peugeot). Révision générale, réfection de boîtes automatiques et manuelles, injecteurs diesel et assistance dépannage à domicile dans le Grand Calavi.",
    skills: ["Diagnostic valise OBD2", "Mécanique générale", "Freinage ABS", "Vidange & Filtres"],
    legalStatus: "ENTREPRISE",
    companyName: "Garage de la Renaissance Calavi",
    ifu: "2202011782390",
    rccm: "RB/CAL/20 A 1145",
    phone: "+229 97 56 78 90",
    email: "marc.lokossou@proxijob.bj",
    city: "Abomey-Calavi",
    quarter: "Arconville",
    landmark: "Près du Carrefour IITA Calavi",
    latitude: 6.4485,
    longitude: 2.3557,
    serviceZones: ["Arconville", "Calavi Kpota", "Godomey", "Togoudo", "Akassato"],
    hourlyRate: 15000,
    startingPrice: 15000,
    isAvailable: true,
    availabilityDetails: "Lun-Sam : 07h30 - 18h30",
    averageRating: 4.82,
    totalReviews: 19,
    trustBadge: "LEVEL_2_IDENTITY",
    completedJobs: 41,
    responseRate: 94.0,
    responseTime: "< 45 min",
    isVerified: true,
    credits: 15,
    portfolio: [
      {
        id: "port_lokossou_01",
        title: "Remise en état train avant et amortisseurs Toyota RAV4",
        description: "Remplacement silentblocs, rotules de direction et purge complète du circuit de freinage avec contrôle géométrie.",
        avantUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=800&auto=format&fit=crop&q=80",
        apresUrl: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800&auto=format&fit=crop&q=80",
        date: "Juillet 2026",
        isVerified: true,
      },
    ],
    reviews: [
      {
        id: "rev_lokossou_01",
        requestId: "req_auto_prev",
        clientName: "Fabrice Houessou",
        clientQuarter: "Tankpè, Calavi",
        rating: 5,
        qualite: 5,
        ponctualite: 4.8,
        prix: 4.7,
        communication: 4.9,
        comment: "Marc a trouvé la panne d'injecteur que deux autres garages n'arrivaient pas à diagnostiquer. Voiture récupérée le lendemain, moteur tourne comme une horloge.",
        date: "Il y a 1 mois",
        isVerifiedMission: true,
      },
    ],
  },
  {
    // Profil Hybride de Référence (ACC-01)
    id: "jobber_prof_bio",
    name: "Bio Bio Gounou",
    firstName: "Bio",
    lastName: "Gounou",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80",
    headline: "Technicien Réseaux, Wi-Fi & Maintenance PC à Domicile",
    trade: "Technicien Réseaux & Informatique",
    categorySlug: "numerique-creation",
    bio: "Utilisateur hybride actif sur ProxiJob : je commande des services pour ma maison et je propose mes compétences d'assistance informatique à domicile. Dépannage Windows/Mac, extension Wi-Fi maillé et installation caméras solaires.",
    skills: ["Maintenance informatique", "Câblage réseau", "Configuration Wi-Fi", "Diagnostic PC"],
    legalStatus: "PARTICULIER",
    phone: "+229 97 11 22 44",
    email: "bio.gounou@proxijob.bj",
    city: "Cotonou",
    quarter: "Fidjrossè",
    landmark: "Face Pharmacie du Calvaire Fidjrossè",
    latitude: 6.3595,
    longitude: 2.3792,
    serviceZones: ["Fidjrossè", "Haie Vive", "Agla", "Cadjèhoun"],
    hourlyRate: 8000,
    startingPrice: 10000,
    isAvailable: true,
    availabilityDetails: "Lun-Sam : 08h00 - 18h00",
    averageRating: 4.88,
    totalReviews: 9,
    trustBadge: "LEVEL_1_PHONE",
    completedJobs: 14,
    responseRate: 97.0,
    responseTime: "< 25 min",
    isVerified: true,
    credits: 10,
    portfolio: [
      {
        id: "port_bio_01",
        title: "Installation Wi-Fi Mesh haut débit villa 2 étages",
        description: "Déploiement de bornes maillées sans perte de débit entre le rez-de-chaussée et l'étage pour le télétravail.",
        avantUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80",
        apresUrl: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800&auto=format&fit=crop&q=80",
        date: "Septembre 2026",
        isVerified: true,
      },
    ],
    reviews: [
      {
        id: "rev_bio_01",
        requestId: "req_wifi_prev",
        clientName: "Rosine Tossou",
        clientQuarter: "Agla, Cotonou",
        rating: 5,
        qualite: 5,
        ponctualite: 5,
        prix: 5,
        communication: 5,
        comment: "Intervention rapide et pédagogique. Toute la maison capte désormais la fibre à 100%. Merci Bio !",
        date: "Il y a 6 jours",
        isVerifiedMission: true,
      },
    ],
  },
];

// =========================================================================
// DEMANDES DE SERVICE DÉMONSTRATION (AVEC ÉTATS RÉELS)
// =========================================================================

export const MOCK_REQUESTS: ServiceRequest[] = [
  {
    id: "req_plomb_haievive_01",
    clientId: "usr_client_koffi",
    clientName: "Koffi Mensah",
    clientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    clientPhone: "+229 96 11 22 33",
    title: "Fuite importante sous évier cuisine et canalisation bouchée",
    description: "De l'eau s'écoule continuellement sous le meuble de cuisine depuis ce matin. Risque d'inondation du séjour. Recherche artisan disponible immédiatement pour réparer la fuite et déboucher le siphon central.",
    category: "Bâtiment & Dépannage",
    subcategory: "Plomberie sanitaire",
    city: "Cotonou",
    quarter: "Haie Vive",
    landmark: "Face Pharmacie Camp Guézo, 2ème ruelle après l'école",
    latitude: 6.3533,
    longitude: 2.4182,
    estimatedBudget: 20000,
    isUrgent: true,
    createdAt: "2026-09-28T09:15:00Z",
    deadline: "Terminée le 28/09/2026",
    status: "COMPLETED", // Mission terminée -> Débloque avis certifié ACC-08
    proposalsCount: 3,
    photos: ["https://images.unsplash.com/photo-1542013936693-884638332954?w=800&auto=format&fit=crop&q=80"],
    proposals: [
      {
        id: "prop_dossou_req1",
        requestId: "req_plomb_haievive_01",
        jobberId: "jobber_prof_dossou",
        jobberName: "Sébastien Dossou",
        jobberAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
        jobberTrade: "Plombier Sanitaire",
        jobberRating: 4.95,
        amount: 18500,
        delayDays: 1,
        message: "Bonjour M. Koffi. Je suis disponible immédiatement à Akpakpa avec tout le matériel. Mon intervention comprend le démontage du siphon, le débouchage et le remplacement du flexible inox garanti.",
        status: "ACCEPTED",
        createdAt: "2026-09-28T09:30:00Z",
        acceptedAt: "2026-09-28T09:45:00Z",
      },
    ],
  },
  {
    id: "req_clim_fidjrosse_02",
    clientId: "usr_client_amina",
    clientName: "Amina Bello",
    clientAvatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80",
    clientPhone: "+229 95 44 55 66",
    title: "Entretien 2 splits Inverter et recharge gaz climatiseur salon",
    description: "Le climatiseur du salon ne souffle plus d'air froid depuis trois jours. Le voyant clignote en rouge. Besoin d'un frigoriste certifié pour diagnostic, nettoyage des filtres et appoint de fluide frigorigène.",
    category: "Bâtiment & Dépannage",
    subcategory: "Climatisation & Froid",
    city: "Cotonou",
    quarter: "Fidjrossè",
    landmark: "Fidjrossè Calvaire, Immeuble vitré bleu à côté de la boulangerie",
    latitude: 6.3591,
    longitude: 2.3789,
    estimatedBudget: 25000,
    isUrgent: false,
    createdAt: "2026-10-01T08:00:00Z",
    deadline: "Aujourd'hui avant 18h",
    status: "IN_PROGRESS", // Devis accepté, en cours
    proposalsCount: 2,
    photos: ["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80"],
    proposals: [
      {
        id: "prop_zinsou_req2",
        requestId: "req_clim_fidjrosse_02",
        jobberId: "jobber_prof_zinsou",
        jobberName: "Yannick Zinsou",
        jobberAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80",
        jobberTrade: "Frigoriste & Climatisation",
        jobberRating: 4.92,
        amount: 22000,
        delayDays: 1,
        message: "Bonjour Mme Amina. Je me déplace avec ma station de charge frigorifique et mon manomètre. Le devis comprend le diagnostic complet de fuite d'azote, le nettoyage et la recharge en R410A.",
        status: "ACCEPTED",
        createdAt: "2026-10-01T08:45:00Z",
        acceptedAt: "2026-10-01T09:10:00Z",
      },
    ],
  },
  {
    id: "req_elec_cadjehoun_03",
    clientId: "usr_client_koffi",
    clientName: "Koffi Mensah",
    clientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    clientPhone: "+229 96 11 22 33",
    title: "Installation d'un inverseur de source automatique pour groupe électrogène",
    description: "Suite aux coupures fréquentes, je souhaite installer un boîtier d'inversion automatique entre l'alimentation SBEE et mon groupe de 5kVA. Devis demandé pour fourniture du coffret et pose sous gaine.",
    category: "Bâtiment & Dépannage",
    subcategory: "Électricité bâtiment",
    city: "Cotonou",
    quarter: "Cadjèhoun",
    landmark: "Près de l'Ambassade des USA",
    latitude: 6.3615,
    longitude: 2.4095,
    estimatedBudget: 45000,
    isUrgent: false,
    createdAt: "2026-10-01T11:20:00Z",
    deadline: "D'ici 3 jours",
    status: "OPEN", // Ouverte, en attente de candidatures
    proposalsCount: 2,
    photos: [],
    proposals: [
      {
        id: "prop_hounnou_req3",
        requestId: "req_elec_cadjehoun_03",
        jobberId: "jobber_prof_hounnou",
        jobberName: "Brice Hounnou",
        jobberAvatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80",
        jobberTrade: "Électricien Bâtiment",
        jobberRating: 4.88,
        amount: 42000,
        delayDays: 2,
        message: "Bonjour M. Koffi. Je dispose de contacteurs modulaires Hager 40A avec temporisateur 10s pour protéger vos appareils sensibles. Pose en une demi-journée.",
        status: "PENDING",
        createdAt: "2026-10-01T12:05:00Z",
      },
    ],
  },
  {
    id: "req_meca_calavi_04",
    clientId: "usr_client_valentin",
    clientName: "Valentin Houndégnon",
    clientAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    clientPhone: "+229 97 88 99 00",
    title: "Voyant moteur allumé et perte de puissance sur Toyota Corolla",
    description: "La voiture broute à l'accélération sur la route de Calavi Kpota. Besoin d'un diagnostic valise complet à domicile pour identifier le code défaut avant de commander des pièces.",
    category: "Auto & Mobilité",
    subcategory: "Diagnostic valise OBD2",
    city: "Abomey-Calavi",
    quarter: "Calavi Kpota",
    landmark: "Face Station JNP Calavi",
    latitude: 6.4451,
    longitude: 2.3612,
    estimatedBudget: 15000,
    isUrgent: true,
    createdAt: "2026-10-01T13:40:00Z",
    deadline: "Aujourd'hui impératif",
    status: "OPEN",
    proposalsCount: 1,
    photos: [],
  },
  {
    id: "req_couture_cotonou_05",
    clientId: "usr_client_amina",
    clientName: "Amina Bello",
    clientAvatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80",
    clientPhone: "+229 95 44 55 66",
    title: "Confection 3 tenues de demoiselles d'honneur en pagne tissé Kanvo",
    description: "Mariage prévu dans 3 semaines. Les pagnes Kanvo d'Abomey sont déjà achetés. Recherche styliste modéliste minutieuse pour prise de mesures, patronage et couture avec doublure satinée.",
    category: "Mode & Couture",
    subcategory: "Pagne tissé Kanvo",
    city: "Cotonou",
    quarter: "Haie Vive",
    landmark: "Place du Souvenir, Rue des Ambassades",
    latitude: 6.3533,
    longitude: 2.4182,
    estimatedBudget: 60000,
    isUrgent: false,
    createdAt: "2026-09-30T16:00:00Z",
    deadline: "Sous 15 jours",
    status: "OPEN",
    proposalsCount: 2,
    photos: ["https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80"],
  },
];

// =========================================================================
// CONVERSATIONS DÉMO AVEC MASQUAGE ALGORITHMIQUE (ACC-06 & ACC-07)
// =========================================================================

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv_req1",
    requestId: "req_plomb_haievive_01",
    requestTitle: "Fuite importante sous évier cuisine (Haie Vive)",
    jobberId: "jobber_prof_dossou",
    jobberName: "Sébastien Dossou",
    jobberAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    clientId: "usr_client_koffi",
    clientName: "Koffi Mensah",
    clientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    isContactUnlocked: true, // Contacts débloqués car proposition acceptée !
    lastMessage: "Mission terminée et notée 5/5 étoiles. Merci beaucoup M. Koffi !",
    lastMessageTime: "28/09 - 14:30",
    unreadCount: 0,
    messages: [
      {
        id: "msg_1",
        senderId: "usr_client_koffi",
        senderRole: "client",
        contentOriginal: "Bonjour M. Dossou, la fuite s'est aggravée sous le meuble. Pouvez-vous intervenir ce matin vers 10h ?",
        contentFiltered: "Bonjour M. Dossou, la fuite s'est aggravée sous le meuble. Pouvez-vous intervenir ce matin vers 10h ?",
        isMasked: false,
        timestamp: "09:20",
      },
      {
        id: "msg_2",
        senderId: "jobber_prof_dossou",
        senderRole: "jobber",
        contentOriginal: "Bonjour M. Koffi, bien reçu. Vous pouvez m'appeler au 97234567 dès que vous acceptez le devis.",
        // Illustre le déblocage une fois accepté (ou masquage avant accord)
        contentFiltered: "Bonjour M. Koffi, bien reçu. Vous pouvez m'appeler au +229 97 23 45 67.",
        isMasked: false,
        timestamp: "09:32",
      },
      {
        id: "msg_3",
        senderId: "usr_client_koffi",
        senderRole: "client",
        contentOriginal: "Devis de 18 500 FCFA validé sur ProxiJob ! Nos coordonnées sont débloquées. Je vous attends à Haie Vive.",
        contentFiltered: "Devis de 18 500 FCFA validé sur ProxiJob ! Nos coordonnées sont débloquées. Je vous attends à Haie Vive.",
        isMasked: false,
        timestamp: "09:46",
      },
    ],
  },
  {
    id: "conv_req3",
    requestId: "req_elec_cadjehoun_03",
    requestTitle: "Inverseur de source automatique (Cadjèhoun)",
    jobberId: "jobber_prof_hounnou",
    jobberName: "Brice Hounnou",
    jobberAvatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80",
    clientId: "usr_client_koffi",
    clientName: "Koffi Mensah",
    clientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    isContactUnlocked: false, // DEVIS ENCORE PENDING -> COORDONNÉES MASQUÉES STRICTEMENT !
    lastMessage: "Pourriez-vous préciser si le groupe est monophasé ou triphasé ?",
    lastMessageTime: "12:15",
    unreadCount: 1,
    messages: [
      {
        id: "msg_301",
        senderId: "jobber_prof_hounnou",
        senderRole: "jobber",
        contentOriginal: "Bonjour M. Koffi, j'ai postulé à votre demande. Pourriez-vous préciser si le groupe est monophasé ou triphasé ?",
        contentFiltered: "Bonjour M. Koffi, j'ai postulé à votre demande. Pourriez-vous préciser si le groupe est monophasé ou triphasé ?",
        isMasked: false,
        timestamp: "12:08",
      },
      {
        id: "msg_302",
        senderId: "usr_client_koffi",
        senderRole: "client",
        // Exemple montrant le masquage automatique ACC-06
        contentOriginal: "Monophasé 5kVA. Si besoin vous pouvez m'appeler au 96112233 ou sur WhatsApp wa.me/22996112233.",
        contentFiltered: "Monophasé 5kVA. Si besoin vous pouvez m'appeler au [numéro masqué avant accord] ou sur WhatsApp [lien masqué avant accord].",
        isMasked: true,
        timestamp: "12:12",
      },
    ],
  },
];

// =========================================================================
// DEMANDES DE CERTIFICATION PROXYTRUST POUR LA CONSOLE ADMIN (V3)
// =========================================================================

export const MOCK_VERIFICATIONS: VerificationRequest[] = [
  {
    id: "verif_dossou_cip",
    jobberId: "jobber_prof_dossou",
    jobberName: "Sébastien Dossou",
    jobberAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    trade: "Plombier Sanitaire",
    type: "CIP",
    documentNumber: "CIP-2022-8745-9012",
    documentUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80",
    status: "VERIFIED",
    submittedAt: "2026-09-01T10:00:00Z",
    comment: "Certificat d'Identification Personnelle ANIP Bénin validé conforme.",
  },
  {
    id: "verif_hounnou_rccm",
    jobberId: "jobber_prof_hounnou",
    jobberName: "Brice Hounnou",
    jobberAvatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80",
    trade: "Électricien Bâtiment",
    type: "RCCM",
    documentNumber: "RB/COT/21 B 28914",
    documentUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80",
    status: "VERIFIED",
    submittedAt: "2026-09-10T14:30:00Z",
    comment: "RCCM et IFU vérifiés sur monentreprise.bj.",
  },
  {
    id: "verif_zinsou_diplome",
    jobberId: "jobber_prof_zinsou",
    jobberName: "Yannick Zinsou",
    jobberAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80",
    trade: "Frigoriste Climatisation",
    type: "DIPLOME",
    documentNumber: "CAP-FROID-2016-041",
    documentUrl: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600&auto=format&fit=crop&q=80",
    status: "PENDING", // En attente d'approbation dans la console admin
    submittedAt: "2026-10-01T07:15:00Z",
    comment: "CAP Froid & Climatisation délivré par le Ministère de l'Enseignement Technique du Bénin.",
  },
  {
    id: "verif_agossa_ifu",
    jobberId: "jobber_prof_agossa",
    jobberName: "Chantal Agossa",
    jobberAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
    trade: "Couturière Styliste",
    type: "IFU",
    documentNumber: "1201910543201",
    documentUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80",
    status: "PENDING", // En attente
    submittedAt: "2026-10-01T09:40:00Z",
    comment: "Attestation IFU DGI Bénin pour activité de confection textile.",
  },
];

export const MOCK_AUDIT_LOGS: ModerationAuditLog[] = [
  {
    id: "log_1",
    adminName: "Super Admin ProxiJob",
    action: "APPROVE_VERIFICATION",
    targetType: "VERIFICATION_CIP",
    targetName: "Sébastien Dossou (Plomberie)",
    motif: "Vérification ANIP CIP 2022-8745-9012 validée conforme.",
    date: "01/10/2026 à 10:14",
  },
  {
    id: "log_2",
    adminName: "Super Admin ProxiJob",
    action: "MODERATE_PHOTO",
    targetType: "PORTFOLIO",
    targetName: "Photo chantier plomberie",
    motif: "Qualité HD conforme et validation du comparateur Avant/Après.",
    date: "30/09/2026 à 16:40",
  },
  {
    id: "log_3",
    adminName: "Super Admin ProxiJob",
    action: "BOOST_ACCOUNT",
    targetType: "CREDITS",
    targetName: "Brice Hounnou",
    motif: "Pack Visibilité 7 jours activé via crédits d'amorçage.",
    date: "29/09/2026 à 11:22",
  },
];

// =========================================================================
// UTILITAIRES MÉTIER : PROXIMITÉ SANS CARTE & MASQUAGE DE CONTACTS
// =========================================================================

/**
 * Calcul de distance Haversine en kilomètres (ACC-03)
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const dist = R * c;
  return Math.round(dist * 10) / 10;
}

/**
 * Algorithme de masquage des coordonnées avant contractualisation (ACC-06 & ACC-07)
 * Détecte les numéros de téléphone béninois (+229, 8 chiffres, 10 chiffres), les adresses email et les liens WhatsApp
 */
export function maskSensitiveContacts(text: string, isUnlocked: boolean): { filteredText: string; isMasked: boolean } {
  if (isUnlocked) {
    return { filteredText: text, isMasked: false };
  }

  // Regex pour numéros béninois et formats internationaux
  // +229 XX XX XX XX ou 97 XX XX XX ou 01 97 XX XX XX ou 8 à 10 chiffres consécutifs
  const phoneRegex = /(?:\+?229\s*)?(?:01\s*)?(?:9[0-9]|6[0-9]|5[0-9]|4[0-9]|2[0-9])(?:[\s.-]*\d{2}){3}|\b\d{8,10}\b/gi;

  // Regex pour emails
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;

  // Regex pour liens WhatsApp ou réseaux
  const linkRegex = /(?:https?:\/\/)?(?:wa\.me|api\.whatsapp\.com|chat\.whatsapp\.com)[^\s]+/gi;

  let masked = false;
  let result = text;

  if (linkRegex.test(result)) {
    result = result.replace(new RegExp(linkRegex.source, "gi"), "[lien masqué : •••••••• (devis requis)]");
    masked = true;
  }

  if (emailRegex.test(result)) {
    result = result.replace(new RegExp(emailRegex.source, "gi"), "[email masqué : ••••••••@•••• (devis requis)]");
    masked = true;
  }

  if (phoneRegex.test(result)) {
    result = result.replace(new RegExp(phoneRegex.source, "gi"), "[numéro masqué : •••••••• (devis requis)]");
    masked = true;
  }

  return {
    filteredText: result,
    isMasked: masked,
  };
}

/**
 * Formatage des montants en Francs CFA
 */
export function formatFCFA(amount: number): string {
  return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA";
}
