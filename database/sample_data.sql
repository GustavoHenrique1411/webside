-- Sample Data Inserts for Gestão Empresarial Database
-- Execute in order to respect foreign key constraints
-- 
-- IMPORTANTE: Execute este script APÓS executar o database_schema.sql
-- 
-- Para executar com segurança (recomendado):
-- USE webside_db;
-- SET FOREIGN_KEY_CHECKS = 0;
-- START TRANSACTION;
-- [Execute todo o conteúdo deste arquivo]
-- COMMIT;
-- SET FOREIGN_KEY_CHECKS = 1;

-- 1. empresas
INSERT INTO empresas (cnpj, razao_social, nome_fantasia, telefone, email) VALUES
('12.345.678/0001-90', 'Empresa Exemplo Ltda', 'Empresa Exemplo', '(11) 9999-9999', 'contato@empresaexemplo.com'),
('98.765.432/0001-10', 'Tech Solutions S.A.', 'Tech Solutions', '(21) 8888-8888', 'info@techsolutions.com');

-- 2. parametros_empresa
INSERT INTO parametros_empresa (salario_minimo, percentual_reajuste, dias_vencimento_fatura, taxa_juros_mora, data_vigencia) VALUES
(1320.00, 5.00, 30, 2.00, '2023-01-01');

-- 3. permissoes
-- Inserir permissões se não existirem (usando INSERT IGNORE ou verificando antes)
-- IMPORTANTE: Execute esta seção ANTES de inserir colaboradores
INSERT IGNORE INTO permissoes (nome_perfil, descricao, nivel_acesso, permissoes_json) VALUES
('Administrador', 'Acesso total ao sistema', 10, '{"all": true}'),
('Vendedor', 'Acesso às vendas e clientes', 5, '{"vendas": true, "clientes": true}'),
('Tecnico', 'Acesso às implantações', 3, '{"implantacoes": true}');


-- Obter IDs das permissões (caso não sejam 1, 2, 3)
SET @admin_perm_id = (SELECT id_permissao FROM permissoes WHERE nome_perfil = 'Administrador' LIMIT 1);
SET @vendedor_perm_id = (SELECT id_permissao FROM permissoes WHERE nome_perfil = 'Vendedor' LIMIT 1);
SET @tecnico_perm_id = (SELECT id_permissao FROM permissoes WHERE nome_perfil = 'Tecnico' LIMIT 1);

