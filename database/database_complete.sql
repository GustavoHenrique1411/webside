-- ============================================================================
-- BANCO DE DADOS COMPLETO - GESTÃO EMPRESARIAL
-- ============================================================================
-- Este arquivo contém:
-- 1. Criação do banco de dados
-- 2. Estrutura completa das tabelas (schema)
-- 3. Dados de exemplo para testes
--
-- INSTRUÇÕES DE USO:
-- 1. Execute este arquivo completo no MySQL
-- 2. O script criará o banco, as tabelas e inserirá dados de exemplo
-- 3. Credenciais de login padrão:
--    Email: admin@empresa.com
--    Senha: admin123
-- ============================================================================

-- Criar banco de dados (se não existir)
CREATE DATABASE IF NOT EXISTS webside_db;
USE webside_db;

-- Desabilitar verificação de foreign keys temporariamente
SET FOREIGN_KEY_CHECKS = 0;
START TRANSACTION;

-- ============================================================================
-- PARTE 1: ESTRUTURA DO BANCO DE DADOS (SCHEMA)
-- ============================================================================

-- Tabela: empresas
CREATE TABLE IF NOT EXISTS empresas (
    id_empresa INT AUTO_INCREMENT PRIMARY KEY,
    cnpj VARCHAR(18) NOT NULL UNIQUE,
    razao_social VARCHAR(200) NOT NULL,
    nome_fantasia VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(100),
    ativo TINYINT(1) NOT NULL DEFAULT 1,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela: parametros_empresa
CREATE TABLE IF NOT EXISTS parametros_empresa (
    id_parametro INT AUTO_INCREMENT PRIMARY KEY,
    salario_minimo DECIMAL(10,2) NOT NULL,
    percentual_reajuste DECIMAL(5,2) NOT NULL,
    dias_vencimento_fatura INT NOT NULL,
    taxa_juros_mora DECIMAL(5,2) NOT NULL,
    data_vigencia DATE NOT NULL
);

-- Tabela: enderecos
CREATE TABLE IF NOT EXISTS enderecos (
    id_endereco INT AUTO_INCREMENT PRIMARY KEY,
    tipo_entidade ENUM('empresa','cliente','colaborador') NOT NULL,
    id_entidade INT NOT NULL,
    cep VARCHAR(9) NOT NULL,
    logradouro VARCHAR(200) NOT NULL,
    numero VARCHAR(10) NOT NULL,
    complemento VARCHAR(100),
    bairro VARCHAR(100) NOT NULL,
    municipio VARCHAR(100) NOT NULL,
    uf CHAR(2) NOT NULL,
    pais VARCHAR(50) NOT NULL DEFAULT 'Brasil',
    tipo_endereco ENUM('comercial','residencial','entrega') NOT NULL,
    principal TINYINT(1) NOT NULL DEFAULT 0,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: departamentos
CREATE TABLE IF NOT EXISTS departamentos (
    id_departamento INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    codigo VARCHAR(10) NOT NULL UNIQUE,
    ativo TINYINT(1) NOT NULL DEFAULT 1,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_empresa) REFERENCES empresas(id_empresa)
);

-- Tabela: permissoes
CREATE TABLE IF NOT EXISTS permissoes (
    id_permissao INT AUTO_INCREMENT PRIMARY KEY,
    nome_perfil VARCHAR(50) NOT NULL,
    descricao TEXT,
    nivel_acesso TINYINT NOT NULL CHECK (nivel_acesso BETWEEN 1 AND 10),
    permissoes_json JSON NOT NULL,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: colaboradores
CREATE TABLE IF NOT EXISTS colaboradores (
    id_colaborador INT AUTO_INCREMENT PRIMARY KEY,
    id_permissao INT NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    nome_completo VARCHAR(200) NOT NULL,
    email VARCHAR(100) NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    tipo_colaborador ENUM('funcionario','terceiro') NOT NULL,
    data_admissao DATE NOT NULL,
    comissao_venda DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    comissao_recorrente DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    ativo TINYINT(1) NOT NULL DEFAULT 1,
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_ultimo_login TIMESTAMP NULL,
    id_usuario_criacao INT NOT NULL,
    FOREIGN KEY (id_permissao) REFERENCES permissoes(id_permissao)
);

-- Tabela: colaboradores_departamentos
CREATE TABLE IF NOT EXISTS colaboradores_departamentos (
    id_vinculo INT AUTO_INCREMENT PRIMARY KEY,
    id_colaborador INT NOT NULL,
    id_departamento INT NOT NULL,
    cargo VARCHAR(100) NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NULL,
    ativo TINYINT(1) NOT NULL DEFAULT 1,
    FOREIGN KEY (id_colaborador) REFERENCES colaboradores(id_colaborador),
    FOREIGN KEY (id_departamento) REFERENCES departamentos(id_departamento)
);

-- Tabela: status
CREATE TABLE IF NOT EXISTS status (
    id_status INT AUTO_INCREMENT PRIMARY KEY,
    tipo_entidade ENUM('cliente','pedido','contrato','implantacao','fatura','lead','aditivo','orcamento') NOT NULL,
    codigo_status VARCHAR(20) NOT NULL,
    nome_status VARCHAR(50) NOT NULL,
    descricao TEXT,
    ordem TINYINT NOT NULL,
    cor_hex VARCHAR(7) NOT NULL,
    ativo TINYINT(1) NOT NULL DEFAULT 1,
    UNIQUE (tipo_entidade, codigo_status)
);

-- Tabela: templates
CREATE TABLE IF NOT EXISTS templates (
    id_template INT AUTO_INCREMENT PRIMARY KEY,
    tipo_template ENUM('email','contrato','aditivo','comunicado') NOT NULL,
    nome_template VARCHAR(100) NOT NULL,
    assunto VARCHAR(200),
    conteudo LONGTEXT NOT NULL,
    variaveis JSON,
    ativo TINYINT(1) NOT NULL DEFAULT 1,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_usuario_criacao INT NOT NULL
);

-- Tabela: leads
CREATE TABLE IF NOT EXISTS leads (
    id_lead INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_colaborador INT NOT NULL,
    nome_empresa VARCHAR(200) NOT NULL,
    cnpj VARCHAR(18),
    contato_principal VARCHAR(200) NOT NULL,
    email_contato VARCHAR(100) NOT NULL,
    telefone_contato VARCHAR(20) NOT NULL,
    fonte_lead VARCHAR(50) NOT NULL,
    probabilidade TINYINT NOT NULL CHECK (probabilidade BETWEEN 0 AND 100),
    valor_estimado DECIMAL(10,2),
    id_status INT NOT NULL,
    observacoes TEXT,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_conversao DATE NULL,
    FOREIGN KEY (id_empresa) REFERENCES empresas(id_empresa),
    FOREIGN KEY (id_colaborador) REFERENCES colaboradores(id_colaborador),
    FOREIGN KEY (id_status) REFERENCES status(id_status)
);

-- Tabela: clientes
CREATE TABLE IF NOT EXISTS clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_lead INT NULL,
    id_colaborador INT NOT NULL,
    razao_social VARCHAR(200) NOT NULL,
    nome_fantasia VARCHAR(100) NOT NULL,
    cnpj VARCHAR(18) NOT NULL UNIQUE,
    inscricao_estadual VARCHAR(20),
    data_fundacao DATE,
    porte_empresa ENUM('ME','EPP','MED','GRANDE') NOT NULL,
    id_status INT NOT NULL,
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_status TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ativo TINYINT(1) NOT NULL DEFAULT 1,
    FOREIGN KEY (id_empresa) REFERENCES empresas(id_empresa),
    FOREIGN KEY (id_lead) REFERENCES leads(id_lead),
    FOREIGN KEY (id_colaborador) REFERENCES colaboradores(id_colaborador),
    FOREIGN KEY (id_status) REFERENCES status(id_status)
);

-- Tabela: contatos
CREATE TABLE IF NOT EXISTS contatos (
    id_contato INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    tipo_contato ENUM('gestor','testemunha','financeiro','tecnico') NOT NULL,
    nome_contato VARCHAR(200) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    cargo VARCHAR(100),
    principal TINYINT(1) NOT NULL DEFAULT 0,
    ativo TINYINT(1) NOT NULL DEFAULT 1,
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
);

-- Tabela: produtos
CREATE TABLE IF NOT EXISTS produtos (
    id_produto INT AUTO_INCREMENT PRIMARY KEY,
    codigo_produto VARCHAR(20) NOT NULL UNIQUE,
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    tipo_produto ENUM('produto','servico','licenca') NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    valor_base DECIMAL(10,2) NOT NULL,
    unidade_medida VARCHAR(20) NOT NULL,
    estoque_minimo INT,
    ativo TINYINT(1) NOT NULL DEFAULT 1,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_usuario_criacao INT NOT NULL
);

-- Tabela: orcamentos
CREATE TABLE IF NOT EXISTS orcamentos (
    id_orcamento INT AUTO_INCREMENT PRIMARY KEY,
    numero_orcamento VARCHAR(20) NOT NULL UNIQUE,
    id_lead INT NULL,
    id_cliente INT NULL,
    id_colaborador INT NOT NULL,
    id_empresa INT NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    validade_dias INT NOT NULL,
    observacoes TEXT,
    id_status INT NOT NULL,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_aprovacao DATE NULL,
    data_validade DATE NOT NULL,
    FOREIGN KEY (id_lead) REFERENCES leads(id_lead),
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    FOREIGN KEY (id_colaborador) REFERENCES colaboradores(id_colaborador),
    FOREIGN KEY (id_empresa) REFERENCES empresas(id_empresa),
    FOREIGN KEY (id_status) REFERENCES status(id_status)
);

-- Tabela: orcamentos_itens
CREATE TABLE IF NOT EXISTS orcamentos_itens (
    id_item INT AUTO_INCREMENT PRIMARY KEY,
    id_orcamento INT NOT NULL,
    id_produto INT NOT NULL,
    descricao_item TEXT,
    quantidade DECIMAL(10,2) NOT NULL,
    valor_unitario DECIMAL(10,2) NOT NULL,
    desconto_percentual DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    desconto_valor DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    valor_total DECIMAL(10,2) NOT NULL,
    ordem TINYINT NOT NULL,
    FOREIGN KEY (id_orcamento) REFERENCES orcamentos(id_orcamento),
    FOREIGN KEY (id_produto) REFERENCES produtos(id_produto)
);

-- Tabela: pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    numero_pedido VARCHAR(20) NOT NULL UNIQUE,
    id_orcamento INT NULL,
    id_cliente INT NOT NULL,
    id_colaborador INT NOT NULL,
    id_empresa INT NOT NULL,
    data_pedido DATE NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    data_prevista_entrega DATE,
    observacoes TEXT,
    id_status INT NOT NULL,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_orcamento) REFERENCES orcamentos(id_orcamento),
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    FOREIGN KEY (id_colaborador) REFERENCES colaboradores(id_colaborador),
    FOREIGN KEY (id_empresa) REFERENCES empresas(id_empresa),
    FOREIGN KEY (id_status) REFERENCES status(id_status)
);

