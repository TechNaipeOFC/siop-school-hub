import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PrintableOccurrence } from '@/components/PrintableOccurrence';
import { mockOccurrences } from '@/lib/mockData';
import { ArrowLeft, Printer, QrCode, GraduationCap, LogOut } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const OccurrenceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const occurrence = mockOccurrences.find(o => o.id === id);

  if (!occurrence) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Ocorrência não encontrada</p>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  // URL para preenchimento rápido via QR Code
  const qrCodeUrl = `${window.location.origin}/occurrences/scan?id=${occurrence.id}`;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card no-print">
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
        {/* Action Buttons */}
        <div className="flex items-center justify-between mb-6 no-print">
          <Button variant="outline" onClick={() => navigate('/occurrences')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <QrCode className="mr-2 h-4 w-4" />
                  Ver QR Code
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>QR Code da Ocorrência</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center gap-4 py-4">
                  <QRCodeSVG value={qrCodeUrl} size={256} level="H" />
                  <p className="text-sm text-muted-foreground text-center">
                    Escaneie este código para acessar rapidamente esta ocorrência
                  </p>
                </div>
              </DialogContent>
            </Dialog>
            <Button onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimir Ficha
            </Button>
          </div>
        </div>

        {/* Preview Card */}
        <Card className="no-print mb-6">
          <CardHeader>
            <CardTitle>Pré-visualização da Ficha de Ocorrência</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Clique em "Imprimir Ficha" para gerar o documento oficial com espaço para assinaturas.
            </p>
          </CardContent>
        </Card>

        {/* Printable Content */}
        <PrintableOccurrence occurrence={occurrence} />
      </div>
    </div>
  );
};

export default OccurrenceDetail;