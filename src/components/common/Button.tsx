
import React from 'react';
import { Spinner } from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'neutral' | 'authPrimary';
  size?: 'sm' | 'default' | 'lg' | 'auth';
  isLoading?: boolean;
}
export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'default', isLoading = false, className, ...props }) => {
  const baseStyle = "focus:outline-none disabled:opacity-50 transition-colors duration-150 ease-in-out inline-flex items-center justify-center font-medium leading-normal";
  
  const variantStyles = {
    primary: "bg-primary text-white hover:bg-primary-dark focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-md",
    authPrimary: "bg-auth-buttonPrimaryBg text-white hover:opacity-90 focus:ring-2 focus:ring-offset-2 focus:ring-auth-buttonPrimaryBg rounded-lg text-sm font-bold tracking-[0.015em]",
    secondary: "bg-secondary text-white hover:bg-secondary-dark focus:ring-2 focus:ring-offset-2 focus:ring-secondary rounded-md",
    danger: "bg-danger text-white hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-danger rounded-md",
    ghost: "bg-transparent text-primary hover:bg-primary-light/20 focus:ring-2 focus:ring-offset-1 focus:ring-primary rounded-md",
    neutral: "bg-surface-subtle text-content hover:bg-gray-200 focus:ring-2 focus:ring-offset-1 focus:ring-gray-400 rounded-xl",
  };
  
  const sizeStyles = {
    default: "h-10 px-4 text-sm",
    sm: "h-8 px-3 text-xs",      
    lg: "h-12 px-6 text-base",
    auth: "h-10 px-4", 
  };

  const currentSizeStyle = (variant === 'authPrimary') ? sizeStyles.auth : sizeStyles[size];
  const currentVariantStyle = variantStyles[variant] || variantStyles.primary;

  return (
    <button
      className={`${baseStyle} ${currentVariantStyle} ${currentSizeStyle} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <Spinner className="w-5 h-5 mr-2" />
          Cargando...
        </span>
      ) : <span className="truncate">{children}</span>}
    </button>
  );
};

export default Button;