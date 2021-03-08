export function getAddressTokens(hash, nextKey) {
  const query = `
  fragment TokenFragment on EthTokenInfo {
    name
    symbol
    decimals
  }

  query getOwnersERC20Tokens($hash: String!, $_nextKey: String) {
    getOwnersERC20Tokens(owner: $hash, nextKey: $_nextKey) {
        owners {
            tokenInfo {
                ...TokenFragment
                contract
            }
            balance
        }
        nextKey
    }
  }
  `;

  return fetchQuery(query, hash, nextKey);
}

function fetchQuery(query, hash, nextKey) {
  const variables = {
    hash: hash,
    nextKey: nextKey
  };

  if (!nextKey) delete variables['nextKey'];
  const url = 'https://api.ethvm.com';
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      query,
      variables: variables
    })
  })
    .then(r => {
      return r.json();
    })
    .catch(err => {
      return err;
    });
}
