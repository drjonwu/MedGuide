
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Timeline } from './components/Timeline';
import { History } from './components/History';
import { SafetyPanel } from './components/SafetyPanel';
import { SourceView } from './components/SourceView';
import { EventModal } from './components/EventModal';
import { LandingPage } from './components/LandingPage';
import { ChatInterface } from './components/ChatInterface';
import { LoadingState, EmptyState, ErrorDisplay } from './components/Feedback';
import { PATIENTS } from './constants';
import { analyzePatientRecord } from './services/geminiService';
import { ExtractionResult, SafetyResult, ViewState, MedicationEvent, AppError, ErrorCategory } from './types';
import { Activity, Menu, FileText, ShieldAlert, History as HistoryIcon, MessageSquare } from 'lucide-react';
import { useDevice } from './hooks/useMobile';

// Cache structure definition
type AnalysisCache = {
  [patientId: string]: {
    extraction: ExtractionResult;
    safety: SafetyResult;
  }
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(PATIENTS[0].id);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Hardware Sensing State
  const { isMobile } = useDevice();
  
  // Data State
  const [extractedData, setExtractedData] = useState<ExtractionResult | null>(null);
  const [safetyData, setSafetyData] = useState<SafetyResult | null>(null);
  
  // Cache State
  const [dataCache, setDataCache] = useState<AnalysisCache>({});
  
  // Modal State
  const [selectedEvent, setSelectedEvent] = useState<MedicationEvent | null>(null);

  const currentPatient = PATIENTS.find(p => p.id === selectedPatientId) || PATIENTS[0];

  // Auto-close mobile menu if switching to desktop
  useEffect(() => {
    if (!isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobile]);

  const handlePatientChange = (id: string) => {
    setSelectedPatientId(id);
    setError(null);
    setSelectedEvent(null);
    
    // Check Cache
    if (dataCache[id]) {
      setExtractedData(dataCache[id].extraction);
      setSafetyData(dataCache[id].safety);
      // If we have data, jump straight to timeline for better UX
      setCurrentView('timeline');
      // If cached data exists and we are on mobile, close menu to show content
      if (isMobile) setIsMobileMenuOpen(false); 
    } else {
      setExtractedData(null);
      setSafetyData(null);
      setCurrentView('landing');
      // Keep menu open on mobile so they can hit "Analyze"
    }
  };

  const handleEventClick = (eventId: string) => {
    const event = extractedData?.events.find(e => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
    }
  };

  const handleProcess = async () => {
    setIsLoading(true);
    setError(null);
    
    // Close menu on mobile as soon as processing starts so user sees the loading state
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }

    try {
      // Single-Shot Analysis
      const result = await analyzePatientRecord(currentPatient);

      // Update State
      setExtractedData(result.extraction);
      setSafetyData(result.safety);
      
      // Update Cache
      setDataCache(prev => ({
        ...prev,
        [currentPatient.id]: {
          extraction: result.extraction,
          safety: result.safety
        }
      }));

      // Switch view to timeline
      setCurrentView('timeline');
    } catch (err: any) {
      if (err instanceof AppError) {
        setError(err);
      } else {
        setError(new AppError(ErrorCategory.UNKNOWN, err.message || "An unexpected error occurred."));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (isLoading) return <LoadingState />;
    if (error) return <ErrorDisplay error={error} onRetry={handleProcess} />;

    switch (currentView) {
      case 'landing':
        return <LandingPage patientName={currentPatient.name} onAnalyze={handleProcess} />;
      case 'timeline':
        return extractedData ? (
          <Timeline 
            events={extractedData.events} 
            onEventSelect={handleEventClick}
          />
        ) : <EmptyState patientName={currentPatient.name} />;
      case 'history':
        return extractedData ? (
          <History 
            events={extractedData.events} 
            onEventSelect={handleEventClick}
          />
        ) : <EmptyState patientName={currentPatient.name} />;
      case 'safety':
        return safetyData ? <SafetyPanel result={safetyData} /> : <EmptyState patientName={currentPatient.name} />;
      case 'source':
        return <SourceView text={currentPatient.notes} />;
      case 'chat':
        return <ChatInterface patient={currentPatient} />;
      default:
        return <LandingPage patientName={currentPatient.name} onAnalyze={handleProcess} />;
    }
  };

  const tabs = [
    { id: 'source', label: 'Source Evidence', icon: FileText },
    { id: 'timeline', label: 'Medication Timeline', icon: Activity },
    { id: 'history', label: 'Medication History', icon: HistoryIcon },
    { id: 'safety', label: 'Safety Analysis', icon: ShieldAlert },
    { id: 'chat', label: 'Ask Copilot', icon: MessageSquare }
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar 
        currentView={currentView}
        setView={setCurrentView}
        isLoading={isLoading}
        onProcess={handleProcess}
        hasData={!!extractedData}
        selectedPatientId={selectedPatientId}
        onSelectPatient={handlePatientChange}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isMobile={isMobile}
      />
      
      {/* Right Column Wrapper */}
      <div className="flex-1 lg:ml-80 flex flex-col h-screen relative w-full">
        
        {/* Mobile Header */}
        <div className="lg:hidden h-16 bg-slate-900 text-white z-40 flex items-center justify-between px-4 shadow-md flex-shrink-0">
          <div className="flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
              className="p-2 -ml-2 mr-2 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              <span className="font-bold text-lg">MedGuide</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-xs font-bold text-slate-100">{currentPatient.name}</div>
            <div className="flex flex-col items-end gap-0.5 mt-0.5">
              <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1">
                <span>{currentPatient.id}</span>
                <span className="text-slate-600">•</span>
                <span>{currentPatient.insuranceNumber}</span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                {currentPatient.age}y • {currentPatient.gender}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Header - The "Blue Layer" */}
        <header className="hidden lg:flex h-16 bg-slate-900 text-white items-center justify-between px-6 shadow-md flex-shrink-0 z-40 border-b border-slate-800">
           <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              <span className="font-bold text-lg tracking-tight text-white">MedGuide</span>
           </div>

           {/* Patient Details Redundancy Block */}
           <div className="text-right">
               <div className="text-sm font-bold text-white">{currentPatient.name}</div>
               <div className="flex items-center justify-end gap-1.5 text-[10px] text-slate-400 font-mono uppercase tracking-wider mt-0.5">
                 <span>ID: {currentPatient.id}</span>
                 <span className="text-slate-600">•</span>
                 <span>INS: {currentPatient.insuranceNumber}</span>
               </div>
               <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">
                 {currentPatient.age} years old • {currentPatient.gender}
               </div>
           </div>
        </header>

        {/* Main Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto relative w-full bg-slate-50 scroll-smooth">
          {/* Navigation Tabs - Only show when data exists */}
          {extractedData && !isLoading && !error && (
            <div className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200 shadow-sm">
              <div className="w-full px-4 md:px-6 py-2">
                <nav className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full" aria-label="Tabs">
                  {tabs.map((tab) => {
                    const isActive = currentView === tab.id;
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setCurrentView(tab.id as ViewState)}
                        className={`
                          flex items-center gap-2 px-4 py-3 rounded-lg font-bold transition-all whitespace-nowrap flex-shrink-0 text-sm
                          ${isActive 
                            ? 'bg-slate-900 text-white shadow-md' 
                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                          }
                        `}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          )}

          {renderContent()}
        </main>
      </div>

      {/* Detail Modal */}
      <EventModal 
        event={selectedEvent} 
        onClose={() => setSelectedEvent(null)} 
        patientNotes={currentPatient.notes}
      />
    </div>
  );
};

export default App;
