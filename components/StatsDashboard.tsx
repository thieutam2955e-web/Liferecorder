import React, { useMemo } from 'react';
import { TOTAL_YEARS } from '../constants';
import { Clock, Moon, Calendar, Activity } from 'lucide-react';

interface StatsDashboardProps {
  dob: string;
}

const getLifeMessage = (hour: number): string => {
  if (hour < 6) return "Life is in its early dawn. Infinite possibilities await.";
  if (hour < 9) return "Good Morning! The most energetic hours are here.";
  if (hour < 12) return "Mid-morning. Prime time for building and growing.";
  if (hour < 14) return "High Noon. You are in your radiant prime.";
  if (hour < 18) return "Afternoon tea. Mature, composed, harvesting results.";
  if (hour < 22) return "Evening sunset. Wisdom and peace are the gifts now.";
  return "Late night silence. Looking back at the stars of your story.";
};

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ dob }) => {
  const stats = useMemo(() => {
    if (!dob) return null;

    const birthDate = new Date(dob);
    const now = new Date();
    const diffTime = now.getTime() - birthDate.getTime();
    
    if (diffTime < 0) return null; // Future date

    const daysLived = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weeksLived = Math.floor(daysLived / 7);
    const sleepHours = daysLived * 8; // Assuming 8 hours avg

    // Life Clock Calculation
    const lifePercentage = daysLived / (TOTAL_YEARS * 365.25);
    const totalMinutesInDay = 24 * 60;
    const currentLifeMinutes = totalMinutesInDay * Math.min(Math.max(lifePercentage, 0), 1);
    
    const clockHour = Math.floor(currentLifeMinutes / 60);
    const clockMinute = Math.floor(currentLifeMinutes % 60);
    const timeStr = `${String(clockHour).padStart(2, '0')}:${String(clockMinute).padStart(2, '0')}`;
    const message = getLifeMessage(clockHour);

    return { daysLived, weeksLived, sleepHours, timeStr, message };
  }, [dob]);

  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] flex flex-col items-center justify-center text-center hover:scale-105 transition-transform duration-300">
        <div className="mb-2 p-2 bg-blue-50 text-blue-500 rounded-full">
          <Calendar className="w-5 h-5" />
        </div>
        <div className="text-2xl font-bold text-slate-800">{stats.daysLived.toLocaleString()}</div>
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Days on Earth</div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] flex flex-col items-center justify-center text-center hover:scale-105 transition-transform duration-300">
        <div className="mb-2 p-2 bg-emerald-50 text-emerald-500 rounded-full">
          <Activity className="w-5 h-5" />
        </div>
        <div className="text-2xl font-bold text-slate-800">{stats.weeksLived.toLocaleString()}</div>
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Weeks Lived</div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] flex flex-col items-center justify-center text-center hover:scale-105 transition-transform duration-300">
        <div className="mb-2 p-2 bg-indigo-50 text-indigo-500 rounded-full">
          <Moon className="w-5 h-5" />
        </div>
        <div className="text-2xl font-bold text-slate-800">{stats.sleepHours.toLocaleString()}</div>
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Hours Slept</div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] flex flex-col items-center justify-center text-center hover:scale-105 transition-transform duration-300">
        <div className="mb-2 p-2 bg-amber-50 text-amber-500 rounded-full">
          <Clock className="w-5 h-5" />
        </div>
        <div className="text-2xl font-bold text-amber-500 font-mono tracking-tighter">{stats.timeStr}</div>
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Life Clock</div>
        <div className="hidden lg:block text-[10px] text-slate-400 mt-2 italic px-2 leading-tight">
          {stats.message}
        </div>
      </div>
    </div>
  );
};