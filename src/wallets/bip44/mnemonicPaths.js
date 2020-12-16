import {
  ethereum,
  ethereumClassic,
  ropsten,
  xdcnetwork,
  ledgerEthereum
} from './paths';
const renamedLedger = Object.assign({}, ledgerEthereum);
renamedLedger.label = 'Ledger';

export default [
  xdcnetwork,
  ethereum
  
];
