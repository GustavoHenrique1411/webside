-- Migration: 005_add_cliente_ideia
-- Description: Adiciona campo cliente_ideia à tabela leads para breve descrição do cliente
-- Created for: Formulário de leads no landing page

ALTER TABLE leads ADD COLUMN cliente_ideia TEXT NULL AFTER observacoes;

-- Registrar migration
INSERT INTO migrations (nome_migration) VALUES ('005_add_cliente_ideia');
