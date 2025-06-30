
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRDocument, QRDocumentType } from '../../../types';
import * as api from '../../api/mockApi';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { TrashIcon } from '../../components/common/Icons';

interface QRModulePageProps {
  qrType: QRDocumentType;
  title: string;
  uploadPath: string;
}

const QRModuleListPage: React.FC<QRModulePageProps> = ({ qrType, title, uploadPath }) => {
  const [documents, setDocuments] = useState<QRDocument[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadDocuments = useCallback(async () => {
    setIsLoadingData(true);
    setError('');
    try {
      const data = await api.getQRDocuments(qrType);
      setDocuments(data);
    } catch (err: any) {
      setError((err as Error).message || `Error al cargar documentos QR de ${title}`);
    } finally {
      setIsLoadingData(false);
    }
  }, [qrType, title]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Está seguro de que desea eliminar este documento?")) {
      setIsDeleting(true); 
      setError('');
      try {
        await api.deleteQRDocument(id);
        loadDocuments();
      } catch (err: any) {
        setError((err as Error).message || "Error al eliminar el documento.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
        <p className="text-content tracking-light text-[32px] font-bold leading-tight min-w-72">{title}</p>
        <Button onClick={() => navigate(uploadPath)} variant="neutral">Subir Documento...</Button>
      </div>

      {isLoadingData && <div className="flex-grow flex justify-center items-center"><Spinner className="w-10 h-10" /></div>}
      {error && !isLoadingData && <div className="flex-grow flex justify-center items-center"><p className="text-red-500 text-center py-5">{error}</p></div>}
      {isDeleting && <p className="text-center text-content-muted py-2">Eliminando...</p>}
      
      {!isLoadingData && !error && documents.length === 0 && (
        <div className="flex-grow flex justify-center items-center"><p className="text-center text-content-muted py-10">No hay documentos registrados para {title.toLowerCase()}.</p></div>
      )}

      {!isLoadingData && !error && documents.length > 0 && (
        <div className="flex-grow rounded-xl border border-borderClr bg-surface overflow-hidden flex flex-col min-h-0">
          <table className="min-w-full flex-1 flex flex-col">
            <thead className="bg-surface sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-content w-[40%] text-sm font-medium leading-normal">Nombre Archivo</th>
                <th className="px-4 py-3 text-left text-content w-[25%] text-sm font-medium leading-normal">Fecha Extracción/Subida</th>
                 <th className="px-4 py-3 text-left text-content w-[20%] text-sm font-medium leading-normal">Previsualizar</th>
                <th className="px-4 py-3 text-left text-content-muted w-[15%] text-sm font-medium leading-normal">Acciones</th>
              </tr>
            </thead>
            <tbody className="flex-1 overflow-y-auto">
              {documents.map(doc => (
                <tr key={doc.id} className="border-t border-t-borderClr">
                  <td className="h-[72px] px-4 py-2 text-content text-sm font-normal leading-normal align-middle">{doc.pdfFileName}</td>
                  <td className="h-[72px] px-4 py-2 text-content-muted text-sm font-normal leading-normal align-middle">{doc.extractedDate} (OCR) / {doc.uploadDate} (Subida)</td>
                  <td className="h-[72px] px-4 py-2 text-sm font-normal leading-normal align-middle">
                    {doc.pdfUrl ? (
                        <a href={doc.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Ver PDF</a>
                    ) : 'N/A' }
                  </td>
                  <td className="h-[72px] px-4 py-2 text-sm font-normal leading-normal align-middle">
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(doc.id)} className="text-danger hover:text-red-700 p-1" disabled={isDeleting}>
                        <TrashIcon/>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default QRModuleListPage;