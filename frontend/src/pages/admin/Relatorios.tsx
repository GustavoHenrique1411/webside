import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { FileText, Download, TrendingUp, Users, DollarSign, Package, Calendar, BarChart3, Eye, Filter, PieChart, LineChart, Activity } from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, Area, AreaChart } from 'recharts';

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

// Sample chart data
const vendasMensaisData = [
  { mes: 'Jan', vendas: 120000, meta: 100000 },
  { mes: 'Fev', vendas: 135000, meta: 110000 },
  { mes: 'Mar', vendas: 118000, meta: 120000 },
  { mes: 'Abr', vendas: 142000, meta: 130000 },
  { mes: 'Mai', vendas: 158000, meta: 140000 },
  { mes: 'Jun', vendas: 165000, meta: 150000 },
];

const clientesPorFonteData = [
  { name: 'Indicação', value: 35, color: '#10b981' },
  { name: 'Google Ads', value: 25, color: '#3b82f6' },
  { name: 'Facebook', value: 20, color: '#8b5cf6' },
  { name: 'Orgânico', value: 15, color: '#f59e0b' },
  { name: 'Outros', value: 5, color: '#ef4444' },
];

const funilVendasData = [
  { etapa: 'Leads', quantidade: 1000, taxa: 100 },
  { etapa: 'Contato', quantidade: 750, taxa: 75 },
  { etapa: 'Proposta', quantidade: 300, taxa: 30 },
  { etapa: 'Negociação', quantidade: 150, taxa: 15 },
  { etapa: 'Fechamento', quantidade: 120, taxa: 12 },
];

const receitaDespesaData = [
  { mes: 'Jan', receita: 120000, despesa: 85000 },
  { mes: 'Fev', receita: 135000, despesa: 92000 },
  { mes: 'Mar', receita: 118000, despesa: 78000 },
  { mes: 'Abr', receita: 142000, despesa: 95000 },
  { mes: 'Mai', receita: 158000, despesa: 102000 },
  { mes: 'Jun', receita: 165000, despesa: 108000 },
];

const Relatorios: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('mes-atual');
  const [selectedFormat, setSelectedFormat] = useState('pdf');

  const handleViewReport = (report: any) => {
    setSelectedReport(report);
    setIsViewDialogOpen(true);
  };

  const handleDownloadReport = (report: any) => {
    // Simulate download
    const link = document.createElement('a');
    link.href = '#'; // In a real app, this would be the actual report URL
    link.download = `${report.titulo.toLowerCase().replace(/\s+/g, '_')}.${selectedFormat}`;
    link.click();

    // Show success message
    alert(`Download do relatório "${report.titulo}" iniciado!`);
  };

  const handleDownloadRecent = (report: any) => {
    // Simulate download of recent report
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${report.nome.toLowerCase().replace(/\s+/g, '_')}.${report.tipo.toLowerCase()}`;
    link.click();

    alert(`Download do relatório "${report.nome}" iniciado!`);
  };

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

        {/* Dashboard de Métricas */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Dashboard de Métricas
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Vendas Mensais */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <LineChart className="h-4 w-4" />
                  Vendas vs Meta (Últimos 6 Meses)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={vendasMensaisData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                    <Tooltip
                      formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, '']}
                      labelFormatter={(label) => `Mês: ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="vendas"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Vendas"
                    />
                    <Line
                      type="monotone"
                      dataKey="meta"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Meta"
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de Clientes por Fonte */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <PieChart className="h-4 w-4" />
                  Clientes por Fonte de Aquisição
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={clientesPorFonteData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {clientesPorFonteData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Funil de Vendas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Funil de Vendas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={funilVendasData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="etapa" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="quantidade" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Receita vs Despesa */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Receita vs Despesa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={receitaDespesaData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                    <Tooltip
                      formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, '']}
                    />
                    <Area
                      type="monotone"
                      dataKey="receita"
                      stackId="1"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                      name="Receita"
                    />
                    <Area
                      type="monotone"
                      dataKey="despesa"
                      stackId="2"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.6}
                      name="Despesa"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
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
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleViewReport(rel)}>
                        <FileText className="h-4 w-4 mr-2" />
                        Visualizar
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDownloadReport(rel)}>
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
                    <Button variant="ghost" size="sm" onClick={() => handleDownloadRecent(rel)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* View Report Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                {selectedReport?.titulo}
              </DialogTitle>
            </DialogHeader>
            {selectedReport && (
              <div className="space-y-6">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">{selectedReport.descricao}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="periodo">Período</Label>
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o período" />
                      </SelectTrigger>
                      <SelectContent position="popper" sideOffset={5}>
                        <SelectItem value="mes-atual">Mês Atual</SelectItem>
                        <SelectItem value="mes-anterior">Mês Anterior</SelectItem>
                        <SelectItem value="ultimos-3-meses">Últimos 3 Meses</SelectItem>
                        <SelectItem value="ultimos-6-meses">Últimos 6 Meses</SelectItem>
                        <SelectItem value="ano-atual">Ano Atual</SelectItem>
                        <SelectItem value="personalizado">Personalizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="formato">Formato</Label>
                    <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o formato" />
                      </SelectTrigger>
                      <SelectContent position="popper" sideOffset={5}>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-sm">Pré-visualização dos Dados</h4>
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total de Registros:</span>
                        <span className="font-medium">1,247</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Período Selecionado:</span>
                        <span className="font-medium">Janeiro 2024</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Última Atualização:</span>
                        <span className="font-medium">Hoje, 14:30</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsViewDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => {
                      handleDownloadReport(selectedReport);
                      setIsViewDialogOpen(false);
                    }}
                    className="flex-1 bg-accent hover:bg-accent/90"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Gerar Relatório
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Relatorios;