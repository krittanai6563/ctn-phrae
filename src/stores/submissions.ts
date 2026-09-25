import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { studentSubmissions, type StudentSubmission } from '@/views/apps/assignments/assignmentData';

export interface StudentSubmissionDraft {
  code?: string;
  fileNames?: string[];
  note?: string;
}

const storageKey = 'lms-submissions';

const loadSubmissions = (): Record<string, StudentSubmission[]> => {
  if (typeof window === 'undefined') return structuredClone(studentSubmissions);
  try {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : structuredClone(studentSubmissions);
  } catch {
    return structuredClone(studentSubmissions);
  }
};

export const useSubmissionStore = defineStore('submissions', () => {
  const submissions = ref<Record<string, StudentSubmission[]>>(loadSubmissions());

  const persist = () => localStorage.setItem(storageKey, JSON.stringify(submissions.value));

  const forStudent = (assignmentId: string, studentId: string) => computed(() =>
    (submissions.value[assignmentId] || []).find((submission) => submission.id === studentId),
  );

  const saveStudentSubmission = (assignmentId: string, studentId: string, draft: StudentSubmissionDraft) => {
    const assignmentSubmissions = submissions.value[assignmentId] || [];
    const existing = assignmentSubmissions.find((submission) => submission.id === studentId);
    if (!existing) return;
    existing.status = 'รอดำเนินการ';
    existing.submittedAt = 'วันนี้ เวลา ' + new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';
    existing.fileName = draft.fileNames?.join(', ');
    existing.note = draft.note;
    persist();
  };

  const reviewSubmission = (assignmentId: string, studentId: string, score: number | null, feedback: string) => {
    const existing = (submissions.value[assignmentId] || []).find((submission) => submission.id === studentId);
    if (!existing) return;
    existing.score = score === null ? undefined : score;
    existing.note = feedback;
    persist();
  };

  return { submissions, forStudent, saveStudentSubmission, reviewSubmission };
});
