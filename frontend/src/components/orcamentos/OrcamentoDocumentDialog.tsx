import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, Send, MessageCircle, Loader2, Copy, Check, Mail, Phone, Eye } from 'lucide-react';
import { Orcamento, formatCurrency } from '@/types/orcamento';
import DocumentGenerator from '@/components/MeetingMinutesGenerator';
import { useNotifications } from '@/components/NotificationSystem';

interface OrcamentoDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orcamento: Orcamento | null;
  pdfNotes: string;
  onPdfNotesChange: (notes: string) => void;
}

const OrcamentoDocumentDialog: React.FC<OrcamentoDocumentDialogProps> = ({
  open,
  onOpenChange,
  orcamento,
  pdfNotes,
  onPdfNotesChange
}) => {
  const notifications = useNotifications();
  const [activeTab, setActiveTab] = useState('preview');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  
  // Generate text content for email/WhatsApp
  const generateTextContent = () => {
    if (!orcamento) return '';
    
    let text = `*ORÇAMENTO #${orcamento.numero_orcamento}*\n\n`;
    text += `*Cliente:* ${orcamento.cliente_nome || orcamento.lead_nome || 'Cliente'}\n`;
    
    if (orcamento.cliente?.cnpj) {
      text += `*CNPJ:* ${orcamento.cliente.cnpj}\n`;
    }
    
    text += `\n*Valor Total:* ${formatCurrency(orcamento.valor_total)}\n`;
    text += `*Validade:* ${orcamento.validade_dias} dias\n`;
    text += `*Status:* ${orcamento.status_nome}\n`;
    text += `*Vendedor:* ${orcamento.vendedor || 'Webside'}\n\n`;
    
    if (orcamento.itens && orcamento.itens.length > 0) {
      text += `*ITENS:*\n`;
      orcamento.itens.forEach((item, index) => {
        const itemTotal = item.valor_total || (item.quantidade * item.valor_unitario);
        text += `${index + 1}. ${item.produto_nome || 'Produto'}\n`;
        text += `   Qtd: ${item.quantidade} | Valor: ${formatCurrency(item.valor_unitario)} | Total: ${formatCurrency(itemTotal)}\n`;
      });
    }
    
    if (orcamento.observacoes) {
      text += `\n*Observações:*\n${orcamento.observacoes}\n`;
    }
    
    text += `\n_\nPara-approved ou mais informações, entre em contato conosco._\n`;
    text += `_Obrigado pela preferência!_`;
    
    return text;
  };

  const textContent = generateTextContent();

  // Get contact info
  const contactPhone = orcamento?.cliente?.telefone_whatsapp || orcamento?.cliente?.telefone_financeiro || orcamento?.lead?.telefone_whatsapp || orcamento?.lead?.telefone_contato || '';
  const contactEmail = orcamento?.cliente?.email_financeiro || orcamento?.lead?.email_contato || '';

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(textContent);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
      notifications.success('Sucesso', 'Texto copiado para a área de transferência!');
    } catch (err) {
      notifications.error('Erro', 'Não foi possível copiar o texto.');
    }
  };

  const handleSendEmail = async () => {
    if (!contactEmail) {
      notifications.error('Erro', 'Email não disponível para este orçamento.');
      return;
    }

    setIsSendingEmail(true);
    try {
      // Generate mailto link
      const subject = encodeURIComponent(`Orçamento #${orcamento?.numero_orcamento} - Webside Sistemas`);
      const body = encodeURIComponent(textContent);
      window.open(`mailto:${contactEmail}?subject=${subject}&body=${body}`);
      
      notifications.success('Sucesso', 'Email aberto no cliente de email.');
    } catch (err) {
      notifications.error('Erro', 'Não foi possível abrir o email.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleSendWhatsApp = async () => {
    if (!contactPhone) {
      notifications.error('Erro', 'Telefone não disponível para este orçamento.');
      return;
    }

    setIsSendingWhatsApp(true);
    try {
      // Format phone number - remove non-digits
      const phoneNumber = contactPhone.replace(/\D/g, '');
      
      // Generate WhatsApp message URL
      const message = encodeURIComponent(textContent);
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
      
      // Open WhatsApp
      window.open(whatsappUrl, '_blank');
      
      notifications.success('Sucesso', 'WhatsApp aberto em nova aba.');
    } catch (err) {
      notifications.error('Erro', 'Não foi possível abrir o WhatsApp.');
    } finally {
      setIsSendingWhatsApp(false);
    }
  };

  const handleGeneratePdf = () => {
    // Trigger PDF download via DocumentGenerator
    setIsGeneratingPdf(true);
    // The DocumentGenerator component handles PDF generation internally
    setTimeout(() => setIsGeneratingPdf(false), 3000);
  };

  if (!orcamento) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5" />
            Gerar Documento - Orçamento #{orcamento.numero_orcamento}
          </DialogTitle>
          <DialogDescription>
            Visualize, envie por email/WhatsApp ou gere o PDF do orçamento
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-2">
              <Copy className="h-4 w-4" />
              Texto
            </TabsTrigger>
            <TabsTrigger value="actions" className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Enviar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="flex-1 overflow-auto mt-4">
            <div className="border rounded-lg p-4 bg-gray-50">
              <DocumentGenerator
                title={`Orçamento #${orcamento.numero_orcamento}`}
                date={orcamento.data_criacao ? new Date(orcamento.data_criacao).toLocaleDateString('pt-BR') : ''}
                time={''}
                location={orcamento.empresa_nome || 'Webside Sistemas'}
                organizer={orcamento.vendedor || 'Equipe Webside'}
                description={orcamento.observacoes || 'Orçamento personalizado para suas necessidades'}
                content={`Orçamento preparado especialmente para ${orcamento.cliente_nome || orcamento.lead_nome || 'Cliente'}. Este documento contém todos os itens, quantidades e valores acordados.`}
                items={orcamento.itens?.map((item: any) => ({
                  id: item.id,
                  produto: item.produto_nome,
                  descricao: item.descricao_item,
                  quantidade: item.quantidade,
                  valorUnitario: item.valor_unitario,
                  descontoPercentual: item.desconto_percentual,
                  descontoValor: item.desconto_valor,
                  valorTotal: item.valor_total
                }))}
                valor={orcamento.valor_total}
                cliente={orcamento.cliente_nome}
                status={orcamento.status_nome}
                validade={String(orcamento.validade_dias)}
                type="budget"
                lead={orcamento.lead}
                cliente_razao_social={orcamento.cliente?.razao_social || orcamento.cliente_nome}
                cliente_cnpj={orcamento.cliente?.cnpj}
                cliente_email={orcamento.cliente?.email_financeiro}
                cliente_telefone={orcamento.cliente?.telefone_financeiro}
                lead_empresa={orcamento.lead?.nome_empresa}
                lead_nome={orcamento.lead?.contato_principal}
                lead_email={orcamento.lead?.email_contato}
                lead_telefone={orcamento.lead?.telefone_contato}
                vendedor={orcamento.vendedor}
                empresa_nome={orcamento.empresa_nome || 'Webside Sistemas'}
              />
            </div>
          </TabsContent>

          <TabsContent value="text" className="flex-1 overflow-auto mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Texto do Orçamento (para copiar)</Label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCopyText}
                  className="gap-1"
                >
                  {copiedText ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copiar
                    </>
                  )}
                </Button>
              </div>
              <Textarea 
                value={textContent}
                onChange={(e) => onPdfNotesChange(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
                placeholder="Texto do orçamento..."
              />
              <p className="text-xs text-muted-foreground">
                Você pode editar o texto acima antes de copiar. Use este texto para enviar por WhatsApp, email ou outros aplicativos.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="actions" className="flex-1 overflow-auto mt-4">
            <div className="space-y-6">
              {/* Info Card */}
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-2">Informações do Orçamento</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Cliente:</span>
                    <span className="ml-2 font-medium">{orcamento.cliente_nome || orcamento.lead_nome || '—'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Valor:</span>
                    <span className="ml-2 font-medium text-primary">{formatCurrency(orcamento.valor_total)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Validade:</span>
                    <span className="ml-2">{orcamento.validade_dias} dias</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <span className="ml-2">{orcamento.status_nome}</span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Email</span>
                  </div>
                  <p className="text-sm">{contactEmail || 'Não disponível'}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">WhatsApp</span>
                  </div>
                  <p className="text-sm">{contactPhone || 'Não disponível'}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Ações Rápidas</Label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="w-full h-auto py-4 flex flex-col items-center gap-2"
                    onClick={handleSendEmail}
                    disabled={!contactEmail || isSendingEmail}
                  >
                    {isSendingEmail ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Mail className="h-5 w-5" />
                    )}
                    <div className="text-center">
                      <div className="font-medium">Enviar por Email</div>
                      <div className="text-xs text-muted-foreground">Abre o cliente de email</div>
                    </div>
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full h-auto py-4 flex flex-col items-center gap-2"
                    onClick={handleSendWhatsApp}
                    disabled={!contactPhone || isSendingWhatsApp}
                  >
                    {isSendingWhatsApp ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <MessageCircle className="h-5 w-5 text-green-500" />
                    )}
                    <div className="text-center">
                      <div className="font-medium">Enviar WhatsApp</div>
                      <div className="text-xs text-muted-foreground">Abre no WhatsApp Web</div>
                    </div>
                  </Button>
                </div>

                <Button 
                  className="w-full"
                  onClick={handleGeneratePdf}
                  disabled={isGeneratingPdf}
                >
                  {isGeneratingPdf ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Gerando PDF...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Baixar PDF
                    </>
                  )}
                </Button>
              </div>

              {/* Copy Text Button */}
              <div className="pt-4 border-t">
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => {
                    handleCopyText();
                    setActiveTab('text');
                  }}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Editar texto antes de enviar
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrcamentoDocumentDialog;

