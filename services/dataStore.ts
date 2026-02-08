
import { AppState, InstitutionConfig, AdminSettings } from '../types';

const KEYS = {
  STATE: 'kvsc_enterprise_state_v5_final_v2',
  AUTH: 'sc_auth_session',
  ROLE: 'sc_auth_role'
};

const DEFAULT_CONFIG: InstitutionConfig = {
  workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  periodsPerDay: 7,
  timeSlots: [
    { id: '1', label: 'Period 1', start: '09:00', end: '10:00', isBreak: false },
    { id: '2', label: 'Period 2', start: '10:00', end: '11:00', isBreak: false },
    { id: '3', label: 'Period 3', start: '11:00', end: '12:00', isBreak: false },
    { id: '4', label: 'Lunch', start: '12:00', end: '13:00', isBreak: true },
    { id: '5', label: 'Period 4', start: '13:00', end: '14:00', isBreak: false },
    { id: '6', label: 'Period 5', start: '14:00', end: '15:00', isBreak: false },
    { id: '7', label: 'Period 6', start: '15:00', end: '16:00', isBreak: false },
  ],
  academicYear: '2024-25',
  term: 'Even Semester'
};

const DEFAULT_SETTINGS: AdminSettings = {
  googleLoginEnabled: false,
  approvedEmails: ['admin@siddartha.edu'],
  googleClientId: '',
  googleClientSecret: '',
  adminUsername: 'admin',
  adminPassword: 'password123',
  principalUsername: '1234',
  principalPassword: '1234',
  cloudDbEnabled: true,
  googleSheetWebAppUrl: 'https://script.google.com/macros/s/AKfycbx8_TxBONe9Lu_L9TLtz7-ouYFceGA8hfrcAKf1OBZtTDstftr3p_5ll1E3gQF2QjzR/exec'
};

const INITIAL_STATE: AppState = {
  config: DEFAULT_CONFIG,
  timetable: [],
  staff: [
    { id: 's1', name: 'Dr. Ramesh', email: 'ramesh@siddartha.edu', department: 'Pharmaceutics', specialization: ['Drug Delivery'], assignedSubjects: [], isActive: true, availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
    { id: 's2', name: 'Ms. Sridevi', email: 'sridevi@siddartha.edu', department: 'Pharmacology', specialization: ['Anatomy'], assignedSubjects: [], isActive: true, availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] }
  ],
  attendance: [],
  leaves: [],
  subjects: [
    { id: 'sub1', code: 'PH101', name: 'Pharmaceutics-I', department: 'Pharmaceutics' },
    { id: 'sub2', code: 'AP102', name: 'Anatomy & Physiology', department: 'Pharmacology' }
  ],
  classes: [
    { id: 'c1', name: 'B.Pharm Year 1', section: 'A' },
    { id: 'c2', name: 'B.Pharm Year 1', section: 'B' },
    { id: 'c3', name: 'Pharm.D Year 1', section: 'A' }
  ],
  substitutions: [],
  settings: DEFAULT_SETTINGS,
  logs: []
};

export const getState = (): AppState => {
  const data = localStorage.getItem(KEYS.STATE);
  if (!data) return INITIAL_STATE;
  try {
    const parsed = JSON.parse(data);
    // Ensure nested defaults exist
    if (!parsed.settings) parsed.settings = { ...DEFAULT_SETTINGS };
    if (parsed.settings.cloudDbEnabled === undefined) parsed.settings.cloudDbEnabled = true;
    if (!parsed.settings.googleSheetWebAppUrl) parsed.settings.googleSheetWebAppUrl = DEFAULT_SETTINGS.googleSheetWebAppUrl;
    return parsed;
  } catch (e) {
    return INITIAL_STATE;
  }
};

export const saveState = (state: AppState) => {
  localStorage.setItem(KEYS.STATE, JSON.stringify(state));
};

export const setSession = (token: string | null, role: 'admin' | 'principal' | null = null) => {
  if (token) {
      localStorage.setItem(KEYS.AUTH, token);
      if (role) localStorage.setItem(KEYS.ROLE, role);
  } else {
      localStorage.removeItem(KEYS.AUTH);
      localStorage.removeItem(KEYS.ROLE);
  }
};

export const getSession = () => localStorage.getItem(KEYS.AUTH);
export const getRole = () => localStorage.getItem(KEYS.ROLE) as 'admin' | 'principal' | null;
export const getSettings = () => getState().settings;
