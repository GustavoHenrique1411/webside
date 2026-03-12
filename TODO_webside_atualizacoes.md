# Plano de Atualizações do Site Webside - Versão Completa

## Visão Geral
Este documento detalha todas as alterações necessárias para o site da Webside Sistemas conforme solicitado.

---

## Status de Implementação

### Fase 1: Estrutura Base ✅
- [x] 1.1 Criar nova página ContatosSuporte.tsx
- [x] 1.2 Adicionar rota no App.tsx

### Fase 2: Header e Menu ✅
- [x] 2.1 Implementar card de suporte no menu
- [x] 2.2 Estilizar sticky menu

### Fase 3: Seção Hero ✅
- [x] 3.1 Alterar título principal
- [x] 3.2 Substituir imagem (sem container, transparente)
- [x] 3.3 Atualizar estatísticas

### Fase 4: Seção Sobre Nós ✅
- [x] 4.1 Adicionar "+ 500 Cases de sucesso"
- [x] 4.2 Aumentar cards de serviços

### Fase 5: Seção Suporte ✅
- [x] 5.1 Adicionar telefones fixos
- [x] 5.2 Implementar acesso ao chat

### Fase 6: Seção Contato ✅
- [x] 6.1 Adicionar ícone WhatsApp ao botão
- [x] 6.2 Criar cards individuais das filiais
- [x] 6.3 Preparar campo ORIGEM para leads

---

## Alterações Realizadas

### 1. Cabeçalho e Menu
- ✅ Menu sticky com efeito de sombra ao rolar
- ✅ Card de suporte com WhatsApp e link para "Mais contatos"
- ✅ Nova página de Contatos Suporte com telefones fixos e chat

### 2. Seção Hero
- ✅ Título alterado para "Tecnologia que leva seu posto ao futuro."
- ✅ Imagem sem container (sem borda, sem fundo)
- ✅ Estatísticas atualizadas:
  - +14: "20% dos postos operam com WebPosto"
  - 3: "+9 Mil clientes no Brasil"
  - +20: "+ 7 Postos por dia começam com WebPosto"

### 3. Seção Sobre Nós
- ✅ Adicionado "+ 500 Cases de sucesso"

### 4. Seção Suporte
- ✅ WhatsApp: (34) 99299-0408
- ✅ Telefones Fixos: MG, SP, GO
- ✅ Chat Online (botão)
- ✅ Cards individuais das filiais

### 5. Seção Contato
- ✅ Botão WhatsApp com ícone
- ✅ Cards individuais das filiais com "Clique para ver no mapa"
- ✅ Campo hidden "ORIGEM" = "Site"

---

## Arquivos Editados

1. **frontend/src/components/WebsideLanding.tsx** - Main component
2. **frontend/src/App.tsx** - Rota para nova página
3. **frontend/src/pages/ContatosSuporte.tsx** - Nova página

---

## Observações

- O script do Tiflux para chat não foi fornecido. O botão de chat foi implementado como placeholder.
- A imagem de múltiplos dispositivos não foi fornecida. A imagem atual foi mantida sem container.
- O backend já deve estar configurado para receber o campo "origem" no formulário de leads.

