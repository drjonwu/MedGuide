

import React, { useMemo } from 'react';
import { X, Calendar, Quote, Hash, Activity, FileText } from 'lucide-react';
import { MedicationEvent } from '../types';
import { getActionTheme, getRouteBadgeStyles, findQuoteInText } from '../utils';

interface EventModalProps {
  event: MedicationEvent | null;
  onClose: () => void;
  patientNotes?: string;
}

export const EventModal: React.FC<EventModalProps> = ({ event, onClose, patientNotes }) => {
  // Extract context snippet from full notes
  const contextSnippet = useMemo(() => {
    if (!event?.source_quote || !patientNotes) return null;
    
    // Find the quote in the notes using fuzzy matching
    const matchResult = findQuoteInText(patientNotes, event.source_quote);
    
    if (!matchResult) return null;

    const { start, end, match } = matchResult;
    const PADDING = 300; // Characters to show before/after
    const contextStart = Math.max(0, start - PADDING);
    const contextEnd = Math.min(patientNotes.length, end + PADDING);

    return {
      before: (contextStart > 0 ? '...' : '') + patientNotes.substring(contextStart, start),
      match: match,
      after: patientNotes.substring(end, contextEnd) + (contextEnd < patientNotes.length ? '...' : '')
    };
  }, [event, patientNotes]);

  if (!event) return null;

  const theme = getActionTheme(event.action);
  const routeStyle = getRouteBadgeStyles(event.route);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className={`px-6 py-4 border-b border-slate-100 flex justify-between items-start bg-slate-50/50 flex-shrink-0`}>
          <div>
             <h3 className="text-xl font-bold text-slate-900 leading-snug pr-4">{event.medication}</h3>
             <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider border ${theme.badgeBg} ${theme.badgeText} ${theme.border}`}>
                  <theme.Icon className="w-3 h-3" />
                  {event.action}
                </span>
                {event.route && (
                  <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold border ${routeStyle.className}`}>
                    <routeStyle.Icon className="w-3 h-3" />
                    {event.route}
                  </span>
                )}
             </div>
          </div>
          <button 
            onClick={onClose}
            aria-label="Close details"
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto">
          <div className="space-y-6">
            
            {/* Date & Dosage Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5" /> Date
                </div>
                <div className="font-semibold text-slate-800 text-sm">
                  {new Date(event.date).toLocaleDateString('en-US', { dateStyle: 'long' })}
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                  <Hash className="w-3.5 h-3.5" /> Dosage
                </div>
                <div className="font-semibold text-slate-800 text-sm">
                  {event.dosage}
                </div>
              </div>
            </div>

            {/* Rationale */}
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-2">
                <Activity className="w-4 h-4 text-blue-500" />
                Clinical Rationale
              </div>
              <p className="text-slate-600 text-sm leading-relaxed bg-blue-50/50 p-3 rounded-lg border border-blue-100/50">
                {event.rationale}
              </p>
            </div>

            {/* Source Quote */}
            {event.source_quote && (
              <div className="relative group">
                <div className="absolute top-0 left-0 bottom-0 w-1 bg-slate-200 rounded-full group-hover:bg-blue-400 transition-colors"></div>
                <div className="pl-4 py-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1">
                    <Quote className="w-3 h-3" /> Source Evidence
                  </div>
                  <p className="text-slate-500 text-sm italic font-serif leading-relaxed">
                    "{event.source_quote}"
                  </p>
                </div>
              </div>
            )}

            {/* Expanded Context from Notes */}
            {contextSnippet && (
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-2">
                  <FileText className="w-4 h-4 text-slate-500" />
                  Context from Clinical Notes
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs md:text-sm font-mono text-slate-600 leading-relaxed whitespace-pre-wrap">
                  <span className="opacity-60">{contextSnippet.before}</span>
                  <span className="bg-yellow-100 text-slate-900 font-semibold px-1 rounded mx-0.5 border border-yellow-200 shadow-sm">
                    {contextSnippet.match}
                  </span>
                  <span className="opacity-60">{contextSnippet.after}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};