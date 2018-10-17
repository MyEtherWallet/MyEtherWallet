// import ethTx from 'ethereumjs-tx';
import Ledger from '@ledgerhq/hw-app-eth';
import u2fTransport from '@ledgerhq/hw-transport-u2f';
// import ethUtil from 'ethereumjs-util';
import networkPaths from './networkPaths';
import HDWalletInterface from '@/wallets/HDWalletInterface';
import * as HDKey from 'hdkey';
import * as nodes from '@/networks/types';

const IDENTIFIER = 'ledger';
const NEED_PASSWORD = false;

class ledgerWallet {
  constructor() {
    this.identifier = IDENTIFIER;
    this.needPassword = NEED_PASSWORD;
  }
  async init(basePath) {
    try {
      this.basePath = basePath ? basePath : networkPaths[networkPaths.default];
      this.transport = await getLedgerTransport();
      this.ledger = new Ledger(this.transport);
      this.appConfig = await getLedgerAppConfig(this.ledger);
      const rootPub = await getRootPubKey(this.ledger, this.basePath);
      this.hdKey = new HDKey();
      this.hdKey.publicKey = Buffer.from(rootPub.publicKey, 'hex');
      this.hdKey.chainCode = Buffer.from(rootPub.chainCode, 'hex');
    } catch (e) {
      throw new Error(e.message);
    }
  }
  getAccount(idx) {
    const derivedKey = this.hdKey.derive('m/' + idx);
    return new HDWalletInterface(
      this.basePath + '/' + idx,
      derivedKey.publicKey,
      () => {},
      () => {}
    );
  }
  getCurrentPath() {
    return this.basePath;
  }
  getNetworkPaths() {
    let paths = {};
    for (let key in networkPaths) {
      if (key === 'default') {
        paths[key] = {
          path: networkPaths[networkPaths.default],
          label: nodes[networkPaths.default].name_long
        };
        continue;
      }
      paths[key] = {
        path: networkPaths[key],
        label: nodes[key].name_long
      };
    }
    return paths;
  }
}
const getLedgerTransport = async () => {
  const transport = await u2fTransport.create(3000, 3000);
  return transport;
};
const getLedgerAppConfig = async _ledger => {
  const appConfig = await _ledger.getAppConfiguration();
  return appConfig;
};
const getRootPubKey = async (_ledger, _path) => {
  const pubObj = await _ledger.getAddress(_path, false, true);
  return {
    publicKey: pubObj.publicKey,
    chainCode: pubObj.chainCode
  };
};

export default ledgerWallet;
