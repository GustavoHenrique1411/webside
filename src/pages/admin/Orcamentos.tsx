import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Calendar, DollarSign, MoreHorizontal } from 'lucide-react';

const orcamentosData = [
  { id: 'ORC-001', cliente: 'Posto Central', valor: 45000, data: '2024-01-15', validade: '2024-02-15', status: 'Aguardando' },
  { id: 'ORC-002', cliente: 'Rede Combustível', valor: 128000, data: '2024-01-12', validade: '2024-02-12', status: 'Aprovado' },
  { id: 'ORC-003', cliente: 'Auto Posto BR', valor: 67500, data: '2024-01-10', validade: '2024-02-10', status: 'Revisão' },
  { id: 'ORC-004', cliente: 'Posto Shell', valor: 89000, data: '2024-01-08', validade: '2024-02-08', status: 'Aguardando' },
  { id: 'ORC-005', cliente: 'Grupo Ipiranga', valor: 234000, data: '2024-01-05', validade: '2024-02-05', status: 'Recusado' },
];

const statusColors: Record<string, string> = {
  'Aguardando': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  'Aprovado': 'bg-green-500/20 text-green-300 border-green-500/30',
  'Revisão': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Recusado': 'bg-red-500/20 text-red-300 border-red-500/30',
};

const Orcamentos: React.FC = () => {
  const [search, setSearch] = useState('');

  const filteredOrcamentos = orcamentosData.filter(orc => 
    orc.cliente.toLowerCase().includes(search.toLowerCase()) ||
    orc.id.toLowerCase().includes(search.toLowerCase())
  );

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <AdminLayout title="Orçamentos">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Orçamentos</h1>
            <p className="text-white/70">Gerencie propostas comerciais</p>
          </div>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Novo Orçamento
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white/10 border-white/10">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-accent">18</div>
              <p className="text-sm text-white/70">Total</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/10">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-yellow-400">8</div>
              <p className="text-sm text-white/70">Aguardando</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/10">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-green-400">6</div>
              <p className="text-sm text-white/70">Aprovados</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/10">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-white">R$ 563k</div>
              <p className="text-sm text-white/70">Valor Total</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
          <Input 
            placeholder="Buscar orçamentos..." 
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Orcamentos List */}
        <Card className="bg-white/10 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Lista de Orçamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredOrcamentos.map((orc) => (
                <div key={orc.id} className="flex items-center justify-between p-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-sm text-white/60">{orc.id}</span>
                      <span className="font-medium text-white">{orc.cliente}</span>
                      <Badge className={statusColors[orc.status]}>{orc.status}</Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-white/60">
                      <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> {formatCurrency(orc.valor)}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Validade: {orc.validade}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">Ver</Button>
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

export default Orcamentos;