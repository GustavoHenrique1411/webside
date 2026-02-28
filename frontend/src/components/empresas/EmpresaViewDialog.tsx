import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { 
  Building2, 
  Edit, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  X, 
  ArrowRight,
  Hash,
  Briefcase,
  Calendar,
  Globe
} from 'lucide-react';

interface EmpresaViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empresa: any | null;
  onEdit?: (empresa: any) => void;
}

const EmpresaViewDialog: React.FC<EmpresaViewDialogProps> = ({
  open,
  onOpenChange,
  empresa,
  onEdit
}) => {
  if (!empresa) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        {/* Header com gradiente */}
        <div className="bg-gradient-to-r from-accent/10 via-accent/5 to-background px-6 py-5 border-b">
          <DialogHeader className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-accent rounded-xl shadow-sm">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold text-foreground">
                    {empresa.nome_fantasia || 'Empresa'}
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground">
                    {empresa.razao_social || 'Razão social não informada'}
                  </p>
                </div>
              </div>
              <Badge className="bg-accent/10 text-accent border-accent/20 px-3 py-1 text-xs font-medium border">
                <Building2 className="h-3.5 w-3.5 mr-1.5" />
                Empresa
              </Badge>
            </div>
          </DialogHeader>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Info Card */}
          <div className="p-4 bg-accent/5 border-accent/20 border rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10 text-accent">
                <Globe className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-accent">
                  Cadastro de Empresa
                </p>
                <p className="text-xs text-muted-foreground">
                  Empresa registrada no sistema
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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Nome Fantasia */}
              <div className="p-4 bg-muted/40 rounded-xl border">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-primary/10 rounded-md">
                    <Building2 className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground uppercase">
                    Nome Fantasia
                  </span>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {empresa.nome_fantasia || 'Não informado'}
                </p>
              </div>

              {/* Razão Social */}
              <div className="p-4 bg-muted/40 rounded-xl border">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-primary/10 rounded-md">
                    <Briefcase className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground uppercase">
                    Razão Social
                  </span>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {empresa.razao_social || 'Não informada'}
                </p>
              </div>
            </div>

            {/* CNPJ */}
            <div className="p-4 bg-muted/40 rounded-xl border">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-primary/10 rounded-md">
                  <FileText className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-xs font-medium text-muted-foreground uppercase">
                  CNPJ
                </span>
              </div>
              <p className="text-lg font-mono text-foreground">
                {empresa.cnpj || 'Não informado'}
              </p>
            </div>
          </div>

          <Separator />

          {/* Seção: Contato */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              <Phone className="h-4 w-4" />
              Informações de Contato
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                <p className="text-sm font-semibold text-foreground">
                  {empresa.telefone || 'Não informado'}
                </p>
              </div>

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
                  {empresa.email || 'Não informado'}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Seção: Endereço */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              <MapPin className="h-4 w-4" />
              Endereço
            </div>
            
            <div className="p-4 bg-muted/40 rounded-xl border">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-primary/10 rounded-md mt-0.5">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                  <span className="text-xs font-medium text-muted-foreground uppercase block mb-1">
                    Endereço Completo
                  </span>
                  <p className="text-sm text-foreground leading-relaxed">
                    {empresa.endereco || 'Endereço não informado'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Rodapé com metadados */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>Cadastrada em: {empresa.data_criacao ? new Date(empresa.data_criacao).toLocaleDateString('pt-BR') : '-'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Hash className="h-3.5 w-3.5" />
              <span>ID: {empresa.id}</span>
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
                onEdit(empresa);
              }} 
              className="flex-1 h-11 bg-accent hover:bg-accent/90 gap-2"
            >
              <Edit className="h-4 w-4" />
              Editar Empresa
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmpresaViewDialog;
