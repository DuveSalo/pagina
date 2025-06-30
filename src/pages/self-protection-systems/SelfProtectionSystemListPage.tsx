
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SelfProtectionSystem } from '../../../types';
import { ROUTE_PATHS, MODULE_TITLES } from '../../../constants';
import * as api from '../../api/mockApi';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { Card } from '../../components/common/Card';
import { EditIcon, TrashIcon } from '../../components/common/Icons';

const SelfProtectionSystemListPage: React.FC = () => {
  const [systems, setSystems] = useState<SelfProtectionSystem[]>([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(''); 
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const loadSystems = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await api.getSelfProtectionSystems();
      setSystems(data);
    } catch (err: any) {
      setError((err as Error).message || "Error al cargar sistemas de autoprotección");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSystems();
  }, [loadSystems]);

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Está seguro de que desea eliminar este sistema?")) {
      setIsDeleting(true);
      setError('');
      try {
        await api.deleteSelfProtectionSystem(id);
        loadSystems();
      } catch (err: any) {
        setError((err as Error).message || "Error al eliminar el sistema");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
            <p className="text-content tracking-light text-[32px] font-bold leading-tight min-w-72">{MODULE_TITLES.SELF_PROTECTION_SYSTEMS}</p>
            <Button onClick={() => navigate(ROUTE_PATHS.NEW_SELF_PROTECTION_SYSTEM)} variant="neutral">Nuevo Sistema...</Button>
        </div>
       {isLoading && <div className="flex-grow flex justify-center items-center"><Spinner className="w-10 h-10" /></div>}
       {error && !isLoading && <div className="flex-grow flex justify-center items-center"><p className="text-red-500 text-center py-5">{error}</p></div>}
       {isDeleting && <p className="text-center text-content-muted py-2">Eliminando...</p>}

        {!isLoading && !error && systems.length === 0 && (
            <div className="flex-grow flex justify-center items-center"><p className="text-center text-content-muted py-10">No hay sistemas registrados.</p></div>
        )}
        {!isLoading && !error && systems.length > 0 && (
            <div className="flex-grow rounded-xl border border-borderClr bg-surface overflow-hidden flex flex-col min-h-0">
                <div className="overflow-x-auto flex-grow flex flex-col">
                    <table className="min-w-full flex-1 flex flex-col">
                        <thead className="bg-surface sticky top-0 z-10">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-content-muted uppercase tracking-wider">Disp. Probatoria</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-content-muted uppercase tracking-wider">Vencimiento</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-content-muted uppercase tracking-wider">Interviniente</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-content-muted uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="flex-1 overflow-y-auto">
                        {systems.map(sys => (
                            <tr key={sys.id} className="border-t border-t-borderClr hover:bg-surface-light">
                            <td className="px-4 py-3 text-sm text-content align-middle">{sys.probatoryDispositionDate || 'N/A'}</td>
                            <td className="px-4 py-3 text-sm text-content align-middle">{sys.expirationDate}</td>
                            <td className="px-4 py-3 text-sm text-content align-middle">{sys.intervener}</td>
                            <td className="px-4 py-3 text-sm space-x-2 align-middle">
                                <Button variant="ghost" size="sm" onClick={() => navigate(ROUTE_PATHS.EDIT_SELF_PROTECTION_SYSTEM.replace(':id', sys.id))} disabled={isDeleting}><EditIcon/></Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(sys.id)} className="text-danger" disabled={isDeleting}><TrashIcon/></Button>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
    </div>
  );
};

export default SelfProtectionSystemListPage;