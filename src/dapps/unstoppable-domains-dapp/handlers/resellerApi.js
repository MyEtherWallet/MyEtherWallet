const api = 'https://unstoppabledomains.com/api/v1';

export async function fetchResellerApi({ domain, resellerId }) {
  const url = `${api}/resellers/${resellerId}/domains/${domain}`;
  return await fetch(url).then(res => {
    if (!res.ok) {
      throw new Error("Couldn't fetch reseller domain info");
    }
    return res.json();
  });
}

export async function fetchSimillarities({ domain, resellerId }) {
  const url = `${api}/resellers/${resellerId}/domains/variations?domains=["${domain}"]`;
  return await fetch(url)
    .then(res => {
      if (!res.ok) {
        throw new Error("Couldn't fetch reseller domain simillarities");
      }
      return res.json();
    })
    .then(response => {
      return response[domain].filter(
        domainObj => domainObj.extension === 'crypto'
      );
    })
    .then(arr => arr.sort((a, b) => b.price - a.price));
}

export async function createResellerOrder({
  domain,
  email,
  address,
  payment,
  resellerId
}) {
  const url = `${api}/resellers/${resellerId}/users/${email}/orders`;
  const body = {
    order: {
      domains: [
        {
          name: domain,
          owner: {
            address
          },
          resolution: {
            crypto: {
              ETH: {
                address
              }
            }
          }
        }
      ],
      payment
    }
  };
  return await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' }
  }).then(res => {
    if (!res.ok) {
      throw new Error("Couldn't create an order");
    }
    return res.json();
  });
}

export async function getCoinbaseChargeInfo({ resellerId, email, chargeId }) {
  return fetch(
    `${api}/resellers/${resellerId}/users/${email}/orders/coinbase-charge/${chargeId}`
  ).then(resp => {
    if (resp.status === 200) {
      return resp.json();
    }
    throw new Error('Failed to get charge info');
  });
}
