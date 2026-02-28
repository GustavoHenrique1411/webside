import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { 
  Receipt, 
  Edit, 
  Calendar, 
  Banknote, 
  X, 
  ArrowRight,
  FileText,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  AlertCircle,
  Hash
} from 'lucide-react';

interface FaturaViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fatura: any | null;
  onEdit?: (fatura: any) => void;
}

const FaturaViewDialog: React.FC<FaturaViewDialogProps> = ({
  open,
  onOpenChange,
  fatura,
  onEdit
}) => {
  if (!fatura) return null;

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusConfig = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
      pendente: { 
        label: 'Pendente', 
        color: 'text-yellow-700', 
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        icon: <Clock className="h-4 w-4" />
      },
      paga: { 
        label: 'Paga', 
        color: 'text-green-700', 
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: <CheckCircle2 className="h-4 w-4" />
      },
      vencida: { 
        label: 'Vencida', 
        color: 'text-red-700', 
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: <AlertTriangle className="h-4 w-4" />
      },
      cancelada: { 
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

  const statusConfig = getStatusConfig(fatura.status);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
        {/* Header com gradiente */}
        <div className="bg-gradient-to-r from-accent/10 via-accent/5 to-background px-6 py-5 border-b">
          <DialogHeader className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-accent rounded-xl shadow-sm">
                  <Receipt className="h-5 w-5 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold text-foreground">
                    Fatura
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground">
                    Detalhes do pagamento
                  </p>
                </div>
              </div>
              <Badge 
                className={`${statusConfig.bg} ${statusConfig.color} ${statusConfig.border} px-3 py-1 text-xs font-medium border`}
              >
                <span className="flex items-center gap-1.5">
                  {statusConfig.icon}
                  {statusConfig.label}
                </span>
              </Badge>
            </div>
          </DialogHeader>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Status Card */}
          <div className={`p-4 ${statusConfig.bg} ${statusConfig.border} border rounded-xl`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${statusConfig.bg} ${statusConfig.color}`}>
                {statusConfig.icon}
              </div>
              <div>
                <p className={`text-sm font-medium ${statusConfig.color}`}>
                  Status: {statusConfig.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {fatura.status === 'pendente' && 'Aguardando pagamento'}
                  {fatura.status === 'paga' && 'Pagamento confirmado'}
                  {fatura.status === 'vencida' && 'Prazo de pagamento expirado'}
                  {fatura.status === 'cancelada' && 'Fatura cancelada'}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Seção: Descrição */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              <FileText className="h-4 w-4" />
              Descrição
            </div>
            
            <div className="p-4 bg-muted/40 rounded-xl border">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-primary/10 rounded-md">
                  <FileText className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-xs font-medium text-muted-foreground uppercase">
                  Descrição da Fatura
                </span>
              </div>
              <p className="text-lg font-semibold text-foreground">
                {fatura.descricao || 'Sem descrição'}
              </p>
            </div>
          </div>

          <Separator />

          {/* Seção: Valor e Vencimento */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              <DollarSign className="h-4 w-4" />
              Valor e Vencimento
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Valor */}
              <div className="p-4 bg-gradient-to-r from-accent/10 to-accent/5 rounded-xl border border-accent/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-accent/20 rounded-md">
                    <Banknote className="h-3.5 w-3.5 text-accent" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground uppercase">
                    Valor
                  </span>
                </div>
                <p className="text-2xl font-bold text-accent">
                  {formatCurrency(fatura.valor)}
                </p>
              </div>

              {/* Data de Vencimento */}
              <div className="p-4 bg-muted/40 rounded-xl border">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-primary/10 rounded-md">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground uppercase">
                    Vencimento
                  </span>
                </div>
                <p className="text-lg font-semibold text-foreground">
                  {formatDate(fatura.data_vencimento)}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Rodapé com metadados */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>Criada em: {formatDate(fatura.data_criacao)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Hash className="h-3.5 w-3.5" />
              <span>ID: {fatura.id}</span>
            </div>
          </div>
        </div>

        {/* Footer com ações */}
        <DialogFooter className="px-6 py-4 border-t bg-muted/20 gap-3">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="flex-1 h-11"
          >
            <X className="h-4 w-4 mr-2" />
            Fechar
          </Button>
          {onEdit && (
            <Button 
              onClick={() => {
                onOpenChange(false);
                onEdit(fatura);
              }} 
              className="flex-1 h-11 bg-accent hover:bg-accent/90 gap-2"
            >
              <Edit className="h-4 w-4" />
              Editar Fatura
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FaturaViewDialog;
