export type OccurrenceType = 'comportamento' | 'pedagogico' | 'indisciplina';

export type OccurrenceSeverity = 'baixa' | 'media' | 'alta' | 'critica';

export type UserRole = 'professor' | 'gestor' | 'responsavel';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
}

export interface Student {
  id: string;
  name: string;
  registration: string;
  class: string;
  responsibleId: string;
  responsibleName: string;
  photoUrl?: string;
}

export interface Occurrence {
  id: string;
  studentId: string;
  studentName: string;
  type: OccurrenceType;
  severity: OccurrenceSeverity;
  description: string;
  date: string;
  teacherId: string;
  teacherName: string;
  correctiveAction?: string;
  notified: boolean;
  resolved: boolean;
}
