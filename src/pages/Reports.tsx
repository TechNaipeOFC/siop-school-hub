import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, LogOut, Download, Calendar, BarChart3 } from 'lucide-react';
import { mockOccurrences } from '@/lib/mockData';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

const Reports = () => {
  const navigate = useNavigate();

  const stats = {
    totalOccurrences: mockOccurrences.length,
    byType: {
      comportamento: mockOccurrences.filter(o => o.type === 'comportamento').length,
      pedagogico: mockOccurrences.filter(o => o.type === 'pedagogico').length,
      indisciplina: mockOccurrences.filter(o => o.type === 'indisciplina').length,
      elogio: mockOccurrences.filter(o => o.type === 'elogio').length
    },
    bySeverity: {
      baixa: mockOccurrences.filter(o => o.severity === 'baixa').length,
      media: mockOccurrences.filter(o => o.severity === 'media').length,
      alta: mockOccurrences.filter(o => o.severity === 'alta').length,
      critica: mockOccurrences.filter(o => o.severity === 'critica').length
    }
  };

  const handleExport = () => {
    // Prepare data for Excel
    const exportData = mockOccurrences.map(occ => ({
      'Aluno': occ.studentName,
      'Tipo': occ.type,
      'Gravidade': occ.severity,
      'Descrição': occ.description,
      'Ação Corretiva': occ.correctiveAction || 'N/A',
      'Professor': occ.teacherName,
      'Data': new Date(occ.date).toLocaleDateString('pt-BR'),
      'Status': occ.resolved ? 'Resolvida' : 'Pendente',
      'Notificado': occ.notified ? 'Sim' : 'Não',
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ocorrências');
    
    // Save file
    const fileName = `relatorio_ocorrencias_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    toast.success('Relatório exportado com sucesso!');
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
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              Dashboard
            </Button>
            <Button variant="ghost" onClick={() => navigate('/occurrences')}>
              Ocorrências
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
            <h1 className="text-3xl font-bold">Relatórios</h1>
            <p className="text-muted-foreground">Análise e estatísticas das ocorrências</p>
          </div>
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Exportar Relatório
          </Button>
        </div>

        {/* Overview Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Visão Geral
            </CardTitle>
            <CardDescription>Resumo das ocorrências registradas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div 
                className="p-4 rounded-lg bg-primary/10 border border-primary/20 cursor-pointer hover:bg-primary/20 transition-colors"
                onClick={() => navigate('/occurrences')}
              >
                <p className="text-sm font-medium text-muted-foreground">Total de Ocorrências</p>
                <p className="text-3xl font-bold text-primary">{stats.totalOccurrences}</p>
              </div>
              <div 
                className="p-4 rounded-lg bg-success/10 border border-success/20 cursor-pointer hover:bg-success/20 transition-colors"
                onClick={() => navigate('/occurrences?filter=positive')}
              >
                <p className="text-sm font-medium text-muted-foreground">Elogios</p>
                <p className="text-3xl font-bold text-success">{stats.byType.elogio}</p>
              </div>
              <div 
                className="p-4 rounded-lg bg-warning/10 border border-warning/20 cursor-pointer hover:bg-warning/20 transition-colors"
                onClick={() => navigate('/occurrences?filter=pedagogico')}
              >
                <p className="text-sm font-medium text-muted-foreground">Pedagógico</p>
                <p className="text-3xl font-bold text-warning">{stats.byType.pedagogico}</p>
              </div>
              <div 
                className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 cursor-pointer hover:bg-destructive/20 transition-colors"
                onClick={() => navigate('/occurrences?filter=indisciplina')}
              >
                <p className="text-sm font-medium text-muted-foreground">Indisciplina</p>
                <p className="text-3xl font-bold text-destructive">{stats.byType.indisciplina}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* By Type */}
          <Card>
            <CardHeader>
              <CardTitle>Por Tipo</CardTitle>
              <CardDescription>Distribuição por tipo de ocorrência</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stats.byType).map(([type, count]) => {
                  const percentage = (count / stats.totalOccurrences) * 100;
                  const labels = {
                    comportamento: 'Comportamento',
                    pedagogico: 'Pedagógico',
                    indisciplina: 'Indisciplina',
                    elogio: 'Elogio'
                  };
                  
                  return (
                    <div key={type} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{labels[type as keyof typeof labels]}</span>
                        <span className="text-sm text-muted-foreground">{count} ({percentage.toFixed(0)}%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* By Severity */}
          <Card>
            <CardHeader>
              <CardTitle>Por Gravidade</CardTitle>
              <CardDescription>Distribuição por nível de gravidade</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stats.bySeverity).map(([severity, count]) => {
                  const percentage = (count / stats.totalOccurrences) * 100;
                  const labels = {
                    baixa: 'Baixa',
                    media: 'Média',
                    alta: 'Alta',
                    critica: 'Crítica'
                  };
                  
                  return (
                    <div key={severity} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{labels[severity as keyof typeof labels]}</span>
                        <span className="text-sm text-muted-foreground">{count} ({percentage.toFixed(0)}%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-destructive transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reports;
