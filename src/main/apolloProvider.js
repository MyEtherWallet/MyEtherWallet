import VueApollo from 'vue-apollo';
import Vue from 'vue';

import { aave } from '@/dapps/apollo-dapps.js';
import main from '@/apollo/mainApolloClient';

const apolloProvider = new VueApollo({
  clients: {
    main,
    aave: aave
  },
  defaultClient: main
});
Vue.use(VueApollo);
export default apolloProvider;
