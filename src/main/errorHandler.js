const mewApiError = 'Websocket connection failed';
export const knownErrors = {
  "Cannot create property 'request' on string 'wss://nodes.mewapi.io:443/ws/matic":
    mewApiError,
  'can\'t assign to property "request" on "wss://nodes.mewapi.io:443/ws/matic": not an object':
    mewApiError,
  "Cannot create property 'request' on string 'wss://nodes.mewapi.io:443/ws/bsc":
    mewApiError,
  'can\'t assign to property "request" on "wss://nodes.mewapi.io:443/ws/eth": not an object':
    mewApiError,
  "Cannot create property 'request' on string 'wss://nodes.mewapi.io:443/ws/rinkeby'":
    mewApiError,
  'can\'t assign to property "request" on "wss://nodes.mewapi.io:443/ws/rop": not an object':
    mewApiError
};
