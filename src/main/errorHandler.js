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
  'Ledger device: Condition of use not satisfied': mewApiError,
  'Provided address null is invalid': 'No address provided',
  'transaction underpriced': 'Transaction gas price too low',
  'invalid remainder': 'invalid remainder',
  'Internal JSON-RPC error': 'Internal JSON-RPC error. Execution Reverted',
  'Transaction has been reverted by the EVM':
    'Transaction has been reverted by the EVM',
  'TypeError: Failed to fetch': 'Request Failed. Please refresh and try again.',
  "TypeError: Cannot read properties of null (reading 'errorHandler')":
    'There was an error signing transaction with this wallet',
  "Returned values aren't valid, did it run Out of Gas?":
    "Returned values aren't valid, did it run Out of Gas?" +
    'You might also see this error if you are not using the ' +
    'correct ABI for the contract you are retrieving data from, ' +
    'requesting data from a block number that does not exist, ' +
    'or querying a node which is not fully synced.',
  'ENS is not supported': 'ENS is not supported on network private',
  '未能完成该操作。无效的自变量':
    'The operation could not be completed. Invalid argument.',
  'TypeError Failed to fetch': 'Failed to fetch incoming data',
  'AbortError: The user aborted a request':
    'Request was aborted. Please try again.',
  'JsonRpcEngine: Response has no error or result for request':
    'Unexpected response from request. Please try again.',
  'Error: TypeError: Origin https://www.myetherwallet.com is not allowed by Access-Control-Allow-Origin.':
    'CORS Request cannot be made due to security reasons',
  "Cannot read properties of undefined (reading 'click')": '',
  'GATT operation failed for unknown reason.':
    'Please reset/disconnect then reconnect bluetooth pairings on device and on connected devices',
  'TypeError: Cannot read properties of undefined (reading "value")':
    'Selected path unknown',
  'DisconnectedDeviceDuringOperation: The device was disconnected.':
    'Ledger device has been disconnected, please reconnect and try again'
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
