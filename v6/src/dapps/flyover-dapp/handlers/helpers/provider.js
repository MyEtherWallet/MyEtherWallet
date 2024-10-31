const PROVIDER =
  'https://eiqxqk2yzamq64zayk7zjsz6rq0hywyn.lambda-url.us-east-1.on.aws/';

const DETAILS = 'https://lps.flyover.rif.technology/providers/details';

const PROVIDERS_CACHE = 'FLYOVEER_PROVIDERS';
const PROVIDERS_DETAIL_CACHE = 'FLYOVEER_PROVIDERS_DETAILS';

export const request = (
  options = { url: '', method: 'GET', body: {}, headers: {} }
) => {
  const config = {
    method: options.method,
    body: JSON.stringify(options.body)
  };

  if (options.method === 'POST') {
    config.headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
  }

  return fetch(options.url, config)
    .then(async res => {
      if (!res.ok) {
        throw await res.json();
      }

      return res;
    })
    .then(res => res.json());
};

export const getProviders = async () => {
  return new Promise((resolve, reject) => {
    const providers = localStorage.getItem(PROVIDERS_CACHE);

    if (providers) {
      resolve(JSON.parse(providers));
    }

    request({
      url: PROVIDER,
      method: 'GET'
    })
      .then(response => {
        if (!providers) {
          resolve(response);
        }

        localStorage.setItem(PROVIDERS_CACHE, JSON.stringify(response));
      })
      .catch(e => {
        reject(e);
      });
  });
};

export const getDetails = async () => {
  return new Promise((resolve, reject) => {
    const providers = localStorage.getItem(PROVIDERS_DETAIL_CACHE);

    if (providers) {
      resolve(JSON.parse(providers));
    }

    request({
      url: DETAILS,
      method: 'GET'
    })
      .then(response => {
        if (!providers) {
          resolve(response);
        }

        localStorage.setItem(PROVIDERS_DETAIL_CACHE, JSON.stringify(response));
      })
      .catch(e => {
        reject(e);
      });
  });
};
