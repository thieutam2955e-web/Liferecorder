import React, { useState } from 'react';
import { Button } from './ui/Button';
import { X, Calendar } from 'lucide-react';
import { EVENT_ICONS } from '../constants';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (date: string, title: string, icon: string) => void;
  dob: string;
}

export const AddEventModal: React.FC<AddEventModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  dob
}) => {
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(EVENT_ICONS[0]);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    setError('');
    
    if (!date) {
      setError('Please select a date.');
      return;
    }

    if (!title.trim()) {
      setError('Please enter a title for the event.');
      return;
    }

    if (dob && new Date(date) < new Date(dob)) {
      setError('Event date cannot be before birth date.');
      return;
    }

    onSave(date, title, selectedIcon);
    
    // Reset form
    setDate('');
    setTitle('');
    setSelectedIcon(EVENT_ICONS[0]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-100 text-purple-600 rounded-lg">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Add Life Event</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">When did it happen?</label>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-slate-50 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">What happened?</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Graduated, Got Married, First Job..."
              className="w-full p-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-slate-50 placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Choose an Icon</label>
            <div className="grid grid-cols-8 gap-2">
              {EVENT_ICONS.map((icon) => (
                <button
                  key={icon}
                  onClick={() => setSelectedIcon(icon)}
                  className={`aspect-square flex items-center justify-center text-xl rounded-lg transition-all ${
                    selectedIcon === icon 
                      ? 'bg-purple-100 ring-2 ring-purple-500 scale-110' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} size="sm">Cancel</Button>
          <Button variant="primary" onClick={handleSave} size="sm" className="bg-purple-600 hover:bg-purple-700 focus:ring-purple-500">
            Add to Grid
          </Button>
        </div>
      </div>
    </div>
  );
};