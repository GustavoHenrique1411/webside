# Plano de Reorganização do Projeto

## Estrutura Atual (Problemas):
- `/routes` - duplicado (existe também em `/backend/routes`)
- `/middleware` - duplicado (existe também em `/backend/middleware`)
- `/config` - duplicado (existe também em `/backend/config`)
- `server.js` - duplicado (existe também em `/backend/server.js`)
- `package.json` - duplicado (existe também em `/backend/package.json`)
- `/backend/php/` - versão PHP não utilizada
- `/src` - frontend misturado na raiz

## Estrutura Proposta:
```
webside/
├── frontend/           # Frontend React (novo)
│   ├── src/           # Código fonte React
│   ├── public/        # Arquivos estáticos
│   ├── package.json  # Dependências do frontend
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   └── index.html
│
├── backend/           # Backend Node.js
│   ├── src/
│   │   ├── routes/   # Rotas da API
│   │   ├── middleware/ # Middlewares
│   │   ├── config/   # Configurações
│   │   ├── graphql/  # Schemas e resolvers
│   │   └── index.js  # Entry point
│   ├── package.json
│   └── .env
│
├── database/          # Scripts de banco de dados
│   ├── schema.sql
│   ├── complete.sql
│   └── sample_data.sql
│
├── docker/            # Configurações Docker
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   ├── docker-compose.yml
│   └── nginx.conf
│
├── docs/             # Documentação
│   └── documentos/
│
├── package.json      # Root package.json (scripts de dev)
├── tsconfig.json     # TypeScript config raiz
└── .gitignore
```

## Passos de Execução:

### Passo 1: Criar diretórios
- [x] 1.1 Criar `/frontend` e mover `/src` para `/frontend/src`
- [x] 1.2 Mover `/public` para `/frontend/public`
- [x] 1.3 Criar `/database` e mover arquivos SQL
- [x] 1.4 Criar `/docker` e mover Dockerfiles e docker-compose
- [x] 1.5 Criar `/docs` e mover `/documentos`

### Passo 2: Mover arquivos de configuração para frontend
- [x] 2.1 Mover vite.config.ts para /frontend
- [x] 2.2 Mover tailwind.config.ts para /frontend
- [x] 2.3 Mover postcss.config.js para /frontend
- [x] 2.4 Mover index.html para /frontend
- [x] 2.5 Mover tsconfig*.json para /frontend (ou criar novos)
- [x] 2.6 Mover package.json (frontend) para /frontend/package.json
- [x] 2.7 Mover eslint.config.js para /frontend

### Passo 3: Limpar arquivos duplicados da raiz
- [x] 3.1 Remover `/routes` duplicado
- [x] 3.2 Remover `/middleware` duplicado
- [x] 3.3 Remover `/config` duplicado
- [x] 3.4 Remover server.js duplicado da raiz
- [x] 3.5 Remover package.json duplicado da raiz

### Passo 4: Atualizar backend
- [x] 4.1 Mover backend/server.js para backend/src/index.js
- [x] 4.2 Mover backend/routes/* para backend/src/routes/
- [x] 4.3 Mover backend/middleware/* para backend/src/middleware/
- [x] 4.4 Mover backend/config/* para backend/src/config/
- [x] 4.5 Mover backend/graphql/* para backend/src/graphql/
- [x] 4.6 Atualizar imports no backend

### Passo 5: Criar package.json raiz
- [x] 5.1 Criar package.json raiz com scripts de desenvolvimento
- [x] 5.2 Atualizar configurações de path

### Passo 6: Atualizar Docker e configurações
- [x] 6.1 Atualizar Dockerfiles
- [x] 6.2 Atualizar docker-compose.yml
- [x] 6.3 Atualizar nginx.conf
- [x] 6.4 Atualizar Makefile

## Dependências a instalar:
- Todas as dependências atuais serão movidas para suas respectivas pastas

