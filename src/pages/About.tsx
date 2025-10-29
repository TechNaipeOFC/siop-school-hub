import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  ArrowLeft, 
  FileText, 
  Users, 
  Bell, 
  BarChart3,
  Shield,
  Clock
} from 'lucide-react';

const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FileText,
      title: 'Registro de Ocorrências',
      description: 'Registre facilmente ocorrências pedagógicas, comportamentais, elogios e mais. Sistema completo para documentar todos os eventos importantes.'
    },
    {
      icon: Users,
      title: 'Gestão de Alunos',
      description: 'Busque alunos por nome, série ou matrícula. Acesse rapidamente o histórico completo de cada estudante.'
    },
    {
      icon: Bell,
      title: 'Notificações Automáticas',
      description: 'Responsáveis são automaticamente notificados sobre ocorrências importantes, mantendo transparência na comunicação.'
    },
    {
      icon: BarChart3,
      title: 'Relatórios e Estatísticas',
      description: 'Visualize dados consolidados, identifique padrões e tome decisões baseadas em informações concretas.'
    },
    {
      icon: Shield,
      title: 'Controle de Acesso',
      description: 'Sistema seguro com diferentes níveis de acesso. Alunos veem apenas suas ocorrências, enquanto funcionários têm acesso completo.'
    },
    {
      icon: Clock,
      title: 'Histórico Completo',
      description: 'Mantenha registro histórico de todas as ocorrências, ações corretivas e evoluções do estudante ao longo do tempo.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">SIOP</span>
          </div>
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Sistema Integrado de Ocorrências Pedagógicas
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Uma solução completa para gestão e acompanhamento de ocorrências escolares,
            facilitando a comunicação entre escola, alunos e responsáveis.
          </p>
        </div>

        {/* O que é o SIOP */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">O que é o SIOP?</CardTitle>
            <CardDescription>Entenda nosso sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              O SIOP (Sistema Integrado de Ocorrências Pedagógicas) é uma plataforma digital
              desenvolvida para modernizar e otimizar o registro, acompanhamento e gestão de
              ocorrências escolares.
            </p>
            <p>
              Com o SIOP, professores e gestores podem documentar eventos importantes de forma
              rápida e organizada, desde questões comportamentais até elogios e conquistas dos
              alunos. O sistema mantém um histórico completo e permite análises detalhadas para
              apoiar decisões pedagógicas.
            </p>
            <p>
              Responsáveis e alunos também têm acesso ao sistema, podendo acompanhar ocorrências
              de forma transparente e em tempo real, fortalecendo a parceria entre família e escola.
            </p>
          </CardContent>
        </Card>

        {/* Como Funciona */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Como Funciona</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <CardTitle>Registro</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Professor ou gestor registra a ocorrência através do formulário digital,
                  selecionando o aluno, tipo e gravidade do evento.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <CardTitle>Notificação</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  O responsável é automaticamente notificado sobre a ocorrência e pode
                  acessar todos os detalhes através do sistema.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <CardTitle>Acompanhamento</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Ações corretivas são registradas e o progresso é acompanhado até a
                  resolução completa da ocorrência.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Funcionalidades */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Principais Funcionalidades</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Níveis de Acesso */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Níveis de Acesso</CardTitle>
            <CardDescription>Diferentes perfis com permissões específicas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">👨‍🎓 Alunos</h3>
                <p className="text-muted-foreground">
                  Podem visualizar apenas suas próprias ocorrências, acompanhando seu histórico
                  e ações corretivas aplicadas.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">👨‍🏫 Professores e Gestores</h3>
                <p className="text-muted-foreground">
                  Acesso completo ao sistema, podendo registrar novas ocorrências, visualizar
                  todas as ocorrências, gerar relatórios e gerenciar o sistema integralmente.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">👪 Responsáveis</h3>
                <p className="text-muted-foreground">
                  Podem acompanhar as ocorrências dos alunos sob sua responsabilidade,
                  recebendo notificações automáticas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Pronto para começar?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Faça login agora e comece a usar o SIOP para melhorar a gestão pedagógica
                da sua instituição.
              </p>
              <div className="flex gap-4 justify-center">
                <Button size="lg" onClick={() => navigate('/auth')}>
                  Fazer Login
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/')}>
                  Voltar ao Início
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