-- Tabela: pedidos_itens
CREATE TABLE IF NOT EXISTS pedidos_itens (
    id_item INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_produto INT NOT NULL,
    descricao_item TEXT,
    quantidade DECIMAL(10,2) NOT NULL,
    valor_unitario DECIMAL(10,2) NOT NULL,
    desconto_percentual DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    valor_total DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido),
    FOREIGN KEY (id_produto) REFERENCES produtos(id_produto)
);

-- Tabela: contratos
CREATE TABLE IF NOT EXISTS contratos (
    id_contrato INT AUTO_INCREMENT PRIMARY KEY,
    numero_contrato VARCHAR(20) NOT NULL UNIQUE,
    id_pedido INT NOT NULL,
    id_cliente INT NOT NULL,
    data_assinatura DATE NOT NULL,
    data_inicio_vigencia DATE NOT NULL,
    data_fim_vigencia DATE NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    renovacao_automatica TINYINT(1) NOT NULL DEFAULT 0,
    periodicidade_reajuste ENUM('anual','semestral','trimestral') NOT NULL,
    arquivo_url VARCHAR(500),
    observacoes TEXT,
    id_status INT NOT NULL,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido),
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    FOREIGN KEY (id_status) REFERENCES status(id_status)
);

-- Tabela: contratos_aditivos
CREATE TABLE IF NOT EXISTS contratos_aditivos (
    id_aditivo INT AUTO_INCREMENT PRIMARY KEY,
    id_contrato INT NOT NULL,
    numero_aditivo VARCHAR(20) NOT NULL,
    descricao TEXT NOT NULL,
    valor_aditivo DECIMAL(10,2) NOT NULL,
    data_solicitacao DATE NOT NULL,
    data_aprovacao DATE NULL,
    data_efetivacao DATE NULL,
    arquivo_url VARCHAR(500),
    observacoes TEXT,
    id_status INT NOT NULL,
    FOREIGN KEY (id_contrato) REFERENCES contratos(id_contrato),
    FOREIGN KEY (id_status) REFERENCES status(id_status)
);

