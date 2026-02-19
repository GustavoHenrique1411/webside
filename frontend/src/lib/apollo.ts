
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL || '/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
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
  },
});

export default apolloClient;

