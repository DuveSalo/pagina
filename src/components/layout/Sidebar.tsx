
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { NavItem, QRDocumentType } from '../../../types';
import { ROUTE_PATHS, MODULE_TITLES } from '../../../constants';
import { 
    HomeIcon, DocumentTextIcon, ShieldCheckIcon, QrCodeIcon, FireIcon, 
    BellAlertIcon, ElectricalIcon, ExclamationTriangleIcon, Cog6ToothIcon, 
    AppLogoIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon 
} from '../common/Icons';

const NavLink: React.FC<{ item: NavItem, isCollapsed: boolean }> = ({ item, isCollapsed }) => {
    const location = useLocation();
    const isActive = location.pathname.startsWith(item.path);
    return (
        <Link 
            to={item.path}
            title={isCollapsed ? item.label : ''}
            className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
            isActive 
                ? 'bg-primary text-white shadow-sm' 
                : 'text-content-muted hover:bg-surface-subtle hover:text-content'
            } ${isCollapsed ? 'justify-center' : ''}`}
        >
            {React.cloneElement(item.icon, { className: "w-5 h-5 flex-shrink-0" })}
            <span className={`font-medium text-sm truncate transition-opacity ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>{item.label}</span>
        </Link>
    );
};

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar }) => {
    const { currentCompany } = useAuth();

    const mainNavItems: NavItem[] = [
        { path: ROUTE_PATHS.DASHBOARD, label: MODULE_TITLES.DASHBOARD, icon: <HomeIcon /> },
        { path: ROUTE_PATHS.CONSERVATION_CERTIFICATES, label: MODULE_TITLES.CONSERVATION_CERTIFICATES, icon: <DocumentTextIcon /> },
        { path: ROUTE_PATHS.SELF_PROTECTION_SYSTEMS, label: MODULE_TITLES.SELF_PROTECTION_SYSTEMS, icon: <ShieldCheckIcon /> },
    ];
    
    const serviceNavItems: NavItem[] = [
        { path: ROUTE_PATHS.QR_ELEVATORS, label: MODULE_TITLES.QR_ELEVATORS, icon: <QrCodeIcon />, service: QRDocumentType.Elevators },
        { path: ROUTE_PATHS.QR_WATER_HEATERS, label: MODULE_TITLES.QR_WATER_HEATERS, icon: <QrCodeIcon />, service: QRDocumentType.WaterHeaters },
        { path: ROUTE_PATHS.QR_FIRE_SAFETY, label: MODULE_TITLES.QR_FIRE_SAFETY, icon: <FireIcon />, service: QRDocumentType.FireSafetySystem },
        { path: ROUTE_PATHS.QR_DETECTION, label: MODULE_TITLES.QR_DETECTION, icon: <BellAlertIcon />, service: QRDocumentType.DetectionSystem },
        { path: ROUTE_PATHS.ELECTRICAL_INSTALLATIONS, label: MODULE_TITLES.ELECTRICAL_INSTALLATIONS, icon: <ElectricalIcon />, service: QRDocumentType.ElectricalInstallations },
    ];

    const otherNavItems: NavItem[] = [
      { path: ROUTE_PATHS.EVENT_INFORMATION, label: MODULE_TITLES.EVENT_INFORMATION, icon: <ExclamationTriangleIcon/> },
    ];

    const enabledServiceItems = serviceNavItems.filter(item => item.service && currentCompany?.services?.[item.service]);

    return (
        <aside className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-[280px]'} bg-surface border-r border-borderClr flex flex-col flex-shrink-0`}>
            <div className={`flex items-center gap-3 h-16 px-6 py-4 border-b border-borderClr ${isCollapsed ? 'justify-center !px-0' : ''}`}>
                <div className="size-8 text-primary flex-shrink-0"> 
                    <AppLogoIcon className="size-full"/>
                </div>
                <h2 className={`text-content text-lg font-bold leading-tight tracking-[-0.015em] transition-opacity ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>SecureSphere</h2>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
                <div>
                    {!isCollapsed && <h3 className="px-3 mb-2 text-xs font-semibold tracking-wider text-content-muted uppercase">Principal</h3>}
                    <div className="space-y-1">
                        {mainNavItems.map(item => <NavLink key={item.path} item={item} isCollapsed={isCollapsed} />)}
                    </div>
                </div>

                {enabledServiceItems.length > 0 && (
                    <div>
                        {!isCollapsed && <h3 className="px-3 mb-2 text-xs font-semibold tracking-wider text-content-muted uppercase">Servicios QR</h3>}
                        <div className="space-y-1">
                            {enabledServiceItems.map(item => <NavLink key={item.path} item={item} isCollapsed={isCollapsed} />)}
                        </div>
                    </div>
                )}
                 <div>
                    {!isCollapsed && <h3 className="px-3 mb-2 text-xs font-semibold tracking-wider text-content-muted uppercase">Otros</h3>}
                    <div className="space-y-1">
                        {otherNavItems.map(item => <NavLink key={item.path} item={item} isCollapsed={isCollapsed} />)}
                    </div>
                </div>
            </nav>
            <div className="px-4 py-4 border-t border-borderClr">
                <button 
                    onClick={toggleSidebar} 
                    className="w-full flex items-center justify-center p-2 rounded-lg text-content-muted hover:bg-surface-subtle hover:text-content"
                    title={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
                >
                    {isCollapsed ? <ChevronDoubleRightIcon className="w-5 h-5"/> : <ChevronDoubleLeftIcon className="w-5 h-5"/>}
                </button>
                <div className="mt-2">
                    <NavLink item={{ path: ROUTE_PATHS.SETTINGS, label: MODULE_TITLES.SETTINGS, icon: <Cog6ToothIcon /> }} isCollapsed={isCollapsed}/>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;