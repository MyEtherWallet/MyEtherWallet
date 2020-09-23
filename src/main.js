/* eslint camelcase: 0 */
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';
import app from './app';

import Vue from 'vue';
import Router from 'vue-router';
import router from '@/router';
import store from '@/store';
import Vuex from 'vuex';

// etc
import mewComponents from '@myetherwallet/mew-components';
import languages from '@/translations';
import '@/plugins/registerServiceWorker';
import { Promise } from 'q';
import VueI18n from 'vue-i18n';
import vuetify from '@/plugins/vuetify';

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
import ApolloConfig from '../configs';

import whiteSheet from '@/components/white-sheet/WhiteSheet.vue';
Vue.component('mew6-white-sheet', whiteSheet);

Vue.prototype.$eventHub = new Vue();

//Router
Vue.use(Router);
Vue.router = router;

Vue.config.productionTip = false;

Vue.use(Vuex);

Object.keys(mewComponents).forEach(name => {
  Vue.component(name, mewComponents[name]);
});

// // Define vue-i18n
Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: 'en_US',
  fallbackLocale: 'en_US',
  messages: languages,
  silentTranslationWarn: true
});
Vue.$i18n = i18n;

// Apollo (Graphql)
const httpLink = new HttpLink({
  uri: ApolloConfig.APOLLO_HTTP
});

const subscriptionClient = new SubscriptionClient(
  ApolloConfig.APOLLO_WS,
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
      console.log(newError);
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

/* eslint-disable no-new */
const vue = new Vue({
  el: '#app',
  i18n,
  router,
  store,
  apolloProvider,
  vuetify,
  render: h => h(app)
});

const integration = new Integrations.Vue({
  Vue,
  attachProps: true
});

// Sentry
Sentry.init({
  dsn: 'https://2c4e977d74fd44d1b18083e63a3b265f@sentry.mewapi.io/1',
  integrations: [integration],
  maxBreadcrumbs: 0,
  environment: 'web',
  requestBodies: 'small',
  release: NODE_ENV === 'production' ? VERSION : 'develop',
  beforeSend(event) {
    const network =
      !store && !store.state && !store.state.network
        ? store.state.network.type.name
        : '';
    const service =
      !store && !store.state && !store.state.network
        ? store.state.network.service
        : '';
    const identifier =
      !store && !store.state && !store.state.account
        ? store.state.account.identifier
        : '';
    event.tags = {
      network: network,
      service: service,
      walletType: identifier
    };
    return new Promise(resolve => {
      vue.$eventHub.$emit('issueModal', event, resolve);
    }).then(res => {
      return res === true ? event : null;
    });
  }
});
