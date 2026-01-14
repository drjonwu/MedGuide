
import React from 'react';
import { 
  AlertCircle, 
  Loader2, 
  Activity, 
  Lock, 
  ShieldAlert, 
  ServerCrash, 
  FileWarning, 
  Clock,
  LucideIcon
} from 'lucide-react';
import { AppError, ErrorCategory } from '../types';

export const LoadingState: React.FC = () => (
  <div className="h-full flex flex-col items-center justify-center text-slate-400 min-h-[50vh] px-4">
    <div className="relative">
      <Loader2 className="w-16 h-16 animate-spin text-blue-500 mb-6" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Activity className="w-6 h-6 text-blue-500/50" />
      </div>
    </div>
    <h3 className="text-xl font-medium text-slate-700 mb-2 text-center">Comprehensive Analysis in Progress</h3>
    <p className="text-sm text-slate-500 max-w-sm text-center">
      MedGuide is analyzing clinical notes in parallel: extracting medication timelines while simultaneously performing safety checks against clinical guidelines.
    </p>
  </div>
);

export const EmptyState: React.FC<{ patientName: string }> = ({ patientName }) => (
  <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center min-h-[80vh]">
    <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
      <Activity className="w-8 h-8 text-slate-400" />
    </div>
    <h3 className="text-lg font-medium text-slate-700">Ready to Analyze</h3>
    <p className="text-sm max-w-md mt-2">
      Click "Analyze Record" in the sidebar to extract the medication timeline for {patientName}.
    </p>
  </div>
);

interface ErrorDisplayProps {
  error: AppError;
  onRetry: () => void;
}

interface ErrorConfig {
  icon: LucideIcon;
  title: string;
  color: string;
  bg: string;
  border: string;
}

const ERROR_CONFIGS: Record<ErrorCategory, ErrorConfig> = {
  [ErrorCategory.AUTH]: { 
    icon: Lock, title: "Authentication Error", color: "text-red-500", bg: "bg-red-50", border: "border-red-200" 
  },
  [ErrorCategory.RATE_LIMIT]: { 
    icon: Clock, title: "Service Busy", color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-200" 
  },
  [ErrorCategory.SAFETY]: { 
    icon: ShieldAlert, title: "Content Flagged", color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-200" 
  },
  [ErrorCategory.SERVER]: { 
    icon: ServerCrash, title: "Service Unavailable", color: "text-slate-500", bg: "bg-slate-100", border: "border-slate-300" 
  },
  [ErrorCategory.PARSING]: { 
    icon: FileWarning, title: "Data Parsing Error", color: "text-purple-500", bg: "bg-purple-50", border: "border-purple-200" 
  },
  [ErrorCategory.VALIDATION]: { 
    icon: AlertCircle, title: "Validation Error", color: "text-pink-500", bg: "bg-pink-50", border: "border-pink-200" 
  },
  [ErrorCategory.UNKNOWN]: { 
    icon: AlertCircle, title: "Processing Error", color: "text-red-500", bg: "bg-red-50", border: "border-red-200" 
  }
};

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry }) => {
  const ui = ERROR_CONFIGS[error.category] || ERROR_CONFIGS[ErrorCategory.UNKNOWN];
  
  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto mt-6 md:mt-10">
      <div className={`${ui.bg} border ${ui.border} rounded-xl p-6 flex items-start gap-4 shadow-sm`}>
        <ui.icon className={`w-6 h-6 ${ui.color} flex-shrink-0`} />
        <div>
          <h3 className={`${ui.color} font-bold mb-1 text-lg`}>{ui.title}</h3>
          <p className="text-slate-700 text-sm mb-3">{error.message}</p>
          
          {error.category === ErrorCategory.RATE_LIMIT && (
            <button 
              onClick={onRetry}
              className="px-4 py-2 bg-white border border-amber-300 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-50 transition-colors"
            >
              Retry Analysis
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
