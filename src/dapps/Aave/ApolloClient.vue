<template>
  <div></div>
</template>

<script>
import { ApolloLink, split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';

export default {
  props: {
    address: {
      type: String,
      default: ''
    }
  },
  mounted() {
    const GRAPHQL_ENDPOINT =
      'wss://api.thegraph.com/subgraphs/name/aave/protocol-raw';
    // const QUERY_SERVER_URL =
    //   'https://api.thegraph.com/subgraphs/name/aave/protocol-ropsten-raw';
    const MUTATIONS_SERVER_URL = 'https://protocol-api.aave.com/graphql';

    const client = new SubscriptionClient(GRAPHQL_ENDPOINT, {
      reconnect: true
    });

    const wsLink = new WebSocketLink(client);
    // const queryLink = new HttpLink({ uri: QUERY_SERVER_URL });
    const mutationsLink = new HttpLink({ uri: MUTATIONS_SERVER_URL });

    // const dataLink = split(
    //   ({ query }) => {
    //     const definition = getMainDefinition(query);
    //     return (
    //       definition.kind === 'OperationDefinition' &&
    //       definition.operation === 'subscription'
    //     );
    //   },
    //   wsLink,
    //   queryLink
    // );

    const hybridLink = split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'mutation'
        );
      },
      mutationsLink,
      wsLink
    );
    console.error('hybrid', hybridLink)
    this.apolloClient = new ApolloClient({
      link: hybridLink,
      cache: new InMemoryCache()
    });

    this.getReserveData();
    this.getUserData();
    this.getUsdPriceEth();
    // console.error('hello', this.borrow());
  },
  methods: {
    deposit(param) {
      const depositMutation = gql`
        mutation Deposit($data: TransferFromInput!) {
          deposit(data: $data) {
            ...EthTransaction
            __typename
          }
        }
      `;
      this.apolloClient.mutate({
        mutation: depositMutation,
        variables: {
          data: param
        }
      });
    },
    // borrow() {
    //   const borrowMutation = gql`
    //     mutation Borrow($data: BorrowInput!) {
    //       borrow(data: $data) {
    //         ...EthTransaction
    //       }
    //     }
    //   `;
    //   this.apolloClient.mutate({
    //     mutation: borrowMutation,
    //     variables: {
    //       data: this.data
    //     }
    //   });
    // },
    getUsdPriceEth() {
      const vm = this;
      this.apolloClient
        .subscribe({
          query: gql`
            subscription UsdPriceEth {
              priceOracle(id: "1") {
                usdPriceEth
              }
            }
          `,
          variables: {}
        })
        .subscribe({
          next(resp) {
            // return resp.data.priceOracle.usdPriceEth;
            vm.$emit('usdPriceEth', resp.data.priceOracle.usdPriceEth);
          }
        });
    },
    getUserData() {
      const vm = this;
      this.apolloClient
        .subscribe({
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
            userAddress: this.address
          }
        })
        .subscribe({
          next(resp) {
            vm.$emit('userReserveData', resp.data.userReserves);
          }
        });
    },
    getReserveData() {
      const vm = this;
      this.apolloClient
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
            console.log('resp', resp);
            vm.$emit('reserveData', resp.data.reserves);
          }
        });
    }
  }
};
</script>
