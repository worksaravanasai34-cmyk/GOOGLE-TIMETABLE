
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  isAdminMode?: boolean;
  onAdminToggle?: () => void;
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, isAdminMode, onAdminToggle, isLoggedIn, onLogout }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 glass border-b border-emerald-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4 cursor-pointer" onClick={() => !isAdminMode ? window.location.reload() : onAdminToggle?.()}>
            <div className="relative">
              <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 overflow-hidden">
                <i className="fa-solid fa-prescription-bottle-medical text-white text-2xl"></i>
              </div>
              <div className="absolute inset-0 rounded-xl border-2 border-dashed border-red-500 opacity-50"></div>
            </div>
            <div>
              <span className="text-xl font-black text-emerald-900 block leading-none tracking-tight">
                KVSR SCOPS
              </span>
              <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-[0.15em] whitespace-nowrap">
                Pharmacy Timetable
              </span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-10 text-xs font-bold text-emerald-800/80 uppercase tracking-widest">
            <button 
              onClick={() => isAdminMode && onAdminToggle && onAdminToggle()}
              className={`flex items-center gap-2 transition-colors ${!isAdminMode ? 'text-emerald-600 border-b-2 border-emerald-600 pb-1' : 'hover:text-emerald-600'}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => !isAdminMode && onAdminToggle && onAdminToggle()}
              className={`flex items-center gap-2 transition-colors ${isAdminMode ? 'text-emerald-600 border-b-2 border-emerald-600 pb-1' : 'hover:text-emerald-600'}`}
            >
              Admin Portal
            </button>
          </nav>

          <div className="flex items-center gap-5">
            {isLoggedIn ? (
              <button 
                onClick={onLogout}
                className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600 border border-red-100 hover:bg-red-100 transition-all shadow-sm"
                title="Logout"
              >
                <i className="fa-solid fa-power-off"></i>
              </button>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 border border-emerald-200 shadow-sm">
                <i className="fa-solid fa-user-shield"></i>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="glass border-t border-emerald-100 py-12 mt-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <div className="flex flex-col items-center mb-6">
             <div className="w-12 h-1 bg-emerald-600 rounded-full mb-4"></div>
             <p className="text-emerald-900 font-black text-lg uppercase tracking-tight">K.V.S.R. Siddhartha College of Pharmaceutical Sciences</p>
             <p className="text-emerald-600 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Siddhartha Nagar, Vijayawada - 520010, A.P.</p>
          </div>
          
          <div className="flex justify-center gap-8 mb-8 text-emerald-400">
            <i className="fa-solid fa-flask hover:text-emerald-600 cursor-pointer"></i>
            <i className="fa-solid fa-microscope hover:text-emerald-600 cursor-pointer"></i>
            <i className="fa-solid fa-notes-medical hover:text-emerald-600 cursor-pointer"></i>
          </div>

          <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-[0.3em]">
             Affiliated to Krishna University • NAAC 'A' Grade • ISO 9001:2015
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-emerald-900 rounded-full"></div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
