
import React from 'react';
import { Activity, ShieldAlert, FileText, Sparkles, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  patientName: string;
  onAnalyze: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ patientName, onAnalyze }) => {
  return (
    <div className="min-h-full flex flex-col items-center justify-center p-8 bg-slate-50/50">
      <div className="max-w-4xl w-full text-center space-y-12">
        
        {/* Hero Section */}
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center p-4 bg-blue-600 rounded-2xl shadow-xl shadow-blue-200 mb-4">
            <Activity className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Clinical Decision Support <br/>
            <span className="text-blue-600">Reimagined</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            MedGuide transforms unstructured clinical notes into structured medication timelines and performs real-time safety checks against global guidelines.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 text-left animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Smart Extraction</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Instantly identifying medication starts, stops, and changes from free-text progress notes.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
              <Sparkles className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Timeline Generation</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Visualizing the patient's medication journey chronologically to highlight care continuity.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
            <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-rose-100 transition-colors">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Safety Analysis</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Automated checks against Beers Criteria, STOPP/START, and interaction databases.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-8 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <p className="text-slate-500 mb-6 font-medium">
            Currently viewing record for <span className="text-slate-900 font-bold">{patientName}</span>
          </p>
          <button
            onClick={onAnalyze}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-500 hover:scale-[1.02] hover:shadow-xl transition-all"
          >
            Analyze Patient Record
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
};
