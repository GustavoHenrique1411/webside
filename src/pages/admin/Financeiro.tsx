// @ts-nocheck
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, Search, TrendingUp, TrendingDown, Calendar, MoreHorizontal, DollarSign, FileText, Eye, Edit, Trash2, Loader2 } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { apiService } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useTransacoes, useCreateTransacao, useUpdateTransacao, useDeleteTransacao } from '@/hooks/useGraphQL';

type Transacao = {
  id: number;
  descricao: string;
  tipo: 'entrada' | 'saida';
  valor: number;
  data: string;
  status: string;
  categoria: string;
  formaPagamento: string;
};

const statusColors: Record<string, string> = {
  'Pago': 'bg-green-100 text-green-800',
  'Pendente': 'bg-yellow-100 text-yellow-800',
  'Atrasado': 'bg-red-100 text-red-800',
};

const Financeiro: React.FC = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [filtro, setFiltro] = useState<'todos' | 'entrada' | 'saida'>('todos');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTransacao, setNewTransacao] = useState({
    tipo: 'entrada',
    valor: 0,
    data: '',
    descricao: '',
    categoria: '',
    formaPagamento: 'Boleto',
    status: 'Pendente'
  });
  const [viewTransacao, setViewTransacao] = useState<Transacao | null>(null);
  const [editTransacao, setEditTransacao] = useState<Transacao | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteTransacaoId, setDeleteTransacaoId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // GraphQL hooks
  const { data: transacoesData, loading, refetch } = useTransacoes();
  const createTransacao = useCreateTransacao();
  const updateTransacaoMutation = useUpdateTransacao();
  const deleteTransacaoMutation = useDeleteTransacao();

  // Map GraphQL data to Transacao type
  const transacoes: Transacao[] = (transacoesData || []).map((trx: any) => ({
    id: trx.id,
    descricao: trx.descricao || '',
    tipo: trx.tipo === 'entrada' ? 'entrada' : 'saida',
    valor: trx.valor || 0,
    data: trx.data_transacao || trx.data || '',
    status: trx.status_nome || 'Pendente',
    categoria: trx.categoria || '',
    formaPagamento: trx.forma_pagamento || 'Boleto'
  }));

  const filteredTransacoes = transacoes.filter(tr => {
    const matchSearch = tr.descricao.toLowerCase().includes(search.toLowerCase());
    const matchFiltro = filtro === 'todos' || tr.tipo === filtro;
    return matchSearch && matchFiltro;
  });

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const handleStatusChange = async (transacao: Transacao, newStatus: string) => {
    try {
      await updateTransacaoMutation.mutate({
        variables: {
          id: transacao.id,
          input: { status: newStatus }
        }
      });
      refetch();
      toast({
        title: "Sucesso",
        description: "Status da transação atualizado",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar status",
        variant: "destructive",
      });
    }
  };

  const handleAddTransacao = async () => {
    try {
      await createTransacao.mutate({
        variables: {
          input: {
            tipo: newTransacao.tipo,
            valor: newTransacao.valor,
            data_transacao: newTransacao.data,
            descricao: newTransacao.descricao,
            categoria: newTransacao.categoria,
            forma_pagamento: newTransacao.formaPagamento
          }
        }
      });
      setNewTransacao({
        tipo: 'entrada',
        valor: 0,
        data: '',
        descricao: '',
        categoria: '',
        formaPagamento: 'Boleto',
        status: 'Pendente'
      });
      setIsDialogOpen(false);
      refetch();
      toast({
        title: "Sucesso",
        description: "Transação criada com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar transação",
        variant: "destructive",
      });
    }
  };

  const handleViewTransacao = (transacao: Transacao) => {
    setViewTransacao(transacao);
    setIsViewDialogOpen(true);
  };

  const handleEditTransacao = (transacao: Transacao) => {
    setEditTransacao(transacao);
    setIsEditDialogOpen(true);
  };

  const handleUpdateTransacao = () => {
    if (editTransacao) {
      refetch();
      setEditTransacao(null);
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteTransacao = (transacaoId: number) => {
    setDeleteTransacaoId(transacaoId);
  };

  const confirmDeleteTransacao = async () => {
    if (deleteTransacaoId !== null) {
      setIsDeleting(true);
      try {
        await deleteTransacaoMutation.mutate({
          variables: { id: deleteTransacaoId }
        });
        refetch();
        setDeleteTransacaoId(null);
        toast({
          title: "Sucesso",
          description: "Transação excluída com sucesso",
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao excluir transação",
          variant: "destructive",
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const totalEntradas = transacoes.filter(t => t.tipo === 'entrada').reduce((acc, t) => acc + t.valor, 0);
  const totalSaidas = transacoes.filter(t => t.tipo === 'saida').reduce((acc, t) => acc + t.valor, 0);

  return (
    <AdminLayout title="Financeiro">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Financeiro</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Controle financeiro e pagamentos</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} className="bg-accent hover:bg-accent/90 text-accent-foreground w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Nova Transação
          </Button>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Cadastrar Nova Transação
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleAddTransacao();
            }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo" className="text-sm font-medium">
                    Tipo *
                  </Label>
                  <Select value={newTransacao.tipo} onValueChange={(value) => setNewTransacao({ ...newTransacao, tipo: value as 'entrada' | 'saida' })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent key={`tipo-new-${isDialogOpen}`}>
                      <SelectItem value="entrada">Entrada</SelectItem>
                      <SelectItem value="saida">Saída</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valor" className="text-sm font-medium">
                    Valor *
                  </Label>
                  <div className="relative">
                    <Input
                      id="valor"
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      value={String(newTransacao.valor)}
                      onChange={(e) => setNewTransacao({ ...newTransacao, valor: parseFloat(e.target.value) || 0 })}
                      className="pl-10"
                      required
                    />
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="data" className="text-sm font-medium">
                    Data *
                  </Label>
                  <div className="relative">
                    <Input
                      id="data"
                      type="date"
                      value={newTransacao.data}
                      onChange={(e) => setNewTransacao({ ...newTransacao, data: e.target.value })}
                      className="pl-10"
                      required
                    />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoria" className="text-sm font-medium">
                    Categoria *
                  </Label>
                  <Select value={newTransacao.categoria} onValueChange={(value) => setNewTransacao({ ...newTransacao, categoria: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent key={`categoria-new-${isDialogOpen}`}>
                      <SelectItem value="Vendas">Vendas</SelectItem>
                      <SelectItem value="Serviços">Serviços</SelectItem>
                      <SelectItem value="Produtos">Produtos</SelectItem>
                      <SelectItem value="Outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao" className="text-sm font-medium">
                  Descrição *
                </Label>
                <div className="relative">
                  <Input
                    id="descricao"
                    placeholder="Descrição da transação"
                    value={newTransacao.descricao}
                    onChange={(e) => setNewTransacao({ ...newTransacao, descricao: e.target.value })}
                    className="pl-10"
                    required
                  />
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="formaPagamento" className="text-sm font-medium">
                    Forma de Pagamento
                  </Label>
                  <Select value={newTransacao.formaPagamento} onValueChange={(value) => setNewTransacao({ ...newTransacao, formaPagamento: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a forma" />
                    </SelectTrigger>
                    <SelectContent key={`pagamento-new-${isDialogOpen}`}>
                      <SelectItem value="Boleto">Boleto</SelectItem>
                      <SelectItem value="PIX">PIX</SelectItem>
                      <SelectItem value="Cartão">Cartão</SelectItem>
                      <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                      <SelectItem value="Transferência">Transferência</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium">
                    Status
                  </Label>
                  <Select value={newTransacao.status} onValueChange={(value) => setNewTransacao({ ...newTransacao, status: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent key={`status-new-${isDialogOpen}`}>
                      <SelectItem value="Pago">Pago</SelectItem>
                      <SelectItem value="Pendente">Pendente</SelectItem>
                      <SelectItem value="Atrasado">Atrasado</SelectItem>
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
                  Cadastrar Transação
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* View Transaction Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Detalhes da Transação
              </DialogTitle>
            </DialogHeader>
            {viewTransacao && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">ID</Label>
                    <p className="font-mono text-sm">{viewTransacao.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Tipo</Label>
                    <div className="flex items-center gap-2">
                      {viewTransacao.tipo === 'entrada' ?
                        <TrendingUp className="h-4 w-4 text-green-600" /> :
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      }
                      <span className={`capitalize ${viewTransacao.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                        {viewTransacao.tipo}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Descrição</Label>
                  <p>{viewTransacao.descricao}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Valor</Label>
                    <p className={`font-bold ${viewTransacao.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                      {viewTransacao.tipo === 'entrada' ? '+' : '-'} {formatCurrency(viewTransacao.valor)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Data</Label>
                    <p>{viewTransacao.data}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Categoria</Label>
                    <p>{viewTransacao.categoria}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Forma de Pagamento</Label>
                    <p>{viewTransacao.formaPagamento}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className={statusColors[viewTransacao.status]}>{viewTransacao.status}</Badge>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setIsViewDialogOpen(false)}>Fechar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Transaction Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Editar Transação
              </DialogTitle>
            </DialogHeader>
            {editTransacao && (
              <form onSubmit={(e) => {
                e.preventDefault();
                handleUpdateTransacao();
              }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-tipo" className="text-sm font-medium">
                      Tipo *
                    </Label>
                    <Select value={editTransacao.tipo} onValueChange={(value) => setEditTransacao({ ...editTransacao, tipo: value as 'entrada' | 'saida' })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent key={`tipo-edit-${isEditDialogOpen}`}>
                        <SelectItem value="entrada">Entrada</SelectItem>
                        <SelectItem value="saida">Saída</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-valor" className="text-sm font-medium">
                      Valor *
                    </Label>
                    <div className="relative">
                      <Input
                        id="edit-valor"
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        value={String(editTransacao.valor)}
                        onChange={(e) => setEditTransacao({ ...editTransacao, valor: parseFloat(e.target.value) || 0 })}
                        className="pl-10"
                        required
                      />
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-data" className="text-sm font-medium">
                      Data *
                    </Label>
                    <div className="relative">
                      <Input
                        id="edit-data"
                        type="date"
                        value={editTransacao.data}
                        onChange={(e) => setEditTransacao({ ...editTransacao, data: e.target.value })}
                        className="pl-10"
                        required
                      />
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-categoria" className="text-sm font-medium">
                      Categoria *
                    </Label>
                    <Select value={editTransacao.categoria} onValueChange={(value) => setEditTransacao({ ...editTransacao, categoria: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent key={`categoria-edit-${isEditDialogOpen}`}>
                        <SelectItem value="Vendas">Vendas</SelectItem>
                        <SelectItem value="Serviços">Serviços</SelectItem>
                        <SelectItem value="Produtos">Produtos</SelectItem>
                        <SelectItem value="Outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-descricao" className="text-sm font-medium">
                    Descrição *
                  </Label>
                  <div className="relative">
                    <Input
                      id="edit-descricao"
                      placeholder="Descrição da transação"
                      value={editTransacao.descricao}
                      onChange={(e) => setEditTransacao({ ...editTransacao, descricao: e.target.value })}
                      className="pl-10"
                      required
                    />
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-formaPagamento" className="text-sm font-medium">
                      Forma de Pagamento
                    </Label>
                    <Select value={editTransacao.formaPagamento} onValueChange={(value) => setEditTransacao({ ...editTransacao, formaPagamento: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a forma" />
                      </SelectTrigger>
                      <SelectContent key={`pagamento-edit-${isEditDialogOpen}`}>
                        <SelectItem value="Boleto">Boleto</SelectItem>
                        <SelectItem value="PIX">PIX</SelectItem>
                        <SelectItem value="Cartão">Cartão</SelectItem>
                        <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                        <SelectItem value="Transferência">Transferência</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-status" className="text-sm font-medium">
                      Status
                    </Label>
                    <Select value={editTransacao.status} onValueChange={(value) => setEditTransacao({ ...editTransacao, status: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent key={`status-edit-${isEditDialogOpen}`}>
                        <SelectItem value="Pago">Pago</SelectItem>
                        <SelectItem value="Pendente">Pendente</SelectItem>
                        <SelectItem value="Atrasado">Atrasado</SelectItem>
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
                    Atualizar Transação
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold text-green-600">{formatCurrency(totalEntradas)}</span>
              </div>
              <p className="text-sm text-muted-foreground">Entradas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-600" />
                <span className="text-2xl font-bold text-red-600">{formatCurrency(totalSaidas)}</span>
              </div>
              <p className="text-sm text-muted-foreground">Saídas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-accent">{formatCurrency(totalEntradas - totalSaidas)}</div>
              <p className="text-sm text-muted-foreground">Saldo</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-yellow-600">{transacoes.filter(t => t.status === 'Pendente').length}</div>
              <p className="text-sm text-muted-foreground">Pendentes</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar transações..." 
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant={filtro === 'todos' ? 'default' : 'outline'} onClick={() => setFiltro('todos')}>Todos</Button>
            <Button variant={filtro === 'entrada' ? 'default' : 'outline'} onClick={() => setFiltro('entrada')}>Entradas</Button>
            <Button variant={filtro === 'saida' ? 'default' : 'outline'} onClick={() => setFiltro('saida')}>Saídas</Button>
          </div>
        </div>

        {/* Transações Table */}
        <Card>
          <CardHeader>
            <CardTitle>Transações</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[70px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransacoes.map((tr) => (
                  <TableRow key={tr.id}>
                    <TableCell className="font-mono text-sm">{tr.id}</TableCell>
                    <TableCell className="font-medium">{tr.descricao}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {tr.tipo === 'entrada' ? 
                          <TrendingUp className="h-4 w-4 text-green-600" /> : 
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        }
                        <span className={`capitalize ${tr.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                          {tr.tipo}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className={`font-bold ${tr.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                      {tr.tipo === 'entrada' ? '+' : '-'} {formatCurrency(tr.valor)}
                    </TableCell>
                    <TableCell>{tr.data}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[tr.status]}>{tr.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewTransacao(tr)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditTransacao(tr)}>
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
                                onClick={() => handleStatusChange(tr, 'Pago')}
                                disabled={tr.status === 'Pago'}
                              >
                                <Badge className={statusColors['Pago']}>Pago</Badge>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(tr, 'Pendente')}
                                disabled={tr.status === 'Pendente'}
                              >
                                <Badge className={statusColors['Pendente']}>Pendente</Badge>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(tr, 'Atrasado')}
                                disabled={tr.status === 'Atrasado'}
                              >
                                <Badge className={statusColors['Atrasado']}>Atrasado</Badge>
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                          <DropdownMenuItem
                            onClick={() => {
                              setTransacoes(transacoes.filter(t => t.id !== tr.id));
                              console.log('Delete transaction:', tr.id);
                            }}
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
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Financeiro;