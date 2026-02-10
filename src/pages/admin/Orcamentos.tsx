import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, Search, Calendar, DollarSign, MoreHorizontal, FileText, User, Building2, Phone, Mail, Eye, Edit, Trash2, Download, Send, MessageCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { apiService } from '@/lib/api';
import { useNotifications } from '@/components/NotificationSystem';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import DocumentGenerator from '@/components/MeetingMinutesGenerator';

interface Orcamento {
  id: number | string;
  cliente: string;
  valor: number | string;
  data: string;
  validade: string;
  status: string;
  itens?: Array<{
    id: number;
    produto?: string;
    descricao?: string;
    quantidade: number;
    valorUnitario: number;
    descontoPercentual?: number;
    descontoValor?: number;
    valorTotal?: number;
  }>;
}

const orcamentosData: Orcamento[] = [
  { id: 1, cliente: 'Posto Central', valor: 45000, data: '2024-01-15', validade: '2024-02-15', status: 'Aguardando' },
  { id: 2, cliente: 'Rede Combustível', valor: 128000, data: '2024-01-12', validade: '2024-02-12', status: 'Aprovado' },
  { id: 3, cliente: 'Auto Posto BR', valor: 67500, data: '2024-01-10', validade: '2024-02-10', status: 'Revisão' },
  { id: 4, cliente: 'Posto Shell', valor: 89000, data: '2024-01-08', validade: '2024-02-08', status: 'Aguardando' },
  { id: 5, cliente: 'Grupo Ipiranga', valor: 234000, data: '2024-01-05', validade: '2024-02-05', status: 'Recusado' },
];

const statusColors: Record<string, string> = {
  'Aguardando': 'bg-yellow-100 text-yellow-800',
  'Aprovado': 'bg-green-100 text-green-800',
  'Revisão': 'bg-blue-100 text-blue-800',
  'Recusado': 'bg-red-100 text-red-800',
};

