import React, { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { 
  Plus, 
  Edit, 
  FileText, 
  User, 
  Building2, 
  Phone, 
  Mail, 
  Loader2, 
  AlertCircle,
  Hash,
  Calendar,
  DollarSign,
  Package,
  Tag,
  X,
  Save,
  TrendingUp,
  UserCircle,
  MapPin
} from 'lucide-react';
import { OrcamentoFormData, createEmptyOrcamentoForm, createEmptyItem } from '@/types/orcamento';

interface OrcamentoFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditMode: boolean;
  formData: OrcamentoFormData;
  onSubmit: (e: React.FormEvent) => void;
  onFormDataChange: (data: OrcamentoFormData) => void;
  isLoading?: boolean;
  clientes?: any[];
  leads?: any[];
  produtos?: any[];
}

const OrcamentoFormDialog: React.FC<OrcamentoFormDialogProps> = ({
  open,
  onOpenChange,
  isEditMode,
  formData,
  onSubmit,
  onFormDataChange,
  isLoading = false,
  clientes,
  leads,
  produtos
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Use clientes and leads from props
  const clientesData = clientes;
  const leadsData = leads;

  // Auto-fill fields when lead is selected
  useEffect(() => {
    if (formData.leadId && formData.leadId !== 'none' && leadsData && leadsData.length > 0) {
      const selectedLead = leadsData.find((l: any) => String(l.id) === String(formData.leadId));
      if (selectedLead) {
        onFormDataChange({
          ...formData,
          empresa: selectedLead.nome_empresa || selectedLead.empresa_nome || '',
          cnpj: selectedLead.cnpj || '',
          contato: selectedLead.contato_principal || '',
          telefone: selectedLead.telefone_whatsapp || selectedLead.telefone_contato || '',
          email: selectedLead.email_contato || ''
        });
      }
    } else if ((formData.leadId === 'none' || formData.leadId === '') && (formData.origem === 'lead')) {
      // Clear fields when "none" is selected for lead
      onFormDataChange({
        ...formData,
        empresa: '',
        cnpj: '',
        contato: '',
        telefone: '',
        email: ''
      });
    }
  }, [formData.leadId, formData.origem, leadsData, onFormDataChange]);

  // Auto-fill fields when cliente is selected
  useEffect(() => {
    if (formData.clienteId && formData.clienteId !== 'none' && clientesData && clientesData.length > 0) {
      const selectedCliente = clientesData.find((c: any) => String(c.id) === String(formData.clienteId));
      if (selectedCliente) {
        onFormDataChange({
          ...formData,
          empresa: selectedCliente.razao_social || selectedCliente.nome_fantasia || '',
          cnpj: selectedCliente.cnpj || '',
          contato: selectedCliente.nome_fantasia || '',
          telefone: selectedCliente.telefone_whatsapp || selectedCliente.telefone_financeiro || '',
          email: selectedCliente.email_financeiro || ''
        });
      }
    } else if ((formData.clienteId === 'none' || formData.clienteId === '') && (formData.origem === 'cliente')) {
      // Clear fields when "none" is selected for cliente
      onFormDataChange({
        ...formData,
        empresa: '',
        cnpj: '',
        contato: '',
        telefone: '',
        email: ''
      });
    }
  }, [formData.clienteId, formData.origem, clientesData, onFormDataChange]);

  // Filtrar clientes para o select
  const clientesOptions = useMemo(() => {
    if (!clientesData) return [];
    return clientesData.map((c: any) => ({
      id: c.id,
      label: `${c.razao_social || c.nome_fantasia || 'Sem nome'} ${c.cnpj ? `(${c.cnpj})` : ''}`.trim()
    }));
  }, [clientesData]);

  // Filtrar leads para o select
  const leadsOptions = useMemo(() => {
    if (!leadsData) return [];
    return leadsData.map((l: any) => ({
      id: l.id,
      label: `${l.contato_principal || l.nome_empresa || 'Sem nome'} ${l.cnpj ? `(${l.cnpj})` : ''}`.trim()
    }));
  }, [leadsData]);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        onFormDataChange(createEmptyOrcamentoForm());
        setErrors({});
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open, onFormDataChange]);

  // Produtos options
  const produtosOptions = useMemo(() => {
    if (!produtos) return [];
    return produtos.map((p: any) => ({
      id: p.id,
      nome: p.nome,
      valor_base: p.valor_base,
      label: `${p.nome} ${p.codigo_produto ? `(${p.codigo_produto})` : ''} - R$ ${Number(p.valor_base || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`.trim()
    }));
  }, [produtos]);

  // Validate form before submission
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.empresa.trim()) {
      newErrors.empresa = 'Nome da empresa é obrigatório';
    }
    if (!formData.vendedor.trim()) {
      newErrors.vendedor = 'Nome do vendedor é obrigatório';
    }
    if (formData.itens.length === 0 || !formData.itens.some(item => item.produto.trim())) {
      newErrors.itens = 'Pelo menos um item é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(e);
    }
  };

  const addItem = () => {
    onFormDataChange({
      ...formData,
      itens: [...formData.itens, createEmptyItem()]
    });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItens = [...formData.itens];
    newItens[index] = { ...newItens[index], [field]: value };
    onFormDataChange({ ...formData, itens: newItens });
    if (errors.itens) {
      setErrors({ ...errors, itens: '' });
    }
  };

  const removeItem = (index: number) => {
    if (formData.itens.length > 1) {
      const newItens = formData.itens.filter((_, i) => i !== index);
      onFormDataChange({ ...formData, itens: newItens });
    }
  };

  // Calculate totals
  const calculateItemTotal = (item: typeof formData.itens[0]) => {
    const base = item.quantidade * item.valorUnitario;
    const discount = item.descontoPercentual > 0 
      ? base * (item.descontoPercentual / 100)
      : item.descontoValor;
    return base - discount;
  };

  const totalGeral = formData.itens.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  const totalDesconto = formData.descontoGeral > 0 ? totalGeral * (formData.descontoGeral / 100) : 0;
  const valorFinal = totalGeral - totalDesconto;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-0">
        {/* Header com gradiente */}
        <div className="bg-gradient-to-r from-accent/10 to-accent/5 px-6 py-4 border-b">
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent rounded-lg">
                {isEditMode ? <Edit className="h-5 w-5 text-white" /> : <Plus className="h-5 w-5 text-white" />}
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold">
                  {isEditMode ? 'Editar Orçamento' : 'Novo Orçamento'}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  {isEditMode 
                    ? 'Atualize as informações do orçamento.' 
                    : 'Preencha os dados para criar um novo orçamento.'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
          {/* Seção: Origem */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              <TrendingUp className="h-4 w-4" />
              Origem do Orçamento
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Origem</Label>
              <Select 
                value={formData.origem} 
                onValueChange={(value: 'lead' | 'cliente') => 
                  onFormDataChange({ ...formData, origem: value, leadId: '', clienteId: '' })
                }
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Selecione a origem" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={5}>
                  <SelectItem value="lead">
                    <div className="flex items-center gap-2">
                      <UserCircle className="h-4 w-4 text-blue-500" />
                      Lead
                    </div>
                  </SelectItem>
                  <SelectItem value="cliente">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-green-500" />
                      Cliente Existente
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">De onde veio esta oportunidade de negócio</p>
            </div>
          </div>

          {/* Lead/Cliente Selector */}
          {formData.origem === 'lead' && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <UserCircle className="h-4 w-4 text-blue-500" />
                  Selecionar Lead (Opcional)
                </Label>
                <Select 
                  value={formData.leadId || 'none'} 
                  onValueChange={(value) => onFormDataChange({ ...formData, leadId: value === 'none' ? '' : value })}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Selecione um lead..." />
                  </SelectTrigger>
                  <SelectContent position="popper" sideOffset={5} className="max-h-60">
                    <SelectItem value="none">
                      <em>-- Nenhum (novo lead) --</em>
                    </SelectItem>
                    {leadsOptions.map((lead) => (
                      <SelectItem key={lead.id} value={String(lead.id)}>
                        {lead.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-blue-600">
                  Deixe selecionado "-- Nenhum" para criar orçamento sem vincular a um lead existente
                </p>
              </div>
            </div>
          )}

          {formData.origem === 'cliente' && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-green-500" />
                  Selecionar Cliente (Opcional)
                </Label>
                <Select 
                  value={formData.clienteId || 'none'} 
                  onValueChange={(value) => onFormDataChange({ ...formData, clienteId: value === 'none' ? '' : value })}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Selecione um cliente..." />
                  </SelectTrigger>
                  <SelectContent position="popper" sideOffset={5} className="max-h-60">
                    <SelectItem value="none">
                      <em>-- Nenhum (novo cliente) --</em>
                    </SelectItem>
                    {clientesOptions.map((cliente) => (
                      <SelectItem key={cliente.id} value={String(cliente.id)}>
                        {cliente.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-green-600">
                  Deixe selecionado "-- Nenhum" para criar orçamento sem vincular a um cliente existente
                </p>
              </div>
            </div>
          )}

          <Separator />

          {/* Seção: Dados da Empresa */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              <Building2 className="h-4 w-4" />
              Dados da Empresa
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="empresa" className="text-sm font-medium flex items-center gap-1.5">
                  Empresa
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Obrigatório</Badge>
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="empresa"
                    placeholder="Nome da empresa"
                    value={formData.empresa}
                    onChange={(e) => {
                      onFormDataChange({ ...formData, empresa: e.target.value });
                      if (errors.empresa) setErrors({ ...errors, empresa: '' });
                    }}
                    className={`pl-10 h-11 ${errors.empresa ? 'border-red-500 focus:ring-red-500' : ''}`}
                    required
                  />
                </div>
                {errors.empresa && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.empresa}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">Razão social ou nome fantasia</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnpj" className="text-sm font-medium">CNPJ</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="cnpj"
                    placeholder="00.000.000/0000-00"
                    value={formData.cnpj}
                    onChange={(e) => onFormDataChange({ ...formData, cnpj: e.target.value })}
                    className="pl-10 h-11 font-mono"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Cadastro Nacional de Pessoa Jurídica</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contato" className="text-sm font-medium">Contato</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="contato"
                    placeholder="Nome do contato"
                    value={formData.contato}
                    onChange={(e) => onFormDataChange({ ...formData, contato: e.target.value })}
                    className="pl-10 h-11"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone" className="text-sm font-medium">Telefone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="telefone"
                    placeholder="(11) 99999-9999"
                    value={formData.telefone}
                    onChange={(e) => onFormDataChange({ ...formData, telefone: e.target.value })}
                    className="pl-10 h-11"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="contato@empresa.com"
                    value={formData.email}
                    onChange={(e) => onFormDataChange({ ...formData, email: e.target.value })}
                    className="pl-10 h-11"
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Seção: Cabeçalho do Orçamento */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              <FileText className="h-4 w-4" />
              Cabeçalho do Orçamento
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vendedor" className="text-sm font-medium flex items-center gap-1.5">
                  Vendedor
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Obrigatório</Badge>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="vendedor"
                    placeholder="Nome do vendedor"
                    value={formData.vendedor}
                    onChange={(e) => {
                      onFormDataChange({ ...formData, vendedor: e.target.value });
                      if (errors.vendedor) setErrors({ ...errors, vendedor: '' });
                    }}
                    className={`pl-10 h-11 ${errors.vendedor ? 'border-red-500 focus:ring-red-500' : ''}`}
                    required
                  />
                </div>
                {errors.vendedor && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.vendedor}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="filial" className="text-sm font-medium">Filial</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="filial"
                    placeholder="Filial responsável"
                    value={formData.filial}
                    onChange={(e) => onFormDataChange({ ...formData, filial: e.target.value })}
                    className="pl-10 h-11"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="validade" className="text-sm font-medium">Validade (dias)</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="validade"
                    type="number"
                    min="1"
                    value={formData.validade}
                    onChange={(e) => onFormDataChange({ ...formData, validade: parseInt(e.target.value) || 30 })}
                    className="pl-10 h-11"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Prazo de validade do orçamento</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Seção: Itens do Orçamento */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                <Package className="h-4 w-4" />
                Itens do Orçamento
                <Badge variant="secondary" className="text-[10px]">Obrigatório</Badge>
              </div>
              {errors.itens && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.itens}
                </p>
              )}
            </div>
            {formData.itens.map((item, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4 bg-muted/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Item {index + 1}</span>
                  {formData.itens.length > 1 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeItem(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      Remover
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Produto/Serviço *</Label>
                    <Input
                      placeholder="Nome do produto/serviço"
                      value={item.produto}
                      onChange={(e) => updateItem(index, 'produto', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Descrição</Label>
                    <Input
                      placeholder="Descrição detalhada"
                      value={item.descricao}
                      onChange={(e) => updateItem(index, 'descricao', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Qtd *</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantidade}
                      onChange={(e) => updateItem(index, 'quantidade', parseInt(e.target.value) || 1)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Valor Unit. *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      value={item.valorUnitario}
                      onChange={(e) => updateItem(index, 'valorUnitario', parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Desc. (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={item.descontoPercentual}
                      onChange={(e) => updateItem(index, 'descontoPercentual', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Desc. (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.descontoValor}
                      onChange={(e) => updateItem(index, 'descontoValor', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <div className="text-right p-2 bg-muted/30 rounded">
                  <span className="text-sm text-muted-foreground">Total Item: </span>
                  <span className="font-semibold">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculateItemTotal(item))}
                  </span>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addItem} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Item
            </Button>
          </div>

          <Separator />

          {/* Seção: Valores */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              <DollarSign className="h-4 w-4" />
              Valores e Descontos
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="descontoGeral" className="text-sm font-medium">Desconto Geral (%)</Label>
                <Input
                  id="descontoGeral"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.descontoGeral}
                  onChange={(e) => onFormDataChange({ ...formData, descontoGeral: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parcelas" className="text-sm font-medium">Parcelas</Label>
                <Input
                  id="parcelas"
                  type="number"
                  min="1"
                  value={formData.parcelas}
                  onChange={(e) => onFormDataChange({ ...formData, parcelas: parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>
            
            {/* Resumo de Valores */}
            <div className="p-4 bg-muted/30 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalGeral)}</span>
              </div>
              {totalDesconto > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Desconto ({formData.descontoGeral}%):</span>
                  <span>-{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalDesconto)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span className="text-primary">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorFinal)}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Seção: Observações */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              <Tag className="h-4 w-4" />
              Observações
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="observacoes" className="text-sm font-medium">Observações Adicionais</Label>
              <Input
                id="observacoes"
                placeholder="Informações complementares, condições especiais, prazos de entrega..."
                value={formData.observacoes}
                onChange={(e) => onFormDataChange({ ...formData, observacoes: e.target.value })}
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">Informações adicionais sobre o orçamento</p>
            </div>
          </div>

          {/* Footer com ações */}
          <DialogFooter className="flex gap-3 pt-6 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              disabled={isLoading}
              className="flex-1 h-11"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="flex-1 h-11 bg-accent hover:bg-accent/90 gap-2" 
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
                  {isEditMode ? 'Atualizar Orçamento' : 'Criar Orçamento'}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrcamentoFormDialog;

