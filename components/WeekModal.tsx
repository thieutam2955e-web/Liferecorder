import React, { useState, useEffect } from 'react';
import { Mood, WeekData } from '../types';
import { Button } from './ui/Button';
import { X } from 'lucide-react';
import { EVENT_ICONS } from '../constants';

interface WeekModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: WeekData) => void;
  weekIndex: number | null;
  initialData?: WeekData;
}

export const WeekModal: React.FC<WeekModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  weekIndex, 
  initialData 
}) => {
  const [note, setNote] = useState('');
  const [mood, setMood] = useState<Mood>(Mood.Normal);
  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState('');
  const [showIconPicker, setShowIconPicker] = useState(false);

  useEffect(() => {
    if (isOpen && initialData) {
      setNote(initialData.note || '');
      setMood(initialData.mood || Mood.Normal);
      setTitle(initialData.title || '');
      setIcon(initialData.icon || '');
    } else if (isOpen) {
      setNote('');
      setMood(Mood.Normal);
      setTitle('');
      setIcon('');
    }
    setShowIconPicker(false);
  }, [isOpen, initialData]);

  if (!isOpen || weekIndex === null) return null;

  const year = Math.floor(weekIndex / 52);
  const week = (weekIndex % 52) + 1;

  const handleSave = () => {
    onSave({ note, mood, title, icon });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-slate-50/50 flex-shrink-0">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              Age {year} <span className="text-slate-400 mx-1">·</span> Week {week}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Edit this week's details</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body - Scrollable */}
        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
          
          {/* Event Section */}
          <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100 space-y-3">
             <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-purple-900 uppercase tracking-wider">Major Life Event</label>
                {icon && (
                  <button onClick={() => { setIcon(''); setTitle(''); }} className="text-[10px] text-red-400 hover:text-red-600">Clear Event</button>
                )}
             </div>
             
             <div className="flex gap-3">
               <div className="relative">
                 <button 
                  type="button"
                  onClick={() => setShowIconPicker(!showIconPicker)}
                  className="w-10 h-10 flex items-center justify-center bg-white border border-purple-200 rounded-lg hover:border-purple-400 text-xl shadow-sm transition-all"
                 >
                   {icon || <span className="opacity-30 text-sm">Icon</span>}
                 </button>
                 
                 {showIconPicker && (
                   <div className="absolute top-full left-0 mt-2 p-2 bg-white rounded-xl shadow-xl border border-gray-100 w-64 z-10 grid grid-cols-6 gap-1">
                     {EVENT_ICONS.map((ic) => (
                       <button
                         key={ic}
                         onClick={() => { setIcon(ic); setShowIconPicker(false); }}
                         className="aspect-square flex items-center justify-center text-lg hover:bg-gray-100 rounded-md"
                       >
                         {ic}
                       </button>
                     ))}
                   </div>
                 )}
               </div>
               
               <input
                 type="text"
                 value={title}
                 onChange={(e) => setTitle(e.target.value)}
                 placeholder="Event Title (e.g. Graduated)"
                 className="flex-1 px-3 py-2 text-sm border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
               />
             </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">My Note</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Record a memory: Moved to a new city, started a job, or just a quiet week..."
              className="w-full h-24 p-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none bg-slate-50 placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Mood</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setMood(Mood.Normal)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                  mood === Mood.Normal 
                    ? 'bg-slate-100 border-slate-300 ring-1 ring-slate-300' 
                    : 'border-gray-100 hover:bg-slate-50 hover:border-slate-200'
                }`}
              >
                <span className="text-xl mb-1">☁️</span>
                <span className="text-xs font-medium text-slate-600">Normal</span>
              </button>

              <button
                type="button"
                onClick={() => setMood(Mood.Happy)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                  mood === Mood.Happy 
                    ? 'bg-amber-50 border-amber-300 ring-1 ring-amber-300' 
                    : 'border-gray-100 hover:bg-amber-50/50 hover:border-amber-200'
                }`}
              >
                <span className="text-xl mb-1">☀️</span>
                <span className="text-xs font-medium text-slate-600">Happy</span>
              </button>

              <button
                type="button"
                onClick={() => setMood(Mood.Hard)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                  mood === Mood.Hard 
                    ? 'bg-slate-200 border-slate-400 ring-1 ring-slate-400' 
                    : 'border-gray-100 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <span className="text-xl mb-1">🌧️</span>
                <span className="text-xs font-medium text-slate-600">Hard</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 flex-shrink-0">
          <Button variant="ghost" onClick={onClose} size="sm">Cancel</Button>
          <Button variant="primary" onClick={handleSave} size="sm">Save Memory</Button>
        </div>
      </div>
    </div>
  );
};