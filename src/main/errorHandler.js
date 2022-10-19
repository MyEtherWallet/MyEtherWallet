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
    "Returned values aren't valid. Please refresh and log in again.",
  'ENS is not supported': 'ENS is not supported on network private',
  '未能完成该操作。无效的自变量':
    'The operation could not be completed. Invalid argument.',
  'DOMException: Failed to execute "stopNotifications" on "BluetoothRemoteGATTCharacteristic"':
    'Please remove or reset and reconnect your bluetooth device',
  'TypeError Failed to fetch': 'Failed to fetch incoming data',
  'AbortError: The user aborted a request':
    'Request was aborted. Please try again.',
  'JsonRpcEngine: Response has no error or result for request':
    'Unexpected response from request. Please try again.',
  'Error: TypeError: Origin https://www.myetherwallet.com is not allowed by Access-Control-Allow-Origin.':
    'CORS Request cannot be made due to security reasons',
  "Cannot read properties of undefined (reading 'click')": '',
  'Cannot read properties of undefined (reading "msg")': '',
  'GATT operation failed for unknown reason.':
    'Please reset/disconnect then reconnect bluetooth pairings on device and on connected devices',
  'TypeError: Cannot read properties of undefined (reading "value")':
    'Selected path unknown',
  'Permission denied.': 'Permission denied. Please try again.',
  'Transaction was not mined within 50 blocks, please make sure your transaction was properly sent. Be aware that it might still be mined!':
    'Gas prices are too low',
  'refreshData is not defined': 'Refresh data is not defined',
  "Non-200 status code: '404'":
    'The requested URL was not found on this server.',
  'GATT Server is disconnected. Cannot retrieve services.':
    'Please reset/disconnect then reconnect bluetooth pairings on device and on connected devices',
  'DisconnectedDeviceDuringOperation: The device was disconnected.':
    'Ledger device has been disconnected, please reconnect and try again',
  "Non-200 status code: '429'":
    'Rate limit exceeded. Please try again in about 30 seconds.',
  "execution reverted: it's not your token": 'You do not own this token',
  'Returned error: gas required exceeds allowance':
    'Your gas limit is too low. Please increase your gas limit and try again.',
  'nonce too low':
    'You may have multiple transactions still pending, please reject them and try again'
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
