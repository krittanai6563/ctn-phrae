import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

export type UserRole = 'teacher' | 'student';

export interface SessionUser {
  id: string;
  name: string;
  role: UserRole;
  enrolledCourseIds: string[];
  assignedAssignmentIds: string[];
}

const storageKey = 'lms-session';
const defaultTeacher: SessionUser = {
  id: 'teacher-1',
  name: 'อาจารย์ สมชาย ใจดี',
  role: 'teacher',
  enrolledCourseIds: [],
  assignedAssignmentIds: [],
};

const loadUser = (): SessionUser => {
  if (typeof window === 'undefined') return defaultTeacher;
  try {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : defaultTeacher;
  } catch {
    return defaultTeacher;
  }
};

export const useAuthStore = defineStore('auth', () => {
  const user = ref<SessionUser>(loadUser());
  const isTeacher = computed(() => user.value.role === 'teacher');
  const isStudent = computed(() => user.value.role === 'student');

  const persist = () => localStorage.setItem(storageKey, JSON.stringify(user.value));

  const login = (username: string) => {
    const studentLogin = username.trim().toLowerCase().startsWith('student');
    user.value = studentLogin
      ? {
          id: 'student-1',
          name: 'กนกพร มั่นคง',
          role: 'student',
          enrolledCourseIds: ['course-c-year-1'],
          assignedAssignmentIds: ['assignment-1', 'assignment-2', 'assignment-3', 'assignment-4'],
        }
      : defaultTeacher;
    persist();
  };

  const logout = () => {
    user.value = defaultTeacher;
    persist();
  };

  return { user, isTeacher, isStudent, login, logout };
});
