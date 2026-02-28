import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { 
  FileSignature, 
  Edit, 
  Calendar, 
  User, 
  Banknote, 
  X, 
  ArrowRight,
  Hash,
  Clock,
  DollarSign,
  FileText,
  CheckCircle2,
  AlertCircle,
  Info
} from 'lucide-react';

interface ContratoViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contrato: any | null;
  onEdit?: (contrato: any) => void;
}

const ContratoViewDialog: React.FC<ContratoViewDialogProps> = ({
  open,
  onOpenChange,
  contrato,
  onEdit
}) => {
  if (!contrato) return null;

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

  const getStatusConfig = (statusId: string) => {
    const statusMap: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
      '1': { 
        label: 'Ativo', 
        color: 'text-green-700', 
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: <CheckCircle2 className="h-4 w-4" />
      },
      '2': { 
        label: 'Expirado', 
        color: 'text-yellow-700', 
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        icon: <AlertCircle className="h-4 w-4" />
      },
      '3': { 
        label: 'Cancelado', 
        color: 'text-red-700', 
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: <X className="h-4 w-4" />
      },
      '4': { 
        label: 'Renovado', 
        color: 'text-blue-700', 
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: <CheckCircle2 className="h-4 w-4" />
      },
    };
    return statusMap[statusId] || { 
      label: statusId, 
      color: 'text-gray-700', 
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      icon: <Info className="h-4 w-4" />
    };
  };

  const statusConfig = getStatusConfig(contrato.status_id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden">
        {/* Header com gradiente */}
        <div className="bg-gradient-to-r from-accent/10 via-accent/5 to-background px-6 py-5 border-b">
          <DialogHeader className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-accent rounded-xl shadow-sm">
                  <FileSignature className="h-5 w-5 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold text-foreground">
                    {contrato.numero_contrato || 'Contrato'}
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground">
                    Detalhes do contrato
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
                  {contrato.status_id === '1' && 'Contrato em vigência'}
                  {contrato.status_id === '2' && 'Contrato expirado, requer renovação'}
                  {contrato.status_id === '3' && 'Contrato cancelado'}
                  {contrato.status_id === '4' && 'Contrato renovado e ativo'}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Seção: Identificação */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              <Hash className="h-4 w-4" />
              Identificação
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {/* Cliente */}
              <div className="p-4 bg-muted/40 rounded-xl border">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-primary/10 rounded-md">
                    <User className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground uppercase">
                    Cliente
                  </span>
                </div>
                <p className="text-lg font-semibold text-foreground">
                  {contrato.cliente_nome || 'Não informado'}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Seção: Vigência */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              <Clock className="h-4 w-4" />
              Vigência do Contrato
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Data de Início */}
              <div className="p-4 bg-muted/40 rounded-xl border">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-primary/10 rounded-md">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground uppercase">
                    Data de Início
                  </span>
                </div>
                <p className="text-lg font-semibold text-foreground">
                  {formatDate(contrato.data_inicio)}
                </p>
              </div>

              {/* Data de Término */}
              <div className="p-4 bg-muted/40 rounded-xl border">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-primary/10 rounded-md">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground uppercase">
                    Data de Término
                  </span>
                </div>
                <p className="text-lg font-semibold text-foreground">
                  {formatDate(contrato.data_fim) || 'Indeterminado'}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Seção: Valor */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              <DollarSign className="h-4 w-4" />
              Valor do Contrato
            </div>
            
            <div className="p-5 bg-gradient-to-r from-accent/10 to-accent/5 rounded-xl border border-accent/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-accent/20 rounded-md">
                  <Banknote className="h-4 w-4 text-accent" />
                </div>
                <span className="text-xs font-medium text-muted-foreground uppercase">
                  Valor Total
                </span>
              </div>
              <p className="text-2xl font-bold text-accent">
                {formatCurrency(contrato.valor_total)}
              </p>
            </div>
          </div>

          {/* Seção: Observações */}
          {contrato.observacoes && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  <FileText className="h-4 w-4" />
                  Observações
                </div>
                <div className="p-4 bg-muted/40 rounded-xl border">
                  <p className="text-sm text-foreground leading-relaxed">
                    {contrato.observacoes}
                  </p>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Rodapé com metadados */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>Criado em: {formatDate(contrato.data_criacao)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Hash className="h-3.5 w-3.5" />
              <span>ID: {contrato.id}</span>
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
                onEdit(contrato);
              }} 
              className="flex-1 h-11 bg-accent hover:bg-accent/90 gap-2"
            >
              <Edit className="h-4 w-4" />
              Editar Contrato
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContratoViewDialog;
