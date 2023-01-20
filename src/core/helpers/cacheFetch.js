import { keccak256 } from 'web3-utils';
import store from '@/core/store';
const STORAGE_TTL = 1000 * 60 * 60 * 24;
/**
 * Fetch data and save it to cache
 * @param {object} options Options object { url: string }
 * @param {number} ttl The time to live for fetched data
 * @returns Fetched or cached data
 */
const cacheFetch = async function (options, ttl = STORAGE_TTL) {
  const state = store.state.external;
  const storagetimestamp = state.lastTimestamp;
  if (
    storagetimestamp &&
    storagetimestamp + STORAGE_TTL < new Date().getTime()
  ) {
    state.cache = {};
    state.timestamp = new Date().getTime();
  } else if (!storagetimestamp) {
    state.timestamp = new Date().getTime();
  }

  // return cached data
  const hash = keccak256(options.url);
  const cached = state.cache[hash];
  if (cached && cached.timestamp + ttl > new Date().getTime()) {
    return JSON.parse(cached.data);
  }
  return fetch(options.url)
    .then(res => res.json())
    .then(json => {
      const store = {
        timestamp: new Date().getTime(),
        data: JSON.stringify(json)
      };
      state.cache[hash] = store;
      return json;
    });
};

export default cacheFetch;
