// /* Setting up ApolloClient  */
// import { InMemoryCache } from 'apollo-cache-inmemory';
// import { split } from 'apollo-link';
// import { HttpLink } from 'apollo-link-http';
// import { WebSocketLink } from 'apollo-link-ws';
// import { getMainDefinition } from 'apollo-utilities';
// import { SubscriptionClient } from 'subscriptions-transport-ws';
// import { onError } from 'apollo-link-error';
// // import ApolloConfig from '../../configs';
// import * as Sentry from '@sentry/browser';
// import ApolloClient from 'apollo-client';

// const httpLink = new HttpLink({
//   uri: ApolloConfig.APOLLO_HTTP
// });

// const subscriptionClient = new SubscriptionClient(
//   ApolloConfig.APOLLO_WS,
//   { lazy: true, reconnect: true },
//   null,
//   []
// );

// const wsLink = new WebSocketLink(subscriptionClient);

// // Development mode
// const onErrorLink = onError(({ graphQLErrors }) => {
//   if (graphQLErrors && process.env.NODE_ENV !== 'production') {
//     graphQLErrors.map(({ message, locations, path }) => {
//       const newError = `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`;
//       console.log(newError);
//     });
//   }

//   if (graphQLErrors && process.env.NODE_ENV === 'production') {
//     graphQLErrors.map(({ message, locations, path }) => {
//       const newError = `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`;
//       Sentry.captureException(newError);
//     });
//   }
// });

// const link = split(
//   // split based on operation type
//   ({ query }) => {
//     const definition = getMainDefinition(query);
//     return (
//       definition.kind === 'OperationDefinition' &&
//       definition.operation === 'subscription'
//     );
//   },
//   wsLink,
//   onErrorLink.concat(httpLink)
// );

// const cache = new InMemoryCache();

// export const apolloClient = new ApolloClient({
//   link,
//   cache,
//   connectToDevTools: process.env.NODE_ENV === 'development'
// });