import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/StatsCard';
import { OccurrenceBadge } from '@/components/OccurrenceBadge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { FileText, TrendingUp, AlertTriangle, Trophy, Plus, GraduationCap, LogOut, QrCode } from 'lucide-react';
import { mockOccurrences } from '@/lib/mockData';
import { QRCodeSVG } from 'qrcode.react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const Dashboard = () => {
  const navigate = useNavigate();
  const recentOccurrences = mockOccurrences.slice(0, 5);

  const stats = {
    total: mockOccurrences.length,
    pending: mockOccurrences.filter(o => !o.resolved).length,
    critical: mockOccurrences.filter(o => o.severity === 'critica').length
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">SIOP</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/occurrences')}>
              Ocorrências
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
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Visão geral das ocorrências</p>
          </div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <QrCode className="mr-2 h-4 w-4" />
                  QR Code
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>QR Code - Nova Ocorrência</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center gap-4 py-4">
                  <QRCodeSVG 
                    value={`${window.location.origin}/occurrences/new`} 
                    size={256} 
                    level="H" 
                  />
                  <p className="text-sm text-muted-foreground text-center">
                    Escaneie este código para preencher uma nova ocorrência rapidamente
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/qr-scanner')}
                    className="w-full"
                  >
                    <QrCode className="mr-2 h-4 w-4" />
                    Escanear QR Code
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button onClick={() => navigate('/occurrences/new')}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Ocorrência
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="cursor-pointer" onClick={() => navigate('/occurrences?filter=all')}>
            <StatsCard
              title="Total de Ocorrências"
              value={stats.total}
              icon={FileText}
              description="Registros no sistema"
              variant="primary"
            />
          </div>
          <div className="cursor-pointer" onClick={() => navigate('/occurrences?filter=pending')}>
            <StatsCard
              title="Pendentes"
              value={stats.pending}
              icon={TrendingUp}
              description="Aguardando resolução"
              variant="warning"
            />
          </div>
          <div className="cursor-pointer" onClick={() => navigate('/occurrences?filter=critical')}>
            <StatsCard
              title="Casos Críticos"
              value={stats.critical}
              icon={AlertTriangle}
              description="Requerem atenção urgente"
              variant="destructive"
            />
          </div>
        </div>

        {/* Recent Occurrences */}
        <Card>
          <CardHeader>
            <CardTitle>Ocorrências Recentes</CardTitle>
            <CardDescription>Últimos registros no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOccurrences.map((occurrence) => (
                <div
                  key={occurrence.id}
                  className="flex items-start justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/occurrences/detail/${occurrence.id}`)}
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{occurrence.studentName}</span>
                      <OccurrenceBadge type={occurrence.type} />
                      <OccurrenceBadge severity={occurrence.severity} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {occurrence.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{occurrence.teacherName}</span>
                      <span>•</span>
                      <span>{new Date(occurrence.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Button variant="outline" className="w-full" onClick={() => navigate('/occurrences')}>
                Ver Todas as Ocorrências
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
