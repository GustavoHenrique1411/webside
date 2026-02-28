import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  FileSignature, 
  Plus, 
  Edit, 
  Calendar, 
  User, 
  Banknote, 
  X, 
  Save, 
  Loader2,
  Hash,
  Clock,
  DollarSign,
  FileText,
  AlertCircle
} from 'lucide-react';

interface ContratoFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  contrato?: any;
  loading?: boolean;
  clientes?: any[];
}

const defaultFormData = {
  numero_contrato: '',
  cliente_id: '',
  data_inicio: new Date().toISOString().split('T')[0],
  data_fim: '',
  valor_total: 0,
  status_id: '1',
  observacoes: '',
};

export function ContratoFormDialog({ open, onOpenChange, onSubmit, contrato, loading, clientes }: ContratoFormDialogProps) {
  const [formData, setFormData] = useState(defaultFormData);

  // Reset form when dialog opens/closes or when contrato changes
  useEffect(() => {
    if (open) {
      if (contrato) {
        setFormData({
          numero_contrato: contrato.numero_contrato || '',
          cliente_id: contrato.cliente_id || '',
          data_inicio: contrato.data_inicio || new Date().toISOString().split('T')[0],
          data_fim: contrato.data_fim || '',
          valor_total: contrato.valor_total || 0,
          status_id: contrato.status_id || '1',
          observacoes: contrato.observacoes || '',
        });
      } else {
        setFormData(defaultFormData);
      }
    }
  }, [open, contrato]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isEditing = !!contrato;

  const getStatusConfig = (statusId: string) => {
    const statusMap: Record<string, { label: string; color: string; bg: string; border: string }> = {
      '1': { label: 'Ativo', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' },
      '2': { label: 'Expirado', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
      '3': { label: 'Cancelado', color: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200' },
      '4': { label: 'Renovado', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
    };
    return statusMap[statusId] || { label: 'Desconhecido', color: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200' };
  };

  const statusConfig = getStatusConfig(formData.status_id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto p-0">
        {/* Header com gradiente */}
        <div className="bg-gradient-to-r from-accent/10 to-accent/5 px-6 py-4 border-b">
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent rounded-lg">
                {isEditing ? <Edit className="h-5 w-5 text-white" /> : <Plus className="h-5 w-5 text-white" />}
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold">
                  {isEditing ? 'Editar Contrato' : 'Novo Contrato'}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  {isEditing ? 'Atualize as informações do contrato.' : 'Crie um novo contrato para um cliente.'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4">
          {/* Seção: Identificação */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              <Hash className="h-4 w-4" />
              Identificação
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Número do Contrato */}
              <div className="space-y-2">
                <Label htmlFor="numero_contrato" className="text-sm font-medium flex items-center gap-1.5">
                  Número do Contrato
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Obrigatório</Badge>
                </Label>
                <div className="relative">
                  <FileSignature className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="numero_contrato"
                    placeholder="Ex: CTR-001"
                    value={formData.numero_contrato}
                    onChange={(e) => setFormData({ ...formData, numero_contrato: e.target.value })}
                    className="pl-10 h-11 font-mono"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">Código único do contrato</p>
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
                    <SelectTrigger className="h-11 pl-10">
                      <SelectValue placeholder="Selecione o cliente" />
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
                <p className="text-xs text-muted-foreground">Cliente vinculado ao contrato</p>
              </div>
            </div>
          </div>

          <Separator className="my-5" />

          {/* Seção: Vigência */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              <Clock className="h-4 w-4" />
              Vigência do Contrato
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Data de Início */}
              <div className="space-y-2">
                <Label htmlFor="data_inicio" className="text-sm font-medium flex items-center gap-1.5">
                  Data de Início
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Obrigatório</Badge>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="data_inicio"
                    type="date"
                    value={formData.data_inicio}
                    onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
                    className="pl-10 h-11"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">Início da vigência</p>
              </div>

              {/* Data de Término */}
              <div className="space-y-2">
                <Label htmlFor="data_fim" className="text-sm font-medium">
                  Data de Término
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="data_fim"
                    type="date"
                    value={formData.data_fim}
                    onChange={(e) => setFormData({ ...formData, data_fim: e.target.value })}
                    className="pl-10 h-11"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Fim da vigência (opcional)</p>
              </div>
            </div>
          </div>

          <Separator className="my-5" />

          {/* Seção: Status e Valor */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              <DollarSign className="h-4 w-4" />
              Status e Valor
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status_id" className="text-sm font-medium">
                  Status do Contrato
                </Label>
                <Select
                  value={formData.status_id}
                  onValueChange={(value) => setFormData({ ...formData, status_id: value })}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent position="popper" sideOffset={5}>
                    <SelectItem value="1">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        Ativo
                      </div>
                    </SelectItem>
                    <SelectItem value="2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        Expirado
                      </div>
                    </SelectItem>
                    <SelectItem value="3">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-gray-500" />
                        Cancelado
                      </div>
                    </SelectItem>
                    <SelectItem value="4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        Renovado
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Status atual:</span>
                  <Badge className={`${statusConfig.bg} ${statusConfig.color} ${statusConfig.border} text-xs border`}>
                    {statusConfig.label}
                  </Badge>
                </div>
              </div>

              {/* Valor Total */}
              <div className="space-y-2">
                <Label htmlFor="valor_total" className="text-sm font-medium">
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
                <p className="text-xs text-muted-foreground">Valor total do contrato</p>
              </div>
            </div>
          </div>

          <Separator className="my-5" />

          {/* Seção: Observações */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              <FileText className="h-4 w-4" />
              Observações
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="observacoes" className="text-sm font-medium">
                Informações Adicionais
              </Label>
              <Textarea
                id="observacoes"
                placeholder="Adicione observações importantes sobre o contrato, cláusulas especiais, condições de pagamento, etc..."
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                rows={4}
                className="resize-none"
              />
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <AlertCircle className="h-3 w-3" />
                <span>Estas informações serão visíveis na visualização do contrato</span>
              </div>
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
                  {isEditing ? 'Salvar Alterações' : 'Cadastrar Contrato'}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