-- Tabela: implantacoes
CREATE TABLE IF NOT EXISTS implantacoes (
    id_implantacao INT AUTO_INCREMENT PRIMARY KEY,
    id_contrato INT NOT NULL,
    id_colaborador INT NOT NULL,
    data_inicio_prevista DATE NOT NULL,
    data_fim_prevista DATE NOT NULL,
    data_inicio_real DATE NULL,
    data_fim_real DATE NULL,
    percentual_conclusao TINYINT NOT NULL DEFAULT 0 CHECK (percentual_conclusao BETWEEN 0 AND 100),
    observacoes TEXT,
    id_status INT NOT NULL,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_contrato) REFERENCES contratos(id_contrato),
    FOREIGN KEY (id_colaborador) REFERENCES colaboradores(id_colaborador),
    FOREIGN KEY (id_status) REFERENCES status(id_status)
);

-- Tabela: comprovacoes
CREATE TABLE IF NOT EXISTS comprovacoes (
    id_comprovacao INT AUTO_INCREMENT PRIMARY KEY,
    id_implantacao INT NOT NULL,
    tipo_comprovacao ENUM('foto','documento','assinatura','outro') NOT NULL,
    descricao VARCHAR(200) NOT NULL,
    arquivo_url VARCHAR(500) NOT NULL,
    observacoes TEXT,
    data_upload TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_usuario_upload INT NOT NULL,
    FOREIGN KEY (id_implantacao) REFERENCES implantacoes(id_implantacao)
);

