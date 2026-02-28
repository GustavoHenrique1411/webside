# TODO - Correções Backend

## Colaboradores

### Correções Realizadas

1. **Frontend - useColaboradores.ts**
   - ✅ Corrigido erro "Cannot read properties of undefined (reading 'nome_completo')"
   - ✅ Hooks agora suportam ambos formatos de parâmetros (direto e Apollo Client)

2. **Backend - resolvers.js**
   - ✅ Adicionada query `departamentos` para listar departamentos
   - ✅ Adicionada query `colaboradores_com_departamentos` para listar colaboradores com info de departamentos

3. **Backend - schema.graphql**
   - ✅ Adicionados tipos `Departamento` e `ColaboradorCompleto`
   - ✅ Adicionadas queries `departamentos` e `colaboradores_com_departamentos`

4. **Frontend - ColaboradoresTab.tsx**
   - ✅ Tabela com informações completas (colaborador, contato, tipo, departamentos, status)
   - ✅ Formulário com validação de campos obrigatórios
   - ✅ Campos de comissão de venda e recorrente
   - ✅ Seleção de departamentos (Vendas, Tecnologia, Financeiro, Suporte)
   - ✅ Status do colaborador (ativo/inativo) na edição
   - ✅ UI/UX melhorada com gradientes e ícones

### Pendente
- [ ] Adicionar mutations para criar/editar departamentos
- [ ] Vincular colaboradores a departamentos na tabela `colaboradores_departamentos`
