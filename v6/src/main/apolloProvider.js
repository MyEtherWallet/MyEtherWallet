import VueApollo from 'vue-apollo';
import Vue from 'vue';

import { aave } from '@/dapps/aave-dapp/apollo/apollo-dapps';
import { createApolloClient } from '@/core/helpers/createApolloClient';

const main = createApolloClient(
  'https://api-v3.ethvm.dev',
  'wss://apiws-v3.ethvm.dev'
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
