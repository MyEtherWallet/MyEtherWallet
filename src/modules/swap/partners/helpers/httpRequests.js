import fetch from 'node-fetch';
// import fs from 'fs';

function post(url = ``, data = {}, opts = {}) {
  console.log("-------------------------------"); // todo remove dev item
  console.log('POST'); // todo remove dev item
  console.log(url); // todo remove dev item
  console.log(data); // todo remove dev item
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
  fetch(url, options).then(response => response.json()).then(console.log)

  return fetch(url, options).then(response => response.json())
}

function get(url = ``, opts = {}) {
  console.log("-------------------------------"); // todo remove dev item
  console.log('GET'); // todo remove dev item
  console.log(url); // todo remove dev item
  const defaultOptions = {
    mode: 'cors',
    cache: 'no-cache'
  };
  const options = {
    ...defaultOptions,
    ...opts,
    ...{ method: 'GET' }
  };
  console.log(fetch(url, options).then(response => response.json())); // todo remove dev item
  return fetch(url, options).then(response => response.json())
}

export { get, post };
