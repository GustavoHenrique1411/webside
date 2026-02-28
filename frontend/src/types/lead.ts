// Tipos para o módulo de Leads
export interface Lead {
  id: number;
  nome_empresa: string;
  cnpj?: string;
  contato_principal: string;
  email_contato: string;
  telefone_contato: string;
  telefone_whatsapp?: string;
  contato_cargo?: string;
  fonte_lead: string;
  probabilidade?: number;
  valor_estimado?: number;
  observacoes?: string;
  data_criacao: string;
  data_conversao?: string;
  status_nome?: string;
  status_cor?: string;
  empresa_nome?: string;
  responsavel?: string;
}

export interface LeadFormData {
  nome: string;
  empresa: string;
  telefone: string;
  email: string;
  status: string;
  origem: string;
}

export interface LeadStats {
  total: number;
  novos: number;
  qualificados: number;
  propostas: number;
}

export const STATUS_COLORS: Record<string, string> = {
  'Novo': 'bg-blue-100 text-blue-800',
  'Contatado': 'bg-yellow-100 text-yellow-800',
  'Qualificado': 'bg-green-100 text-green-800',
  'Proposta': 'bg-purple-100 text-purple-800',
};

export const LEAD_STATUS_OPTIONS = [
  { value: 'Novo', label: 'Novo' },
  { value: 'Contatado', label: 'Contatado' },
  { value: 'Qualificado', label: 'Qualificado' },
  { value: 'Proposta', label: 'Proposta' },
];

export const LEAD_ORIGIN_OPTIONS = [
  { value: 'Site', label: 'Site' },
  { value: 'Google', label: 'Google' },
  { value: 'WhatsApp', label: 'WhatsApp' },
  { value: 'Indicação', label: 'Indicação' },
];

export const createEmptyLeadForm = (): LeadFormData => ({
  nome: '',
  empresa: '',
  telefone: '',
  email: '',
  status: 'Novo',
  origem: 'Site'
});

