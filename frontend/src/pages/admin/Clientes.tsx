import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Loader2, MoreHorizontal, Eye, Edit, Trash2, Building2, UserCheck, UserX } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PageHeader, StatsCard, EmptyState, SearchBar } from '@/components/ui';
import { useClientes, useCreateCliente, useUpdateCliente, useDeleteCliente } from '@/hooks/useClientes';
import { Cliente } from '@/types/cliente';
import ClienteViewDialog from '@/components/clientes/ClienteViewDialog';
import ClienteFormDialog from '@/components/clientes/ClienteFormDialog';

const statusColors: Record<string, string> = {
  'Ativo': 'bg-green-100 text-green-800',
  'Inativo': 'bg-gray-100 text-gray-800',
};

const Clientes: React.FC = () => {
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [editData, setEditData] = useState<Cliente | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: clientes, loading, error, refetch } = useClientes();
  const createCliente = useCreateCliente();
  const updateCliente = useUpdateCliente();
  const deleteCliente = useDeleteCliente();

  const filteredClientes = (clientes || []).filter((c: Cliente) =>
    (c.razao_social?.toLowerCase().includes(search.toLowerCase())) ||
    (c.nome_fantasia?.toLowerCase().includes(search.toLowerCase())) ||
    (c.cnpj?.toLowerCase().includes(search.toLowerCase()))
  );

  const stats = {
    total: filteredClientes.length,
    ativos: filteredClientes.filter((c: Cliente) => c.ativo).length,
    inativos: filteredClientes.filter((c: Cliente) => !c.ativo).length,
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteCliente.mutate(deleteId);
      setDeleteId(null);
      refetch();
    } catch (err) {
      console.error('Erro ao excluir:', err);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Clientes">
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Clientes">
        <div className="text-center py-8">
          <p className="text-red-500">Erro: {error.message}</p>
          <Button onClick={refetch} className="mt-4">Tentar novamente</Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Clientes">
      <div className="space-y-6">
        <PageHeader 
          title="Clientes"
          description="Gerencie sua base de clientes"
          icon={Building2}
          action={
            <Button onClick={() => setIsDialogOpen(true)} className="bg-accent hover:bg-accent/90">
              <Plus className="h-4 w-4 mr-2" />Novo Cliente
            </Button>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard
            title="Total de Clientes"
            value={stats.total}
            icon={Building2}
            color="default"
          />
          <StatsCard
            title="Clientes Ativos"
            value={stats.ativos}
            icon={UserCheck}
            color="green"
          />
          <StatsCard
            title="Clientes Inativos"
            value={stats.inativos}
            icon={UserX}
            color="orange"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <SearchBar 
            value={search} 
            onChange={setSearch} 
            placeholder="Buscar por razão social, nome fantasia ou CNPJ..." 
          />
        </div>

        <div className="rounded-2xl border bg-card">
          {filteredClientes.length === 0 ? (
            <EmptyState
              icon={Building2}
              title="Nenhum cliente encontrado"
              description={search ? "Tente buscar com outros termos" : "Comece adicionando seu primeiro cliente"}
              action={
                <Button onClick={() => setIsDialogOpen(true)} className="bg-accent">
                  <Plus className="h-4 w-4 mr-2" />Novo Cliente
                </Button>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Razão Social</TableHead>
                  <TableHead>Nome Fantasia</TableHead>
                  <TableHead>CNPJ</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClientes.map((cliente: Cliente) => (
                  <TableRow key={cliente.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">{cliente.razao_social}</TableCell>
                    <TableCell>{cliente.nome_fantasia || '-'}</TableCell>
                    <TableCell className="font-mono text-sm">{cliente.cnpj}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[cliente.ativo ? 'Ativo' : 'Inativo'] || 'bg-gray-100'}>
                        {cliente.ativo ? 'Ativo' : 'Inativo'}
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
                          <DropdownMenuItem onClick={() => { setSelectedCliente(cliente); setIsViewOpen(true); }}>
                            <Eye className="h-4 w-4 mr-2" />Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setEditData(cliente); setIsEditOpen(true); }}>
                            <Edit className="h-4 w-4 mr-2" />Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setDeleteId(cliente.id)} 
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
        <ClienteFormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={async (data) => {
            try {
              await createCliente.mutate(data);
              setIsDialogOpen(false);
              refetch();
            } catch (err) {
              console.error('Erro ao criar:', err);
            }
          }}
          isLoading={createCliente.loading}
        />

        {/* View Dialog */}
        <ClienteViewDialog
          open={isViewOpen}
          onOpenChange={setIsViewOpen}
          cliente={selectedCliente}
          onEdit={(cliente) => {
            setEditData(cliente);
            setIsViewOpen(false);
            setIsEditOpen(true);
          }}
        />

        {/* Edit Dialog */}
        <ClienteFormDialog
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          editCliente={editData ? {
            razao_social: editData.razao_social,
            nome_fantasia: editData.nome_fantasia || '',
            cnpj: editData.cnpj,
            inscricao_estadual: editData.inscricao_estadual || '',
            porte_empresa: editData.porte_empresa || 'ME',
            data_fundacao: editData.data_fundacao || ''
          } as any : null}
          onSubmit={async (data) => {

            if (!editData) return;
            try {
              await updateCliente.mutate(editData.id, {
                razao_social: data.razao_social,
                nome_fantasia: data.nome_fantasia,
                cnpj: data.cnpj,
                inscricao_estadual: data.inscricao_estadual,
                porte_empresa: data.porte_empresa,
                data_fundacao: data.data_fundacao || null
              });
              setIsEditOpen(false);
              refetch();
            } catch (err) {
              console.error('Erro ao atualizar:', err);
            }
          }}
          isLoading={updateCliente.loading}
        />

        {/* Delete Dialog */}
        <AlertDialog open={deleteId !== null} onOpenChange={open => !open && setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
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

export default Clientes;
