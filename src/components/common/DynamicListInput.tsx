
import React from 'react';
import { Input } from './Input';
import { Button } from './Button';
import { TrashIcon, PlusIcon } from './Icons';

interface DynamicListInputProps {
  label: string;
  items: { id: string, value: string }[];
  setItems: React.Dispatch<React.SetStateAction<{ id: string, value: string }[]>>;
  placeholder?: string;
}
export const DynamicListInput: React.FC<DynamicListInputProps> = ({ label, items, setItems, placeholder }) => {
  const handleAddItem = () => {
    setItems([...items, { id: Date.now().toString(), value: '' }]);
  };

  const handleRemoveItem = (idToRemove: string) => {
    setItems(items.filter(item => item.id !== idToRemove));
  };

  const handleItemChange = (idToChange: string, newValue: string) => {
    setItems(items.map(item => item.id === idToChange ? { ...item, value: newValue } : item));
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-content-muted mb-2">{label}</label>
      {items.map((item, index) => (
        <div key={item.id} className="flex items-center mb-2 p-2 border border-borderClr-subtle rounded-md bg-surface-light">
          <Input
            label="" 
            type="text"
            placeholder={`${placeholder || 'Ítem'} ${index + 1}`}
            value={item.value}
            onChange={(e) => handleItemChange(item.id, e.target.value)}
            className="flex-grow !mb-0 mr-2" 
          />
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => handleRemoveItem(item.id)} 
            className="p-2 text-content-muted hover:text-danger" 
            size="sm"
            aria-label={`Eliminar ${placeholder || 'Ítem'} ${index + 1}`}
          >
            <TrashIcon className="w-4 h-4" />
          </Button>
        </div>
      ))}
      <Button 
        type="button" 
        variant="neutral" 
        onClick={handleAddItem} 
        className="flex items-center mt-2"
        size="sm"
      >
        <PlusIcon className="w-4 h-4 mr-1.5"/>
        Añadir {placeholder || 'Ítem'}
      </Button>
    </div>
  );
};

export default DynamicListInput;