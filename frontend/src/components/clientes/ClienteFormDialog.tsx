import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { 
  Building2, 
  Calendar, 
  Plus, 
  Edit, 
  Check, 
  AlertCircle,
  X,
  Save,
  Loader2,
  Hash,
  FileText,
  Briefcase
} from 'lucide-react';
import { ClienteFormData, PORTE_EMPRESAS } from '@/types/cliente';

interface ClienteFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ClienteFormData) => Promise<void>;
  editCliente?: ClienteFormData | null;
  isLoading?: boolean;
}

const initialFormData: ClienteFormData = {
  razao_social: '',
  nome_fantasia: '',
  cnpj: '',
  inscricao_estadual: '',
  porte_empresa: 'ME',
  data_fundacao: ''
};

const ClienteFormDialog: React.FC<ClienteFormDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  editCliente,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<ClienteFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editCliente) {
      setFormData(editCliente);
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [editCliente, open]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.razao_social.trim()) {
      newErrors.razao_social = 'Razão social é obrigatória';
    }
    if (!formData.cnpj.trim()) {
      newErrors.cnpj = 'CNPJ é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await onSubmit(formData);
    }
  };

  const handleChange = (field: keyof ClienteFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const isEditing = !!editCliente;

  const getPorteBadge = (porte: string) => {
    const porteMap: Record<string, { label: string; color: string; bg: string }> = {
      'MEI': { label: 'MEI', color: 'text-blue-700', bg: 'bg-blue-50' },
      'ME': { label: 'Microempresa', color: 'text-green-700', bg: 'bg-green-50' },
      'EPP': { label: 'Pequeno Porte', color: 'text-yellow-700', bg: 'bg-yellow-50' },
      'MEDIA': { label: 'Médio Porte', color: 'text-purple-700', bg: 'bg-purple-50' },
      'GRANDE': { label: 'Grande Porte', color: 'text-red-700', bg: 'bg-red-50' },
    };
    const config = porteMap[porte] || { label: porte, color: 'text-gray-700', bg: 'bg-gray-50' };
    return (
      <Badge className={`${config.bg} ${config.color} border-0`}>
        {config.label}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0">
        {/* Header com gradiente */}
        <div className="bg-gradient-to-r from-accent/10 to-accent/5 px-6 py-4 border-b">
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent rounded-lg">
                {isEditing ? <Edit className="h-5 w-5 text-white" /> : <Plus className="h-5 w-5 text-white" />}
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold">
                  {isEditing ? 'Editar Cliente' : 'Novo Cliente'}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  {isEditing 
                    ? 'Atualize as informações do cliente.' 
                    : 'Cadastre um novo cliente no sistema.'}
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
              <div className="space-y-2">
                <Label htmlFor="razao_social" className="text-sm font-medium flex items-center gap-1.5">
                  Razão Social
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Obrigatório</Badge>
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="razao_social"
                    placeholder="Razão social completa"
                    value={formData.razao_social}
                    onChange={(e) => handleChange('razao_social', e.target.value)}
                    className={`pl-10 h-11 ${errors.razao_social ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  />
                </div>
                {errors.razao_social && (
                  <div className="flex items-center gap-1 text-red-500 text-xs">
                    <AlertCircle className="h-3 w-3" />
                    {errors.razao_social}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="nome_fantasia" className="text-sm font-medium">
                  Nome Fantasia
                </Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="nome_fantasia"
                    placeholder="Nome comercial"
                    value={formData.nome_fantasia}
                    onChange={(e) => handleChange('nome_fantasia', e.target.value)}
                    className="pl-10 h-11"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Nome de fantasia da empresa</p>
              </div>
            </div>
          </div>

          <Separator className="my-5" />

          {/* Seção: Documentos */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              <FileText className="h-4 w-4" />
              Documentos
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cnpj" className="text-sm font-medium flex items-center gap-1.5">
                  CNPJ
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Obrigatório</Badge>
                </Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="cnpj"
                    placeholder="00.000.000/0000-00"
                    value={formData.cnpj}
                    onChange={(e) => handleChange('cnpj', e.target.value)}
                    className={`pl-10 h-11 font-mono ${errors.cnpj ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  />
                </div>
                {errors.cnpj && (
                  <div className="flex items-center gap-1 text-red-500 text-xs">
                    <AlertCircle className="h-3 w-3" />
                    {errors.cnpj}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="inscricao_estadual" className="text-sm font-medium">
                  Inscrição Estadual
                </Label>
                <Input
                  id="inscricao_estadual"
                  placeholder="Inscrição estadual"
                  value={formData.inscricao_estadual}
                  onChange={(e) => handleChange('inscricao_estadual', e.target.value)}
                  className="h-11 font-mono"
                />
              </div>
            </div>
          </div>

          <Separator className="my-5" />

          {/* Seção: Informações Adicionais */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              <Calendar className="h-4 w-4" />
              Informações Adicionais
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="porte_empresa" className="text-sm font-medium">
                  Porte da Empresa
                </Label>
                <Select 
                  value={formData.porte_empresa} 
                  onValueChange={(value) => handleChange('porte_empresa', value)}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Selecione o porte" />
                  </SelectTrigger>
                  <SelectContent position="popper" sideOffset={5}>
                    {PORTE_EMPRESAS.map((porte) => (
                      <SelectItem key={porte.value} value={porte.value}>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-accent" />
                          <span>{porte.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Porte selecionado:</span>
                  {getPorteBadge(formData.porte_empresa)}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="data_fundacao" className="text-sm font-medium">
                  Data de Fundação
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="data_fundacao"
                    type="date"
                    value={formData.data_fundacao}
                    onChange={(e) => handleChange('data_fundacao', e.target.value)}
                    className="pl-10 h-11"
                  />
                </div>
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
              disabled={isLoading}
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
                  {isEditing ? 'Salvar Alterações' : 'Cadastrar Cliente'}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClienteFormDialog;
