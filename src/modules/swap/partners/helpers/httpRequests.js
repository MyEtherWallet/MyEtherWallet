import fetch from 'node-fetch';

function post(url = ``, data = {}, opts = {}) {
  // console.log("-------------------------------"); // todo remove dev item
  // console.log(url); // todo remove dev item
  // console.log(data); // todo remove dev item
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
  return fetch(url, options).then(response => response.json())/*.then(res => {
    console.log(res);
    return res;
  });*/
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
