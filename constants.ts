// Route Paths
export const ROUTE_PATHS = {
  LOGIN: "/login",
  REGISTER: "/register",
  CREATE_COMPANY: "/create-company",
  SUBSCRIPTION: "/subscribe", // New subscription page path
  DASHBOARD: "/dashboard",
  
  CONSERVATION_CERTIFICATES: "/conservation-certificates",
  NEW_CONSERVATION_CERTIFICATE: "/conservation-certificates/new",
  EDIT_CONSERVATION_CERTIFICATE: "/conservation-certificates/:id/edit",

  SELF_PROTECTION_SYSTEMS: "/self-protection-systems",
  NEW_SELF_PROTECTION_SYSTEM: "/self-protection-systems/new",
  EDIT_SELF_PROTECTION_SYSTEM: "/self-protection-systems/:id/edit",

  QR_ELEVATORS: "/qr-elevators",
  UPLOAD_QR_ELEVATORS: "/qr-elevators/upload",

  QR_WATER_HEATERS: "/qr-water-heaters",
  UPLOAD_QR_WATER_HEATERS: "/qr-water-heaters/upload",

  QR_FIRE_SAFETY: "/qr-fire-safety",
  UPLOAD_QR_FIRE_SAFETY: "/qr-fire-safety/upload",

  QR_DETECTION: "/qr-detection",
  UPLOAD_QR_DETECTION: "/qr-detection/upload",

  EVENT_INFORMATION: "/event-information",
  NEW_EVENT_INFORMATION: "/event-information/new",
  EDIT_EVENT_INFORMATION: "/event-information/:id/edit",
  
  SETTINGS: "/settings",

  // New Modules
  WATER_TANKS: "/water-tanks",
  PLANT_SPECIES: "/plant-species",
  SANITIZATION: "/sanitization",
  ELECTRICAL_INSTALLATIONS: "/electrical-installations",
  UPLOAD_ELECTRICAL_INSTALLATIONS: "/electrical-installations/upload",
};

// Module Titles (used for pages and QR types)
export const MODULE_TITLES = {
  CONSERVATION_CERTIFICATES: "Certificado de Conservación",
  SELF_PROTECTION_SYSTEMS: "Sistema de Autoprotección",
  QR_ELEVATORS: "QR Ascensores",
  QR_WATER_HEATERS: "QR Termotanques y Caldera",
  QR_FIRE_SAFETY: "QR Instalación Fija Contra Incendios",
  QR_DETECTION: "QR Detección",
  EVENT_INFORMATION: "Información del Evento",
  SETTINGS: "Configuración",
  DASHBOARD: "Dashboard",

  // New Modules
  WATER_TANKS: "Tanque de Agua",
  PLANT_SPECIES: "Especies Vegetales",
  SANITIZATION: "Sanitización, Desinsectación, Fumigación y Desratización",
  ELECTRICAL_INSTALLATIONS: "Medición de puesta a tierra",
};

export const MOCK_USER_ID = "user-123";
export const MOCK_COMPANY_ID = "company-abc";