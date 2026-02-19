# Plano de Migração do Frontend para GraphQL

## Status Atual

### Infraestrutura GraphQL Já Configurada:
- ✅ `frontend/src/lib/apollo.ts` - Apollo Client configurado
- ✅ `frontend/src/graphql/queries/index.ts` - Queries GraphQL
- ✅ `frontend/src/graphql/mutations/index.ts` - Mutations GraphQL  
- ✅ `frontend/src/hooks/useGraphQL.ts` - Hooks customizados
- ✅ `frontend/src/main.tsx` - ApolloProvider configurado

### Páginas Adaptadas:
- ✅ **Leads.tsx** - Já usava GraphQL
- ✅ **Clientes.tsx** - Adaptado para GraphQL
- ✅ **Orcamentos.tsx** - Adaptado para GraphQL
- ✅ **Pedidos.tsx** - Adaptado para GraphQL
- ✅ **Configuracoes.tsx** - Adaptado para GraphQL
- ✅ **Perfil.tsx** - Adaptado para GraphQL
- ✅ **Transacoes.tsx** - Adaptado para GraphQL

### Páginas Que Precisam Ser Adaptadas:
- ❌ **Financeiro.tsx** - Requer tipo Transacao no schema GraphQL

### Páginas que NÃO precisam de adaptação:
- ✅ **Relatorios.tsx** - Dados estáticos (sem API)

## Diferenças de Modelo de Dados

### REST API (atual):
```typescript
interface Cliente {
  id_cliente: number;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  // ...
}
```

### GraphQL (novo):
```typescript
interface Cliente {
  id: ID;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  status_nome: string;  // Em vez de campo status separado
  status_cor: string;
  // ...
}
```

## Tarefas de Migração

### 1. Clientes.tsx ✅
- [x] Substituir import de `apiService` por hooks GraphQL
- [x] Trocar `useState` local por `useClientes()`, `useCreateCliente()`, etc.
- [x] Atualizar nomes de campos (id → id, status_nome → status)
- [x] Atualizar interface para usar campos GraphQL

### 2. Orcamentos.tsx ✅
- [x] Adaptar para GraphQL
- [x] Usar `useOrcamentos()`, `useCreateOrcamento()`, etc.

### 3. Pedidos.tsx ✅
- [x] Adaptar para GraphQL
- [x] Usar `usePedidos()`, `useCreatePedido()`, etc.

### 4. Financeiro.tsx
- [ ] Separar em sub-páginas: Faturas, Contratos
- [ ] Adaptar para GraphQL

### 5. Demais páginas
- [ ] Configuracoes.tsx
- [ ] Perfil.tsx
- [ ] Relatorios.tsx
- [ ] Transacoes.tsx

## Hooks GraphQL Disponíveis

```typescript
// Entidades disponíveis:
useLeads(), useCreateLead(), useUpdateLead(), useDeleteLead()
useClientes(), useCreateCliente(), useUpdateCliente(), useDeleteCliente()
useProdutos(), useCreateProduto(), useUpdateProduto(), useDeleteProduto()
usePedidos(), useCreatePedido(), useUpdatePedido(), useDeletePedido()
useOrcamentos(), useCreateOrcamento(), useUpdateOrcamento(), useDeleteOrcamento()
useContratos(), useCreateContrato(), useUpdateContrato(), useDeleteContrato()
useFaturas(), useCreateFatura(), useUpdateFatura(), useDeleteFatura()
useImplantacoes(), useCreateImplantacao(), useUpdateImplantacao(), useDeleteImplantacao()
useColaboradores(), useCreateColaborador(), useUpdateColaborador(), useDeleteColaborador()
useEmpresas(), useCreateEmpresa(), useUpdateEmpresa(), useDeleteEmpresa()
useStatus(), useTemplates()
```

## Próximos Passos

1. Continuar adaptação página por página
2. Testar cada adaptação
3. Manter compatibilidade com API REST durante transição

