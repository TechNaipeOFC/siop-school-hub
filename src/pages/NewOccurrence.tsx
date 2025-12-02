import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GraduationCap, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { StudentSearch } from '@/components/StudentSearch';
import { Student, OccurrenceType, OccurrenceSeverity } from '@/types/occurrence';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

const NewOccurrence = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [type, setType] = useState<OccurrenceType | ''>('');
  const [severity, setSeverity] = useState<OccurrenceSeverity | ''>('');

  const sendNotification = async (studentData: any, occurrenceData: any) => {
    try {
      // Get student details for notification including email
      const { data: student } = await supabase
        .from('students')
        .select('responsible_name, responsible_phone, responsible_email')
        .eq('id', studentData.id)
        .single();

      if (!student) return;

      const response = await supabase.functions.invoke('send-notification', {
        body: {
          responsibleEmail: (student as any).responsible_email,
          responsiblePhone: student.responsible_phone,
          responsibleName: student.responsible_name,
          studentName: studentData.name,
          occurrenceType: occurrenceData.type,
          occurrenceSeverity: occurrenceData.severity,
          occurrenceDescription: occurrenceData.description,
          occurrenceDate: new Date().toISOString()
        }
      });

      if (response.error) {
        console.error('Notification error:', response.error);
      } else {
        console.log('Notification sent:', response.data);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      if (!selectedStudent) {
        toast.error('Selecione um aluno');
        setIsSubmitting(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Usuário não autenticado');
        setIsSubmitting(false);
        return;
      }

      const occurrenceData = {
        student_id: selectedStudent.id,
        teacher_id: user.id,
        type: formData.get('type') as string,
        severity: formData.get('severity') as string,
        description: formData.get('description') as string,
        corrective_action: formData.get('action') as string || null,
        notified: false,
        resolved: false
      };

      const { error } = await supabase
        .from('occurrences')
        .insert(occurrenceData);

      if (error) throw error;

      // Send notification to responsible
      await sendNotification(selectedStudent, {
        type: occurrenceData.type,
        severity: occurrenceData.severity,
        description: occurrenceData.description
      });

      // Mark as notified
      await supabase
        .from('occurrences')
        .update({ notified: true })
        .eq('student_id', selectedStudent.id)
        .eq('description', occurrenceData.description)
        .order('created_at', { ascending: false })
        .limit(1);

      // Invalidate occurrences cache
      queryClient.invalidateQueries({ queryKey: ['occurrences'] });

      toast.success('Ocorrência registrada com sucesso!');
      navigate('/occurrences');
    } catch (error: any) {
      console.error('Erro ao registrar ocorrência:', error);
      toast.error(error.message || 'Erro ao registrar ocorrência');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">SIOP</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Button variant="ghost" onClick={() => navigate('/occurrences')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Nova Ocorrência</CardTitle>
            <CardDescription>
              Registre uma nova ocorrência pedagógica ou disciplinar. 
              Digite o nome do aluno para buscar ou criar um novo registro automaticamente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <StudentSearch 
                onSelectStudent={setSelectedStudent}
                selectedStudentId={selectedStudent?.id}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Ocorrência *</Label>
                  <Select name="type" value={type} onValueChange={(value) => setType(value as OccurrenceType)} required>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comportamento">Comportamento</SelectItem>
                      <SelectItem value="pedagogico">Pedagógico</SelectItem>
                      <SelectItem value="indisciplina">Indisciplina</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="severity">Gravidade *</Label>
                  <Select name="severity" value={severity} onValueChange={(value) => setSeverity(value as OccurrenceSeverity)} required>
                    <SelectTrigger id="severity">
                      <SelectValue placeholder="Selecione a gravidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="critica">Crítica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Descreva a ocorrência de forma clara e objetiva..."
                  className="min-h-[120px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="action">Ação Corretiva</Label>
                <Textarea
                  id="action"
                  name="action"
                  placeholder="Descreva as ações tomadas ou planejadas..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !selectedStudent} 
                  className="flex-1"
                >
                  {isSubmitting ? 'Registrando...' : 'Registrar Ocorrência'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/occurrences')}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewOccurrence;
