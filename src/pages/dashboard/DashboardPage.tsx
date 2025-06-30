
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConservationCertificate, SelfProtectionSystem, QRDocument, QRDocumentType } from '../../../types';
import { ROUTE_PATHS } from '../../../constants';
import * as api from '../../api/mockApi';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { Card } from '../../components/common/Card';

type ExpirableItem = {
    id: string;
    name: string;
    type: string;
    expirationDate: string;
    link: string;
    daysUntil: number;
    status: 'Vencido' | 'Próximo a Vencer' | 'Vigente';
};

const DashboardPage: React.FC = () => {
    const [expiringItems, setExpiringItems] = useState<ExpirableItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const calculateStatus = (expirationDate: string): { status: ExpirableItem['status']; daysUntil: number } => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const expiry = new Date(expirationDate);
        
        const diffTime = expiry.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 0) return { status: 'Vencido', daysUntil: diffDays };
        if (diffDays <= 30) return { status: 'Próximo a Vencer', daysUntil: diffDays };
        return { status: 'Vigente', daysUntil: diffDays };
    };

    useEffect(() => {
        const fetchItems = async () => {
            setIsLoading(true);
            setError('');
            try {
                const allItems: ExpirableItem[] = [];

                const certsData = await api.getCertificates();
                const certs = certsData.map(c => ({
                    id: c.id,
                    name: `Cert. ${c.intervener}`,
                    type: 'Certificado de Conservación',
                    expirationDate: c.expirationDate,
                    link: ROUTE_PATHS.CONSERVATION_CERTIFICATES,
                    ...calculateStatus(c.expirationDate)
                }));
                allItems.push(...certs);

                const systemsData = await api.getSelfProtectionSystems();
                const systems = systemsData.map(s => ({
                    id: s.id,
                    name: `Sistema de Autoprotección`,
                    type: 'Sistema de Autoprotección',
                    expirationDate: s.expirationDate,
                    link: ROUTE_PATHS.SELF_PROTECTION_SYSTEMS,
                    ...calculateStatus(s.expirationDate)
                }));
                allItems.push(...systems);
                
                const qrDocs = await api.getAllQRDocuments();
                const qrItems = qrDocs.map(doc => {
                    const expiry = new Date(doc.extractedDate);
                    expiry.setFullYear(expiry.getFullYear() + 1);
                    const expirationDate = expiry.toISOString().split('T')[0];
                    let linkPath = '';
                    switch (doc.type) {
                        case QRDocumentType.Elevators: linkPath = ROUTE_PATHS.QR_ELEVATORS; break;
                        case QRDocumentType.WaterHeaters: linkPath = ROUTE_PATHS.QR_WATER_HEATERS; break;
                        case QRDocumentType.FireSafetySystem: linkPath = ROUTE_PATHS.QR_FIRE_SAFETY; break;
                        case QRDocumentType.DetectionSystem: linkPath = ROUTE_PATHS.QR_DETECTION; break;
                        case QRDocumentType.ElectricalInstallations: linkPath = ROUTE_PATHS.ELECTRICAL_INSTALLATIONS; break;
                    }

                    return {
                        id: doc.id,
                        name: `Doc. ${doc.type}`,
                        type: doc.type,
                        expirationDate: expirationDate,
                        link: linkPath,
                        ...calculateStatus(expirationDate)
                    };
                });
                allItems.push(...qrItems);

                setExpiringItems(allItems.sort((a, b) => a.daysUntil - b.daysUntil));

            } catch (err: any) {
                setError((err as Error).message || "Error al cargar los controles.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchItems();
    }, [navigate]);

    const getStatusStyles = (status: ExpirableItem['status']) => {
        switch (status) {
            case 'Vencido': return 'bg-red-100 text-red-700';
            case 'Próximo a Vencer': return 'bg-yellow-100 text-yellow-700';
            case 'Vigente': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };
    
    return (
        <div className="space-y-6 h-full flex flex-col">
            <h1 className="text-3xl font-bold text-content">Próximos Vencimientos</h1>
            {isLoading && <div className="flex-grow flex justify-center items-center"><Spinner /></div>}
            {error && <p className="text-red-500 text-center py-5">{error}</p>}
            {!isLoading && !error && expiringItems.length === 0 && (
                <div className="flex-grow flex justify-center items-center">
                    <p className="text-center text-content-muted py-10">No hay vencimientos para mostrar.</p>
                </div>
            )}
            {!isLoading && !error && expiringItems.length > 0 && (
                 <div className="flex-grow overflow-y-auto space-y-4 pr-2">
                    {expiringItems.map(item => (
                        <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer !p-4" onClick={() => navigate(item.link)}>
                            <div className="flex justify-between items-center gap-4">
                                <div>
                                    <h3 className="font-semibold text-base text-content">{item.name}</h3>
                                    <p className="text-sm text-content-muted">{item.type}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className={`text-xs font-medium px-2.5 py-1 rounded-full inline-block ${getStatusStyles(item.status)}`}>
                                        {item.status}
                                    </p>
                                    <p className="text-sm text-content-muted mt-1">
                                        {item.status === 'Vencido' ? `Vencido hace ${Math.abs(item.daysUntil)} días` : `Vence en ${item.daysUntil} días`}
                                    </p>
                                    <p className="text-xs text-content-muted">{new Date(item.expirationDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DashboardPage;