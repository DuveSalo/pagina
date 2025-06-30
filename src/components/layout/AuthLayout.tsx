
import React from 'react';
import { AppLogoIcon } from '../common/Icons';

const AuthLayout: React.FC<{ children: React.ReactNode; title: string, noCard?: boolean, wideCard?: boolean }> = ({ children, title, noCard, wideCard }) => {
  let cardMaxWidth = "max-w-lg"; 
  if (noCard) cardMaxWidth = "max-w-lg"; 
  if (wideCard) cardMaxWidth = "max-w-3xl";

  const contentContainerClass = noCard 
    ? `flex flex-col w-full ${cardMaxWidth} py-5 sm:py-8 px-4 sm:px-6 md:px-10` 
    : `flex flex-col w-full ${cardMaxWidth} bg-surface py-5 sm:py-8 px-4 sm:px-6 md:px-10 rounded-lg shadow-xl`;

  return (
    <div className="relative flex size-full min-h-screen flex-col items-center justify-center bg-surface group/design-root overflow-x-hidden p-4 sm:p-6 md:p-10">
      <div className="flex flex-col items-center mb-6 sm:mb-8">
        <div className="text-auth-buttonPrimaryBg mb-2">
           <AppLogoIcon className="size-10 sm:size-12"/>
        </div>
        <h1 className="text-auth-textPrimary text-2xl sm:text-3xl font-bold">SecureSphere</h1>
      </div>
      <div className={contentContainerClass}>
        <h2 className="text-auth-textPrimary tracking-light text-[28px] font-bold leading-tight text-center pb-3 pt-5">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
