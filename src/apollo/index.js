import { createApolloClient } from '@/core/helpers/createApolloClient';
import aaveClient from '../dapps/aave-dapp/apollo';

const main = createApolloClient(
  'https://api-v3.ethvm.dev',
  'wss://apiws-v3.ethvm.dev'
);

export default {
  default: main,
  aaveClient: aaveClient
};
