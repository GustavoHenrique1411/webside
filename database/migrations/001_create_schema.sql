-- Migration: 001_create_schema
-- Description: Cria a estrutura completa do banco de dados
-- Created at: 2024-01-01

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

-- Tabela: migrations (controle de versão)
CREATE TABLE IF NOT EXISTS migrations (
    id_migration INT AUTO_INCREMENT PRIMARY KEY,
    nome_migration VARCHAR(100) NOT NULL UNIQUE,
    executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices Únicos
CREATE UNIQUE INDEX idx_empresas_cnpj ON empresas(cnpj);
CREATE UNIQUE INDEX idx_colaboradores_cpf ON colaboradores(cpf);
CREATE UNIQUE INDEX idx_clientes_cnpj ON clientes(cnpj);
CREATE UNIQUE INDEX idx_produtos_codigo ON produtos(codigo_produto);
CREATE UNIQUE INDEX idx_orcamentos_numero ON orcamentos(numero_orcamento);
CREATE UNIQUE INDEX idx_pedidos_numero ON pedidos(numero_pedido);
CREATE UNIQUE INDEX idx_contratos_numero ON contratos(numero_contrato);

-- Índices de Performance
CREATE INDEX idx_pedidos_cliente_status ON pedidos(id_cliente, id_status);
CREATE INDEX idx_contratos_vigencia_status ON contratos(data_fim_vigencia, id_status);
CREATE INDEX idx_faturas_vencimento_status ON faturas(data_vencimento, id_status);
CREATE INDEX idx_implantacoes_status_fim ON implantacoes(id_status, data_fim_prevista);
CREATE INDEX idx_leads_status_criacao ON leads(id_status, data_criacao);
CREATE INDEX idx_orcamentos_status_validade ON orcamentos(id_status, data_validade);

-- Registrar migration
INSERT INTO migrations (nome_migration) VALUES ('001_create_schema');

