-- Migration: 003_add_telefone_whatsapp_fields
-- Description: Adiciona campos de telefone_whatsapp e contato_cargo às tabelas leads e clientes
-- Created at: 2024-02-19

-- Adicionar coluna telefone_whatsapp na tabela leads
ALTER TABLE leads ADD COLUMN telefone_whatsapp VARCHAR(20) AFTER telefone_contato;

-- Adicionar coluna contato_cargo na tabela leads
ALTER TABLE leads ADD COLUMN contato_cargo VARCHAR(100) AFTER telefone_whatsapp;

-- Adicionar coluna telefone_whatsapp na tabela clientes
ALTER TABLE clientes ADD COLUMN telefone_whatsapp VARCHAR(20) AFTER porte_empresa;

-- Adicionar coluna email_financeiro na tabela clientes
ALTER TABLE clientes ADD COLUMN email_financeiro VARCHAR(100) AFTER telefone_whatsapp;

-- Adicionar coluna telefone_financeiro na tabela clientes
ALTER TABLE clientes ADD COLUMN telefone_financeiro VARCHAR(20) AFTER email_financeiro;

-- Registrar migration
INSERT INTO migrations (nome_migration) VALUES ('003_add_telefone_whatsapp_fields');