-- Tabela: faturas
CREATE TABLE IF NOT EXISTS faturas (
    id_fatura INT AUTO_INCREMENT PRIMARY KEY,
    id_contrato INT NOT NULL,
    numero_fatura VARCHAR(20) NOT NULL,
    data_emissao DATE NOT NULL,
    data_vencimento DATE NOT NULL,
    valor_original DECIMAL(10,2) NOT NULL,
    valor_final DECIMAL(10,2) NOT NULL,
    data_pagamento DATE NULL,
    valor_pago DECIMAL(10,2) NULL,
    observacoes TEXT,
    id_status INT NOT NULL,
    FOREIGN KEY (id_contrato) REFERENCES contratos(id_contrato),
    FOREIGN KEY (id_status) REFERENCES status(id_status)
);

-- Tabela: reajustes
CREATE TABLE IF NOT EXISTS reajustes (
    id_reajuste INT AUTO_INCREMENT PRIMARY KEY,
    id_contrato INT NOT NULL,
    id_fatura INT NULL,
    percentual_reajuste DECIMAL(5,2) NOT NULL,
    valor_anterior DECIMAL(10,2) NOT NULL,
    valor_novo DECIMAL(10,2) NOT NULL,
    data_reajuste DATE NOT NULL,
    motivo TEXT NOT NULL,
    id_usuario_aprovacao INT NOT NULL,
    FOREIGN KEY (id_contrato) REFERENCES contratos(id_contrato),
    FOREIGN KEY (id_fatura) REFERENCES faturas(id_fatura)
);

