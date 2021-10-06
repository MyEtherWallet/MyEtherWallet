import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import bip44Paths from '@/modules/access-wallet/hardware/handlers/bip44';
import HDWalletInterface from '@/modules/access-wallet/common/HDWalletInterface';
import * as HDKey from 'hdkey';
import { Transaction } from 'ethereumjs-tx';
import { hashPersonalMessage, toBuffer, publicToAddress} from 'ethereumjs-util';
import {
  getSignTransactionObject,
  getBufferFromHex,
  calculateChainIdFromV
} from '@/modules/access-wallet/common/helpers';
import errorHandler from './errorHandler';
import store from '@/core/store';
import commonGenerator from '@/core/helpers/commonGenerator';
import Vue from 'vue';
import satochip from '@/assets/images/icons/wallets/satochip.svg';
const NEED_PASSWORD = false;

class SatochipWallet {
  constructor() {
    this.identifier = WALLET_TYPES.SATOCHIP;
    this.isHardware = true;
    this.needPassword = NEED_PASSWORD;
    this.supportedPaths = bip44Paths[WALLET_TYPES.SATOCHIP];
    this.meta = {
      name: 'Satochip',
      img: {
        type: 'img',
        value: satochip
      }
    };
    // satochip variables
    this.isConnected= false;
    this.resolveMap= new Map();
    this.requestID=0;
    this.ws= 0; 
    this.reconnectInterval = (1 * 1000 * 60) / 4; //time in ms
          
  } // end constructor()
  
  async init(basePath) {
    this.basePath = basePath ? basePath : this.supportedPaths[0].path;
    
    const rootPub = await this.getChainCode(this.basePath); 
    this.hdKey = new HDKey();
    this.hdKey.publicKey = Buffer.from(rootPub.publicKey, 'hex');
    this.hdKey.chainCode = Buffer.from(rootPub.chainCode, 'hex');
  }
  
  getChainCode= (dpath) => {
    return this.connect().then((ws) => {
      const msg = {
        requestID: this.requestID++,
        action: 'get_chaincode',
        path: dpath
      };
      const request = JSON.stringify(msg);
      
      return new Promise((resolve) => {
        // send request to device and keep a ref of the resolve function in a map
        new Promise((resolve2) => {
          this.resolveMap.set(msg.requestID, resolve2);
          ws.send(request);
        }).then((res) => {
          if (res.exitstatus == 0){//no issue
            resolve({
              publicKey: res.pubkey,
              chainCode: res.chaincode
            });
          }else{// there was an issue
            errorHandler({ message: res.reason})
          }
        });
      }) 
    });  
  } //  end getChainCode()
  
  connect = () => {
    const mywallet= this
    return new Promise((resolve) => {
      if (!mywallet.isConnected) {
        mywallet.ws = new WebSocket('ws://localhost:8397/');
        
        mywallet.ws.onopen = function open() {
          mywallet.isConnected = true;
          const msg = { requestID: mywallet.requestID++, action: 'get_status' };
          const data = JSON.stringify(msg);
          mywallet.ws.send(data);
          resolve(mywallet.ws);
        };

        mywallet.ws.onmessage = function incoming(data) {
          const response = JSON.parse(data.data);
          try {
            if (mywallet.resolveMap.has(response.requestID)) {
              mywallet.resolveMap.get(response.requestID)(response);
              mywallet.resolveMap.delete(response.requestID);
            }
          } catch (error) {
            errorHandler({message: 'Satochip: error while connecting to Satochip-Bridge'})
          }
        };

        mywallet.ws.onclose = function close(event) {
          mywallet.isConnected = false;
          setTimeout(mywallet.connect, mywallet.reconnectInterval);
        };

        mywallet.ws.onerror = function error() {
          mywallet.isConnected = false;
          errorHandler({message: 'Satochip: error while connecting to Satochip-Bridge'})
        };
      } else {
        resolve(mywallet.ws);
      }
    });
  }; //end connect()
  
