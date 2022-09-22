const api = 'https://unstoppabledomains.com/api/v2/resellers/';

export async function fetchResellerApi({ domain, resellerId }) {
  const url = `${api}${resellerId}/domains/${domain}`;
  const res = await fetch(url);
  if (!res.ok) return { error: true };
  return await res.json();
}

export async function fetchSimilarities({ domain, resellerId }) {
  const url = `${api}${resellerId}/domains/suggestions?search=${domain}&tlds=crypto`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const domains = await res.json();
  return domains
    .sort((a, b) => b.price - a.price)
    .filter(i => i.name !== domain + '.crypto');
}

export async function createResellerOrder({
  domain,
  email,
  address,
  payment,
  resellerId
}) {
  const url = `${api}${resellerId}/orders`;
  const body = {
    domains: [
      {
        name: domain,
        ownerAddress: address,
        email,
        resolution: {
          'crypto.ETH.address': address
        }
      }
    ],
    payment
  };
  return await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' }
  }).then(res => {
    if (!res.ok) {
      throw new Error(
        'Payment failed. Please check information and try again.'
      );
    }
    return res.json();
  });
}

export async function getCoinbaseChargeInfo({ resellerId, email, chargeId }) {
  return fetch(
    `${api}/resellers/${resellerId}/users/${email}/orders/coinbase-charge/${chargeId}`
  ).then(res => {
    if (res.status === 200) {
      return res.json();
    }
    throw new Error('Failed to get charge info');
  });
}
