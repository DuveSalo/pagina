
import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}
export const Textarea: React.FC<TextareaProps> = ({ label, id, error, ...props }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-content-muted mb-1">{label}</label>
    <textarea
      id={id}
      rows={4}
      className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-borderClr'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-content bg-surface`}
      {...props}
    />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

export default Textarea;
