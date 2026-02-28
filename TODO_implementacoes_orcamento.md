# TODO - Implementações de Orçamentos

## Fase 1: Banco de Dados
- [ ] 1. Adicionar campo telefone_whatsapp às tabelas leads e clientes
- [ ] 2. Adicionar campo email_html à tabela templates
- [ ] 3. Criar tabela email_templates para templates de email

## Fase 2: Backend - GraphQL Schema
- [ ] 4. Atualizar schema GraphQL para incluir itens de orçamento
- [ ] 5. Adicionar campos de contato (whatsapp, email) aos types Lead e Cliente
- [ ] 6. Adicionar campos full no Orcamento (itens, cliente, lead data)
- [ ] 7. Criar mutations para enviar email e whatsapp

## Fase 3: Backend - Resolvers
- [ ] 8. Atualizar resolvers para incluir dados completos de orçamento
- [ ] 9. Implementar resolver para gerar TXT do orçamento
- [ ] 10. Implementar resolver para enviar email com PDF
- [ ] 11. Implementar resolver para enviar WhatsApp

## Fase 4: Backend - ROTAS REST (manter compatibilidade)
- [ ] 12. Atualizar rotas REST de orçamentos para incluir todos os dados
- [ ] 13. Criar rota para gerar TXT
- [ ] 14. Criar rota para enviar email
- [ ] 15. Criar rota para enviar WhatsApp

## Fase 5: Frontend - GraphQL Queries/Mutations
- [ ] 16. Atualizar queries para buscar dados completos de orçamento
- [ ] 17. Adicionar mutations para enviar email/whatsapp
- [ ] 18. Adicionar hooks useGraphQL para as novas operações

## Fase 6: Frontend - Componentes
- [ ] 19. Criar componente de visualização/edição de TXT
- [ ] 20. Atualizar MeetingMinutesGenerator para gerar TXT
- [ ] 21. Adicionar botão de enviar por email no diálogo de orçamento
- [ ] 22. Adicionar botão de enviar por WhatsApp no diálogo de orçamento

## Fase 7: Integração e Testes
- [ ] 23. Testar geração de TXT
- [ ] 24. Testar envio de email
- [ ] 25. Testar envio de WhatsApp
- [ ] 26. Ajustar UI/UX conforme necessário

