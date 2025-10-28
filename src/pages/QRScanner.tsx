import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, ArrowLeft, QrCode, Camera } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { toast } from 'sonner';

const QRScanner = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [html5QrCode, setHtml5QrCode] = useState<Html5Qrcode | null>(null);

  useEffect(() => {
    return () => {
      if (html5QrCode) {
        html5QrCode.stop().catch(() => {});
      }
    };
  }, [html5QrCode]);

  const startScanner = async () => {
    try {
      const qrCodeScanner = new Html5Qrcode("qr-reader");
      setHtml5QrCode(qrCodeScanner);

      await qrCodeScanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText) => {
          // Successfully scanned
          qrCodeScanner.stop();
          setIsScanning(false);
          
          // Check if it's an occurrence URL
          if (decodedText.includes('/occurrences/scan?id=')) {
            const url = new URL(decodedText);
            const occurrenceId = url.searchParams.get('id');
            if (occurrenceId) {
              toast.success('QR Code escaneado com sucesso!');
              navigate(`/occurrences/${occurrenceId}`);
            }
          } else if (decodedText.includes('/occurrences/new')) {
            toast.success('QR Code escaneado com sucesso!');
            navigate('/occurrences/new');
          } else {
            toast.error('QR Code inválido');
          }
        },
        (errorMessage) => {
          // Handle scan failure (optional)
          console.log(errorMessage);
        }
      );

      setIsScanning(true);
      toast.info('Aponte a câmera para o QR Code');
    } catch (err) {
      console.error('Error starting scanner:', err);
      toast.error('Erro ao iniciar a câmera. Verifique as permissões.');
    }
  };

  const stopScanner = () => {
    if (html5QrCode) {
      html5QrCode.stop().then(() => {
        setIsScanning(false);
        toast.info('Scanner parado');
      }).catch((err) => {
        console.error('Error stopping scanner:', err);
      });
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

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={() => navigate('/occurrences')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-6 w-6" />
              Escanear QR Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                Use a câmera do dispositivo para escanear o QR Code e acessar rapidamente as ocorrências.
              </p>

              {!isScanning ? (
                <Button onClick={startScanner} size="lg" className="w-full">
                  <Camera className="mr-2 h-5 w-5" />
                  Iniciar Scanner
                </Button>
              ) : (
                <Button onClick={stopScanner} size="lg" variant="destructive" className="w-full">
                  Parar Scanner
                </Button>
              )}
            </div>

            {/* QR Code Reader Container */}
            <div className="relative">
              <div id="qr-reader" className={`${isScanning ? 'block' : 'hidden'} rounded-lg overflow-hidden`}></div>
              {!isScanning && (
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <QrCode className="h-24 w-24 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground">
                      Clique em "Iniciar Scanner" para começar
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium">Dicas:</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Mantenha o QR Code centralizado na tela</li>
                <li>Certifique-se de ter boa iluminação</li>
                <li>O scanner detectará automaticamente o código</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QRScanner;