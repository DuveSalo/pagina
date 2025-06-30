
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EventInformation, DynamicListItem } from '../../../types';
import { ROUTE_PATHS, MOCK_COMPANY_ID } from '../../../constants';
import * as api from '../../api/mockApi';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Textarea } from '../../components/common/Textarea';
import { Checkbox } from '../../components/common/Checkbox';
import { DynamicListInput } from '../../components/common/DynamicListInput';
import { Card } from '../../components/common/Card';
import { Spinner } from '../../components/common/Spinner';

interface EventFormDataType {
  date: string;
  time: string;
  description: string;
  correctiveActions: string;
  testimonials: DynamicListItem[];
  observations: DynamicListItem[];
  finalChecks: { [key: string]: boolean };
}

const createInitialFormState = (): EventFormDataType => ({
  date: new Date().toISOString().split('T')[0],
  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
  description: '',
  correctiveActions: '',
  testimonials: [],
  observations: [],
  finalChecks: {
    usoMatafuegos: false,
    requerimientosServicios: false,
    danoPersonas: false,
    danosEdilicios: false,
    evacuacion: false,
  },
});

const CreateEditEventInformationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [formError, setFormError] = useState('');
  const [pageError, setPageError] = useState('');

  const [currentFormData, setCurrentFormData] = useState<EventFormDataType>(createInitialFormState());

  useEffect(() => {
    if (id) {
      setIsLoadingData(true);
      setPageError('');
      api.getEvents().then(events => {
        const eventToEdit = events.find(e => e.id === id);
        if (eventToEdit) {
          setCurrentFormData({
            date: eventToEdit.date,
            time: eventToEdit.time,
            description: eventToEdit.description,
            correctiveActions: eventToEdit.correctiveActions,
            testimonials: eventToEdit.testimonials ? eventToEdit.testimonials.map((t, i) => ({ id: `testimonial-${id}-${i}-${Date.now()}`, value: t })) : [],
            observations: eventToEdit.observations ? eventToEdit.observations.map((o, i) => ({ id: `observation-${id}-${i}-${Date.now()}`, value: o })) : [],
            finalChecks: {
              ...(createInitialFormState().finalChecks), 
              ...(eventToEdit.finalChecks || {}),
            },
          });
        } else {
          setPageError("Evento no encontrado.");
          setCurrentFormData(createInitialFormState());
        }
      }).catch(err => {
        setPageError((err as Error).message || "Error al cargar datos del evento.");
        setCurrentFormData(createInitialFormState());
      })
      .finally(() => setIsLoadingData(false));
    } else {
      setCurrentFormData(createInitialFormState());
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    if (name.startsWith("finalChecks.")) {
      const checkKey = name.split(".")[1];
      setCurrentFormData(prev => ({ ...prev, finalChecks: { ...prev.finalChecks, [checkKey]: checked as boolean } }));
    } else {
      setCurrentFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleTestimonialsChange = (items: DynamicListItem[]) => {
    setCurrentFormData(prev => ({ ...prev, testimonials: items }));
  };

  const handleObservationsChange = (items: DynamicListItem[]) => {
    setCurrentFormData(prev => ({ ...prev, observations: items }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');
    
    const fullApiData: Omit<EventInformation, 'id' | 'companyId'> = {
      date: currentFormData.date,
      time: currentFormData.time,
      description: currentFormData.description,
      correctiveActions: currentFormData.correctiveActions,
      testimonials: currentFormData.testimonials.map(item => item.value),
      observations: currentFormData.observations.map(item => item.value),
      finalChecks: currentFormData.finalChecks,
      physicalEvidence: [], 
      physicalEvidenceNames: [],
    };

    try {
      if (id) {
        await api.updateEvent({ ...fullApiData, id, companyId: MOCK_COMPANY_ID });
      } else {
        await api.createEvent(fullApiData);
      }
      navigate(ROUTE_PATHS.EVENT_INFORMATION);
    } catch (err: any) {
      setFormError((err as Error).message || "Error al guardar el evento.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (id) {
      const eventToDownload = await api.getEvents().then(events => events.find(e => e.id === id));
      if (eventToDownload) {
        await api.downloadEventPDF(eventToDownload);
      } else {
        alert("No se pudo encontrar el evento para descargar.");
      }
    } else {
      alert("Guarde el evento primero para poder descargar el PDF.");
    }
  };

  const finalCheckItems = [
    { key: 'usoMatafuegos', label: "Uso de matafuegos y otros elementos de extinción." },
    { key: 'requerimientosServicios', label: "Requerimientos de servicios médicos privados, SAME, bomberos, Defensa Civil, Guardia de auxilio y Policia." },
    { key: 'danoPersonas', label: "Daño a personas." },
    { key: 'danosEdilicios', label: "Daños edilicios." },
    { key: 'evacuacion', label: "Evacuación parcial o total del edificio." },
  ];

  if (isLoadingData) return <div className="flex-grow flex justify-center items-center"><Spinner className="w-10 h-10" /></div>;
  if (pageError) return <div className="flex-grow flex justify-center items-center"><p className="text-red-500 text-center py-10">{pageError}</p></div>;

  const pageTitle = id ? "Editar Información del Evento" : "Nueva Información del Evento";

  return (
    <Card title={pageTitle} className="flex-grow">
      <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
        <div className="flex-grow overflow-y-auto space-y-4 pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Fecha" type="date" name="date" value={currentFormData.date} onChange={handleChange} required />
            <Input label="Horario" type="time" name="time" value={currentFormData.time} onChange={handleChange} required />
          </div>
          <Textarea label="Descripción Detallada" name="description" value={currentFormData.description} onChange={handleChange} required />
          <Textarea label="Acciones Correctivas Propuestas" name="correctiveActions" value={currentFormData.correctiveActions} onChange={handleChange} required />

          <DynamicListInput
            label="Testimonios"
            items={currentFormData.testimonials}
            setItems={handleTestimonialsChange}
            placeholder="Testimonio"
          />
          <DynamicListInput
            label="Observaciones"
            items={currentFormData.observations}
            setItems={handleObservationsChange}
            placeholder="Observación"
          />

          <h4 className="text-md font-semibold pt-3 border-t border-borderClr mt-5 text-content">Verificaciones Finales</h4>
          {finalCheckItems.map(check => (
            <Checkbox
              key={check.key}
              label={check.label}
              name={`finalChecks.${check.key}`}
              checked={currentFormData.finalChecks?.[check.key] || false}
              onChange={handleChange}
            />
          ))}
          {formError && <p className="text-sm text-red-500">{formError}</p>}
        </div>
        <div className="flex justify-end space-x-3 pt-4 border-t border-borderClr mt-auto">
          <Button type="button" variant="ghost" onClick={() => navigate(ROUTE_PATHS.EVENT_INFORMATION)} disabled={isSubmitting}>Cancelar</Button>
          <Button type="button" variant="secondary" onClick={handleDownloadPDF} disabled={!id || isSubmitting}>Descargar PDF</Button>
          <Button type="submit" isLoading={isSubmitting} variant="primary">{id ? "Actualizar" : "Guardar"}</Button>
        </div>
      </form>
    </Card>
  );
};

export default CreateEditEventInformationPage;