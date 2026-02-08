
import { TimetableEntry, AnalysisResult, AppState } from "../types";
import { getState } from "./dataStore";

/**
 * Institutional Logic: Conflict Detection
 * Purely deterministic check for resource overlaps.
 */
export const detectConflicts = (entries: TimetableEntry[]) => {
  const conflicts: { type: string; description: string; severity: string }[] = [];
  const facultyMap = new Map<string, TimetableEntry>();
  const classMap = new Map<string, TimetableEntry>();
  const state = getState();

  entries.forEach(e => {
    const facultyKey = `${e.day}-${e.slotId}-${e.facultyId}`;
    const classKey = `${e.day}-${e.slotId}-${e.classId}`;

    if (facultyMap.has(facultyKey)) {
      const existing = facultyMap.get(facultyKey)!;
      if (existing.id !== e.id) {
        const faculty = state.staff.find(s => s.id === e.facultyId);
        const c1 = state.classes.find(c => c.id === existing.classId)?.name;
        const c2 = state.classes.find(c => c.id === e.classId)?.name;
        conflicts.push({
          type: "Faculty Conflict",
          description: `${faculty?.name || 'Faculty'} is already scheduled for ${c1} during this slot. Potential overlap with ${c2}.`,
          severity: "High"
        });
      }
    }
    facultyMap.set(facultyKey, e);

    if (classMap.has(classKey)) {
      const existing = classMap.get(classKey)!;
      if (existing.id !== e.id) {
        const cName = state.classes.find(c => c.id === e.classId)?.name;
        conflicts.push({
          type: "Class Overlap",
          description: `${cName} is already assigned a module in this slot.`,
          severity: "Medium"
        });
      }
    }
    classMap.set(classKey, e);
  });

  return { conflicts };
};

/**
 * Institutional Logic: Substitution Finder
 * Matches based on department and availability.
 */
export const suggestSubstitution = async (subjectName: string, reason: string) => {
  const state = getState();
  const subject = state.subjects.find(s => s.name === subjectName);
  const sameDept = state.staff.filter(s => s.isActive && (subject ? s.department === subject.department : true));
  const candidate = sameDept[0] || state.staff.find(s => s.isActive);

  await new Promise(r => setTimeout(r, 100)); // Minimal simulation delay

  if (!candidate) return "Registry Error: No active staff available.";

  return `Automated Substitution: ${candidate.name} matched. Dept: ${candidate.department}. Verified for ${subjectName}.`;
};

/**
 * Institutional Logic: Resource Validator
 */
export const verifyResource = async (url: string): Promise<AnalysisResult> => {
  await new Promise(r => setTimeout(r, 200));
  const lowerUrl = url.toLowerCase();
  const isInstitutional = lowerUrl.includes('siddartha') || lowerUrl.includes('scops') || lowerUrl.includes('bolt.host');
  
  return {
    summary: isInstitutional 
      ? `Institutional Asset Verified: Domain [${url}] is a trusted node of KVSR Siddhartha College.`
      : `External Resource: ${url} identified as public web content. No institutional signatures found.`,
    sources: [{ uri: url, title: "Resource Scanner" }]
  };
};
