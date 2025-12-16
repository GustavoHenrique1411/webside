import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, TrendingUp, Users, DollarSign, Package, Calendar, BarChart3 } from 'lucide-react';

const relatoriosDisponiveis = [
  { 
    id: 'vendas', 
    titulo: 'Relatório de Vendas', 
    descricao: 'Análise completa de vendas por período, cliente e produto',
    icon: TrendingUp,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  { 
    id: 'clientes', 
    titulo: 'Relatório de Clientes', 
    descricao: 'Base de clientes, crescimento e análise de churn',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  { 
    id: 'financeiro', 
    titulo: 'DRE - Demonstrativo de Resultados', 
    descricao: 'Receitas, despesas e resultado operacional',
    icon: DollarSign,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50'
  },
  { 
    id: 'pedidos', 
    titulo: 'Relatório de Pedidos', 
    descricao: 'Status de pedidos, entregas e prazos',
    icon: Package,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  { 
    id: 'leads', 
    titulo: 'Funil de Vendas', 
    descricao: 'Conversão de leads por etapa do funil',
    icon: BarChart3,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  { 
    id: 'mensal', 
    titulo: 'Resumo Mensal', 
    descricao: 'Visão geral consolidada do mês',
    icon: Calendar,
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
];

const Relatorios: React.FC = () => {
  return (
    <AdminLayout title="Relatórios">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground">Análises e métricas do seu negócio</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-accent">R$ 1.2M</div>
              <p className="text-sm text-muted-foreground">Receita do Mês</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-green-600">+18%</div>
              <p className="text-sm text-muted-foreground">vs Mês Anterior</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-accent">156</div>
              <p className="text-sm text-muted-foreground">Clientes Ativos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-purple-600">42%</div>
              <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
            </CardContent>
          </Card>
        </div>

        {/* Relatórios Disponíveis */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Relatórios Disponíveis</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatoriosDisponiveis.map((rel) => {
              const Icon = rel.icon;
              return (
                <Card key={rel.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${rel.bgColor}`}>
                        <Icon className={`h-5 w-5 ${rel.color}`} />
                      </div>
                      <CardTitle className="text-base">{rel.titulo}</CardTitle>
                    </div>
                    <CardDescription>{rel.descricao}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <FileText className="h-4 w-4 mr-2" />
                        Visualizar
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Relatórios Recentes */}
        <Card>
          <CardHeader>
            <CardTitle>Relatórios Gerados Recentemente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { nome: 'DRE Janeiro 2024', data: '15/01/2024', tipo: 'PDF' },
                { nome: 'Vendas Q4 2023', data: '10/01/2024', tipo: 'Excel' },
                { nome: 'Clientes Ativos', data: '08/01/2024', tipo: 'PDF' },
                { nome: 'Funil de Vendas Dez/23', data: '05/01/2024', tipo: 'PDF' },
              ].map((rel, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{rel.nome}</p>
                      <p className="text-xs text-muted-foreground">{rel.data}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{rel.tipo}</span>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Relatorios;