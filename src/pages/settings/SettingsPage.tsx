
import React, { useState, useEffect, HTMLInputTypeAttribute } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Company, Employee } from '../../../types';
import * as api from '../../api/mockApi';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Spinner } from '../../components/common/Spinner';
import { EditIcon, TrashIcon } from '../../components/common/Icons';

interface FormField {
  name: keyof Pick<Company, 'name' | 'cuit' | 'ramaKey' | 'ownerEntity' | 'address' | 'locality' | 'phone'>;
  label: string;
  type: HTMLInputTypeAttribute;
  required?: boolean;
  maxLength?: number;
  pattern?: string;
  title?: string; 
}

const SettingsPage: React.FC = () => {
  const { currentCompany, refreshCompany, currentUser } = useAuth();
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [isManagingEmployees, setIsManagingEmployees] = useState(false);
  const [companyFormData, setCompanyFormData] = useState<Partial<Company>>({});
  const [employeeFormData, setEmployeeFormData] = useState<Partial<Employee>>({});
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState(''); 
  const [employeeModalError, setEmployeeModalError] = useState('');

  useEffect(() => {
    if (currentCompany) {
      setCompanyFormData(currentCompany);
    }
  }, [currentCompany]);

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    if (name === 'cuit') {
      const allDigits = value.replace(/\D/g, ''); 
      const relevantDigits = allDigits.slice(0, 11);

      let formatted = '';
      if (relevantDigits.length > 0) {
        formatted = relevantDigits.substring(0, 2);
      }
      if (relevantDigits.length > 2) {
        formatted += '-' + relevantDigits.substring(2, 10);
      }
      if (relevantDigits.length > 10) {
        formatted += '-' + relevantDigits.substring(10, 11);
      }
      value = formatted;
    } else if (name === 'phone') {
      const allDigits = value.replace(/\D/g, '');
      const relevantDigits = allDigits.slice(0, 11); 

      let formatted = '';
      if (relevantDigits.length > 0) {
        formatted = relevantDigits.substring(0, 3);
      }
      if (relevantDigits.length > 3) {
        formatted += '-' + relevantDigits.substring(3, 7);
      }
      if (relevantDigits.length > 7) {
        formatted += '-' + relevantDigits.substring(7, 11);
      }
      value = formatted;
    }
    setCompanyFormData({ ...companyFormData, [name]: value });
  };

  const handleSaveCompanyChanges = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentCompany) return;
    setIsLoading(true);
    setError('');
    try {
      await api.updateCompany({ id: currentCompany.id, ...companyFormData });
      await refreshCompany(); 
      setIsEditingCompany(false);
    } catch (err: any) {
      setError((err as Error).message || 'Error al guardar cambios de la empresa.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEmployeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmployeeFormData({ ...employeeFormData, [e.target.name]: e.target.value });
  };

  const openEmployeeModal = (emp?: Employee) => {
    setEditingEmployee(emp || null);
    setEmployeeFormData(emp || { name: '', email: '', role: ''});
    setIsManagingEmployees(true);
    setEmployeeModalError(''); 
  };

  const closeEmployeeModal = () => {
    setIsManagingEmployees(false);
    setEditingEmployee(null);
    setEmployeeFormData({});
    setEmployeeModalError('');
  };

  const handleSaveEmployee = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentCompany) return;
    setIsLoading(true);
    setEmployeeModalError('');
    try {
      if (editingEmployee) {
        await api.updateEmployee({ ...editingEmployee, ...employeeFormData } as Employee);
      } else {
        await api.addEmployee(employeeFormData as Omit<Employee, 'id'>);
      }
      await refreshCompany();
      closeEmployeeModal();
    } catch (err: any) {
      setEmployeeModalError((err as Error).message || 'Error al guardar empleado.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
     if (currentUser && currentCompany && currentCompany.employees.length <= 1 && currentCompany.employees.find(e => e.id === employeeId && e.email === currentUser.email) ) { 
         setError("No puede eliminar al único empleado administrador.");
         window.alert("No puede eliminar al único empleado administrador.");
         return;
     }
     if (window.confirm("¿Está seguro de que desea eliminar este empleado?")) {
        setIsLoading(true);
        setError('');
        try {
            await api.deleteEmployee(employeeId);
            await refreshCompany();
        } catch (err:any) {
            setError((err as Error).message || 'Error al eliminar empleado.');
        } finally {
            setIsLoading(false);
        }
     }
  };

  if (!currentCompany && isLoading) return <div className="flex-grow flex justify-center items-center"><Spinner className="w-10 h-10" /> <p className="ml-2">Cargando datos de la empresa...</p></div>;
  if (!currentCompany) return <div className="flex-grow flex justify-center items-center text-content-muted">No se encontró información de la empresa.</div>;

  const companyDetailsFields: FormField[] = [
    { name: 'name', label: 'Nombre de la Institución', type: 'text', required: true },
    { name: 'cuit', label: 'CUIT', type: 'text', required: true, maxLength: 13, pattern: "\\d{2}-\\d{8}-\\d{1}", title: "Formato: XX-XXXXXXXX-X" },
    { name: 'ramaKey', label: 'Clave Rama', type: 'text', required: true },
    { name: 'ownerEntity', label: 'Entidad Propietaria', type: 'text', required: true },
    { name: 'address', label: 'Dirección', type: 'text', required: true },
    { name: 'locality', label: 'Localidad', type: 'text', required: true },
    { name: 'phone', label: 'Teléfono', type: 'tel', required: true, maxLength: 13, pattern: "\\d{3}-\\d{4}-\\d{4}", title: "Formato: XXX-XXXX-XXXX" },
  ];

  return (
    <div className="flex flex-col h-full space-y-6">
       <p className="text-content tracking-light text-[32px] font-bold leading-tight">Configuración</p>
      
      <Card title="Información de la Empresa" className="flex flex-col">
        {isEditingCompany ? (
          <form onSubmit={handleSaveCompanyChanges} className="flex flex-col flex-grow">
            <div className="flex-grow overflow-y-auto space-y-4 pr-1">
              {companyDetailsFields.map(field => (
                <Input
                  key={field.name}
                  label={field.label}
                  type={field.type}
                  name={field.name}
                  value={companyFormData[field.name] || ''}
                  onChange={handleCompanyChange}
                  required={field.required}
                  maxLength={field.maxLength}
                  // pattern={field.pattern} // HTML5 pattern validation can be added
                  // title={field.title}     // Tooltip for HTML5 pattern
                  aria-describedby={field.name === 'cuit' ? 'cuit-format-settings' : field.name === 'phone' ? 'phone-format-settings' : undefined}
                />
              ))}
               <p id="cuit-format-settings" className="sr-only">Formato CUIT: XX-XXXXXXXX-X</p>
               <p id="phone-format-settings" className="sr-only">Formato Teléfono: XXX-XXXX-XXXX</p>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t border-borderClr mt-auto">
              <Button type="button" variant="ghost" onClick={() => { setIsEditingCompany(false); setError(''); }} disabled={isLoading}>Cancelar</Button>
              <Button type="submit" isLoading={isLoading} variant="primary">Guardar Cambios</Button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col flex-grow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6 flex-grow content-start">
              {companyDetailsFields.map(field => (
                <div key={field.name}>
                  <p className="text-sm font-medium text-content-muted">{field.label}</p>
                  <p className="text-content">{currentCompany[field.name] || 'N/A'}</p>
                </div>
              ))}
            </div>
            {error && !isEditingCompany && <p className="text-sm text-red-500 my-2">{error}</p>}
            <div className="flex justify-end mt-auto">
              <Button onClick={() => setIsEditingCompany(true)} variant="neutral">Editar Información</Button>
            </div>
          </div>
        )}
      </Card>

      <Card title="Gestión de Empleados" className="flex flex-col flex-grow min-h-0">
        <div className="flex justify-between items-center mb-4">
            <p className="text-content-muted">Administre los empleados de la empresa.</p>
            <Button onClick={() => openEmployeeModal()} variant="neutral">Añadir Empleado</Button>
        </div>
        {currentCompany.employees && currentCompany.employees.length > 0 ? (
            <div className="overflow-auto flex-grow flex flex-col min-h-0 border border-borderClr rounded-md">
                <table className="min-w-full bg-surface flex-1 flex flex-col">
                    <thead className="bg-surface-subtle sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-content-muted uppercase tracking-wider">Nombre</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-content-muted uppercase tracking-wider">Email</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-content-muted uppercase tracking-wider">Rol</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-content-muted uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-borderClr flex-1 overflow-y-auto">
                        {currentCompany.employees.map(emp => (
                            <tr key={emp.id} className="hover:bg-surface-light">
                                <td className="px-4 py-3 text-sm text-content align-middle">{emp.name}</td>
                                <td className="px-4 py-3 text-sm text-content align-middle">{emp.email}</td>
                                <td className="px-4 py-3 text-sm text-content align-middle">{emp.role}</td>
                                <td className="px-4 py-3 text-sm space-x-2 align-middle">
                                    <Button variant="ghost" size="sm" onClick={() => openEmployeeModal(emp)} disabled={isLoading}><EditIcon/></Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteEmployee(emp.id)} className="text-danger" disabled={isLoading}><TrashIcon/></Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <div className="flex-grow flex justify-center items-center"><p className="text-center text-content-muted py-4">No hay empleados registrados.</p></div>
        )}
         {error && !isEditingCompany && !isManagingEmployees && <p className="text-sm text-red-500 mt-2">{error}</p>}
      </Card>
      
       {isManagingEmployees && ( 
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-lg shadow-xl p-6 w-full max-w-lg mx-auto flex flex-col">
            <h3 className="text-xl font-semibold text-content mb-4">{editingEmployee ? "Editar Empleado" : "Añadir Empleado"}</h3>
            <form onSubmit={handleSaveEmployee} className="space-y-4 flex flex-col flex-grow">
                <div className="flex-grow overflow-y-auto space-y-4 pr-1">
                    <Input label="Nombre Completo" name="name" value={employeeFormData.name || ''} onChange={handleEmployeeChange} required />
                    <Input label="Email" type="email" name="email" value={employeeFormData.email || ''} onChange={handleEmployeeChange} required />
                    <Input label="Rol" name="role" value={employeeFormData.role || ''} onChange={handleEmployeeChange} required />
                    {employeeModalError && <p className="text-sm text-red-500">{employeeModalError}</p>}
                </div>
                <div className="flex justify-end space-x-3 pt-4 border-t border-borderClr mt-auto">
                    <Button type="button" variant="ghost" onClick={closeEmployeeModal} disabled={isLoading}>Cancelar</Button>
                    <Button type="submit" isLoading={isLoading} variant="primary">{editingEmployee ? "Actualizar Empleado" : "Añadir Empleado"}</Button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;