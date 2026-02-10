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
import { Plus, Search, Package, Truck, MoreHorizontal, FileText, User, Building2, Phone, Mail, Calendar, Eye, Edit, Trash2, Loader2 } from 'lucide-react';
import { apiService } from '@/lib/api';



const statusColors: Record<string, string> = {
  'Aguardando': 'bg-yellow-100 text-yellow-800',
  'Em Produção': 'bg-blue-100 text-blue-800',
  'Em Trânsito': 'bg-purple-100 text-purple-800',
  'Entregue': 'bg-green-100 text-green-800',
};

interface Pedido {
  id_pedido: number;
  numero_pedido: string;
  id_orcamento?: number;
  id_cliente?: number;
  id_colaborador?: number;
  id_empresa?: number;
  data_pedido: string;
  valor_total: number;
  data_prevista_entrega?: string;
  observacoes?: string;
  id_status: number;
  data_criacao: string;
  cliente?: string;
  status?: string;
}

const Pedidos: React.FC = () => {
  const [search, setSearch] = useState('');
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPedido, setNewPedido] = useState({
    origem: 'orcamento', // 'orcamento' or 'cliente'
    orcamentoId: '',
    clienteId: '',
    // Company data
    empresa: '',
    cnpj: '',
    contato: '',
    telefone: '',
    email: '',
    // Order details
    vendedor: '',
    filial: '',
    dataEntrega: '',
    // Items
    itens: [{ produto: '', descricao: '', quantidade: 1, valorUnitario: 0 }],
    // Notes
    observacoes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [viewingPedido, setViewingPedido] = useState<Pedido | null>(null);
  const [deletePedidoId, setDeletePedidoId] = useState<number | null>(null);

  // Fetch pedidos on component mount
  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getPedidos() as Pedido[];
      setPedidos(data);
    } catch (error) {
      console.error('Error fetching pedidos:', error);
      alert('Erro ao carregar pedidos. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPedidos = pedidos.filter(ped =>
    (ped.numero_pedido && ped.numero_pedido.toLowerCase().includes(search.toLowerCase())) ||
    (ped.cliente && ped.cliente.toLowerCase().includes(search.toLowerCase()))
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const totalValue = newPedido.itens.reduce((sum, item) => sum + (item.quantidade * item.valorUnitario), 0);
      const pedidoData = {
        numero_pedido: `PED-${String(pedidos.length + 1).padStart(3, '0')}`,
        id_cliente: newPedido.clienteId ? parseInt(newPedido.clienteId) : null,
        id_orcamento: newPedido.orcamentoId ? parseInt(newPedido.orcamentoId) : null,
        valor_total: totalValue,
        data_prevista_entrega: newPedido.dataEntrega || null,
        observacoes: newPedido.observacoes || null,
        id_status: 1, // Default to "Aguardando"
        data_pedido: new Date().toISOString().split('T')[0],
        data_criacao: new Date().toISOString()
      };

      await apiService.createPedido(pedidoData);
      await fetchPedidos(); // Refresh the list

      setNewPedido({
        origem: 'orcamento',
        orcamentoId: '',
        clienteId: '',
        empresa: '',
        cnpj: '',
        contato: '',
        telefone: '',
        email: '',
        vendedor: '',
        filial: '',
        dataEntrega: '',
        itens: [{ produto: '', descricao: '', quantidade: 1, valorUnitario: 0 }],
        observacoes: ''
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating pedido:', error);
      alert('Erro ao criar pedido. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (pedido: Pedido, newStatus: string) => {
    try {
      // Map status names to IDs (this should be fetched from the status API)
      const statusMap: Record<string, number> = {
        'Aguardando': 1,
        'Em Produção': 2,
        'Em Trânsito': 3,
        'Entregue': 4
      };

      await apiService.updatePedido(pedido.id_pedido, {
        ...pedido,
        id_status: statusMap[newStatus] || pedido.id_status
      });
      await fetchPedidos(); // Refresh the list
    } catch (error) {
      console.error('Error updating pedido status:', error);
      alert('Erro ao atualizar status. Tente novamente.');
    }
  };

  const handleDeletePedido = async (pedidoId: number) => {
    if (!confirm('Tem certeza que deseja excluir este pedido?')) return;

    setIsDeleting(true);
    try {
      await apiService.deletePedido(pedidoId);
      await fetchPedidos(); // Refresh the list
    } catch (error) {
      console.error('Error deleting pedido:', error);
      alert('Erro ao excluir pedido. Tente novamente.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewPedido = (pedido: Pedido) => {
    setViewingPedido(pedido);
    setIsViewDialogOpen(true);
  };

  const handleEditPedido = (pedido: Pedido) => {
    setViewingPedido(pedido);
    setNewPedido({
      origem: pedido.id_orcamento ? 'orcamento' : 'cliente',
      orcamentoId: pedido.id_orcamento?.toString() || '',
      clienteId: pedido.id_cliente?.toString() || '',
      empresa: '',
      cnpj: '',
      contato: '',
      telefone: '',
      email: '',
      vendedor: '',
      filial: '',
      dataEntrega: pedido.data_prevista_entrega || '',
      itens: [{ produto: '', descricao: '', quantidade: 1, valorUnitario: 0 }],
      observacoes: pedido.observacoes || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewingPedido) return;

    setIsSubmitting(true);
    try {
      const totalValue = newPedido.itens.reduce((sum, item) => sum + (item.quantidade * item.valorUnitario), 0);
      const pedidoData = {
        ...viewingPedido,
        id_cliente: newPedido.clienteId ? parseInt(newPedido.clienteId) : null,
        id_orcamento: newPedido.orcamentoId ? parseInt(newPedido.orcamentoId) : null,
        valor_total: totalValue,
        data_prevista_entrega: newPedido.dataEntrega || null,
        observacoes: newPedido.observacoes || null
      };

      await apiService.updatePedido(viewingPedido.id_pedido, pedidoData);
      await fetchPedidos(); // Refresh the list
      setIsEditDialogOpen(false);
      setViewingPedido(null);
    } catch (error) {
      console.error('Error updating pedido:', error);
      alert('Erro ao atualizar pedido. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletePedidoId !== null) {
      handleDeletePedido(deletePedidoId);
    }
  };

  return (
    <AdminLayout title="Pedidos">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Pedidos</h1>
            <p className="text-muted-foreground">Acompanhe os pedidos de venda</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Novo Pedido
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Criar Novo Pedido
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Origem */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Origem do Pedido</Label>
                  <Select value={newPedido.origem} onValueChange={(value) => setNewPedido({ ...newPedido, origem: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a origem" />
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={5}>
                      <SelectItem value="orcamento">Orçamento</SelectItem>
                      <SelectItem value="cliente">Cliente Existente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Company Data */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Dados da Empresa</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="empresa" className="text-sm font-medium">
                        Empresa *
                      </Label>
                      <div className="relative">
                        <Input
                          id="empresa"
                          placeholder="Nome da empresa"
                          value={newPedido.empresa}
                          onChange={(e) => setNewPedido({ ...newPedido, empresa: e.target.value })}
                          className="pl-10"
                          required
                        />
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cnpj" className="text-sm font-medium">
                        CNPJ
                      </Label>
                      <Input
                        id="cnpj"
                        placeholder="00.000.000/0000-00"
                        value={newPedido.cnpj}
                        onChange={(e) => setNewPedido({ ...newPedido, cnpj: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contato" className="text-sm font-medium">
                        Contato
                      </Label>
                      <div className="relative">
                        <Input
                          id="contato"
                          placeholder="Nome do contato"
                          value={newPedido.contato}
                          onChange={(e) => setNewPedido({ ...newPedido, contato: e.target.value })}
                          className="pl-10"
                        />
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefone" className="text-sm font-medium">
                        Telefone
                      </Label>
                      <div className="relative">
                        <Input
                          id="telefone"
                          placeholder="(11) 99999-9999"
                          value={newPedido.telefone}
                          onChange={(e) => setNewPedido({ ...newPedido, telefone: e.target.value })}
                          className="pl-10"
                        />
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email
                      </Label>
                      <div className="relative">
                        <Input
                          id="email"
                          type="email"
                          placeholder="contato@empresa.com"
                          value={newPedido.email}
                          onChange={(e) => setNewPedido({ ...newPedido, email: e.target.value })}
                          className="pl-10"
                        />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Detalhes do Pedido</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vendedor" className="text-sm font-medium">
                        Vendedor *
                      </Label>
                      <Input
                        id="vendedor"
                        placeholder="Nome do vendedor"
                        value={newPedido.vendedor}
                        onChange={(e) => setNewPedido({ ...newPedido, vendedor: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="filial" className="text-sm font-medium">
                        Filial
                      </Label>
                      <Input
                        id="filial"
                        placeholder="Filial responsável"
                        value={newPedido.filial}
                        onChange={(e) => setNewPedido({ ...newPedido, filial: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dataEntrega" className="text-sm font-medium">
                        Data de Entrega
                      </Label>
                      <div className="relative">
                        <Input
                          id="dataEntrega"
                          type="date"
                          value={newPedido.dataEntrega}
                          onChange={(e) => setNewPedido({ ...newPedido, dataEntrega: e.target.value })}
                          className="pl-10"
                        />
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Itens do Pedido</h3>
                  {newPedido.itens.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Produto/Serviço *</Label>
                          <Input
                            placeholder="Nome do produto/serviço"
                            value={item.produto}
                            onChange={(e) => {
                              const newItens = [...newPedido.itens];
                              newItens[index].produto = e.target.value;
                              setNewPedido({ ...newPedido, itens: newItens });
                            }}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Descrição</Label>
                          <Input
                            placeholder="Descrição detalhada"
                            value={item.descricao}
                            onChange={(e) => {
                              const newItens = [...newPedido.itens];
                              newItens[index].descricao = e.target.value;
                              setNewPedido({ ...newPedido, itens: newItens });
                            }}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Quantidade *</Label>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantidade}
                            onChange={(e) => {
                              const newItens = [...newPedido.itens];
                              newItens[index].quantidade = parseInt(e.target.value) || 1;
                              setNewPedido({ ...newPedido, itens: newItens });
                            }}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Valor Unitário *</Label>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0,00"
                            value={item.valorUnitario}
                            onChange={(e) => {
                              const newItens = [...newPedido.itens];
                              newItens[index].valorUnitario = parseFloat(e.target.value) || 0;
                              setNewPedido({ ...newPedido, itens: newItens });
                            }}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setNewPedido({
                      ...newPedido,
                      itens: [...newPedido.itens, { produto: '', descricao: '', quantidade: 1, valorUnitario: 0 }]
                    })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Item
                  </Button>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="observacoes" className="text-sm font-medium">
                    Observações
                  </Label>
                  <Input
                    id="observacoes"
                    placeholder="Observações adicionais"
                    value={newPedido.observacoes}
                    onChange={(e) => setNewPedido({ ...newPedido, observacoes: e.target.value })}
                  />
                </div>

                <DialogFooter className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-accent hover:bg-accent/90">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Criando...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Criar Pedido
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* View Dialog */}
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Detalhes do Pedido
                </DialogTitle>
              </DialogHeader>
              {viewingPedido && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Número do Pedido</Label>
                      <p className="font-mono text-sm">{viewingPedido.numero_pedido}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Cliente</Label>
                      <p>{viewingPedido.cliente || 'Cliente não informado'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Valor Total</Label>
                      <p className="font-semibold">{formatCurrency(viewingPedido.valor_total)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <Badge className={statusColors[viewingPedido.status || 'Aguardando']}>
                        {viewingPedido.status || 'Aguardando'}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Data do Pedido</Label>
                      <p>{new Date(viewingPedido.data_pedido).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Previsão de Entrega</Label>
                      <p>{viewingPedido.data_prevista_entrega ? new Date(viewingPedido.data_prevista_entrega).toLocaleDateString('pt-BR') : 'Não definida'}</p>
                    </div>
                  </div>
                  {viewingPedido.observacoes && (
                    <div>
                      <Label className="text-sm font-medium">Observações</Label>
                      <p className="text-sm text-muted-foreground">{viewingPedido.observacoes}</p>
                    </div>
                  )}
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Fechar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Editar Pedido
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEditSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-origem" className="text-sm font-medium">Origem do Pedido</Label>
                      <Select value={newPedido.origem} onValueChange={(value) => setNewPedido({ ...newPedido, origem: value })}>
                        <SelectTrigger id="edit-origem">
                          <SelectValue placeholder="Selecione a origem" />
                        </SelectTrigger>
                        <SelectContent position="popper" sideOffset={5}>
                          <SelectItem value="orcamento">Orçamento</SelectItem>
                          <SelectItem value="cliente">Cliente Existente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-dataEntrega" className="text-sm font-medium">Data de Entrega</Label>
                      <div className="relative">
                        <Input
                          id="edit-dataEntrega"
                          type="date"
                          value={newPedido.dataEntrega}
                          onChange={(e) => setNewPedido({ ...newPedido, dataEntrega: e.target.value })}
                          className="pl-10"
                        />
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-observacoes" className="text-sm font-medium">Observações</Label>
                    <Input
                      id="edit-observacoes"
                      placeholder="Observações adicionais"
                      value={newPedido.observacoes}
                      onChange={(e) => setNewPedido({ ...newPedido, observacoes: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-accent hover:bg-accent/90">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Salvar Alterações
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
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

        {/* Pedidos Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Previsão</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[70px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                      Carregando pedidos...
                    </TableCell>
                  </TableRow>
                ) : filteredPedidos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Nenhum pedido encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPedidos.map((ped) => (
                    <TableRow key={ped.id_pedido}>
                      <TableCell className="font-mono text-sm">{ped.numero_pedido}</TableCell>
                      <TableCell className="font-medium">{ped.cliente || 'Cliente não informado'}</TableCell>
                      <TableCell>{formatCurrency(ped.valor_total)}</TableCell>
                      <TableCell>{new Date(ped.data_pedido).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>{ped.data_prevista_entrega ? new Date(ped.data_prevista_entrega).toLocaleDateString('pt-BR') : 'Não definida'}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[ped.status || 'Aguardando']}>{ped.status || 'Aguardando'}</Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewPedido(ped)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditPedido(ped)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>
                                <Package className="h-4 w-4 mr-2" />
                                Alterar Status
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent>
                                {Object.keys(statusColors).map((status) => (
                                  <DropdownMenuItem
                                    key={status}
                                    onClick={() => handleStatusChange(ped, status)}
                                    disabled={ped.status === status}
                                  >
                                    <Badge className={`${statusColors[status]} mr-2`}>{status}</Badge>
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            <DropdownMenuItem
                              onClick={() => handleDeletePedido(ped.id_pedido)}
                              disabled={isDeleting}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Pedidos;