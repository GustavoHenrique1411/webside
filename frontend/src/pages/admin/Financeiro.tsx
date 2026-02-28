import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, TrendingUp, TrendingDown, MoreHorizontal, Eye, Edit, Trash2, DollarSign, Wallet, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useTransacoes, useCreateTransacao, useUpdateTransacao, useDeleteTransacao } from '@/hooks/useGraphQL';
import { FinanceiroStats, TransacaoForm } from '@/components/financeiro';
import { PageHeader, StatsCard, EmptyState, SearchBar } from '@/components/ui';

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
  const [viewTransacao, setViewTransacao] = useState<any>(null);
  const [editTransacao, setEditTransacao] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteTransacaoId, setDeleteTransacaoId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: transacoesData, loading, refetch } = useTransacoes();
  const createTransacao = useCreateTransacao();
  const updateTransacaoMutation = useUpdateTransacao();
  const deleteTransacaoMutation = useDeleteTransacao();

  const transacoes = (transacoesData || []).map((trx: any) => ({
    id: trx.id,
    descricao: trx.descricao || '',
    tipo: trx.tipo === 'entrada' ? 'entrada' : 'saida',
    valor: trx.valor || 0,
    data: trx.data_transacao || trx.data || '',
    status: trx.status_nome || 'Pendente',
    categoria: trx.categoria || '',
    formaPagamento: trx.forma_pagamento || 'Boleto'
  }));

  const filteredTransacoes = transacoes.filter(tr => 
    tr.descricao.toLowerCase().includes(search.toLowerCase()) && 
    (filtro === 'todos' || tr.tipo === filtro)
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const handleStatusChange = async (transacao: any, newStatus: string) => {
    try {
      await updateTransacaoMutation.mutate(transacao.id, { status: newStatus });
      refetch();
      toast({ title: "Sucesso", description: "Status atualizado" });
    } catch { toast({ title: "Erro", description: "Erro ao atualizar", variant: "destructive" }); }
  };

  const handleAddTransacao = async (data: any) => {
    try {
      await createTransacao.mutate({ tipo: data.tipo, valor: data.valor, data_transacao: data.data, descricao: data.descricao, categoria: data.categoria, forma_pagamento: data.formaPagamento });
      setIsDialogOpen(false);
      refetch();
      toast({ title: "Sucesso", description: "Transação criada" });
    } catch { toast({ title: "Erro", description: "Erro ao criar", variant: "destructive" }); }
  };

  const handleDelete = async () => {
    if (deleteTransacaoId !== null) {
      setIsDeleting(true);
      try {
        await deleteTransacaoMutation.mutate(deleteTransacaoId);
        refetch();
        setDeleteTransacaoId(null);
        toast({ title: "Sucesso", description: "Excluído" });
      } catch { toast({ title: "Erro", description: "Erro ao excluir", variant: "destructive" }); }
      finally { setIsDeleting(false); }
    }
  };

  const totalEntradas = transacoes.filter(t => t.tipo === 'entrada').reduce((acc, t) => acc + t.valor, 0);
  const totalSaidas = transacoes.filter(t => t.tipo === 'saida').reduce((acc, t) => acc + t.valor, 0);

  return (
    <AdminLayout title="Financeiro">
      <div className="space-y-6">
        <PageHeader 
          title="Financeiro"
          description="Controle financeiro da empresa"
          icon={DollarSign}
          action={
            <Button onClick={() => setIsDialogOpen(true)} className="bg-accent hover:bg-accent/90">
              <Plus className="h-4 w-4 mr-2" />Nova Transação
            </Button>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard
            title="Total de Entradas"
            value={formatCurrency(totalEntradas)}
            icon={ArrowUpCircle}
            color="green"
          />
          <StatsCard
            title="Total de Saídas"
            value={formatCurrency(totalSaidas)}
            icon={ArrowDownCircle}
            color="red"
          />
          <StatsCard
            title="Saldo"
            value={formatCurrency(totalEntradas - totalSaidas)}
            icon={Wallet}
            color={totalEntradas - totalSaidas >= 0 ? 'green' : 'red'}
          />
        </div>

        <TransacaoForm isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} onSubmit={handleAddTransacao} isLoading={false} />

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchBar 
            value={search} 
            onChange={setSearch} 
            placeholder="Buscar transações..." 
          />
          <div className="flex gap-2">
            <Button variant={filtro === 'todos' ? 'default' : 'outline'} onClick={() => setFiltro('todos')}>Todos</Button>
            <Button variant={filtro === 'entrada' ? 'default' : 'outline'} onClick={() => setFiltro('entrada')}>Entradas</Button>
            <Button variant={filtro === 'saida' ? 'default' : 'outline'} onClick={() => setFiltro('saida')}>Saídas</Button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl border bg-card">
          {filteredTransacoes.length === 0 ? (
            <EmptyState
              icon={DollarSign}
              title="Nenhuma transação encontrada"
              description={search ? "Tente buscar com outros termos" : "Comece adicionando sua primeira transação"}
              action={
                <Button onClick={() => setIsDialogOpen(true)} className="bg-accent">
                  <Plus className="h-4 w-4 mr-2" />Nova Transação
                </Button>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead><TableHead>Descrição</TableHead><TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead><TableHead>Data</TableHead><TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransacoes.map(tr => (
                  <TableRow key={tr.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-mono text-sm">{tr.id}</TableCell>
                    <TableCell className="font-medium">{tr.descricao}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {tr.tipo === 'entrada' ? <TrendingUp className="h-4 w-4 text-green-600" /> : <TrendingDown className="h-4 w-4 text-red-600" />}
                        <span className={tr.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}>{tr.tipo}</span>
                      </div>
                    </TableCell>
                    <TableCell className={`font-bold ${tr.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                      {tr.tipo === 'entrada' ? '+' : '-'} {formatCurrency(tr.valor)}
                    </TableCell>
                    <TableCell>{tr.data}</TableCell>
                    <TableCell><Badge className={statusColors[tr.status]}>{tr.status}</Badge></TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setViewTransacao(tr); setIsViewDialogOpen(true); }}><Eye className="h-4 w-4 mr-2" />Ver</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setEditTransacao(tr); setIsEditDialogOpen(true); }}><Edit className="h-4 w-4 mr-2" />Editar</DropdownMenuItem>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem onClick={() => handleStatusChange(tr, 'Pago')}><Badge className={statusColors['Pago']}>Pago</Badge></DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(tr, 'Pendente')}><Badge className={statusColors['Pendente']}>Pendente</Badge></DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(tr, 'Atrasado')}><Badge className={statusColors['Atrasado']}>Atrasado</Badge></DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                          <DropdownMenuItem onClick={() => setDeleteTransacaoId(tr.id)} className="text-red-600"><Trash2 className="h-4 w-4 mr-2" />Excluir</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Detalhes</DialogTitle></DialogHeader>
            {viewTransacao && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div><Label>ID</Label><p className="font-mono">{viewTransacao.id}</p></div>
                  <div><Label>Tipo</Label><p>{viewTransacao.tipo}</p></div>
                </div>
                <div><Label>Descrição</Label><p>{viewTransacao.descricao}</p></div>
                <div className="grid grid-cols-2 gap-2">
                  <div><Label>Valor</Label><p>{formatCurrency(viewTransacao.valor)}</p></div>
                  <div><Label>Data</Label><p>{viewTransacao.data}</p></div>
                </div>
                <div><Label>Status</Label><Badge className={statusColors[viewTransacao.status]}>{viewTransacao.status}</Badge></div>
              </div>
            )}
            <DialogFooter><Button onClick={() => setIsViewDialogOpen(false)}>Fechar</Button></DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Editar Transação</DialogTitle></DialogHeader>
            {editTransacao && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Tipo</Label>
                    <Select value={editTransacao.tipo} onValueChange={v => setEditTransacao({...editTransacao, tipo: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="entrada">Entrada</SelectItem><SelectItem value="saida">Saída</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>Valor</Label><Input type="number" step="0.01" value={editTransacao.valor} onChange={e => setEditTransacao({...editTransacao, valor: parseFloat(e.target.value)})} /></div>
                </div>
                <div className="space-y-2"><Label>Descrição</Label><Input value={editTransacao.descricao} onChange={e => setEditTransacao({...editTransacao, descricao: e.target.value})} /></div>
                <div className="space-y-2"><Label>Status</Label>
                  <Select value={editTransacao.status} onValueChange={v => setEditTransacao({...editTransacao, status: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Pago">Pago</SelectItem><SelectItem value="Pendente">Pendente</SelectItem><SelectItem value="Atrasado">Atrasado</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
              <Button className="bg-accent" onClick={() => { setIsEditDialogOpen(false); refetch(); }}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <Dialog open={deleteTransacaoId !== null} onOpenChange={open => !open && setDeleteTransacaoId(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Confirmar Exclusão</DialogTitle></DialogHeader>
            <p>Tem certeza que deseja excluir?</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteTransacaoId(null)}>Cancelar</Button>
              <Button className="bg-red-600" onClick={handleDelete} disabled={isDeleting}>Excluir</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Financeiro;

