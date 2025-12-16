import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Phone, Mail, MoreHorizontal } from 'lucide-react';

const leadsData = [
  { id: 1, nome: 'João Silva', empresa: 'Posto Central', telefone: '(11) 99999-0001', email: 'joao@postocentral.com', status: 'Novo', origem: 'Site' },
  { id: 2, nome: 'Maria Santos', empresa: 'Rede Combustível', telefone: '(11) 99999-0002', email: 'maria@redecombustivel.com', status: 'Contatado', origem: 'Indicação' },
  { id: 3, nome: 'Carlos Oliveira', empresa: 'Posto Ipiranga', telefone: '(11) 99999-0003', email: 'carlos@postoipiranga.com', status: 'Qualificado', origem: 'Google' },
  { id: 4, nome: 'Ana Costa', empresa: 'Auto Posto BR', telefone: '(11) 99999-0004', email: 'ana@autopostobr.com', status: 'Proposta', origem: 'Site' },
  { id: 5, nome: 'Pedro Lima', empresa: 'Posto Shell', telefone: '(11) 99999-0005', email: 'pedro@postoshell.com', status: 'Novo', origem: 'WhatsApp' },
];

const statusColors: Record<string, string> = {
  'Novo': 'bg-blue-100 text-blue-800',
  'Contatado': 'bg-yellow-100 text-yellow-800',
  'Qualificado': 'bg-green-100 text-green-800',
  'Proposta': 'bg-purple-100 text-purple-800',
};

const Leads: React.FC = () => {
  const [search, setSearch] = useState('');

  const filteredLeads = leadsData.filter(lead => 
    lead.nome.toLowerCase().includes(search.toLowerCase()) ||
    lead.empresa.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Leads">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Leads</h1>
            <p className="text-muted-foreground">Gerencie seus leads e prospects</p>
          </div>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Novo Lead
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-accent">24</div>
              <p className="text-sm text-muted-foreground">Total de Leads</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-blue-600">8</div>
              <p className="text-sm text-muted-foreground">Novos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-green-600">12</div>
              <p className="text-sm text-muted-foreground">Qualificados</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-purple-600">4</div>
              <p className="text-sm text-muted-foreground">Em Proposta</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar leads..." 
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Leads List */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-medium text-foreground">{lead.nome}</span>
                      <Badge className={statusColors[lead.status]}>{lead.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{lead.empresa}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {lead.telefone}</span>
                      <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {lead.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{lead.origem}</Badge>
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

export default Leads;