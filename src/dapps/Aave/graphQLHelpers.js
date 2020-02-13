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

export function withdrawDetails(param) {
  const query = `mutation Withdraw($data: RedeemInput!) {
      redeem(data: $data) {
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

export function setUsageAsCollateralDetails(param) {
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