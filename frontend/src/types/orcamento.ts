// Tipos para o módulo de Orçamentos
export interface Orcamento {
  id: number;
  numero_orcamento: string;
  valor_total: number;
  validade_dias: number;
  observacoes: string;
  data_criacao: string;
  data_aprovacao: string | null;
  data_validade: string;
  status_nome: string;
  status_cor: string;
  cliente_nome: string;
  lead_nome: string;
  vendedor: string;
  empresa_nome: string;
  cliente?: OrcamentoCliente;
  lead?: OrcamentoLead;
  itens?: OrcamentoItem[];
}

export interface OrcamentoCliente {
  id: number;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  email_financeiro: string;
  telefone_financeiro: string;
  telefone_whatsapp: string;
}

export interface OrcamentoLead {
  id: number;
  nome_empresa: string;
  contato_principal: string;
  email_contato: string;
  telefone_contato: string;
  telefone_whatsapp: string;
}

export interface OrcamentoItem {
  id: number;
  id_produto: number | null;
  produto_nome: string;
  codigo_produto: string;
  descricao_item: string;
  quantidade: number;
  valor_unitario: number;
  desconto_percentual: number;
  desconto_valor: number;
  valor_total: number;
  ordem: number;
}

export interface OrcamentoFormData {
  origem: 'lead' | 'cliente';
  leadId: string;
  clienteId: string;
  empresa: string;
  cnpj: string;
  contato: string;
  telefone: string;
  email: string;
  vendedor: string;
  filial: string;
  validade: number;
  itens: OrcamentoItemFormData[];
  descontoGeral: number;
  parcelas: number;
  observacoes: string;
}

export interface OrcamentoItemFormData {
  produto: string;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  descontoPercentual: number;
  descontoValor: number;
}

export interface OrcamentoStats {
  total: number;
  aguardando: number;
  aprovados: number;
  valorTotal: number;
}

export const STATUS_COLORS: Record<string, string> = {
  'Aguardando': 'bg-yellow-100 text-yellow-800',
  'Aprovado': 'bg-green-100 text-green-800',
  'Revisão': 'bg-blue-100 text-blue-800',
  'Recusado': 'bg-red-100 text-red-800',
};

export const ORCAMENTO_STATUS_IDS: Record<string, number> = {
  'Aguardando': 17,
  'Aprovado': 18,
  'Revisão': 19,
  'Recusado': 20,
};

export const createEmptyOrcamentoForm = (): OrcamentoFormData => ({
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

export const createEmptyItem = (): OrcamentoItemFormData => ({
  produto: '',
  descricao: '',
  quantidade: 1,
  valorUnitario: 0,
  descontoPercentual: 0,
  descontoValor: 0
});

export const formatCurrency = (value: any): string => {
  const n = typeof value === 'number' ? value : (value != null ? Number(value) : 0);
  if (Number.isNaN(n)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
};

export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('pt-BR');
};

