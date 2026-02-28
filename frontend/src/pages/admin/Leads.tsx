import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Loader2, MoreHorizontal, Eye, Edit, Trash2, Users } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PageHeader, StatsCard, EmptyState, SearchBar } from '@/components/ui';
import { useLeads, useCreateLead, useUpdateLead, useDeleteLead } from '@/hooks/useGraphQL';
import { useToast } from '@/hooks/use-toast';
import LeadViewDialog from '@/components/leads/LeadViewDialog';
import LeadFormDialog from '@/components/leads/LeadFormDialog';

const statusColors: Record<string, string> = {
  'Novo': 'bg-blue-100 text-blue-800',
  'Contatado': 'bg-yellow-100 text-yellow-800',
  'Qualificado': 'bg-green-100 text-green-800',
  'Proposta': 'bg-purple-100 text-purple-800',
};

const Leads: React.FC = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [editData, setEditData] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ nome: '', empresa: '', telefone: '', email: '', origem: 'Site', status: 'Novo' });

  const { data: leads, loading, refetch } = useLeads();
  const createLead = useCreateLead();
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();

  const filteredLeads = (leads || []).filter((l: any) =>
    (l.nome_empresa?.toLowerCase().includes(search.toLowerCase())) ||
    (l.contato_principal?.toLowerCase().includes(search.toLowerCase()))
  );

  const stats = {
    total: filteredLeads.length,
    novos: filteredLeads.filter((l: any) => l.status_nome === 'Novo').length,
    qualificados: filteredLeads.filter((l: any) => l.status_nome === 'Qualificado').length,
    propostas: filteredLeads.filter((l: any) => l.status_nome === 'Proposta').length,
  };

  const handleSubmit = async () => {
    try {
      const result = await createLead.mutate(formData);
      if (result) {
        setIsDialogOpen(false);
        setFormData({ nome: '', empresa: '', telefone: '', email: '', origem: 'Site', status: 'Novo' });
        refetch();
        toast({ title: "Sucesso", description: "Lead criado" });
      } else {
        toast({ title: "Erro", description: "Não foi possível criar o lead. Verifique os logs.", variant: "destructive" });
      }
    } catch { toast({ title: "Erro", description: "Erro ao criar", variant: "destructive" }); }
  };

  const handleUpdate = async () => {
    if (!editData) return;
    try {
      const result = await updateLead.mutate(editData.id, { nome_empresa: editData.nome_empresa, contato_principal: editData.contato_principal, telefone_contato: editData.telefone_contato, email_contato: editData.email_contato });
      if (result) {
        setIsEditOpen(false);
        refetch();
        toast({ title: "Sucesso", description: "Lead atualizado" });
      } else {
        toast({ title: "Erro", description: "Não foi possível atualizar o lead", variant: "destructive" });
      }
    } catch { toast({ title: "Erro", description: "Erro ao atualizar", variant: "destructive" }); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const result = await deleteLead.mutate(deleteId);
      if (result) {
        setDeleteId(null);
        refetch();
        toast({ title: "Sucesso", description: "Lead excluído" });
      } else {
        toast({ title: "Erro", description: "Não foi possível excluir o lead", variant: "destructive" });
      }
    } catch { toast({ title: "Erro", description: "Erro ao excluir", variant: "destructive" }); }
  };

  const handleStatusChange = async (lead: any, status: string) => {
    try {
      const result = await updateLead.mutate(lead.id, { status });
      if (result) {
        refetch();
        toast({ title: "Sucesso", description: "Status atualizado" });
      }
    } catch {}
  };

  if (loading) {
    return <AdminLayout title="Leads"><div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div></AdminLayout>;
  }

  return (
    <AdminLayout title="Leads">
      <div className="space-y-6">
        <PageHeader 
          title="Leads"
          description="Gerencie seus leads e potenciais clientes"
          icon={Users}
          action={
            <Button onClick={() => setIsDialogOpen(true)} className="bg-accent hover:bg-accent/90">
              <Plus className="h-4 w-4 mr-2" />Novo Lead
            </Button>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total de Leads"
            value={stats.total}
            icon={Users}
            color="default"
          />
          <StatsCard
            title="Novos"
            value={stats.novos}
            icon={Users}
            color="blue"
          />
          <StatsCard
            title="Qualificados"
            value={stats.qualificados}
            icon={Users}
            color="green"
          />
          <StatsCard
            title="Proposta"
            value={stats.propostas}
            icon={Users}
            color="purple"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <SearchBar 
            value={search} 
            onChange={setSearch} 
            placeholder="Buscar leads por nome ou empresa..." 
          />
        </div>

        <div className="rounded-2xl border bg-card">
          {filteredLeads.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Nenhum lead encontrado"
              description={search ? "Tente buscar com outros termos" : "Comece adicionando seu primeiro lead"}
              action={
                <Button onClick={() => setIsDialogOpen(true)} className="bg-accent">
                  <Plus className="h-4 w-4 mr-2" />Novo Lead
                </Button>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow><TableHead>Contato</TableHead><TableHead>Empresa</TableHead><TableHead>Telefone</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Ações</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead: any) => (
                  <TableRow key={lead.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">{lead.contato_principal}</TableCell>
                    <TableCell>{lead.nome_empresa}</TableCell>
                    <TableCell>{lead.telefone_contato}</TableCell>
                    <TableCell><Badge className={statusColors[lead.status_nome] || 'bg-gray-100'}>{lead.status_nome}</Badge></TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setSelectedLead(lead); setIsViewOpen(true); }}><Eye className="h-4 w-4 mr-2" />Ver</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setEditData(lead); setIsEditOpen(true); }}><Edit className="h-4 w-4 mr-2" />Editar</DropdownMenuItem>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem onClick={() => handleStatusChange(lead, 'Novo')}><Badge className={statusColors['Novo']}>Novo</Badge></DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(lead, 'Contatado')}><Badge className={statusColors['Contatado']}>Contatado</Badge></DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(lead, 'Qualificado')}><Badge className={statusColors['Qualificado']}>Qualificado</Badge></DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(lead, 'Proposta')}><Badge className={statusColors['Proposta']}>Proposta</Badge></DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                          <DropdownMenuItem onClick={() => setDeleteId(lead.id)} className="text-red-600"><Trash2 className="h-4 w-4 mr-2" />Excluir</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Create Dialog */}
        <LeadFormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={async (data) => {
            try {
              await createLead.mutate({
                nome: data.nome,
                empresa: data.empresa,
                telefone: data.telefone,
                email: data.email,
                origem: data.origem,
                status: data.status
              });
              setIsDialogOpen(false);
              setFormData({ nome: '', empresa: '', telefone: '', email: '', origem: 'Site', status: 'Novo' });
              refetch();
              toast({ title: "Sucesso", description: "Lead criado" });
            } catch { 
              toast({ title: "Erro", description: "Erro ao criar", variant: "destructive" }); 
            }
          }}
          isLoading={createLead.loading}
        />

        {/* View Dialog */}
        <LeadViewDialog
          open={isViewOpen}
          onOpenChange={setIsViewOpen}
          lead={selectedLead}
          allLeads={leads}
          onSelectLead={(lead) => setSelectedLead(lead)}
          onEdit={(lead) => {
            setEditData(lead);
            setIsViewOpen(false);
            setIsEditOpen(true);
          }}
        />

        {/* Edit Dialog */}
        <LeadFormDialog
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          editData={editData ? {
            nome: editData.contato_principal,
            empresa: editData.nome_empresa,
            telefone: editData.telefone_contato,
            email: editData.email_contato,
            status: editData.status_nome,
            origem: editData.fonte_lead
          } : null}
          onSubmit={async (data) => {
            if (!editData) return;
            try {
              await updateLead.mutate(editData.id, { 
                nome_empresa: data.empresa, 
                contato_principal: data.nome, 
                telefone_contato: data.telefone, 
                email_contato: data.email 
              });
              setIsEditOpen(false);
              refetch();
              toast({ title: "Sucesso", description: "Lead atualizado" });
            } catch { 
              toast({ title: "Erro", description: "Erro ao atualizar", variant: "destructive" }); 
            }
          }}
          isLoading={updateLead.loading}
        />

        <AlertDialog open={deleteId !== null} onOpenChange={open => !open && setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader><AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle><AlertDialogDescription>Tem certeza?</AlertDialogDescription></AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction className="bg-red-600" onClick={handleDelete}>Excluir</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default Leads;
