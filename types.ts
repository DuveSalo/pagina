export interface User {
  id: string;
  name: string;
  email: string;
}

export enum QRDocumentType {
  Elevators = "Ascensores",
  WaterHeaters = "Termotanques y Caldera",
  FireSafetySystem = "Instalación Fija Contra Incendios",
  DetectionSystem = "Detección",
  ElectricalInstallations = "Medición de puesta a tierra",
}

export type CompanyServices = {
  [QRDocumentType.Elevators]?: boolean;
  [QRDocumentType.WaterHeaters]?: boolean;
  [QRDocumentType.FireSafetySystem]?: boolean;
  [QRDocumentType.DetectionSystem]?: boolean;
  [QRDocumentType.ElectricalInstallations]?: boolean;
};

export interface Company {
  id: string;
  userId: string;
  name: string;
  cuit: string;
  ramaKey: string;
  ownerEntity: string;
  address: string;
  postalCode: string;
  city: string;
  province: string;
  country: string;
  locality: string; // Kept for mapping, can be same as city
  phone: string;
  employees: Employee[];
  isSubscribed?: boolean;
  selectedPlan?: string;
  services?: CompanyServices;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  email: string;
}

export interface ConservationCertificate {
  id: string;
  companyId: string;
  presentationDate: string;
  expirationDate: string;
  intervener: string;
  registrationNumber: string;
  pdfFile?: File | string;
  pdfFileName?: string;
}

export interface SelfProtectionSystem {
  id: string;
  companyId: string;
  probatoryDispositionDate?: string;
  probatoryDispositionPdf?: File | string;
  probatoryDispositionPdfName?: string;
  extensionDate?: string;
  extensionPdf?: File | string;
  extensionPdfName?: string;
  expirationDate: string;
  drills: { date: string; pdfFile?: File | string, pdfFileName?: string }[];
  intervener: string;
  registrationNumber: string;
}

export interface QRDocument {
  id: string;
  companyId: string;
  type: QRDocumentType;
  extractedDate: string;
  uploadDate: string;
  pdfFile: File | string;
  pdfFileName: string;
  pdfUrl?: string;
}

export interface EventInformation {
  id:string;
  companyId: string;
  date: string;
  time: string;
  description: string;
  correctiveActions: string;
  physicalEvidence?: (File | string)[];
  physicalEvidenceNames?: string[];
  testimonials: string[];
  observations: string[];
  finalChecks: { [key: string]: boolean };
}

export interface NavItem {
  path: string;
  label: string;
  icon: React.ReactElement<{ className?: string }>;
  service?: QRDocumentType; // For conditional rendering
}

export interface DynamicListItem {
  id: string;
  value: string;
}