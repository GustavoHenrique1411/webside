import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Receipt, 
  Plus, 
  Edit, 
  Calendar, 
  Banknote, 
  FileText, 
  X, 
  Save, 
  Loader2,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from 'lucide-react';

interface FaturaFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  fatura?: any;
  loading?: boolean;
}

const defaultFormData = {
  cliente_id: '',
  valor: 0,
  data_vencimento: '',
  status: 'pendente',
  descricao: '',
};

export function FaturaFormDialog({ open, onOpenChange, onSubmit, fatura, loading }: FaturaFormDialogProps) {
  const [formData, setFormData] = useState(defaultFormData);

  // Reset form when dialog opens/closes or when fatura changes
  useEffect(() => {
    if (open) {
      if (fatura) {
        setFormData({
          cliente_id: fatura.cliente_id || '',
          valor: fatura.valor || 0,
          data_vencimento: fatura.data_vencimento || '',
          status: fatura.status || 'pendente',
          descricao: fatura.descricao || '',
        });
      } else {
        setFormData(defaultFormData);
      }
    }
  }, [open, fatura]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isEditing = !!fatura;

  const getStatusConfig = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
      'pendente': { 
        label: 'Pendente', 
        color: 'text-yellow-700', 
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        icon: <Clock className="h-4 w-4" />
      },
      'paga': { 
        label: 'Paga', 
        color: 'text-green-700', 
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: <CheckCircle2 className="h-4 w-4" />
      },
      'vencida': { 
        label: 'Vencida', 
        color: 'text-red-700', 
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: <AlertTriangle className="h-4 w-4" />
      },
      'cancelada': { 
        label: 'Cancelada', 
        color: 'text-gray-700', 
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        icon: <XCircle className="h-4 w-4" />
      },
    };
    return statusMap[status] || { 
      label: status, 
      color: 'text-gray-700', 
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      icon: <AlertCircle className="h-4 w-4" />
    };
  };

  const statusConfig = getStatusConfig(formData.status);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto p-0">
        {/* Header com gradiente */}
        <div className="bg-gradient-to-r from-accent/10 to-accent/5 px-6 py-4 border-b">
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent rounded-lg">
                {isEditing ? <Edit className="h-5 w-5 text-white" /> : <Plus className="h-5 w-5 text-white" />}
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold">
                  {isEditing ? 'Editar Fatura' : 'Nova Fatura'}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  {isEditing ? 'Atualize as informações da fatura.' : 'Crie uma nova fatura para registro.'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4">
          {/* Seção: Descrição */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              <FileText className="h-4 w-4" />
              Descrição
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="descricao" className="text-sm font-medium flex items-center gap-1.5">
                Descrição da Fatura
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Obrigatório</Badge>
              </Label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="descricao"
                  placeholder="Ex: Serviços de consultoria - Janeiro/2024"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  className="pl-10 h-11"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">Descrição clara do serviço ou produto faturado</p>
            </div>
          </div>

          <Separator className="my-5" />

          {/* Seção: Valor e Vencimento */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              <DollarSign className="h-4 w-4" />
              Valor e Vencimento
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Valor */}
              <div className="space-y-2">
                <Label htmlFor="valor" className="text-sm font-medium flex items-center gap-1.5">
                  Valor
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Obrigatório</Badge>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">R$</span>
                  <Input
                    id="valor"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    value={formData.valor}
                    onChange={(e) => setFormData({ ...formData, valor: parseFloat(e.target.value) || 0 })}
                    className="pl-10 h-11 font-mono"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">Valor total da fatura</p>
              </div>

              {/* Data de Vencimento */}
              <div className="space-y-2">
                <Label htmlFor="data_vencimento" className="text-sm font-medium flex items-center gap-1.5">
                  Data de Vencimento
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Obrigatório</Badge>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="data_vencimento"
                    type="date"
                    value={formData.data_vencimento}
                    onChange={(e) => setFormData({ ...formData, data_vencimento: e.target.value })}
                    className="pl-10 h-11"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">Prazo final para pagamento</p>
              </div>
            </div>
          </div>

          <Separator className="my-5" />

          {/* Seção: Status */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              <Clock className="h-4 w-4" />
              Status do Pagamento
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">
                Status Atual
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={5}>
                  <SelectItem value="pendente">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-yellow-500" />
                      Pendente
                    </div>
                  </SelectItem>
                  <SelectItem value="paga">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      Paga
                    </div>
                  </SelectItem>
                  <SelectItem value="vencida">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      Vencida
                    </div>
                  </SelectItem>
                  <SelectItem value="cancelada">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-gray-500" />
                      Cancelada
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Status atual:</span>
                <Badge className={`${statusConfig.bg} ${statusConfig.color} ${statusConfig.border} text-xs border`}>
                  <span className="flex items-center gap-1">
                    {statusConfig.icon}
                    {statusConfig.label}
                  </span>
                </Badge>
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
                  {isEditing ? 'Salvar Alterações' : 'Cadastrar Fatura'}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
