import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import ApolloClient from 'apollo-client';
const EventEmitter = require('events').EventEmitter;

class ApolloClient extends EventEmitter {

}
const GRAPHQL_ENDPOINT =
  'wss://api.thegraph.com/subgraphs/name/aave/protocol-raw';
const QUERY_SERVER_URL =
  'https://api.thegraph.com/subgraphs/name/aave/protocol-ropsten-raw';
const MUTATIONS_SERVER_URL = 'https://dlp-api-dev.testing.aave.com/graphql';

const client = new SubscriptionClient(GRAPHQL_ENDPOINT, {
  reconnect: true
});

const link = new WebSocketLink(client);

const apolloClient = new ApolloClient({
  link: link,
  cache: new InMemoryCache()
});

apolloClient
  .subscribe({
    query: gql`
      subscription ReserveUpdateSubscription {
        reserves {
          ...ReserveData
          __typename
        }
      }

      fragment ReserveData on Reserve {
        id
        name
        symbol
        decimals
        isActive
        usageAsCollateralEnabled
        borrowingEnabled
        stableBorrowRateEnabled
        baseLTVasCollateral
        liquidityIndex
        reserveLiquidationThreshold
        variableBorrowIndex
        aToken {
          id
          __typename
        }
        availableLiquidity
        stableBorrowRate
        liquidityRate
        totalBorrows
        totalBorrowsStable
        totalBorrowsVariable
        totalLiquidity
        utilizationRate
        variableBorrowRate
        price {
          priceInEth
          __typename
        }
        lastUpdateTimestamp
        __typename
      }
    `,
    variables: {}
  })
  .subscribe({
    next(resp) {
      console.log('resp', resp)
      eventEmitter.emit('hello')
      // self.getReserves(resp.data.reserves)
      // self.reserves = resp.data.reserves;
    }
  });
// };

const getUserPositionUpdateSubscription = function(address) {
  return apolloClient.subscribe({
    query: gql`
      subscription UserPositionUpdateSubscription($userAddress: String!) {
        userReserves(where: { user: $userAddress }) {
          ...UserReserveData
          __typename
        }
      }

      fragment UserReserveData on UserReserve {
        principalATokenBalance
        userBalanceIndex
        redirectedBalance
        interestRedirectionAddress
        reserve {
          id
          name
          symbol
          decimals
          liquidityRate
          lastUpdateTimestamp
          aToken {
            id
          }
        }
        usageAsCollateralEnabledOnUser
        borrowRate
        borrowRateMode
        originationFee
        principalBorrows
        variableBorrowIndex
        lastUpdateTimestamp
        __typename
      }
    `,
    variables: {
      userAddress: address
    }
  });
};

const getUsdPriceEth = function() {
  return apolloClient.subscribe({
    query: gql`
      subscription UsdPriceEth {
        priceOracle(id: "1") {
          usdPriceEth
        }
      }
    `,
    variables: {}
  });
};

export default ApolloClient;