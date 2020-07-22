export default file => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    try {
      const content = fetch('https://swap.mewapi.io/ipfs', {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          method: 'getUploadUrl'
        })
      }).then(response => {
        return response.json();
      });

      content.then(response => {
        for (const key in response.body.fields) {
          formData.append(key, response.body.fields[key]);
        }
        formData.append('file', file);
        fetch(content.body.signedUrl, {
          method: 'POST',
          headers: {
            'Content-Length': file.size
          },
          body: formData
        }).then(response => {
          if (!response.ok) {
            return reject(new Error('File upload Error'));
          }
          return resolve(response.body.hashResponse);
        });
      });
    } catch (e) {
      reject(e);
    }
  });
};
