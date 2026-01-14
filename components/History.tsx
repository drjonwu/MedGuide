import React, { useMemo } from 'react';
import { MedicationEvent, ActionType } from '../types';
import { Quote, Pill, CalendarDays } from 'lucide-react';
import { getActionTheme, getRouteBadgeStyles, parseClinicalDate } from '../utils';

interface HistoryProps {
  events: MedicationEvent[];
  onEventSelect: (id: string) => void;
}

export const History: React.FC<HistoryProps> = ({ events, onEventSelect }) => {
  // Group events by Medication Name to create a "Medication Journey" view
  const medicationGroups = useMemo(() => {
    const groups: { [key: string]: MedicationEvent[] } = {};
    
    events.forEach(event => {
      // Normalize medication name for grouping (trim, title case handled in extraction)
      const key = event.medication;
      if (!groups[key]) groups[key] = [];
      groups[key].push(event);
    });

    // Convert to array and sort
    return Object.keys(groups).map(medName => {
      // Sort events within a medication by date
      const sortedEvents = groups[medName].sort((a, b) => parseClinicalDate(a.date).getTime() - parseClinicalDate(b.date).getTime());
      
      // Determine the earliest date for the medication to sort the groups themselves
      const earliestDate = sortedEvents.length > 0 ? sortedEvents[0].date : '';
      
      return {
        medication: medName,
        events: sortedEvents,
        earliestDate
      };
    }).sort((a, b) => parseClinicalDate(a.earliestDate).getTime() - parseClinicalDate(b.earliestDate).getTime());

  }, [events]);

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 md:py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
          <Pill className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Medication History</h2>
          <p className="text-slate-500 text-sm">Chronological journey by medication</p>
        </div>
      </div>
      
      <div className="space-y-6">
        {medicationGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            
            {/* Medication Header */}
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="font-bold text-slate-800 text-lg">{group.medication}</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                  {group.events.length} Events
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <CalendarDays className="w-3.5 h-3.5" />
                <span>First observed: {parseClinicalDate(group.earliestDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>

            {/* Event List */}
            <div className="divide-y divide-slate-100">
              {group.events.map((event, idx) => {
                const isContinued = event.action === ActionType.CONTINUED;
                const theme = getActionTheme(event.action);
                const routeStyle = getRouteBadgeStyles(event.route);
                
                return (
                  <button 
                    key={event.id || idx}
                    onClick={() => event.id && onEventSelect(event.id)}
                    className={`
                      w-full text-left group relative p-4 hover:bg-slate-50 transition-colors
                      ${isContinued ? 'pl-8 opacity-90' : ''}
                    `}
                    aria-label={`View details for ${event.medication} event on ${event.date}`}
                  >
                    {/* Visual Thread for Nested Items */}
                    {isContinued && (
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-slate-100 border-r border-slate-200 group-hover:bg-blue-100/50 transition-colors"></div>
                    )}

                    <div className="flex flex-col md:flex-row md:items-start gap-3">
                      {/* Action Badge */}
                      <div className="md:w-32 flex-shrink-0 flex md:flex-col items-center md:items-start gap-2">
                        <span className="text-xs font-semibold text-slate-500 font-mono">
                          {parseClinicalDate(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${theme.badgeBg} ${theme.badgeText} ${theme.border}`}>
                          {isContinued ? (
                            <>
                              <div className={`w-1.5 h-1.5 rounded-full ${theme.text} bg-current`}></div>
                              Cont.
                            </>
                          ) : (
                            <>
                              <theme.Icon className="w-3 h-3" />
                              {event.action}
                            </>
                          )}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-2 mb-1">
                           <span className={`font-medium ${isContinued ? 'text-slate-600' : 'text-slate-900'}`}>
                             {event.dosage}
                           </span>
                           {event.route && (
                              <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border ${routeStyle.className}`}>
                                <routeStyle.Icon className="w-3 h-3" />
                                {event.route}
                              </span>
                            )}
                         </div>

                         {/* Rationale - Only show full rationale for major events or if specifically noted */}
                         {(!isContinued || event.rationale !== 'Routine continuation') && (
                           <p className="text-sm text-slate-600 leading-relaxed mb-2">
                             {event.rationale}
                           </p>
                         )}

                         {/* Quote */}
                         {event.source_quote && !isContinued && (
                            <div className="flex gap-2 items-start mt-2">
                              <Quote className="w-3 h-3 text-slate-300 mt-0.5 flex-shrink-0" />
                              <p className="text-xs text-slate-400 italic truncate">
                                "{event.source_quote}"
                              </p>
                            </div>
                         )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};