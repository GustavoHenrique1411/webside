import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Loader2, MoreHorizontal, Eye, Edit, Trash2, FileText, Receipt, CheckCircle, Clock, FileDown, Mail, Phone } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PageHeader, StatsCard, EmptyState, SearchBar } from '@/components/ui';
import { useNotifications } from '@/components/NotificationSystem';
import { useOrcamentos, useCreateOrcamento, useUpdateOrcamento, useDeleteOrcamento } from '@/hooks/useOrcamentos';
import { useClientes } from '@/hooks/useClientes';
import { useLeads } from '@/hooks/useLeads';
import { useProdutos } from '@/hooks/useProdutos';
import { Orcamento, OrcamentoFormData, createEmptyOrcamentoForm } from '@/types/orcamento';
import OrcamentoViewDialog from '@/components/orcamentos/OrcamentoViewDialog';
import OrcamentoFormDialog from '@/components/orcamentos/OrcamentoFormDialog';
import OrcamentoDocumentDialog from '@/components/orcamentos/OrcamentoDocumentDialog';

const Orcamentos: React.FC = () => {
  const notifications = useNotifications();
  
  // States following Clientes page pattern
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDocOpen, setIsDocOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  
  const [selectedOrcamento, setSelectedOrcamento] = useState<Orcamento | null>(null);
  const [editData, setEditData] = useState<Orcamento | null>(null);
  const [formData, setFormData] = useState<OrcamentoFormData>(createEmptyOrcamentoForm());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);
  const [pdfNotes, setPdfNotes] = useState('');

  // GraphQL hooks
  const { data: orcamentos, loading, error, refetch } = useOrcamentos();
  const createOrcamento = useCreateOrcamento();
  const updateOrcamento = useUpdateOrcamento();
  const deleteOrcamento = useDeleteOrcamento();
  const { data: clientesData } = useClientes();
  const { data: leadsData } = useLeads();
  const { data: produtosData } = useProdutos();

  // Filter orcamentos based on search
  const filteredOrcamentos = (orcamentos || []).filter((o: Orcamento) =>
    (o.cliente_nome?.toLowerCase().includes(search.toLowerCase())) ||
    (o.numero_orcamento?.toLowerCase().includes(search.toLowerCase()))
  );

  // Stats
  const stats = {
    total: filteredOrcamentos.length,
    aguardando: filteredOrcamentos.filter((o: Orcamento) => o.status_nome === 'Aguardando').length,
    aprovados: filteredOrcamentos.filter((o: Orcamento) => o.status_nome === 'Aprovado').length,
    valorTotal: filteredOrcamentos.reduce((sum: number, o: Orcamento) => sum + (Number(o.valor_total) || 0), 0),
  };

  // Handlers
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteOrcamento.mutate(deleteId);
      setDeleteId(null);
      refetch();
      notifications.success('Sucesso', 'Orçamento excluído com sucesso.');
    } catch (err) {
      console.error('Erro ao excluir:', err);
      notifications.error('Erro', 'Não foi possível excluir o orçamento.');
    }
  };

  const handleView = (orcamento: Orcamento) => {
    setSelectedOrcamento(orcamento);
    setIsViewOpen(true);
  };

  const handleEdit = (orcamento: Orcamento) => {
    setSelectedOrcamento(orcamento);
    setFormData({
      origem: 'cliente',
      leadId: '',
      clienteId: '',
      empresa: orcamento.cliente_nome || orcamento.lead_nome || '',
      cnpj: orcamento.cliente?.cnpj || '',
      contato: '',
      telefone: orcamento.cliente?.telefone_financeiro || orcamento.lead?.telefone_contato || '',
      email: orcamento.cliente?.email_financeiro || orcamento.lead?.email_contato || '',
      vendedor: orcamento.vendedor || '',
      filial: '',
      validade: orcamento.validade_dias,
      itens: orcamento.itens?.map(item => ({
        produto: item.produto_nome || '',
        descricao: item.descricao_item || '',
        quantidade: item.quantidade,
        valorUnitario: item.valor_unitario || 0,
        descontoPercentual: item.desconto_percentual || 0,
        descontoValor: item.desconto_valor || 0
      })) || [],
      descontoGeral: 0,
      parcelas: 1,
      observacoes: orcamento.observacoes || ''
    });
    setIsEditOpen(true);
  };

  const handleGenerateDocument = (orcamento: Orcamento) => {
    setSelectedOrcamento(orcamento);
    setIsDocOpen(true);
  };

  const handleStatusChange = async (orcamento: Orcamento, newStatus: string) => {
    const statusId = newStatus === 'Aprovado' ? 18 : (newStatus === 'Aguardando' ? 17 : 19);
    try {
      await updateOrcamento.mutate(orcamento.id, { id_status: statusId });
      refetch();
      notifications.success('Sucesso', 'Status atualizado com sucesso.');
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      notifications.error('Erro', 'Não foi possível atualizar o status.');
    }
  };

  const handleSendEmail = async (orcamento: Orcamento) => {
    const email = orcamento.cliente?.email_financeiro || orcamento.lead?.email_contato;
    if (!email) {
      notifications.error('Erro', 'Email não disponível.');
      return;
    }
    setIsSendingEmail(true);
    try {
      const text = `Olá! Segue o orçamento #${orcamento.numero_orcamento}.\n\nCliente: ${orcamento.cliente_nome || orcamento.lead_nome}\nValor: R$ ${orcamento.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\nValidade: ${orcamento.validade_dias} dias`;
      const subject = encodeURIComponent(`Orçamento #${orcamento.numero_orcamento} - Webside Sistemas`);
      const body = encodeURIComponent(text);
      window.open(`mailto:${email}?subject=${subject}&body=${body}`);
      notifications.success('Sucesso', 'Email aberto.');
    } catch (err) {
      notifications.error('Erro', 'Não foi possível abrir o email.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleSendWhatsApp = async (orcamento: Orcamento) => {
    const phone = orcamento.cliente?.telefone_whatsapp || orcamento.cliente?.telefone_financeiro || orcamento.lead?.telefone_contato;
    if (!phone) {
      notifications.error('Erro', 'Telefone não disponível.');
      return;
    }
    setIsSendingWhatsApp(true);
    try {
      const phoneNumber = phone.replace(/\D/g, '');
      const text = `Olá! Segue o orçamento #${orcamento.numero_orcamento}.\n\nCliente: ${orcamento.cliente_nome || orcamento.lead_nome}\nValor: R$ ${orcamento.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\nValidade: ${orcamento.validade_dias} dias`;
      const message = encodeURIComponent(text);
      window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
      notifications.success('Sucesso', 'WhatsApp aberto.');
    } catch (err) {
      notifications.error('Erro', 'Não foi possível abrir o WhatsApp.');
    } finally {
      setIsSendingWhatsApp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editData) {
        await updateOrcamento.mutate(editData.id, formData);
        notifications.success('Sucesso', 'Orçamento atualizado com sucesso.');
        setIsEditOpen(false);
      } else {
        await createOrcamento.mutate(formData);
        notifications.success('Sucesso', 'Orçamento criado com sucesso.');
        setIsDialogOpen(false);
      }
      refetch();
      setFormData(createEmptyOrcamentoForm());
    } catch (err) {
      console.error('Erro ao salvar:', err);
      notifications.error('Erro', 'Não foi possível salvar o orçamento.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <AdminLayout title="Orçamentos">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <AdminLayout title="Orçamentos">
        <div className="text-center py-8">
          <p className="text-red-500">Erro: {error.message}</p>
          <Button onClick={() => refetch()} className="mt-4">Tentar novamente</Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Orçamentos">
      <div className="space-y-6">
        <PageHeader 
          title="Orçamentos"
          description="Gerencie propostas comerciais"
          icon={FileText}
          action={
            <Button onClick={() => { setFormData(createEmptyOrcamentoForm()); setIsDialogOpen(true); }} className="bg-accent hover:bg-accent/90">
              <Plus className="h-4 w-4 mr-2" />Novo Orçamento
            </Button>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <StatsCard
            title="Total de Orçamentos"
            value={stats.total}
            icon={FileText}
            color="default"
          />
          <StatsCard
            title="Aguardando"
            value={stats.aguardando}
            icon={Clock}
            color="orange"
          />
          <StatsCard
            title="Aprovados"
            value={stats.aprovados}
            icon={CheckCircle}
            color="green"
          />
          <StatsCard
            title="Valor Total"
            value={`R$ ${stats.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            icon={Receipt}
            color="purple"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <SearchBar 
            value={search} 
            onChange={setSearch} 
            placeholder="Buscar orçamentos por cliente ou número..." 
          />
        </div>

        <div className="rounded-2xl border bg-card">
          {filteredOrcamentos.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="Nenhum orçamento encontrado"
              description={search ? "Tente buscar com outros termos" : "Comece criando seu primeiro orçamento"}
              action={
                <Button onClick={() => { setFormData(createEmptyOrcamentoForm()); setIsDialogOpen(true); }} className="bg-accent">
                  <Plus className="h-4 w-4 mr-2" />Novo Orçamento
                </Button>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Validade</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrcamentos.map((orcamento: Orcamento) => (
                  <TableRow key={orcamento.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">{orcamento.numero_orcamento}</TableCell>
                    <TableCell>{orcamento.cliente_nome || orcamento.lead_nome || '-'}</TableCell>
                    <TableCell className="font-medium">
                      R$ {Number(orcamento.valor_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      <Badge className={orcamento.status_nome === 'Aprovado' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                        {orcamento.status_nome || 'Aguardando'}
                      </Badge>
                    </TableCell>
                    <TableCell>{orcamento.validade_dias} dias</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(orcamento)}>
                            <Eye className="h-4 w-4 mr-2" />Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(orcamento)}>
                            <Edit className="h-4 w-4 mr-2" />Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleGenerateDocument(orcamento)}>
                            <FileDown className="h-4 w-4 mr-2" />Gerar Documento
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSendEmail(orcamento)}>
                            <Mail className="h-4 w-4 mr-2" />Enviar Email
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSendWhatsApp(orcamento)}>
                            <Phone className="h-4 w-4 mr-2" />Enviar WhatsApp
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setDeleteId(orcamento.id)} 
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />Excluir
                          </DropdownMenuItem>
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
        <OrcamentoFormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          isEditMode={false}
          formData={formData}
          onSubmit={handleSubmit}
          onFormDataChange={setFormData}
          isLoading={isSubmitting}
          clientes={clientesData || []}
          leads={leadsData || []}
          produtos={produtosData || []}
        />

        {/* Edit Dialog */}
        <OrcamentoFormDialog
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          isEditMode={true}
          formData={formData}
          onSubmit={handleSubmit}
          onFormDataChange={setFormData}
          isLoading={isSubmitting}
          clientes={clientesData || []}
          leads={leadsData || []}
          produtos={produtosData || []}
        />

        {/* View Dialog */}
        <OrcamentoViewDialog
          open={isViewOpen}
          onOpenChange={setIsViewOpen}
          orcamento={selectedOrcamento}
          onEdit={handleEdit}
          onGenerateDocument={handleGenerateDocument}
          onSendEmail={handleSendEmail}
          onSendWhatsApp={handleSendWhatsApp}
          isLoadingEmail={isSendingEmail}
          isLoadingWhatsApp={isSendingWhatsApp}
        />

        {/* Document Dialog */}
        <OrcamentoDocumentDialog
          open={isDocOpen}
          onOpenChange={setIsDocOpen}
          orcamento={selectedOrcamento}
          pdfNotes={pdfNotes}
          onPdfNotesChange={setPdfNotes}
        />

        {/* Delete Dialog */}
        <AlertDialog open={deleteId !== null} onOpenChange={open => !open && setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este orçamento? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction className="bg-red-600" onClick={handleDelete}>
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default Orcamentos;

