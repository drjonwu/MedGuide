
import React, { useMemo } from 'react';
import { MedicationEvent, ActionType } from '../types';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { getActionTheme, getRouteBadgeStyles, parseClinicalDate } from '../utils';

interface TimelineProps {
  events: MedicationEvent[];
  onEventSelect: (id: string) => void;
}

export const Timeline: React.FC<TimelineProps> = ({ events, onEventSelect }) => {
  // Group events by date
  const groupedEvents = useMemo(() => {
    const groups: { [key: string]: MedicationEvent[] } = {};
    events.forEach(event => {
      if (!groups[event.date]) groups[event.date] = [];
      groups[event.date].push(event);
    });
    return Object.keys(groups).sort((a, b) => parseClinicalDate(a).getTime() - parseClinicalDate(b).getTime()).map(date => ({
      date,
      // Sort items: Significant events first, then continued
      items: groups[date].sort((a, b) => {
         if (a.action === ActionType.CONTINUED && b.action !== ActionType.CONTINUED) return 1;
         if (a.action !== ActionType.CONTINUED && b.action === ActionType.CONTINUED) return -1;
         return 0;
      })
    }));
  }, [events]);

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 md:py-10 md:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <h2 className="text-2xl font-bold text-slate-900">Medication Timeline</h2>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className={`flex items-center gap-1 px-2 py-1 rounded font-medium ${getActionTheme(ActionType.STARTED).badgeBg} ${getActionTheme(ActionType.STARTED).badgeText}`}>Started</span>
          <span className={`flex items-center gap-1 px-2 py-1 rounded font-medium ${getActionTheme(ActionType.STOPPED).badgeBg} ${getActionTheme(ActionType.STOPPED).badgeText}`}>Stopped</span>
          <span className={`flex items-center gap-1 px-2 py-1 rounded font-medium ${getActionTheme(ActionType.CONTINUED).badgeBg} ${getActionTheme(ActionType.CONTINUED).badgeText} border border-slate-200`}>Continued</span>
        </div>
      </div>

      <div className="relative">
        {/* Continuous vertical line */}
        <div className="absolute left-4 md:left-24 top-2 bottom-0 w-px bg-slate-200"></div>

        <div className="space-y-8">
          {groupedEvents.map((group, groupIdx) => {
            const dateObj = parseClinicalDate(group.date);
            // Check if this group only has continued events to style the node differently
            const isOnlyContinued = group.items.every(e => e.action === ActionType.CONTINUED);

            return (
              <div key={groupIdx} className="relative flex flex-col md:flex-row group">
                
                {/* Date Column */}
                <div className="ml-10 md:ml-0 md:w-24 flex-shrink-0 md:pt-2 md:pr-4 flex flex-row md:flex-col items-baseline md:items-end gap-x-3 mb-2 md:mb-0">
                  <span className={`text-sm font-bold leading-none ${isOnlyContinued ? 'text-slate-500' : 'text-slate-800'}`}>
                    {dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <span className="text-xs text-slate-400 leading-none">
                    {dateObj.getFullYear()}
                  </span>
                </div>

                {/* Timeline Node */}
                <div className={`
                  absolute left-4 md:left-24 -translate-x-1/2 mt-1 md:mt-3 w-3 h-3 rounded-full border-2 border-white shadow-sm z-10 top-0 md:top-auto
                  ${isOnlyContinued ? 'bg-slate-400' : 'bg-blue-500'}
                `}></div>

                {/* Content Column */}
                <div className="ml-10 md:ml-0 flex-1 md:pl-6 pt-1">
                  
                  <div className="space-y-2">
                    {group.items.map((event, idx) => {
                      const theme = getActionTheme(event.action);
                      const routeStyle = getRouteBadgeStyles(event.route);
                      const isContinued = event.action === ActionType.CONTINUED;

                      return (
                        <button 
                          key={event.id || idx} 
                          onClick={() => event.id && onEventSelect(event.id)}
                          aria-label={`Select event: ${event.medication} ${event.action}`}
                          className={`
                            w-full flex items-center gap-3 p-2 rounded-lg border transition-all text-left
                            ${isContinued 
                              ? 'bg-slate-50/50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:border-slate-300' 
                              : `${theme.bg} ${theme.border} shadow-sm hover:shadow-md hover:scale-[1.01]`
                            }
                            cursor-pointer group/card
                          `}
                        >
                          <div className={`
                            p-1.5 rounded-full flex-shrink-0
                            ${isContinued ? 'bg-slate-100 text-slate-400' : `bg-white/60 ${theme.text}`}
                          `}>
                            {isContinued ? <CheckCircle2 className="w-4 h-4" /> : <theme.Icon className="w-4 h-4" />}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                              <span className={`font-semibold text-sm truncate ${isContinued ? 'text-slate-600' : theme.text}`}>
                                {event.medication}
                              </span>
                              <span className={`
                                text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full border
                                ${isContinued 
                                  ? 'bg-slate-100 text-slate-400 border-slate-200' 
                                  : 'bg-white/50 text-slate-600 border-slate-100/50'
                                }
                              `}>
                                {event.action}
                              </span>
                            </div>
                            <div className={`text-xs truncate flex items-center gap-2 mt-0.5 ${isContinued ? 'text-slate-400' : 'text-slate-500'}`}>
                              <span>{event.dosage}</span>
                              {event.route && (
                                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border ${isContinued ? 'opacity-70 grayscale' : routeStyle.className}`}>
                                  {/* Only show icon if not continued, or simple dot */}
                                  <routeStyle.Icon className="w-3 h-3" />
                                  {event.route}
                                </span>
                              )}
                            </div>
                          </div>

                          {!isContinued && (
                            <ArrowRight className="w-4 h-4 text-slate-400/70 flex-shrink-0 mr-1 group-hover/card:translate-x-0.5 transition-transform" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
        
        {/* End Cap */}
        <div className="absolute left-4 md:left-24 -translate-x-1/2 bottom-0 w-2 h-2 rounded-full bg-slate-300"></div>
      </div>
    </div>
  );
};
