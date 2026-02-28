// Tipos para o módulo de Clientes
export interface Cliente {
  id: number;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  inscricao_estadual?: string;
  data_fundacao?: string;
  porte_empresa: string;
  ativo: boolean;
  data_cadastro: string;
  status_nome?: string;
  status_cor?: string;
}

export interface ClienteFormData {
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  inscricao_estadual: string;
  porte_empresa: string;
  data_fundacao: string;
}

export interface ClienteStats {
  total: number;
  ativos: number;
  inativos: number;
}

export const STATUS_COLORS: Record<string, string> = {
  'Ativo': 'bg-green-100 text-green-800',
  'Inativo': 'bg-gray-100 text-gray-800',
};

export const PORTE_EMPRESAS = [
  { value: 'ME', label: 'Microempresa (ME)' },
  { value: 'EPP', label: 'Empresa de Pequeno Porte (EPP)' },
  { value: 'MEI', label: 'Microempreendedor Individual (MEI)' },
  { value: 'LTDA', label: 'Sociedade Limitada (LTDA)' },
  { value: 'SA', label: 'Sociedade Anônima (SA)' },
];

export const createEmptyClienteForm = (): ClienteFormData => ({
  razao_social: '',
  nome_fantasia: '',
  cnpj: '',
  inscricao_estadual: '',
  porte_empresa: 'ME',
  data_fundacao: ''
});

export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('pt-BR');
};

