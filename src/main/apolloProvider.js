/* Apollo  */
import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import VueApollo from 'vue-apollo';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { onError } from 'apollo-link-error';
import * as Sentry from '@sentry/vue';
import Vue from 'vue';

// Apollo (Graphql)
const httpLink = new HttpLink({
  uri: 'https://api.ethvm.com'
});

const subscriptionClient = new SubscriptionClient(
  'wss://apiws.ethvm.com',
  { lazy: true, reconnect: true },
  null,
  []
);

const wsLink = new WebSocketLink(subscriptionClient);

// Development mode
const onErrorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors && process.env.NODE_ENV !== 'production') {
    graphQLErrors.map(({ message, locations, path }) => {
      const newError = `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`;
      // eslint-disable-next-line
      console.error(newError);
    });
  }

  if (graphQLErrors && process.env.NODE_ENV === 'production') {
    graphQLErrors.map(({ message, locations, path }) => {
      const newError = `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`;
      Sentry.captureException(newError);
    });
  }
});

const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  onErrorLink.concat(httpLink)
);

const cache = new InMemoryCache();
const apolloClient = new ApolloClient({
  link,
  cache,
  connectToDevTools: process.env.NODE_ENV === 'development'
});

const apolloProvider = new VueApollo({
  clients: {
    apolloClient
  },
  defaultClient: apolloClient
});
Vue.use(VueApollo);
export default apolloProvider;
