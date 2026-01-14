
import React from 'react';
import { Settings, User, FileText, Activity, ShieldAlert, History, Users, X, MessageSquare, Download, Share2 } from 'lucide-react';
import { ViewState } from '../types';
import { PATIENTS } from '../constants';
import { generateFHIRBundle } from '../utils';
import { ExtractionResult, SafetyResult } from '../types';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  isLoading: boolean;
  onProcess: () => void;
  hasData: boolean;
  selectedPatientId: string;
  onSelectPatient: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
  // We need to access data to export it
  extractedData?: ExtractionResult | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  setView, 
  isLoading, 
  onProcess,
  hasData,
  selectedPatientId,
  onSelectPatient,
  isOpen,
  onClose,
  isMobile,
  extractedData
}) => {
  const currentPatient = PATIENTS.find(p => p.id === selectedPatientId) || PATIENTS[0];

  const handleExportFHIR = () => {
    if (!extractedData) return;
    const bundle = generateFHIRBundle(currentPatient, extractedData.events);
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fhir_bundle_${currentPatient.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-slate-900 text-white flex flex-col h-screen border-r border-slate-700 shadow-2xl 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight leading-none">MedGuide</h1>
              <p className="text-[10px] text-slate-400">Clinical Copilot</p>
            </div>
          </div>
          {/* Close Button for Mobile */}
          <button 
            onClick={onClose}
            aria-label="Close sidebar"
            className="p-2 -mr-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          {/* Configuration */}
          <div className="mb-8">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Settings className="w-3 h-3" /> Configuration
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Select Patient Record
                </label>
                <div className="relative">
                  <select
                    value={selectedPatientId}
                    onChange={(e) => onSelectPatient(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer disabled:opacity-50 transition-shadow"
                  >
                    {PATIENTS.map(patient => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name} ({patient.gender.charAt(0)}/{patient.age})
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium">Patient Context</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  <span className="text-slate-200 font-semibold">{currentPatient.name}</span><br/>
                  <span className="font-mono text-[10px] text-slate-500 mb-1 block">ID: {currentPatient.id} • INS: {currentPatient.insuranceNumber}</span>
                  {currentPatient.age} years old • {currentPatient.gender}<br/>
                  <span className="block mt-2 pt-2 border-t border-slate-700/50">
                    <span className="text-slate-500 block mb-0.5">Known Conditions:</span> 
                    <span className="text-slate-300">{currentPatient.conditions.join(", ")}</span>
                  </span>
                </p>
              </div>

              <button
                onClick={() => {
                  onProcess();
                }}
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  isLoading
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 hover:shadow-blue-900/30'
                }`}
              >
                {isLoading ? (
                  <>Processing...</>
                ) : (
                  <>Analyze Record <Activity className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </div>

          {/* Navigation */}
          {hasData && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Analysis Views
              </h3>
              <nav className="space-y-2">
                <button
                  onClick={() => { setView('source'); if (isMobile) onClose(); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                    currentView === 'source' 
                      ? 'bg-slate-800 text-blue-400 shadow-sm border border-slate-700' 
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Source Evidence
                </button>
                <button
                  onClick={() => { setView('timeline'); if (isMobile) onClose(); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                    currentView === 'timeline' 
                      ? 'bg-slate-800 text-blue-400 shadow-sm border border-slate-700' 
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  Medication Timeline
                </button>
                 <button
                  onClick={() => { setView('history'); if (isMobile) onClose(); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                    currentView === 'history' 
                      ? 'bg-slate-800 text-blue-400 shadow-sm border border-slate-700' 
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <History className="w-4 h-4" />
                  Medication History
                </button>
                <button
                  onClick={() => { setView('safety'); if (isMobile) onClose(); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                    currentView === 'safety' 
                      ? 'bg-slate-800 text-blue-400 shadow-sm border border-slate-700' 
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  Safety Analysis
                </button>
                
                <div className="my-2 border-t border-slate-800/50"></div>

                <button
                  onClick={() => { setView('chat'); if (isMobile) onClose(); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                    currentView === 'chat' 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30' 
                      : 'text-indigo-300 hover:bg-indigo-900/30 hover:text-indigo-200 border border-transparent'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  Ask Copilot
                </button>
              </nav>

              <div className="mt-6 pt-6 border-t border-slate-800/50">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Interoperability
                </h3>
                <button
                  onClick={handleExportFHIR}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-slate-800 hover:border-slate-600"
                >
                  <Share2 className="w-4 h-4" />
                  Export FHIR JSON
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-800">
           <div className="mt-1 text-center text-[10px] text-slate-600 font-mono">
             MEDGUIDE v2.0 • GEMINI 3 FLASH
           </div>
        </div>
      </div>
    </>
  );
};
