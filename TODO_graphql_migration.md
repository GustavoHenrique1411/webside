# GraphQL Migration Plan for Webside

## Overview
Migrate both backend and frontend from REST to GraphQL for better data fetching and type safety.

## Status: ✅ COMPLETO - TODO O PROJETO USA APENAS GRAPHQL

### Backend
- [x] Install GraphQL dependencies (`@apollo/server`, `graphql`, `graphql-tag`)
- [x] Create GraphQL Schema (backend/graphql/schema.graphql)
- [x] Create GraphQL Resolvers (backend/graphql/resolvers.js)
- [x] Integrate GraphQL with Express (backend/src/index.js)
- [x] Remover rotas REST - apenas GraphQL endpoint disponível

### Frontend
- [x] Install GraphQL dependencies (`@apollo/client`, `graphql`)
- [x] Setup Apollo Client (src/lib/apollo.ts)
- [x] Create GraphQL Queries (src/graphql/queries/index.ts)
- [x] Create GraphQL Mutations (src/graphql/mutations/index.ts)
- [x] Migrar todos os componentes para usar GraphQL
- [x] Remover apiService (REST client) de todos os arquivos

## Arquivo de Configuração

### Backend
O endpoint GraphQL está disponível em: `http://localhost:5000/graphql`

### Frontend
O cliente Apollo está configurado para usar `/graphql` como endpoint padrão.

