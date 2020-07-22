export default hash => {
  return new Promise((resolve, reject) => {
    try {
      const ipfsHash = fetch('https://swap.mewapi.io/ipfs', {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          method: 'uploadComplete',
          hash: hash
        })
      }).then(response => {
        return response.json();
      });

      ipfsHash.then(response => {
        if (response.error) {
          return reject(new Error('Error getting IPFS Hash!'));
        }

        return resolve(response);
      });
    } catch (e) {
      reject(e);
    }
  });
};
