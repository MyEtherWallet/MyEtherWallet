const getHashFromFile = _hash => {
  return fetch('https://swap.mewapi.io/ipfs', {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      method: 'uploadComplete',
      hash: _hash
    })
  }).then(response => {
    if (response.error) {
      return new Error('Error getting IPFS Hash!');
    }

    return response.json();
  });
};

const uploadFileToIpfs = async _file => {
  const formData = new FormData();
  const content = await _fetchUploadUrl();
  for (const key in content.body.fields) {
    formData.append(key, content.body.fields[key]);
  }
  formData.append('file', _file);
  return fetch(content.body.signedUrl, {
    method: 'POST',
    headers: {
      'Content-Length': _file.size
    },
    body: formData
  }).then(res => {
    if (!res.ok) {
      return new Error('File upload Error');
    }
    return content.body.hashResponse;
  });
};

const _fetchUploadUrl = () => {
  return fetch('https://swap.mewapi.io/ipfs', {
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
};

export { getHashFromFile, uploadFileToIpfs };
