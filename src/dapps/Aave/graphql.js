export const BorrowRateHistoryDataFragmentDoc = `
  fragment BorrowRateHistoryData on ReserveParamsHistoryItem {
    variableBorrowRate
    stableBorrowRate
    timestamp
  }
`;
export const EthTransactionFragmentFragmentDoc = `
  fragment EthTransactionFragment on EthereumTransactionModelExtended {
    tx {
      from
      to
      gas
      data
      value
    }
    txType
  }
`;
export const LiquidityRateHistoryDataFragmentDoc = `
  fragment LiquidityRateHistoryData on ReserveParamsHistoryItem {
    liquidityRate
    timestamp
  }
`;
export const ReserveDataFragmentDoc = `
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
    }
    lastUpdateTimestamp
  }
`;
export const UserReserveDataFragmentDoc = `
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
  }
`;

export const EthTransactionFragment = `
  fragment EthTransaction on EthereumTransactionModelExtended {
    tx {
      from
      to
      gas
      data
      value
      __typename
    }
    txType
    __typename
  }
`

function fetchQuery(args, varName) {
  try {
    const getNestedObject = (nestedObj = [], pathArr) => {
      if (!Array.isArray(pathArr)) {
        pathArr = [pathArr];
      }
      return pathArr.reduce((obj, key) => {
        return obj && obj[key] !== 'undefined' ? obj[key] : undefined;
      }, nestedObj);
    };

    // 'https://api.thegraph.com/subgraphs/name/aave/dlp-kovan'
    const someURL = 'https://protocol-api.aave.com/graphql
    ';
    return fetch(someURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(args)
    })
      .then(r => r.json())
      .then(val => (varName ? getNestedObject(val.data, varName) : val));
    // .then(data => console.log('data returned:', data));
  } catch (e) {
    // eslint-disable-next-line
    console.error(e);
  }
}

function deposit() {
  const mutation = `mutation Deposit($data: TransferFromInput!) {
    deposit(data: $data) {
      ...EthTransaction
        __typename
      }
    }`
  return fetchQuery(
    {
      mutation,
      variables: {
        "userAddress": "0x43689531907482BEE7e650D18411E284A7337A66",
        "reserve": "0xdd974d5c2e2928dea5f71b9825b8b646686bd200",
        "amount": "3"
      }
    }
  )
}

function getEthUsdPrice() {
  const query = `
        query UsdPriceEth {
          priceOracle(id: "1") {
            usdPriceEth
          }
        }
      `;
  return fetchQuery(
    {
      query
    },
    ['priceOracle', 'usdPriceEth']
  );
}

export function useReservesQuery(userAddress) {
  const query = `
  query UserReserves($userAddress: String!) {
    userReserves(where: { user: $userAddress }) {
      ...UserReserveData
    }
  }
  ${UserReserveDataFragmentDoc}
`;
  return fetchQuery({
    query,
    variables: { userAddress }
  });
}

export const ReserveUpdateSubscriptionDocument = `
  subscription ReserveUpdateSubscription {
    reserves {
      ...ReserveData
    }
  }
  ${ReserveDataFragmentDoc}
`;

export function useReserveUpdateSubscriptionSubscription() {
  const ReserveUpdateSubscriptionDocument = `
  query ReserveUpdateSubscription {
    reserves {
      ...ReserveData
    }
  }
  ${ReserveDataFragmentDoc}
`;
  return fetchQuery(
    {
      query: ReserveUpdateSubscriptionDocument
      // variables: { userAddress }
    },
    'reserves'
  );
}

export function useUserPositionUpdateSubscriptionSubscription(userAddress) {
  const UserPositionUpdateSubscriptionDocument = `
  query UserPositionUpdateSubscription($userAddress: String!) {
    userReserves(where: { user: $userAddress }) {
      ...UserReserveData
    }
  }
  ${UserReserveDataFragmentDoc}
`;
  return fetchQuery(
    {
      query: UserPositionUpdateSubscriptionDocument,
      variables: { userAddress }
    },
    'userReserves'
  );
}

export default {
  useReservesQuery,
  getEthUsdPrice,
  useReserveUpdateSubscriptionSubscription,
  useUserPositionUpdateSubscriptionSubscription,
  BorrowRateHistoryDataFragmentDoc,
  EthTransactionFragmentFragmentDoc,
  LiquidityRateHistoryDataFragmentDoc,
  ReserveDataFragmentDoc,
  UserReserveDataFragmentDoc
};
