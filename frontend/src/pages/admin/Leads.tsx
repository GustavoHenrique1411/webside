import React, { useState, useEffect, ReactNode } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Search, Phone, Mail, MoreHorizontal, Eye, Edit, Trash2, Building2, User, Calendar, FileText, Loader2 } from 'lucide-react';
import { useLeads, useCreateLead, useUpdateLead, useDeleteLead } from '@/hooks/useGraphQL';

interface Lead {
  nome_empresa: ReactNode;
  telefone_contato: ReactNode;
  email_contato: ReactNode;
  status_nome: any;
  fonte_lead: ReactNode;
  contato_principal: ReactNode;
  id: number;
  nome: string;
  empresa: string;
  email: string;
  telefone: string;
  origem: string;
  status: 'Novo' | 'Contatado' | 'Qualificado' | 'Proposta';
  data_criacao: string;
}

const leadsData: Lead[] = [
  {
    id: 1, nome: 'João Silva', empresa: 'Posto Central', telefone: '(11) 99999-0001', email: 'joao@postocentral.com', status: 'Novo' as Lead['status'], origem: 'Site', data_criacao: '2023-10-01',
    contato_principal: '',
    nome_empresa: '',
    telefone_contato: '',
    email_contato: '',
    status_nome: undefined,
    fonte_lead: ''
  },
  {
    id: 2, nome: 'Maria Santos', empresa: 'Rede Combustível', telefone: '(11) 99999-0002', email: 'maria@redecombustivel.com', status: 'Contatado' as Lead['status'], origem: 'Indicação', data_criacao: '2023-10-02',
    contato_principal: '',
    nome_empresa: '',
    telefone_contato: '',
    email_contato: '',
    status_nome: undefined,
    fonte_lead: ''
  },
  {
    id: 3, nome: 'Carlos Oliveira', empresa: 'Posto Ipiranga', telefone: '(11) 99999-0003', email: 'carlos@postoipiranga.com', status: 'Qualificado' as Lead['status'], origem: 'Google', data_criacao: '2023-10-03',
    contato_principal: '',
    nome_empresa: '',
    telefone_contato: '',
    email_contato: '',
    status_nome: undefined,
    fonte_lead: ''
  },
  {
    id: 4, nome: 'Ana Costa', empresa: 'Auto Posto BR', telefone: '(11) 99999-0004', email: 'ana@autopostobr.com', status: 'Proposta' as Lead['status'], origem: 'Site', data_criacao: '2023-10-04',
    contato_principal: '',
    nome_empresa: '',
    telefone_contato: '',
    email_contato: '',
    status_nome: undefined,
    fonte_lead: ''
  },
  {
    id: 5, nome: 'Pedro Lima', empresa: 'Posto Shell', telefone: '(11) 99999-0005', email: 'pedro@postoshell.com', status: 'Novo' as Lead['status'], origem: 'WhatsApp', data_criacao: '2023-10-05',
    contato_principal: '',
    nome_empresa: '',
    telefone_contato: '',
    email_contato: '',
    status_nome: undefined,
    fonte_lead: ''
  },
];

const statusColors: Record<string, string> = {
  'Novo': 'bg-blue-100 text-blue-800',
  'Contatado': 'bg-yellow-100 text-yellow-800',
  'Qualificado': 'bg-green-100 text-green-800',
  'Proposta': 'bg-purple-100 text-purple-800',
};

