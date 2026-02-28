import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { 
  Package, 
  Edit, 
  Box, 
  X, 
  ArrowRight,
  Tag,
  DollarSign,
  Layers,
  Archive,
  CheckCircle2,
  XCircle,
  Clock,
  Hash
} from 'lucide-react';

interface ProdutoViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  produto: any | null;
  onEdit?: (produto: any) => void;
}

const ProdutoViewDialog: React.FC<ProdutoViewDialogProps> = ({
  open,
  onOpenChange,
  produto,
  onEdit
}) => {
  if (!produto) return null;

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

  const getTipoConfig = (tipo: string) => {
    return tipo === 'produto' 
      ? { 
          label: 'Produto Físico', 
          color: 'text-blue-700', 
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: <Box className="h-4 w-4" />
        }
      : { 
          label: 'Serviço', 
          color: 'text-purple-700', 
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          icon: <Package className="h-4 w-4" />
        };
  };

  const getStatusConfig = (ativo: boolean) => {
    return ativo 
      ? { 
          label: 'Ativo', 
          color: 'text-green-700', 
          bg: 'bg-green-50',
          border: 'border-green-200',
          icon: <CheckCircle2 className="h-4 w-4" />
        }
      : { 
          label: 'Inativo', 
          color: 'text-gray-700', 
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          icon: <XCircle className="h-4 w-4" />
        };
  };

  const tipoConfig = getTipoConfig(produto.tipo_produto);
  const statusConfig = getStatusConfig(produto.ativo);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden">
        {/* Header com gradiente */}
        <div className="bg-gradient-to-r from-accent/10 via-accent/5 to-background px-6 py-5 border-b">
          <DialogHeader className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-accent rounded-xl shadow-sm">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold text-foreground">
                    {produto.nome}
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground">
                    Detalhes do produto/serviço
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
          {/* Tipo Card */}
          <div className={`p-4 ${tipoConfig.bg} ${tipoConfig.border} border rounded-xl`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${tipoConfig.bg} ${tipoConfig.color}`}>
                {tipoConfig.icon}
              </div>
              <div>
                <p className={`text-sm font-medium ${tipoConfig.color}`}>
                  Tipo: {tipoConfig.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {produto.tipo_produto === 'produto' ? 'Item físico com controle de estoque' : 'Serviço prestado'}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Seção: Identificação */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              <Tag className="h-4 w-4" />
              Identificação
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Código */}
              <div className="p-4 bg-muted/40 rounded-xl border">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-primary/10 rounded-md">
                    <Hash className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground uppercase">
                    Código
                  </span>
                </div>
                <p className="text-lg font-semibold text-foreground font-mono">
                  {produto.codigo_produto || 'N/A'}
                </p>
              </div>

              {/* Categoria */}
              <div className="p-4 bg-muted/40 rounded-xl border">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-primary/10 rounded-md">
                    <Archive className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground uppercase">
                    Categoria
                  </span>
                </div>
                <p className="text-lg font-semibold text-foreground">
                  {produto.categoria || 'Não definida'}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Seção: Descrição */}
          {produto.descricao && (
            <>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  <Layers className="h-4 w-4" />
                  Descrição
                </div>
                <div className="p-4 bg-muted/40 rounded-xl border">
                  <p className="text-sm text-foreground leading-relaxed">
                    {produto.descricao}
                  </p>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Seção: Valor e Estoque */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              <DollarSign className="h-4 w-4" />
              Valor e Estoque
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Valor Base */}
              <div className="p-4 bg-gradient-to-r from-accent/10 to-accent/5 rounded-xl border border-accent/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-accent/20 rounded-md">
                    <DollarSign className="h-3.5 w-3.5 text-accent" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground uppercase">
                    Valor Base
                  </span>
                </div>
                <p className="text-xl font-bold text-accent">
                  {formatCurrency(produto.valor_base)}
                </p>
              </div>

              {/* Unidade */}
              <div className="p-4 bg-muted/40 rounded-xl border">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-primary/10 rounded-md">
                    <Box className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground uppercase">
                    Unidade
                  </span>
                </div>
                <p className="text-lg font-semibold text-foreground">
                  {produto.unidade_medida || 'un'}
                </p>
              </div>

              {/* Estoque Mínimo */}
              <div className="p-4 bg-muted/40 rounded-xl border">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-primary/10 rounded-md">
                    <Archive className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground uppercase">
                    Estoque Mín.
                  </span>
                </div>
                <p className="text-lg font-semibold text-foreground">
                  {produto.estoque_minimo || '0'}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Rodapé com metadados */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>Criado em: {formatDate(produto.data_criacao)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Hash className="h-3.5 w-3.5" />
              <span>ID: {produto.id}</span>
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
                onEdit(produto);
              }} 
              className="flex-1 h-11 bg-accent hover:bg-accent/90 gap-2"
            >
              <Edit className="h-4 w-4" />
              Editar Produto
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProdutoViewDialog;
