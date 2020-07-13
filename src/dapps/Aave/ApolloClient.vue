<template>
  <div></div>
</template>

<script>
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import ApolloClient from 'apollo-client';

export default {
  props: {
    address: {
      type: String,
      default: ''
    },
    poolId: {
      type: String,
      default: ''
    }
  },
  mounted() {
    const GRAPHQL_ENDPOINT =
      'wss://api.thegraph.com/subgraphs/name/aave/protocol-multy-raw';

    const client = new SubscriptionClient(GRAPHQL_ENDPOINT, {
      reconnect: true
    });

    const wsLink = new WebSocketLink(client);

    this.apolloClient = new ApolloClient({
      link: wsLink,
      cache: new InMemoryCache()
    });

    this.getReserveData();
    this.getUserData();
    this.getUsdPriceEth();
  },
  methods: {
    getLiquidityRateHistoryUpdate(param) {
      const vm = this;
      this.apolloClient
        .subscribe({
          query: gql`
            subscription LiquidityRateHistoryUpdate($reserveAddress: String!) {
              reserveParamsHistoryItems(
                where: { reserve: $reserveAddress }
                first: 10
              ) {
                variableBorrowRate
                stableBorrowRate
                liquidityRate
                timestamp
              }
            }
            fragment ReserveRatesHistoryData on ReserveParamsHistoryItem {
              variableBorrowRate
              stableBorrowRate
              liquidityRate
              utilizationRate
              timestamp
              __typename
            }
          `,
          variables: {
            reserveAddress: param
          }
        })
        .subscribe({
          next(resp) {
            vm.$emit(
              'liquidityRateHistory',
              resp.data.reserveParamsHistoryItems
            );
          }
        });
    },
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
            vm.$emit('usdPriceEth', resp.data.priceOracle.usdPriceEth);
          }
        });
    },
    getUserData() {
      const vm = this;
      this.apolloClient
        .subscribe({
          query: gql`
            subscription UserPositionUpdateSubscription(
              $userAddress: String!
              $poolId: String!
            ) {
              userReserves(where: { user: $userAddress, pool: $poolId }) {
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
                underlyingAsset
                name
                symbol
                decimals
                liquidityRate
                reserveLiquidationBonus
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
            userAddress: this.address,
            poolId: this.poolId
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
            subscription ReserveUpdateSubscription($poolId: String!) {
              reserves(where: { pool: $poolId }) {
                ...ReserveData
                __typename
              }
            }

            fragment ReserveData on Reserve {
              id
              underlyingAsset
              name
              symbol
              decimals
              isActive
              usageAsCollateralEnabled
              borrowingEnabled
              stableBorrowRateEnabled
              baseLTVasCollateral
              optimalUtilisationRate
              averageStableBorrowRate
              stableRateSlope1
              stableRateSlope2
              baseVariableBorrowRate
              variableRateSlope1
              variableRateSlope2
              liquidityIndex
              reserveLiquidationThreshold
              variableBorrowIndex
              aToken {
                id
              }
              availableLiquidity
              stableBorrowRate
              liquidityRate
              totalBorrows
              totalBorrowsStable
              totalBorrowsVariable
              totalLiquidity
              utilizationRate
              reserveLiquidationBonus
              variableBorrowRate
              price {
                priceInEth
              }
              lastUpdateTimestamp
            }
          `,
          variables: {
            poolId: this.poolId
          }
        })
        .subscribe({
          next(resp) {
            vm.$emit('reserveData', resp.data.reserves);
          }
        });
    }
  }
};
</script>
