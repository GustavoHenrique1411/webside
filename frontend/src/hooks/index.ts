// Hooks barrel export
export { useApiQuery, useApiMutation } from './useApi';

// Entity-specific hooks (separate files for better organization)
export { useLeads, useCreateLead, useUpdateLead, useDeleteLead } from './useLeads';
export { useClientes, useCreateCliente, useUpdateCliente, useDeleteCliente } from './useClientes';
export { useProdutos, useCreateProduto, useUpdateProduto, useDeleteProduto } from './useProdutos';
export { usePedidos, useCreatePedido, useUpdatePedido, useDeletePedido } from './usePedidos';
export { useOrcamentos, useCreateOrcamento, useUpdateOrcamento, useDeleteOrcamento } from './useOrcamentos';
export { useContratos, useCreateContrato, useUpdateContrato, useDeleteContrato } from './useContratos';
export { useFaturas, useCreateFatura, useUpdateFatura, useDeleteFatura } from './useFaturas';
export { useImplantacoes, useCreateImplantacao, useUpdateImplantacao, useDeleteImplantacao } from './useImplantacoes';
export { useColaboradores, useCreateColaborador, useUpdateColaborador, useDeleteColaborador } from './useColaboradores';
export { useEmpresas, useCreateEmpresa, useUpdateEmpresa, useDeleteEmpresa } from './useEmpresas';
export { useParametrosEmpresa, useUpdateParametrosEmpresa } from './useParametrosEmpresa';
export { useStatus } from './useStatus';
export { useTemplates } from './useTemplates';
export { useTransacoes, useCreateTransacao, useUpdateTransacao, useDeleteTransacao } from './useTransacoes';
export { useProfile, useUpdateProfile } from './useProfile';

// Generic hooks
export { useIsMobile } from './use-mobile';
export { useToast, toast } from './use-toast';

// Re-export from useGraphQL for backwards compatibility
export { 
  useGraphQLQuery,
  useGraphQLMutation
} from './useGraphQL';
