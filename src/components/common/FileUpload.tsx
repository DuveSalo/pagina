
import React, { useState, useRef } from 'react';

interface FileUploadProps {
  label: string;
  id: string;
  onFileSelect: (file: File | null) => void;
  accept?: string;
  currentFileName?: string;
  error?: string;
}
export const FileUpload: React.FC<FileUploadProps> = ({ label, id, onFileSelect, accept, currentFileName, error }) => {
  const [fileName, setFileName] = useState<string | null>(currentFileName || null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileSelect(file);
    } else {
      setFileName(null);
      onFileSelect(null);
    }
  };

  const triggerFileInput = () => {
    inputRef.current?.click();
  };
  
  React.useEffect(() => { // Sync internal state if currentFileName prop changes
    setFileName(currentFileName || null);
  }, [currentFileName]);

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-content-muted mb-1">{label}</label>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-borderClr border-dashed rounded-md">
        <div className="space-y-1 text-center">
          <svg className="mx-auto h-12 w-12 text-content-muted" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="flex text-sm text-content-muted">
            <button
              type="button"
              onClick={triggerFileInput}
              className="relative cursor-pointer bg-surface rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
            >
              <span>Subir un archivo</span>
              <input id={id} name={id} type="file" className="sr-only" ref={inputRef} onChange={handleFileChange} accept={accept} />
            </button>
            <p className="pl-1">o arrastrar y soltar</p>
          </div>
          <p className="text-xs text-content-muted">{accept ? `Archivos ${accept.toUpperCase()}` : 'Cualquier tipo de archivo'} hasta 10MB</p>
          {fileName && <p className="text-sm text-green-600 mt-2">Archivo seleccionado: {fileName}</p>}
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default FileUpload;
