import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, User } from 'lucide-react';
import { Student } from '@/types/occurrence';
import { useStudents } from '@/hooks/useStudents';
import { Skeleton } from '@/components/ui/skeleton';

interface StudentSearchProps {
  onSelectStudent: (student: Student) => void;
  selectedStudentId?: string;
}

export const StudentSearch = ({ onSelectStudent, selectedStudentId }: StudentSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [showResults, setShowResults] = useState(false);
  const { data: students = [], isLoading } = useStudents();

  // Extract unique classes
  const uniqueClasses = Array.from(new Set(students.map(s => s.class))).sort();

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
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Section */}
      <div className="space-y-3">
        <Label>Buscar Aluno</Label>
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
              <div className="p-8 text-center text-muted-foreground">
                <p>Nenhum aluno encontrado</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Access by Class */}
      {!showResults && !selectedStudent && (
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Acesso rápido por turma:</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {uniqueClasses.map(cls => {
              const count = students.filter(s => s.class === cls).length;
              return (
                <button
                  key={cls}
                  onClick={() => setClassFilter(cls)}
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
    </div>
  );
};