  signRawTransaction= function(path, tx, tx_info) {

    return this.connect().then((ws) => {
      const msg = {
        requestID: this.requestID++,
        action: 'sign_tx_hash',
        tx: tx_info.tx_serialized, 
        hash: tx_info.tx_hash_false, // includeSignature:False
        //hash: tx_info.tx_hash_true, // includeSignature:True
        chainId: tx_info.chainId,
        from:  tx_info.address,
        path: path
      };
      const request = JSON.stringify(msg);
      const chainId= tx_info.chainId;
      
      return new Promise((resolve) => {
          // send request to device and keep a ref of the resolve function in a map
          new Promise((resolve2) => {
            this.resolveMap.set(msg.requestID, resolve2);
            ws.send(request);
          }).then((res) => {
            // extracts usefull data from device response and resolve original promise
            if (res.exitstatus == 0){//no issue
              const payload={ v: (res.v+chainId*2+35), r:res.r, s:res.s}
              resolve(payload);
            }else{// there was an issue
             errorHandler({message: res.reason})
            }
          });
      });
    });      
  } // end signRawTransaction
  
  signMessage= function(msg, path) {
    // message is a hex-string prefixed with 0x
    if (!msg) {
      errorHandler({message: 'No message to sign'});
    }
   
    return this.connect().then((ws) => {
      const data = {
        requestID: this.requestID++,
        action: 'sign_msg_hash',
        msg: msg,
        hash: hashPersonalMessage(toBuffer(msg)).toString('hex'),
        path: path
      };
      const request = JSON.stringify(data);

      return new Promise((resolve) => {
        // send request to device and keep a ref of the resolve function in a map
        new Promise((resolve2) => {
          this.resolveMap.set(data.requestID, resolve2);
          ws.send(request);
        }).then((res) => {
          // extracts usefull data from device response and resolve original promise
          if (res.exitstatus == 0){//no issue
            const r = res.r;
            const s = res.s;
            const v = ('0' + res.v.toString(16)).slice(-2); //padd with '0'
            const combined = '0x'+r + s + v; 
            resolve(combined);
          }else{// there was an issue
            errorHandler({message: res.reason})
          }
        });
      });
    });
  } // end signMessage()
  
  getAccount(idx) {
    const derivedKey = this.hdKey.derive('m/' + idx);
    // sign tx
    const txSigner = async tx => {
      tx = new Transaction(tx, {
        common: commonGenerator(store.getters['global/network'])
      });
      const networkId = tx.getChainId();
      const tx_serialized= tx.serialize().toString('hex')
      const tx_hash_true= tx.hash(true).toString('hex') // includeSignature:True
      const tx_hash_false= tx.hash(false).toString('hex') // includeSignature:False
      const path= this.basePath + '/' + idx;
      const pubkey= this.hdKey.derive('m/' + idx).publicKey;
      const address= publicToAddress(pubkey, true).toString('hex');
      const tx_info= {tx_serialized:tx_serialized, tx_hash_true:tx_hash_true, tx_hash_false:tx_hash_false, chainId:networkId, address: address}; // debugsatochip
      const result= await this.signRawTransaction(path, tx, tx_info)
      
      tx.r = getBufferFromHex(result.r);
      tx.s = getBufferFromHex(result.s);
      tx.v = getBufferFromHex(result.v.toString(16)); 

      const signedChainId = calculateChainIdFromV( getBufferFromHex(result.v.toString(16)) );
      if (signedChainId !== networkId)
        throw new Error(
          Vue.$i18n.t('errorsGlobal.invalid-network-id-sig', {
            got: signedChainId,
            expected: networkId
          }),
          'InvalidNetworkId'
        );
      
      return getSignTransactionObject(tx);
    };
    // sign msg
    const msgSigner = async msg => {
      const path= this.basePath + '/' + idx;
      const result= await this.signMessage(msg, path)
      return getBufferFromHex(result);
    };
    
    return new HDWalletInterface(
      this.basePath + '/' + idx,
      derivedKey.publicKey,
      this.isHardware,
      this.identifier,
      errorHandler,
      txSigner,
      msgSigner,
      this.meta
    );
  }
  
  getCurrentPath() {
    return this.basePath;
  }
  
  getSupportedPaths() {
    return this.supportedPaths;
  }
}

const createWallet = async basePath => {
  const _satochipWallet = new SatochipWallet();
  await _satochipWallet.init(basePath);
  return _satochipWallet;
};

createWallet.errorHandler = errorHandler;
export default createWallet;