
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRDocumentType } from '../../../types';
import * as api from '../../api/mockApi';
import { Button } from '../../components/common/Button';
import { FileUpload } from '../../components/common/FileUpload';
import { Card } from '../../components/common/Card';
import { PdfPreview } from '../../components/common/PdfPreview';

interface UploadQRDocumentPageProps {
  qrType: QRDocumentType;
  title: string;
  listPath: string;
}

const UploadQRDocumentPage: React.FC<UploadQRDocumentPageProps> = ({ qrType, title, listPath }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setFileToUpload(file);
    setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileToUpload) {
      setFormError("Por favor, seleccione un archivo PDF.");
      return;
    }
    setIsSubmitting(true);
    setFormError('');
    try {
      await api.uploadQRDocument({
        type: qrType,
        pdfFile: fileToUpload,
        pdfFileName: fileToUpload.name,
      });
      navigate(listPath);
    } catch (err: any) {
      setFormError((err as Error).message || "Error al subir el documento.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card title={`Subir Documento QR para ${title}`} className="flex-grow">
      <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
        <div className="flex-grow overflow-y-auto space-y-4 pr-1 flex flex-col justify-center">
          <FileUpload
            label="Seleccionar PDF"
            id="qrDocumentPdf"
            accept=".pdf"
            onFileSelect={handleFileSelect}
            currentFileName={fileToUpload?.name}
            error={formError && !fileToUpload ? "Por favor, seleccione un archivo." : undefined}
          />
          <PdfPreview file={fileToUpload} />
          {formError && fileToUpload && <p className="text-sm text-red-500">{formError}</p>}
        </div>
        <div className="flex justify-end space-x-3 pt-4 border-t border-borderClr mt-auto">
          <Button type="button" variant="ghost" onClick={() => navigate(listPath)} disabled={isSubmitting}>Cancelar</Button>
          <Button type="submit" isLoading={isSubmitting} variant="primary">Subir</Button>
        </div>
      </form>
    </Card>
  );
};

export default UploadQRDocumentPage;