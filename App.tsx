import React, { useState, useEffect, useRef } from 'react';
import { Download, Upload, Info, CalendarPlus } from 'lucide-react';
import { Button } from './components/ui/Button';
import { StatsDashboard } from './components/StatsDashboard';
import { LifeGrid } from './components/LifeGrid';
import { WeekModal } from './components/WeekModal';
import { AddEventModal } from './components/AddEventModal';
import { 
  getLifeData, 
  saveLifeData, 
  getDob, 
  saveDob as persistDob, 
  exportDataToJson, 
  parseImportFile 
} from './services/storageService';
import { LifeDataMap, WeekData, Mood } from './types';
import { TOTAL_WEEKS } from './constants';

function App() {
  // State
  const [dob, setDob] = useState<string>('');
  const [lifeData, setLifeData] = useState<LifeDataMap>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  
  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load initial data
  useEffect(() => {
    setDob(getDob());
    setLifeData(getLifeData());
  }, []);

  // Handlers
  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDob = e.target.value;
    setDob(newDob);
    persistDob(newDob);
  };

  const handleWeekClick = (index: number) => {
    setSelectedWeek(index);
    setModalOpen(true);
  };

  const handleSaveWeek = (data: WeekData) => {
    if (selectedWeek === null) return;
    
    const newData = {
      ...lifeData,
      [selectedWeek]: data
    };
    
    setLifeData(newData);
    saveLifeData(newData);
  };

  const handleAddEvent = (date: string, title: string, icon: string) => {
    if (!dob) {
      alert("Please set a birth date first.");
      return;
    }
    
    const dobDate = new Date(dob);
    const eventDate = new Date(date);
    
    // Calculate week index
    const diffTime = eventDate.getTime() - dobDate.getTime();
    const weekIndex = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));

    if (weekIndex < 0) {
      alert("Event date cannot be before birth date.");
      return;
    }

    if (weekIndex >= TOTAL_WEEKS) {
      alert("Event date is beyond 100 years!");
      return;
    }

    // Merge with existing data if any, or create new
    const existing = lifeData[weekIndex] || { note: '', mood: Mood.Normal };
    
    const newData = {
      ...lifeData,
      [weekIndex]: {
        ...existing,
        title,
        icon
      }
    };

    setLifeData(newData);
    saveLifeData(newData);
  };

  const handleExport = () => {
    exportDataToJson(dob, lifeData);
  };

  const handleImportTrigger = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (window.confirm('Importing data will overwrite your current records. Are you sure?')) {
      try {
        const { dob: importedDob, records } = await parseImportFile(file);
        setDob(importedDob);
        setLifeData(records);
        persistDob(importedDob);
        saveLifeData(records);
        alert('Data imported successfully!');
      } catch (err) {
        alert('Failed to import file. Please ensure it is a valid backup JSON.');
        console.error(err);
      }
    }
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-800 pb-20">
      {/* Header Section */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Branding */}
            <div>
              <h1 className="text-2xl font-light tracking-[0.2em] text-slate-800">
                LIFE<span className="font-bold text-slate-900">RECORDER</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">MEMENTO MORI · VISUALIZE YOUR JOURNEY</p>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 focus-within:ring-2 focus-within:ring-blue-100 transition-shadow">
                <span className="text-sm text-slate-400 mr-2">🎂</span>
                <input 
                  type="date" 
                  value={dob}
                  onChange={handleDobChange}
                  className="bg-transparent border-none text-sm text-slate-700 focus:ring-0 p-0 font-medium"
                />
              </div>

              <div className="h-6 w-px bg-gray-200 hidden md:block mx-1"></div>

              {dob && (
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={() => setEventModalOpen(true)} 
                  icon={<CalendarPlus size={14} />}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Add Event
                </Button>
              )}

              <Button 
                variant="secondary" 
                size="sm" 
                onClick={handleExport} 
                icon={<Download size={14} />}
              >
                Backup
              </Button>
              
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={handleImportTrigger} 
                icon={<Upload size={14} />}
              >
                Restore
              </Button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".json"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Intro / Empty State */}
        {!dob && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8 flex items-start gap-3">
            <Info className="text-blue-500 w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-blue-800">Welcome to Life Recorder</h3>
              <p className="text-sm text-blue-600 mt-1">
                Set your birth date in the top bar to visualize your life in weeks. 
                Each row represents one year. Click on a week to add a memory or track your mood.
              </p>
            </div>
          </div>
        )}

        {/* Dashboard Stats */}
        <StatsDashboard dob={dob} />

        {/* The Grid */}
        <div className="bg-white p-2 sm:p-6 rounded-2xl shadow-sm border border-gray-200">
          <LifeGrid 
            dob={dob} 
            data={lifeData} 
            onWeekClick={handleWeekClick} 
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 text-center text-slate-400 text-xs pb-10">
        <p>Some squares are for running, some are for resting.</p>
      </footer>

      {/* Modals */}
      <WeekModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)}
        onSave={handleSaveWeek}
        weekIndex={selectedWeek}
        initialData={selectedWeek !== null ? lifeData[selectedWeek] : undefined}
      />

      <AddEventModal 
        isOpen={eventModalOpen}
        onClose={() => setEventModalOpen(false)}
        onSave={handleAddEvent}
        dob={dob}
      />
    </div>
  );
}

export default App;