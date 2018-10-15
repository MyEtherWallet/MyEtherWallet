import fetch from 'node-fetch';

// const https = require("https");
// const agent = new https.Agent({
//   rejectUnauthorized: false
// })

function post(url = ``, data = {}, opts = {}) {
  const defaultOptions = {
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify(data)
  };
  const options = {
    ...defaultOptions,
    ...opts,
    ...{ method: 'POST' }
  };
  return fetch(url, options).then(response => response.json());
}

function get(url = ``, opts = {}) {
  const defaultOptions = {
    mode: 'cors',
    cache: 'no-cache'
  };
  const options = {
    ...defaultOptions,
    ...opts,
    ...{ method: 'GET' }
  };
  return fetch(url, options).then(response => response.json());
}

export { get, post };
