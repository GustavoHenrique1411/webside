-- Seed: 001_base_data
-- Description: Dados base essenciais (perfis, status)
-- Created at: 2024-01-01

-- Permissões (perfis de acesso)
INSERT INTO permissoes (nome_perfil, descricao, nivel_acesso, permissoes_json) VALUES
('Administrador', 'Acesso total ao sistema', 10, '{"all": true, "dashboard": true, "usuarios": true, "configuracoes": true, "relatorios": true}'),
('Gerente', 'Acesso completo a vendas e clientes', 8, '{"dashboard": true, "leads": true, "clientes": true, "orcamentos": true, "pedidos": true, "contratos": true, "financeiro": true}'),
('Vendedor', 'Acesso às vendas e clientes', 5, '{"leads": true, "clientes": true, "orcamentos": true, "pedidos": true}'),
('Financeiro', 'Acesso ao financeiro', 6, '{"financeiro": true, "faturas": true, "contratos": true}'),
('Tecnico', 'Acesso às implantações', 3, '{"implantacoes": true, "contratos": true}'),
('Assistente', 'Acesso básico', 1, '{"dashboard": true}');

-- Status de Clientes
INSERT INTO status (tipo_entidade, codigo_status, nome_status, descricao, ordem, cor_hex) VALUES
('cliente', 'NOVO', 'Novo', 'Cliente novo cadastrado', 1, '#3B82F6'),
('cliente', 'ATIVO', 'Ativo', 'Cliente ativo', 2, '#22C55E'),
('cliente', 'INATIVO', 'Inativo', 'Cliente inativo', 3, '#EF4444'),
('cliente', 'BLOQUEADO', 'Bloqueado', 'Cliente bloqueado', 4, '#F97316'),
('cliente', 'PENDENTE', 'Pendente', 'Aguardando aprovação', 5, '#EAB308');

-- Status de Pedidos
INSERT INTO status (tipo_entidade, codigo_status, nome_status, descricao, ordem, cor_hex) VALUES
('pedido', 'RASCUNHO', 'Rascunho', 'Pedido em rascunho', 1, '#6B7280'),
('pedido', 'PENDENTE', 'Pendente', 'Aguardando aprovação', 2, '#EAB308'),
('pedido', 'APROVADO', 'Aprovado', 'Pedido aprovado', 3, '#22C55E'),
('pedido', 'REJEITADO', 'Rejeitado', 'Pedido rejeitado', 4, '#EF4444'),
('pedido', 'CANCELADO', 'Cancelado', 'Pedido cancelado', 5, '#F97316'),
('pedido', 'EM_PROCESSAMENTO', 'Em Processamento', 'Em processamento', 6, '#3B82F6'),
('pedido', 'ENVIADO', 'Enviado', 'Pedido enviado', 7, '#8B5CF6'),
('pedido', 'ENTREGUE', 'Entregue', 'Pedido entregue', 8, '#22C55E');

-- Status de Contratos
INSERT INTO status (tipo_entidade, codigo_status, nome_status, descricao, ordem, cor_hex) VALUES
('contrato', 'RASCUNHO', 'Rascunho', 'Contrato em rascunho', 1, '#6B7280'),
('contrato', 'AGUARDANDO_ASSINATURA', 'Aguardando Assinatura', 'Aguardando assinatura', 2, '#EAB308'),
('contrato', 'ATIVO', 'Ativo', 'Contrato ativo', 3, '#22C55E'),
('contrato', 'ENCERRADO', 'Encerrado', 'Contrato encerrado', 4, '#EF4444'),
('contrato', 'CANCELADO', 'Cancelado', 'Contrato cancelado', 5, '#F97316'),
('contrato', 'RENOVADO', 'Renovado', 'Contrato renovado', 6, '#3B82F6');

