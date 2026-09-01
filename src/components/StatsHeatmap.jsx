import React, { useMemo } from 'react';

const StatsHeatmap = ({ notes }) => {
  const data = useMemo(() => {
    const counts = {};
    let maxCount = 0;
    let total = 0;
    notes.forEach(note => {
      if (note.date_added) {
        const d = new Date(note.date_added);
        if (!isNaN(d.getTime())) {
          const dateStr = d.toISOString().split('T')[0];
          counts[dateStr] = (counts[dateStr] || 0) + 1;
          total++;
          if (counts[dateStr] > maxCount) {
            maxCount = counts[dateStr];
          }
        }
      }
    });
    return { counts, maxCount, total };
  }, [notes]);

  const { counts, total } = data;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Determine start date to make exactly 52 weeks + remaining days of current week
  const dayOfWeek = today.getDay(); // 0 (Sun) to 6 (Sat)
  const daysToShow = 52 * 7 + (dayOfWeek + 1);
  
  const days = [];
  for (let i = daysToShow - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(d);
  }

  const getLevel = (count) => {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    if (count <= 10) return 3;
    return 4;
  };

  const getColorClass = (level) => {
    if (level === 0) return "bg-black/10 dark:bg-white/10";
    if (level === 1) return "bg-blueprint-text/40 dark:bg-crt-text/40";
    if (level === 2) return "bg-blueprint-text/60 dark:bg-crt-text/60";
    if (level === 3) return "bg-blueprint-text/80 dark:bg-crt-text/80";
    return "bg-blueprint-text dark:bg-crt-text shadow-[0_0_8px_rgba(0,0,0,0.5)] dark:shadow-[0_0_8px_rgba(255,255,255,0.5)]";
  };

  // Create month labels
  const monthLabels = [];
  let currentMonth = -1;
  days.forEach((day, index) => {
    // only record first day of the week if month changed
    if (index % 7 === 0) {
      const m = day.getMonth();
      if (m !== currentMonth) {
        monthLabels.push({ label: day.toLocaleString('default', { month: 'short' }), index: index / 7 });
        currentMonth = m;
      }
    }
  });

  return (
    <div className="border-2 border-current p-4 sm:p-6 bg-white/5 dark:bg-black/50 overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-2">
        <h2 className="text-xl font-bold uppercase tracking-widest">Activity Heatmap</h2>
        <div className="text-sm font-bold uppercase opacity-80 border border-current px-3 py-1">
          {total} Total Entries
        </div>
      </div>
      
      <div className="w-full overflow-x-auto pb-4 no-scrollbar">
        <div className="min-w-max">
          {/* Months */}
          <div className="flex text-xs font-bold uppercase opacity-70 mb-2 relative h-4">
            {monthLabels.map((m, i) => (
              <div 
                key={i} 
                className="absolute" 
                style={{ left: `${m.index * 16}px` }}
              >
                {m.label}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            {/* Days of week labels */}
            <div className="grid grid-rows-7 gap-1 text-[10px] font-bold uppercase opacity-60 mt-1 leading-[14px]">
              <div className="h-[14px]"></div>
              <div className="h-[14px]">Mon</div>
              <div className="h-[14px]"></div>
              <div className="h-[14px]">Wed</div>
              <div className="h-[14px]"></div>
              <div className="h-[14px]">Fri</div>
              <div className="h-[14px]"></div>
            </div>

            {/* Heatmap Grid */}
            <div className="grid grid-rows-7 grid-flow-col gap-1">
              {days.map((day) => {
                const dateStr = day.toISOString().split('T')[0];
                const count = counts[dateStr] || 0;
                const level = getLevel(count);
                
                return (
                  <div 
                    key={dateStr}
                    className={`w-[14px] h-[14px] border border-current/20 ${getColorClass(level)}`}
                    title={`${dateStr}: ${count} entries`}
                  ></div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-end gap-2 mt-4 text-xs font-bold uppercase opacity-80">
        <span>Less</span>
        <div className={`w-3 h-3 border border-current/20 ${getColorClass(0)}`}></div>
        <div className={`w-3 h-3 border border-current/20 ${getColorClass(1)}`}></div>
        <div className={`w-3 h-3 border border-current/20 ${getColorClass(2)}`}></div>
        <div className={`w-3 h-3 border border-current/20 ${getColorClass(3)}`}></div>
        <div className={`w-3 h-3 border border-current/20 ${getColorClass(4)}`}></div>
        <span>More</span>
      </div>
    </div>
  );
};

export default StatsHeatmap;
