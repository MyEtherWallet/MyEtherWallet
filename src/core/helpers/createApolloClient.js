import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client/core';
import { RetryLink } from '@apollo/client/link/retry';
import { WebSocketLink } from '@apollo/client/link/ws';
import { onError } from '@apollo/client/link/error';
import { getMainDefinition } from '@apollo/client/utilities';
import * as Sentry from '@sentry/vue';

export function createApolloClient(httpsEndpoint, wsEndpoint) {
  const httpLink = new HttpLink({
    uri: httpsEndpoint
  });

  const websocket = new WebSocketLink({
    uri: wsEndpoint,
    options: {
      reconnect: true,
      lazy: true,
      timeout: 60000
    }
  });

  const onErrorLink = onError(error => {
    if (error.graphQLErrors && process.env.NODE_ENV !== 'production') {
      error.graphQLErrors.map(({ message, locations, path }) => {
        const newError = `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`;
        // eslint-disable-next-line
        console.error(newError);
      });
    }

    if (error.graphQLErrors && process.env.NODE_ENV === 'production') {
      error.graphQLErrors.map(({ message, locations, path }) => {
        const newError = `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`;
        Sentry.captureException(newError);
      });
    }
  });

  const retry = new RetryLink({
    delay: {
      initial: 500,
      max: 5000,
      jitter: true
    },
    attempts: {
      max: 10,
      retryIf: error =>
        error && error.message
          ? error.message.includes('Failed to fetch')
          : false
    }
  });

  const link = retry.split(
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
