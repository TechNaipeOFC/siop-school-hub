import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, User, Plus } from 'lucide-react';
import { Student } from '@/types/occurrence';
import { useStudents } from '@/hooks/useStudents';
import { useClasses } from '@/hooks/useClasses';
import { useCreateStudent } from '@/hooks/useCreateStudent';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface StudentSearchProps {
  onSelectStudent: (student: Student) => void;
  selectedStudentId?: string;
}

export const StudentSearch = ({ onSelectStudent, selectedStudentId }: StudentSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [showResults, setShowResults] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentClass, setNewStudentClass] = useState('');
  const [newResponsibleName, setNewResponsibleName] = useState('');
  const [newResponsiblePhone, setNewResponsiblePhone] = useState('');
  const [newResponsibleEmail, setNewResponsibleEmail] = useState('');
  
  const { data: students = [], isLoading, refetch } = useStudents();
  const { data: classes = [] } = useClasses();
  const createStudent = useCreateStudent();

  // Extract unique classes from students and classes table
  const uniqueClasses = Array.from(new Set([
    ...students.map(s => s.class),
    ...classes.map(c => c.name)
  ])).filter(Boolean).sort();

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.registration.includes(searchTerm);
    const matchesClass = classFilter === 'all' || student.class === classFilter;
    return matchesSearch && matchesClass;
  });

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  const handleSelectStudent = (student: Student) => {
    onSelectStudent(student);
    setShowResults(false);
    setSearchTerm('');
  };

  const handleCreateStudent = async () => {
    if (!newStudentName.trim()) {
      toast.error('Digite o nome do aluno');
      return;
    }
    if (!newStudentClass.trim()) {
      toast.error('Digite a turma do aluno');
      return;
    }

    try {
      const result = await createStudent.mutateAsync({
        name: newStudentName.trim(),
        className: newStudentClass.trim(),
        responsibleName: newResponsibleName.trim() || 'Responsável',
        responsiblePhone: newResponsiblePhone.trim() || undefined,
        responsibleEmail: newResponsibleEmail.trim() || undefined
      });

      // Refetch students and select the new one
      await refetch();
      
      const newStudent: Student = {
        id: result.id,
        name: result.name || newStudentName,
        registration: result.registration,
        class: result.class,
        responsibleId: result.user_id || '',
        responsibleName: result.responsible_name
      };
      
      onSelectStudent(newStudent);
      setShowCreateDialog(false);
      setNewStudentName('');
      setNewStudentClass('');
      setNewResponsibleName('');
      setNewResponsiblePhone('');
      setNewResponsibleEmail('');
      setSearchTerm('');
    } catch (error) {
      console.error('Error creating student:', error);
    }
  };

  // Auto-suggest creating student if not found
  const showCreateOption = searchTerm.length > 2 && filteredStudents.length === 0;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Selected Student Display */}
      {selectedStudent && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{selectedStudent.name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedStudent.class} • Matrícula: {selectedStudent.registration}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onSelectStudent(null as any)}
              >
                Alterar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Section */}
      {!selectedStudent && (
        <>
          <div className="space-y-3">
            <Label>Buscar ou Criar Aluno</Label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Digite o nome ou matrícula do aluno..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowResults(true);
                  }}
                  onFocus={() => setShowResults(true)}
                  className="pl-10"
                />
              </div>
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Série/Turma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as turmas</SelectItem>
                  {uniqueClasses.map(cls => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search Results */}
          {showResults && searchTerm.length > 0 && (
            <Card className="max-h-[300px] overflow-y-auto">
              <CardContent className="p-0">
                {filteredStudents.length > 0 ? (
                  <div className="divide-y">
                    {filteredStudents.map(student => (
                      <div
                        key={student.id}
                        className="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => handleSelectStudent(student)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {student.class} • {student.registration}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-muted-foreground mb-4">Nenhum aluno encontrado</p>
                    {showCreateOption && (
                      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setNewStudentName(searchTerm);
                              setShowCreateDialog(true);
                            }}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Criar aluno "{searchTerm}"
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Criar Novo Aluno</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            <div className="space-y-2">
                              <Label>Nome do Aluno *</Label>
                              <Input
                                value={newStudentName}
                                onChange={(e) => setNewStudentName(e.target.value)}
                                placeholder="Nome completo"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Turma *</Label>
                              <Input
                                value={newStudentClass}
                                onChange={(e) => setNewStudentClass(e.target.value)}
                                placeholder="Ex: 3 E, 2º Ano A"
                                list="class-suggestions"
                              />
                              <datalist id="class-suggestions">
                                {uniqueClasses.map(cls => (
                                  <option key={cls} value={cls} />
                                ))}
                              </datalist>
                            </div>
                            <div className="space-y-2">
                              <Label>Nome do Responsável</Label>
                              <Input
                                value={newResponsibleName}
                                onChange={(e) => setNewResponsibleName(e.target.value)}
                                placeholder="Nome do responsável"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Telefone do Responsável</Label>
                              <Input
                                value={newResponsiblePhone}
                                onChange={(e) => setNewResponsiblePhone(e.target.value)}
                                placeholder="(00) 00000-0000"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Email do Responsável (para notificações)</Label>
                              <Input
                                type="email"
                                value={newResponsibleEmail}
                                onChange={(e) => setNewResponsibleEmail(e.target.value)}
                                placeholder="email@exemplo.com"
                              />
                            </div>
                            <Button 
                              onClick={handleCreateStudent} 
                              className="w-full"
                              disabled={createStudent.isPending}
                            >
                              {createStudent.isPending ? 'Criando...' : 'Criar Aluno'}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Quick Access by Class */}
          {!showResults && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-muted-foreground">Acesso rápido por turma:</Label>
                <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Novo Aluno
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Criar Novo Aluno</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label>Nome do Aluno *</Label>
                        <Input
                          value={newStudentName}
                          onChange={(e) => setNewStudentName(e.target.value)}
                          placeholder="Nome completo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Turma *</Label>
                        <Input
                          value={newStudentClass}
                          onChange={(e) => setNewStudentClass(e.target.value)}
                          placeholder="Ex: 3 E, 2º Ano A"
                          list="class-suggestions-2"
                        />
                        <datalist id="class-suggestions-2">
                          {uniqueClasses.map(cls => (
                            <option key={cls} value={cls} />
                          ))}
                        </datalist>
                      </div>
                      <div className="space-y-2">
                        <Label>Nome do Responsável</Label>
                        <Input
                          value={newResponsibleName}
                          onChange={(e) => setNewResponsibleName(e.target.value)}
                          placeholder="Nome do responsável"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Telefone do Responsável</Label>
                        <Input
                          value={newResponsiblePhone}
                          onChange={(e) => setNewResponsiblePhone(e.target.value)}
                          placeholder="(00) 00000-0000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email do Responsável (para notificações)</Label>
                        <Input
                          type="email"
                          value={newResponsibleEmail}
                          onChange={(e) => setNewResponsibleEmail(e.target.value)}
                          placeholder="email@exemplo.com"
                        />
                      </div>
                      <Button 
                        onClick={handleCreateStudent} 
                        className="w-full"
                        disabled={createStudent.isPending}
                      >
                        {createStudent.isPending ? 'Criando...' : 'Criar Aluno'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {uniqueClasses.map(cls => {
                  const count = students.filter(s => s.class === cls).length;
                  return (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => {
                        setClassFilter(cls);
                        setShowResults(true);
                        setSearchTerm(' ');
                        setTimeout(() => setSearchTerm(''), 10);
                      }}
                      className="p-3 text-sm border rounded-lg hover:bg-muted/50 transition-colors text-left"
                    >
                      <p className="font-medium">{cls}</p>
                      <p className="text-xs text-muted-foreground">{count} alunos</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
