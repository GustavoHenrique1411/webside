# Webside - Sistema de Gestão Empresarial

## ✅ Projeto Pronto para Deploy - GraphQL Only

Sistema de gestão empresarial completo com frontend React/TypeScript e backend Node.js/Express, usando **APENAS GraphQL** para comunicação de API.

### ✅ Funcionalidades Implementadas

#### Frontend (React/TypeScript)
- [x] Sistema de autenticação com JWT via GraphQL
- [x] Dashboard administrativo
- [x] Módulo de Leads com CRUD completo via GraphQL
- [x] Módulo de Clientes com CRUD completo via GraphQL
- [x] Módulo de Produtos com CRUD completo via GraphQL
- [x] Módulo de Pedidos com CRUD completo via GraphQL
- [x] Módulo de Orçamentos com CRUD completo via GraphQL
- [x] Módulo de Contratos com geração PDF via GraphQL
- [x] Módulo Financeiro (Faturas/Transações) via GraphQL
- [x] Módulo de Colaboradores via GraphQL
- [x] Módulo de Empresas via GraphQL
- [x] Módulo de Implantações via GraphQL
- [x] Sistema de Configurações via GraphQL
- [x] Sistema de Perfil de usuário via GraphQL
- [x] Componentes UI (shadcn/ui)
- [x] Layout responsivo
- [x] Tratamento de erros (ErrorBoundary)
- [x] Loading states
- [x] Dialogs conectados para processos de negócio

#### Backend (Node.js/Express) - GraphQL Only
- [x] Servidor Apollo GraphQL
- [x] Schema GraphQL completo
- [x] Resolvers para todas as entidades
- [x] Autenticação JWT
- [x] Middleware de validação
- [x] Conexão MySQL com pool
- [x] Health check endpoint
- [x] Suporte Docker
- [x] **REMOVIDAS todas as rotas REST** - apenas GraphQL

#### Docker & Infraestrutura
- [x] Dockerfile para Frontend (Nginx)
- [x] Dockerfile para Backend (Node.js)
- [x] docker-compose.yml com todos os serviços
- [x] Configuração de desenvolvimento
- [x] Configuração de produção
- [x] Nginx com proxy reverso e API GraphQL
- [x] Health checks para todos os containers
- [x] Makefile para gerenciamento
- [x] .dockerignore otimizado

### 🛠️ Tarefas Futuras (Opcional)

#### Frontend
- [ ] Implementar sistema de notificações em tempo real
- [ ] Adicionar mais validações nos formulários
- [ ] Melhorar performance com code splitting
- [ ] Implementar lazy loading de componentes
- [ ] Adicionar testes unitários
- [ ] Melhorar acessibilidade (ARIA)
- [ ] Implementar export de dados (Excel/PDF)
- [ ] Adicionar gráficos e analytics

#### Backend
- [ ] Adicionar rate limiting
- [ ] Implementar cache
- [ ] Adicionar logs estruturados
- [ ] Implementar paginação
- [ ] Adicionar validação de entrada mais robusta
- [ ] Criar testes unitários

### 📊 Stack Tecnológico

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Apollo Client
- **Backend:** Node.js, Express, Apollo Server, GraphQL
- **Database:** MySQL 8.0+
- **Hospedagem:** Hostgator

### 🚀 Como Executar Localmente

```bash
# Backend (GraphQL)
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

### 📁 Estrutura do Projeto

```
webside/
├── backend/                 # API GraphQL Node.js
│   ├── src/
│   │   ├── graphql/       # Schema e Resolvers GraphQL
│   │   ├── config/        # Configurações (database.js)
│   │   ├── middleware/    # Middlewares (auth.js)
│   │   └── index.js       # Entry point (Apollo Server)
│   └── package.json
├── frontend/               # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── pages/         # Páginas
│   │   ├── contexts/      # Contextos
│   │   ├── hooks/         # Hooks customizados (GraphQL)
│   │   ├── graphql/       # Queries e Mutations
│   │   └── lib/           # Apollo Client config
│   └── public/            # Assets estáticos
└── docker/                 # Configurações Docker
```

### 🔐 Credenciais de Teste

- **Admin:** admin@empresa.com / admin123
- **Teste:** test@test.com / test123

### 📝 Configuração do Banco de Dados

O banco já está configurado no arquivo `backend/src/config/database.js`:
- Host: 162.241.2.103
- Banco: websid23_erp
- Usuário: websid23_dev

### 📝 Módulos do Sistema (Todos via GraphQL)

1. **📈 Dashboard** - Visão geral do negócio
2. **👥 Leads** - Gestão de leads e prospects
3. **🏢 Clientes** - Cadastro e gestão de clientes
4. **📦 Produtos** - Catálogo de produtos/serviços
5. **📋 Pedidos** - Controle de pedidos de venda
6. **💰 Orçamentos** - Criação e gestão de orçamentos
7. **📄 Contratos** - Geração de contratos em PDF
8. **💳 Financeiro** - Controle financeiro e faturas
9. **👷 Implantações** - Gestão de projetos
10. **📊 Relatórios** - Relatórios e analytics
11. **⚙️ Configurações** - Parâmetros do sistema
12. **👤 Perfil** - Perfil do usuário

### 📝 API GraphQL

A API está disponível apenas via GraphQL em:
- **Endpoint:** `http://localhost:5000/graphql`
- **Queries disponíveis:** leads, clientes, produtos, pedidos, orcamentos, contratos, faturas, implantacoes, colaboradores, empresas, transacoes, status, templates
- **Mutations disponíveis:** create/update/delete para todas as entidades

