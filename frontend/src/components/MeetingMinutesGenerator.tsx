import React, { useRef, useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

type MeetingData = {
  title?: string;
  date?: string;
  time?: string;
  location?: string;
  organizer?: string;
  description?: string;
  content?: string;
  type?: string;
  cliente?: string;
  status?: string;
  validade?: string;
  valor?: number | string;
  items?: Array<{
    id: number;
    produto?: string;
    descricao?: string;
    quantidade: number;
    valorUnitario: number;
    descontoPercentual?: number;
    descontoValor?: number;
    valorTotal?: number;
  }>;
  lead?: any; // Lead data if exists
  // Additional client and vendor data
  cliente_razao_social?: string;
  cliente_cnpj?: string;
  cliente_email?: string;
  cliente_telefone?: string;
  cliente_endereco?: string;
  lead_empresa?: string;
  lead_nome?: string;
  lead_email?: string;
  lead_telefone?: string;
  lead_cargo?: string;
  vendedor?: string;
  vendedor_email?: string;
  vendedor_telefone?: string;
  empresa_nome?: string;
  empresa_cnpj?: string;
  empresa_email?: string;
  empresa_telefone?: string;
  jsPDF?: any;
  html2canvas?: any;
};

const defaultData: MeetingData = {
  title: 'Ata da Reunião - Reunião Mensal CIPA',
  date: '14/01/2024',
  time: '14:00',
  location: 'Sala de Reuniões A',
  organizer: 'João Silva',
  description: 'Discussão dos indicadores de segurança e planejamento das atividades do próximo mês',
  content: '',
};

export default function DocumentGenerator({
  title = defaultData.title,
  date = defaultData.date,
  time = defaultData.time,
  location = defaultData.location,
  organizer = defaultData.organizer,
  description = defaultData.description,
  content = defaultData.content,
  type,
  cliente,
  status,
  validade,
  valor,
  items,
  lead,
  // Additional client data
  cliente_razao_social,
  cliente_cnpj,
  cliente_email,
  cliente_telefone,
  cliente_endereco,
  // Lead data
  lead_empresa,
  lead_nome,
  lead_email,
  lead_telefone,
  lead_cargo,
  // Vendor data
  vendedor,
  vendedor_email,
  vendedor_telefone,
  // Company data
  empresa_nome,
  empresa_cnpj,
  empresa_email,
  empresa_telefone,
  jsPDF: jsPDFProp,
}: MeetingData) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [editableContent, setEditableContent] = useState<string>(content || '');

  useEffect(() => {
    setEditableContent(content || '');
  }, []); // Only initialize on mount to prevent overriding user edits

  const generatePdf = async () => {
    if (!ref.current) return;

    const element = ref.current;
    const originalBackground = element.style.backgroundColor;
    element.style.backgroundColor = '#ffffff';

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth - 40;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let y = 20;
      if (imgHeight > pageHeight - 40) {
        let remainingHeight = canvas.height;
        const pageCanvas = document.createElement('canvas');
        const ctx = pageCanvas.getContext('2d')!;

        const ratio = canvas.width / imgWidth;
        const sliceHeight = Math.floor((pageHeight - 40) * ratio);
        pageCanvas.width = canvas.width;

        let offsetY = 0;
        while (remainingHeight > 0) {
          const h = Math.min(sliceHeight, remainingHeight);
          pageCanvas.height = h;
          ctx.clearRect(0, 0, pageCanvas.width, pageCanvas.height);
          ctx.drawImage(canvas, 0, offsetY, pageCanvas.width, h, 0, 0, pageCanvas.width, h);
          const pageImg = pageCanvas.toDataURL('image/png');
          pdf.addImage(pageImg, 'PNG', 20, 20, imgWidth, ((h / pageCanvas.width) * imgWidth));
          remainingHeight -= h;
          offsetY += h;
          if (remainingHeight > 0) pdf.addPage();
        }
      } else {
        pdf.addImage(imgData, 'PNG', 20, y, imgWidth, imgHeight);
      }

      pdf.save(`${title.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Erro ao gerar PDF:', err);
      alert('Erro ao gerar PDF. Veja o console para detalhes.');
    } finally {
      element.style.backgroundColor = originalBackground;
    }
  };

  const formatCurrency = (value: any) => {
    const n = typeof value === 'number' ? value : (value != null ? Number(value) : 0);
    if (Number.isNaN(n)) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
  };

  return (
    <div className="space-y-4">
      <div
        ref={ref}
        className="border rounded-lg p-6 bg-white text-foreground shadow-sm"
        style={{ width: 820 }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src="/logo_webside.png"
              alt="Webside"
              onError={(e) => { (e.target as HTMLImageElement).src = '/logo-companytech.png'; }}
              style={{ height: 48, objectFit: 'contain' }}
            />
            <div>
              <div className="text-sm font-semibold">Webside Sistemas</div>
              <div className="text-xs text-muted-foreground">Soluções em Tecnologia • contato@websidesistemas.com.br</div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xl font-bold">{title}</div>
            <div className="text-sm text-muted-foreground">Documento: ORÇAMENTO</div>
            <div className="text-sm">{date} {time ? `• ${time}` : ''}</div>
          </div>
        </div>

        <div className="border rounded-md p-4 bg-gray-50">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Cliente</div>
              <div className="font-medium">{cliente_razao_social || cliente || '—'}</div>
              {cliente_cnpj && <div className="text-sm text-muted-foreground">CNPJ: {cliente_cnpj}</div>}
              {cliente_email && <div className="text-sm text-muted-foreground">Email: {cliente_email}</div>}
              {cliente_telefone && <div className="text-sm text-muted-foreground">Telefone: {cliente_telefone}</div>}
              {cliente_endereco && <div className="text-sm text-muted-foreground">Endereço: {cliente_endereco}</div>}
              <div className="text-sm text-muted-foreground mt-1">Status: <span className="font-medium">{status || '—'}</span></div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Validade</div>
              <div className="font-medium">{validade || '—'}</div>
              <div className="text-sm text-muted-foreground mt-1">Valor Total: <span className="font-medium">{formatCurrency(valor)}</span></div>
            </div>
          </div>

          {/* Lead Information */}
          {(lead || lead_nome || lead_empresa) && (
            <div className="mt-3 border-l-4 border-green-200 pl-3 pt-1 pb-1 bg-white">
              <div className="text-sm font-medium">Lead:</div>
              <div className="text-sm text-muted-foreground">
                {lead_nome || lead?.nome || lead?.name || '—'} - {lead_empresa || lead?.empresa || lead?.company || '—'}
                {(lead_email || lead?.email) && ` (${lead_email || lead.email})`}
                {lead_telefone && ` - Tel: ${lead_telefone}`}
                {lead_cargo && ` - Cargo: ${lead_cargo}`}
              </div>
            </div>
          )}

          {/* Vendor Information */}
          {vendedor && (
            <div className="mt-3 border-l-4 border-blue-200 pl-3 pt-1 pb-1 bg-white">
              <div className="text-sm font-medium">Vendedor:</div>
              <div className="text-sm text-muted-foreground">
                {vendedor}
                {vendedor_email && ` (${vendedor_email})`}
                {vendedor_telefone && ` - Tel: ${vendedor_telefone}`}
              </div>
            </div>
          )}

          {/* Company Information */}
          {(empresa_nome || empresa_cnpj || empresa_email) && (
            <div className="mt-3 border-l-4 border-purple-200 pl-3 pt-1 pb-1 bg-white">
              <div className="text-sm font-medium">Empresa:</div>
              <div className="text-sm text-muted-foreground">
                {empresa_nome || 'Webside Sistemas'}
                {empresa_cnpj && ` - CNPJ: ${empresa_cnpj}`}
                {empresa_email && ` - Email: ${empresa_email}`}
                {empresa_telefone && ` - Tel: ${empresa_telefone}`}
              </div>
            </div>
          )}

          <div className="mt-3 border-l-4 border-yellow-200 pl-3 pt-1 pb-1 bg-white">
            <div className="text-sm font-medium">Status:</div>
            <div className="text-sm text-muted-foreground">{status}</div>
          </div>
        </div>

        {items && items.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Itens do Orçamento</h3>
            <div className="border rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Produto/Serviço</th>
                    <th className="px-4 py-3 text-left font-medium">Descrição</th>
                    <th className="px-4 py-3 text-center font-medium">Qtd</th>
                    <th className="px-4 py-3 text-right font-medium">Vlr Unit.</th>
                    <th className="px-4 py-3 text-right font-medium">Desconto</th>
                    <th className="px-4 py-3 text-right font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: any, idx: number) => (
                    <tr key={item.id || idx} className="border-t">
                      <td className="px-4 py-3">{item.produto || '—'}</td>
                      <td className="px-4 py-3">{item.descricao || '—'}</td>
                      <td className="px-4 py-3 text-center">{item.quantidade}</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(item.valorUnitario || 0)}</td>
                      <td className="px-4 py-3 text-right">{item.descontoPercentual ? `${item.descontoPercentual}%` : formatCurrency(item.descontoValor || 0)}</td>
                      <td className="px-4 py-3 text-right font-medium">{formatCurrency(item.valorTotal || (item.quantidade * (item.valorUnitario || 0)))}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-100">
                  <tr>
                    <td colSpan={5} className="px-4 py-3 text-right font-medium">Valor Total</td>
                    <td className="px-4 py-3 text-right text-lg font-bold">{formatCurrency(valor)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Condições de Pagamento</h3>
          <div className="border rounded-md p-4 bg-gray-50">
            <div className="text-sm">Condição: <span className="font-medium">À definir</span></div>
            <div className="text-sm mt-1">Forma de pagamento: <span className="font-medium">Boleto / Transferência / Cartão</span></div>
          </div>

          <h3 className="text-sm font-medium mb-2 mt-4">Observações</h3>
          <div className="border rounded-md p-4 bg-gray-50">
            <textarea
              id="doc-content-textarea"
              className="w-full p-2 bg-white border rounded text-sm"
              rows={6}
              value={editableContent || description || ''}
              onChange={(e) => setEditableContent(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={generatePdf}
        >
          Exportar Orçamento (PDF)
        </button>
        <button
          className="px-3 py-2 border rounded bg-white"
          onClick={() => {
            alert('Importar Orçamento: dados já carregados do orçamento.');
          }}
        >
          Importar Orçamento
        </button>
        <button
          className="px-3 py-2 border rounded bg-white"
          onClick={() => {
            // Auto-generate content based on items and description
            let auto = '';
            auto += `Resumo: ${(description || '').trim()}\n\n`;
            if (items && items.length > 0) {
              auto += 'Itens:\n';
              items.forEach((it: any, idx: number) => {
                auto += `${idx + 1}. ${it.produto || '—'} — ${it.descricao || ''} — Qtd: ${it.quantidade} — ${formatCurrency(it.valorUnitario || 0)} — Total: ${formatCurrency(it.valorTotal || (it.quantidade * (it.valorUnitario || 0)))}\n`;
              });
            }
            auto += `\nValor Total: ${formatCurrency(valor)}\n`;
            setEditableContent(auto);
          }}
        >
          Gerar Automática
        </button>
        <button
          className="px-3 py-2 border rounded bg-white"
          onClick={() => {
            const el = document.getElementById('doc-content-textarea') as HTMLTextAreaElement | null;
            if (el) el.focus();
          }}
        >
          Editar
        </button>
      </div>
    </div>
  );
}
