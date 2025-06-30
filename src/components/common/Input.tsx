
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  isAuthPage?: boolean; 
}
export const Input: React.FC<InputProps> = ({ label, id, error, isAuthPage, ...props }) => {
  const authLabelStyle = "text-auth-textPrimary text-base font-medium leading-normal pb-2";
  const defaultLabelStyle = "block text-sm font-medium text-content-muted mb-1";

  const authInputStyle = `w-full h-14 p-[15px] rounded-lg text-auth-textPrimary border border-auth-inputBorder bg-surface focus:outline-none focus:border-auth-inputBorder placeholder:text-auth-textMuted sm:text-base font-normal`;
  const defaultInputStyle = `w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-borderClr'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-content bg-surface`;

  return (
    <div className={isAuthPage ? "mb-3" : "mb-4"}>
      <label htmlFor={id} className={isAuthPage ? authLabelStyle : defaultLabelStyle}>
        {label}
      </label>
      <input
        id={id}
        className={`${isAuthPage ? authInputStyle : defaultInputStyle} ${props.className || ''}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
