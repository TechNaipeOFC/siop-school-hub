import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Student } from '@/types/occurrence';

export const useStudents = () => {
  return useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name');

      if (error) throw error;

      return data.map((student): Student => ({
        id: student.id,
        name: student.name || '',
        registration: student.registration,
        class: student.class,
        responsibleId: student.user_id || '',
        responsibleName: student.responsible_name,
        photoUrl: undefined
      }));
    }
  });
};
