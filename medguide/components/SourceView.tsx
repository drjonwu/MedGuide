import React from 'react';

interface SourceViewProps {
  text: string;
}

export const SourceView: React.FC<SourceViewProps> = ({ text }) => {
  return (
    <div className="max-w-4xl mx-auto py-6 px-4 md:py-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-4 md:mb-6">Source Evidence</h2>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6 overflow-hidden">
        <pre className="whitespace-pre-wrap font-mono text-xs md:text-sm text-slate-600 leading-relaxed">
          {text}
        </pre>
      </div>
    </div>
  );
};