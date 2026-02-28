-- Seed: 002_sample_data
-- Description: Dados de exemplo para testes
-- Created at: 2024-01-01
-- IMPORTANTE: Execute após 001_base_data

-- Empresas
INSERT INTO empresas (cnpj, razao_social, nome_fantasia, telefone, email) VALUES
('12.345.678/0001-90', 'Empresa Exemplo Ltda', 'Empresa Exemplo', '(11) 9999-9999', 'contato@empresaexemplo.com'),
('98.765.432/0001-10', 'Tech Solutions S.A.', 'Tech Solutions', '(21) 8888-8888', 'info@techsolutions.com'),
('55.444.333/0001-22', 'Global Services Ltda', 'Global Services', '(31) 7777-7777', 'contato@globalservices.com.br'),
('77.888.999/0001-33', 'Inovacao Digital Ltda', 'Inovacao Digital', '(41) 6666-6666', 'ola@inovacaodigital.com.br');

-- Obter IDs para usar nos inserts
SET @empresa_1 = (SELECT id_empresa FROM empresas WHERE cnpj = '12.345.678/0001-90');
SET @empresa_2 = (SELECT id_empresa FROM empresas WHERE cnpj = '98.765.432/0001-10');
SET @empresa_3 = (SELECT id_empresa FROM empresas WHERE cnpj = '55.444.333/0001-22');

SET @perm_admin = (SELECT id_permissao FROM permissoes WHERE nome_perfil = 'Administrador');
SET @perm_gerente = (SELECT id_permissao FROM permissoes WHERE nome_perfil = 'Gerente');
SET @perm_vendedor = (SELECT id_permissao FROM permissoes WHERE nome_perfil = 'Vendedor');
SET @perm_tecnico = (SELECT id_permissao FROM permissoes WHERE nome_perfil = 'Tecnico');

