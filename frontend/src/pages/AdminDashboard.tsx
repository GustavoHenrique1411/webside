import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FileText, ShoppingCart, Building, BarChart3, ChevronRight, DollarSign, TrendingUp, LayoutDashboard, Activity, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatsCard } from '@/components/ui';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'Leads',
      description: 'Gerenciar leads e prospects',
      icon: Users,
      path: '/admin/leads',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      count: 24
    },
    {
      title: 'Orçamentos',
      description: 'Criar e gerenciar propostas',
      icon: FileText,
      path: '/admin/orcamentos',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      count: 8
    },
    {
      title: 'Pedidos',
      description: 'Acompanhar pedidos de venda',
      icon: ShoppingCart,
      path: '/admin/pedidos',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      count: 12
    },
    {
      title: 'Financeiro',
      description: 'Controle financeiro',
      icon: DollarSign,
      path: '/admin/financeiro',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      count: 3
    },
    {
      title: 'Clientes',
      description: 'Gerenciar base de clientes',
      icon: Building,
      path: '/admin/clientes',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      count: 156
    },
    {
      title: 'Relatórios',
      description: 'Análises e métricas',
      icon: BarChart3,
      path: '/admin/relatorios',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      count: 6
    }
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        <PageHeader 
          title="Dashboard"
          description="Bem-vindo ao painel administrativo"
          icon={LayoutDashboard}
        />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Receita Mensal"
            value="R$ 1.2M"
            icon={DollarSign}
            color="green"
            description="+18% vs mês anterior"
          />
          <StatsCard
            title="Novos Leads"
            value="24"
            icon={Users}
            color="blue"
            description="+12% este mês"
          />
          <StatsCard
            title="Pedidos Ativos"
            value="12"
            icon={ShoppingCart}
            color="orange"
            description="5 em produção"
          />
          <StatsCard
            title="Taxa Conversão"
            value="42%"
            icon={BarChart3}
            color="purple"
            description="+5% vs mês anterior"
          />
        </div>

        {/* Quick Access Cards */}
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Acesso Rápido</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.path}
                  className="cursor-pointer hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                  onClick={() => navigate(item.path)}
                >
                  <CardHeader className="pb-2 p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl ${item.bgColor} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${item.color}`} />
                      </div>
                      <span className={`text-xl sm:text-2xl font-bold ${item.color}`}>{item.count}</span>
                    </div>
                    <CardTitle className="text-sm sm:text-base mt-2 truncate">{item.title}</CardTitle>
                    <CardDescription className="text-xs sm:text-sm truncate">{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 p-4 sm:p-6">
                    <Button variant="ghost" className="w-full justify-between p-0 h-auto text-xs sm:text-sm text-muted-foreground hover:text-foreground">
                      Ver todos <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Atividades Recentes</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="space-y-3 sm:space-y-4">
              {[
                { acao: 'Novo lead cadastrado', detalhe: 'Posto Central - João Silva', tempo: '5 min atrás', cor: 'bg-blue-500' },
                { acao: 'Orçamento aprovado', detalhe: 'ORC-002 - Rede Combustível', tempo: '1 hora atrás', cor: 'bg-green-500' },
                { acao: 'Pedido em produção', detalhe: 'PED-004 - Posto Shell', tempo: '2 horas atrás', cor: 'bg-orange-500' },
                { acao: 'Pagamento recebido', detalhe: 'FIN-001 - R$ 45.000,00', tempo: '3 horas atrás', cor: 'bg-emerald-500' },
              ].map((atividade, idx) => (
                <div key={idx} className="flex items-start sm:items-center gap-3 sm:gap-4">
                  <div className={`w-2 h-2 rounded-full ${atividade.cor} flex-shrink-0 mt-1.5 sm:mt-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium truncate">{atividade.acao}</p>
                    <p className="text-xs text-muted-foreground truncate">{atividade.detalhe}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">{atividade.tempo}</span>
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