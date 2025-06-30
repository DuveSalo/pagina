
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SelfProtectionSystem } from '../../../types';
import { ROUTE_PATHS, MOCK_COMPANY_ID } from '../../../constants';
import * as api from '../../api/mockApi';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { FileUpload } from '../../components/common/FileUpload';
import { Spinner } from '../../components/common/Spinner';
import { Card } from '../../components/common/Card';
import { PdfPreview } from '../../components/common/PdfPreview';

const CreateEditSelfProtectionSystemPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [formError, setFormError] = useState('');
  const [pageError, setPageError] = useState('');

  const initialSystemData: Omit<SelfProtectionSystem, 'id'|'companyId'> = {
    probatoryDispositionDate: undefined,
    probatoryDispositionPdf: undefined,
    probatoryDispositionPdfName: undefined,
    extensionDate: '',
    extensionPdf: undefined,
    extensionPdfName: undefined,
    expirationDate: '',
    drills: Array(4).fill(null).map(() => ({ date: '', pdfFile: undefined, pdfFileName: undefined })),
    intervener: '',
    registrationNumber: '',
  };
  const [currentFormData, setCurrentFormData] = useState<Omit<SelfProtectionSystem, 'id'|'companyId'>>(initialSystemData);

  useEffect(() => {
    if (id) {
      setIsLoadingData(true);
      setPageError('');
      api.getSelfProtectionSystems().then(systems => { 
        const systemToEdit = systems.find(s => s.id === id);
        if (systemToEdit) {
          setCurrentFormData({
            ...initialSystemData,
            ...systemToEdit,
            drills: systemToEdit.drills.length === 4 ? systemToEdit.drills : Array(4).fill(null).map((_, i) => systemToEdit.drills[i] || ({ date: '', pdfFile: undefined, pdfFileName: undefined }))
          });
        } else {
          setPageError("Sistema de autoprotección no encontrado.");
        }
      }).catch(err => setPageError((err as Error).message || "Error al cargar datos del sistema."))
      .finally(() => setIsLoadingData(false));
    } else {
      setCurrentFormData(initialSystemData);
    }
  }, [id]);

  useEffect(() => {
    if (currentFormData.probatoryDispositionDate) {
        try {
            const baseDate = new Date(currentFormData.probatoryDispositionDate);
            baseDate.setMinutes(baseDate.getMinutes() + baseDate.getTimezoneOffset()); // Adjust to treat date as local

            const extensionDate = new Date(baseDate);
            extensionDate.setFullYear(baseDate.getFullYear() + 1);

            const expirationDate = new Date(baseDate);
            expirationDate.setFullYear(baseDate.getFullYear() + 2);
            
            setCurrentFormData(prev => ({
                ...prev,
                extensionDate: extensionDate.toISOString().split('T')[0],
                expirationDate: expirationDate.toISOString().split('T')[0],
            }));
        } catch(e) {
            console.error("Invalid date format for auto-calculation.", e);
        }
    }
  }, [currentFormData.probatoryDispositionDate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (name: string, file: File | null) => {
     setCurrentFormData(prev => ({ ...prev, [name]: file || undefined, [`${name}Name`]: file?.name || undefined }));
  };

  const handleDrillChange = (index: number, field: 'date' | 'pdfFile', value: string | File | null) => {
    setCurrentFormData(prev => {
      const newDrills = [...prev.drills];
      if (field === 'date') newDrills[index].date = value as string;
      if (field === 'pdfFile') {
        newDrills[index].pdfFile = value as File | undefined;
        newDrills[index].pdfFileName = (value as File)?.name;
      }
      return { ...prev, drills: newDrills };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); 
    setFormError('');
    try {
      if (id) { 
        await api.updateSelfProtectionSystem({ ...currentFormData, id, companyId: MOCK_COMPANY_ID });
      } else { 
        await api.createSelfProtectionSystem(currentFormData);
      }
      navigate(ROUTE_PATHS.SELF_PROTECTION_SYSTEMS);
    } catch (err: any) {
      setFormError((err as Error).message || "Error al guardar el sistema");
    } finally {
      setIsSubmitting(false); 
    }
  };

  if (isLoadingData) return <div className="flex-grow flex justify-center items-center"><Spinner className="w-10 h-10" /></div>;
  if (pageError) return <div className="flex-grow flex justify-center items-center"><p className="text-red-500 text-center py-10">{pageError}</p></div>;

  const pageTitle = id ? "Editar Sistema de Autoprotección" : "Nuevo Sistema de Autoprotección";

  return (
    <Card title={pageTitle} className="flex-grow">
      <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
        <div className="flex-grow overflow-y-auto space-y-4 pr-1">
          <Input label="Fecha Disposición Aprobatoria" type="date" name="probatoryDispositionDate" value={currentFormData.probatoryDispositionDate || ''} onChange={handleChange}/>
          <FileUpload label="PDF Disposición Aprobatoria" id="probatoryDispositionPdf" accept=".pdf" currentFileName={currentFormData.probatoryDispositionPdfName} onFileSelect={(file) => handleFileChange('probatoryDispositionPdf', file)} />
          <PdfPreview file={currentFormData.probatoryDispositionPdf} />

          <Input label="Fecha Extensión" type="date" name="extensionDate" value={currentFormData.extensionDate || ''} onChange={handleChange} disabled />
          <FileUpload label="PDF Extensión" id="extensionPdf" accept=".pdf" currentFileName={currentFormData.extensionPdfName} onFileSelect={(file) => handleFileChange('extensionPdf', file)} />
          <PdfPreview file={currentFormData.extensionPdf} />
          
          <Input label="Fecha Vencimiento" type="date" name="expirationDate" value={currentFormData.expirationDate} onChange={handleChange} required disabled/>

          <h4 className="text-md font-semibold pt-2 border-t border-borderClr mt-4 text-content">Simulacros (4)</h4>
          {currentFormData.drills.map((drill, index) => (
            <div key={index} className="p-3 border border-borderClr-subtle rounded-md space-y-2 bg-surface-light">
              <Input label={`Fecha Simulacro ${index + 1}`} type="date" value={drill.date} onChange={(e) => handleDrillChange(index, 'date', e.target.value)} />
              <FileUpload label={`PDF Simulacro ${index + 1}`} id={`drillPdf-${index}`} accept=".pdf" currentFileName={drill.pdfFileName} onFileSelect={(file) => handleDrillChange(index, 'pdfFile', file)} />
               <PdfPreview file={drill.pdfFile} />
            </div>
          ))}

          <Input label="Personal Interviniente" name="intervener" value={currentFormData.intervener} onChange={handleChange} required />
          <Input label="Matrícula" name="registrationNumber" value={currentFormData.registrationNumber} onChange={handleChange} required />
          
          {formError && <p className="text-sm text-red-500">{formError}</p>}
        </div>
        <div className="flex justify-end space-x-3 pt-4 border-t border-borderClr mt-auto">
          <Button type="button" variant="ghost" onClick={() => navigate(ROUTE_PATHS.SELF_PROTECTION_SYSTEMS)} disabled={isSubmitting}>Cancelar</Button>
          <Button type="submit" isLoading={isSubmitting} variant="primary">{id ? "Actualizar" : "Guardar"}</Button>
        </div>
      </form>
    </Card>
  );
};

export default CreateEditSelfProtectionSystemPage;