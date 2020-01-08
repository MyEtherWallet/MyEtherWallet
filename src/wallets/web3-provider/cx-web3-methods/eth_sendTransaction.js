import eventHandler from './eventHandler';
import { toPayload } from '../jsonrpc';
import { getSanitizedTx } from '../methods/utils';
import utils from 'web3-utils';
import * as locStore from 'store';
import BigNumber from 'bignumber.js';
import { sanitizeHex } from '@/wallets/utils';

import {
  WEB3_SEND_TX,
  WEB3_RECEIVE_TX_HASH,
  WEB3_REJECT,
  WEB3_QUERY_GASPRICE,
  WEB3_RECEIVE_GASPRICE,
  WEB3_GET_TX_COUNT,
  WEB3_RECEIVE_TX_COUNT,
  WEB3_GET_GAS,
  WEB3_RECEIVE_GAS
} from '@/builds/mewcx/cxHelpers/cxEvents.js';

export default async ({ payload }, res, next) => {
  if (payload.method !== 'eth_sendTransaction') return next();
  const id = window.extensionID;
  const tx = Object.assign({}, payload.params[0]);
  const eventName = WEB3_SEND_TX.replace('{{id}}', id);
  const resolveName = WEB3_RECEIVE_TX_HASH.replace('{{id}}', id);
  const rejectName = WEB3_REJECT.replace('{{id}}', id);
  const web3QueryGasPrice = WEB3_QUERY_GASPRICE.replace('{{id}}', id);
  const web3ReceiveGasPrice = WEB3_RECEIVE_GASPRICE.replace('{{id}}', id);
  const web3GetNonce = WEB3_GET_TX_COUNT.replace('{{id}}', id);
  const web3ReceiveNonce = WEB3_RECEIVE_TX_COUNT.replace('{{id}}', id);
  const web3GetGas = WEB3_GET_GAS.replace('{{id}}', id);
  const web3ReceiveGas = WEB3_RECEIVE_GAS.replace('{{id}}', id);

  const gasPrice = await eventHandler(
    web3QueryGasPrice,
    {},
    web3ReceiveGasPrice,
    rejectName
  );
  const nonce = await eventHandler(
    web3GetNonce,
    {
      detail: {
        from: tx.from
      }
    },
    web3ReceiveNonce,
    rejectName
  );
  const gas = await eventHandler(
    web3GetGas,
    {
      detail: {
        tx: tx
      }
    },
    web3ReceiveGas,
    rejectName
  );

  tx.gasPrice = gasPrice;
  try {
    tx.nonce = !tx.nonce ? await nonce : tx.nonce;
    tx.gas = !tx.gas ? gas : tx.gas;
  } catch (e) {
    res(e);
    return;
  }

  getSanitizedTx(tx)
    .then(_tx => {
      const obj = {
        detail: {
          tx: _tx
        }
      };

      eventHandler(eventName, obj, resolveName, rejectName)
        .then(response => {
          if (tx.from !== null) {
            const localStoredObj = locStore.get(
              utils.sha3(utils.toChecksumAddress(tx.from))
            );
            locStore.set(utils.sha3(utils.toChecksumAddress(tx.from)), {
              nonce: sanitizeHex(
                new BigNumber(localStoredObj.nonce).plus(1).toString(16)
              ),
              timestamp: localStoredObj.timestamp
            });
          }
          res(null, toPayload(payload.id, response.payload));
        })
        .catch(e => {
          res(e);
        });
    })
    .catch(e => {
      res(e);
    });
};
