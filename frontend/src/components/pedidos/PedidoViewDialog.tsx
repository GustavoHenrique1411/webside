import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { 
  ShoppingCart, 
  Edit, 
  Calendar, 
  User, 
  FileText, 
  DollarSign, 
  Tag, 
  Truck, 
  AlertCircle, 
  Clock,
  X,
  ArrowRight,
  Package,
  CheckCircle2,
  XCircle,
  Clock3,
  Send
} from 'lucide-react';

interface PedidoViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pedido: any | null;
  onEdit?: (pedido: any) => void;
}

const PedidoViewDialog: React.FC<PedidoViewDialogProps> = ({
  open,
  onOpenChange,
  pedido,
  onEdit
}) => {
  if (!pedido) return null;

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'Não definida';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusConfig = (statusId: string) => {
    const configs: Record<string, { 
      label: string; 
      color: string; 
      bg: string; 
      border: string;
      icon: React.ReactNode;
      description: string;
    }> = {
      '1': { 
        label: 'Pendente', 
        color: 'text-yellow-700', 
        bg: 'bg-yellow-50', 
        border: 'border-yellow-200',
        icon: <Clock3 className="h-4 w-4" />,
        description: 'Aguardando processamento'
      },
      '2': { 
        label: 'Em Processamento', 
        color: 'text-blue-700', 
        bg: 'bg-blue-50', 
        border: 'border-blue-200',
        icon: <Package className="h-4 w-4" />,
        description: 'Pedido em produção'
      },
      '3': { 
        label: 'Enviado', 
        color: 'text-purple-700', 
        bg: 'bg-purple-50', 
        border: 'border-purple-200',
        icon: <Send className="h-4 w-4" />,
        description: 'Em trânsito para entrega'
      },
      '4': { 
        label: 'Entregue', 
        color: 'text-green-700', 
        bg: 'bg-green-50', 
        border: 'border-green-200',
        icon: <CheckCircle2 className="h-4 w-4" />,
        description: 'Entrega concluída'
      },
      '5': { 
        label: 'Cancelado', 
        color: 'text-red-700', 
        bg: 'bg-red-50', 
        border: 'border-red-200',
        icon: <XCircle className="h-4 w-4" />,
        description: 'Pedido cancelado'
      },
    };
    return configs[statusId] || { 
      label: 'Desconhecido', 
      color: 'text-gray-700', 
      bg: 'bg-gray-50', 
      border: 'border-gray-200',
      icon: <AlertCircle className="h-4 w-4" />,
      description: 'Status não identificado'
    };
  };

  const statusConfig = getStatusConfig(pedido.status_id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden">
        {/* Header com gradiente */}
        <div className="bg-gradient-to-r from-accent/10 via-accent/5 to-background px-6 py-5 border-b">
          <DialogHeader className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-accent rounded-xl shadow-sm">
                  <ShoppingCart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold text-foreground">
                    Pedido {pedido.numero_pedido || 'N/A'}
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground">
                    Visualize os detalhes completos do pedido
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
                  {statusConfig.description}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Seção: Informações do Cliente */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              <User className="h-4 w-4" />
              Informações do Cliente
            </div>
            
            <div className="p-4 bg-muted/40 rounded-xl border">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-lg">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {pedido.cliente_nome || 'Cliente não informado'}
                  </p>
                  {pedido.cliente?.email && (
                    <p className="text-sm text-muted-foreground">
                      {pedido.cliente.email}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Seção: Datas */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              <Calendar className="h-4 w-4" />
              Cronograma
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Data do Pedido */}
              <div className="p-4 bg-muted/40 rounded-xl border">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-blue-100 rounded-md">
                    <Calendar className="h-3.5 w-3.5 text-blue-600" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground uppercase">
                    Data do Pedido
                  </span>
                </div>
                <p className="text-lg font-semibold text-foreground">
                  {formatDate(pedido.data_pedido)}
                </p>
              </div>

              {/* Data de Entrega */}
              <div className="p-4 bg-muted/40 rounded-xl border">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-orange-100 rounded-md">
                    <Truck className="h-3.5 w-3.5 text-orange-600" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground uppercase">
                    Previsão de Entrega
                  </span>
                </div>
                <p className="text-lg font-semibold text-foreground">
                  {formatDate(pedido.data_entrega)}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Seção: Valor */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              <DollarSign className="h-4 w-4" />
              Valor do Pedido
            </div>
            
            <div className="p-5 bg-gradient-to-r from-accent/10 to-accent/5 rounded-xl border border-accent/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Valor Total</p>
                  <p className="text-3xl font-bold text-accent">
                    {formatCurrency(pedido.valor_total)}
                  </p>
                </div>
                <div className="p-3 bg-accent/20 rounded-xl">
                  <DollarSign className="h-6 w-6 text-accent" />
                </div>
              </div>
            </div>
          </div>

          {/* Observações */}
          {pedido.observacoes && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  <FileText className="h-4 w-4" />
                  Observações
                </div>
                <div className="p-4 bg-yellow-50/50 rounded-xl border border-yellow-100">
                  <p className="text-sm text-foreground leading-relaxed">
                    {pedido.observacoes}
                  </p>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Rodapé com metadados */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>Criado em: {formatDate(pedido.data_criacao)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5" />
              <span>ID: {pedido.id}</span>
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
                onEdit(pedido);
              }} 
              className="flex-1 h-11 bg-accent hover:bg-accent/90 gap-2"
            >
              <Edit className="h-4 w-4" />
              Editar Pedido
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PedidoViewDialog;
