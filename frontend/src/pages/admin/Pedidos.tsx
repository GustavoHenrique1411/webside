import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Loader2, MoreHorizontal, Eye, Edit, Trash2, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PageHeader, StatsCard, EmptyState, SearchBar } from '@/components/ui';
import { PedidoFormDialog, PedidoViewDialog, PedidosStats } from '@/components/pedidos';
import { usePedidos, useCreatePedido, useUpdatePedido, useDeletePedido } from '@/hooks/useGraphQL';
import { useToast } from '@/hooks/use-toast';

const statusColors: Record<string, string> = {
  'Aguardando': 'bg-yellow-100 text-yellow-800',
  'Em Produção': 'bg-blue-100 text-blue-800',
  'Em Trânsito': 'bg-purple-100 text-purple-800',
  'Entregue': 'bg-green-100 text-green-800',
};

const Pedidos: React.FC = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: pedidos, loading, refetch } = usePedidos();
  const createPedido = useCreatePedido();
  const updatePedido = useUpdatePedido();
  const deletePedido = useDeletePedido();

  const filteredPedidos = (pedidos || []).filter((p: any) =>
    (p.numero_pedido?.toLowerCase().includes(search.toLowerCase())) ||
    (p.cliente_nome?.toLowerCase().includes(search.toLowerCase()))
  );

  const stats = {
    total: (pedidos || []).length,
    emProducao: (pedidos || []).filter((p: any) => p.status_nome === 'Em Produção').length,
    emTransito: (pedidos || []).filter((p: any) => p.status_nome === 'Em Trânsito').length,
    entregues: (pedidos || []).filter((p: any) => p.status_nome === 'Entregue').length
  };

  const formatCurrency = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  const handleCreate = async (formData: any) => {
    try {
      await createPedido.mutate({
        id_cliente: parseInt(formData.cliente_id) || 1,
        data_pedido: formData.data_pedido,
        valor_total: formData.valor_total,
        id_status: parseInt(formData.status_id),
        numero_pedido: formData.numero_pedido,
        data_entrega: formData.data_entrega,
        observacoes: formData.observacoes
      });
      setIsFormOpen(false);
      refetch();
      toast({ title: "Sucesso", description: "Pedido criado com sucesso" });
    } catch {
      toast({ title: "Erro", description: "Erro ao criar pedido", variant: "destructive" });
    }
  };

  const handleUpdate = async (formData: any) => {
    if (!selectedPedido) return;
    try {
      await updatePedido.mutate(selectedPedido.id, {
        id_cliente: parseInt(formData.cliente_id),
        data_pedido: formData.data_pedido,
        valor_total: formData.valor_total,
        id_status: parseInt(formData.status_id),
        numero_pedido: formData.numero_pedido,
        data_entrega: formData.data_entrega,
        observacoes: formData.observacoes
      });
      setIsFormOpen(false);
      setSelectedPedido(null);
      refetch();
      toast({ title: "Sucesso", description: "Pedido atualizado com sucesso" });
    } catch {
      toast({ title: "Erro", description: "Erro ao atualizar pedido", variant: "destructive" });
    }
  };

  const handleStatusChange = async (pedido: any, status: string) => {
    const statusMap: Record<string, number> = { 'Aguardando': 1, 'Em Produção': 2, 'Em Trânsito': 3, 'Entregue': 4 };
    try {
      await updatePedido.mutate(pedido.id, { id_status: statusMap[status] });
      refetch();
      toast({ title: "Sucesso", description: `Status atualizado para ${status}` });
    } catch {
      toast({ title: "Erro", description: "Erro ao atualizar status", variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deletePedido.mutate(deleteId);
      setDeleteId(null);
      refetch();
      toast({ title: "Sucesso", description: "Pedido excluído com sucesso" });
    } catch {
      toast({ title: "Erro", description: "Erro ao excluir pedido", variant: "destructive" });
    }
  };

  const handleEdit = (pedido: any) => {
    setSelectedPedido(pedido);
    setIsFormOpen(true);
  };

  const handleView = (pedido: any) => {
    setSelectedPedido(pedido);
    setIsViewOpen(true);
  };

  const handleNew = () => {
    setSelectedPedido(null);
    setIsFormOpen(true);
  };

  if (loading) return (
    <AdminLayout title="Pedidos">
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout title="Pedidos">
      <div className="space-y-6">
        <PageHeader 
          title="Pedidos"
          description="Gerencie os pedidos de venda"
          icon={Package}
          action={
            <Button onClick={handleNew} className="bg-accent hover:bg-accent/90">
              <Plus className="h-4 w-4 mr-2" />Novo Pedido
            </Button>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total de Pedidos"
            value={stats.total}
            icon={Package}
            color="default"
          />
          <StatsCard
            title="Em Produção"
            value={stats.emProducao}
            icon={Clock}
            color="blue"
          />
          <StatsCard
            title="Em Trânsito"
            value={stats.emTransito}
            icon={Truck}
            color="purple"
          />
          <StatsCard
            title="Entregues"
            value={stats.entregues}
            icon={CheckCircle}
            color="green"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <SearchBar 
            value={search} 
            onChange={setSearch} 
            placeholder="Buscar por número ou cliente..." 
          />
        </div>

        <div className="rounded-2xl border bg-card">
          {filteredPedidos.length === 0 ? (
            <EmptyState
              icon={Package}
              title="Nenhum pedido encontrado"
              description={search ? "Tente buscar com outros termos" : "Comece criando seu primeiro pedido"}
              action={
                <Button onClick={handleNew} className="bg-accent">
                  <Plus className="h-4 w-4 mr-2" />Novo Pedido
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
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPedidos.map((ped: any) => (
                  <TableRow key={ped.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-mono text-sm">{ped.numero_pedido}</TableCell>
                    <TableCell>{ped.cliente_nome || 'N/A'}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(ped.valor_total)}</TableCell>
                    <TableCell>{new Date(ped.data_pedido).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[ped.status_nome] || 'bg-gray-100'}>
                        {ped.status_nome || 'Aguardando'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(ped)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(ped)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Mudar status</DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                              {Object.keys(statusColors).map(status => (
                                <DropdownMenuItem
                                  key={status}
                                  onClick={() => handleStatusChange(ped, status)}
                                >
                                  <Badge className={statusColors[status]}>{status}</Badge>
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                          <DropdownMenuItem
                            onClick={() => setDeleteId(ped.id)}
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
          )}
        </div>

        {/* Form Dialog */}
        <PedidoFormDialog
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSubmit={selectedPedido ? handleUpdate : handleCreate}
          pedido={selectedPedido}
          loading={createPedido.loading || updatePedido.loading}
        />

        {/* View Dialog */}
        <PedidoViewDialog
          open={isViewOpen}
          onOpenChange={setIsViewOpen}
          pedido={selectedPedido}
          onEdit={handleEdit}
        />

        {/* Delete Dialog */}
        <AlertDialog open={deleteId !== null} onOpenChange={open => !open && setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este pedido? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeleteId(null)}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={handleDelete}
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default Pedidos;
