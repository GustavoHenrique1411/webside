import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Package, Plus, Edit, Box, X, Save, Loader2, Tag, DollarSign, Layers, Archive } from 'lucide-react';

interface ProdutoFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  produto?: any;
  loading?: boolean;
}

const defaultFormData = {
  codigo_produto: '',
  nome: '',
  descricao: '',
  tipo_produto: 'servico',
  categoria: '',
  valor_base: 0,
  unidade_medida: 'un',
  estoque_minimo: 0,
};

export function ProdutoFormDialog({ open, onOpenChange, onSubmit, produto, loading }: ProdutoFormDialogProps) {
  const [formData, setFormData] = useState(defaultFormData);

  // Reset form when dialog opens/closes or when produto changes
  useEffect(() => {
    if (open) {
      if (produto) {
        setFormData({
          codigo_produto: produto.codigo_produto || '',
          nome: produto.nome || '',
          descricao: produto.descricao || '',
          tipo_produto: produto.tipo_produto || 'servico',
          categoria: produto.categoria || '',
          valor_base: produto.valor_base || 0,
          unidade_medida: produto.unidade_medida || 'un',
          estoque_minimo: produto.estoque_minimo || 0,
        });
      } else {
        setFormData(defaultFormData);
      }
    }
  }, [open, produto]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isEditing = !!produto;

  const getTipoBadge = (tipo: string) => {
    const tipoMap: Record<string, { label: string; color: string; bg: string }> = {
      'produto': { label: 'Produto', color: 'text-blue-700', bg: 'bg-blue-100' },
      'servico': { label: 'Serviço', color: 'text-purple-700', bg: 'bg-purple-100' },
    };
    return tipoMap[tipo] || { label: 'Desconhecido', color: 'text-gray-700', bg: 'bg-gray-100' };
  };

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
                  {isEditing ? 'Editar Produto' : 'Novo Produto'}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  {isEditing ? 'Atualize as informações do produto ou serviço.' : 'Cadastre um novo item no catálogo.'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4">
          {/* Seção: Identificação */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              <Tag className="h-4 w-4" />
              Identificação
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Código */}
              <div className="space-y-2">
                <Label htmlFor="codigo_produto" className="text-sm font-medium">
                  Código do Produto
                </Label>
                <div className="relative">
                  <Box className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="codigo_produto"
                    placeholder="Ex: PROD-001"
                    value={formData.codigo_produto}
                    onChange={(e) => setFormData({ ...formData, codigo_produto: e.target.value })}
                    className="pl-10 h-11"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Código único para identificação</p>
              </div>

              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-sm font-medium flex items-center gap-1.5">
                  Nome do Produto
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Obrigatório</Badge>
                </Label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="nome"
                    placeholder="Nome do produto ou serviço"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="pl-10 h-11"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">Nome comercial do item</p>
              </div>
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="descricao" className="text-sm font-medium">
                Descrição
              </Label>
              <Textarea
                id="descricao"
                placeholder="Descreva as características, especificações técnicas ou detalhes do serviço..."
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                rows={3}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">Esta descrição aparecerá nos orçamentos e pedidos</p>
            </div>
          </div>

          <Separator className="my-5" />

          {/* Seção: Classificação */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              <Layers className="h-4 w-4" />
              Classificação
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tipo */}
              <div className="space-y-2">
                <Label htmlFor="tipo_produto" className="text-sm font-medium">
                  Tipo
                </Label>
                <Select
                  value={formData.tipo_produto}
                  onValueChange={(value) => setFormData({ ...formData, tipo_produto: value })}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent position="popper" sideOffset={5}>
                    <SelectItem value="produto">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        Produto Físico
                      </div>
                    </SelectItem>
                    <SelectItem value="servico">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500" />
                        Serviço
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Tipo atual:</span>
                  <Badge className={`${getTipoBadge(formData.tipo_produto).bg} ${getTipoBadge(formData.tipo_produto).color} text-xs`}>
                    {getTipoBadge(formData.tipo_produto).label}
                  </Badge>
                </div>
              </div>

              {/* Categoria */}
              <div className="space-y-2">
                <Label htmlFor="categoria" className="text-sm font-medium">
                  Categoria
                </Label>
                <div className="relative">
                  <Archive className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="categoria"
                    placeholder="Ex: Software, Hardware, Consultoria"
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    className="pl-10 h-11"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Grupo de classificação</p>
              </div>
            </div>
          </div>

          <Separator className="my-5" />

          {/* Seção: Valor e Estoque */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              <DollarSign className="h-4 w-4" />
              Valor e Estoque
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Valor Base */}
              <div className="space-y-2">
                <Label htmlFor="valor_base" className="text-sm font-medium">
                  Valor Base
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">R$</span>
                  <Input
                    id="valor_base"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    value={formData.valor_base}
                    onChange={(e) => setFormData({ ...formData, valor_base: parseFloat(e.target.value) || 0 })}
                    className="pl-10 h-11 font-mono"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Preço padrão</p>
              </div>

              {/* Unidade */}
              <div className="space-y-2">
                <Label htmlFor="unidade_medida" className="text-sm font-medium">
                  Unidade
                </Label>
                <Select
                  value={formData.unidade_medida}
                  onValueChange={(value) => setFormData({ ...formData, unidade_medida: value })}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent position="popper" sideOffset={5}>
                    <SelectItem value="un">Unidade (un)</SelectItem>
                    <SelectItem value="kg">Quilograma (kg)</SelectItem>
                    <SelectItem value="lt">Litro (lt)</SelectItem>
                    <SelectItem value="hr">Hora (hr)</SelectItem>
                    <SelectItem value="mes">Mês</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Unidade de venda</p>
              </div>

              {/* Estoque Mínimo */}
              <div className="space-y-2">
                <Label htmlFor="estoque_minimo" className="text-sm font-medium">
                  Estoque Mínimo
                </Label>
                <div className="relative">
                  <Input
                    id="estoque_minimo"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.estoque_minimo}
                    onChange={(e) => setFormData({ ...formData, estoque_minimo: parseInt(e.target.value) || 0 })}
                    className="h-11"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Alerta de reposição</p>
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
                  {isEditing ? 'Salvar Alterações' : 'Cadastrar Produto'}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
