
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import TimetableBoard from './components/TimetableBoard';
import LoginForm from './components/Admin/LoginForm';
import AdminDashboard from './components/Admin/AdminDashboard';
import AnalyzerCard from './components/AnalyzerCard';
import { getSession, setSession, getState, saveState } from './services/dataStore';
import { fetchFromCloud, syncToCloud } from './services/googleSheetsService';

const App: React.FC = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [appState, setAppState] = useState(getState());
  const [isInitialSync, setIsInitialSync] = useState(true);
  const [syncStatus, setSyncStatus] = useState('Synchronizing Core Database...');

  // Initial Data Pull or Push to Cloud
  useEffect(() => {
    const initApp = async () => {
      const session = getSession();
      if (session) {
        setIsLoggedIn(true);
      }

      const currentState = getState();
      if (currentState.settings.cloudDbEnabled && currentState.settings.googleSheetWebAppUrl) {
        try {
          const cloudData = await fetchFromCloud(currentState.settings.googleSheetWebAppUrl);
          
          if (cloudData) {
            // Cloud has data, use it
            saveState(cloudData);
            setAppState(cloudData);
          } else {
            // Cloud is empty, seed it with local state
            setSyncStatus('Initializing Cloud Storage (First Time Setup)...');
            await syncToCloud(currentState.settings.googleSheetWebAppUrl, currentState);
          }
        } catch (err) {
          console.warn("Initial cloud sync failed, using local storage", err);
        }
      }
      setIsInitialSync(false);
    };

    initApp();
  }, []);

  const toggleAdminMode = () => {
    setIsAdminMode(!isAdminMode);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setSession(null);
    setIsLoggedIn(false);
    setIsAdminMode(false);
  };

  if (isInitialSync) {
    return (
      <div className="min-h-screen bg-emerald-950 flex flex-col items-center justify-center text-white p-6">
        <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-6"></div>
        <div className="text-center">
          <h2 className="text-xl font-black uppercase tracking-widest mb-2">KVSR SCOPS</h2>
          <p className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest animate-pulse max-w-xs mx-auto">
            {syncStatus}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Layout isAdminMode={isAdminMode} onAdminToggle={toggleAdminMode} isLoggedIn={isLoggedIn} onLogout={handleLogout}>
      {isAdminMode ? (
        isLoggedIn ? (
          <AdminDashboard onLogout={handleLogout} />
        ) : (
          <LoginForm onLogin={handleLoginSuccess} />
        )
      ) : (
        <>
          {/* Hero / Banner */}
          <section className="pt-12 pb-6">
            <div className="max-w-7xl mx-auto px-4">
              <div className="bg-gradient-to-br from-emerald-800 to-teal-900 rounded-[3rem] p-8 md:p-14 text-white shadow-2xl shadow-emerald-900/40 relative overflow-hidden group">
                
                <div className="absolute top-0 right-0 w-full md:w-[60%] h-full opacity-40 md:opacity-60 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2000&auto=format&fit=crop" 
                    alt="KVSR Siddhartha College Building" 
                    className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 via-emerald-900/60 to-transparent"></div>
                </div>

                <div className="relative z-10 max-w-2xl text-left animate-in fade-in slide-in-from-left-8 duration-700">
                  <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-black tracking-widest uppercase mb-8 backdrop-blur-md border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    Digital Academic Hub
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black mb-6 leading-[1.1] tracking-tight">
                    Smart Pharmacy <br/>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-200 to-teal-100">
                      Academic Gateway
                    </span>
                  </h1>
                  <p className="text-emerald-100/80 text-sm md:text-lg mb-10 font-medium leading-relaxed max-w-lg">
                    KVSR Siddhartha institutional portal. Automated timetable management and seamless faculty coordination for B.Pharm, Pharm.D, and M.Pharm.
                  </p>
                  
                  <div className="flex flex-wrap gap-5">
                    <button className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-black shadow-xl shadow-emerald-900/20 transition-all hover:-translate-y-1 active:scale-95 text-[10px] uppercase tracking-widest">
                      Live Schedule
                    </button>
                    <button 
                      onClick={toggleAdminMode}
                      className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black border border-white/20 backdrop-blur-md transition-all text-[10px] uppercase tracking-widest"
                    >
                      Admin Access
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="animate-in fade-in duration-1000 delay-300">
            <TimetableBoard />
          </section>

          <section className="animate-in fade-in duration-1000 delay-500">
            <AnalyzerCard />
          </section>

          <section className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
            {[
              { icon: 'fa-vial-circle-check', label: 'B.Pharm Intake', value: '100+', color: 'text-blue-600', bg: 'bg-blue-50' },
              { icon: 'fa-user-doctor', label: 'Pharm.D Scholars', value: '30+', color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { icon: 'fa-award', label: 'NAAC Rating', value: 'A Grade', color: 'text-purple-600', bg: 'bg-purple-50' },
              { icon: 'fa-hand-holding-medical', label: 'Hospital Ties', value: '5+', color: 'text-amber-600', bg: 'bg-amber-50' },
            ].map((stat, i) => (
              <div key={i} className={`glass p-8 rounded-[2rem] text-center border-white shadow-xl shadow-emerald-900/5 transition-all hover:scale-105`}>
                <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-5 text-xl shadow-inner`}>
                   <i className={`fa-solid ${stat.icon}`}></i>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-2xl font-black text-emerald-900">{stat.value}</p>
              </div>
            ))}
          </section>
        </>
      )}
    </Layout>
  );
};

export default App;
