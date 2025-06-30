
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import { ROUTE_PATHS, MODULE_TITLES } from '../constants';
import { QRDocumentType } from '../types';

// Layouts
import MainLayout from './components/layout/MainLayout';

// Page Components
import AuthPage from './pages/auth/AuthPage';
import CreateCompanyPage from './pages/auth/CreateCompanyPage';
import SubscriptionPage from './pages/auth/SubscriptionPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ConservationCertificateListPage from './pages/conservation-certificates/ConservationCertificateListPage';
import CreateEditConservationCertificatePage from './pages/conservation-certificates/CreateEditConservationCertificatePage';
import SelfProtectionSystemListPage from './pages/self-protection-systems/SelfProtectionSystemListPage';
import CreateEditSelfProtectionSystemPage from './pages/self-protection-systems/CreateEditSelfProtectionSystemPage';
import QRModuleListPage from './pages/qr/QRModuleListPage';
import UploadQRDocumentPage from './pages/qr/UploadQRDocumentPage';
import EventInformationListPage from './pages/event-information/EventInformationListPage';
import CreateEditEventInformationPage from './pages/event-information/CreateEditEventInformationPage';
import SettingsPage from './pages/settings/SettingsPage';
import PlaceholderPage from './pages/placeholders/PlaceholderPage';

// Helper to wrap page components for consistent full-height behavior
const FullHeightPage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col h-full">
    {children}
  </div>
);


