import { LifeDataMap, ExportData, Mood } from '../types';
import { LOCAL_STORAGE_KEY_DATA, LOCAL_STORAGE_KEY_DOB } from '../constants';

export const saveLifeData = (data: LifeDataMap): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY_DATA, JSON.stringify(data));
};

export const getLifeData = (): LifeDataMap => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY_DATA);
  return data ? JSON.parse(data) : {};
};

export const saveDob = (dob: string): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY_DOB, dob);
};

export const getDob = (): string => {
  return localStorage.getItem(LOCAL_STORAGE_KEY_DOB) || '';
};

export const exportDataToJson = (dob: string, data: LifeDataMap): void => {
  if (!dob) {
    alert('Please set a birth date before backing up.');
    return;
  }

  const exportObj: ExportData = {
    version: "1.0",
    dob: dob,
    records: data,
    exportDate: new Date().toISOString()
  };

  const dataStr = JSON.stringify(exportObj, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `life_recorder_backup_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const parseImportFile = (file: File): Promise<{ dob: string, records: LifeDataMap }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result;
        if (typeof result !== 'string') throw new Error("Invalid file content");
        
        const parsed = JSON.parse(result);
        
        // Basic validation
        if (!parsed.dob && !parsed.records) {
          throw new Error("Invalid format");
        }

        resolve({
          dob: parsed.dob || '',
          records: parsed.records || {}
        });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("File reading failed"));
    reader.readAsText(file);
  });
};
