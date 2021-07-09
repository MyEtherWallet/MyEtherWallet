import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { onError } from 'apollo-link-error';
import * as Sentry from '@sentry/vue';
import ApolloClient from 'apollo-client';
import { SubscriptionClient } from 'subscriptions-transport-ws';

export function createApolloClient(httpsEndpoint, wsEndpoint) {
  const httpLink = new HttpLink({
    uri: httpsEndpoint
  });

  const subscriptionClient = new SubscriptionClient(
    wsEndpoint,
    { lazy: true, reconnect: true },
    null,
    []
  );

  const websocket = new WebSocketLink(subscriptionClient);

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
    websocket,
    onErrorLink.concat(httpLink)
  );
  return new ApolloClient({
    link: link,
    cache: new InMemoryCache()
  });
}
