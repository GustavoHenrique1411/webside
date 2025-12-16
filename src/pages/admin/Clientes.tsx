import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Building2, Phone, Mail, MapPin, MoreHorizontal } from 'lucide-react';

const clientesData = [
  { id: 1, nome: 'Posto Central', cnpj: '12.345.678/0001-90', contato: 'João Silva', telefone: '(11) 99999-0001', email: 'contato@postocentral.com', cidade: 'São Paulo, SP', status: 'Ativo' },
  { id: 2, nome: 'Rede Combustível', cnpj: '23.456.789/0001-01', contato: 'Maria Santos', telefone: '(11) 99999-0002', email: 'contato@redecombustivel.com', cidade: 'Campinas, SP', status: 'Ativo' },
  { id: 3, nome: 'Auto Posto BR', cnpj: '34.567.890/0001-12', contato: 'Carlos Oliveira', telefone: '(11) 99999-0003', email: 'contato@autopostobr.com', cidade: 'Goiânia, GO', status: 'Inativo' },
  { id: 4, nome: 'Posto Shell', cnpj: '45.678.901/0001-23', contato: 'Ana Costa', telefone: '(11) 99999-0004', email: 'contato@postoshell.com', cidade: 'Belo Horizonte, MG', status: 'Ativo' },
  { id: 5, nome: 'Grupo Ipiranga', cnpj: '56.789.012/0001-34', contato: 'Pedro Lima', telefone: '(11) 99999-0005', email: 'contato@grupoipiranga.com', cidade: 'Rio de Janeiro, RJ', status: 'Ativo' },
];

const statusColors: Record<string, string> = {
  'Ativo': 'bg-green-100 text-green-800',
  'Inativo': 'bg-gray-100 text-gray-800',
};

const Clientes: React.FC = () => {
  const [search, setSearch] = useState('');

  const filteredClientes = clientesData.filter(cliente => 
    cliente.nome.toLowerCase().includes(search.toLowerCase()) ||
    cliente.cnpj.includes(search) ||
    cliente.cidade.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Clientes">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
            <p className="text-muted-foreground">Gerencie sua base de clientes</p>
          </div>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Novo Cliente
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-accent">156</div>
              <p className="text-sm text-muted-foreground">Total de Clientes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-green-600">142</div>
              <p className="text-sm text-muted-foreground">Ativos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-gray-600">14</div>
              <p className="text-sm text-muted-foreground">Inativos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-accent">+8%</div>
              <p className="text-sm text-muted-foreground">Crescimento</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar clientes por nome, CNPJ ou cidade..." 
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Clientes List */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredClientes.map((cliente) => (
                <div key={cliente.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-accent/10">
                      <Building2 className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-medium text-foreground">{cliente.nome}</span>
                        <Badge className={statusColors[cliente.status]}>{cliente.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{cliente.cnpj} • {cliente.contato}</p>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {cliente.telefone}</span>
                        <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {cliente.email}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {cliente.cidade}</span>
                      </div>
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

export default Clientes;