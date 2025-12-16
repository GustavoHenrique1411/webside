import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FileText, ShoppingCart, Building, BarChart3, ChevronRight, DollarSign, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'Leads',
      description: 'Gerenciar leads e prospects',
      icon: Users,
      path: '/admin/leads',
      count: 24
    },
    {
      title: 'Orçamentos',
      description: 'Criar e gerenciar propostas',
      icon: FileText,
      path: '/admin/orcamentos',
      count: 8
    },
    {
      title: 'Pedidos',
      description: 'Acompanhar pedidos de venda',
      icon: ShoppingCart,
      path: '/admin/pedidos',
      count: 12
    },
    {
      title: 'Financeiro',
      description: 'Controle financeiro',
      icon: DollarSign,
      path: '/admin/financeiro',
      count: 3
    },
    {
      title: 'Clientes',
      description: 'Gerenciar base de clientes',
      icon: Building,
      path: '/admin/clientes',
      count: 156
    },
    {
      title: 'Relatórios',
      description: 'Análises e métricas',
      icon: BarChart3,
      path: '/admin/relatorios',
      count: 6
    }
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-white/70">Bem-vindo ao painel administrativo</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white/10 border-white/10">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Receita Mensal</p>
                  <p className="text-2xl font-bold text-white">R$ 1.2M</p>
                </div>
                <div className="p-2 rounded-full bg-accent/20">
                  <TrendingUp className="h-5 w-5 text-accent" />
                </div>
              </div>
              <p className="text-xs text-accent mt-2">+18% vs mês anterior</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/10">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Novos Leads</p>
                  <p className="text-2xl font-bold text-white">24</p>
                </div>
                <div className="p-2 rounded-full bg-accent/20">
                  <Users className="h-5 w-5 text-accent" />
                </div>
              </div>
              <p className="text-xs text-accent mt-2">+12% este mês</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/10">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Pedidos Ativos</p>
                  <p className="text-2xl font-bold text-white">12</p>
                </div>
                <div className="p-2 rounded-full bg-accent/20">
                  <ShoppingCart className="h-5 w-5 text-accent" />
                </div>
              </div>
              <p className="text-xs text-white/60 mt-2">5 em produção</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/10">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Taxa Conversão</p>
                  <p className="text-2xl font-bold text-white">42%</p>
                </div>
                <div className="p-2 rounded-full bg-accent/20">
                  <BarChart3 className="h-5 w-5 text-accent" />
                </div>
              </div>
              <p className="text-xs text-accent mt-2">+5% vs mês anterior</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access Cards */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Acesso Rápido</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.path}
                  className="cursor-pointer bg-white/10 border-white/10 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1"
                  onClick={() => navigate(item.path)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-accent" />
                      </div>
                      <span className="text-2xl font-bold text-accent">{item.count}</span>
                    </div>
                    <CardTitle className="text-base mt-2 text-white">{item.title}</CardTitle>
                    <CardDescription className="text-white/60">{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button variant="ghost" className="w-full justify-between p-0 h-auto text-white/70 hover:text-white hover:bg-transparent">
                      Ver todos <ChevronRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="bg-white/10 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Atividades Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { acao: 'Novo lead cadastrado', detalhe: 'Posto Central - João Silva', tempo: '5 min atrás', cor: 'bg-accent' },
                { acao: 'Orçamento aprovado', detalhe: 'ORC-002 - Rede Combustível', tempo: '1 hora atrás', cor: 'bg-accent' },
                { acao: 'Pedido em produção', detalhe: 'PED-004 - Posto Shell', tempo: '2 horas atrás', cor: 'bg-accent' },
                { acao: 'Pagamento recebido', detalhe: 'FIN-001 - R$ 45.000,00', tempo: '3 horas atrás', cor: 'bg-accent' },
              ].map((atividade, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${atividade.cor}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{atividade.acao}</p>
                    <p className="text-xs text-white/60">{atividade.detalhe}</p>
                  </div>
                  <span className="text-xs text-white/60">{atividade.tempo}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;