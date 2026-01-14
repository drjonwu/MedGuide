
import React, { useMemo } from 'react';
import { SafetyResult } from '../types';
import { CheckCircle, BookOpen, ExternalLink, ArrowRight } from 'lucide-react';
import { getSeverityTheme } from '../utils';

interface SafetyPanelProps {
  result: SafetyResult | null;
}

const SeverityBadge: React.FC<{ severity: string }> = ({ severity }) => {
  const theme = getSeverityTheme(severity);
  return (
    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border flex-shrink-0 ${theme.bg} ${theme.text} ${theme.border}`}>
      <theme.Icon className="w-3 h-3" />
      {severity} RISK
    </span>
  );
};

export const SafetyPanel: React.FC<SafetyPanelProps> = ({ result }) => {
  if (!result) return null;

  const sortedAlerts = useMemo(() => {
    return [...result.alerts].sort((a, b) => {
      const severityOrder: { [key: string]: number } = { 'HIGH': 0, 'MEDIUM': 1, 'LOW': 2 };
      const orderA = severityOrder[a.severity.toUpperCase()] ?? 3;
      const orderB = severityOrder[b.severity.toUpperCase()] ?? 3;
      return orderA - orderB;
    });
  }, [result.alerts]);

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 md:py-8">
      <div className="mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
          <ShieldIcon />
          Safety & Guidelines Check
        </h2>
        <p className="text-sm md:text-base text-slate-500">
          Automated analysis against standard clinical guidelines (Beers, STOPP/START).
        </p>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 md:p-6 rounded-xl border border-indigo-100 shadow-sm mb-6 md:mb-8">
        <h3 className="text-indigo-900 font-semibold mb-2 flex items-center gap-2">
          <ActivityIcon />
          Regimen Summary
        </h3>
        <p className="text-indigo-800 leading-relaxed text-sm">
          {result.summary}
        </p>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {sortedAlerts.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-dashed border-slate-300">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-slate-900">No Major Issues Detected</h3>
            <p className="text-slate-500">The analyzed timeline appears consistent with standard guidelines.</p>
          </div>
        ) : (
          sortedAlerts.map((alert, idx) => {
            const isHigh = alert.severity.toUpperCase() === 'HIGH';

            // Robust URL validation helper
            const isValidUrl = (url?: string) => {
              if (!url) return false;
              try {
                const parsed = new URL(url);
                return parsed.protocol === 'http:' || parsed.protocol === 'https:';
              } catch {
                return false;
              }
            };

            // Determine safe URL: Use provided URL if valid, otherwise fallback to Google Search
            const safeUrl = isValidUrl(alert.citationUrl)
              ? alert.citationUrl
              : `https://www.google.com/search?q=${encodeURIComponent(alert.citation || '')}`;

            return (
              <div 
                key={idx} 
                className={`
                  rounded-xl overflow-hidden transition-all duration-200 border
                  ${isHigh 
                    ? 'bg-rose-50/50 border-rose-200 shadow-md shadow-rose-100/50' 
                    : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
                  }
                `}
              >
                <div className="p-4 md:p-5">
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-3 gap-2">
                    <h3 className={`text-lg font-bold leading-tight ${isHigh ? 'text-rose-900' : 'text-slate-800'}`}>
                      {alert.title}
                    </h3>
                    <SeverityBadge severity={alert.severity} />
                  </div>
                  
                  <p className={`${isHigh ? 'text-rose-800' : 'text-slate-600'} mb-4 text-sm leading-relaxed`}>
                    {alert.description}
                  </p>

                  <div className={`flex flex-col md:flex-row gap-4 pt-4 border-t ${isHigh ? 'border-rose-100' : 'border-slate-100'}`}>
                    <div className="flex-1">
                      <span className={`text-xs font-bold uppercase tracking-wider mb-1 block ${isHigh ? 'text-rose-700' : 'text-emerald-600'}`}>
                        Recommendation
                      </span>
                      <p className={`text-sm font-medium ${isHigh ? 'text-rose-900' : 'text-slate-800'}`}>
                        {alert.recommendation}
                      </p>
                    </div>
                    
                    {alert.citation && (
                      <a 
                        href={safeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`md:w-64 flex-shrink-0 p-3 rounded-lg border flex flex-col justify-center transition-all group/link hover:shadow-md cursor-pointer ${
                          isHigh 
                            ? 'bg-white/60 border-rose-100 hover:bg-rose-50' 
                            : 'bg-slate-50 border-slate-100 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                          <BookOpen className="w-3 h-3" />
                          Guideline Reference
                        </div>
                        <div className="text-xs text-blue-600 group-hover/link:text-blue-800 group-hover/link:underline italic leading-relaxed flex items-start gap-1">
                          <span>{alert.citation}</span>
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity mt-0.5 flex-shrink-0" />
                        </div>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const ShieldIcon = () => (
  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const ActivityIcon = () => (
  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);
