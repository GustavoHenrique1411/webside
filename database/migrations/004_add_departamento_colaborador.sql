-- Migration: 004_add_departamento_colaborador
-- Description: Adiciona campo departamento na tabela colaboradores para permitir departamento direto
-- Created at: 2024-01-15

-- Adicionar coluna departamento na tabela colaboradores (paradepartamento único)
ALTER TABLE colaboradores ADD COLUMN departamento VARCHAR(100) NULL AFTER telefone;

-- Verificar se a tabela colaboradores_departamentos existe e criar se não existir
CREATE TABLE IF NOT EXISTS colaboradores_departamentos (
    id_vinculo INT AUTO_INCREMENT PRIMARY KEY,
    id_colaborador INT NOT NULL,
    id_departamento INT NULL,
    nome_departamento VARCHAR(100) NULL,
    cargo VARCHAR(100) NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NULL,
    ativo TINYINT(1) NOT NULL DEFAULT 1,
    FOREIGN KEY (id_colaborador) REFERENCES colaboradores(id_colaborador) ON DELETE CASCADE,
    FOREIGN KEY (id_departamento) REFERENCES departamentos(id_departamento) ON DELETE SET NULL
);

-- Inserir departamentos base se não existirem
INSERT IGNORE INTO departamentos (id_departamento, id_empresa, nome, descricao, codigo, ativo) VALUES
(1, 1, 'Vendas', 'Departamento de Vendas', 'VEND', 1),
(2, 1, 'Tecnologia', 'Departamento de Tecnologia', 'TI', 1),
(3, 1, 'Financeiro', 'Departamento Financeiro', 'FIN', 1),
(4, 1, 'Suporte', 'Departamento de Suporte', 'SUP', 1),
(5, 1, 'Recursos Humanos', 'Departamento de RH', 'RH', 1),
(6, 1, 'Marketing', 'Departamento de Marketing', 'MKT', 1),
(7, 1, 'Operações', 'Departamento de Operações', 'OPE', 1),
(8, 1, 'Comercial', 'Departamento Comercial', 'COM', 1);

-- Registrar migration
INSERT INTO migrations (nome_migration) VALUES ('004_add_departamento_colaborador');
