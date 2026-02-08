
export interface TimeSlot {
  id: string;
  label: string;
  start: string;
  end: string;
  isBreak: boolean;
}

export interface InstitutionConfig {
  workingDays: string[];
  periodsPerDay: number;
  timeSlots: TimeSlot[];
  academicYear: string;
  term: string;
}

export interface TimetableEntry {
  id: string;
  day: string;
  slotId: string;
  subjectId: string;
  facultyId: string;
  classId: string;
  type: 'Lecture' | 'Lab' | 'Seminar' | 'Clinical';
  isLocked?: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  department: string;
  specialization: string[];
  assignedSubjects: string[]; 
  isActive: boolean;
  availability: string[]; // Days they are available
}

export interface AttendanceRecord {
  id: string;
  staffId: string;
  date: string;
  timestamp: string;
  status: 'Present';
}

export interface LeaveRequest {
  id: string;
  staffId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  requestDate: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  department: string;
}

export interface ClassRoom {
  id: string;
  name: string;
  section: string;
}

export interface Substitution {
  id: string;
  date: string;
  slotId: string;
  classId: string;
  originalFacultyId: string;
  substituteFacultyId: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Cancelled';
}

export interface AdminSettings {
  googleLoginEnabled: boolean;
  approvedEmails: string[];
  googleClientId: string;
  googleClientSecret: string;
  adminUsername: string;
  adminPassword: string;
  principalUsername: string;
  principalPassword: string;
  // Cloud DB Fields
  cloudDbEnabled: boolean;
  googleSheetWebAppUrl: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
}

export interface AppState {
  config: InstitutionConfig;
  timetable: TimetableEntry[];
  staff: StaffMember[];
  attendance: AttendanceRecord[];
  leaves: LeaveRequest[];
  subjects: Subject[];
  classes: ClassRoom[];
  substitutions: Substitution[];
  settings: AdminSettings;
  logs: SystemLog[];
}

export interface AnalysisResult {
  summary: string;
  sources: { uri: string; title: string }[];
}

export interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  result: AnalysisResult | null;
}
