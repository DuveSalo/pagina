
import React, { useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const userInitials = useMemo(() => {
    if (currentUser?.name) {
      return currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return 'U';
  }, [currentUser]);

  return (
    <div className="flex h-screen bg-surface-light text-content font-sans">
      <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={() => setIsSidebarCollapsed(prev => !prev)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-end h-16 bg-surface px-6 border-b border-borderClr flex-shrink-0">
          <div className="relative group">
            <button className="bg-surface-subtle bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 flex items-center justify-center text-content font-semibold text-sm">
              {userInitials}
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-surface rounded-md shadow-lg py-1 z-20 hidden group-hover:block ring-1 ring-borderClr">
              <div className="px-4 py-2 text-sm text-content font-semibold border-b border-borderClr">
                {currentUser?.name}
                <span className="block text-xs text-content-muted font-normal">{currentUser?.email}</span>
              </div>
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 text-sm text-content-muted hover:bg-surface-subtle hover:text-content"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8">
            <div className="layout-content-container mx-auto max-w-7xl h-full flex flex-col">
                {children}
            </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;