export default file => {
  const formData = new FormData();
  return fetch('https://swap.mewapi.io/ipfs', {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      method: 'getUploadUrl'
    })
  })
    .then(response => {
      return response.json();
    })
    .then(res => {
      for (const key in res.body.fields) {
        formData.append(key, res.body.fields[key]);
      }
      formData.append('file', file);
      fetch(res.body.signedUrl, {
        method: 'POST',
        headers: {
          'Content-Length': file.size
        },
        body: formData
      }).then(res => {
        if (!res.ok) {
          return new Error('File upload Error');
        }
        return res.body.hashResponse;
      });
    });
};
