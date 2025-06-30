
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ConservationCertificate } from '../../../types';
import { ROUTE_PATHS, MOCK_COMPANY_ID } from '../../../constants';
import * as api from '../../api/mockApi';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { FileUpload } from '../../components/common/FileUpload';
import { Spinner } from '../../components/common/Spinner';
import { Card } from '../../components/common/Card';
import { PdfPreview } from '../../components/common/PdfPreview';

const CreateEditConservationCertificatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [formError, setFormError] = useState('');
  const [pageError, setPageError] = useState('');
  
  const emptyCertificate: Omit<ConservationCertificate, 'id' | 'companyId'> = {
    presentationDate: '', expirationDate: '', intervener: '', registrationNumber: '', pdfFile: undefined, pdfFileName: undefined
  };
  const [currentFormData, setCurrentFormData] = useState<Omit<ConservationCertificate, 'id' | 'companyId'>>(emptyCertificate);

  useEffect(() => {
    if (id) {
      setIsLoadingData(true);
      setPageError('');
      api.getCertificates().then(certs => {
        const certToEdit = certs.find(c => c.id === id);
        if (certToEdit) {
          setCurrentFormData({ ...emptyCertificate, ...certToEdit });
        } else {
          setPageError("Certificado no encontrado.");
        }
      }).catch(err => setPageError((err as Error).message || "Error al cargar datos del certificado."))
      .finally(() => setIsLoadingData(false));
    } else {
      setCurrentFormData(emptyCertificate);
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (file: File | null) => {
     setCurrentFormData(prev => ({ ...prev, pdfFile: file || undefined, pdfFileName: file?.name || undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');
    try {
      const dataToSubmit = { ...currentFormData };
      if (id) { 
        await api.updateCertificate({ ...dataToSubmit, id, companyId: MOCK_COMPANY_ID }); 
      } else { 
        await api.createCertificate(dataToSubmit);
      }
      navigate(ROUTE_PATHS.CONSERVATION_CERTIFICATES);
    } catch (err: any) {
      setFormError((err as Error).message || "Error al guardar certificado");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) return <div className="flex-grow flex justify-center items-center"><Spinner className="w-10 h-10" /></div>;
  if (pageError) return <div className="flex-grow flex justify-center items-center"><p className="text-red-500 text-center py-10">{pageError}</p></div>;
  
  const pageTitle = id ? "Editar Certificado de Conservación" : "Nuevo Certificado de Conservación";

  return (
    <Card title={pageTitle} className="flex-grow">
      <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
        <div className="flex-grow overflow-y-auto space-y-4 pr-1">
          <Input label="Fecha de Presentación" type="date" name="presentationDate" value={currentFormData.presentationDate} onChange={handleChange} required />
          <Input label="Fecha de Vencimiento" type="date" name="expirationDate" value={currentFormData.expirationDate} onChange={handleChange} required />
          <Input label="Personal Interviniente" name="intervener" value={currentFormData.intervener} onChange={handleChange} required />
          <Input label="Matrícula" name="registrationNumber" value={currentFormData.registrationNumber} onChange={handleChange} required />
          <FileUpload
              label="Subir PDF del Certificado"
              id="certificatePdf"
              accept=".pdf"
              currentFileName={currentFormData.pdfFileName}
              onFileSelect={handleFileChange}
            />
          <PdfPreview file={currentFormData.pdfFile} />
          {formError && <p className="text-sm text-red-500">{formError}</p>}
        </div>
        <div className="flex justify-end space-x-3 pt-4 border-t border-borderClr mt-auto">
          <Button type="button" variant="ghost" onClick={() => navigate(ROUTE_PATHS.CONSERVATION_CERTIFICATES)} disabled={isSubmitting}>Cancelar</Button>
          <Button type="submit" isLoading={isSubmitting} variant="primary">{id ? "Actualizar" : "Guardar"}</Button>
        </div>
      </form>
    </Card>
  );
};

export default CreateEditConservationCertificatePage;