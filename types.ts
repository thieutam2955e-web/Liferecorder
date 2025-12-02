export enum Mood {
  Normal = 'normal',
  Happy = 'happy',
  Hard = 'hard'
}

export interface WeekData {
  note: string;
  mood: Mood;
  title?: string;
  icon?: string;
}

export interface LifeDataMap {
  [weekIndex: number]: WeekData;
}

export interface ExportData {
  version: string;
  dob: string | null;
  records: LifeDataMap;
  exportDate: string;
}

export interface LifeStats {
  daysLived: number;
  weeksLived: number;
  sleepHours: number;
  lifeClockTime: string;
  lifeClockMessage: string;
}