
import React, { useState, useEffect } from 'react';
import { getState } from '../services/dataStore';
import { AppState, TimetableEntry, StaffMember, ClassRoom, Subject, TimeSlot } from '../types';

const TimetableBoard: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(getState());
  const [viewMode, setViewMode] = useState<'class' | 'staff'>('class');
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [targetId, setTargetId] = useState<string>('');

  useEffect(() => {
    // Set default target based on mode
    if (viewMode === 'class' && appState.classes.length > 0) {
      setTargetId(appState.classes[0].id);
    } else if (viewMode === 'staff' && appState.staff.length > 0) {
      setTargetId(appState.staff[0].id);
    }
  }, [viewMode, appState.classes, appState.staff]);

  const filteredEntries = appState.timetable.filter(e => {
    const dayMatch = e.day === selectedDay;
    const targetMatch = viewMode === 'class' ? e.classId === targetId : e.facultyId === targetId;
    return dayMatch && targetMatch;
  });

  const getSubjectName = (id: string) => appState.subjects.find(s => s.id === id)?.name || 'Unknown Subject';
  const getFacultyName = (id: string) => appState.staff.find(s => s.id === id)?.name || 'Unknown Faculty';
  const getClassName = (id: string) => appState.classes.find(c => c.id === id)?.name || 'Unknown Class';
  const getSlotTime = (id: string) => {
    const slot = appState.config.timeSlots.find(s => s.id === id);
    return slot ? `${slot.start} - ${slot.end}` : '--';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="glass rounded-[3rem] p-10 shadow-2xl border-emerald-50">
        
        {/* Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-10 gap-8">
          <div>
            <h2 className="text-3xl font-black text-emerald-900 mb-1">Campus Timetable</h2>
            <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Digital Learning Matrix</p>
          </div>

          <div className="flex bg-slate-100 p-1.5 rounded-2xl">
            <button 
              onClick={() => setViewMode('class')}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'class' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-400 hover:text-emerald-600'}`}
            >
              Class View
            </button>
            <button 
              onClick={() => setViewMode('staff')}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'staff' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-400 hover:text-emerald-600'}`}
            >
              Staff View
            </button>
          </div>

          <div className="flex bg-slate-100 p-1.5 rounded-2xl">
            {appState.config.workingDays.map(day => (
              <button 
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${selectedDay === day ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400'}`}
              >
                {day.substring(0,3)}
              </button>
            ))}
          </div>
        </div>

        {/* Selection Dropdown */}
        <div className="mb-10 max-w-md mx-auto">
          <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-2 text-center">
            {viewMode === 'class' ? 'Select Academic Class' : 'Select Faculty Member'}
          </label>
          <select 
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-emerald-900 focus:outline-emerald-500 shadow-inner"
          >
            {viewMode === 'class' 
              ? appState.classes.map(c => <option key={c.id} value={c.id}>{c.name} - Sec {c.section}</option>)
              : appState.staff.map(s => <option key={s.id} value={s.id}>{s.name} ({s.department})</option>)
            }
          </select>
        </div>

        {/* Timetable Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appState.config.timeSlots.map(slot => {
            const entry = filteredEntries.find(e => e.slotId === slot.id);
            if (slot.isBreak) {
              return (
                <div key={slot.id} className="p-6 rounded-3xl bg-amber-50 border border-amber-100 flex items-center justify-center gap-4 group transition-all">
                  <i className="fa-solid fa-mug-hot text-amber-300 text-xl"></i>
                  <span className="text-xs font-black text-amber-700 uppercase tracking-[0.2em]">{slot.label} Break</span>
                </div>
              );
            }

            return (
              <div key={slot.id} className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-emerald-900/5 transition-all group relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div className="px-3 py-1 bg-emerald-50 rounded-lg text-[9px] font-black text-emerald-600 uppercase">
                    {slot.label}
                  </div>
                  <div className="text-[10px] font-bold text-slate-400">
                    {slot.start} - {slot.end}
                  </div>
                </div>

                {entry ? (
                  <>
                    <h4 className="text-lg font-black text-emerald-900 mb-1">{getSubjectName(entry.subjectId)}</h4>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-emerald-600">
                        <i className="fa-solid fa-user-tie mr-2 opacity-40"></i>
                        {viewMode === 'class' ? getFacultyName(entry.facultyId) : getClassName(entry.classId)}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <i className="fa-solid fa-location-dot mr-2 opacity-40"></i>
                        {entry.type} Session
                      </p>
                    </div>
                    {entry.isLocked && (
                      <div className="absolute top-4 right-4 text-emerald-100">
                        <i className="fa-solid fa-lock"></i>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="h-20 flex flex-col items-center justify-center text-slate-200 border-2 border-dashed border-slate-50 rounded-2xl">
                    <i className="fa-solid fa-calendar-day mb-1"></i>
                    <p className="text-[10px] font-black uppercase tracking-widest">No Session</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Substitutions of the Day */}
        <div className="mt-16 pt-10 border-t border-emerald-50">
          <h3 className="text-center text-emerald-900 font-black uppercase tracking-widest text-xs mb-8">Current Substitutions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
             {appState.substitutions.filter(s => s.status === 'Approved').length === 0 ? (
               <p className="col-span-2 text-center text-[10px] font-bold text-slate-300 italic">No active substitutions for today.</p>
             ) : (
               appState.substitutions.filter(s => s.status === 'Approved').map(sub => (
                 <div key={sub.id} className="p-4 bg-emerald-950 rounded-2xl text-white flex gap-4 items-center">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                       <i className="fa-solid fa-user-clock"></i>
                    </div>
                    <div>
                       <p className="text-[9px] font-black text-emerald-500 uppercase">Substitution</p>
                       <p className="text-xs font-bold">{getFacultyName(sub.substituteFacultyId)} replacing {getFacultyName(sub.originalFacultyId)}</p>
                    </div>
                 </div>
               ))
             )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TimetableBoard;
