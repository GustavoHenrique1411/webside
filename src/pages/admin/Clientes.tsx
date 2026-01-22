import React, { useState, useEffect } from 'react';
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
import { Plus, Search, Building2, Phone, Mail, MapPin, MoreHorizontal, Eye, Edit, Trash2, User, Calendar, FileText, Loader2 } from 'lucide-react';
import { apiService } from '@/lib/api';

interface Cliente {
  id_cliente: number;
  id_empresa: number;
  id_lead?: number;
  id_colaborador: number;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  inscricao_estadual?: string;
  data_fundacao?: string;
  porte_empresa: string;
  id_status: number;
  data_cadastro: string;
  data_status: string;
  ativo: boolean;
  status?: string;
}

const statusColors: Record<string, string> = {
  'Ativo': 'bg-green-100 text-green-800',
  'Inativo': 'bg-gray-100 text-gray-800',
};

const Clientes: React.FC = () => {
  const [search, setSearch] = useState('');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [newCliente, setNewCliente] = useState({
    razao_social: '',
    nome_fantasia: '',
    cnpj: '',
    inscricao_estadual: '',
    porte_empresa: 'ME',
    data_fundacao: ''
  });
  const [editCliente, setEditCliente] = useState<Cliente | null>(null);
  const [deleteClienteId, setDeleteClienteId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      setLoading(true);
      const data = await apiService.getClientes();
      setClientes(data as Cliente[]);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      alert('Erro ao carregar clientes. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.razao_social.toLowerCase().includes(search.toLowerCase()) ||
    cliente.nome_fantasia.toLowerCase().includes(search.toLowerCase()) ||
    cliente.cnpj.includes(search)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Basic validation
      if (!newCliente.razao_social.trim() || !newCliente.cnpj.trim()) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      }

      await apiService.createCliente(newCliente);
      loadClientes();
      setNewCliente({
        razao_social: '',
        nome_fantasia: '',
        cnpj: '',
        inscricao_estadual: '',
        porte_empresa: 'ME',
        data_fundacao: ''
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error);
      alert('Erro ao adicionar cliente. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewCliente = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setIsViewDialogOpen(true);
  };

  const handleEditCliente = (cliente: Cliente) => {
    setEditCliente(cliente);
    setIsEditDialogOpen(true);
  };

  const handleUpdateCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editCliente) {
      setIsUpdating(true);
      try {
        await apiService.updateCliente(editCliente.id_cliente, editCliente);
        loadClientes();
        setIsEditDialogOpen(false);
        setEditCliente(null);
      } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        alert('Erro ao atualizar cliente. Tente novamente.');
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleDeleteCliente = (clienteId: number) => {
    setDeleteClienteId(clienteId);
  };

  const confirmDeleteCliente = async () => {
    if (deleteClienteId !== null) {
      setIsDeleting(true);
      try {
        await apiService.deleteCliente(deleteClienteId);
        setClientes(clientes.filter(cliente => cliente.id_cliente !== deleteClienteId));
        setDeleteClienteId(null);
      } catch (error) {
        console.error('Error deleting cliente:', error);
        alert('Erro ao excluir cliente. Tente novamente.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleStatusChange = async (cliente: Cliente, newStatus: string) => {
    try {
      await apiService.updateCliente(cliente.id_cliente, { ...cliente, status: newStatus });
      loadClientes();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      alert('Erro ao alterar status. Tente novamente.');
    }
  };

  // Calculate dynamic stats
  const stats = {
    total: clientes.length,
    ativos: clientes.filter(cliente => cliente.status === 'Ativo').length,
    inativos: clientes.filter(cliente => cliente.status === 'Inativo').length,
  };

  return (
    <AdminLayout title="Clientes">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Clientes</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Gerencie sua base de clientes</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} className="bg-accent hover:bg-accent/90 text-accent-foreground w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Novo Cliente
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setNewCliente({
                razao_social: '',
                nome_fantasia: '',
                cnpj: '',
                inscricao_estadual: '',
                porte_empresa: 'ME',
                data_fundacao: ''
              });
            }
          }}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Adicionar Novo Cliente
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="razao_social" className="text-sm font-medium">
                      Razão Social *
                    </Label>
                    <div className="relative">
                      <Input
                        id="razao_social"
                        placeholder="Razão social da empresa"
                        value={newCliente.razao_social}
                        onChange={(e) => setNewCliente({ ...newCliente, razao_social: e.target.value })}
                        className="pl-10"
                        required
                      />
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nome_fantasia" className="text-sm font-medium">
                      Nome Fantasia
                    </Label>
                    <Input
                      id="nome_fantasia"
                      placeholder="Nome fantasia da empresa"
                      value={newCliente.nome_fantasia}
                      onChange={(e) => setNewCliente({ ...newCliente, nome_fantasia: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cnpj" className="text-sm font-medium">
                      CNPJ *
                    </Label>
                    <Input
                      id="cnpj"
                      placeholder="00.000.000/0000-00"
                      value={newCliente.cnpj}
                      onChange={(e) => setNewCliente({ ...newCliente, cnpj: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inscricao_estadual" className="text-sm font-medium">
                      Inscrição Estadual
                    </Label>
                    <Input
                      id="inscricao_estadual"
                      placeholder="Inscrição estadual"
                      value={newCliente.inscricao_estadual}
                      onChange={(e) => setNewCliente({ ...newCliente, inscricao_estadual: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="porte_empresa" className="text-sm font-medium">
                      Porte da Empresa *
                    </Label>
                    <Select value={newCliente.porte_empresa} onValueChange={(value) => setNewCliente({ ...newCliente, porte_empresa: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o porte" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ME">Microempresa (ME)</SelectItem>
                        <SelectItem value="EPP">Empresa de Pequeno Porte (EPP)</SelectItem>
                        <SelectItem value="MEI">Microempreendedor Individual (MEI)</SelectItem>
                        <SelectItem value="LTDA">Sociedade Limitada (LTDA)</SelectItem>
                        <SelectItem value="SA">Sociedade Anônima (SA)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="data_fundacao" className="text-sm font-medium">
                      Data de Fundação
                    </Label>
                    <div className="relative">
                      <Input
                        id="data_fundacao"
                        type="date"
                        value={newCliente.data_fundacao}
                        onChange={(e) => setNewCliente({ ...newCliente, data_fundacao: e.target.value })}
                        className="pl-10"
                      />
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
                <DialogFooter className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-accent hover:bg-accent/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Cadastrar Cliente
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="text-xl sm:text-2xl font-bold text-accent">{stats.total}</div>
              <p className="text-xs sm:text-sm text-muted-foreground">Total de Clientes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-xl sm:text-2xl font-bold text-green-600">{stats.ativos}</div>
              <p className="text-xs sm:text-sm text-muted-foreground">Ativos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-xl sm:text-2xl font-bold text-gray-600">{stats.inativos}</div>
              <p className="text-xs sm:text-sm text-muted-foreground">Inativos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-xl sm:text-2xl font-bold text-accent">+{stats.total > 0 ? Math.round((stats.ativos / stats.total) * 100) : 0}%</div>
              <p className="text-xs sm:text-sm text-muted-foreground">Taxa de Ativação</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes por razão social, nome fantasia ou CNPJ..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Clientes Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Razão Social</TableHead>
                    <TableHead className="min-w-[150px]">Nome Fantasia</TableHead>
                    <TableHead className="min-w-[140px]">CNPJ</TableHead>
                    <TableHead className="min-w-[100px]">Porte</TableHead>
                    <TableHead className="min-w-[80px]">Status</TableHead>
                    <TableHead className="w-[70px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClientes.map((cliente) => (
                    <TableRow key={cliente.id_cliente}>
                      <TableCell className="font-medium">{cliente.razao_social}</TableCell>
                      <TableCell className="font-medium">{cliente.nome_fantasia}</TableCell>
                      <TableCell className="font-mono text-sm">{cliente.cnpj}</TableCell>
                      <TableCell>{cliente.porte_empresa}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[cliente.status]}>{cliente.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewCliente(cliente)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditCliente(cliente)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>
                                <Edit className="h-4 w-4 mr-2" />
                                Alterar Status
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(cliente, 'Ativo')}
                                  disabled={cliente.status === 'Ativo'}
                                >
                                  <Badge className={statusColors['Ativo']}>Ativo</Badge>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(cliente, 'Inativo')}
                                  disabled={cliente.status === 'Inativo'}
                                >
                                  <Badge className={statusColors['Inativo']}>Inativo</Badge>
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            <DropdownMenuItem
                              onClick={() => handleDeleteCliente(cliente.id_cliente)}
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

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Detalhes do Cliente
              </DialogTitle>
            </DialogHeader>
            {selectedCliente && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Razão Social</Label>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{selectedCliente.razao_social}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Nome Fantasia</Label>
                    <div className="p-2 bg-muted rounded-md">
                      <span>{selectedCliente.nome_fantasia}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">CNPJ</Label>
                    <div className="p-2 bg-muted rounded-md">
                      <span className="font-mono text-sm">{selectedCliente.cnpj}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Porte da Empresa</Label>
                    <div className="p-2 bg-muted rounded-md">
                      <span>{selectedCliente.porte_empresa}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Inscrição Estadual</Label>
                    <div className="p-2 bg-muted rounded-md">
                      <span>{selectedCliente.inscricao_estadual || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Data de Fundação</Label>
                    <div className="p-2 bg-muted rounded-md">
                      <span>{selectedCliente.data_fundacao || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <div className="flex items-center gap-2">
                    <Badge className={statusColors[selectedCliente.status]}>{selectedCliente.status}</Badge>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                    Fechar
                  </Button>
                  <Button onClick={() => {
                    setIsViewDialogOpen(false);
                    handleEditCliente(selectedCliente);
                  }} className="bg-accent hover:bg-accent/90">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Cliente
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) {
            setEditCliente(null);
          }
        }}>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Editar Cliente
              </DialogTitle>
            </DialogHeader>
            {editCliente && (
              <form onSubmit={handleUpdateCliente} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-razao_social" className="text-sm font-medium">
                      Razão Social *
                    </Label>
                    <div className="relative">
                      <Input
                        id="edit-razao_social"
                        placeholder="Razão social da empresa"
                        value={editCliente.razao_social}
                        onChange={(e) => setEditCliente({ ...editCliente, razao_social: e.target.value })}
                        className="pl-10"
                        required
                      />
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-nome_fantasia" className="text-sm font-medium">
                      Nome Fantasia
                    </Label>
                    <Input
                      id="edit-nome_fantasia"
                      placeholder="Nome fantasia da empresa"
                      value={editCliente.nome_fantasia}
                      onChange={(e) => setEditCliente({ ...editCliente, nome_fantasia: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-cnpj" className="text-sm font-medium">
                      CNPJ *
                    </Label>
                    <Input
                      id="edit-cnpj"
                      placeholder="00.000.000/0000-00"
                      value={editCliente.cnpj}
                      onChange={(e) => setEditCliente({ ...editCliente, cnpj: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-inscricao_estadual" className="text-sm font-medium">
                      Inscrição Estadual
                    </Label>
                    <Input
                      id="edit-inscricao_estadual"
                      placeholder="Inscrição estadual"
                      value={editCliente.inscricao_estadual || ''}
                      onChange={(e) => setEditCliente({ ...editCliente, inscricao_estadual: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-porte_empresa" className="text-sm font-medium">
                      Porte da Empresa *
                    </Label>
                    <Select value={editCliente.porte_empresa} onValueChange={(value) => setEditCliente({ ...editCliente, porte_empresa: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o porte" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ME">Microempresa (ME)</SelectItem>
                        <SelectItem value="EPP">Empresa de Pequeno Porte (EPP)</SelectItem>
                        <SelectItem value="MEI">Microempreendedor Individual (MEI)</SelectItem>
                        <SelectItem value="LTDA">Sociedade Limitada (LTDA)</SelectItem>
                        <SelectItem value="SA">Sociedade Anônima (SA)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-data_fundacao" className="text-sm font-medium">
                      Data de Fundação
                    </Label>
                    <div className="relative">
                      <Input
                        id="edit-data_fundacao"
                        type="date"
                        value={editCliente.data_fundacao || ''}
                        onChange={(e) => setEditCliente({ ...editCliente, data_fundacao: e.target.value })}
                        className="pl-10"
                      />
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status" className="text-sm font-medium">
                    Status
                  </Label>
                  <Select value={editCliente.status} onValueChange={(value) => setEditCliente({ ...editCliente, status: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-accent hover:bg-accent/90" disabled={isUpdating}>
                    <Edit className="h-4 w-4 mr-2" />
                    {isUpdating ? 'Atualizando...' : 'Atualizar Cliente'}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteClienteId !== null} onOpenChange={(open) => {
          if (!open) setDeleteClienteId(null);
        }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-red-600" />
                Confirmar Exclusão
              </AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza de que deseja excluir este cliente? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteCliente}
                className="bg-red-600 hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? 'Excluindo...' : 'Excluir'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </AdminLayout>
  );
};

export default Clientes;