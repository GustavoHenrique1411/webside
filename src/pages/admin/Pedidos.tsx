import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Package, Truck, MoreHorizontal } from 'lucide-react';

const pedidosData = [
  { id: 'PED-001', cliente: 'Posto Central', valor: 45000, data: '2024-01-15', previsao: '2024-02-15', status: 'Em Produção' },
  { id: 'PED-002', cliente: 'Rede Combustível', valor: 128000, data: '2024-01-12', previsao: '2024-02-20', status: 'Aguardando' },
  { id: 'PED-003', cliente: 'Auto Posto BR', valor: 67500, data: '2024-01-10', previsao: '2024-02-10', status: 'Entregue' },
  { id: 'PED-004', cliente: 'Posto Shell', valor: 89000, data: '2024-01-08', previsao: '2024-02-08', status: 'Em Produção' },
  { id: 'PED-005', cliente: 'Grupo Ipiranga', valor: 234000, data: '2024-01-05', previsao: '2024-03-01', status: 'Em Trânsito' },
];

const statusColors: Record<string, string> = {
  'Aguardando': 'bg-yellow-100 text-yellow-800',
  'Em Produção': 'bg-blue-100 text-blue-800',
  'Em Trânsito': 'bg-purple-100 text-purple-800',
  'Entregue': 'bg-green-100 text-green-800',
};

const Pedidos: React.FC = () => {
  const [search, setSearch] = useState('');

  const filteredPedidos = pedidosData.filter(ped => 
    ped.cliente.toLowerCase().includes(search.toLowerCase()) ||
    ped.id.toLowerCase().includes(search.toLowerCase())
  );

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <AdminLayout title="Pedidos">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Pedidos</h1>
            <p className="text-muted-foreground">Acompanhe os pedidos de venda</p>
          </div>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Novo Pedido
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-accent">32</div>
              <p className="text-sm text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <p className="text-sm text-muted-foreground">Em Produção</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-purple-600">5</div>
              <p className="text-sm text-muted-foreground">Em Trânsito</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-green-600">15</div>
              <p className="text-sm text-muted-foreground">Entregues</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar pedidos..." 
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Pedidos List */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPedidos.map((ped) => (
                <div key={ped.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-sm text-muted-foreground">{ped.id}</span>
                      <span className="font-medium text-foreground">{ped.cliente}</span>
                      <Badge className={statusColors[ped.status]}>{ped.status}</Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Package className="h-3 w-3" /> {formatCurrency(ped.valor)}</span>
                      <span className="flex items-center gap-1"><Truck className="h-3 w-3" /> Previsão: {ped.previsao}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">Detalhes</Button>
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

export default Pedidos;