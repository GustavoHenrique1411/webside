import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FileText, ShoppingCart, Building, BarChart3, LogOut, ChevronRight, Cog, DollarSign } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    {
      title: 'Leads',
      description: 'Gerenciar leads e prospects',
      icon: Users,
      path: '/admin/leads',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Orçamentos',
      description: 'Criar e gerenciar propostas',
      icon: FileText,
      path: '/admin/orcamentos',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Pedidos',
      description: 'Acompanhar pedidos de venda',
      icon: ShoppingCart,
      path: '/admin/pedidos',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Financeiro',
      description: 'Controle financeiro e pagamentos',
      icon: DollarSign,
      path: '/admin/financeiro',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Clientes',
      description: 'Gerenciar base de clientes',
      icon: Building,
      path: '/admin/clientes',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Relatórios',
      description: 'Análises e métricas',
      icon: BarChart3,
      path: '/admin/relatorios',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-primary/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://www.websidesistemas.com.br/imagens/logo_webside.png"
              alt="Webside Sistemas"
              className="h-8 w-auto object-contain"
            />
            <span className="hidden md:inline text-white/80 text-sm">Painel Administrativo</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => navigate('/admin/configuracoes')}
              className="text-white hover:bg-white/10"
            >
              <Cog className="w-4 h-4 mr-2" />
              Configurações
            </Button>
            <Button variant="ghost" onClick={handleLogout} className="text-white hover:bg-white/10">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Painel Administrativo
          </h1>
          <p className="text-white/80 text-lg">
            Sistema de Gestão Empresarial - Webside
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.path}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white/90 backdrop-blur border-white/20"
                onClick={() => navigate(item.path)}
              >
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 rounded-xl ${item.bgColor} flex items-center justify-center mb-3`}>
                    <Icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                  <CardTitle className="text-xl text-primary">{item.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    Acessar
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Resumo Rápido</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-white/10 border-white/10 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white/80">Leads Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">24</div>
                <p className="text-xs text-white/60">+12% este mês</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/10 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white/80">Orçamentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">8</div>
                <p className="text-xs text-white/60">3 aguardando aprovação</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/10 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white/80">Pedidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">12</div>
                <p className="text-xs text-white/60">5 em produção</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/10 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white/80">Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">156</div>
                <p className="text-xs text-white/60">+8% este mês</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
