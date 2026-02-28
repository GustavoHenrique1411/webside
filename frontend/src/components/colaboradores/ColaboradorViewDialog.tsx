import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  Edit, 
  User, 
  Mail, 
  Phone, 
  FileText, 
  X, 
  ArrowRight,
  Briefcase,
  Hash,
  CheckCircle2,
  XCircle,
  Calendar
} from 'lucide-react';

interface ColaboradorViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  colaborador: any | null;
  onEdit?: (colaborador: any) => void;
}

const ColaboradorViewDialog: React.FC<ColaboradorViewDialogProps> = ({
  open,
  onOpenChange,
  colaborador,
  onEdit
}) => {
  if (!colaborador) return null;

  const getStatusBadge = (statusId: string | number) => {
    const isActive = String(statusId) === '1';
    return isActive ? (
      <Badge className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
        <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
        Ativo
      </Badge>
    ) : (
      <Badge className="bg-red-50 text-red-700 border-red-200 px-3 py-1">
        <XCircle className="h-3.5 w-3.5 mr-1.5" />
        Inativo
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
        {/* Header com gradiente */}
        <div className="bg-gradient-to-r from-accent/10 via-accent/5 to-background px-6 py-5 border-b">
          <DialogHeader className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-accent rounded-xl shadow-sm">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold text-foreground">
                    {colaborador.nome || 'Colaborador'}
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground">
                    {colaborador.cargo || 'Sem cargo definido'}
                  </p>
                </div>
              </div>
              {getStatusBadge(colaborador.status_id)}
            </div>
          </DialogHeader>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Status Card */}
          <div className={`p-4 ${String(colaborador.status_id) === '1' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border rounded-xl`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${String(colaborador.status_id) === '1' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {String(colaborador.status_id) === '1' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              </div>
              <div>
                <p className={`text-sm font-medium ${String(colaborador.status_id) === '1' ? 'text-green-700' : 'text-red-700'}`}>
                  Status: {String(colaborador.status_id) === '1' ? 'Ativo' : 'Inativo'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {String(colaborador.status_id) === '1' 
                    ? 'Colaborador ativo na empresa' 
                    : 'Colaborador inativo ou desligado'}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Seção: Informações Pessoais */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              <User className="h-4 w-4" />
              Informações Pessoais
            </div>
            
            <div className="p-4 bg-muted/40 rounded-xl border">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-primary/10 rounded-md">
                  <FileText className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-xs font-medium text-muted-foreground uppercase">
                  CPF
                </span>
              </div>
              <p className="text-lg font-mono text-foreground">
                {colaborador.cpf || 'Não informado'}
              </p>
            </div>
          </div>

          <Separator />

          {/* Seção: Dados Profissionais */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              <Briefcase className="h-4 w-4" />
              Dados Profissionais
            </div>
            
            <div className="p-4 bg-muted/40 rounded-xl border">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-primary/10 rounded-md">
                  <Briefcase className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-xs font-medium text-muted-foreground uppercase">
                  Cargo
                </span>
              </div>
              <p className="text-lg font-semibold text-foreground">
                {colaborador.cargo || 'Não definido'}
              </p>
            </div>
          </div>

          <Separator />

          {/* Seção: Contato */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              <Mail className="h-4 w-4" />
              Informações de Contato
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Email */}
              <div className="p-4 bg-muted/40 rounded-xl border">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-primary/10 rounded-md">
                    <Mail className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground uppercase">
                    Email
                  </span>
                </div>
                <p className="text-sm font-medium text-foreground break-all">
                  {colaborador.email || 'Não informado'}
                </p>
              </div>

              {/* Telefone */}
              <div className="p-4 bg-muted/40 rounded-xl border">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-primary/10 rounded-md">
                    <Phone className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground uppercase">
                    Telefone
                  </span>
                </div>
                <p className="text-sm font-medium text-foreground">
                  {colaborador.telefone || 'Não informado'}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Rodapé com metadados */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>Cadastrado em: {colaborador.data_criacao ? new Date(colaborador.data_criacao).toLocaleDateString('pt-BR') : '-'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Hash className="h-3.5 w-3.5" />
              <span>ID: {colaborador.id}</span>
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
                onEdit(colaborador);
              }} 
              className="flex-1 h-11 bg-accent hover:bg-accent/90 gap-2"
            >
              <Edit className="h-4 w-4" />
              Editar Colaborador
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ColaboradorViewDialog;
