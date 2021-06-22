import { SATOCHIP as satochipType } from '../../bip44/walletTypes';
import bip44Paths from '../../bip44';
import HDWalletInterface from '@/wallets/HDWalletInterface';
import * as HDKey from 'hdkey';
import { Transaction } from 'ethereumjs-tx';
import { hashPersonalMessage, toBuffer, publicToAddress} from 'ethereumjs-util';
import {
  getSignTransactionObject,
  getBufferFromHex,
  calculateChainIdFromV
} from '../../utils';
import errorHandler from './errorHandler';
import store from '@/store';
import commonGenerator from '@/helpers/commonGenerator';
import Vue from 'vue';
const NEED_PASSWORD = false;

class SatochipWallet {
  constructor() {
    this.identifier = satochipType;
    this.isHardware = true;
    this.needPassword = NEED_PASSWORD;
    this.supportedPaths = bip44Paths[satochipType];
    
    // satochip variables
    this.isConnected= false;
    this.resolveMap= new Map();
    this.requestID=0;
    this.ws= 0; 
    this.reconnectInterval = (1 * 1000 * 60) / 4;
          
  } // end constructor()
  
  async init(basePath) {
    console.log('Satochip: init() START'); //debugSatochip
    this.basePath = basePath ? basePath : this.supportedPaths[0].path;
    console.log('Satochip: init() basePath: ' + this.basePath); //debugSatochip
    
    const rootPub = await this.getChainCode(this.basePath); 
    console.log('Satochip: init() rootPub: ' + rootPub); //debugSatochip
    this.hdKey = new HDKey();
    this.hdKey.publicKey = Buffer.from(rootPub.publicKey, 'hex');
    this.hdKey.chainCode = Buffer.from(rootPub.chainCode, 'hex');
  }
  
  getChainCode= (dpath) => {
    console.log('Satochip: getChainCode() START'); //debugSatochip
    console.log('CHECK this: '+ this);
    return this.connect().then((ws) => {
      console.log('In satochip-connect-tab: getChainCode: connect().then()'); //debugSatochip
      const msg = {
        requestID: this.requestID++,
        action: 'get_chaincode',
        path: dpath
      };
      const request = JSON.stringify(msg);
      
      return new Promise((resolve) => {
        // send request to device and keep a ref of the resolve function in a map
        new Promise((resolve2) => {
          console.log('Satochip: resolveMap.size - before:' + this.resolveMap.size);
          this.resolveMap.set(msg.requestID, resolve2);
          ws.send(request);
          console.log('Satochip: request sent:' + request);
          //console.log('Satochip: typeof(resolve2):' + typeof resolve2);
          //console.log('Satochip: resolveMap.size - after:' + this.resolveMap.size);
        }).then((res) => {
          console.log('In satochip-connect-tab: getChainCode: res: ', res);
          resolve({
            publicKey: res.pubkey,
            chainCode: res.chaincode
          });
        });
      }) 
    });  
  } //  end getChainCode()
  
  connect = () => {
    console.log('Satochip: connect() START');
    console.log('CHECK this: '+ this);
    const mywallet= this
    return new Promise((resolve) => {
      if (!mywallet.isConnected) {
        mywallet.ws = new WebSocket('ws://localhost:8397/');
        
        mywallet.ws.onopen = function open() {
          console.log('connected');
          mywallet.isConnected = true;
          //TODO: remove get_status as it is not used?
          const msg = { requestID: mywallet.requestID++, action: 'get_status' };
          const data = JSON.stringify(msg);
          // console.log('CHECK mywallet.isConnected: '+ mywallet.isConnected);
          // console.log('CHECK this: '+ this);
          console.log('Sending request: '+ data);
          mywallet.ws.send(data);
          resolve(mywallet.ws);
        };

        mywallet.ws.onmessage = function incoming(data) {
          console.log('ONMESSAGE: message received!');
          console.log('Reply:' + data.data); // should be string

          const response = JSON.parse(data.data);
          console.log('Reply JSON:', response);

          try {
            console.log('Assert: resolveMap has key: ' + response.requestID + '?' + mywallet.resolveMap.has(response.requestID) );
            if (mywallet.resolveMap.has(response.requestID)) {
              console.log('typeof(resolveMap.get()):' + typeof mywallet.resolveMap.get(response.requestID) );
              mywallet.resolveMap.get(response.requestID)(response);
              mywallet.resolveMap.delete(response.requestID);
            }
          } catch (error) {
            console.error(error);
          }
        };

        mywallet.ws.onclose = function close(event) {
          console.log('disconnected with code:' + event.code);
          mywallet.isConnected = false;
          setTimeout(mywallet.connect, mywallet.reconnectInterval);
        };

        mywallet.ws.onerror = function error() {
          console.log('disconnected with error!');
          mywallet.isConnected = false;
        };
      } else {
        resolve(mywallet.ws);
      }
    });
  }; //end connect()
  
