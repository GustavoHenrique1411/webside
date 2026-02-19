# GraphQL Migration Plan for Webside

## Overview
Migrate both backend and frontend from REST to GraphQL for better data fetching and type safety.

## Completed ✅

### Backend
- [x] Install GraphQL dependencies (`@apollo/server`, `graphql`, `graphql-tag`)
- [x] Create GraphQL Schema (backend/graphql/schema.graphql)
- [x] Create GraphQL Resolvers (backend/graphql/resolvers.js)
- [x] Integrate GraphQL with Express (backend/server.js)

### Frontend
- [x] Install GraphQL dependencies (`@apollo/client`, `graphql`)
- [x] Setup Apollo Client (src/lib/apollo.ts)
- [x] Create GraphQL Queries (src/graphql/queries/index.ts)
- [x] Create GraphQL Mutations (src/graphql/mutations/index.ts)

## Remaining Tasks

### Backend
- [ ] Add playground for development (optional)

### Frontend
- [ ] Setup ApolloProvider in main.tsx
- [ ] Create custom hooks for each entity
- [ ] Update components to use GraphQL instead of REST

## How to Use

### Backend
Run the backend server:
```bash
cd backend
npm install
npm run dev
```

The GraphQL endpoint will be available at: `http://localhost:5000/graphql`

### Frontend
Run the frontend:
```bash
npm install
npm run dev
```

Make sure to set the GraphQL URL in your environment or use the default `/graphql` endpoint.

