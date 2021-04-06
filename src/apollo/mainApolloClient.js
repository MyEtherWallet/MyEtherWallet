/**
 * Create main apollo client with EthVM
 */
import { createApolloClient } from '@/core/helpers/createApolloClient';

const main = createApolloClient(
  'https://api.ethvm.com',
  'wss://apiws.ethvm.com'
);

export default main;
