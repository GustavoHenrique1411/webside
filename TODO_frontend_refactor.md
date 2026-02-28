
# Plano de Refatoração do Frontend - Webside

## Objetivos
- Reduzir complexidade dos arquivos grandes
- Criar padrão modular para hooks
- Usar AdminCrudPage para páginas CRUD
- Padronizar componentes por entidade

## Estrutura Proposta dos Hooks

```
frontend/src/hooks/
├── index.ts                    # Barrel export
├── use-mobile.tsx             # Mantido
├── use-toast.ts               # Mantido
├── useApi.ts                  # Mantido
├── useGraphQL.ts              # Hooks genéricos
├── useClientes.ts             # Mantido
├── useLeads.ts               # Mantido
├── useOrcamentos.ts          # Mantido
├── useProdutos.ts            # ✅ Criado
├── usePedidos.ts             # ✅ Criado
├── useContratos.ts           # ✅ Criado
├── useFaturas.ts             # ✅ Criado
├── useImplantacoes.ts        # ✅ Criado
├── useColaboradores.ts       # ✅ Criado
├── useEmpresas.ts           # ✅ Criado
├── useStatus.ts              # ✅ Criado
├── useTemplates.ts           # ✅ Criado
├── useProfile.ts             # ✅ Criado
└── useTransacoes.ts         # ✅ Criado
```

## Tarefas Concluídas

### Fase 1: Criar hooks específicos por entidade ✅
- [x] 1.1 Criar useProdutos.ts
- [x] 1.2 Criar usePedidos.ts
- [x] 1.3 Criar useContratos.ts
- [x] 1.4 Criar useFaturas.ts
- [x] 1.5 Criar useImplantacoes.ts
- [x] 1.6 Criar useColaboradores.ts
- [x] 1.7 Criar useEmpresas.ts
- [x] 1.8 Criar useStatus.ts
- [x] 1.9 Criar useTemplates.ts
- [x] 1.10 Criar useProfile.ts
- [x] 1.11 Criar useTransacoes.ts

### Fase 2: Criar componentes para Produtos ✅
- [x] 2.1 ProdutoFormDialog.tsx
- [x] 2.2 ProdutoViewDialog.tsx
- [x] 2.3 ProdutosTable.tsx
- [x] 2.4 ProdutosStats.tsx
- [x] 2.5 index.ts (barrel export)

### Fase 3: Criar componentes para Pedidos ✅
- [x] 3.1 PedidoFormDialog.tsx
- [x] 3.2 PedidoViewDialog.tsx
- [x] 3.3 PedidosTable.tsx
- [x] 3.4 index.ts (barrel export)

### Fase 4: Criar componentes para Contratos ✅
- [x] 4.1 ContratoFormDialog.tsx
- [x] 4.2 ContratoViewDialog.tsx
- [x] 4.3 ContratosTable.tsx
- [x] 4.4 index.ts (barrel export)

### Fase 5: Criar componentes para Faturas ✅
- [x] 5.1 FaturaFormDialog.tsx
- [x] 5.2 FaturaViewDialog.tsx
- [x] 5.3 FaturasTable.tsx
- [x] 5.4 index.ts (barrel export)

### Fase 6: Criar componentes para Implantações ✅
- [x] 6.1 ImplantacaoFormDialog.tsx
- [x] 6.2 ImplantacaoViewDialog.tsx
- [x] 6.3 ImplantacoesTable.tsx
- [x] 6.4 index.ts (barrel export)

### Fase 7: Criar componentes para Colaboradores ✅
- [x] 7.1 ColaboradorFormDialog.tsx
- [x] 7.2 ColaboradorViewDialog.tsx
- [x] 7.3 ColaboradoresTable.tsx
- [x] 7.4 index.ts (barrel export)

### Fase 8: Criar componentes para Empresas ✅
- [x] 8.1 EmpresaFormDialog.tsx
- [x] 8.2 EmpresaViewDialog.tsx
- [x] 8.3 EmpresasTable.tsx
- [x] 8.4 index.ts (barrel export)

### Fase 9: Criar componentes para Transações ✅
- [x] 9.1 TransacaoFormDialog.tsx
- [x] 9.2 TransacaoViewDialog.tsx
- [x] 9.3 TransacoesTable.tsx
- [x] 9.4 index.ts (barrel export)

## Estrutura Final de Componentes

```
frontend/src/components/
├── clientes/           # ✅ Completo
├── leads/              # ✅ Completo
├── orcamentos/         # ✅ Completo
├── produtos/           # ✅ Completo
├── pedidos/            # ✅ Completo
├── contratos/          # ✅ Completo
├── faturas/            # ✅ Completo
├── implantacoes/       # ✅ Completo
├── colaboradores/      # ✅ Completo
├── empresas/           # ✅ Completo
├── transacoes/         # ✅ Completo
└── ui/                # UI Components (shadcn/ui)
```

## Padrão de Componentes

Cada entidade segue o padrão:
```
components/{entidade}/
├── {Entidade}FormDialog.tsx   # Formulário create/edit
├── {Entidade}ViewDialog.tsx   # Visualização details
├── {Entidade}Table.tsx        # Tabela com ações
├── {Entidade}Stats.tsx        # Cards de estatísticas (quando aplicável)
└── index.ts                   # Exports
```

## Próximos Passos

- Integrar os componentes com as páginas existentes
- Testar a funcionalidade CRUD completa
- Adicionar validações necessárias
- Melhorar feedback de loading states

## Observações
- Compatibilidade mantida com código existente
- Todos os tipos TypeScript preservados
- Hooks existentes mantidos
- Nova estrutura modular facilita manutenção


