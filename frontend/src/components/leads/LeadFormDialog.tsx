import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { 
  User, 
  Building2, 
  Phone, 
  Mail, 
  Plus, 
  Edit, 
  X,
  Save,
  Loader2,
  Hash,
  Globe,
  Target,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { LeadFormData, LEAD_STATUS_OPTIONS, LEAD_ORIGIN_OPTIONS } from '@/types/lead';

interface LeadFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: LeadFormData) => Promise<void>;
  editData?: LeadFormData | null;
  isLoading?: boolean;
}

const LeadFormDialog: React.FC<LeadFormDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  editData,
  isLoading = false
}) => {
  const [formData, setFormData] = React.useState<LeadFormData>(editData || {
    nome: '',
    empresa: '',
    telefone: '',
    email: '',
    status: 'Novo',
    origem: 'Site'
  });

  const [touched, setTouched] = React.useState<Record<string, boolean>>({});
  const [currentStep, setCurrentStep] = React.useState(1);

  React.useEffect(() => {
    if (editData) {
      setFormData(editData);
      setCurrentStep(2); // Se estiver editando, mostrar todos os campos
    } else {
      setFormData({
        nome: '',
        empresa: '',
        telefone: '',
        email: '',
        status: 'Novo',
        origem: 'Site'
      });
      setCurrentStep(1);
    }
    setTouched({});
  }, [editData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const isEditing = !!editData;

  // Validação
  const getFieldError = (field: string): string | null => {
    if (!touched[field]) return null;
    
    switch (field) {
      case 'nome':
        return !formData.nome?.trim() ? 'Nome é obrigatório' : null;
      case 'empresa':
        return !formData.empresa?.trim() ? 'Empresa é obrigatória' : null;
      case 'telefone':
        return !formData.telefone?.trim() ? 'Telefone é obrigatório' : null;
      case 'email':
        if (!formData.email?.trim()) return null; // Email opcional
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(formData.email) ? 'Email inválido' : null;
      default:
        return null;
    }
  };

  const isFieldValid = (field: string): boolean => {
    const error = getFieldError(field);
    return touched[field] && !error;
  };

  const isFieldInvalid = (field: string): boolean => {
    const error = getFieldError(field);
    return touched[field] && !!error;
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // Calcular progresso
  const requiredFields = ['nome', 'empresa', 'telefone'];
  const filledRequiredFields = requiredFields.filter(field => {
    const value = formData[field as keyof LeadFormData];
    return typeof value === 'string' && value.trim().length > 0;
  }).length;
  const progress = Math.round((filledRequiredFields / requiredFields.length) * 100);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
      'Novo': { label: 'Novo', color: 'text-blue-700', bg: 'bg-blue-50', icon: <Sparkles className="h-3 w-3" /> },
      'Em Contato': { label: 'Em Contato', color: 'text-yellow-700', bg: 'bg-yellow-50', icon: <Phone className="h-3 w-3" /> },
      'Qualificado': { label: 'Qualificado', color: 'text-green-700', bg: 'bg-green-50', icon: <CheckCircle2 className="h-3 w-3" /> },
      'Proposta': { label: 'Proposta', color: 'text-purple-700', bg: 'bg-purple-50', icon: <Target className="h-3 w-3" /> },
      'Negociação': { label: 'Negociação', color: 'text-orange-700', bg: 'bg-orange-50', icon: <TrendingUp className="h-3 w-3" /> },
      'Fechado': { label: 'Fechado', color: 'text-emerald-700', bg: 'bg-emerald-50', icon: <CheckCircle2 className="h-3 w-3" /> },
      'Perdido': { label: 'Perdido', color: 'text-red-700', bg: 'bg-red-50', icon: <AlertCircle className="h-3 w-3" /> },
    };
    const config = statusMap[status] || { label: status, color: 'text-gray-700', bg: 'bg-gray-50', icon: <Hash className="h-3 w-3" /> };
    return (
      <Badge className={`${config.bg} ${config.color} border-0 gap-1`}>
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const getOriginBadge = (origin: string) => {
    const originMap: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
      'Site': { label: 'Site', color: 'text-blue-700', bg: 'bg-blue-50', icon: <Globe className="h-3 w-3" /> },
      'Indicação': { label: 'Indicação', color: 'text-green-700', bg: 'bg-green-50', icon: <Sparkles className="h-3 w-3" /> },
      'Redes Sociais': { label: 'Redes Sociais', color: 'text-purple-700', bg: 'bg-purple-50', icon: <TrendingUp className="h-3 w-3" /> },
      'Email': { label: 'Email', color: 'text-yellow-700', bg: 'bg-yellow-50', icon: <Mail className="h-3 w-3" /> },
      'Telefone': { label: 'Telefone', color: 'text-orange-700', bg: 'bg-orange-50', icon: <Phone className="h-3 w-3" /> },
      'Evento': { label: 'Evento', color: 'text-pink-700', bg: 'bg-pink-50', icon: <Sparkles className="h-3 w-3" /> },
      'Outro': { label: 'Outro', color: 'text-gray-700', bg: 'bg-gray-50', icon: <Hash className="h-3 w-3" /> },
    };
    const config = originMap[origin] || { label: origin, color: 'text-gray-700', bg: 'bg-gray-50', icon: <Globe className="h-3 w-3" /> };
    return (
      <Badge className={`${config.bg} ${config.color} border-0 gap-1`}>
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const canProceedToStep2 = formData.nome?.trim() && formData.empresa?.trim() && formData.telefone?.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto p-0 gap-0">
        {/* Header */}
        <div className="bg-gradient-to-br from-accent via-accent/90 to-accent/70 px-6 py-6 text-white">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg">
                {isEditing ? (
                  <Edit className="h-6 w-6 text-white" />
                ) : (
                  <Plus className="h-6 w-6 text-white" />
                )}
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-white">
                  {isEditing ? 'Editar Lead' : 'Novo Lead'}
                </DialogTitle>
                <p className="text-sm text-white/80">
                  {isEditing ? 'Atualize as informações do lead' : 'Preencha os dados do novo lead'}
                </p>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Indicador de Progresso */}
        {!isEditing && (
          <div className="px-6 pt-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm font-medium text-muted-foreground min-w-[3rem]">
                {progress}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {progress === 100 ? '✓ Todas as informações obrigatórias preenchidas' : 'Preencha os campos obrigatórios (*)'}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5 bg-gradient-to-b from-muted/30 to-background">
          {/* Seção: Informações Básicas */}
          <Card className="border shadow-sm">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                <User className="h-4 w-4" />
                Informações Básicas
              </div>

              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-sm font-medium flex items-center gap-1">
                  Nome Completo *
                  {isFieldValid('nome') && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                  {isFieldInvalid('nome') && <AlertCircle className="h-4 w-4 text-red-500" />}
                </Label>
                <Input
                  id="nome"
                  placeholder="Nome do contato principal"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  onBlur={() => handleBlur('nome')}
                  className={`h-11 transition-all ${
                    isFieldValid('nome') ? 'border-green-500 focus-visible:ring-green-500' : 
                    isFieldInvalid('nome') ? 'border-red-500 focus-visible:ring-red-500' : ''
                  }`}
                  required
                />
                {isFieldInvalid('nome') && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {getFieldError('nome')}
                  </p>
                )}
              </div>

              {/* Empresa */}
              <div className="space-y-2">
                <Label htmlFor="empresa" className="text-sm font-medium flex items-center gap-1">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  Empresa *
                  {isFieldValid('empresa') && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                  {isFieldInvalid('empresa') && <AlertCircle className="h-4 w-4 text-red-500" />}
                </Label>
                <Input
                  id="empresa"
                  placeholder="Nome da empresa"
                  value={formData.empresa}
                  onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                  onBlur={() => handleBlur('empresa')}
                  className={`h-11 transition-all ${
                    isFieldValid('empresa') ? 'border-green-500 focus-visible:ring-green-500' : 
                    isFieldInvalid('empresa') ? 'border-red-500 focus-visible:ring-red-500' : ''
                  }`}
                  required
                />
                {isFieldInvalid('empresa') && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {getFieldError('empresa')}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Seção: Contato */}
          <Card className="border shadow-sm">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                <Phone className="h-4 w-4" />
                Informações de Contato
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Telefone */}
                <div className="space-y-2">
                  <Label htmlFor="telefone" className="text-sm font-medium flex items-center gap-1">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    Telefone *
                    {isFieldValid('telefone') && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                    {isFieldInvalid('telefone') && <AlertCircle className="h-4 w-4 text-red-500" />}
                  </Label>
                  <Input
                    id="telefone"
                    placeholder="(00) 00000-0000"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    onBlur={() => handleBlur('telefone')}
                    className={`h-11 transition-all ${
                      isFieldValid('telefone') ? 'border-green-500 focus-visible:ring-green-500' : 
                      isFieldInvalid('telefone') ? 'border-red-500 focus-visible:ring-red-500' : ''
                    }`}
                    required
                  />
                  {isFieldInvalid('telefone') && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {getFieldError('telefone')}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium flex items-center gap-1">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Email
                    {isFieldValid('email') && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                    {isFieldInvalid('email') && <AlertCircle className="h-4 w-4 text-red-500" />}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@empresa.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    onBlur={() => handleBlur('email')}
                    className={`h-11 transition-all ${
                      isFieldValid('email') ? 'border-green-500 focus-visible:ring-green-500' : 
                      isFieldInvalid('email') ? 'border-red-500 focus-visible:ring-red-500' : ''
                    }`}
                  />
                  {isFieldInvalid('email') && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {getFieldError('email')}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seção: Status e Origem */}
          <Card className="border shadow-sm">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                <Target className="h-4 w-4" />
                Classificação
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={5}>
                      {LEAD_STATUS_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          <div className="flex items-center gap-2">
                            <Target className="h-3.5 w-3.5" />
                            <span>{opt.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Status atual:</span>
                    {getStatusBadge(formData.status)}
                  </div>
                </div>

                {/* Origem */}
                <div className="space-y-2">
                  <Label htmlFor="origem" className="text-sm font-medium">Origem</Label>
                  <Select value={formData.origem} onValueChange={(value) => setFormData({ ...formData, origem: value })}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Selecione a origem" />
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={5}>
                      {LEAD_ORIGIN_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          <div className="flex items-center gap-2">
                            <Globe className="h-3.5 w-3.5" />
                            <span>{opt.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Origem:</span>
                    {getOriginBadge(formData.origem)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resumo */}
          <Card className={`border-2 ${progress === 100 ? 'border-green-200 bg-green-50/30' : 'border-yellow-200 bg-yellow-50/30'}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${progress === 100 ? 'bg-green-100' : 'bg-yellow-100'}`}>
                  {progress === 100 ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {progress === 100 ? 'Pronto para salvar!' : 'Complete as informações obrigatórias'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {filledRequiredFields} de {requiredFields.length} campos obrigatórios preenchidos
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
              className="flex-1 h-12 bg-accent hover:bg-accent/90 gap-2"
              disabled={isLoading || (!isEditing && progress < 100)}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {isEditing ? 'Salvar Alterações' : 'Cadastrar Lead'}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LeadFormDialog;