-- Inserir colaboradores usando as variáveis (ou IDs fixos se você tiver certeza)
INSERT INTO colaboradores (id_permissao, cpf, nome_completo, email, senha_hash, telefone, tipo_colaborador, data_admissao, comissao_venda, comissao_recorrente, id_usuario_criacao) VALUES
-- Admin user (deve ser o primeiro, email: admin@empresa.com, senha: admin123)
(@admin_perm_id, '000.000.000-00', 'Administrador', 'admin@empresa.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '(00) 0000-0000', 'funcionario', '2023-01-01', 0.00, 0.00, 1),
-- Outros usuários (todos com senha: admin123)
(@admin_perm_id, '123.456.789-00', 'João Silva', 'joao@empresaexemplo.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '(11) 9999-9999', 'funcionario', '2023-01-01', 5.00, 2.00, 1),
(@vendedor_perm_id, '987.654.321-00', 'Maria Santos', 'maria@empresaexemplo.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '(11) 8888-8888', 'funcionario', '2023-02-01', 7.00, 3.00, 1),
(@tecnico_perm_id, '456.789.123-00', 'Carlos Oliveira', 'carlos@empresaexemplo.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '(11) 7777-7777', 'terceiro', '2023-03-01', 0.00, 0.00, 1);

-- Atualizar id_usuario_criacao do admin para referenciar a si mesmo (após inserção)
UPDATE colaboradores SET id_usuario_criacao = (SELECT id_colaborador FROM colaboradores WHERE email = 'admin@empresa.com' LIMIT 1) WHERE email = 'admin@empresa.com';

-- 5. departamentos
INSERT INTO departamentos (id_empresa, nome, descricao, codigo) VALUES
(1, 'Vendas', 'Departamento de Vendas', 'VEND'),
(1, 'Tecnologia', 'Departamento de TI', 'TI'),
(2, 'Suporte', 'Suporte Técnico', 'SUP');

-- 6. colaboradores_departamentos
INSERT INTO colaboradores_departamentos (id_colaborador, id_departamento, cargo, data_inicio) VALUES
(1, 1, 'Gerente de Vendas', '2023-01-01'),
(2, 1, 'Vendedor', '2023-02-01'),
(3, 2, 'Técnico', '2023-03-01');

-- 7. status
INSERT INTO status (tipo_entidade, codigo_status, nome_status, descricao, ordem, cor_hex) VALUES
('cliente', 'ATIVO', 'Ativo', 'Cliente ativo', 1, '#00FF00'),
('cliente', 'INATIVO', 'Inativo', 'Cliente inativo', 2, '#FF0000'),
('pedido', 'PENDENTE', 'Pendente', 'Pedido aguardando aprovação', 1, '#FFFF00'),
('pedido', 'APROVADO', 'Aprovado', 'Pedido aprovado', 2, '#00FF00'),
('contrato', 'ATIVO', 'Ativo', 'Contrato ativo', 1, '#00FF00'),
('contrato', 'ENCERRADO', 'Encerrado', 'Contrato encerrado', 2, '#FF0000'),
('implantacao', 'AGENDADA', 'Agendada', 'Implantação agendada', 1, '#FFFF00'),
('implantacao', 'EM_ANDAMENTO', 'Em Andamento', 'Implantação em andamento', 2, '#FFA500'),
('implantacao', 'CONCLUIDA', 'Concluída', 'Implantação concluída', 3, '#00FF00'),
('fatura', 'PENDENTE', 'Pendente', 'Fatura pendente', 1, '#FFFF00'),
('fatura', 'PAGA', 'Paga', 'Fatura paga', 2, '#00FF00'),
('lead', 'NOVO', 'Novo', 'Lead novo', 1, '#FFFF00'),
('lead', 'QUALIFICADO', 'Qualificado', 'Lead qualificado', 2, '#FFA500'),
('lead', 'CONVERTIDO', 'Convertido', 'Lead convertido', 3, '#00FF00'),
('aditivo', 'SOLICITADO', 'Solicitado', 'Aditivo solicitado', 1, '#FFFF00'),
('aditivo', 'APROVADO', 'Aprovado', 'Aditivo aprovado', 2, '#00FF00'),
('orcamento', 'PENDENTE', 'Pendente', 'Orçamento pendente', 1, '#FFFF00'),
('orcamento', 'APROVADO', 'Aprovado', 'Orçamento aprovado', 2, '#00FF00');

-- 8. templates
INSERT INTO templates (tipo_template, nome_template, assunto, conteudo, variaveis, id_usuario_criacao) VALUES
('email', 'Boas Vindas Cliente', 'Bem-vindo à nossa empresa', 'Olá {{nome}}, seja bem-vindo!', '{"nome": "string"}', 1),
('contrato', 'Contrato Padrão', NULL, 'Contrato padrão de prestação de serviços', '{}', 1);

-- 9. produtos
INSERT INTO produtos (codigo_produto, nome, descricao, tipo_produto, categoria, valor_base, unidade_medida, estoque_minimo, id_usuario_criacao) VALUES
('PROD001', 'Software ERP', 'Sistema de gestão empresarial', 'licenca', 'Software', 5000.00, 'unidade', 1, 1),
('SERV001', 'Consultoria', 'Serviços de consultoria', 'servico', 'Consultoria', 200.00, 'hora', NULL, 1),
('PROD002', 'Hardware', 'Equipamento de computador', 'produto', 'Hardware', 1500.00, 'unidade', 5, 1);

-- 10. leads
INSERT INTO leads (id_empresa, id_colaborador, nome_empresa, cnpj, contato_principal, email_contato, telefone_contato, fonte_lead, probabilidade, valor_estimado, id_status, observacoes) VALUES
(1, 2, 'Cliente Potencial Ltda', '11.222.333/0001-44', 'José Cliente', 'jose@clientepotencial.com', '(11) 6666-6666', 'Site', 70, 10000.00, 12, 'Lead interessado em ERP'),
(2, 2, 'Empresa XYZ', '55.666.777/0001-88', 'Ana XYZ', 'ana@empresaxyz.com', '(21) 5555-5555', 'Indicação', 50, 5000.00, 13, 'Cliente existente querendo expandir');

-- 11. clientes
INSERT INTO clientes (id_empresa, id_lead, id_colaborador, razao_social, nome_fantasia, cnpj, inscricao_estadual, data_fundacao, porte_empresa, id_status) VALUES
(1, 1, 2, 'Cliente Potencial Ltda', 'Cliente Potencial', '11.222.333/0001-44', '123456789', '2010-05-10', 'MED', 1),
(2, 2, 2, 'Empresa XYZ S.A.', 'Empresa XYZ', '55.666.777/0001-88', '987654321', '2005-03-15', 'GRANDE', 1);

-- 12. contatos
INSERT INTO contatos (id_cliente, tipo_contato, nome_contato, email, telefone, cargo, principal) VALUES
(1, 'gestor', 'José Cliente', 'jose@clientepotencial.com', '(11) 6666-6666', 'Diretor', 1),
(1, 'financeiro', 'Maria Financeira', 'maria@clientepotencial.com', '(11) 7777-7777', 'Contadora', 0),
(2, 'tecnico', 'Carlos Técnico', 'carlos@empresaxyz.com', '(21) 8888-8888', 'TI Manager', 1);

-- 13. enderecos
INSERT INTO enderecos (tipo_entidade, id_entidade, cep, logradouro, numero, complemento, bairro, municipio, uf, pais, tipo_endereco, principal) VALUES
('empresa', 1, '01234-567', 'Rua das Empresas', '123', 'Sala 10', 'Centro', 'São Paulo', 'SP', 'Brasil', 'comercial', 1),
('cliente', 1, '04567-890', 'Av. dos Clientes', '456', NULL, 'Jardins', 'São Paulo', 'SP', 'Brasil', 'comercial', 1),
('colaborador', 1, '09876-543', 'Rua dos Funcionários', '789', 'Apt 101', 'Vila Madalena', 'São Paulo', 'SP', 'Brasil', 'residencial', 1);

-- 14. orcamentos
INSERT INTO orcamentos (numero_orcamento, id_lead, id_cliente, id_colaborador, id_empresa, valor_total, validade_dias, observacoes, id_status, data_aprovacao, data_validade) VALUES
('ORC001', 1, NULL, 2, 1, 5500.00, 30, 'Orçamento para ERP', 17, '2023-06-01', '2023-07-01'),
('ORC002', NULL, 2, 2, 2, 7200.00, 15, 'Orçamento para expansão', 18, '2023-06-15', '2023-07-15');

-- 15. orcamentos_itens
INSERT INTO orcamentos_itens (id_orcamento, id_produto, descricao_item, quantidade, valor_unitario, desconto_percentual, desconto_valor, valor_total, ordem) VALUES
(1, 1, 'Licença ERP Básica', 1.00, 5000.00, 0.00, 0.00, 5000.00, 1),
(1, 2, 'Consultoria de Implantação', 10.00, 200.00, 0.00, 0.00, 2000.00, 2),
(2, 1, 'Licença ERP Avançada', 1.00, 5000.00, 10.00, 500.00, 4500.00, 1),
(2, 3, 'Hardware adicional', 2.00, 1500.00, 0.00, 0.00, 3000.00, 2);

-- 16. pedidos
INSERT INTO pedidos (numero_pedido, id_orcamento, id_cliente, id_colaborador, id_empresa, data_pedido, valor_total, data_prevista_entrega, observacoes, id_status) VALUES
('PED001', 1, 1, 2, 1, '2023-06-05', 5500.00, '2023-08-05', 'Pedido aprovado', 4),
('PED002', 2, 2, 2, 2, '2023-06-20', 7200.00, '2023-09-20', 'Pedido em processamento', 3);

-- 17. pedidos_itens
INSERT INTO pedidos_itens (id_pedido, id_produto, descricao_item, quantidade, valor_unitario, desconto_percentual, valor_total) VALUES
(1, 1, 'Licença ERP Básica', 1.00, 5000.00, 0.00, 5000.00),
(1, 2, 'Consultoria de Implantação', 10.00, 200.00, 0.00, 2000.00),
(2, 1, 'Licença ERP Avançada', 1.00, 4500.00, 0.00, 4500.00),
(2, 3, 'Hardware adicional', 2.00, 1500.00, 0.00, 3000.00);

-- 18. contratos
INSERT INTO contratos (numero_contrato, id_pedido, id_cliente, data_assinatura, data_inicio_vigencia, data_fim_vigencia, valor_total, renovacao_automatica, periodicidade_reajuste, arquivo_url, observacoes, id_status) VALUES
('CTR001', 1, 1, '2023-06-10', '2023-07-01', '2024-06-30', 5500.00, 1, 'anual', 'uploads/contratos/ctr001.pdf', 'Contrato de prestação de serviços', 5),
('CTR002', 2, 2, '2023-06-25', '2023-08-01', '2024-07-31', 7200.00, 0, 'semestral', 'uploads/contratos/ctr002.pdf', 'Contrato de licenciamento', 5);

-- 19. contratos_aditivos
INSERT INTO contratos_aditivos (id_contrato, numero_aditivo, descricao, valor_aditivo, data_solicitacao, data_aprovacao, data_efetivacao, arquivo_url, observacoes, id_status) VALUES
(1, 'AD001', 'Aditivo de suporte adicional', 1000.00, '2023-09-01', '2023-09-05', '2023-09-10', 'uploads/aditivos/ad001.pdf', 'Aditivo aprovado', 16);

-- 20. implantacoes
INSERT INTO implantacoes (id_contrato, id_colaborador, data_inicio_prevista, data_fim_prevista, data_inicio_real, data_fim_real, percentual_conclusao, observacoes, id_status) VALUES
(1, 3, '2023-07-01', '2023-07-15', '2023-07-01', '2023-07-10', 100, 'Implantação concluída com sucesso', 9),
(2, 3, '2023-08-01', '2023-08-20', '2023-08-01', NULL, 50, 'Implantação em andamento', 8);

-- 21. comprovacoes
INSERT INTO comprovacoes (id_implantacao, tipo_comprovacao, descricao, arquivo_url, observacoes, id_usuario_upload) VALUES
(1, 'assinatura', 'Assinatura do termo de aceite', 'uploads/comprovacoes/assinatura001.pdf', 'Cliente assinou o termo', 1),
(1, 'foto', 'Foto da instalação', 'uploads/comprovacoes/foto001.jpg', 'Instalação realizada', 3);

-- 22. faturas
INSERT INTO faturas (id_contrato, numero_fatura, data_emissao, data_vencimento, valor_original, valor_final, data_pagamento, valor_pago, observacoes, id_status) VALUES
(1, 'FAT001', '2023-07-01', '2023-07-31', 5500.00, 5500.00, '2023-07-25', 5500.00, 'Fatura paga em dia', 11),
(2, 'FAT002', '2023-08-01', '2023-08-31', 3600.00, 3600.00, NULL, NULL, 'Fatura pendente', 10);

-- 23. reajustes
INSERT INTO reajustes (id_contrato, id_fatura, percentual_reajuste, valor_anterior, valor_novo, data_reajuste, motivo, id_usuario_aprovacao) VALUES
(1, 1, 5.00, 5500.00, 5775.00, '2024-01-01', 'Reajuste anual conforme contrato', 1);

-- Finalizar transação e reativar foreign keys
COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
