import { Occurrence, Student, User } from '@/types/occurrence';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Prof. Maria Silva',
    email: 'maria.silva@escola.com',
    role: 'professor',
    phone: '(11) 98765-4321'
  },
  {
    id: '2',
    name: 'João Diretor',
    email: 'joao.diretor@escola.com',
    role: 'gestor',
    phone: '(11) 98765-1234'
  },
  {
    id: '3',
    name: 'Ana Responsável',
    email: 'ana.resp@email.com',
    role: 'responsavel',
    phone: '(11) 98765-5678'
  }
];

export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Pedro Santos',
    registration: '2024001',
    class: '9º Ano A',
    responsibleId: '3',
    responsibleName: 'Ana Responsável'
  },
  {
    id: '2',
    name: 'Julia Oliveira',
    registration: '2024002',
    class: '8º Ano B',
    responsibleId: '3',
    responsibleName: 'Carlos Oliveira'
  },
  {
    id: '3',
    name: 'Lucas Almeida',
    registration: '2024003',
    class: '9º Ano A',
    responsibleId: '3',
    responsibleName: 'Mariana Almeida'
  }
];

export const mockOccurrences: Occurrence[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'Pedro Santos',
    type: 'indisciplina',
    severity: 'media',
    description: 'Conversou durante a aula e atrapalhou os colegas',
    date: '2025-01-15',
    teacherId: '1',
    teacherName: 'Prof. Maria Silva',
    correctiveAction: 'Conversa com o aluno e orientação sobre comportamento em sala',
    notified: true,
    resolved: false
  },
  {
    id: '2',
    studentId: '2',
    studentName: 'Julia Oliveira',
    type: 'elogio',
    severity: 'baixa',
    description: 'Excelente participação na feira de ciências',
    date: '2025-01-14',
    teacherId: '1',
    teacherName: 'Prof. Maria Silva',
    notified: true,
    resolved: true
  },
  {
    id: '3',
    studentId: '1',
    studentName: 'Pedro Santos',
    type: 'pedagogico',
    severity: 'alta',
    description: 'Não entregou as últimas três tarefas de matemática',
    date: '2025-01-13',
    teacherId: '1',
    teacherName: 'Prof. Maria Silva',
    correctiveAction: 'Agendada reunião com responsável e oferta de reforço',
    notified: true,
    resolved: false
  },
  {
    id: '4',
    studentId: '3',
    studentName: 'Lucas Almeida',
    type: 'comportamento',
    severity: 'critica',
    description: 'Envolvimento em discussão acalorada com colega',
    date: '2025-01-12',
    teacherId: '1',
    teacherName: 'Prof. Maria Silva',
    correctiveAction: 'Suspensão de 1 dia e obrigatoriedade de acompanhamento psicológico',
    notified: true,
    resolved: true
  }
];