-- Tabela: transacoes
CREATE TABLE IF NOT EXISTS transacoes (
    id_transacao INT AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM('entrada','saida') NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data DATE NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    forma_pagamento VARCHAR(50) NOT NULL,
    status ENUM('Pago','Pendente','Atrasado') NOT NULL DEFAULT 'Pendente',
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_usuario_criacao INT NOT NULL
);

-- Índices Únicos
CREATE UNIQUE INDEX IF NOT EXISTS idx_empresas_cnpj ON empresas(cnpj);
CREATE UNIQUE INDEX IF NOT EXISTS idx_colaboradores_cpf ON colaboradores(cpf);
CREATE UNIQUE INDEX IF NOT EXISTS idx_clientes_cnpj ON clientes(cnpj);
CREATE UNIQUE INDEX IF NOT EXISTS idx_produtos_codigo ON produtos(codigo_produto);
CREATE UNIQUE INDEX IF NOT EXISTS idx_orcamentos_numero ON orcamentos(numero_orcamento);
CREATE UNIQUE INDEX IF NOT EXISTS idx_pedidos_numero ON pedidos(numero_pedido);
CREATE UNIQUE INDEX IF NOT EXISTS idx_contratos_numero ON contratos(numero_contrato);

-- Índices de Performance
CREATE INDEX IF NOT EXISTS idx_pedidos_cliente_status ON pedidos(id_cliente, id_status);
CREATE INDEX IF NOT EXISTS idx_contratos_vigencia_status ON contratos(data_fim_vigencia, id_status);
CREATE INDEX IF NOT EXISTS idx_faturas_vencimento_status ON faturas(data_vencimento, id_status);
CREATE INDEX IF NOT EXISTS idx_implantacoes_status_fim ON implantacoes(id_status, data_fim_prevista);
CREATE INDEX IF NOT EXISTS idx_leads_status_criacao ON leads(id_status, data_criacao);
CREATE INDEX IF NOT EXISTS idx_orcamentos_status_validade ON orcamentos(id_status, data_validade);

-- ============================================================================
-- PARTE 2: DADOS DE EXEMPLO (SAMPLE DATA)
-- ============================================================================

-- 1. empresas
INSERT IGNORE INTO empresas (cnpj, razao_social, nome_fantasia, telefone, email) VALUES
('12.345.678/0001-90', 'Empresa Exemplo Ltda', 'Empresa Exemplo', '(11) 9999-9999', 'contato@empresaexemplo.com'),
('98.765.432/0001-10', 'Tech Solutions S.A.', 'Tech Solutions', '(21) 8888-8888', 'info@techsolutions.com');

-- 2. parametros_empresa
INSERT IGNORE INTO parametros_empresa (salario_minimo, percentual_reajuste, dias_vencimento_fatura, taxa_juros_mora, data_vigencia) VALUES
(1320.00, 5.00, 30, 2.00, '2023-01-01');

-- 3. permissoes
INSERT IGNORE INTO permissoes (nome_perfil, descricao, nivel_acesso, permissoes_json) VALUES
('Administrador', 'Acesso total ao sistema', 10, '{"all": true}'),
('Vendedor', 'Acesso às vendas e clientes', 5, '{"vendas": true, "clientes": true}'),
('Tecnico', 'Acesso às implantações', 3, '{"implantacoes": true}');

-- Obter IDs das permissões
SET @admin_perm_id = (SELECT id_permissao FROM permissoes WHERE nome_perfil = 'Administrador' LIMIT 1);
SET @vendedor_perm_id = (SELECT id_permissao FROM permissoes WHERE nome_perfil = 'Vendedor' LIMIT 1);
SET @tecnico_perm_id = (SELECT id_permissao FROM permissoes WHERE nome_perfil = 'Tecnico' LIMIT 1);

