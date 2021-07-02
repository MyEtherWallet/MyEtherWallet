import * as Sentry from '@sentry/vue';
import { Integrations } from '@sentry/tracing';
import Vue from 'vue';
import { EventBus } from '@/core/plugins/eventBus';
import store from '@/core/store';

// Sentry
Sentry.init({
  Vue,
  dsn: 'https://82c2004a8ba740e1b80f8589f9ca1770@o382951.ingest.sentry.io/5652727',
  integrations: [new Integrations.BrowserTracing()],
  maxBreadcrumbs: 0,
  environment: 'web',
  requestBodies: 'small',
  autoSessionTracking: false,
  release: NODE_ENV === 'production' ? VERSION : 'develop',
  beforeSend(event, hint) {
    // eslint-disable-next-line
    console.error(hint.originalException || hint.syntheticException);
    const network = store.getters['global/network']
      ? store.getters['global/network'].type.name
      : '';
    const service = store.getters['global/network']
      ? store.getters['global/network'].service
      : '';
    const identifier = store.state.wallet ? store.state.wallet.identifier : '';
    event.tags = {
      network: network,
      service: service,
      walletType: identifier
    };
    return new Promise(resolve => {
      EventBus.$emit('issueModal', event, resolve);
    }).then(res => {
      return res === true ? event : null;
    });
  }
});
