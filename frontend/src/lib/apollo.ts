
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';

// Determine the GraphQL URL based on environment
// In development (npm run dev): uses Vite proxy to forward /graphql to localhost:3000
// In production (Docker): nginx proxies /graphql to backend:3000
const getGraphQLUrl = () => {
  // If explicitly set via env var, use it
  if (import.meta.env.VITE_GRAPHQL_URL) {
    return import.meta.env.VITE_GRAPHQL_URL;
  }
  // Use relative path - works with both Vite proxy (dev) and nginx (production)
  return '/graphql';
};

const httpLink = createHttpLink({
  uri: getGraphQLUrl(),
});

// Debug logging
console.log('GraphQL URL:', getGraphQLUrl());

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  console.log('Auth token:', token ? 'Present' : 'None');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          leads: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          clientes: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          produtos: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          pedidos: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          orcamentos: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          contratos: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          faturas: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          implantacoes: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          colaboradores: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          empresas: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          status: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

export default apolloClient;

