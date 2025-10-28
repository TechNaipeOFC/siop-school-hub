import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OccurrenceBadge } from '@/components/OccurrenceBadge';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, GraduationCap, LogOut } from 'lucide-react';
import { mockOccurrences } from '@/lib/mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Occurrences = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');

  const filteredOccurrences = mockOccurrences.filter(occurrence => {
    const matchesSearch = occurrence.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         occurrence.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || occurrence.type === typeFilter;
    const matchesSeverity = severityFilter === 'all' || occurrence.severity === severityFilter;
    
    return matchesSearch && matchesType && matchesSeverity;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">SIOP</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              Dashboard
            </Button>
            <Button variant="ghost" onClick={() => navigate('/reports')}>
              Relatórios
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Ocorrências</h1>
            <p className="text-muted-foreground">Gerencie todas as ocorrências registradas</p>
          </div>
          <Button onClick={() => navigate('/occurrences/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Ocorrência
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por aluno ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="comportamento">Comportamento</SelectItem>
                  <SelectItem value="pedagogico">Pedagógico</SelectItem>
                  <SelectItem value="indisciplina">Indisciplina</SelectItem>
                  <SelectItem value="elogio">Elogio</SelectItem>
                </SelectContent>
              </Select>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Gravidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="critica">Crítica</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Occurrences List */}
        <div className="space-y-4">
          {filteredOccurrences.map((occurrence) => (
            <Card
              key={occurrence.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => navigate(`/occurrences/detail/${occurrence.id}`)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-lg">{occurrence.studentName}</h3>
                      <OccurrenceBadge type={occurrence.type} />
                      <OccurrenceBadge severity={occurrence.severity} />
                      {!occurrence.resolved && (
                        <span className="text-xs px-2 py-1 rounded-full bg-warning/20 text-warning-foreground">
                          Pendente
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground">{occurrence.description}</p>
                    {occurrence.correctiveAction && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Ação corretiva:</span> {occurrence.correctiveAction}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{occurrence.teacherName}</span>
                      <span>•</span>
                      <span>{new Date(occurrence.date).toLocaleDateString('pt-BR')}</span>
                      {occurrence.notified && (
                        <>
                          <span>•</span>
                          <span className="text-success">Notificado</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredOccurrences.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">Nenhuma ocorrência encontrada</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Occurrences;