const Leads: React.FC = () => {
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newLead, setNewLead] = useState({
    nome: '',
    empresa: '',
    telefone: '',
    email: '',
    status: 'Novo' as Lead['status'],
    origem: 'Site'
  });
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [deleteLeadId, setDeleteLeadId] = useState<number | null>(null);

  // GraphQL hooks
  const { data: leads, loading, error, refetch } = useLeads();
  const createLead = useCreateLead();
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();

  // Set leads from GraphQL
  useEffect(() => {
    if (leads && Array.isArray(leads)) {
      // Data is already set by the hook
    }
  }, [leads]);

  const fetchLeads = async () => {
    refetch();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Basic validation
      if (!newLead.nome.trim() || !newLead.empresa.trim() || !newLead.telefone.trim() || !newLead.email.trim()) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newLead.email)) {
        alert('Por favor, insira um email válido.');
        return;
      }

      await createLead.mutate({
        variables: {
          input: {
            nome_empresa: newLead.nome,
            contato_principal: newLead.nome,
            telefone_contato: newLead.telefone,
            email_contato: newLead.email,
            fonte_lead: newLead.origem
          }
        }
      });
      
      refetch();
      setNewLead({
        nome: '',
        empresa: '',
        telefone: '',
        email: '',
        status: 'Novo' as Lead['status'],
        origem: 'Site'
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating lead:', error);
      alert('Erro ao adicionar lead. Tente novamente.');
    }
  };

  const handleUpdateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editLead) {
      try {
        await updateLead.mutate({
          variables: {
            id: editLead.id,
            input: {
              nome_empresa: editLead.empresa,
              contato_principal: editLead.nome,
              telefone_contato: editLead.telefone,
              email_contato: editLead.email,
              fonte_lead: editLead.origem
            }
          }
        });
        refetch();
        setIsEditDialogOpen(false);
        setEditLead(null);
      } catch (error) {
        console.error('Error updating lead:', error);
        alert('Erro ao atualizar lead. Tente novamente.');
      }
    }
  };

  const confirmDeleteLead = async () => {
    if (deleteLeadId !== null) {
      try {
        await deleteLead.mutate({
          variables: { id: deleteLeadId }
        });
        refetch();
        setDeleteLeadId(null);
      } catch (error) {
        console.error('Error deleting lead:', error);
        alert('Erro ao excluir lead. Tente novamente.');
      }
    }
  };

  const handleStatusChange = async (lead: any, newStatus: string) => {
    try {
      await updateLead.mutate({
        variables: {
          id: lead.id,
          input: {
            status: newStatus
          }
        }
      });
      refetch();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleViewLead = (lead: any) => {
    setSelectedLead(lead);
    setIsViewDialogOpen(true);
  };

  const handleEditLead = (lead: any) => {
    setEditLead({
      id: lead.id,
      nome: lead.contato_principal || '',
      empresa: lead.nome_empresa || '',
      telefone: lead.telefone_contato || '',
      email: lead.email_contato || '',
      status: lead.status_nome as Lead['status'],
      origem: lead.fonte_lead || 'Site',
      data_criacao: lead.data_criacao
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteLead = (leadId: number) => {
    setDeleteLeadId(leadId);
  };

  const filteredLeads = (leads || []).filter((lead: any) =>
    lead && typeof lead === 'object' && (
      (typeof lead.nome_empresa === 'string' ? lead.nome_empresa.toLowerCase() : '').includes((search || '').toLowerCase()) ||
      (typeof lead.contato_principal === 'string' ? lead.contato_principal.toLowerCase() : '').includes((search || '').toLowerCase())
    )
  );

  // Calculate dynamic stats
  const stats = {
    total: filteredLeads.length,
    novos: filteredLeads.filter((lead: any) => lead.status_nome === 'Novo').length,
    qualificados: filteredLeads.filter((lead: any) => lead.status_nome === 'Qualificado').length,
    propostas: filteredLeads.filter((lead: any) => lead.status_nome === 'Proposta').length,
  };

  if (loading) {
    return (
      <AdminLayout title="Leads">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Leads">
        <div className="text-center py-8">
          <p className="text-red-500">Erro ao carregar leads: {error.message}</p>
          <Button onClick={() => refetch()} className="mt-4">
            Tentar novamente
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Leads">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Leads</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Gerencie seus leads e prospects</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} className="bg-accent hover:bg-accent/90 text-accent-foreground w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Novo Lead
          </Button>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Adicionar Novo Lead
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome" className="text-sm font-medium">
                      Nome Completo *
                    </Label>
                    <div className="relative">
                      <Input
                        id="nome"
                        placeholder="Digite o nome completo"
                        value={newLead.nome}
                        onChange={(e) => setNewLead({ ...newLead, nome: e.target.value })}
                        className="pl-10"
                        required
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">
                        👤
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="empresa" className="text-sm font-medium">
                      Empresa *
                    </Label>
                    <div className="relative">
                      <Input
                        id="empresa"
                        placeholder="Nome da empresa"
                        value={newLead.empresa}
                        onChange={(e) => setNewLead({ ...newLead, empresa: e.target.value })}
                        className="pl-10"
                        required
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">
                        🏢
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telefone" className="text-sm font-medium">
                      Telefone *
                    </Label>
                    <div className="relative">
                      <Input
                        id="telefone"
                        placeholder="(11) 99999-9999"
                        value={newLead.telefone}
                        onChange={(e) => setNewLead({ ...newLead, telefone: e.target.value })}
                        className="pl-10"
                        required
                      />
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email *
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@exemplo.com"
                        value={newLead.email}
                        onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                        className="pl-10"
                        required
                      />
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-sm font-medium">
                      Status
                    </Label>
                      <Select value={newLead.status} onValueChange={(value) => setNewLead({ ...newLead, status: value as Lead['status'] })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent key={`status-new-${isDialogOpen}`} position="popper" sideOffset={5}>
                          <SelectItem value="Novo">Novo</SelectItem>
                          <SelectItem value="Contatado">Contatado</SelectItem>
                          <SelectItem value="Qualificado">Qualificado</SelectItem>
                          <SelectItem value="Proposta">Proposta</SelectItem>
                        </SelectContent>
                      </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="origem" className="text-sm font-medium">
                      Origem
                    </Label>
                      <Select value={newLead.origem} onValueChange={(value) => setNewLead({ ...newLead, origem: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a origem" />
                        </SelectTrigger>
                        <SelectContent key={`origem-new-${isDialogOpen}`} position="popper" sideOffset={5}>
                          <SelectItem value="Site">Site</SelectItem>
                          <SelectItem value="Google">Google</SelectItem>
                          <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                          <SelectItem value="Indicação">Indicação</SelectItem>
                        </SelectContent>
                      </Select>
                  </div>
                </div>
                <DialogFooter className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-accent hover:bg-accent/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Lead
                  </Button>
                </DialogFooter>
              </form>
          </DialogContent>
        </Dialog>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-accent">{stats.total}</div>
              <p className="text-sm text-muted-foreground">Total de Leads</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-blue-600">{stats.novos}</div>
              <p className="text-sm text-muted-foreground">Novos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-green-600">{stats.qualificados}</div>
              <p className="text-sm text-muted-foreground">Qualificados</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-purple-600">{stats.propostas}</div>
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

        {/* View Lead Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Detalhes do Lead
              </DialogTitle>
            </DialogHeader>
            {selectedLead && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Nome Completo</Label>
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{selectedLead.contato_principal}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Empresa</Label>
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{selectedLead.nome_empresa}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Telefone</Label>
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedLead.telefone_contato}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedLead.email_contato}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                    <div className="flex items-center gap-2">
                      <Badge className={statusColors[selectedLead.status_nome] || 'bg-gray-100'}>{selectedLead.status_nome}</Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Origem</Label>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{selectedLead.fonte_lead}</Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Data de Cadastro</Label>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedLead.data_criacao ? new Date(selectedLead.data_criacao).toLocaleDateString('pt-BR') : '-'}</span>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Lead Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Editar Lead
              </DialogTitle>
            </DialogHeader>
            {editLead && (
              <form onSubmit={handleUpdateLead} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-nome" className="text-sm font-medium">
                      Nome Completo *
                    </Label>
                    <div className="relative">
                      <Input
                        id="edit-nome"
                        placeholder="Digite o nome completo"
                        value={editLead.nome}
                        onChange={(e) => setEditLead({ ...editLead, nome: e.target.value })}
                        className="pl-10"
                        required
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-empresa" className="text-sm font-medium">
                      Empresa *
                    </Label>
                    <div className="relative">
                      <Input
                        id="edit-empresa"
                        placeholder="Nome da empresa"
                        value={editLead.empresa}
                        onChange={(e) => setEditLead({ ...editLead, empresa: e.target.value })}
                        className="pl-10"
                        required
                      />
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-telefone" className="text-sm font-medium">
                      Telefone *
                    </Label>
                    <div className="relative">
                      <Input
                        id="edit-telefone"
                        placeholder="(11) 99999-9999"
                        value={editLead.telefone}
                        onChange={(e) => setEditLead({ ...editLead, telefone: e.target.value })}
                        className="pl-10"
                        required
                      />
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-email" className="text-sm font-medium">
                      Email *
                    </Label>
                    <div className="relative">
                      <Input
                        id="edit-email"
                        type="email"
                        placeholder="email@exemplo.com"
                        value={editLead.email}
                        onChange={(e) => setEditLead({ ...editLead, email: e.target.value })}
                        className="pl-10"
                        required
                      />
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-status" className="text-sm font-medium">
                      Status
                    </Label>
                    <Select value={editLead.status} onValueChange={(value) => setEditLead({ ...editLead, status: value as Lead['status'] })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent key={`status-edit-${isEditDialogOpen}`} position="popper" sideOffset={5}>
                        <SelectItem value="Novo">Novo</SelectItem>
                        <SelectItem value="Contatado">Contatado</SelectItem>
                        <SelectItem value="Qualificado">Qualificado</SelectItem>
                        <SelectItem value="Proposta">Proposta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-origem" className="text-sm font-medium">
                      Origem
                    </Label>
                    <Select value={editLead.origem} onValueChange={(value) => setEditLead({ ...editLead, origem: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a origem" />
                      </SelectTrigger>
                      <SelectContent key={`origem-edit-${isEditDialogOpen}`} position="popper" sideOffset={5}>
                        <SelectItem value="Site">Site</SelectItem>
                        <SelectItem value="Google">Google</SelectItem>
                        <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                        <SelectItem value="Indicação">Indicação</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-accent hover:bg-accent/90">
                    <Edit className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteLeadId !== null} onOpenChange={() => setDeleteLeadId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-red-600" />
                Confirmar Exclusão
              </AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza de que deseja excluir este lead? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeleteLeadId(null)}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteLead}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Leads Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Origem</TableHead>
                    <TableHead className="w-[70px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.contato_principal}</TableCell>
                      <TableCell>{lead.nome_empresa}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" /> {lead.telefone_contato}
                          </span>
                          <span className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" /> {lead.email_contato}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[lead.status_nome] || 'bg-gray-100'}>{lead.status_nome}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{lead.fonte_lead}</Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewLead(lead)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditLead(lead)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>
                                <FileText className="h-4 w-4 mr-2" />
                                Alterar Status
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem onClick={() => handleStatusChange(lead, 'Novo')}>
                                  <Badge className={`${statusColors['Novo']} mr-2`}>Novo</Badge>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(lead, 'Contatado')}>
                                  <Badge className={`${statusColors['Contatado']} mr-2`}>Contatado</Badge>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(lead, 'Qualificado')}>
                                  <Badge className={`${statusColors['Qualificado']} mr-2`}>Qualificado</Badge>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(lead, 'Proposta')}>
                                  <Badge className={`${statusColors['Proposta']} mr-2`}>Proposta</Badge>
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            <DropdownMenuItem
                              onClick={() => handleDeleteLead(lead.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Leads;