import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  ArrowRightLeft, 
  DollarSign, 
  Calendar, 
  FileText, 
  Tag, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  X, 
  Save, 
  Loader2,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface TransacaoFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export function TransacaoForm({ isOpen, onOpenChange, onSubmit, isLoading }: TransacaoFormProps) {
  const [formData, setFormData] = React.useState({
    tipo: 'entrada',
    valor: '',
    data: '',
    descricao: '',
    categoria: '',
    formaPagamento: 'Boleto',
    status: 'Pendente'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      valor: parseFloat(formData.valor) || 0
    });
    setFormData({
      tipo: 'entrada',
      valor: '',
      data: '',
      descricao: '',
      categoria: '',
      formaPagamento: 'Boleto',
      status: 'Pendente'
    });
  };

  const formatCurrency = (value: string) => {
    const number = parseFloat(value);
    if (isNaN(number)) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(number);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
      'Pago': { label: 'Pago', color: 'text-green-700', bg: 'bg-green-50', icon: <CheckCircle2 className="h-3 w-3" /> },
      'Pendente': { label: 'Pendente', color: 'text-yellow-700', bg: 'bg-yellow-50', icon: <Clock className="h-3 w-3" /> },
      'Atrasado': { label: 'Atrasado', color: 'text-red-700', bg: 'bg-red-50', icon: <AlertCircle className="h-3 w-3" /> },
    };
    const config = statusMap[status] || statusMap['Pendente'];
    return (
      <Badge className={`${config.bg} ${config.color} border-0 gap-1`}>
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto p-0 gap-0">
        {/* Header com Indicador de Tipo */}
        <div className={`px-6 py-6 text-white transition-all duration-300 ${
          formData.tipo === 'entrada' 
            ? 'bg-gradient-to-br from-green-500 via-green-600 to-green-700' 
            : 'bg-gradient-to-br from-red-500 via-red-600 to-red-700'
        }`}>
          <DialogHeader className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg">
                  {formData.tipo === 'entrada' ? (
                    <TrendingUp className="h-6 w-6 text-white" />
                  ) : (
                    <TrendingDown className="h-6 w-6 text-white" />
                  )}
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-white">
                    Nova Transação
                  </DialogTitle>
                  <p className="text-sm text-white/80 flex items-center gap-2">
                    {formData.tipo === 'entrada' ? 'Registrar entrada de valor' : 'Registrar saída de valor'}
                  </p>
                </div>
              </div>
              
              {/* Preview do Valor */}
              {formData.valor && (
                <div className="text-right">
                  <p className="text-xs text-white/70 mb-1">Valor Total</p>
                  <p className="text-3xl font-bold text-white">
                    {formatCurrency(formData.valor)}
                  </p>
                </div>
              )}
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6 bg-gradient-to-b from-muted/30 to-background">
          {/* Seletor de Tipo (Entrada/Saída) */}
          <Card className="border-2 overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, tipo: 'entrada' })}
                  className={`p-4 flex items-center justify-center gap-2 transition-all ${
                    formData.tipo === 'entrada' 
                      ? 'bg-green-50 text-green-700 border-b-2 border-green-500' 
                      : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                  }`}
                >
                  <TrendingUp className="h-5 w-5" />
                  <span className="font-semibold">Entrada</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, tipo: 'saida' })}
                  className={`p-4 flex items-center justify-center gap-2 transition-all ${
                    formData.tipo === 'saida' 
                      ? 'bg-red-50 text-red-700 border-b-2 border-red-500' 
                      : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                  }`}
                >
                  <TrendingDown className="h-5 w-5" />
                  <span className="font-semibold">Saída</span>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Grid de 2 Colunas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Valor */}
            <div className="space-y-2">
              <Label htmlFor="valor" className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                Valor *
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">R$</span>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                  className="pl-10 h-12 text-lg font-semibold"
                  required
                />
              </div>
              {formData.valor && (
                <p className={`text-sm font-medium ${
                  formData.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formData.tipo === 'entrada' ? '+' : '-'} {formatCurrency(formData.valor)}
                </p>
              )}
            </div>

            {/* Data */}
            <div className="space-y-2">
              <Label htmlFor="data" className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Data *
              </Label>
              <Input
                id="data"
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                className="h-12"
                required
              />
            </div>

            {/* Categoria */}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="categoria" className="text-sm font-medium flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                Categoria
              </Label>
              <Input
                id="categoria"
                placeholder="Ex: Vendas, Serviços, Aluguel, Fornecedores..."
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                className="h-12"
              />
              <p className="text-xs text-muted-foreground">Digite a categoria da transação</p>
            </div>

            {/* Descrição */}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="descricao" className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Descrição
              </Label>
              <Input
                id="descricao"
                placeholder="Descreva a transação..."
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                className="h-12"
              />
            </div>

            {/* Forma de Pagamento */}
            <div className="space-y-2">
              <Label htmlFor="formaPagamento" className="text-sm font-medium flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                Forma de Pagamento
              </Label>
              <Select 
                value={formData.formaPagamento} 
                onValueChange={(v) => setFormData({ ...formData, formaPagamento: v })}
              >
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Boleto">Boleto</SelectItem>
                  <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                  <SelectItem value="Cartão de Débito">Cartão de Débito</SelectItem>
                  <SelectItem value="PIX">PIX</SelectItem>
                  <SelectItem value="Transferência">Transferência</SelectItem>
                  <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                Status
              </Label>
              <Select 
                value={formData.status} 
                onValueChange={(v) => setFormData({ ...formData, status: v })}
              >
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pago">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      Pago
                    </div>
                  </SelectItem>
                  <SelectItem value="Pendente">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-yellow-500" />
                      Pendente
                    </div>
                  </SelectItem>
                  <SelectItem value="Atrasado">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      Atrasado
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Status atual:</span>
                {getStatusBadge(formData.status)}
              </div>
            </div>
          </div>

          {/* Resumo */}
          <Card className={`border-2 ${
            formData.tipo === 'entrada' ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'
          }`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    formData.tipo === 'entrada' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {formData.tipo === 'entrada' ? (
                      <TrendingUp className={`h-5 w-5 ${formData.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`} />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Resumo da Transação</p>
                    <p className="font-semibold text-foreground">
                      {formData.categoria || 'Sem categoria'} • {formData.formaPagamento}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${
                    formData.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formData.tipo === 'entrada' ? '+' : '-'} {formatCurrency(formData.valor || '0')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer com ações */}
          <DialogFooter className="flex gap-3 pt-6 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1 h-12"
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className={`flex-1 h-12 gap-2 ${
                formData.tipo === 'entrada' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {formData.tipo === 'entrada' ? 'Registrar Entrada' : 'Registrar Saída'}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default TransacaoForm;