-- Colaboradores (senha: admin123 para todos)
-- Hash bcrypt: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
INSERT INTO colaboradores (id_permissao, cpf, nome_completo, email, senha_hash, telefone, tipo_colaborador, data_admissao, comissao_venda, comissao_recorrente, id_usuario_criacao) VALUES
(@perm_admin, '000.000.000-00', 'Administrador Sistema', 'admin@empresa.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '(00) 0000-0000', 'funcionario', '2023-01-01', 0.00, 0.00, 1),
(@perm_gerente, '111.222.333-44', 'Carlos Gerente', 'carlos@empresa.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '(11) 99999-0001', 'funcionario', '2023-02-15', 3.00, 1.50, 1),
(@perm_vendedor, '222.333.444-55', 'Maria Vendas', 'maria@empresa.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '(11) 99999-0002', 'funcionario', '2023-03-01', 5.00, 2.00, 1),
(@perm_vendedor, '333.444.555-66', 'João Silva', 'joao.silva@empresa.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '(11) 99999-0003', 'funcionario', '2023-04-10', 5.00, 2.00, 1),
(@perm_tecnico, '444.555.666-77', 'Pedro Técnico', 'pedro@empresa.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '(11) 99999-0004', 'terceiro', '2023-05-01', 0.00, 0.00, 1),
(@perm_tecnico, '555.666.777-88', 'Lucas Oliveira', 'lucas@empresa.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '(11) 99999-0005', 'terceiro', '2023-06-15', 0.00, 0.00, 1);

-- Atualizar id_usuario_criacao do admin
UPDATE colaboradores SET id_usuario_criacao = 1 WHERE email = 'admin@empresa.com';

-- Departamentos
INSERT INTO departamentos (id_empresa, nome, descricao, codigo) VALUES
(1, 'Vendas', 'Departamento de Vendas', 'VEND'),
(1, 'Tecnologia', 'Departamento de TI', 'TI'),
(1, 'Financeiro', 'Departamento Financeiro', 'FIN'),
(1, 'Suporte', 'Suporte ao Cliente', 'SUP'),
(2, 'Vendas', 'Departamento de Vendas', 'VEND'),
(2, 'Desenvolvimento', 'Desenvolvimento de Sistemas', 'DEV');

-- Colaboradores x Departamentos
INSERT INTO colaboradores_departamentos (id_colaborador, id_departamento, cargo, data_inicio) VALUES
(1, 1, 'Diretor Geral', '2023-01-01'),
(2, 1, 'Gerente de Vendas', '2023-02-15'),
(3, 1, 'Vendedor Sênior', '2023-03-01'),
(4, 1, 'Vendedor Jr', '2023-04-10'),
(5, 2, 'Técnico de Implantação', '2023-05-01'),
(6, 2, 'Técnico de Suporte', '2023-06-15');

-- Endereços
INSERT INTO enderecos (tipo_entidade, id_entidade, cep, logradouro, numero, complemento, bairro, municipio, uf, pais, tipo_endereco, principal) VALUES
('empresa', 1, '01234-567', 'Av. Paulista', '1000', 'Sala 10', 'Bela Vista', 'São Paulo', 'SP', 'Brasil', 'comercial', 1),
('empresa', 2, '20010-020', 'Av. Rio Branco', '50', 'Conj. 501', 'Centro', 'Rio de Janeiro', 'RJ', 'Brasil', 'comercial', 1),
('empresa', 3, '30100-010', 'Av. Amazonas', '200', NULL', 'Centro', 'Belo Horizonte', 'MG', 'Brasil', 'comercial', 1),
('colaborador', 1, '04567-890', 'Rua Augusta', '500', 'Apt 101', 'Consolação', 'São Paulo', 'SP', 'Brasil', 'residencial', 1),
('colaborador', 2, '05432-100', 'Av. Rebouças', '300', NULL', 'Pinheiros', 'São Paulo', 'SP', 'Brasil', 'residencial', 1);

-- Templates
INSERT INTO templates (tipo_template, nome_template, assunto, conteudo, variaveis, id_usuario_criacao) VALUES
('email', 'Boas Vindas Cliente', 'Bem-vindo à {{empresa}}!', 
'Olá {{nome_contato}},

Somos muito gratos por ter você conosco!

Segue abaixo seus dados de acesso:
- Login: {{email}}
- Senha: {{senha_temporaria}}

Att,
{{nome_usuario}}', 
'{"empresa": "string", "nome_contato": "string", "email": "string", "senha_temporaria": "string", "nome_usuario": "string"}', 1),

('email', 'Follow-up Orçamento', 'Segue proposta comercial - {{empresa}}',
'Olá {{nome_contato}},

Segue nossa proposta comercial para {{servico}}.

Valor: R$ {{valor}}
Validade: {{validade}} dias

Qualquer dúvida, estou à disposição!

Att,
{{nome_usuario}}',
'{"empresa": "string", "nome_contato": "string", "servico": "string", "valor": "string", "validade": "string", "nome_usuario": "string"}', 1),

('contrato', 'Contrato Prestação de Serviços', NULL,
'CONTRATO DE PRESTAÇÃO DE SERVIÇOS

CONTRATANTE: {{nome_cliente}}
CNPJ: {{cnpj}}

CONTRATADA: {{empresa}}
CNPJ: {{cnpj_empresa}}

OBJETO: {{objeto}}
VALOR: R$ {{valor_mensal}}
PERÍODO: {{data_inicio}} a {{data_fim}}',
'{"nome_cliente": "string", "cnpj": "string", "empresa": "string", "cnpj_empresa": "string", "objeto": "string", "valor_mensal": "string", "data_inicio": "date", "data_fim": "date"}', 1);

-- Produtos
INSERT INTO produtos (codigo_produto, nome, descricao, tipo_produto, categoria, valor_base, unidade_medida, estoque_minimo, id_usuario_criacao) VALUES
('LIC001', 'Licença ERP Basic', 'Licença do sistema ERP versão básica', 'licenca', 'Software', 2500.00, 'unidade', NULL, 1),
('LIC002', 'Licença ERP Professional', 'Licença do sistema ERP versão profissional', 'licenca', 'Software', 5000.00, 'unidade', NULL, 1),
('LIC003', 'Licença ERP Enterprise', 'Licença do sistema ERP versão enterprise', 'licenca', 'Software', 10000.00, 'unidade', NULL, 1),
('SERV001', 'Consultoria Presencial', 'Serviço de consultoria in loco', 'servico', 'Consultoria', 800.00, 'dia', NULL, 1),
('SERV002', 'Consultoria Remota', 'Serviço de consultoria online', 'servico', 'Consultoria', 500.00, 'hora', NULL, 1),
('SERV003', 'Implantação Básico', 'Serviço de implantação básico', 'servico', 'Implantação', 3000.00, 'unidade', NULL, 1),
('SERV004', 'Implantação Completo', 'Serviço de implantação completo', 'servico', 'Implantação', 8000.00, 'unidade', NULL, 1),
('SERV005', 'Suporte Mensal', 'Contrato de suporte mensal', 'servico', 'Suporte', 1000.00, 'mes', NULL, 1),
('PROD001', 'Servidor Dedicado', 'Servidor físico para hospedagem', 'produto', 'Hardware', 15000.00, 'unidade', 2, 1),
('PROD002', 'Licença Windows Server', 'Licença Windows Server Standard', 'produto', 'Software', 5000.00, 'unidade', 5, 1);

-- Leads
INSERT INTO leads (id_empresa, id_colaborador, nome_empresa, cnpj, contato_principal, email_contato, telefone_contato, fonte_lead, probabilidade, valor_estimado, id_status, observacoes) VALUES
(@empresa_1, 3, 'Cliente Potencial Ltda', '11.222.333/0001-44', 'José Cliente', 'jose@clientepotencial.com', '(11) 6666-6666', 'Site', 70, 15000.00, (SELECT id_status FROM status WHERE codigo_status = 'QUALIFICADO'), 'Interessado em ERP Professional'),
(@empresa_2, 3, 'Empresa XYZ', '55.666.777/0001-88', 'Ana XYZ', 'ana@empresaxyz.com', '(21) 5555-5555', 'Indicação', 50, 25000.00, (SELECT id_status FROM status WHERE codigo_status = 'PROPOSTA_ENVIADA'), 'Cliente existente querendo expandir'),
(@empresa_1, 4, 'StartUp Inovação', '22.333.444/0001-55', 'Lucas Startup', 'lucas@startup.com.br', '(11) 7777-7777', 'LinkedIn', 30, 8000.00, (SELECT id_status FROM status WHERE codigo_status = 'NOVO'), 'Novo lead do LinkedIn'),
(@empresa_3, 3, 'Indústria Mega', '33.444.555/0001-66', 'Roberto Industrial', 'roberto@mega.com.br', '(31) 8888-8888', 'Feira', 80, 50000.00, (SELECT id_status FROM status WHERE codigo_status = 'NEGOCIACAO'), 'Grande oportunidade');

-- Clientes
INSERT INTO clientes (id_empresa, id_lead, id_colaborador, razao_social, nome_fantasia, cnpj, inscricao_estadual, data_fundacao, porte_empresa, id_status) VALUES
(@empresa_1, 1, 3, 'Cliente Potencial Ltda', 'Cliente Potencial', '11.222.333/0001-44', '123456789', '2010-05-10', 'MED', (SELECT id_status FROM status WHERE codigo_status = 'ATIVO')),
(@empresa_2, 2, 3, 'Empresa XYZ S.A.', 'Empresa XYZ', '55.666.777/0001-88', '987654321', '2005-03-15', 'GRANDE', (SELECT id_status FROM status WHERE codigo_status = 'ATIVO'));

-- Contatos
INSERT INTO contatos (id_cliente, tipo_contato, nome_contato, email, telefone, cargo, principal) VALUES
(1, 'gestor', 'José Cliente', 'jose@clientepotencial.com', '(11) 6666-6666', 'Diretor Geral', 1),
(1, 'financeiro', 'Maria Financeira', 'maria@clientepotencial.com', '(11) 7777-7777', 'Controller', 0),
(1, 'tecnico', 'Carlos TI', 'carlos.ti@clientepotencial.com', '(11) 8888-8888', 'Gerente de TI', 0),
(2, 'gestor', 'Ana XYZ', 'ana@empresaxyz.com', '(21) 5555-5555', 'CEO', 1),
(2, 'financeiro', 'Paulo Financeiro', 'paulo@empresaxyz.com', '(21) 6666-6666', 'Diretor Financeiro', 0),
(2, 'tecnico', 'Carlos Tecnologia', 'carlos@empresaxyz.com', '(21) 7777-7777', 'Gerente de TI', 0);

-- Endereços de clientes
INSERT INTO enderecos (tipo_entidade, id_entidade, cep, logradouro, numero, complemento, bairro, municipio, uf, pais, tipo_endereco, principal) VALUES
('cliente', 1, '04567-890', 'Av. dos Clientes', '456', NULL, 'Jardins', 'São Paulo', 'SP', 'Brasil', 'comercial', 1),
('cliente', 2, '20010-030', 'Av. Presidente Vargas', '1000', 'Andar 5', 'Centro', 'Rio de Janeiro', 'RJ', 'Brasil', 'comercial', 1);

-- Orçamentos
INSERT INTO orcamentos (numero_orcamento, id_lead, id_cliente, id_colaborador, id_empresa, valor_total, validade_dias, observacoes, id_status, data_validade) VALUES
('ORC2024-0001', 1, NULL, 3, @empresa_1, 12500.00, 30, 'Orçamento para ERP Professional + Implantação', (SELECT id_status FROM status WHERE codigo_status = 'APROVADO'), DATE_ADD(CURDATE(), INTERVAL 30 DAY)),
('ORC2024-0002', 2, NULL, 3, @empresa_2, 28000.00, 15, 'Orçamento para upgrade para versão Enterprise', (SELECT id_status FROM status WHERE codigo_status = 'ENVIADO'), DATE_ADD(CURDATE(), INTERVAL 15 DAY));

-- Itens do Orçamento
INSERT INTO orcamentos_itens (id_orcamento, id_produto, descricao_item, quantidade, valor_unitario, desconto_percentual, desconto_valor, valor_total, ordem) VALUES
(1, 2, 'Licença ERP Professional', 1.00, 5000.00, 0.00, 0.00, 5000.00, 1),
(1, 7, 'Serviço de Implantação Completo', 1.00, 8000.00, 10.00, 800.00, 7200.00, 2),
(1, 8, 'Suporte Mensal (12 meses)', 12.00, 1000.00, 0.00, 0.00, 12000.00, 3),
(1, 4, 'Consultoria Presencial', 2.00, 800.00, 50.00, 800.00, 800.00, 4);

-- Pedidos
INSERT INTO pedidos (numero_pedido, id_orcamento, id_cliente, id_colaborador, id_empresa, data_pedido, valor_total, data_prevista_entrega, observacoes, id_status) VALUES
('PED2024-0001', 1, 1, 3, @empresa_1, '2024-01-15', 12500.00, '2024-03-15', 'Pedido aprovado - iniciar implantação', (SELECT id_status FROM status WHERE codigo_status = 'APROVADO'));

-- Itens do Pedido
INSERT INTO pedidos_itens (id_pedido, id_produto, descricao_item, quantidade, valor_unitario, desconto_percentual, valor_total) VALUES
(1, 2, 'Licença ERP Professional', 1.00, 5000.00, 0.00, 5000.00),
(1, 7, 'Serviço de Implantação Completo', 1.00, 7200.00, 0.00, 7200.00),
(1, 8, 'Suporte Mensal (12 meses)', 12.00, 1000.00, 0.00, 12000.00);

-- Contratos
INSERT INTO contratos (numero_contrato, id_pedido, id_cliente, data_assinatura, data_inicio_vigencia, data_fim_vigencia, valor_total, renovacao_automatica, periodicidade_reajuste, arquivo_url, observacoes, id_status) VALUES
('CTR2024-0001', 1, 1, '2024-01-20', '2024-02-01', '2025-01-31', 12500.00, 1, 'anual', 'uploads/contratos/ctr2024-0001.pdf', 'Contrato de licenciamento e implantação', (SELECT id_status FROM status WHERE codigo_status = 'ATIVO'));

-- Aditivos
INSERT INTO contratos_aditivos (id_contrato, numero_aditivo, descricao, valor_aditivo, data_solicitacao, data_aprovacao, data_efetivacao, arquivo_url, observacoes, id_status) VALUES
(1, 'ADT2024-0001', 'Aditivo de suporte adicional - 24/7', 2000.00, '2024-02-01', '2024-02-05', '2024-02-10', 'uploads/aditivos/adt2024-0001.pdf', 'Suporte prioritário 24h', (SELECT id_status FROM status WHERE codigo_status = 'APROVADO'));

-- Implantações
INSERT INTO implantacoes (id_contrato, id_colaborador, data_inicio_prevista, data_fim_prevista, data_inicio_real, data_fim_real, percentual_conclusao, observacoes, id_status) VALUES
(1, 5, '2024-02-01', '2024-02-15', '2024-02-01', '2024-02-12', 100, 'Implantação concluída com sucesso!', (SELECT id_status FROM status WHERE codigo_status = 'CONCLUIDA'));

-- Comprovações
INSERT INTO comprovacoes (id_implantacao, tipo_comprovacao, descricao, arquivo_url, observacoes, id_usuario_upload) VALUES
(1, 'assinatura', 'Termo de aceite assinado', 'uploads/comprovacoes/termo001.pdf', 'Cliente assinou o termo de aceite', 1),
(1, 'foto', 'Foto do servidor instalado', 'uploads/comprovacoes/foto001.jpg', 'Servidor configurado e funcionando', 5),
(1, 'documento', 'Relatório de implantação', 'uploads/comprovacoes/relatorio001.pdf', 'Relatório detalhado da implantação', 5);

-- Faturas
INSERT INTO faturas (id_contrato, numero_fatura, data_emissao, data_vencimento, valor_original, valor_final, data_pagamento, valor_pago, observacoes, id_status) VALUES
(1, 'FAT2024-0001', '2024-02-01', '2024-03-01', 12500.00, 12500.00, '2024-02-28', 12500.00, 'Fatura paga em dia - implantação', (SELECT id_status FROM status WHERE codigo_status = 'PAGA')),
(1, 'FAT2024-0002', '2024-03-01', '2024-04-01', 12500.00, 12500.00, NULL, NULL, 'Fatura mensal - março', (SELECT id_status FROM status WHERE codigo_status = 'PENDENTE'));

-- Transações
INSERT INTO transacoes (tipo, valor, data, descricao, categoria, forma_pagamento, status, id_usuario_criacao) VALUES
('entrada', 12500.00, '2024-02-28', 'Recebimento FAT2024-0001', 'Receita Serviços', 'Transferência', 'Pago', 1),
('entrada', 2000.00, '2024-02-10', 'Recebimento ADT2024-0001', 'Receita Aditivo', 'Transferência', 'Pago', 1);

