
import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}
export const Checkbox: React.FC<CheckboxProps> = ({ label, id, ...props }) => (
  <div className="flex items-center mb-2">
    <input
      id={id}
      type="checkbox"
      className="h-4 w-4 text-primary border-borderClr rounded focus:ring-primary"
      {...props}
    />
    <label htmlFor={id} className="ml-2 block text-sm text-content">
      {label}
    </label>
  </div>
);

export default Checkbox;
