export default hash => {
  return fetch('https://swap.mewapi.io/ipfs', {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      method: 'uploadComplete',
      hash: hash
    })
  }).then(response => {
    if (response.error) {
      return new Error('Error getting IPFS Hash!');
    }

    return response.json();
  });
};
