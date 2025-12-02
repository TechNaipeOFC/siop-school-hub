import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Occurrence, OccurrenceType, OccurrenceSeverity } from '@/types/occurrence';

export interface OccurrenceFilters {
  search?: string;
  type?: string;
  severity?: string;
  status?: string;
  classFilter?: string;
  startDate?: string;
  endDate?: string;
}

export const useOccurrences = (filters?: OccurrenceFilters) => {
  return useQuery({
    queryKey: ['occurrences', filters],
    queryFn: async () => {
      let query = supabase
        .from('occurrences')
        .select(`
          *,
          students (
            id,
            name,
            class,
            registration,
            responsible_name,
            responsible_phone
          )
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.type && filters.type !== 'all') {
        query = query.eq('type', filters.type);
      }

      if (filters?.severity && filters.severity !== 'all') {
        query = query.eq('severity', filters.severity);
      }

      if (filters?.status && filters.status !== 'all') {
        if (filters.status === 'pending') {
          query = query.eq('resolved', false);
        } else if (filters.status === 'resolved') {
          query = query.eq('resolved', true);
        }
      }

      if (filters?.startDate) {
        query = query.gte('created_at', filters.startDate);
      }

      if (filters?.endDate) {
        query = query.lte('created_at', filters.endDate + 'T23:59:59');
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform and filter by class/search (needs post-processing for joined data)
      let occurrences = data.map((occ: any): Occurrence & { student?: any } => ({
        id: occ.id,
        studentId: occ.student_id,
        studentName: occ.students?.name || 'Aluno não encontrado',
        type: occ.type as OccurrenceType,
        severity: occ.severity as OccurrenceSeverity,
        description: occ.description,
        date: occ.created_at,
        teacherId: occ.teacher_id || '',
        teacherName: 'Professor',
        correctiveAction: occ.corrective_action || undefined,
        notified: occ.notified || false,
        resolved: occ.resolved || false,
        student: occ.students
      }));

      // Filter by class (post-processing)
      if (filters?.classFilter && filters.classFilter !== 'all') {
        occurrences = occurrences.filter(occ => 
          occ.student?.class === filters.classFilter
        );
      }

      // Filter by search term (post-processing)
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        occurrences = occurrences.filter(occ =>
          occ.studentName.toLowerCase().includes(searchLower) ||
          occ.description.toLowerCase().includes(searchLower)
        );
      }

      return occurrences;
    }
  });
};