  signRawTransaction= function(path, tx, tx_info) {
    console.log('In satochip-connect-tab: signRawTransaction(): START');
    console.log('In satochip-connect-tab: signRawTransaction(): path', path);
    console.log('In satochip-connect-tab: signRawTransaction(): tx', tx);
    console.log('In satochip-connect-tab: signRawTransaction(): tx_info', tx_info);

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
            console.log('Satochip: request sent:' + request);
          }).then((res) => {
            // extracts usefull data from device response and resolve original promise
            console.log('In satochip-connect-tab: signRawTransaction: res: ', res);
            const payload={ v: (res.v+chainId*2+35), r:res.r, s:res.s}
            resolve(payload);
            
          });
      });
    });      
  } // end signRawTransaction
  
  signMessage= function(msg, path) {
    console.log('Satochip: signMessage() START');
    // message is a hex-string prefixed with 0x
    if (!msg) {
      throw Error('No message to sign');
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
          console.log('Satochip: signMessage: request sent:' + request);
        }).then((res) => {
          // extracts usefull data from device response and resolve original promise
          console.log('Satochip: signMessage: result: ' + res);
          const r = res.r;
          const s = res.s;
          const v = ('0' + res.v.toString(16)).slice(-2); //padd with '0'
          const combined = '0x'+r + s + v; 
          resolve(combined);
        });
      });
    });
  } // end signMessage()
  
  getAccount(idx) {
    console.log('Satochip: getAccount(): START');
    const derivedKey = this.hdKey.derive('m/' + idx);
    // sign tx
    const txSigner = async tx => {
      console.log('Satochip: txSigner: START');
      //console.log('Satochip: txSigner: tx: ' + tx);
      tx = new Transaction(tx, {
        common: commonGenerator(store.state.main.network)
      });
      const networkId = tx.getChainId();
      const tx_serialized= tx.serialize().toString('hex')
      const tx_hash_true= tx.hash(true).toString('hex') // includeSignature:True
      const tx_hash_false= tx.hash(false).toString('hex') // includeSignature:False
      const path= this.basePath + '/' + idx;
      const pubkey= this.hdKey.derive('m/' + idx).publicKey;
      const address= publicToAddress(pubkey, true).toString('hex');
      const tx_info= {tx_serialized:tx_serialized, tx_hash_true:tx_hash_true, tx_hash_false:tx_hash_false, chainId:networkId, address: address}; // debugsatochip
      //console.log('Satochip: txSigner: tx_info:' + tx_info);
      const result= await this.signRawTransaction(path, tx, tx_info)
      console.log('Satochip: txSigner: result:' + result);
      
      tx.r = getBufferFromHex(result.r);
      //console.log('Satochip: txSigner: tx.r:' + tx.r);
      tx.s = getBufferFromHex(result.s);
      //console.log('Satochip: txSigner: tx.s:' + tx.s);
      tx.v = getBufferFromHex(result.v.toString(16)); 
      //console.log('Satochip: txSigner: tx.v:' + tx.v);
      
      // if (!result.success) throw new Error(result.payload.error); // TODO

      const signedChainId = calculateChainIdFromV( getBufferFromHex(result.v.toString(16)) );
      console.log('Satochip: txSigner: signedChainId:' + signedChainId);
      console.log('Satochip: txSigner: networkId:' + networkId);
      if (signedChainId !== networkId)
        throw new Error(
          Vue.$i18n.t('errorsGlobal.invalid-network-id-sig', {
            got: signedChainId,
            expected: networkId
          }),
          'InvalidNetworkId'
        );
      
      console.log('Satochip: txSigner: END');
      return getSignTransactionObject(tx);
    };
    // sign msg
    const msgSigner = async msg => {
      console.log('Satochip: msgSigner: START');
      const path= this.basePath + '/' + idx;
      console.log('Satochip: msgSigner: path: ' + path);

      const result= await this.signMessage(msg, path)
      console.log('Satochip: signMessage: result:' + result);
      return getBufferFromHex(result);

      // if (!result.success) throw new Error(result.payload.error);// TODO
    };
    
    const displayAddress = () => {
      console.log('In satochip-connect-tab: displayAddress: START');
    };
    return new HDWalletInterface(
      this.basePath + '/' + idx,
      derivedKey.publicKey,
      this.isHardware,
      this.identifier,
      errorHandler,
      txSigner,
      msgSigner,
      displayAddress
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