const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path={ROUTE_PATHS.LOGIN} element={<AuthPage mode="login" />} />
        <Route path={ROUTE_PATHS.REGISTER} element={<AuthPage mode="register" />} />
        
        <Route 
          path={ROUTE_PATHS.CREATE_COMPANY} 
          element={<ProtectedRoute><CreateCompanyPage /></ProtectedRoute>} 
        />
        <Route 
          path={ROUTE_PATHS.SUBSCRIPTION} 
          element={<ProtectedRoute><SubscriptionPage /></ProtectedRoute>} 
        />

        <Route path="/*" element={
          <ProtectedRoute>
            <MainLayout>
              <Routes>
                <Route path="/" element={<Navigate to={ROUTE_PATHS.DASHBOARD.substring(1)} replace />} />
                <Route path={ROUTE_PATHS.DASHBOARD.substring(1)} element={<FullHeightPage><DashboardPage /></FullHeightPage>} />
                
                <Route path={ROUTE_PATHS.CONSERVATION_CERTIFICATES.substring(1)} element={<FullHeightPage><ConservationCertificateListPage /></FullHeightPage>} />
                <Route path={ROUTE_PATHS.NEW_CONSERVATION_CERTIFICATE.substring(1)} element={<FullHeightPage><CreateEditConservationCertificatePage /></FullHeightPage>} />
                <Route path={ROUTE_PATHS.EDIT_CONSERVATION_CERTIFICATE.substring(1)} element={<FullHeightPage><CreateEditConservationCertificatePage /></FullHeightPage>} />

                <Route path={ROUTE_PATHS.SELF_PROTECTION_SYSTEMS.substring(1)} element={<FullHeightPage><SelfProtectionSystemListPage /></FullHeightPage>} />
                <Route path={ROUTE_PATHS.NEW_SELF_PROTECTION_SYSTEM.substring(1)} element={<FullHeightPage><CreateEditSelfProtectionSystemPage /></FullHeightPage>} />
                <Route path={ROUTE_PATHS.EDIT_SELF_PROTECTION_SYSTEM.substring(1)} element={<FullHeightPage><CreateEditSelfProtectionSystemPage /></FullHeightPage>} />
                
                <Route path={ROUTE_PATHS.QR_ELEVATORS.substring(1)} element={<FullHeightPage><QRModuleListPage qrType={QRDocumentType.Elevators} title={MODULE_TITLES.QR_ELEVATORS} uploadPath={ROUTE_PATHS.UPLOAD_QR_ELEVATORS}/></FullHeightPage>} />
                <Route path={ROUTE_PATHS.UPLOAD_QR_ELEVATORS.substring(1)} element={<FullHeightPage><UploadQRDocumentPage qrType={QRDocumentType.Elevators} title={MODULE_TITLES.QR_ELEVATORS} listPath={ROUTE_PATHS.QR_ELEVATORS} /></FullHeightPage>} />
                
                <Route path={ROUTE_PATHS.QR_WATER_HEATERS.substring(1)} element={<FullHeightPage><QRModuleListPage qrType={QRDocumentType.WaterHeaters} title={MODULE_TITLES.QR_WATER_HEATERS} uploadPath={ROUTE_PATHS.UPLOAD_QR_WATER_HEATERS} /></FullHeightPage>} />
                <Route path={ROUTE_PATHS.UPLOAD_QR_WATER_HEATERS.substring(1)} element={<FullHeightPage><UploadQRDocumentPage qrType={QRDocumentType.WaterHeaters} title={MODULE_TITLES.QR_WATER_HEATERS} listPath={ROUTE_PATHS.QR_WATER_HEATERS} /></FullHeightPage>} />

                <Route path={ROUTE_PATHS.QR_FIRE_SAFETY.substring(1)} element={<FullHeightPage><QRModuleListPage qrType={QRDocumentType.FireSafetySystem} title={MODULE_TITLES.QR_FIRE_SAFETY} uploadPath={ROUTE_PATHS.UPLOAD_QR_FIRE_SAFETY} /></FullHeightPage>} />
                <Route path={ROUTE_PATHS.UPLOAD_QR_FIRE_SAFETY.substring(1)} element={<FullHeightPage><UploadQRDocumentPage qrType={QRDocumentType.FireSafetySystem} title={MODULE_TITLES.QR_FIRE_SAFETY} listPath={ROUTE_PATHS.QR_FIRE_SAFETY} /></FullHeightPage>} />

                <Route path={ROUTE_PATHS.QR_DETECTION.substring(1)} element={<FullHeightPage><QRModuleListPage qrType={QRDocumentType.DetectionSystem} title={MODULE_TITLES.QR_DETECTION} uploadPath={ROUTE_PATHS.UPLOAD_QR_DETECTION} /></FullHeightPage>} />
                <Route path={ROUTE_PATHS.UPLOAD_QR_DETECTION.substring(1)} element={<FullHeightPage><UploadQRDocumentPage qrType={QRDocumentType.DetectionSystem} title={MODULE_TITLES.QR_DETECTION} listPath={ROUTE_PATHS.QR_DETECTION} /></FullHeightPage>} />
                
                <Route path={ROUTE_PATHS.ELECTRICAL_INSTALLATIONS.substring(1)} element={<FullHeightPage><QRModuleListPage qrType={QRDocumentType.ElectricalInstallations} title={MODULE_TITLES.ELECTRICAL_INSTALLATIONS} uploadPath={ROUTE_PATHS.UPLOAD_ELECTRICAL_INSTALLATIONS}/></FullHeightPage>} />
                <Route path={ROUTE_PATHS.UPLOAD_ELECTRICAL_INSTALLATIONS.substring(1)} element={<FullHeightPage><UploadQRDocumentPage qrType={QRDocumentType.ElectricalInstallations} title={MODULE_TITLES.ELECTRICAL_INSTALLATIONS} listPath={ROUTE_PATHS.ELECTRICAL_INSTALLATIONS} /></FullHeightPage>} />

                <Route path={ROUTE_PATHS.EVENT_INFORMATION.substring(1)} element={<FullHeightPage><EventInformationListPage /></FullHeightPage>} />
                <Route path={ROUTE_PATHS.NEW_EVENT_INFORMATION.substring(1)} element={<FullHeightPage><CreateEditEventInformationPage /></FullHeightPage>} />
                <Route path={ROUTE_PATHS.EDIT_EVENT_INFORMATION.substring(1)} element={<FullHeightPage><CreateEditEventInformationPage /></FullHeightPage>} />
                
                <Route path={ROUTE_PATHS.SETTINGS.substring(1)} element={<FullHeightPage><SettingsPage /></FullHeightPage>} />

                <Route path={ROUTE_PATHS.WATER_TANKS.substring(1)} element={<FullHeightPage><PlaceholderPage title={MODULE_TITLES.WATER_TANKS} /></FullHeightPage>} />
                <Route path={ROUTE_PATHS.PLANT_SPECIES.substring(1)} element={<FullHeightPage><PlaceholderPage title={MODULE_TITLES.PLANT_SPECIES} /></FullHeightPage>} />
                <Route path={ROUTE_PATHS.SANITIZATION.substring(1)} element={<FullHeightPage><PlaceholderPage title={MODULE_TITLES.SANITIZATION} /></FullHeightPage>} />
                
                <Route path="*" element={<div className="text-center py-10"><h1 className="text-2xl text-content">404 - Página no encontrada</h1></div>} />
              </Routes>
            </MainLayout>
          </ProtectedRoute>
        }/>
      </Routes>
    </AuthProvider>
  );
};

export default App;