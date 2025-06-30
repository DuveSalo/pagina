import React, { ReactNode } from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className, title, ...props }) => (
  <div className={`bg-surface shadow-lg rounded-xl p-6 flex flex-col ${className}`} {...props}>
    {title && <h2 className="text-xl font-semibold text-content mb-4 pb-2 border-b border-borderClr">{title}</h2>}
    {/* Ensure children container can also grow if needed */}
    <div className="text-content flex flex-col flex-grow min-h-0"> 
      {children}
    </div>
  </div>
);

export default Card;