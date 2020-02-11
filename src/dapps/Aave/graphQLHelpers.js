export function depositDetails(param) {
  const query = `
  mutation Deposit($data: TransferFromInput!) {
    deposit(data: $data) {
      ...EthTransaction
      __typename
    }
  }
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
  `;

  return fetchQuery(query, param);
}

export function borrowDetails(param) {
  const query = `
    mutation Borrow($data: BorrowInput!) {
      borrow(data: $data) {
        ...EthTransaction
        __typename
      }
    }
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
    `;
  return fetchQuery(query, param);
}

export function repayDetails(param) {
  const query = `
    mutation Repay($data: TransferFromInput!) {
      repay(data: $data) {
        ...EthTransaction
        __typename
      }
    }
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
    }`;
  return fetchQuery(query, param);
}

export function swapBorrowRateDetails(param) {
  const query = `
    mutation SwapBorrowRateMode($data: ApproveInput!) {
      swapBorrowRateMode(data: $data) {
        ...EthTransaction
        __typename
      }
    }
    
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
    }`;
  return fetchQuery(query, param);
}

// export function withdrawDetails(param) {

// }

export function SetUsageAsCollateralDetails(param) {
  const query = `
    mutation SetUsageAsCollateralMode($data: SetUsageAsCollateralInput!) {
      setUsageAsCollateral(data: $data) {
        ...EthTransaction
        __typename
      }
    }
    
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
    }`;
  return fetchQuery(query, param);
}

function fetchQuery(query, param) {
  const someURL = 'https://protocol-api.aave.com/graphql';
  return fetch(someURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      query,
      variables: {
        data: param
      }
    })
  })
    .then(r => {
      return r.json();
    })
    .catch(err => {
      return err;
    });
}
// ===========================================================================================================================================
// // Borrow
// mutation Borrow($data: BorrowInput!) {
//   borrow(data: $data) {
//     ...EthTransaction
//     __typename
//   }
// }
// fragment EthTransaction on EthereumTransactionModelExtended {
//   tx {
//     from
//     to
//     gas
//     data
//     value
//     __typename
//   }
//   txType
//   __typename
// }

// Variables:
// {
//   "data": {
// 		"userAddress": "0x43689531907482BEE7e650D18411E284A7337A66",
//     "reserve": "0xdd974d5c2e2928dea5f71b9825b8b646686bd200",
//     "amount": "3",
//     "interestRateMode": "Stable"
//   }
// }


// ///////
// enum InterestRate {
//   None
//   Stable
//   Variable
// }


// ///////

// ===========================================================================================================================================
// Deposit
// mutation Deposit($data: TransferFromInput!) {
//   deposit(data: $data) {
//     ...EthTransaction
//     __typename
//   }
// }
// fragment EthTransaction on EthereumTransactionModelExtended {
//   tx {
//     from
//     to
//     gas
//     data
//     value
//     __typename
//   }
//   txType
//   __typename
// }


// Variables:
// {
//   "data": {
// 		"userAddress": "0x43689531907482BEE7e650D18411E284A7337A66",
//     "reserve": "0xdd974d5c2e2928dea5f71b9825b8b646686bd200",
//     "amount": "3"
//   }
// }

// ===========================================================================================================================================
// Repay
// mutation Repay($data: TransferFromInput!) {
//   repay(data: $data) {
//     ...EthTransaction
//     __typename
//   }
// }
// fragment EthTransaction on EthereumTransactionModelExtended {
//   tx {
//     from
//     to
//     gas
//     data
//     value
//     __typename
//   }
//   txType
//   __typename
// }

// Variables:
// {
//   "data": {
// 		"userAddress": "0x43689531907482BEE7e650D18411E284A7337A66",
//     "reserve": "0x0d8775f648430679a709e98d2b0cb6250d2887ef",
//     "amount": "3"
//   }
// }

// ===========================================================================================================================================
// swapBorrowRateMode
// mutation SwapBorrowRateMode($data: ApproveInput!) {
//   swapBorrowRateMode(data: $data) {
//     ...EthTransaction
//     __typename
//   }
// }

// fragment EthTransaction on EthereumTransactionModelExtended {
//   tx {
//     from
//     to
//     gas
//     data
//     value
//     __typename
//   }
//   txType
//   __typename
// }

// Variables:
// {
//   "data": {
// 		"userAddress": "0x43689531907482BEE7e650D18411E284A7337A66",
//     "reserve": "0x0d8775f648430679a709e98d2b0cb6250d2887ef",
//     "amount": "3"
//   }
// }

// ===========================================================================================================================================
// setUsageAsCollateral

// mutation SetUsageAsCollateralMode($data: SetUsageAsCollateralInput!) {
//   setUsageAsCollateral(data: $data) {
//     ...EthTransaction
//     __typename
//   }
// }

// fragment EthTransaction on EthereumTransactionModelExtended {
//   tx {
//     from
//     to
//     gas
//     data
//     value
//     __typename
//   }
//   txType
//   __typename
// }

// Variables:
// {
//   "data": {
// usageAsCollateral: false
// userAddress: "0x43689531907482BEE7e650D18411E284A7337A66"
// reserve: "0x6b175474e89094c44da98b954eedeac495271d0f"
//   }
// }


