import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, TrendingUp, TrendingDown, Calendar, MoreHorizontal } from 'lucide-react';

const transacoesData = [
  { id: 'FIN-001', descricao: 'Venda - Posto Central', tipo: 'entrada', valor: 45000, data: '2024-01-15', status: 'Pago' },
  { id: 'FIN-002', descricao: 'Licença Software', tipo: 'entrada', valor: 12800, data: '2024-01-14', status: 'Pendente' },
  { id: 'FIN-003', descricao: 'Fornecedor Hardware', tipo: 'saida', valor: 8500, data: '2024-01-13', status: 'Pago' },
  { id: 'FIN-004', descricao: 'Venda - Rede Combustível', tipo: 'entrada', valor: 89000, data: '2024-01-12', status: 'Pago' },
  { id: 'FIN-005', descricao: 'Folha de Pagamento', tipo: 'saida', valor: 45000, data: '2024-01-10', status: 'Pago' },
  { id: 'FIN-006', descricao: 'Venda - Auto Posto BR', tipo: 'entrada', valor: 67500, data: '2024-01-08', status: 'Atrasado' },
];

const statusColors: Record<string, string> = {
  'Pago': 'bg-green-500/20 text-green-300 border-green-500/30',
  'Pendente': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  'Atrasado': 'bg-red-500/20 text-red-300 border-red-500/30',
};

const Financeiro: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filtro, setFiltro] = useState<'todos' | 'entrada' | 'saida'>('todos');

  const filteredTransacoes = transacoesData.filter(tr => {
    const matchSearch = tr.descricao.toLowerCase().includes(search.toLowerCase());
    const matchFiltro = filtro === 'todos' || tr.tipo === filtro;
    return matchSearch && matchFiltro;
  });

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const totalEntradas = transacoesData.filter(t => t.tipo === 'entrada').reduce((acc, t) => acc + t.valor, 0);
  const totalSaidas = transacoesData.filter(t => t.tipo === 'saida').reduce((acc, t) => acc + t.valor, 0);

  return (
    <AdminLayout title="Financeiro">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Financeiro</h1>
            <p className="text-white/70">Controle financeiro e pagamentos</p>
          </div>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Nova Transação
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white/10 border-white/10">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
                <span className="text-2xl font-bold text-green-400">{formatCurrency(totalEntradas)}</span>
              </div>
              <p className="text-sm text-white/70">Entradas</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/10">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-400" />
                <span className="text-2xl font-bold text-red-400">{formatCurrency(totalSaidas)}</span>
              </div>
              <p className="text-sm text-white/70">Saídas</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/10">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-accent">{formatCurrency(totalEntradas - totalSaidas)}</div>
              <p className="text-sm text-white/70">Saldo</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/10">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-yellow-400">3</div>
              <p className="text-sm text-white/70">Pendentes</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
            <Input 
              placeholder="Buscar transações..." 
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant={filtro === 'todos' ? 'default' : 'outline'} 
              onClick={() => setFiltro('todos')}
              className={filtro === 'todos' ? 'bg-accent text-accent-foreground' : 'border-white/20 text-white hover:bg-white/10'}
            >
              Todos
            </Button>
            <Button 
              variant={filtro === 'entrada' ? 'default' : 'outline'} 
              onClick={() => setFiltro('entrada')}
              className={filtro === 'entrada' ? 'bg-accent text-accent-foreground' : 'border-white/20 text-white hover:bg-white/10'}
            >
              Entradas
            </Button>
            <Button 
              variant={filtro === 'saida' ? 'default' : 'outline'} 
              onClick={() => setFiltro('saida')}
              className={filtro === 'saida' ? 'bg-accent text-accent-foreground' : 'border-white/20 text-white hover:bg-white/10'}
            >
              Saídas
            </Button>
          </div>
        </div>

        {/* Transações List */}
        <Card className="bg-white/10 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Transações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTransacoes.map((tr) => (
                <div key={tr.id} className="flex items-center justify-between p-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${tr.tipo === 'entrada' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                      {tr.tipo === 'entrada' ? 
                        <TrendingUp className="h-4 w-4 text-green-400" /> : 
                        <TrendingDown className="h-4 w-4 text-red-400" />
                      }
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-medium text-white">{tr.descricao}</span>
                        <Badge className={statusColors[tr.status]}>{tr.status}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <Calendar className="h-3 w-3" /> {tr.data}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`font-bold ${tr.tipo === 'entrada' ? 'text-green-400' : 'text-red-400'}`}>
                      {tr.tipo === 'entrada' ? '+' : '-'} {formatCurrency(tr.valor)}
                    </span>
                    <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
                      <MoreHorizontal className="h-4 w-4" />
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

export default Financeiro;