
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { EventInformation } from '../../../types';
import { ROUTE_PATHS, MODULE_TITLES } from '../../../constants';
import * as api from '../../api/mockApi';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { EditIcon, TrashIcon } from '../../components/common/Icons';

const EventInformationListPage: React.FC = () => {
  const [events, setEvents] = useState<EventInformation[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(''); 
  const navigate = useNavigate();
  
  const loadEvents = useCallback(async () => {
    setIsLoadingData(true);
    setError('');
    try {
      const data = await api.getEvents();
      setEvents(data);
    } catch (err: any) {
      setError((err as Error).message || "Error al cargar información de eventos");
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Está seguro de que desea eliminar este evento?")) {
      setIsDeleting(true); 
      setError('');
      try {
        await api.deleteEvent(id);
        loadEvents();
      } catch (err: any) {
        setError((err as Error).message || "Error al eliminar el evento.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const tableEvents = useMemo(() => events.map(event => ({
    id: event.id,
    nombre: event.description.substring(0, 50) + (event.description.length > 50 ? "..." : ""), 
    tipo: "Incidente/Reporte", 
    fecha: event.date, 
    ubicacion: "N/A", 
    estado: "Registrado", 
    originalEvent: event, 
  })), [events]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
        <p className="text-content tracking-light text-[32px] font-bold leading-tight min-w-72">{MODULE_TITLES.EVENT_INFORMATION}</p>
        <Button onClick={() => navigate(ROUTE_PATHS.NEW_EVENT_INFORMATION)} variant="neutral">Crear Nuevo...</Button>
      </div>

      {isLoadingData && <div className="flex-grow flex justify-center items-center"><Spinner className="w-10 h-10" /></div>}
      {error && !isLoadingData && <div className="flex-grow flex justify-center items-center"><p className="text-red-500 text-center py-5">{error}</p></div>}
      {isDeleting && <p className="text-center text-content-muted py-2">Eliminando...</p>}
      
      {!isLoadingData && !error && tableEvents.length === 0 && (
        <div className="flex-grow flex justify-center items-center"><p className="text-center text-content-muted py-10">No hay eventos registrados.</p></div>
      )}

      {!isLoadingData && !error && tableEvents.length > 0 && (
        <div className="flex-grow rounded-xl border border-borderClr bg-surface overflow-hidden flex flex-col min-h-0">
          <table className="min-w-full flex-1 flex flex-col">
            <thead className="bg-surface sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-content w-[30%] text-sm font-medium leading-normal">Nombre del Evento</th>
                <th className="px-4 py-3 text-left text-content w-[15%] text-sm font-medium leading-normal">Tipo</th>
                <th className="px-4 py-3 text-left text-content w-[15%] text-sm font-medium leading-normal">Fecha</th>
                <th className="px-4 py-3 text-left text-content w-[20%] text-sm font-medium leading-normal">Ubicación</th>
                <th className="px-4 py-3 text-left text-content w-[10%] text-sm font-medium leading-normal">Estado</th>
                <th className="px-4 py-3 text-left text-content-muted w-[10%] text-sm font-medium leading-normal">Acciones</th>
              </tr>
            </thead>
            <tbody className="flex-1 overflow-y-auto">
              {tableEvents.map(event => (
                <tr key={event.id} className="border-t border-t-borderClr">
                  <td className="h-[72px] px-4 py-2 text-content text-sm font-normal leading-normal align-middle">{event.nombre}</td>
                  <td className="h-[72px] px-4 py-2 text-content-muted text-sm font-normal leading-normal align-middle">{event.tipo}</td>
                  <td className="h-[72px] px-4 py-2 text-content-muted text-sm font-normal leading-normal align-middle">{event.fecha}</td>
                  <td className="h-[72px] px-4 py-2 text-content-muted text-sm font-normal leading-normal align-middle">{event.ubicacion}</td>
                  <td className="h-[72px] px-4 py-2 text-sm font-normal leading-normal align-middle">
                     <Button variant="neutral" size="sm" className="w-full !h-7 !text-xs cursor-default">{event.estado}</Button>
                  </td>
                  <td className="h-[72px] px-4 py-2 text-sm font-normal leading-normal space-x-2 align-middle">
                    <Button variant="ghost" size="sm" onClick={() => navigate(ROUTE_PATHS.EDIT_EVENT_INFORMATION.replace(':id', event.id))} className="text-primary hover:text-primary-dark p-1" disabled={isDeleting}>
                        <EditIcon/>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(event.id)} className="text-accent hover:text-rose-700 p-1" disabled={isDeleting}>
                        <TrashIcon/>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EventInformationListPage;