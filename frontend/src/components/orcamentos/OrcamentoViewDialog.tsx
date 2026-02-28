import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { 
  Edit, 
  Mail, 
  Phone, 
  FileText, 
  Send, 
  User, 
  Building2, 
  Calendar, 
  DollarSign, 
  Loader2,
  Hash,
  CheckCircle2,
  X,
  ArrowRight,
  Package,
  Tag,
  TrendingUp,
  CreditCard,
  Percent,
  Clock,
  MessageCircle,
  Download,
  ExternalLink,
  ChevronRight,
  Receipt
} from 'lucide-react';
import { Orcamento, STATUS_COLORS, formatCurrency, formatDate } from '@/types/orcamento';

interface OrcamentoViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orcamento: Orcamento | null;
  onEdit?: (orcamento: Orcamento) => void;
  onGenerateDocument?: (orcamento: Orcamento) => void;
  onSendEmail?: (orcamento: Orcamento) => void;
  onSendWhatsApp?: (orcamento: Orcamento) => void;
  isLoadingEmail?: boolean;
  isLoadingWhatsApp?: boolean;
}

const OrcamentoViewDialog: React.FC<OrcamentoViewDialogProps> = ({
  open,
  onOpenChange,
  orcamento,
  onEdit,
  onGenerateDocument,
  onSendEmail,
  onSendWhatsApp,
  isLoadingEmail = false,
  isLoadingWhatsApp = false
}) => {
  if (!orcamento) return null;

  // Get contact info from cliente or lead
  const contactPhone = orcamento.cliente?.telefone_whatsapp || orcamento.cliente?.telefone_financeiro || orcamento.lead?.telefone_whatsapp || orcamento.lead?.telefone_contato || '';
  const contactEmail = orcamento.cliente?.email_financeiro || orcamento.lead?.email_contato || '';

  // Calculate totals
  const subtotal = orcamento.itens?.reduce((sum: number, item: any) => 
    sum + (item.quantidade * (item.valor_unitario || 0)), 0) || 0;
  const descontoTotal = orcamento.itens?.reduce((sum: number, item: any) => {
    const itemTotal = item.quantidade * (item.valor_unitario || 0);
    const desconto = item.desconto_percentual 
      ? itemTotal * (item.desconto_percentual / 100)
      : (item.desconto_valor || 0);
    return sum + desconto;
  }, 0) || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[95vh] overflow-y-auto p-0 gap-0">
        {/* Header Moderno */}
        <div className="bg-gradient-to-br from-accent via-accent/90 to-accent/70 px-6 py-6 text-white">
          <DialogHeader className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg">
                  <Receipt className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <DialogTitle className="text-2xl font-bold text-white">
                      Orçamento #{orcamento.numero_orcamento}
                    </DialogTitle>
                    <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                      {orcamento.status_nome}
                    </Badge>
                  </div>
                  <p className="text-sm text-white/80 flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" />
                    Criado em {formatDate(orcamento.data_criacao)}
                  </p>
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="px-6 py-6 space-y-6 bg-gradient-to-b from-muted/30 to-background">
          {/* Card Principal - Valor e Validade */}
          <Card className="border-2 border-primary/10 shadow-lg overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Valor Total */}
                <div className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-r border-border/50">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-primary rounded-lg">
                      <DollarSign className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Valor Total
                    </span>
                  </div>
                  <p className="text-4xl font-bold text-primary tracking-tight">
                    {formatCurrency(orcamento.valor_total)}
                  </p>
                  {descontoTotal > 0 && (
                    <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                      <Percent className="h-3.5 w-3.5" />
                      Economia de {formatCurrency(descontoTotal)}
                    </p>
                  )}
                </div>

                {/* Validade */}
                <div className="p-6 bg-gradient-to-br from-orange-50 to-yellow-50">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-orange-500 rounded-lg">
                      <Calendar className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Validade
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-orange-600">
                    {orcamento.validade_dias} <span className="text-lg font-medium">dias</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Válido até {formatDate(orcamento.data_validade)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Grid de Informações */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Card do Cliente */}
            <Card className="border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  {orcamento.cliente_nome ? 'Cliente' : 'Lead'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-lg font-semibold text-foreground">
                    {orcamento.cliente_nome || orcamento.lead_nome || '—'}
                  </p>
                  {orcamento.cliente?.cnpj && (
                    <p className="text-sm text-muted-foreground font-mono mt-1">
                      CNPJ: {orcamento.cliente.cnpj}
                    </p>
                  )}
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  {contactPhone && (
                    <a 
                      href={`tel:${contactPhone}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                        <Phone className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{contactPhone}</p>
                        <p className="text-xs text-muted-foreground">Telefone</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  )}
                  {contactEmail && (
                    <a 
                      href={`mailto:${contactEmail}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                        <Mail className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{contactEmail}</p>
                        <p className="text-xs text-muted-foreground">Email</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Card do Vendedor */}
            <Card className="border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Responsável
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-accent/10 rounded-full">
                    <User className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-foreground">
                      {orcamento.vendedor || '—'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {orcamento.empresa_nome || 'Webside Sistemas'}
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Orçamento em nome da empresa</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Itens do Orçamento - Cards Visuais */}
          {orcamento.itens && orcamento.itens.length > 0 && (
            <Card className="border shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Itens do Orçamento
                  </CardTitle>
                  <Badge variant="secondary">{orcamento.itens.length} itens</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {orcamento.itens.map((item: any, index: number) => (
                  <div 
                    key={item.id} 
                    className="p-4 bg-muted/30 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-muted/50 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                            Item {index + 1}
                          </span>
                          {item.desconto_percentual > 0 && (
                            <Badge className="bg-green-100 text-green-700 text-[10px]">
                              -{item.desconto_percentual}%
                            </Badge>
                          )}
                        </div>
                        <p className="font-semibold text-foreground truncate">
                          {item.produto_nome || 'Produto não especificado'}
                        </p>
                        {item.descricao_item && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {item.descricao_item}
                          </p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-foreground">
                          {formatCurrency(item.valor_total || (item.quantidade * (item.valor_unitario || 0)))}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantidade}x {formatCurrency(item.valor_unitario || 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Resumo dos Itens */}
                <div className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Subtotal</p>
                      <p className="text-lg font-semibold">{formatCurrency(subtotal)}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    <div className="space-y-1 text-right">
                      <p className="text-sm text-muted-foreground">Total Final</p>
                      <p className="text-2xl font-bold text-primary">{formatCurrency(orcamento.valor_total)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Observações */}
          {orcamento.observacoes && (
            <Card className="border shadow-sm bg-yellow-50/50 border-yellow-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-yellow-700 uppercase tracking-wide flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Observações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground leading-relaxed">
                  {orcamento.observacoes}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Ações de Envio */}
          <Card className="border-2 border-dashed border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-primary uppercase tracking-wide flex items-center gap-2">
                <Send className="h-4 w-4" />
                Enviar Orçamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {onSendEmail && (
                  <Button 
                    variant="outline" 
                    className="h-14 justify-start gap-3 border-2 hover:border-blue-400 hover:bg-blue-50 transition-all"
                    onClick={() => onSendEmail(orcamento)}
                    disabled={!contactEmail || isLoadingEmail}
                  >
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {isLoadingEmail ? (
                        <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                      ) : (
                        <Mail className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-foreground">Enviar por Email</p>
                      <p className="text-xs text-muted-foreground">
                        {contactEmail || 'Sem email disponível'}
                      </p>
                    </div>
                  </Button>
                )}
                {onSendWhatsApp && (
                  <Button 
                    variant="outline" 
                    className="h-14 justify-start gap-3 border-2 hover:border-green-400 hover:bg-green-50 transition-all"
                    onClick={() => onSendWhatsApp(orcamento)}
                    disabled={!contactPhone || isLoadingWhatsApp}
                  >
                    <div className="p-2 bg-green-100 rounded-lg">
                      {isLoadingWhatsApp ? (
                        <Loader2 className="h-5 w-5 text-green-600 animate-spin" />
                      ) : (
                        <MessageCircle className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-foreground">WhatsApp</p>
                      <p className="text-xs text-muted-foreground">
                        {contactPhone || 'Sem telefone disponível'}
                      </p>
                    </div>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Metadados */}
          <div className="flex items-center justify-between pt-4 border-t text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Hash className="h-3.5 w-3.5" />
                ID: {orcamento.id}
              </span>
              <span className="flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5" />
                {orcamento.itens?.length || 0} itens
              </span>
            </div>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Criado em {formatDate(orcamento.data_criacao)}
            </span>
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
          
          {onGenerateDocument && (
            <Button 
              variant="outline"
              onClick={() => onGenerateDocument(orcamento)}
              className="h-12 px-6 border-2 hover:border-primary/50"
            >
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
          )}
          
          {onEdit && (
            <Button 
              onClick={() => {
                onOpenChange(false);
                onEdit(orcamento);
              }} 
              className="h-12 px-6 bg-accent hover:bg-accent/90 gap-2"
            >
              <Edit className="h-4 w-4" />
              Editar
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrcamentoViewDialog;
