import {
  getLatestPrices,
  getCoinGeckoTokenMarketDataByIds
} from '@/apollo/queries/wallets/wallets.graphql';

import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import { createApolloClient } from '../helpers/createApolloClient';

export const usePriceFetch = () => {
  const client = createApolloClient(
    'https://api-v3.ethvm.dev',
    'wss://apiws-v3.ethvm.dev'
  );

  provideApolloClient(client);
  const { result, loading, onError, onResult } = useQuery(getLatestPrices);
};
