import React, { useMemo } from 'react';
import { TOTAL_WEEKS, MOOD_COLORS } from '../constants';
import { LifeDataMap, Mood } from '../types';

interface LifeGridProps {
  dob: string;
  data: LifeDataMap;
  onWeekClick: (index: number) => void;
}

export const LifeGrid: React.FC<LifeGridProps> = ({ dob, data, onWeekClick }) => {
  const weeksLived = useMemo(() => {
    if (!dob) return 0;
    const diff = new Date().getTime() - new Date(dob).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
  }, [dob]);

  // Memoize the grid array generation
  const gridItems = useMemo(() => {
    return Array.from({ length: TOTAL_WEEKS }, (_, i) => i);
  }, []);

  if (!dob) return (
    <div className="flex flex-col items-center justify-center py-20 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
      <p className="text-lg font-medium">Please enter your birth date above to generate your life grid.</p>
    </div>
  );

  return (
    <div className="w-full">
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-6 mb-6 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-sm ${MOOD_COLORS.happy}`}></div>
          <span>Happy Moments</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-sm ${MOOD_COLORS.hard}`}></div>
          <span>Hard Times</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-sm ${MOOD_COLORS.normal}`}></div>
          <span>Lived (Normal)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-white border border-gray-200"></div>
          <span>Future</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm border-2 border-purple-400 bg-purple-50"></div>
          <span>Life Event</span>
        </div>
      </div>

      {/* Grid Container */}
      <div className="relative w-full overflow-x-auto custom-scrollbar pb-4">
        {/* 
           We use min-w-max to ensure the grid doesn't crush on small screens.
           On mobile, users can scroll horizontally to see the full 52 weeks if needed, 
           or zoom out.
        */}
        <div 
          className="grid gap-[2px] mx-auto min-w-[350px] md:min-w-full"
          style={{ 
            gridTemplateColumns: 'repeat(52, 1fr)',
          }}
        >
          {gridItems.map((index) => {
            const isPast = index < weeksLived;
            const weekData = data[index];
            const hasEvent = !!weekData?.title;
            
            let colorClass = MOOD_COLORS.future;
            let borderClass = 'border-gray-100'; // Default future border
            let extraClass = '';

            if (isPast) {
              // Default to neutral for past
              colorClass = MOOD_COLORS.normal;
              borderClass = 'border-transparent';

              // Override if data exists
              if (weekData?.mood === Mood.Happy) colorClass = MOOD_COLORS.happy;
              else if (weekData?.mood === Mood.Hard) colorClass = MOOD_COLORS.hard;
            }

            if (hasEvent) {
               extraClass = 'ring-2 ring-purple-400 ring-offset-[1px] z-10';
               // If it's a future event (rare but possible), ensure it has a background
               if (!isPast) colorClass = 'bg-purple-50';
            }

            // Construct Tooltip
            const age = Math.floor(index/52);
            let titleText = isPast ? `Age ${age}` : 'Future';
            if (weekData?.title) {
              titleText = `${weekData.icon ? weekData.icon + ' ' : ''}${weekData.title} (Age ${age})`;
            } else if (weekData?.note) {
              titleText = `Age ${age}: ${weekData.note}`;
            }

            return (
              <div
                key={index}
                onClick={() => onWeekClick(index)}
                title={titleText}
                className={`
                  aspect-square rounded-[1px] cursor-pointer transition-all duration-200 
                  border ${borderClass} ${colorClass} ${extraClass}
                  hover:scale-150 hover:z-20 hover:shadow-lg hover:rounded-sm hover:border-gray-400
                  ${!isPast && !hasEvent ? 'hover:bg-blue-50' : ''}
                `}
              />
            );
          })}
        </div>
      </div>
      
      {/* Age markers helper */}
      <div className="flex justify-between text-[10px] text-slate-300 mt-2 px-1">
        <span>Age 0</span>
        <span>Age 50</span>
        <span>Age 100</span>
      </div>
    </div>
  );
};