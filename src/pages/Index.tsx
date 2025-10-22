import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, FileText, Bell, BarChart3, Shield, Users } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FileText,
      title: 'Registro de Ocorrências',
      description: 'Registre e acompanhe ocorrências pedagógicas e disciplinares de forma rápida e organizada.'
    },
    {
      icon: Bell,
      title: 'Notificações Automáticas',
      description: 'Responsáveis e gestores recebem notificações instantâneas sobre novas ocorrências.'
    },
    {
      icon: BarChart3,
      title: 'Relatórios Gerenciais',
      description: 'Gere relatórios detalhados com filtros por período, tipo e aluno.'
    },
    {
      icon: Users,
      title: 'Gestão de Usuários',
      description: 'Controle de acesso para professores, gestores e responsáveis.'
    },
    {
      icon: Shield,
      title: 'Segurança e Privacidade',
      description: 'Sistema seguro com autenticação e proteção de dados sensíveis.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">SIOP</span>
          </div>
          <Button onClick={() => navigate('/auth')}>
            Entrar
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-5xl font-bold tracking-tight">
            Sistema Integrado de
            <span className="text-primary"> Ocorrências Pedagógicas</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Plataforma completa para gestão de ocorrências escolares, facilitando a comunicação entre escola, professores, alunos e famílias.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button size="lg" onClick={() => navigate('/auth')}>
              Começar Agora
            </Button>
            <Button size="lg" variant="outline">
              Saiba Mais
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Funcionalidades Principais</h2>
          <p className="text-muted-foreground">Tudo que você precisa para gerenciar ocorrências escolares</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow"
            >
              <feature.icon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto bg-primary text-primary-foreground rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para transformar a gestão escolar?
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Junte-se às escolas que já utilizam o SIOP para melhorar a comunicação e o acompanhamento pedagógico.
          </p>
          <Button size="lg" variant="secondary" onClick={() => navigate('/auth')}>
            Criar Conta Grátis
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 SIOP - Sistema Integrado de Ocorrências Pedagógicas</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
