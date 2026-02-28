# Plano de Melhorias - Webside ERP

## Análise do Projeto

### Estado Atual
- Backend: GraphQL API completa com Apollo Server
- Frontend: React/TypeScript com shadcn/ui
- Banco de dados: MySQL com schema completo
- Docker: Configuração completa para desenvolvimento e produção

### Problemas Identificados

#### 1. Página de Orçamentos (Orcamentos.tsx)
- [ ] Campos de dados incorretos (cliente vs cliente_nome, data vs data_criacao)
- [ ] Criação de orçamento não está enviando itens corretamente
- [ ] Visualização de orçamento não carrega dados completos
- [ ] Botões de email/WhatsApp mostram mensagens "em desenvolvimento"

#### 2. Backend GraphQL
- [ ] Mutation de criação de orçamento precisa incluir itens
- [ ] Queries precisam retornar dados completos de orçamento

#### 3. Melhorias Gerais
- [ ] Adicionar loading states adequados
- [ ] Melhorar tratamento de erros
- [ ] Adicionar validações nos formulários

## Tarefas de Implementação

### Fase 1: Correção da Página de Orçamentos

#### 1.1 Corrigir campos de dados no Orcamentos.tsx
- Substituir `orcamento.cliente` por `orcamento.cliente_nome`
- Substituir `orcamento.data` por `orcamento.data_criacao`
- Substituir `orcamento.validade` por `orcamento.data_validade`
- Substituir `orcamento.valor` por `orcamento.valor_total`
- Substituir `orcamento.status` por `orcamento.status_nome`
- Adicionar campo `lead_nome` para orçamentos de leads

#### 1.2 Corrigir criação de orçamento
- Enviar itens corretamente na mutation
- Mapear os campos corretamente para o input do GraphQL

#### 1.3 Corrigir visualização de orçamento
- Buscar dados completos do orçamento (com cliente/lead e itens)
- Exibir todos os campos corretamente no diálogo de visualização

#### 1.4 Implementar envio de email/WhatsApp
- Adicionar queries para buscar dados do orçamento com informações de contato
- Conectar com mutations de envio já implementadas no backend

### Fase 2: Melhorias no Backend GraphQL

#### 2.1 Atualizar mutation de criação de orçamento
- Incluir campo `itens` no input de criação

#### 2.2 Adicionar query para gerar TXT
- Implementar `gerarOrcamentoTxt` no frontend

### Fase 3: Melhorias Visuais e UX

#### 3.1 Loading states
- Adicionar skeleton loading nas tabelas
- Melhorar feedback durante carregamento

#### 3.2 Validações
- Adicionar validações nos formulários
- Mostrar mensagens de erro mais claras

## Arquivos a Modificar

1. `frontend/src/pages/admin/Orcamentos.tsx` - Principal
2. `frontend/src/graphql/queries/index.ts` - Adicionar query para orçamento completo
3. `frontend/src/graphql/mutations/index.ts` - Verificar mutations de envio
4. `frontend/src/hooks/useGraphQL.ts` - Adicionar hooks para novas funcionalidades