const Orcamentos: React.FC = () => {
  const notifications = useNotifications();
  const [search, setSearch] = useState('');
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState(false);
  const [viewingOrcamento, setViewingOrcamento] = useState<Orcamento | null>(null);
  const [pdfNotes, setPdfNotes] = useState('');
  const [previewOrcamento, setPreviewOrcamento] = useState<Orcamento | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [newOrcamento, setNewOrcamento] = useState({
    origem: 'lead', // 'lead' or 'cliente'
    leadId: '',
    clienteId: '',
    // Company data
    empresa: '',
    cnpj: '',
    contato: '',
    telefone: '',
    email: '',
    // Header
    vendedor: '',
    filial: '',
    validade: 30,
    // Items
    itens: [{ produto: '', descricao: '', quantidade: 1, valorUnitario: 0, descontoPercentual: 0, descontoValor: 0 }],
    // Values
    descontoGeral: 0,
    parcelas: 1,
    observacoes: ''
  });
  const [isDocDialogOpen, setIsDocDialogOpen] = useState(false);

  // Calculate dynamic stats from orcamentos data
  const stats = React.useMemo(() => {
    const total = orcamentos.length;
    const aguardando = orcamentos.filter(o => o.status === 'Aguardando').length;
    const aprovados = orcamentos.filter(o => o.status === 'Aprovado').length;
    const valorTotal = orcamentos.reduce((sum, o) => sum + (Number(o.valor) || 0), 0);
    return { total, aguardando, aprovados, valorTotal };
  }, [orcamentos]);

  useEffect(() => {
    const fetchOrcamentos = async () => {
      try {
        const data = await apiService.getOrcamentos() as Orcamento[];
        const normalized = (data || []).map((o: any) => ({
          ...o,
          valor: o && o.valor != null ? Number(o.valor) : 0,
        }));
        setOrcamentos(normalized);
      } catch (error) {
        console.error('Error fetching orcamentos:', error);
        notifications.error('Erro', 'Não foi possível carregar os orçamentos.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrcamentos();
  }, [notifications]);

  const filteredOrcamentos = orcamentos.filter(orc =>
    orc && typeof orc === 'object' && (
      (typeof orc.cliente === 'string' ? orc.cliente.toLowerCase() : '').includes(search.toLowerCase()) ||
      (typeof orc.id === 'number' ? orc.id.toString().toLowerCase() : '').includes(search.toLowerCase())
    )
  );

  const formatCurrency = (value: any) => {
    const n = typeof value === 'number' ? value : (value != null ? Number(value) : 0);
    if (Number.isNaN(n)) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
  };

  const handleView = async (orcamento: Orcamento) => {
    try {
      const data = await apiService.getOrcamento(Number(orcamento.id)) as Orcamento;
      if (data) {
        data.valor = data.valor != null ? Number(data.valor) : 0;
        if (Array.isArray(data.itens)) {
          data.itens = data.itens.map((it: any) => ({
            ...it,
            quantidade: it.quantidade != null ? Number(it.quantidade) : 0,
            valorUnitario: it.valorUnitario != null ? Number(it.valorUnitario) : 0,
            descontoPercentual: it.descontoPercentual != null ? Number(it.descontoPercentual) : 0,
            descontoValor: it.descontoValor != null ? Number(it.descontoValor) : 0,
            valorTotal: it.valorTotal != null ? Number(it.valorTotal) : (it.quantidade * (it.valorUnitario || 0)),
          }));
        }
      }
      setViewingOrcamento(data);
      setIsViewDialogOpen(true);
    } catch (error) {
      console.error('Error fetching orcamento details:', error);
      notifications.error('Erro', 'Não foi possível carregar os detalhes do orçamento.');
    }
  };

  const handleOpenDocument = async (orcamento: Orcamento) => {
    try {
      const data = await apiService.getOrcamento(Number(orcamento.id)) as Orcamento;
      if (data) {
        data.valor = data.valor != null ? Number(data.valor) : 0;
        if (Array.isArray(data.itens)) {
          data.itens = data.itens.map((it: any) => ({
            ...it,
            quantidade: it.quantidade != null ? Number(it.quantidade) : 0,
            valorUnitario: it.valorUnitario != null ? Number(it.valorUnitario) : 0,
            descontoPercentual: it.descontoPercentual != null ? Number(it.descontoPercentual) : 0,
            descontoValor: it.descontoValor != null ? Number(it.descontoValor) : 0,
            valorTotal: it.valorTotal != null ? Number(it.valorTotal) : (it.quantidade * (it.valorUnitario || 0)),
          }));
        }
      }
      setViewingOrcamento(data);
      setIsDocDialogOpen(true);
    } catch (error) {
      console.error('Error fetching orcamento details for document:', error);
      notifications.error('Erro', 'Não foi possível carregar os dados do orçamento para gerar o documento.');
    }
  };

  const handleEdit = (orcamento: Orcamento) => {
    setViewingOrcamento(orcamento);
    setNewOrcamento({
      origem: 'cliente',
      leadId: '',
      clienteId: '',
      empresa: orcamento.cliente,
      cnpj: '',
      contato: '',
      telefone: '',
      email: '',
      vendedor: '',
      filial: '',
      validade: 30,
      itens: [{ produto: '', descricao: '', quantidade: 1, valorUnitario: Number(orcamento.valor) || 0, descontoPercentual: 0, descontoValor: 0 }],
      descontoGeral: 0,
      parcelas: 1,
      observacoes: ''
    });
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string | number) => {
    if (window.confirm('Tem certeza que deseja excluir este orçamento?')) {
      try {
        await apiService.deleteOrcamento(typeof id === 'string' ? parseInt(id) : id);
        setOrcamentos(orcamentos.filter(orc => orc.id !== id));
        notifications.success('Sucesso', 'Orçamento excluído com sucesso.');
      } catch (error) {
        console.error('Error deleting orcamento:', error);
        notifications.error('Erro', 'Não foi possível excluir o orçamento.');
      }
    }
  };

  const handleStatusChange = async (orcamento: Orcamento, newStatus: string) => {
    try {
      await apiService.updateOrcamentoStatus(Number(orcamento.id), newStatus);
      setOrcamentos(orcamentos.map(orc =>
        orc.id === orcamento.id
          ? { ...orc, status: newStatus }
          : orc
      ));
      notifications.success('Sucesso', 'Status do orçamento atualizado com sucesso.');
    } catch (error) {
      console.error('Error updating orcamento status:', error);
      notifications.error('Erro', 'Não foi possível atualizar o status do orçamento.');
    }
  };

  const transformOrcamentoData = (data: any) => {
    // Calculate total value from items
    const valorTotal = data.itens.reduce((total: number, item: any) => {
      const itemTotal = item.quantidade * item.valorUnitario;
      const desconto = item.descontoPercentual > 0
        ? itemTotal * (item.descontoPercentual / 100)
        : item.descontoValor;
      return total + (itemTotal - desconto);
    }, 0);

    // Apply general discount if any
    const valorFinal = data.descontoGeral > 0
      ? valorTotal * (1 - data.descontoGeral / 100)
      : valorTotal;

    // Transform items to match backend expectations
    const itensTransformed = data.itens.map((item: any, index: number) => ({
      id_produto: null, // For now, no product selection
      descricao: item.descricao || item.produto || '',
      quantidade: item.quantidade,
      valorUnitario: item.valorUnitario,
      descontoPercentual: item.descontoPercentual || 0,
      descontoValor: item.descontoValor || 0,
      valorTotal: item.quantidade * item.valorUnitario - (item.descontoPercentual > 0
        ? (item.quantidade * item.valorUnitario) * (item.descontoPercentual / 100)
        : item.descontoValor || 0)
    }));

    return {
      numero_orcamento: `ORC${Date.now()}`, // Generate unique number
      id_lead: data.origem === 'lead' && data.leadId ? parseInt(data.leadId) : null,
      id_cliente: data.origem === 'cliente' && data.clienteId ? parseInt(data.clienteId) : null,
      id_colaborador: 2, // Default collaborator ID (should be from auth context)
      id_empresa: 1, // Default company ID (should be from auth context)
      valor_total: valorFinal,
      validade_dias: data.validade || 30,
      observacoes: data.observacoes || '',
      id_status: 17, // Default to "Pendente" status
      data_aprovacao: null,
      data_validade: new Date(Date.now() + (data.validade || 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      itens: itensTransformed
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const transformedData = transformOrcamentoData(newOrcamento);

      if (isEditMode) {
        // Update existing orcamento
        await apiService.updateOrcamento(Number(viewingOrcamento.id), transformedData);
        notifications.success('Sucesso', 'Orçamento atualizado com sucesso.');
        setIsEditMode(false);
      } else {
        // Create new orcamento
        await apiService.createOrcamento(transformedData);
        notifications.success('Sucesso', 'Orçamento criado com sucesso.');
      }

      // Refetch orcamentos to ensure all database tables are updated and reflected
      const updatedOrcamentos = await apiService.getOrcamentos() as Orcamento[];
      const normalized = (updatedOrcamentos || []).map((o: any) => ({
        ...o,
        valor: o && o.valor != null ? Number(o.valor) : 0,
      }));
      setOrcamentos(normalized);

      setNewOrcamento({
        origem: 'lead',
        leadId: '',
        clienteId: '',
        empresa: '',
        cnpj: '',
        contato: '',
        telefone: '',
        email: '',
        vendedor: '',
        filial: '',
        validade: 30,
        itens: [{ produto: '', descricao: '', quantidade: 1, valorUnitario: 0, descontoPercentual: 0, descontoValor: 0 }],
        descontoGeral: 0,
        parcelas: 1,
        observacoes: ''
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving orcamento:', error);
      notifications.error('Erro', 'Não foi possível salvar o orçamento.');
    }
  };

  const generatePDF = async (orcamento: Orcamento): Promise<Blob | null> => {
    return new Promise((resolve) => {
      try {
        const pdf = new jsPDF();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        let yPosition = 20;

        // Logo
        const logoUrl = 'https://www.websidesistemas.com.br/imagens/logo_webside.png';
        const img = new Image();
        img.crossOrigin = 'anonymous';

        const generatePDFContent = () => {
          // Company info (without logo for now)
          pdf.setFontSize(12);
          pdf.text('Webside Sistemas', 20, yPosition);
          yPosition += 5;
          pdf.setFontSize(10);
          pdf.text('Soluções em Tecnologia', 20, yPosition);
          yPosition += 15;

          // Title
          pdf.setFontSize(18);
          pdf.setFont('helvetica', 'bold');
          pdf.text('ORÇAMENTO', pageWidth / 2, yPosition, { align: 'center' });
          yPosition += 10;

          // Budget ID and Date
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          pdf.text(`Orçamento Nº: ${orcamento.id}`, 20, yPosition);
          pdf.text(`Data: ${orcamento.data}`, pageWidth - 20, yPosition, { align: 'right' });
          yPosition += 10;
          pdf.text(`Validade: ${orcamento.validade}`, pageWidth - 20, yPosition, { align: 'right' });
          yPosition += 20;

          // Client info section
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.text('DADOS DO CLIENTE', 20, yPosition);
          yPosition += 10;
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(10);
          pdf.text(`Cliente: ${orcamento.cliente}`, 20, yPosition);
          yPosition += 8;
          pdf.text(`Status: ${orcamento.status}`, 20, yPosition);
          yPosition += 15;

          // Items table
          if (orcamento.itens && orcamento.itens.length > 0) {
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.text('ITENS DO ORÇAMENTO', 20, yPosition);
            yPosition += 10;

            // Table headers
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'bold');
            const headers = ['Produto/Serviço', 'Descrição', 'Qtd', 'Vlr Unit.', 'Desconto', 'Total'];
            const colWidths = [40, 50, 15, 25, 25, 30];
            let xPos = 20;

            headers.forEach((header, index) => {
              pdf.text(header, xPos, yPosition);
              xPos += colWidths[index];
            });
            yPosition += 5;

            // Header line
            pdf.line(20, yPosition, pageWidth - 20, yPosition);
            yPosition += 5;

            // Table rows
            pdf.setFont('helvetica', 'normal');
            orcamento.itens.forEach((item: any) => {
              if (yPosition > pageHeight - 30) {
                pdf.addPage();
                yPosition = 20;
              }

              xPos = 20;
              const rowData = [
                item.produto || '',
                item.descricao || '',
                item.quantidade?.toString() || '0',
                formatCurrency(item.valorUnitario || 0),
                item.descontoPercentual ? `${item.descontoPercentual}%` : formatCurrency(item.descontoValor || 0),
                formatCurrency(item.valorTotal || (item.quantidade * (item.valorUnitario || 0)))
              ];

              rowData.forEach((data, index) => {
                const maxWidth = colWidths[index] - 2;
                const lines = pdf.splitTextToSize(data, maxWidth);
                pdf.text(lines, xPos, yPosition);
                xPos += colWidths[index];
              });
              yPosition += 8;
            });

            yPosition += 5;
          }

          // Total value
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.text(`Valor Total: ${formatCurrency(orcamento.valor)}`, pageWidth - 20, yPosition, { align: 'right' });
          yPosition += 20;

          // Footer
          pdf.setFontSize(8);
          pdf.setFont('helvetica', 'normal');
          pdf.text('Este orçamento é válido pelo período especificado e pode sofrer alterações.', 20, pageHeight - 20);
          pdf.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth - 20, pageHeight - 20, { align: 'right' });

          // Return blob instead of saving
          const pdfBlob = pdf.output('blob');
          resolve(pdfBlob);
        };

        img.onload = () => {
          try {
            pdf.addImage(img, 'PNG', 20, yPosition, 50, 20);
            yPosition += 30;
            generatePDFContent();
          } catch (imageError) {
            console.warn('Failed to add logo image, generating PDF without logo:', imageError);
            generatePDFContent();
          }
        };

        img.onerror = () => {
          console.warn('Logo image failed to load, generating PDF without logo');
          generatePDFContent();
        };

        img.src = logoUrl;

        // Timeout fallback in case image loading hangs
        setTimeout(() => {
          if (!img.complete) {
            console.warn('Logo image loading timeout, generating PDF without logo');
            generatePDFContent();
          }
        }, 3000);

      } catch (error) {
        console.error('Error generating PDF:', error);
        resolve(null);
      }
    });
  };

  const handleGeneratePDF = async (orcamento: Orcamento) => {
    console.log('Starting PDF generation for orcamento:', orcamento.id);
    const blob = await generatePDF(orcamento);
    console.log('PDF blob generated:', blob ? 'success' : 'failed');
    if (blob) {
      setPdfBlob(blob);
      setPreviewOrcamento(orcamento);
      setIsPdfPreviewOpen(true);
      console.log('PDF preview dialog should now be open');
    } else {
      notifications.error('Erro', 'Não foi possível gerar o PDF.');
    }
  };

  return (
    <AdminLayout title="Orçamentos">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Orçamentos</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Gerencie propostas comerciais</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} className="bg-accent hover:bg-accent/90 text-accent-foreground w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Novo Orçamento
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Criar Novo Orçamento
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Origem */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Origem do Orçamento</Label>
                  <Select value={newOrcamento.origem} onValueChange={(value) => setNewOrcamento({ ...newOrcamento, origem: value, leadId: '', clienteId: '' })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a origem" />
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={5}>
                      <SelectItem value="lead">Lead</SelectItem>
                      <SelectItem value="cliente">Cliente Existente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Lead/Cliente Selector */}
                {newOrcamento.origem === 'lead' && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Selecionar Lead (Opcional)</Label>
                    <Input
                      placeholder="ID do Lead ou deixe em branco para novo"
                      value={newOrcamento.leadId}
                      onChange={(e) => setNewOrcamento({ ...newOrcamento, leadId: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Deixe em branco para criar orçamento sem vincular a um lead existente
                    </p>
                  </div>
                )}

                {newOrcamento.origem === 'cliente' && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Selecionar Cliente (Opcional)</Label>
                    <Input
                      placeholder="ID do Cliente ou deixe em branco para novo"
                      value={newOrcamento.clienteId}
                      onChange={(e) => setNewOrcamento({ ...newOrcamento, clienteId: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Deixe em branco para criar orçamento sem vincular a um cliente existente
                    </p>
                  </div>
                )}

                {/* Company Data */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Dados da Empresa</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="empresa" className="text-sm font-medium">
                        Empresa *
                      </Label>
                      <div className="relative">
                        <Input
                          id="empresa"
                          placeholder="Nome da empresa"
                          value={newOrcamento.empresa}
                          onChange={(e) => setNewOrcamento({ ...newOrcamento, empresa: e.target.value })}
                          className="pl-10"
                          required
                        />
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cnpj" className="text-sm font-medium">
                        CNPJ
                      </Label>
                      <Input
                        id="cnpj"
                        placeholder="00.000.000/0000-00"
                        value={newOrcamento.cnpj}
                        onChange={(e) => setNewOrcamento({ ...newOrcamento, cnpj: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contato" className="text-sm font-medium">
                        Contato
                      </Label>
                      <div className="relative">
                        <Input
                          id="contato"
                          placeholder="Nome do contato"
                          value={newOrcamento.contato}
                          onChange={(e) => setNewOrcamento({ ...newOrcamento, contato: e.target.value })}
                          className="pl-10"
                        />
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefone" className="text-sm font-medium">
                        Telefone
                      </Label>
                      <div className="relative">
                        <Input
                          id="telefone"
                          placeholder="(11) 99999-9999"
                          value={newOrcamento.telefone}
                          onChange={(e) => setNewOrcamento({ ...newOrcamento, telefone: e.target.value })}
                          className="pl-10"
                        />
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email
                      </Label>
                      <div className="relative">
                        <Input
                          id="email"
                          type="email"
                          placeholder="contato@empresa.com"
                          value={newOrcamento.email}
                          onChange={(e) => setNewOrcamento({ ...newOrcamento, email: e.target.value })}
                          className="pl-10"
                        />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Header */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Cabeçalho do Orçamento</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vendedor" className="text-sm font-medium">
                        Vendedor *
                      </Label>
                      <Input
                        id="vendedor"
                        placeholder="Nome do vendedor"
                        value={newOrcamento.vendedor}
                        onChange={(e) => setNewOrcamento({ ...newOrcamento, vendedor: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="filial" className="text-sm font-medium">
                        Filial
                      </Label>
                      <Input
                        id="filial"
                        placeholder="Filial responsável"
                        value={newOrcamento.filial}
                        onChange={(e) => setNewOrcamento({ ...newOrcamento, filial: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="validade" className="text-sm font-medium">
                        Validade (dias)
                      </Label>
                      <Input
                        id="validade"
                        type="number"
                        min="1"
                        value={newOrcamento.validade}
                        onChange={(e) => setNewOrcamento({ ...newOrcamento, validade: parseInt(e.target.value) || 30 })}
                      />
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Itens do Orçamento</h3>
                  {newOrcamento.itens.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Produto/Serviço *</Label>
                          <Input
                            placeholder="Nome do produto/serviço"
                            value={item.produto}
                            onChange={(e) => {
                              const newItens = [...newOrcamento.itens];
                              newItens[index].produto = e.target.value;
                              setNewOrcamento({ ...newOrcamento, itens: newItens });
                            }}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Descrição</Label>
                          <Input
                            placeholder="Descrição detalhada"
                            value={item.descricao}
                            onChange={(e) => {
                              const newItens = [...newOrcamento.itens];
                              newItens[index].descricao = e.target.value;
                              setNewOrcamento({ ...newOrcamento, itens: newItens });
                            }}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Quantidade *</Label>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantidade}
                            onChange={(e) => {
                              const newItens = [...newOrcamento.itens];
                              newItens[index].quantidade = parseInt(e.target.value) || 1;
                              setNewOrcamento({ ...newOrcamento, itens: newItens });
                            }}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Valor Unitário *</Label>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0,00"
                            value={item.valorUnitario}
                            onChange={(e) => {
                              const newItens = [...newOrcamento.itens];
                              newItens[index].valorUnitario = parseFloat(e.target.value) || 0;
                              setNewOrcamento({ ...newOrcamento, itens: newItens });
                            }}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Desconto (%)</Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={item.descontoPercentual}
                            onChange={(e) => {
                              const newItens = [...newOrcamento.itens];
                              newItens[index].descontoPercentual = parseFloat(e.target.value) || 0;
                              setNewOrcamento({ ...newOrcamento, itens: newItens });
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Desconto (R$)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={item.descontoValor}
                            onChange={(e) => {
                              const newItens = [...newOrcamento.itens];
                              newItens[index].descontoValor = parseFloat(e.target.value) || 0;
                              setNewOrcamento({ ...newOrcamento, itens: newItens });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setNewOrcamento({
                      ...newOrcamento,
                      itens: [...newOrcamento.itens, { produto: '', descricao: '', quantidade: 1, valorUnitario: 0, descontoPercentual: 0, descontoValor: 0 }]
                    })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Item
                  </Button>
                </div>

                {/* Values */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Valores</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="descontoGeral" className="text-sm font-medium">
                        Desconto Geral (%)
                      </Label>
                      <Input
                        id="descontoGeral"
                        type="number"
                        min="0"
                        max="100"
                        value={newOrcamento.descontoGeral}
                        onChange={(e) => setNewOrcamento({ ...newOrcamento, descontoGeral: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="parcelas" className="text-sm font-medium">
                        Parcelas
                      </Label>
                      <Input
                        id="parcelas"
                        type="number"
                        min="1"
                        value={newOrcamento.parcelas}
                        onChange={(e) => setNewOrcamento({ ...newOrcamento, parcelas: parseInt(e.target.value) || 1 })}
                      />
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="observacoes" className="text-sm font-medium">
                    Observações
                  </Label>
                  <Input
                    id="observacoes"
                    placeholder="Observações adicionais"
                    value={newOrcamento.observacoes}
                    onChange={(e) => setNewOrcamento({ ...newOrcamento, observacoes: e.target.value })}
                  />
                </div>

                <DialogFooter className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => {
                    setIsDialogOpen(false);
                    setIsEditMode(false);
                  }}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-accent hover:bg-accent/90">
                    {isEditMode ? (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Atualizar Orçamento
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Criar Orçamento
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* View Dialog */}
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Detalhes do Orçamento
                </DialogTitle>
              </DialogHeader>
              {viewingOrcamento && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">ID</Label>
                      <p className="font-mono text-sm">{viewingOrcamento.id}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <Badge className={statusColors[viewingOrcamento.status]}>{viewingOrcamento.status}</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Cliente</Label>
                      <p>{viewingOrcamento.cliente}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Valor</Label>
                      <p className="font-semibold text-lg">{formatCurrency(viewingOrcamento.valor)}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Data</Label>
                      <p>{viewingOrcamento.data}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Validade</Label>
                      <p>{viewingOrcamento.validade}</p>
                    </div>
                  </div>
                  {viewingOrcamento.itens && viewingOrcamento.itens.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium">Itens</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Produto</TableHead>
                            <TableHead>Descrição</TableHead>
                            <TableHead>Quantidade</TableHead>
                            <TableHead>Valor Unit.</TableHead>
                            <TableHead>Desconto</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {viewingOrcamento.itens.map((item: any) => (
                            <TableRow key={`item-${item.id}`}>
                              <TableCell className="font-medium">{item.produto || '—'}</TableCell>
                              <TableCell>{item.descricao || '—'}</TableCell>
                              <TableCell>{item.quantidade}</TableCell>
                              <TableCell>{formatCurrency(item.valorUnitario || 0)}</TableCell>
                              <TableCell>{item.descontoPercentual ? `${item.descontoPercentual}%` : formatCurrency(item.descontoValor || 0)}</TableCell>
                              <TableCell className="text-right">{formatCurrency(item.valorTotal || (item.quantidade * (item.valorUnitario || 0)))}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Fechar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* PDF Preview Dialog */}
          <Dialog open={isPdfPreviewOpen} onOpenChange={setIsPdfPreviewOpen}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Visualizar Orçamento - {previewOrcamento?.id}
                </DialogTitle>
              </DialogHeader>
              {pdfBlob && (
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <iframe
                      src={URL.createObjectURL(pdfBlob)}
                      className="w-full h-[500px] border-0"
                      title="PDF Preview"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pdf-notes" className="text-sm font-medium">
                      Observações (opcional)
                    </Label>
                    <Textarea
                      id="pdf-notes"
                      placeholder="Adicione observações ao documento..."
                      value={pdfNotes}
                      onChange={(e) => setPdfNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              )}
              <DialogFooter className="flex gap-2">
                <Button variant="outline" onClick={() => setIsPdfPreviewOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (pdfBlob) {
                      const url = URL.createObjectURL(pdfBlob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `orcamento-${previewOrcamento?.id}.pdf`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                      notifications.success('Sucesso', 'PDF baixado com sucesso.');
                    }
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Baixar PDF
                </Button>
                <Button
                  onClick={() => {
                    notifications.info('Funcionalidade em desenvolvimento', 'Envio por email será implementado em breve.');
                  }}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Enviar por Email
                </Button>
                <Button
                  onClick={() => {
                    notifications.info('Funcionalidade em desenvolvimento', 'Envio por WhatsApp será implementado em breve.');
                  }}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Enviar por WhatsApp
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

          {/* Document Formation Dialog */}
          <Dialog open={isDocDialogOpen} onOpenChange={setIsDocDialogOpen}>
            <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Formar Documento - Orçamento {viewingOrcamento?.id}
                </DialogTitle>
              </DialogHeader>
              {viewingOrcamento && (
                <DocumentGenerator
                  title={`${(viewingOrcamento as any)?.cliente_razao_social || viewingOrcamento.cliente}`}
                  date={viewingOrcamento.data}
                  time={''}
                  location={(viewingOrcamento as any)?.filial || 'Webside Sistemas'}
                  organizer={(viewingOrcamento as any)?.vendedor || 'Equipe Webside'}
                  description={(viewingOrcamento as any)?.observacoes || 'Orçamento personalizado para suas necessidades'}
                  content={`Orçamento preparado especialmente para ${viewingOrcamento.cliente}. Este documento contém todos os itens, quantidades e valores acordados.`}
                  items={viewingOrcamento.itens}
                  valor={viewingOrcamento.valor}
                  cliente={viewingOrcamento.cliente}
                  status={viewingOrcamento.status}
                  validade={viewingOrcamento.validade}
                  type="budget"
                  lead={(viewingOrcamento as any)?.lead}
                  // Additional client data
                  cliente_razao_social={(viewingOrcamento as any)?.cliente_razao_social || viewingOrcamento.cliente}
                  cliente_cnpj={(viewingOrcamento as any)?.cliente_cnpj}
                  cliente_email={(viewingOrcamento as any)?.cliente_email}
                  cliente_telefone={(viewingOrcamento as any)?.cliente_telefone}
                  cliente_endereco={(viewingOrcamento as any)?.cliente_endereco}
                  // Lead data
                  lead_empresa={(viewingOrcamento as any)?.lead_empresa}
                  lead_nome={(viewingOrcamento as any)?.lead_nome}
                  lead_email={(viewingOrcamento as any)?.lead_email}
                  lead_telefone={(viewingOrcamento as any)?.lead_telefone}
                  lead_cargo={(viewingOrcamento as any)?.lead_cargo}
                  // Vendor data
                  vendedor={(viewingOrcamento as any)?.vendedor}
                  vendedor_email={(viewingOrcamento as any)?.vendedor_email}
                  vendedor_telefone={(viewingOrcamento as any)?.vendedor_telefone}
                  // Company data
                  empresa_nome={(viewingOrcamento as any)?.empresa_nome || 'Webside Sistemas'}
                  empresa_cnpj={(viewingOrcamento as any)?.empresa_cnpj}
                  empresa_email={(viewingOrcamento as any)?.empresa_email}
                  empresa_telefone={(viewingOrcamento as any)?.empresa_telefone}
                />
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDocDialogOpen(false)}>
                  Fechar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-accent">{stats.total}</div>
              <p className="text-sm text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.aguardando}</div>
              <p className="text-sm text-muted-foreground">Aguardando</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-green-600">{stats.aprovados}</div>
              <p className="text-sm text-muted-foreground">Aprovados</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-foreground">{formatCurrency(stats.valorTotal)}</div>
              <p className="text-sm text-muted-foreground">Valor Total</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar orçamentos..." 
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Orcamentos Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Orçamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Validade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrcamentos.map((orc, index) => (
                  <TableRow key={`orc-${orc.id}-${index}`}>
                    <TableCell className="font-mono text-sm">{orc.id}</TableCell>
                    <TableCell className="font-medium">{orc.cliente}</TableCell>
                    <TableCell>{formatCurrency(orc.valor)}</TableCell>
                    <TableCell>{orc.data}</TableCell>
                    <TableCell>{orc.validade}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[orc.status]}>{orc.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem key="view" onClick={() => handleView(orc)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem key="edit" onClick={() => handleEdit(orc)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem key="generate-pdf" onClick={() => { handleOpenDocument(orc); }}>
                            <Download className="h-4 w-4 mr-2" />
                            Gerar Documento
                          </DropdownMenuItem>
                          <DropdownMenuSub key="status-change">
                            <DropdownMenuSubTrigger>
                              <FileText className="h-4 w-4 mr-2" />
                              Alterar Status
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem key="aguardando" onClick={() => handleStatusChange(orc, 'Aguardando')}>
                                <Badge className="bg-yellow-100 text-yellow-800 mr-2">Aguardando</Badge>
                              </DropdownMenuItem>
                              <DropdownMenuItem key="aprovado" onClick={() => handleStatusChange(orc, 'Aprovado')}>
                                <Badge className="bg-green-100 text-green-800 mr-2">Aprovado</Badge>
                              </DropdownMenuItem>
                              <DropdownMenuItem key="revisao" onClick={() => handleStatusChange(orc, 'Revisão')}>
                                <Badge className="bg-blue-100 text-blue-800 mr-2">Revisão</Badge>
                              </DropdownMenuItem>
                              <DropdownMenuItem key="recusado" onClick={() => handleStatusChange(orc, 'Recusado')}>
                                <Badge className="bg-red-100 text-red-800 mr-2">Recusado</Badge>
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                          <DropdownMenuItem
                            key="delete"
                            onClick={() => handleDelete(orc.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Orcamentos;