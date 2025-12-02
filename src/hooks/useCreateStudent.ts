import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CreateStudentData {
  name: string;
  className: string;
  registration?: string;
  responsibleName?: string;
  responsiblePhone?: string;
  responsibleEmail?: string;
}

export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateStudentData) => {
      // First, ensure the class exists
      const { data: existingClass } = await supabase
        .from('classes')
        .select('id')
        .eq('name', data.className)
        .maybeSingle();

      let classId = existingClass?.id;

      // Create class if it doesn't exist
      if (!classId) {
        const { data: newClass, error: classError } = await supabase
          .from('classes')
          .insert({ name: data.className })
          .select()
          .single();

        if (classError) throw classError;
        classId = newClass.id;
      }

      // Generate a registration number if not provided
      const registration = data.registration || `REG${Date.now()}`;

      // Create the student
      const { data: student, error } = await supabase
        .from('students')
        .insert({
          name: data.name,
          class: data.className,
          class_id: classId,
          registration: registration,
          responsible_name: data.responsibleName || 'Responsável',
          responsible_phone: data.responsiblePhone || null,
          responsible_email: data.responsibleEmail || null
        } as any)
        .select()
        .single();

      if (error) throw error;
      return student;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast.success('Aluno criado com sucesso!');
    },
    onError: (error: any) => {
      console.error('Error creating student:', error);
      toast.error(error.message || 'Erro ao criar aluno');
    }
  });
};
