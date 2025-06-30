
import React, { ReactNode } from 'react';
import { CloseIcon } from './Icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-surface rounded-lg shadow-xl p-6 w-full max-w-lg mx-4 transform transition-all">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-content">{title}</h3>
          <button onClick={onClose} className="text-content-muted hover:text-content">
            <CloseIcon />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto pr-2 text-content">{children}</div>
        {footer && <div className="mt-6 pt-4 border-t border-borderClr flex justify-end space-x-3">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
