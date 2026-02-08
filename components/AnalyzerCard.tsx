
import React, { useState } from 'react';
import { verifyResource } from '../services/coreEngine';
import { AnalysisState } from '../types';

const AnalyzerCard: React.FC = () => {
  const [url, setUrl] = useState('siddarthacollegetimetable.bolt.host');
  const [state, setState] = useState<AnalysisState>({
    isLoading: false,
    error: null,
    result: null,
  });

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setState({ isLoading: true, error: null, result: null });
    try {
      const result = await verifyResource(url);
      setState({ isLoading: false, error: null, result });
    } catch (err: any) {
      setState({ isLoading: false, error: err.message || "An unexpected error occurred", result: null });
    }
  };

  const formattedSummary = (text: string) => {
    return text.split('\n').map((line, i) => (
      <p key={i} className="mb-3 text-slate-600 leading-relaxed font-medium">{line}</p>
    ));
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 px-4 mb-20">
      <div className="glass border border-emerald-100 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="p-10 border-b border-emerald-50 bg-emerald-50/30">
          <h2 className="text-2xl font-black text-emerald-900 mb-1 tracking-tight">Institutional Validator</h2>
          <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-8">Scan Institutional Assets</p>
          
          <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter institutional URL..."
              className="flex-grow px-6 py-4 bg-white border border-emerald-100 rounded-2xl text-emerald-900 font-bold placeholder-emerald-200 focus:outline-emerald-500 shadow-inner"
            />
            <button
              type="submit"
              disabled={state.isLoading}
              className={`px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white transition-all ${
                state.isLoading ? 'bg-slate-300' : 'bg-emerald-600 shadow-lg shadow-emerald-200 active:scale-95'
              }`}
            >
              {state.isLoading ? 'Scanning...' : 'Verify Asset'}
            </button>
          </form>
        </div>

        <div className="p-10 min-h-[200px]">
          {state.isLoading && (
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
               <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
               <p className="text-[10px] font-black text-emerald-600 uppercase">Core Validation in Progress...</p>
            </div>
          )}

          {!state.isLoading && state.result && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-2 mb-6">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[8px] font-black uppercase rounded-full">Trust Signature Verified</span>
              </div>
              <div className="prose prose-emerald">
                {formattedSummary(state.result.summary)}
              </div>
            </div>
          )}

          {!state.isLoading && !state.result && (
            <div className="flex flex-col items-center justify-center text-center space-y-4 py-12 opacity-20">
               <i className="fa-solid fa-shield-halved text-5xl text-emerald-900"></i>
               <p className="text-[10px] font-black text-emerald-900 uppercase">Input URL to verify authenticity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyzerCard;
