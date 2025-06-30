
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConservationCertificate } from '../../../types';
import { ROUTE_PATHS, MODULE_TITLES } from '../../../constants';
import * as api from '../../api/mockApi';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { EditIcon, TrashIcon } from '../../components/common/Icons';

const ConservationCertificateListPage: React.FC = () => {
  const [certificates, setCertificates] = useState<ConservationCertificate[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadCertificates = useCallback(async () => {
    setIsLoadingData(true);
    setError('');
    try {
      const data = await api.getCertificates();
      setCertificates(data);
    } catch (err: any) {
      setError((err as Error).message || "Error al cargar certificados");
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    loadCertificates();
  }, [loadCertificates]);

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Está seguro de que desea eliminar este certificado?")) {
      setIsDeleting(true); 
      setError('');
      try {
        await api.deleteCertificate(id);
        loadCertificates();
      } catch (err: any) {
        setError((err as Error).message || "Error al eliminar certificado");
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  const getStatus = (expirationDate: string) => {
    if (!expirationDate) return { text: 'N/A', color: 'text-content-muted' };
    const today = new Date();
    today.setHours(0,0,0,0);
    const expiry = new Date(expirationDate);
    if (expiry < today) return { text: 'Vencido', color: 'text-red-500 font-semibold' };
    
    const diffTime = Math.abs(expiry.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 30) return { text: 'Próx. a Vencer', color: 'text-yellow-500 font-semibold' };
    return { text: 'Vigente', color: 'text-green-600 font-semibold' };
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
        <p className="text-content tracking-light text-[32px] font-bold leading-tight min-w-72">{MODULE_TITLES.CONSERVATION_CERTIFICATES}</p>
        <Button onClick={() => navigate(ROUTE_PATHS.NEW_CONSERVATION_CERTIFICATE)} variant="neutral">Crear Nuevo...</Button>
      </div>

      {isLoadingData && <div className="flex-grow flex justify-center items-center"><Spinner className="w-10 h-10" /></div>}
      {error && !isLoadingData && <div className="flex-grow flex justify-center items-center"><p className="text-red-500 text-center py-5">{error}</p></div>}
      {isDeleting && <p className="text-center text-content-muted py-2">Eliminando...</p>}
      
      {!isLoadingData && !error && certificates.length === 0 && (
        <div className="flex-grow flex justify-center items-center"><p className="text-center text-content-muted py-10">No hay certificados registrados.</p></div>
      )}

      {!isLoadingData && !error && certificates.length > 0 && (
        <div className="flex-grow rounded-xl border border-borderClr bg-surface overflow-hidden flex flex-col min-h-0">
          <table className="min-w-full flex-1 flex flex-col">
            <thead className="bg-surface sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-content w-[25%] text-sm font-medium leading-normal">Interviniente</th>
                <th className="px-4 py-3 text-left text-content w-[15%] text-sm font-medium leading-normal">Presentación</th>
                <th className="px-4 py-3 text-left text-content w-[15%] text-sm font-medium leading-normal">Vencimiento</th>
                <th className="px-4 py-3 text-left text-content w-[15%] text-sm font-medium leading-normal">Archivo</th>
                <th className="px-4 py-3 text-left text-content w-[15%] text-sm font-medium leading-normal">Estado</th>
                <th className="px-4 py-3 text-left text-content-muted w-[15%] text-sm font-medium leading-normal">Acciones</th>
              </tr>
            </thead>
            <tbody className="flex-1 overflow-y-auto">
              {certificates.map(cert => {
                const status = getStatus(cert.expirationDate);
                return (
                <tr key={cert.id} className="border-t border-t-borderClr">
                  <td className="h-[72px] px-4 py-2 text-content text-sm font-normal leading-normal align-middle">{cert.intervener} ({cert.registrationNumber})</td>
                  <td className="h-[72px] px-4 py-2 text-content-muted text-sm font-normal leading-normal align-middle">{cert.presentationDate}</td>
                  <td className="h-[72px] px-4 py-2 text-content-muted text-sm font-normal leading-normal align-middle">{cert.expirationDate}</td>
                  <td className="h-[72px] px-4 py-2 text-content-muted text-sm font-normal leading-normal align-middle">{cert.pdfFileName || 'N/A'}</td>
                  <td className={`h-[72px] px-4 py-2 text-sm font-normal leading-normal align-middle ${status.color}`}>{status.text}</td>
                  <td className="h-[72px] px-4 py-2 text-sm font-normal leading-normal space-x-2 align-middle">
                    <Button variant="ghost" size="sm" onClick={() => navigate(ROUTE_PATHS.EDIT_CONSERVATION_CERTIFICATE.replace(':id', cert.id))} className="text-primary hover:text-primary-dark p-1" disabled={isDeleting}>
                        <EditIcon/>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(cert.id)} className="text-danger hover:text-red-700 p-1" disabled={isDeleting}>
                        <TrashIcon/>
                    </Button>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ConservationCertificateListPage;