import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ShoppingCart, Plus, Edit, Calendar, User, FileText, DollarSign, Tag, Truck, AlertCircle, X, Save, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface PedidoFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  pedido?: any;
  loading?: boolean;
  clientes?: any[];
  produtos?: any[];
}

const defaultFormData = {
  numero_pedido: '',
  cliente_id: '',
  data_pedido: new Date().toISOString().split('T')[0],
  data_entrega: '',
  status_id: '1',
  valor_total: 0,
  observacoes: '',
};

export function PedidoFormDialog({ open, onOpenChange, onSubmit, pedido, loading, clientes, produtos }: PedidoFormDialogProps) {
  const [formData, setFormData] = useState(defaultFormData);

  // Reset form when dialog opens/closes or when pedido changes
  useEffect(() => {
    if (open) {
      if (pedido) {
        setFormData({
          numero_pedido: pedido.numero_pedido || '',
          cliente_id: pedido.cliente_id || '',
          data_pedido: pedido.data_pedido || new Date().toISOString().split('T')[0],
          data_entrega: pedido.data_entrega || '',
          status_id: pedido.status_id || '1',
          valor_total: pedido.valor_total || 0,
          observacoes: pedido.observacoes || '',
        });
      } else {
        setFormData(defaultFormData);
      }
    }
  }, [open, pedido]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isEditing = !!pedido;

  const getStatusBadge = (statusId: string) => {
    const statusMap: Record<string, { label: string; color: string; bg: string }> = {
      '1': { label: 'Pendente', color: 'text-yellow-700', bg: 'bg-yellow-100' },
      '2': { label: 'Em Processamento', color: 'text-blue-700', bg: 'bg-blue-100' },
      '3': { label: 'Enviado', color: 'text-purple-700', bg: 'bg-purple-100' },
      '4': { label: 'Entregue', color: 'text-green-700', bg: 'bg-green-100' },
      '5': { label: 'Cancelado', color: 'text-red-700', bg: 'bg-red-100' },
    };
    return statusMap[statusId] || { label: 'Desconhecido', color: 'text-gray-700', bg: 'bg-gray-100' };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto p-0">
        {/* Header com cor de fundo */}
        <div className="bg-gradient-to-r from-accent/10 to-accent/5 px-6 py-4 border-b">
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent rounded-lg">
                {isEditing ? <Edit className="h-5 w-5 text-white" /> : <Plus className="h-5 w-5 text-white" />}
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold">
                  {isEditing ? 'Editar Pedido' : 'Novo Pedido'}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  {isEditing ? 'Atualize as informações do pedido existente.' : 'Preencha os dados para criar um novo pedido de venda.'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4">
          {/* Seção: Informações Principais */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              <FileText className="h-4 w-4" />
              Informações Principais
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Número do Pedido */}
              <div className="space-y-2">
                <Label htmlFor="numero_pedido" className="text-sm font-medium flex items-center gap-1.5">
                  Número do Pedido
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Obrigatório</Badge>
                </Label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="numero_pedido"
                    placeholder="Ex: PED-001"
                    value={formData.numero_pedido}
                    onChange={(e) => setFormData({ ...formData, numero_pedido: e.target.value })}
                    className="pl-10 h-11"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">Identificador único do pedido</p>
              </div>

              {/* Cliente */}
              <div className="space-y-2">
                <Label htmlFor="cliente_id" className="text-sm font-medium">
                  Cliente
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                  <Select
                    value={formData.cliente_id}
                    onValueChange={(value) => setFormData({ ...formData, cliente_id: value })}
                  >
                    <SelectTrigger className="pl-10 h-11">
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={5}>
                      {clientes?.map((cliente) => (
                        <SelectItem key={cliente.id} value={String(cliente.id)}>
                          {cliente.nome_fantasia || cliente.razao_social}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-muted-foreground">Cliente que realizou o pedido</p>
              </div>
            </div>
          </div>

          <Separator className="my-5" />

          {/* Seção: Datas */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              <Calendar className="h-4 w-4" />
              Datas
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Data do Pedido */}
              <div className="space-y-2">
                <Label htmlFor="data_pedido" className="text-sm font-medium flex items-center gap-1.5">
                  Data do Pedido
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Obrigatório</Badge>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="data_pedido"
                    type="date"
                    value={formData.data_pedido}
                    onChange={(e) => setFormData({ ...formData, data_pedido: e.target.value })}
                    className="pl-10 h-11"
                    required
                  />
                </div>
              </div>

              {/* Data de Entrega */}
              <div className="space-y-2">
                <Label htmlFor="data_entrega" className="text-sm font-medium flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5" />
                  Previsão de Entrega
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="data_entrega"
                    type="date"
                    value={formData.data_entrega}
                    onChange={(e) => setFormData({ ...formData, data_entrega: e.target.value })}
                    className="pl-10 h-11"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Data estimada para entrega</p>
              </div>
            </div>
          </div>

          <Separator className="my-5" />

          {/* Seção: Status e Valor */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              <AlertCircle className="h-4 w-4" />
              Status e Valor
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status_id" className="text-sm font-medium">
                  Status do Pedido
                </Label>
                <Select
                  value={formData.status_id}
                  onValueChange={(value) => setFormData({ ...formData, status_id: value })}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent position="popper" sideOffset={5}>
                    {Object.entries({
                      '1': 'Pendente',
                      '2': 'Em Processamento',
                      '3': 'Enviado',
                      '4': 'Entregue',
                      '5': 'Cancelado'
                    }).map(([id, label]) => {
                      const status = getStatusBadge(id);
                      return (
                        <SelectItem key={id} value={id}>
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${status.bg.replace('bg-', 'bg-').replace('100', '500')}`} />
                            {label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Status atual:</span>
                  <Badge className={`${getStatusBadge(formData.status_id).bg} ${getStatusBadge(formData.status_id).color} text-xs`}>
                    {getStatusBadge(formData.status_id).label}
                  </Badge>
                </div>
              </div>

              {/* Valor Total */}
              <div className="space-y-2">
                <Label htmlFor="valor_total" className="text-sm font-medium flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5" />
                  Valor Total
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">R$</span>
                  <Input
                    id="valor_total"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    value={formData.valor_total}
                    onChange={(e) => setFormData({ ...formData, valor_total: parseFloat(e.target.value) || 0 })}
                    className="pl-10 h-11 font-mono"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Valor total do pedido em reais</p>
              </div>
            </div>
          </div>

          <Separator className="my-5" />

          {/* Seção: Observações */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              <FileText className="h-4 w-4" />
              Informações Adicionais
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="observacoes" className="text-sm font-medium">
                Observações
              </Label>
              <Textarea
                id="observacoes"
                placeholder="Adicione informações complementares sobre o pedido, condições especiais, instruções de entrega, etc..."
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Estas informações aparecerão nos documentos do pedido
              </p>
            </div>
          </div>

          {/* Footer com ações */}
          <DialogFooter className="flex gap-3 pt-6 mt-6 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1 h-11"
              disabled={loading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="flex-1 h-11 bg-accent hover:bg-accent/90 gap-2" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {isEditing ? 'Salvar Alterações' : 'Criar Pedido'}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
