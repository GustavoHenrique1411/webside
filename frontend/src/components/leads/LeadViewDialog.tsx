import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { 
  User, 
  Building2, 
  Phone, 
  Mail, 
  Calendar, 
  X,
  Hash,
  Target,
  Globe,
  CheckCircle2,
  MessageCircle,
  ExternalLink,
  Edit,
  ArrowRight,
  Clock,
  TrendingUp,
  MapPin,
  Sparkles,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Lead, STATUS_COLORS } from '@/types/lead';

interface LeadViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null;
  allLeads?: Lead[];
  onSelectLead?: (lead: Lead) => void; // Callback para selecionar outro lead
  onEdit?: (lead: Lead) => void;
}

const LeadViewDialog: React.FC<LeadViewDialogProps> = ({ open, onOpenChange, lead, allLeads, onSelectLead, onEdit }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter leads based on search query (company name or contact name)
  const filteredLeads = useMemo(() => {
    if (!allLeads || !searchQuery) return null;
    const query = searchQuery.toLowerCase();
    return allLeads.filter((l: Lead) => 
      (l.nome_empresa?.toLowerCase().includes(query)) ||
      (l.contato_principal?.toLowerCase().includes(query))
    );
  }, [allLeads, searchQuery]);
  
  // Get current lead index
  const currentIndex = useMemo(() => {
    if (!allLeads || !lead) return -1;
    return allLeads.findIndex((l: Lead) => l.id === lead.id);
  }, [allLeads, lead]);
  
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getOriginBadge = (origin: string) => {
    const originMap: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
      'Site': { label: 'Site', color: 'text-blue-700', bg: 'bg-blue-50', icon: <Globe className="h-3 w-3" /> },
      'Indicação': { label: 'Indicação', color: 'text-green-700', bg: 'bg-green-50', icon: <Sparkles className="h-3 w-3" /> },
      'Redes Sociais': { label: 'Redes Sociais', color: 'text-purple-700', bg: 'bg-purple-50', icon: <TrendingUp className="h-3 w-3" /> },
      'Email': { label: 'Email', color: 'text-yellow-700', bg: 'bg-yellow-50', icon: <Mail className="h-3 w-3" /> },
      'Telefone': { label: 'Telefone', color: 'text-orange-700', bg: 'bg-orange-50', icon: <Phone className="h-3 w-3" /> },
      'Evento': { label: 'Evento', color: 'text-pink-700', bg: 'bg-pink-50', icon: <Calendar className="h-3 w-3" /> },
      'Outro': { label: 'Outro', color: 'text-gray-700', bg: 'bg-gray-50', icon: <MapPin className="h-3 w-3" /> },
    };
    const config = originMap[origin] || { label: origin, color: 'text-gray-700', bg: 'bg-gray-50', icon: <Globe className="h-3 w-3" /> };
    return (
      <Badge className={`${config.bg} ${config.color} border-0 gap-1`}>
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  if (!lead) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0 gap-0">
        {/* Header Moderno */}
        <div className="bg-gradient-to-br from-accent via-accent/90 to-accent/70 px-6 py-4 text-white">
          <DialogHeader className="space-y-3">
            {/* Barra de busca e navegação */}
            {allLeads && allLeads.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
                  <Input
                    placeholder="Buscar por empresa ou nome..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30 focus:border-white/50"
                  />
                </div>
                {currentIndex >= 0 && (
                  <div className="flex items-center gap-1 bg-white/20 rounded-lg px-2 py-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white hover:bg-white/30"
                      onClick={() => {
                        const prevLead = allLeads[currentIndex - 1];
                        if (prevLead && onSelectLead) {
                          onSelectLead(prevLead);
                        }
                      }}
                      disabled={currentIndex === 0}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-xs text-white/80 px-1">
                      {currentIndex + 1}/{allLeads.length}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white hover:bg-white/30"
                      onClick={() => {
                        const nextLead = allLeads[currentIndex + 1];
                        if (nextLead && onSelectLead) {
                          onSelectLead(nextLead);
                        }
                      }}
                      disabled={currentIndex === allLeads.length - 1}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}
            
            {/* Resultados da busca */}
            {filteredLeads && searchQuery && (
              <div className="bg-white/20 rounded-lg max-h-32 overflow-y-auto">
                {filteredLeads.length === 0 ? (
                  <p className="text-sm text-white/70 p-2">Nenhum resultado encontrado</p>
                ) : (
                  filteredLeads.slice(0, 5).map((l: Lead) => (
                    <button
                      key={l.id}
                      className="w-full text-left px-3 py-2 hover:bg-white/20 text-sm transition-colors"
                      onClick={() => {
                        if (onSelectLead) {
                          onSelectLead(l);
                          setSearchQuery('');
                        }
                      }}
                    >
                      <span className="font-medium">{l.contato_principal}</span>
                      <span className="text-white/60 ml-2">- {l.nome_empresa}</span>
                    </button>
                  ))
                )}
              </div>
            )}
            
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-white">
                    {lead.contato_principal}
                  </DialogTitle>
                  <p className="text-sm text-white/80 flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5" />
                    {lead.nome_empresa}
                  </p>
                </div>
              </div>
              <Badge className={`${STATUS_COLORS[lead.status_nome || ''] || 'bg-white/20 text-white'} text-sm px-3 py-1 border-0 backdrop-blur-sm`}>
                {lead.status_nome}
              </Badge>
            </div>
          </DialogHeader>
        </div>

        <div className="px-6 py-6 space-y-5 bg-gradient-to-b from-muted/30 to-background">
          {/* Status Card */}
          <Card className={`border-2 ${STATUS_COLORS[lead.status_nome || '']?.replace('text-', 'border-').replace('100', '200') || 'border-gray-200'} overflow-hidden`}>
            <CardContent className="p-0">
              <div className={`p-4 ${STATUS_COLORS[lead.status_nome || '']?.replace('text-', 'bg-').replace('100', '50') || 'bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${STATUS_COLORS[lead.status_nome || '']?.replace('text-', 'bg-').replace('100', '100') || 'bg-gray-100'} ${STATUS_COLORS[lead.status_nome || ''] || 'text-gray-700'}`}>
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${STATUS_COLORS[lead.status_nome || ''] || 'text-gray-700'}`}>
                      Status: {lead.status_nome}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Lead cadastrado em {formatDate(lead.data_criacao)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Grid de Informações */}
          <div className="grid grid-cols-1 gap-4">
            {/* Card de Informações Pessoais */}
            <Card className="border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/30 rounded-xl">
                    <p className="text-xs text-muted-foreground uppercase mb-1">Nome Completo</p>
                    <p className="font-semibold text-foreground">{lead.contato_principal}</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-xl">
                    <p className="text-xs text-muted-foreground uppercase mb-1">Empresa</p>
                    <p className="font-semibold text-foreground">{lead.nome_empresa}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card de Contato com Ações */}
            <Card className="border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Informações de Contato
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Telefone com ação WhatsApp */}
                {lead.telefone_contato && (
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl group">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Phone className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{lead.telefone_contato}</p>
                      <p className="text-xs text-muted-foreground">Telefone / WhatsApp</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => window.open(`https://wa.me/${lead.telefone_contato.replace(/\D/g, '')}`, '_blank')}
                    >
                      <MessageCircle className="h-4 w-4 text-green-600 mr-1" />
                      WhatsApp
                    </Button>
                  </div>
                )}

                {/* Email com ação */}
                {lead.email_contato && (
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl group">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Mail className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{lead.email_contato}</p>
                      <p className="text-xs text-muted-foreground">Email</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => window.open(`mailto:${lead.email_contato}`, '_blank')}
                    >
                      <Mail className="h-4 w-4 text-blue-600 mr-1" />
                      Enviar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Card de Status e Origem */}
            <Card className="border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Status e Origem
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/30 rounded-xl">
                    <p className="text-xs text-muted-foreground uppercase mb-2">Status Atual</p>
                    <Badge className={`${STATUS_COLORS[lead.status_nome || ''] || 'bg-gray-100'} text-sm`}>
                      {lead.status_nome}
                    </Badge>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-xl">
                    <p className="text-xs text-muted-foreground uppercase mb-2">Origem</p>
                    {getOriginBadge(lead.fonte_lead)}
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
                ID: {lead.id}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Cadastrado em {formatDate(lead.data_criacao)}
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
          
          {onEdit && (
            <Button 
              onClick={() => {
                onOpenChange(false);
                onEdit(lead);
              }} 
              className="h-12 px-6 bg-accent hover:bg-accent/90 gap-2"
            >
              <Edit className="h-4 w-4" />
              Editar Lead
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeadViewDialog;