-- Status de Implantações
INSERT INTO status (tipo_entidade, codigo_status, nome_status, descricao, ordem, cor_hex) VALUES
('implantacao', 'AGENDADA', 'Agendada', 'Implantação agendada', 1, '#EAB308'),
('implantacao', 'EM_ANDAMENTO', 'Em Andamento', 'Implantação em andamento', 2, '#3B82F6'),
('implantacao', 'CONCLUIDA', 'Concluída', 'Implantação concluída', 3, '#22C55E'),
('implantacao', 'CANCELADA', 'Cancelada', 'Implantação cancelada', 4, '#EF4444'),
('implantacao', 'AGUARDANDO_CLIENTE', 'Aguardando Cliente', 'Aguardando resposta do cliente', 5, '#F97316');

-- Status de Faturas
INSERT INTO status (tipo_entidade, codigo_status, nome_status, descricao, ordem, cor_hex) VALUES
('fatura', 'PENDENTE', 'Pendente', 'Fatura pendente', 1, '#EAB308'),
('fatura', 'PAGA', 'Paga', 'Fatura paga', 2, '#22C55E'),
('fatura', 'VENCIDA', 'Vencida', 'Fatura vencida', 3, '#EF4444'),
('fatura', 'CANCELADA', 'Cancelada', 'Fatura cancelada', 4, '#F97316'),
('fatura', 'EM_PROCESSAMENTO', 'Em Processamento', 'Pagamento em processamento', 5, '#3B82F6');

-- Status de Leads
INSERT INTO status (tipo_entidade, codigo_status, nome_status, descricao, ordem, cor_hex) VALUES
('lead', 'NOVO', 'Novo', 'Lead novo', 1, '#3B82F6'),
('lead', 'CONTATO_INICIAL', 'Contato Inicial', 'Primeiro contato realizado', 2, '#8B5CF6'),
('lead', 'QUALIFICADO', 'Qualificado', 'Lead qualificado', 3, '#EAB308'),
('lead', 'REUNIAO_AGENDADA', 'Reunião Agendada', 'Reunião agendada', 4, '#F97316'),
('lead', 'PROPOSTA_ENVIADA', 'Proposta Enviada', 'Proposta enviada', 5, '#06B6D4'),
('lead', 'NEGOCIACAO', 'Negociação', 'Em negociação', 6, '#EC4899'),
('lead', 'CONVERTIDO', 'Convertido', 'Lead convertido em cliente', 7, '#22C55E'),
('lead', 'PERDIDO', 'Perdido', 'Lead perdido', 8, '#EF4444');

-- Status de Aditivos
INSERT INTO status (tipo_entidade, codigo_status, nome_status, descricao, ordem, cor_hex) VALUES
('aditivo', 'SOLICITADO', 'Solicitado', 'Aditivo solicitado', 1, '#EAB308'),
('aditivo', 'EM_ANALISE', 'Em Análise', 'Em análise', 2, '#3B82F6'),
('aditivo', 'APROVADO', 'Aprovado', 'Aditivo aprovado', 3, '#22C55E'),
('aditivo', 'REJEITADO', 'Rejeitado', 'Aditivo rejeitado', 4, '#EF4444'),
('aditivo', 'CANCELADO', 'Cancelado', 'Aditivo cancelado', 5, '#F97316');

-- Status de Orçamentos
INSERT INTO status (tipo_entidade, codigo_status, nome_status, descricao, ordem, cor_hex) VALUES
('orcamento', 'RASCUNHO', 'Rascunho', 'Orçamento em rascunho', 1, '#6B7280'),
('orcamento', 'PENDENTE', 'Pendente', 'Aguardando aprovação', 2, '#EAB308'),
('orcamento', 'ENVIADO', 'Enviado', 'Orçamento enviado ao cliente', 3, '#3B82F6'),
('orcamento', 'APROVADO', 'Aprovado', 'Orçamento aprovado', 4, '#22C55E'),
('orcamento', 'REJEITADO', 'Rejeitado', 'Orçamento rejeitado', 5, '#EF4444'),
('orcamento', 'EXPIRADO', 'Expirado', 'Orçamento expirado', 6, '#F97316');

-- Parâmetros da Empresa
INSERT INTO parametros_empresa (salario_minimo, percentual_reajuste, dias_vencimento_fatura, taxa_juros_mora, data_vigencia) VALUES
(1412.00, 5.00, 30, 2.00, '2024-01-01');

