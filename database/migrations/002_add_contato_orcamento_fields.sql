-- Migration: 002_add_contato_orcamento_fields
-- Description: Adiciona campos de contato e email HTML para orçamentos
-- Created at: 2024-01-15

-- Adicionar campo telefone_whatsapp à tabela leads
ALTER TABLE leads ADD COLUMN telefone_whatsapp VARCHAR(20) NULL;

-- Adicionar campo telefone_whatsapp à tabela clientes
ALTER TABLE clientes ADD COLUMN telefone_whatsapp VARCHAR(20) NULL;

-- Adicionar campo email_html à tabela templates
ALTER TABLE templates ADD COLUMN email_html LONGTEXT NULL;

-- Adicionar campos de contato às tabelas para facilitar envio
ALTER TABLE leads ADD COLUMN contato_cargo VARCHAR(100) NULL;
ALTER TABLE clientes ADD COLUMN email_financeiro VARCHAR(100) NULL;
ALTER TABLE clientes ADD COLUMN telefone_financeiro VARCHAR(20) NULL;

-- Criar tabela de email_templates para templates de email específicos
CREATE TABLE IF NOT EXISTS email_templates (
    id_template_email INT AUTO_INCREMENT PRIMARY KEY,
    nome_template VARCHAR(100) NOT NULL,
    tipo_documento ENUM('orcamento', 'pedido', 'contrato', 'fatura', 'comunicado') NOT NULL,
    assunto VARCHAR(200) NOT NULL,
    corpo_html LONGTEXT NOT NULL,
    corpo_texto TEXT NOT NULL,
    variaveis JSON,
    ativo TINYINT(1) NOT NULL DEFAULT 1,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inserir template padrão de orçamento
INSERT INTO email_templates (nome_template, tipo_documento, assunto, corpo_html, corpo_texto, variaveis, ativo) VALUES
('Orçamento Padrão', 'orcamento', 'Orçamento {{numero_orcamento}} - {{empresa_nome}}', 
'<html><body style="font-family: Arial, sans-serif;"><h1>Orçamento {{numero_orcamento}}</h1><p>Prezado(a) {{nome_contato}},</p><p>Segue o orçamento solicitado:</p><table border="1" cellpadding="5"><tr><th>Item</th><th>Descrição</th><th>Qtd</th><th>Valor Unit.</th><th>Total</th></tr>{{itens_html}}</table><p><strong>Valor Total: {{valor_total}}</strong></p><p>Validade: {{validade_dias}} dias</p><p>Atenciosamente,<br>{{vendedor}}</p></body></html>',
'Prezado(a) {{nome_contato}},\n\nSegue o orçamento solicitado:\n\n{{itens_texto}}\n\nValor Total: {{valor_total}}\nValidade: {{validade_dias}} dias\n\nAtenciosamente,\n{{vendedor}}',
'["numero_orcamento", "empresa_nome", "nome_contato", "itens", "valor_total", "validade_dias", "vendedor"]', 1);

-- Registrar migration
INSERT INTO migrations (nome_migration) VALUES ('002_add_contato_orcamento_fields');

