
import { User, Company, ConservationCertificate, SelfProtectionSystem, QRDocument, QRDocumentType, EventInformation, Employee } from '../../types';
import { MOCK_USER_ID, MOCK_COMPANY_ID } from '../../constants';

// Simulate a delay to mimic network latency
const simulateDelay = <T,>(data: T, delay: number = 500): Promise<T> =>
  new Promise(resolve => setTimeout(() => resolve(data), delay));

// In-memory store
let mockUser: User | null = null;
let mockCompany: Company | null = null;
let mockCertificates: ConservationCertificate[] = [];
let mockSelfProtectionSystems: SelfProtectionSystem[] = [];
let mockQRDocuments: QRDocument[] = [];
let mockEvents: EventInformation[] = [];

// --- Auth ---
export const login = async (email: string, _password: string): Promise<User> => {
  if (email === "user@example.com") { 
    mockUser = { id: MOCK_USER_ID, name: "Usuario Ejemplo", email };
    const existingCompany = await getCompanyByUserId(MOCK_USER_ID).catch(() => null);
    mockCompany = existingCompany; 
    return simulateDelay(mockUser, 500);
  }
  return Promise.reject(new Error("Credenciales inválidas"));
};

export const register = async (name: string, email: string, _password: string): Promise<User> => {
  mockUser = { id: MOCK_USER_ID, name, email }; 
  mockCompany = null; 
  return simulateDelay(mockUser, 500);
};

export const logout = async (): Promise<void> => {
  mockUser = null;
  mockCompany = null;
  // Clear all data on logout
  mockCertificates = [];
  mockSelfProtectionSystems = [];
  mockQRDocuments = [];
  mockEvents = [];
  return simulateDelay(undefined, 200);
};

export const getCurrentUser = async (): Promise<User | null> => {
  return simulateDelay(mockUser, 100);
};

// --- Company ---
export const createCompany = async (companyData: Omit<Company, 'id' | 'userId' | 'employees' | 'isSubscribed' | 'selectedPlan'>): Promise<Company> => {
  if (!mockUser) return Promise.reject(new Error("Usuario no autenticado"));
  mockCompany = { 
    ...companyData, 
    id: MOCK_COMPANY_ID, 
    userId: mockUser.id,
    employees: [
      { id: 'emp-0', name: mockUser.name, email: mockUser.email, role: 'Administrador' }
    ],
    isSubscribed: false,
    selectedPlan: undefined,
  };
  return simulateDelay(JSON.parse(JSON.stringify(mockCompany)), 700);
};

export const getCompanyByUserId = async (userId: string): Promise<Company> => {
  if (mockCompany && mockCompany.userId === userId) {
    return simulateDelay(JSON.parse(JSON.stringify(mockCompany)), 300);
  }
  return Promise.reject(new Error("Empresa no encontrada"));
};

export const updateCompany = async (companyData: Partial<Company>): Promise<Company> => {
  if (!mockCompany) return Promise.reject(new Error("Empresa no encontrada"));
  mockCompany = { ...mockCompany, ...companyData };
  return simulateDelay(JSON.parse(JSON.stringify(mockCompany)), 500);
};

export const subscribeCompany = async (companyId: string, plan: string, _paymentDetails: any): Promise<Company> => {
  if (!mockCompany || mockCompany.id !== companyId) {
    return Promise.reject(new Error("Empresa no encontrada para suscribir"));
  }
  mockCompany.isSubscribed = true;
  mockCompany.selectedPlan = plan;
  return simulateDelay(JSON.parse(JSON.stringify(mockCompany)), 600);
};

// --- Employees (part of Company) ---
export const addEmployee = async (employee: Omit<Employee, 'id'>): Promise<Employee> => {
  if (!mockCompany) return Promise.reject(new Error("Empresa no encontrada"));
  const newEmployee: Employee = { ...employee, id: `emp-${Date.now()}` };
  mockCompany.employees.push(newEmployee);
  await updateCompany({ employees: mockCompany.employees });
  return simulateDelay(newEmployee);
};

export const updateEmployee = async (employee: Employee): Promise<Employee> => {
  if (!mockCompany) return Promise.reject(new Error("Empresa no encontrada"));
  const index = mockCompany.employees.findIndex(e => e.id === employee.id);
  if (index === -1) return Promise.reject(new Error("Empleado no encontrado"));
  mockCompany.employees[index] = employee;
  await updateCompany({ employees: mockCompany.employees });
  return simulateDelay(employee);
};

export const deleteEmployee = async (employeeId: string): Promise<void> => {
  if (!mockCompany) return Promise.reject(new Error("Empresa no encontrada"));
  mockCompany.employees = mockCompany.employees.filter(e => e.id !== employeeId);
  await updateCompany({ employees: mockCompany.employees });
  return simulateDelay(undefined);
};

// --- Conservation Certificates ---
export const getCertificates = async (): Promise<ConservationCertificate[]> => {
  return simulateDelay(mockCertificates.filter(c => c.companyId === mockCompany?.id), 300);
};

export const createCertificate = async (certData: Omit<ConservationCertificate, 'id' | 'companyId'>): Promise<ConservationCertificate> => {
  if (!mockCompany) return Promise.reject(new Error("Empresa no asociada"));
  const newCert: ConservationCertificate = { ...certData, id: `cert-${Date.now()}`, companyId: mockCompany.id };
  mockCertificates.push(newCert);
  return simulateDelay(newCert, 500);
};

export const updateCertificate = async (certData: ConservationCertificate): Promise<ConservationCertificate> => {
  const index = mockCertificates.findIndex(c => c.id === certData.id);
  if (index === -1) return Promise.reject(new Error("Certificado no encontrado"));
  mockCertificates[index] = certData;
  return simulateDelay(certData, 500);
};

