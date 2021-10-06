import VueApollo from 'vue-apollo';
import Vue from 'vue';

import { aave } from '@/dapps/aave-dapp/apollo-dapps';
import { createApolloClient } from '@/core/helpers/createApolloClient';

const main = createApolloClient(
  'https://api.ethvm.com',
  'wss://apiws.ethvm.com'
);
const apolloProvider = new VueApollo({
  clients: {
    main,
    aave: aave
  },
  defaultClient: main
});
Vue.use(VueApollo);
export default apolloProvider;
