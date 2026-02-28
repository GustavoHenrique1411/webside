import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Wrench, 
  Plus, 
  Edit, 
  Calendar, 
  FileText, 
  X, 
  Save, 
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  PlayCircle,
  Hash
} from 'lucide-react';

interface ImplantacaoFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  implantacao?: any;
  loading?: boolean;
}

const defaultFormData = {
  cliente_id: '',
  nome: '',
  descricao: '',
  status: 'pendente',
  data_inicio: '',
  data_fim: '',
};

export function ImplantacaoFormDialog({ open, onOpenChange, onSubmit, implantacao, loading }: ImplantacaoFormDialogProps) {
  const [formData, setFormData] = useState(defaultFormData);

  // Reset form when dialog opens/closes or when implantacao changes
  useEffect(() => {
    if (open) {
      if (implantacao) {
        setFormData({
          cliente_id: implantacao.cliente_id || '',
          nome: implantacao.nome || '',
          descricao: implantacao.descricao || '',
          status: implantacao.status || 'pendente',
          data_inicio: implantacao.data_inicio || '',
          data_fim: implantacao.data_fim || '',
        });
      } else {
        setFormData(defaultFormData);
      }
    }
  }, [open, implantacao]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isEditing = !!implantacao;

  const getStatusConfig = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
      pendente: { 
        label: 'Pendente', 
        color: 'text-yellow-700', 
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        icon: <Clock className="h-4 w-4" />
      },
      em_andamento: { 
        label: 'Em Andamento', 
        color: 'text-blue-700', 
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: <PlayCircle className="h-4 w-4" />
      },
      concluida: { 
        label: 'Concluída', 
        color: 'text-green-700', 
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: <CheckCircle2 className="h-4 w-4" />
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
                  {isEditing ? 'Editar Implantação' : 'Nova Implantação'}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  {isEditing ? 'Atualize as informações da implantação.' : 'Registre uma nova implantação de sistema.'}
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
            
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-sm font-medium flex items-center gap-1.5">
                Nome da Implantação
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Obrigatório</Badge>
              </Label>
              <div className="relative">
                <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="nome"
                  placeholder="Ex: Implantação Sistema ERP - Empresa XYZ"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="pl-10 h-11"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">Nome descritivo do projeto de implantação</p>
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="descricao" className="text-sm font-medium">
                Descrição
              </Label>
              <Textarea
                id="descricao"
                placeholder="Descreva o escopo da implantação, módulos a serem implementados, integrações necessárias..."
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                rows={3}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">Detalhes sobre o projeto e escopo de trabalho</p>
            </div>
          </div>

          <Separator className="my-5" />

          {/* Seção: Cronograma */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              <Calendar className="h-4 w-4" />
              Cronograma
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Data de Início */}
              <div className="space-y-2">
                <Label htmlFor="data_inicio" className="text-sm font-medium">
                  Data de Início
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="data_inicio"
                    type="date"
                    value={formData.data_inicio}
                    onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
                    className="pl-10 h-11"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Início previsto do projeto</p>
              </div>

              {/* Data de Término */}
              <div className="space-y-2">
                <Label htmlFor="data_fim" className="text-sm font-medium">
                  Data de Término
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="data_fim"
                    type="date"
                    value={formData.data_fim}
                    onChange={(e) => setFormData({ ...formData, data_fim: e.target.value })}
                    className="pl-10 h-11"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Previsão de conclusão</p>
              </div>
            </div>
          </div>

          <Separator className="my-5" />

          {/* Seção: Status */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              <Clock className="h-4 w-4" />
              Status do Projeto
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
                  <SelectItem value="em_andamento">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      Em Andamento
                    </div>
                  </SelectItem>
                  <SelectItem value="concluida">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      Concluída
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
                  {isEditing ? 'Salvar Alterações' : 'Cadastrar Implantação'}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