export const deleteCertificate = async (id: string): Promise<void> => {
  mockCertificates = mockCertificates.filter(c => c.id !== id);
  return simulateDelay(undefined, 300);
};

// --- Self Protection Systems ---
export const getSelfProtectionSystems = async (): Promise<SelfProtectionSystem[]> => {
  return simulateDelay(mockSelfProtectionSystems.filter(s => s.companyId === mockCompany?.id), 300);
};

export const createSelfProtectionSystem = async (systemData: Omit<SelfProtectionSystem, 'id' | 'companyId'>): Promise<SelfProtectionSystem> => {
  if (!mockCompany) return Promise.reject(new Error("Empresa no asociada"));
  const newSystem: SelfProtectionSystem = { ...systemData, id: `sps-${Date.now()}`, companyId: mockCompany.id };
  mockSelfProtectionSystems.push(newSystem);
  return simulateDelay(newSystem, 500);
};

export const updateSelfProtectionSystem = async (systemData: SelfProtectionSystem): Promise<SelfProtectionSystem> => {
  const index = mockSelfProtectionSystems.findIndex(s => s.id === systemData.id);
  if (index === -1) return Promise.reject(new Error("Sistema no encontrado"));
  mockSelfProtectionSystems[index] = systemData;
  return simulateDelay(systemData, 500);
};

export const deleteSelfProtectionSystem = async (id: string): Promise<void> => {
  mockSelfProtectionSystems = mockSelfProtectionSystems.filter(s => s.id !== id);
  return simulateDelay(undefined, 300);
};

// --- QR Documents ---
export const getQRDocuments = async (type: QRDocumentType): Promise<QRDocument[]> => {
  return simulateDelay(mockQRDocuments.filter(d => d.companyId === mockCompany?.id && d.type === type), 300);
};

export const getAllQRDocuments = async (): Promise<QRDocument[]> => {
  return simulateDelay(mockQRDocuments.filter(d => d.companyId === mockCompany?.id), 300);
};


const simulateOCR = async (_file: File): Promise<string> => {
  await simulateDelay(null, 1000); 
  const randomDaysAgo = Math.floor(Math.random() * 365);
  const date = new Date();
  date.setDate(date.getDate() - randomDaysAgo);
  return date.toISOString().split('T')[0]; 
};

export const uploadQRDocument = async (docData: Omit<QRDocument, 'id' | 'companyId' | 'extractedDate' | 'uploadDate' | 'pdfUrl'>): Promise<QRDocument> => {
  if (!mockCompany) return Promise.reject(new Error("Empresa no asociada"));
  if (!(docData.pdfFile instanceof File)) {
    return Promise.reject(new Error("Archivo PDF no proporcionado o inválido"));
  }

  const extractedDate = await simulateOCR(docData.pdfFile as File);
  const newDoc: QRDocument = {
    ...docData,
    id: `qr-${Date.now()}`,
    companyId: mockCompany.id,
    extractedDate,
    uploadDate: new Date().toISOString().split('T')[0],
    pdfUrl: URL.createObjectURL(docData.pdfFile as File), 
  };
  mockQRDocuments.push(newDoc);
  return simulateDelay(newDoc, 500);
};

export const deleteQRDocument = async (id: string): Promise<void> => {
  const doc = mockQRDocuments.find(d => d.id === id);
  if (doc && doc.pdfUrl && doc.pdfUrl.startsWith('blob:')) {
    URL.revokeObjectURL(doc.pdfUrl);
  }
  mockQRDocuments = mockQRDocuments.filter(d => d.id !== id);
  return simulateDelay(undefined, 300);
};

// --- Event Information ---
export const getEvents = async (): Promise<EventInformation[]> => {
  return simulateDelay(mockEvents.filter(e => e.companyId === mockCompany?.id), 300);
};

export const createEvent = async (eventData: Omit<EventInformation, 'id' | 'companyId'>): Promise<EventInformation> => {
  if (!mockCompany) return Promise.reject(new Error("Empresa no asociada"));
  const newEvent: EventInformation = { ...eventData, id: `event-${Date.now()}`, companyId: mockCompany.id };
  if (newEvent.physicalEvidence) {
    newEvent.physicalEvidence = (newEvent.physicalEvidence as (File|string)[]).map(f => (f instanceof File) ? f.name : f);
    newEvent.physicalEvidenceNames = (newEvent.physicalEvidence as string[]);
  }
  mockEvents.push(newEvent);
  return simulateDelay(newEvent, 500);
};

export const updateEvent = async (eventData: EventInformation): Promise<EventInformation> => {
  const index = mockEvents.findIndex(e => e.id === eventData.id);
  if (index === -1) return Promise.reject(new Error("Evento no encontrado"));
  if (eventData.physicalEvidence) {
    eventData.physicalEvidence = (eventData.physicalEvidence as (File|string)[]).map(f => (f instanceof File) ? f.name : f);
    eventData.physicalEvidenceNames = (eventData.physicalEvidence as string[]);
  }
  mockEvents[index] = eventData;
  return simulateDelay(eventData, 500);
};

export const deleteEvent = async (id: string): Promise<void> => {
  mockEvents = mockEvents.filter(e => e.id !== id);
  return simulateDelay(undefined, 300);
};

export const downloadEventPDF = async (event: EventInformation): Promise<void> => {
  console.log("Simulating PDF download for event:", event);
  alert(`Simulación: Descargando PDF para el evento del ${event.date}`);
  return simulateDelay(undefined, 100);
};