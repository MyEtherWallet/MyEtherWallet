import { isObject } from 'lodash';

const mewApiError = 'Websocket connection failed';

export const knownErrors = {
  'Can\'t assign to property "request"': mewApiError,
  "Cannot create property 'request'": mewApiError,
  'GATT Server is disconnected. Cannot perform GATT operations.': mewApiError,
  "'CONNECTION ERROR: Couldn't connect to node on WS.'": mewApiError,
  'Interaction timeout': 'Please unlock your deveice',
  "CONNECTION ERROR: Couldn't connect to node on WS":
    "Couldn't connect to WS node. Please refresh and try again.",
  'connection not open on send': mewApiError,
  'Provided address null is invalid': 'No address provided',
  'transaction underpriced': 'Transaction gas price too low',
  'invalid remainder': 'invalid remainder',
  'Internal JSON-RPC error. { "code": -32000, "message": "execution reverted" }':
    'Execution Reverted',
  'Transaction has been reverted by the EVM':
    'Transaction has been reverted by the EVM',
  'TypeError: Failed to fetch': 'Request Failed. Please refresh and try again.',
  "Returned values aren't valid, did it run Out of Gas?":
    "Returned values aren't valid, did it run Out of Gas?"
};

const handleError = err => {
  const errorValues = Object.keys(knownErrors);
  const foundError = errorValues.find(item => {
    const message =
      err && err.message
        ? isObject(err.message)
          ? err.message.message
          : err.message
        : err;
    if (!message) return false;
    return message.includes(item);
  });
  return foundError ? true : false;
};

export default handleError;
