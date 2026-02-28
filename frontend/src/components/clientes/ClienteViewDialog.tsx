import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { 
  Building2, 
  Edit, 
  X, 
  ArrowRight,
  Hash,
  FileText,
  Briefcase,
  Calendar,
  CheckCircle2,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  MapPin,
  TrendingUp,
  ExternalLink
} from 'lucide-react';
import { Cliente, STATUS_COLORS } from '@/types/cliente';

interface ClienteViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cliente: Cliente | null;
  onEdit: (cliente: Cliente) => void;
}

const ClienteViewDialog: React.FC<ClienteViewDialogProps> = ({
  open,
  onOpenChange,
  cliente,
  onEdit
}) => {
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getPorteBadge = (porte: string) => {
    const porteMap: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
      'MEI': { label: 'MEI', color: 'text-blue-700', bg: 'bg-blue-50', icon: <TrendingUp className="h-3 w-3" /> },
      'ME': { label: 'Microempresa', color: 'text-green-700', bg: 'bg-green-50', icon: <Building2 className="h-3 w-3" /> },
      'EPP': { label: 'Pequeno Porte', color: 'text-yellow-700', bg: 'bg-yellow-50', icon: <TrendingUp className="h-3 w-3" /> },
      'MEDIA': { label: 'Médio Porte', color: 'text-purple-700', bg: 'bg-purple-50', icon: <Building2 className="h-3 w-3" /> },
      'GRANDE': { label: 'Grande Porte', color: 'text-red-700', bg: 'bg-red-50', icon: <MapPin className="h-3 w-3" /> },
    };
    const config = porteMap[porte] || { label: porte, color: 'text-gray-700', bg: 'bg-gray-50', icon: <Building2 className="h-3 w-3" /> };
    return (
      <Badge className={`${config.bg} ${config.color} border-0 gap-1`}>
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  if (!cliente) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0 gap-0">
        {/* Header Moderno */}
        <div className="bg-gradient-to-br from-accent via-accent/90 to-accent/70 px-6 py-6 text-white">
          <DialogHeader className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-white">
                    {cliente.razao_social}
                  </DialogTitle>
                  <p className="text-sm text-white/80 flex items-center gap-2">
                    <Briefcase className="h-3.5 w-3.5" />
                    {cliente.nome_fantasia || 'Nome fantasia não informado'}
                  </p>
                </div>
              </div>
              <Badge className={`${STATUS_COLORS[cliente.status_nome || ''] || 'bg-white/20 text-white'} text-sm px-3 py-1 border-0 backdrop-blur-sm`}>
                {cliente.status_nome}
              </Badge>
            </div>
          </DialogHeader>
        </div>

        <div className="px-6 py-6 space-y-5 bg-gradient-to-b from-muted/30 to-background">
          {/* Status Card */}
          <Card className={`border-2 ${STATUS_COLORS[cliente.status_nome || '']?.replace('text-', 'border-').replace('100', '200') || 'border-gray-200'} overflow-hidden`}>
            <CardContent className="p-0">
              <div className={`p-4 ${STATUS_COLORS[cliente.status_nome || '']?.replace('text-', 'bg-').replace('100', '50') || 'bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${STATUS_COLORS[cliente.status_nome || '']?.replace('text-', 'bg-').replace('100', '100') || 'bg-gray-100'} ${STATUS_COLORS[cliente.status_nome || ''] || 'text-gray-700'}`}>
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${STATUS_COLORS[cliente.status_nome || ''] || 'text-gray-700'}`}>
                      Status: {cliente.status_nome}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Cliente cadastrado em {formatDate(cliente.data_cadastro)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Grid de Informações */}
          <div className="grid grid-cols-1 gap-4">
            {/* Card de Identificação */}
            <Card className="border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Identificação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/30 rounded-xl">
                    <p className="text-xs text-muted-foreground uppercase mb-1">Razão Social</p>
                    <p className="font-semibold text-foreground">{cliente.razao_social}</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-xl">
                    <p className="text-xs text-muted-foreground uppercase mb-1">Nome Fantasia</p>
                    <p className="font-semibold text-foreground">{cliente.nome_fantasia || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card de Documentos */}
            <Card className="border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Documentos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/30 rounded-xl">
                    <p className="text-xs text-muted-foreground uppercase mb-1">CNPJ</p>
                    <p className="font-mono font-semibold text-foreground text-lg">{cliente.cnpj}</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-xl">
                    <p className="text-xs text-muted-foreground uppercase mb-1">Inscrição Estadual</p>
                    <p className="font-semibold text-foreground">{cliente.inscricao_estadual || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card de Informações Adicionais */}
            <Card className="border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Informações Adicionais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/30 rounded-xl">
                    <p className="text-xs text-muted-foreground uppercase mb-2">Porte da Empresa</p>
                    {getPorteBadge(cliente.porte_empresa)}
                  </div>
                  <div className="p-3 bg-muted/30 rounded-xl">
                    <p className="text-xs text-muted-foreground uppercase mb-1">Data de Fundação</p>
                    <p className="font-semibold text-foreground">{formatDate(cliente.data_fundacao)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Metadados */}
          <div className="flex items-center justify-between pt-4 border-t text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Hash className="h-3.5 w-3.5" />
                ID: {cliente.id}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Cadastrado em {formatDate(cliente.data_cadastro)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer com Ações */}
        <DialogFooter className="px-6 py-5 border-t bg-muted/30 gap-3">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="h-12 px-6"
          >
            <X className="h-4 w-4 mr-2" />
            Fechar
          </Button>
          
          <Button 
            onClick={() => {
              onOpenChange(false);
              onEdit(cliente);
            }} 
            className="h-12 px-6 bg-accent hover:bg-accent/90 gap-2"
          >
            <Edit className="h-4 w-4" />
            Editar Cliente
            <ArrowRight className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClienteViewDialog;