-- 4. colaboradores
-- IMPORTANTE: Senha padrão para todos: 'admin123'
-- Hash bcrypt válido: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
INSERT IGNORE INTO colaboradores (id_permissao, cpf, nome_completo, email, senha_hash, telefone, tipo_colaborador, data_admissao, comissao_venda, comissao_recorrente, id_usuario_criacao) VALUES
(@admin_perm_id, '000.000.000-00', 'Administrador', 'admin@empresa.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '(00) 0000-0000', 'funcionario', '2023-01-01', 0.00, 0.00, 1),
(@admin_perm_id, '123.456.789-00', 'João Silva', 'joao@empresaexemplo.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '(11) 9999-9999', 'funcionario', '2023-01-01', 5.00, 2.00, 1),
(@vendedor_perm_id, '987.654.321-00', 'Maria Santos', 'maria@empresaexemplo.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '(11) 8888-8888', 'funcionario', '2023-02-01', 7.00, 3.00, 1),
(@tecnico_perm_id, '456.789.123-00', 'Carlos Oliveira', 'carlos@empresaexemplo.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '(11) 7777-7777', 'terceiro', '2023-03-01', 0.00, 0.00, 1);

-- Atualizar id_usuario_criacao do admin para referenciar a si mesmo
UPDATE colaboradores SET id_usuario_criacao = (SELECT id_colaborador FROM colaboradores WHERE email = 'admin@empresa.com' LIMIT 1) WHERE email = 'admin@empresa.com';

-- 5. departamentos
INSERT IGNORE INTO departamentos (id_empresa, nome, descricao, codigo) VALUES
(1, 'Vendas', 'Departamento de Vendas', 'VEND'),
(1, 'Tecnologia', 'Departamento de TI', 'TI'),
(2, 'Suporte', 'Suporte Técnico', 'SUP');

-- 6. colaboradores_departamentos
INSERT IGNORE INTO colaboradores_departamentos (id_colaborador, id_departamento, cargo, data_inicio) VALUES
(1, 1, 'Gerente de Vendas', '2023-01-01'),
(2, 1, 'Vendedor', '2023-02-01'),
(3, 2, 'Técnico', '2023-03-01');

-- 7. status
INSERT IGNORE INTO status (tipo_entidade, codigo_status, nome_status, descricao, ordem, cor_hex) VALUES
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
INSERT IGNORE INTO templates (tipo_template, nome_template, assunto, conteudo, variaveis, id_usuario_criacao) VALUES
('email', 'Boas Vindas Cliente', 'Bem-vindo à nossa empresa', 'Olá {{nome}}, seja bem-vindo!', '{"nome": "string"}', 1),
('contrato', 'Contrato Padrão', NULL, 'Contrato padrão de prestação de serviços', '{}', 1);

-- 9. produtos
INSERT IGNORE INTO produtos (codigo_produto, nome, descricao, tipo_produto, categoria, valor_base, unidade_medida, estoque_minimo, id_usuario_criacao) VALUES
('PROD001', 'Software ERP', 'Sistema de gestão empresarial', 'licenca', 'Software', 5000.00, 'unidade', 1, 1),
('SERV001', 'Consultoria', 'Serviços de consultoria', 'servico', 'Consultoria', 200.00, 'hora', NULL, 1),
('PROD002', 'Hardware', 'Equipamento de computador', 'produto', 'Hardware', 1500.00, 'unidade', 5, 1);

-- 10. leads
INSERT IGNORE INTO leads (id_empresa, id_colaborador, nome_empresa, cnpj, contato_principal, email_contato, telefone_contato, fonte_lead, probabilidade, valor_estimado, id_status, observacoes) VALUES
(1, 2, 'Cliente Potencial Ltda', '11.222.333/0001-44', 'José Cliente', 'jose@clientepotencial.com', '(11) 6666-6666', 'Site', 70, 10000.00, 12, 'Lead interessado em ERP'),
(2, 2, 'Empresa XYZ', '55.666.777/0001-88', 'Ana XYZ', 'ana@empresaxyz.com', '(21) 5555-5555', 'Indicação', 50, 5000.00, 13, 'Cliente existente querendo expandir');

-- 11. clientes
INSERT IGNORE INTO clientes (id_empresa, id_lead, id_colaborador, razao_social, nome_fantasia, cnpj, inscricao_estadual, data_fundacao, porte_empresa, id_status) VALUES
(1, 1, 2, 'Cliente Potencial Ltda', 'Cliente Potencial', '11.222.333/0001-44', '123456789', '2010-05-10', 'MED', 1),
(2, 2, 2, 'Empresa XYZ S.A.', 'Empresa XYZ', '55.666.777/0001-88', '987654321', '2005-03-15', 'GRANDE', 1);

-- 12. contatos
INSERT IGNORE INTO contatos (id_cliente, tipo_contato, nome_contato, email, telefone, cargo, principal) VALUES
(1, 'gestor', 'José Cliente', 'jose@clientepotencial.com', '(11) 6666-6666', 'Diretor', 1),
(1, 'financeiro', 'Maria Financeira', 'maria@clientepotencial.com', '(11) 7777-7777', 'Contadora', 0),
(2, 'tecnico', 'Carlos Técnico', 'carlos@empresaxyz.com', '(21) 8888-8888', 'TI Manager', 1);

-- 13. enderecos
INSERT IGNORE INTO enderecos (tipo_entidade, id_entidade, cep, logradouro, numero, complemento, bairro, municipio, uf, pais, tipo_endereco, principal) VALUES
('empresa', 1, '01234-567', 'Rua das Empresas', '123', 'Sala 10', 'Centro', 'São Paulo', 'SP', 'Brasil', 'comercial', 1),
('cliente', 1, '04567-890', 'Av. dos Clientes', '456', NULL, 'Jardins', 'São Paulo', 'SP', 'Brasil', 'comercial', 1),
('colaborador', 1, '09876-543', 'Rua dos Funcionários', '789', 'Apt 101', 'Vila Madalena', 'São Paulo', 'SP', 'Brasil', 'residencial', 1);

-- 14. orcamentos
INSERT IGNORE INTO orcamentos (numero_orcamento, id_lead, id_cliente, id_colaborador, id_empresa, valor_total, validade_dias, observacoes, id_status, data_aprovacao, data_validade) VALUES
('ORC001', 1, NULL, 2, 1, 5500.00, 30, 'Orçamento para ERP', 17, '2023-06-01', '2023-07-01'),
('ORC002', NULL, 2, 2, 2, 7200.00, 15, 'Orçamento para expansão', 18, '2023-06-15', '2023-07-15');

-- 15. orcamentos_itens
INSERT IGNORE INTO orcamentos_itens (id_orcamento, id_produto, descricao_item, quantidade, valor_unitario, desconto_percentual, desconto_valor, valor_total, ordem) VALUES
(1, 1, 'Licença ERP Básica', 1.00, 5000.00, 0.00, 0.00, 5000.00, 1),
(1, 2, 'Consultoria de Implantação', 10.00, 200.00, 0.00, 0.00, 2000.00, 2),
(2, 1, 'Licença ERP Avançada', 1.00, 5000.00, 10.00, 500.00, 4500.00, 1),
(2, 3, 'Hardware adicional', 2.00, 1500.00, 0.00, 0.00, 3000.00, 2);

-- 16. pedidos
INSERT IGNORE INTO pedidos (numero_pedido, id_orcamento, id_cliente, id_colaborador, id_empresa, data_pedido, valor_total, data_prevista_entrega, observacoes, id_status) VALUES
('PED001', 1, 1, 2, 1, '2023-06-05', 5500.00, '2023-08-05', 'Pedido aprovado', 4),
('PED002', 2, 2, 2, 2, '2023-06-20', 7200.00, '2023-09-20', 'Pedido em processamento', 3);

-- 17. pedidos_itens
INSERT IGNORE INTO pedidos_itens (id_pedido, id_produto, descricao_item, quantidade, valor_unitario, desconto_percentual, valor_total) VALUES
(1, 1, 'Licença ERP Básica', 1.00, 5000.00, 0.00, 5000.00),
(1, 2, 'Consultoria de Implantação', 10.00, 200.00, 0.00, 2000.00),
(2, 1, 'Licença ERP Avançada', 1.00, 4500.00, 0.00, 4500.00),
(2, 3, 'Hardware adicional', 2.00, 1500.00, 0.00, 3000.00);

-- 18. contratos
INSERT IGNORE INTO contratos (numero_contrato, id_pedido, id_cliente, data_assinatura, data_inicio_vigencia, data_fim_vigencia, valor_total, renovacao_automatica, periodicidade_reajuste, arquivo_url, observacoes, id_status) VALUES
('CTR001', 1, 1, '2023-06-10', '2023-07-01', '2024-06-30', 5500.00, 1, 'anual', 'uploads/contratos/ctr001.pdf', 'Contrato de prestação de serviços', 5),
('CTR002', 2, 2, '2023-06-25', '2023-08-01', '2024-07-31', 7200.00, 0, 'semestral', 'uploads/contratos/ctr002.pdf', 'Contrato de licenciamento', 5);

-- 19. contratos_aditivos
INSERT IGNORE INTO contratos_aditivos (id_contrato, numero_aditivo, descricao, valor_aditivo, data_solicitacao, data_aprovacao, data_efetivacao, arquivo_url, observacoes, id_status) VALUES
(1, 'AD001', 'Aditivo de suporte adicional', 1000.00, '2023-09-01', '2023-09-05', '2023-09-10', 'uploads/aditivos/ad001.pdf', 'Aditivo aprovado', 16);

-- 20. implantacoes
INSERT IGNORE INTO implantacoes (id_contrato, id_colaborador, data_inicio_prevista, data_fim_prevista, data_inicio_real, data_fim_real, percentual_conclusao, observacoes, id_status) VALUES
(1, 3, '2023-07-01', '2023-07-15', '2023-07-01', '2023-07-10', 100, 'Implantação concluída com sucesso', 9),
(2, 3, '2023-08-01', '2023-08-20', '2023-08-01', NULL, 50, 'Implantação em andamento', 8);

-- 21. comprovacoes
INSERT IGNORE INTO comprovacoes (id_implantacao, tipo_comprovacao, descricao, arquivo_url, observacoes, id_usuario_upload) VALUES
(1, 'assinatura', 'Assinatura do termo de aceite', 'uploads/comprovacoes/assinatura001.pdf', 'Cliente assinou o termo', 1),
(1, 'foto', 'Foto da instalação', 'uploads/comprovacoes/foto001.jpg', 'Instalação realizada', 3);

-- 22. faturas
INSERT IGNORE INTO faturas (id_contrato, numero_fatura, data_emissao, data_vencimento, valor_original, valor_final, data_pagamento, valor_pago, observacoes, id_status) VALUES
(1, 'FAT001', '2023-07-01', '2023-07-31', 5500.00, 5500.00, '2023-07-25', 5500.00, 'Fatura paga em dia', 11),
(2, 'FAT002', '2023-08-01', '2023-08-31', 3600.00, 3600.00, NULL, NULL, 'Fatura pendente', 10);

-- 23. reajustes
INSERT IGNORE INTO reajustes (id_contrato, id_fatura, percentual_reajuste, valor_anterior, valor_novo, data_reajuste, motivo, id_usuario_aprovacao) VALUES
(1, 1, 5.00, 5500.00, 5775.00, '2024-01-01', 'Reajuste anual conforme contrato', 1);

-- ============================================================================
-- FINALIZAÇÃO
-- ============================================================================

-- Finalizar transação e reativar foreign keys
COMMIT;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- RESUMO
-- ============================================================================
-- Banco de dados criado com sucesso!
-- 
-- Credenciais de login:
-- Email: admin@empresa.com
-- Senha: admin123
-- 
-- O banco está pronto para uso com todas as tabelas e dados de exemplo.
-- ============================================================================

