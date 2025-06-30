
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import * as api from '../../api/mockApi';
import { Company, QRDocumentType } from '../../../types';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Checkbox } from '../../components/common/Checkbox';
import AuthLayout from '../../components/layout/AuthLayout';
import { ROUTE_PATHS, MODULE_TITLES } from '../../../constants';

type CompanyFormData = Omit<Company, 'id' | 'userId' | 'employees' | 'isSubscribed' | 'selectedPlan' | 'ramaKey' | 'ownerEntity' | 'phone' | 'locality'>;

const CreateCompanyPage: React.FC = () => {
  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    cuit: '',
    address: '',
    postalCode: '',
    city: '',
    province: '',
    country: 'Argentina',
    services: {
      [QRDocumentType.Elevators]: false,
      [QRDocumentType.WaterHeaters]: false,
      [QRDocumentType.FireSafetySystem]: false,
      [QRDocumentType.DetectionSystem]: false,
      [QRDocumentType.ElectricalInstallations]: false,
    },
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setCompany } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
        ...prev,
        services: {
            ...prev.services,
            [name]: checked,
        },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const apiCompanyData: Omit<Company, 'id' | 'userId' | 'employees' | 'isSubscribed' | 'selectedPlan'> = {
          ...formData,
          locality: formData.city, // Map city to locality
          ramaKey: 'N/A',
          ownerEntity: 'N/A',
          phone: 'N/A',
      };
      const newCompany = await api.createCompany(apiCompanyData);
      setCompany(newCompany);
      navigate(ROUTE_PATHS.SUBSCRIPTION);
    } catch (err: any) { 
      setError((err as Error).message || 'Error al crear la empresa.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const serviceOptions = [
    { name: QRDocumentType.Elevators, label: MODULE_TITLES.QR_ELEVATORS },
    { name: QRDocumentType.WaterHeaters, label: MODULE_TITLES.QR_WATER_HEATERS },
    { name: QRDocumentType.FireSafetySystem, label: MODULE_TITLES.QR_FIRE_SAFETY },
    { name: QRDocumentType.DetectionSystem, label: MODULE_TITLES.QR_DETECTION },
    { name: QRDocumentType.ElectricalInstallations, label: MODULE_TITLES.ELECTRICAL_INSTALLATIONS },
  ];

  return (
    <AuthLayout title="Completa los datos de tu empresa" wideCard>
      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="md:col-span-2">
                <Input label="Nombre de la institución" name="name" value={formData.name} onChange={handleChange} placeholder="Ej: Consorcio Edificio Central" isAuthPage required />
            </div>
            <div>
                <Input label="CUIT" name="cuit" value={formData.cuit} onChange={handleChange} placeholder="Ej: 30-12345678-9" isAuthPage required />
            </div>
            <div>
                <Input label="Código Postal" name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="Ej: 1425" isAuthPage required />
            </div>
            <div className="md:col-span-2">
                <Input label="Dirección" name="address" value={formData.address} onChange={handleChange} placeholder="Ej: Av. del Libertador 5252" isAuthPage required />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
            <div>
                <Input label="Ciudad" name="city" value={formData.city} onChange={handleChange} placeholder="Ej: CABA" isAuthPage required />
            </div>
            <div>
                <Input label="Provincia" name="province" value={formData.province} onChange={handleChange} placeholder="Ej: Buenos Aires" isAuthPage required />
            </div>
            <div>
                <Input label="País" name="country" value={formData.country} onChange={handleChange} placeholder="Ej: Argentina" isAuthPage required />
            </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-borderClr">
            <label className="text-auth-textPrimary text-base font-medium leading-normal">Servicios Contratados</label>
            <p className="text-sm text-auth-textMuted">Seleccione los servicios que aplican a su institución. Esto habilitará los módulos correspondientes en la aplicación.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 pt-2">
                {serviceOptions.map(service => (
                    <Checkbox 
                        key={service.name}
                        id={service.name}
                        name={service.name}
                        label={service.label}
                        checked={formData.services?.[service.name] || false}
                        onChange={handleServiceChange}
                    />
                ))}
            </div>
        </div>

        {error && <p className="text-sm text-red-500 text-center py-2">{error}</p>}
        <div className="flex justify-center pt-3">
            <Button type="submit" isLoading={isLoading} variant="authPrimary" size="auth" className="w-auto px-8">
                Continuar a Suscripción
            </Button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default CreateCompanyPage;