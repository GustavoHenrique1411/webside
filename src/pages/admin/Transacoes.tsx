import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, Search, CreditCard, MoreHorizontal, DollarSign, Calendar, FileText, Eye, Edit, Trash2, Loader2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useTransacoes, useCreateTransacao, useUpdateTransacao, useDeleteTransacao } from '@/hooks/useGraphQL';

interface Transacao {
  id_transacao: number;
  id_pedido?: number;
  id_cliente?: number;
  id_empresa?: number;
  tipo: string;
  valor: number;
  data_transacao: string;
  descricao?: string;
  categoria?: string;
  forma_pagamento?: string;
  parcelas?: number;
  observacoes?: string;
  id_status: number;
  data_criacao: string;
  cliente?: string;
  status?: string;
}

const statusColors: Record<string, string> = {
  'Confirmada': 'bg-green-100 text-green-800',
  'Pendente': 'bg-yellow-100 text-yellow-800',
  'Cancelada': 'bg-red-100 text-red-800',
};

const tipoColors: Record<string, string> = {
  'Receita': 'bg-blue-100 text-blue-800',
  'Despesa': 'bg-red-100 text-red-800',
};

const Transacoes: React.FC = () => {
  const [search, setSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteTransacaoId, setDeleteTransacaoId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newTransacao, setNewTransacao] = useState({
    origem: 'pedido', // 'pedido' or 'manual'
    pedidoId: '',
    clienteId: '',
    // Transaction details
    tipo: 'Receita',
    valor: 0,
    data: '',
    descricao: '',
    categoria: '',
    // Payment details
    formaPagamento: 'Boleto',
    parcelas: 1,
    // Notes
    observacoes: ''
  });

  // GraphQL hooks
  const { data: transacoes, loading, refetch } = useTransacoes();
  const createTransacao = useCreateTransacao();
  const updateTransacao = useUpdateTransacao();
  const deleteTransacao = useDeleteTransacao();

  const filteredTransacoes = (transacoes || []).filter((trx: any) =>
    (trx.descricao && trx.descricao.toLowerCase().includes(search.toLowerCase())) ||
    (trx.id && trx.id.toString().includes(search.toLowerCase()))
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createTransacao.mutate({
        variables: {
          input: {
            tipo: newTransacao.tipo,
            valor: newTransacao.valor,
            data_transacao: newTransacao.data,
            descricao: newTransacao.descricao,
            categoria: newTransacao.categoria,
            forma_pagamento: newTransacao.formaPagamento,
            parcelas: newTransacao.parcelas,
            observacoes: newTransacao.observacoes
          }
        }
      });

      // Reset form
      setNewTransacao({
        origem: 'pedido',
        pedidoId: '',
        clienteId: '',
        tipo: 'Receita',
        valor: 0,
        data: '',
        descricao: '',
        categoria: '',
        formaPagamento: 'Boleto',
        parcelas: 1,
        observacoes: ''
      });
      setIsDialogOpen(false);
      refetch();
    } catch (error) {
      console.error('Error creating transaction:', error);
      alert('Erro ao criar transação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (transacao: any, newStatus: string) => {
    try {
      await updateTransacao.mutate({
        variables: {
          id: transacao.id,
          input: { status: newStatus }
        }
      });
      refetch();
    } catch (error) {
      console.error('Error updating transaction status:', error);
      alert('Erro ao atualizar status da transação. Tente novamente.');
    }
  };

  const handleDeleteTransacao = (transacaoId: number) => {
    setDeleteTransacaoId(transacaoId);
  };

  const confirmDeleteTransacao = async () => {
    if (deleteTransacaoId !== null) {
      setIsDeleting(true);
      try {
        await deleteTransacao.mutate({
          variables: { id: deleteTransacaoId }
        });
        refetch();
        setDeleteTransacaoId(null);
      } catch (error) {
        console.error('Error deleting transaction:', error);
        alert('Erro ao excluir transação. Tente novamente.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <AdminLayout title="Transações">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Transações</h1>
            <p className="text-muted-foreground">Gerencie entradas e saídas financeiras</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Nova Transação
          </Button>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Cadastrar Nova Transação
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo" className="text-sm font-medium">
                    Tipo *
                  </Label>
                  <Select value={newTransacao.tipo} onValueChange={(value) => setNewTransacao({ ...newTransacao, tipo: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent key={`tipo-new-${isDialogOpen}`} position="popper" sideOffset={5}>
                      <SelectItem value="Receita">Receita</SelectItem>
                      <SelectItem value="Despesa">Despesa</SelectItem>
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
                      value={newTransacao.valor}
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
                    <SelectContent position="popper" sideOffset={5}>
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
                    <SelectContent position="popper" sideOffset={5}>
                      <SelectItem value="Boleto">Boleto</SelectItem>
                      <SelectItem value="PIX">PIX</SelectItem>
                      <SelectItem value="Cartão">Cartão</SelectItem>
                      <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                      <SelectItem value="Transferência">Transferência</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parcelas" className="text-sm font-medium">
                    Parcelas
                  </Label>
                  <Input
                    id="parcelas"
                    type="number"
                    min="1"
                    value={newTransacao.parcelas}
                    onChange={(e) => setNewTransacao({ ...newTransacao, parcelas: parseInt(e.target.value) || 1 })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="observacoes" className="text-sm font-medium">
                  Observações
                </Label>
                <Input
                  id="observacoes"
                  placeholder="Observações adicionais"
                  value={newTransacao.observacoes}
                  onChange={(e) => setNewTransacao({ ...newTransacao, observacoes: e.target.value })}
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
                      Cadastrando...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Cadastrar Transação
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <AlertDialog open={deleteTransacaoId !== null} onOpenChange={() => setDeleteTransacaoId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza de que deseja excluir esta transação? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteTransacao} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-accent">47</div>
              <p className="text-sm text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-green-600">R$ 1.2M</div>
              <p className="text-sm text-muted-foreground">Receitas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-red-600">R$ 67k</div>
              <p className="text-sm text-muted-foreground">Despesas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-accent">R$ 1.1M</div>
              <p className="text-sm text-muted-foreground">Saldo</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar transações..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Transacoes List */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Transações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : filteredTransacoes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma transação encontrada.
                </div>
              ) : (
                filteredTransacoes.map((trx) => (
                  <div key={trx.id_transacao} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-mono text-sm text-muted-foreground">#{trx.id_transacao}</span>
                        <span className="font-medium text-foreground">{trx.cliente || 'N/A'}</span>
                        <Badge className={tipoColors[trx.tipo]}>{trx.tipo}</Badge>
                        <Badge className={statusColors[trx.status || 'Pendente']}>{trx.status || 'Pendente'}</Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> {formatCurrency(trx.valor)}</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(trx.data_transacao).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">Ver</Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleStatusChange(trx, 'Confirmada')}>
                            <Eye className="h-4 w-4 mr-2" />
                            Confirmar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(trx, 'Pendente')}>
                            <Edit className="h-4 w-4 mr-2" />
                            Marcar como Pendente
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(trx, 'Cancelada')} className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Cancelar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Transacoes;
