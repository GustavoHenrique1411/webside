import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Search, CreditCard, DollarSign, Calendar, Eye, Trash2 } from 'lucide-react';
import { useTransacoes, useCreateTransacao, useDeleteTransacao } from '@/hooks/useGraphQL';
import { useNotifications } from '@/components/NotificationSystem';
import TransacaoForm from '@/components/financeiro/TransacaoForm';

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
  const notifications = useNotifications();
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    tipo: 'Receita', valor: 0, data: '', descricao: '', categoria: '',
    formaPagamento: 'Boleto', parcelas: 1, observacoes: ''
  });

  const { data: transacoes, loading, refetch } = useTransacoes();
  const createTransacao = useCreateTransacao();
  const deleteTransacao = useDeleteTransacao();

  const filtered = (transacoes || []).filter((trx: any) =>
    (trx.descricao && trx.descricao.toLowerCase().includes(search.toLowerCase())) ||
    (trx.id && trx.id.toString().includes(search))
  );

  const formatCurrency = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  const handleSubmit = async () => {
    try {
      await createTransacao.mutate(formData);
      setIsDialogOpen(false);
      setFormData({ tipo: 'Receita', valor: 0, data: '', descricao: '', categoria: '', formaPagamento: 'Boleto', parcelas: 1, observacoes: '' });
      refetch();
      notifications.success('Sucesso', 'Transação criada');
    } catch { notifications.error('Erro', 'Não foi possível criar'); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteTransacao.mutate(deleteId);
      refetch();
      setDeleteId(null);
      notifications.success('Sucesso', 'Excluído');
    } catch { notifications.error('Erro', 'Não foi possível excluir'); }
  };

  return (
    <AdminLayout title="Transações">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div><h1 className="text-2xl font-bold">Transações</h1><p className="text-muted-foreground">Gerencie entradas e saídas</p></div>
          <Button onClick={() => setIsDialogOpen(true)} className="bg-accent"><Plus className="h-4 w-4 mr-2" />Nova</Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card><CardContent className="pt-4"><div className="text-2xl font-bold">{transacoes?.length || 0}</div><p className="text-sm text-muted-foreground">Total</p></CardContent></Card>
          <Card><CardContent className="pt-4"><div className="text-2xl font-bold text-green-600">R$ 1.2M</div><p className="text-sm text-muted-foreground">Receitas</p></CardContent></Card>
          <Card><CardContent className="pt-4"><div className="text-2xl font-bold text-red-600">R$ 67k</div><p className="text-sm text-muted-foreground">Despesas</p></CardContent></Card>
          <Card><CardContent className="pt-4"><div className="text-2xl font-bold text-accent">R$ 1.1M</div><p className="text-sm text-muted-foreground">Saldo</p></CardContent></Card>
        </div>

        {/* Search */}
        <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" /><Input placeholder="Buscar..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} /></div>

        {/* List */}
        <Card>
          <CardHeader><CardTitle>Lista de Transações</CardTitle></CardHeader>
          <CardContent>
            {loading ? <div className="py-8 text-center">Carregando...</div> : filtered.length === 0 ? <div className="py-8 text-center text-muted-foreground">Nenhuma transação encontrada</div> : (
              <div className="space-y-4">
                {filtered.map((trx: any) => (
                  <div key={trx.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-mono text-sm text-muted-foreground">#{trx.id}</span>
                        <span className="font-medium">{trx.cliente || 'N/A'}</span>
                        <Badge className={tipoColors[trx.tipo]}>{trx.tipo}</Badge>
                        <Badge className={statusColors[trx.status || 'Pendente']}>{trx.status || 'Pendente'}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span><DollarSign className="h-3 w-3 inline" /> {formatCurrency(trx.valor)}</span>
                        <span><Calendar className="h-3 w-3 inline" /> {new Date(trx.data_transacao).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setDeleteId(trx.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Dialog */}
        <TransacaoForm
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={async (data) => {
            try {
              await createTransacao.mutate({
                tipo: data.tipo === 'entrada' ? 'Receita' : 'Despesa',
                valor: data.valor,
                data: data.data,
                descricao: data.descricao,
                categoria: data.categoria,
                formaPagamento: data.formaPagamento,
                status: data.status
              });
              setIsDialogOpen(false);
              setFormData({ tipo: 'Receita', valor: 0, data: '', descricao: '', categoria: '', formaPagamento: 'Boleto', parcelas: 1, observacoes: '' });
              refetch();
              notifications.success('Sucesso', 'Transação criada');
            } catch { 
              notifications.error('Erro', 'Não foi possível criar'); 
            }
          }}
          isLoading={createTransacao.loading}
        />

        {/* Delete Dialog */}
        <Dialog open={deleteId !== null} onOpenChange={open => !open && setDeleteId(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Confirmar Exclusão</DialogTitle></DialogHeader>
            <p>Tem certeza que deseja excluir esta transação?</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteId(null)}>Cancelar</Button>
              <Button className="bg-red-600" onClick={handleDelete}>Excluir</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Transacoes;
