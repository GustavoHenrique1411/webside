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
  'Aguardando': 'bg-yellow-100 text-yellow-800',
  'Aprovado': 'bg-green-100 text-green-800',
  'Revisão': 'bg-blue-100 text-blue-800',
  'Recusado': 'bg-red-100 text-red-800',
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
            <h1 className="text-2xl font-bold text-foreground">Orçamentos</h1>
            <p className="text-muted-foreground">Gerencie propostas comerciais</p>
          </div>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Novo Orçamento
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-accent">18</div>
              <p className="text-sm text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-yellow-600">8</div>
              <p className="text-sm text-muted-foreground">Aguardando</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-green-600">6</div>
              <p className="text-sm text-muted-foreground">Aprovados</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-foreground">R$ 563k</div>
              <p className="text-sm text-muted-foreground">Valor Total</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar orçamentos..." 
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Orcamentos List */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Orçamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredOrcamentos.map((orc) => (
                <div key={orc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-sm text-muted-foreground">{orc.id}</span>
                      <span className="font-medium text-foreground">{orc.cliente}</span>
                      <Badge className={statusColors[orc.status]}>{orc.status}</Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> {formatCurrency(orc.valor)}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Validade: {orc.validade}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">Ver</Button>
                    <Button variant="ghost" size="icon">
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