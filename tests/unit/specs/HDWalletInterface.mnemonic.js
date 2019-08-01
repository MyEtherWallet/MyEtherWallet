import HDWalletInterface from '@/wallets/HDWalletInterface';
import * as HDKey from 'hdkey';
import { hashPersonalMessage, ecsign, toBuffer } from 'ethereumjs-util';
import { Transaction } from 'ethereumjs-tx';

const bip39 = require('bip39');
const ETH_PATH = "m/44'/60'/0'/0";
const mnemonic =
  'board shadow cave liquid sand hour maid capable stand candy frog slogan intact error glimpse project galaxy tackle table sausage salute west airport umbrella';
const seed = bip39.mnemonicToSeedSync(mnemonic);
const accountList = {
  0: {
    address: '0x232d4F524498eFC37cc0624A3C486a75ed84412A',
    pubkey:
      '0x02f990f865bd4117dde9e890df431967346f492679153187cf96319b86e37274d6',
    privkey:
      '0x3ac15078a0e42fa53988401da75bbd69c2ad60d265ad763f7f297c9b608fca0f'
  },
  1: {
    address: '0xDE21877195265C86bC8E65aA94123B67F4Da655e',
    pubkey:
      '0x027599f862597dc32f49e1b96614e6be2c273ed71f0b0da06422946baeb1866c7a',
    privkey:
      '0x75708f3f84d88e28530921266c78055985849677c706ec95a078b39e3712871a'
  },
  2: {
    address: '0x55f37cbf1182236874ac17d3746b2143Ec4d1aF9',
    pubkey:
      '0x032e835050423bf1fa733738675398c1a6245b4e47274391d7a0c17fdd300404cb',
    privkey:
      '0xeec812b6c90cee95b236cd08f0b4d2418a13faa255917a16f8f68b5674de4997'
  }
};
const hdk = HDKey.fromMasterSeed(seed);
const testWallets = [];
const txParams = {
  nonce: '0x00',
  gasPrice: '0x09184e72a000',
  gasLimit: '0x2710',
  to: '0x0000000000000000000000000000000000000000',
  value: '0x00',
  data:
    '0x7f7465737432000000000000000000000000000000000000000000000000000000600057',
  chainId: 3
};
const ethSignMessage = (msg, privKey) => {
  const msgHash = hashPersonalMessage(toBuffer(msg));
  const signed = ecsign(msgHash, privKey);
  return Buffer.concat([
    Buffer.from(signed.r),
    Buffer.from(signed.s),
    Buffer.from([signed.v])
  ]);
};
for (let i = 0; i < 3; i++)
  testWallets.push(
    new HDWalletInterface(
      ETH_PATH + '/' + i,
      hdk.derive(ETH_PATH + '/' + i).publicKey,
      false,
      'mnemonic',
      () => {},
      tx => {
        tx = new Transaction(tx);
        return new Promise(resolve => {
          tx.sign(hdk.derive(ETH_PATH + '/' + i).privateKey);
          resolve(tx);
        });
      },
      msg => {
        return new Promise(resolve => {
          const msgHash = hashPersonalMessage(toBuffer(msg));
          const signed = ecsign(
            msgHash,
            hdk.derive(ETH_PATH + '/' + i).privateKey
          );
          resolve(
            Buffer.concat([
              Buffer.from(signed.r),
              Buffer.from(signed.s),
              Buffer.from([signed.v])
            ])
          );
        });
      },
      null
    )
  );
describe('[Failing 6-17-19] (update to ethereum-tx package) HDWalletInterface Mnemonic', () => {
  xit(' should derive correct keys', async () => {
    for (const i in testWallets) {
      expect(testWallets[i].getPublicKeyString()).toEqual(
        accountList[i].pubkey
      );
      expect(testWallets[i].getChecksumAddressString()).toEqual(
        accountList[i].address
      );
      expect(testWallets[i].getChecksumAddressString()).toEqual(
        accountList[i].address
      );
      const signedTx = await testWallets[i].signTransaction(txParams);
      const _signedTx = new Transaction(txParams);
      _signedTx.sign(
        Buffer.from(accountList[i].privkey.replace('0x', ''), 'hex')
      );
      const sig = Buffer.concat([signedTx.v, signedTx.r, signedTx.s]).toString(
        'hex'
      );
      const _sig = Buffer.concat([
        _signedTx.v,
        _signedTx.r,
        _signedTx.s
      ]).toString('hex');
      expect(sig).toEqual(_sig);
      const MSG = 'MyEtherWallet v5';
      const signedMessage = await testWallets[i].signMessage(MSG);
      const _signedMessage = ethSignMessage(
        MSG,
        Buffer.from(accountList[i].privkey.replace('0x', ''), 'hex')
      );
      expect(signedMessage.toString('hex')).toEqual(
        _signedMessage.toString('hex')
      );
    }
  });
});
