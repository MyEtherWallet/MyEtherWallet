//import Trezor from 'trezor-connect';
import { SATOCHIP as satochipType } from '../../bip44/walletTypes';
import bip44Paths from '../../bip44';
import HDWalletInterface from '@/wallets/HDWalletInterface';
import * as HDKey from 'hdkey';
import { Transaction } from 'ethereumjs-tx';
import { hashPersonalMessage, toBuffer } from 'ethereumjs-util';
import {
  getSignTransactionObject,
  //getHexTxObject,
  getBufferFromHex,
  calculateChainIdFromV
} from '../../utils';
//import { Misc } from '@/helpers';
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
    this.ws= 0; //new WebSocket('ws://localhost:8397/');
    this.reconnectInterval = (1 * 1000 * 60) / 4;
    
    /* this.connect = () => {
      console.log('Satochip: src/wallets/hardware/satochip/index.js: connect()');

      return new Promise((resolve) => {
        if (!this.isConnected) {
          this.ws = new WebSocket('ws://localhost:8397/');
          
          this.ws.onopen = function open() {
            console.log('connected');
            this.isConnected = true;
            //TODO: remove get_status as it is not used?
            const msg = { requestID: this.requestID++, action: 'get_status' };
            const data = JSON.stringify(msg);
            console.log('CHECK this.isConnected: '+ this.isConnected);
            console.log('CHECK this: '+ this);
            console.log('Sending request: '+ data);
            this.ws.send(data);
            console.log('Request sent:' + data);
            resolve(this.ws);
          };

          this.ws.onmessage = function incoming(data) {
            console.log('in src/wallets/hardware/satochip/index.js'); //debugSatochip
            console.log('ONMESSAGE: message received!');
            console.log('Reply:' + data.data); // should be string

            const response = JSON.parse(data.data);
            console.log('Reply JSON:', response);
            console.log('Reply requestID:', response.requestID);

            try {
              console.log('Assert: resolveMap has key: ' + response.requestID + '?' + this.resolveMap.has(response.requestID) );
              if (this.resolveMap.has(response.requestID)) {
                console.log('typeof(resolveMap.get()):' + typeof this.resolveMap.get(response.requestID) );
                this.resolveMap.get(response.requestID)(response);
                this.resolveMap.delete(response.requestID);
              }
            } catch (error) {
              console.error(error);
            }
          };

          this.ws.onclose = function close(event) {
            console.log('disconnected with code:' + event.code);
            this.isConnected = false;
            setTimeout(this.connect, this.reconnectInterval);
          };

          this.ws.onerror = function error() {
            console.log('disconnected with error!');
            this.isConnected = false;
          };
        } else {
          resolve(this.ws);
        }
      });
    }; //end connect() */
    
/*     this.getChainCode= (dpath) => {
      console.log('Satochip: src/wallets/hardware/satochip/index.js: getChainCode() '); //debugSatochip
      this.connect().then((ws) => {
        //const fullpath= dpath+"/0";
        console.log('In satochip-connect-tab: getChainCode: connect().then()'); //debugSatochip
        const msg = {
          requestID: this.requestID++,
          action: 'get_chaincode',
          path: dpath
        };
        const request = JSON.stringify(msg);

        // send request to device and keep a ref of the resolve function in a map
        new Promise((resolve2) => {
          console.log('Satochip: resolveMap.size - before:' + this.resolveMap.size);
          this.resolveMap.set(msg.requestID, resolve2);
          //this.ws.send(request);
          ws.send(request);
          console.log('Satochip: request sent:' + request);
          console.log('Satochip: typeof(resolve2):' + typeof resolve2);
          console.log('Satochip: resolveMap.size - after:' + this.resolveMap.size);
        }).then((res) => {
          console.log('In satochip-connect-tab: getChainCode: res: ', res);
          
          return {
            publicKey: res.pubkey,
            chainCode: res.chaincode
          };
          
        });
      });  
    } //  end getChainCode() */
    
/*     this.signRawTransaction= function(path, tx, tx_info) {
      console.log('In satochip-connect-tab: signRawTransaction(): START');
      console.log('In satochip-connect-tab: signRawTransaction(): path', path);
      console.log('In satochip-connect-tab: signRawTransaction(): tx', tx);
      console.log('In satochip-connect-tab: signRawTransaction(): tx_info', tx_info);

      this.connect().then((ws) => {
        const msg = {
          requestID: this.requestID++,
          action: 'sign_tx_hash',
          tx: tx_info.tx_serialized, 
          hash: tx_info.tx_hash_false, // EIP155 enabled
          //hash: tx_info.tx_hash_true, // EIP155 disabled
          path: path
        };
        const request = JSON.stringify(msg);
        const chainId= tx_info.chainId;
        
        // send request to device and keep a ref of the resolve function in a map
        new Promise((resolve2) => {
          console.log('Satochip: resolveMap.size - before:' + this.resolveMap.size);
          this.resolveMap.set(msg.requestID, resolve2);
          ws.send(request);
          console.log('Satochip: request sent:' + request);
          console.log('Satochip: resolveMap.size - after:' + this.resolveMap.size);
        }).then((res) => {
          // extracts usefull data from device response and resolve original promise
          console.log('In satochip-connect-tab: signRawTransaction: res: ', res);
          const payload={ v: (res.v+chainId*2+35), r:res.r, s:res.s}
          return payload;
        });
      });
            
    } // end signRawTransaction */
      
  } // end constructor()
  
  //async init(basePath) {
  async init(basePath) {
    console.log('Satochip: src/wallets/hardware/satochip/index.js: init() basePath: ' + basePath); //debugSatochip
    console.log('CHECK this: '+ this);
    this.basePath = basePath ? basePath : this.supportedPaths[0].path;
    console.log('Satochip: src/wallets/hardware/satochip/index.js: init() basePath2: ' + this.basePath); //debugSatochip
    
    const rootPub = await this.getChainCode(this.basePath); //await getRootPubKey(this.basePath);
    console.log('Satochip: src/wallets/hardware/satochip/index.js: init() MIDDLE'); //debugSatochip
    console.log('Satochip: src/wallets/hardware/satochip/index.js: init() rootPub: ' + rootPub); //debugSatochip
    this.hdKey = new HDKey();
    this.hdKey.publicKey = Buffer.from(rootPub.publicKey, 'hex');
    this.hdKey.chainCode = Buffer.from(rootPub.chainCode, 'hex');
    
    /* this.getChainCode(this.basePath).then((rootPub) => {
      console.log('Satochip: src/wallets/hardware/satochip/index.js: init() MIDDLE'); //debugSatochip
      console.log('Satochip: src/wallets/hardware/satochip/index.js: init() rootPub: ' + rootPub); //debugSatochip
      this.hdKey = new HDKey();
      this.hdKey.publicKey = Buffer.from(rootPub.publicKey, 'hex');
      this.hdKey.chainCode = Buffer.from(rootPub.chainCode, 'hex');
    }) */
    
     
/*       const val= this.getChainCode(this.basePath);
      console.log('Satochip: src/wallets/hardware/satochip/index.js: init() after getChainCode'); //debugSatochip
      console.log('Satochip: src/wallets/hardware/satochip/index.js: init() val: ' + val); //debugSatochip
      val.then((rootPub) => {
        console.log('Satochip: src/wallets/hardware/satochip/index.js: init() MIDDLE'); //debugSatochip
        console.log('Satochip: src/wallets/hardware/satochip/index.js: init() rootPub: ' + rootPub); //debugSatochip
        this.hdKey = new HDKey();
        this.hdKey.publicKey = Buffer.from(rootPub.publicKey, 'hex');
        this.hdKey.chainCode = Buffer.from(rootPub.chainCode, 'hex');
      }) */
    
     
     
  }
  
  getChainCode= (dpath) => {
    console.log('Satochip: src/wallets/hardware/satochip/index.js: getChainCode() '); //debugSatochip
    console.log('CHECK this: '+ this);
    return this.connect().then((ws) => {
      //const fullpath= dpath+"/0";
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
          //this.ws.send(request);
          ws.send(request);
          console.log('Satochip: request sent:' + request);
          console.log('Satochip: typeof(resolve2):' + typeof resolve2);
          console.log('Satochip: resolveMap.size - after:' + this.resolveMap.size);
        }).then((res) => {
          console.log('In satochip-connect-tab: getChainCode: res: ', res);
          resolve({
            publicKey: res.pubkey,
            chainCode: res.chaincode
          });
/*           return ({
            publicKey: res.pubkey,
            chainCode: res.chaincode
          }); */
          
          
        });
      }) 
    });  
  } //  end getChainCode()
  
  connect = () => {
    console.log('Satochip: src/wallets/hardware/satochip/index.js: connect()');
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
          console.log('CHECK mywallet.isConnected: '+ mywallet.isConnected);
          console.log('CHECK mywallet: '+ mywallet);
          console.log('CHECK this: '+ this);
          console.log('Sending request: '+ data);
          mywallet.ws.send(data);
          console.log('Request sent:' + data);
          resolve(mywallet.ws);
        };

        mywallet.ws.onmessage = function incoming(data) {
          console.log('in src/wallets/hardware/satochip/index.js'); //debugSatochip
          console.log('ONMESSAGE: message received!');
          console.log('Reply:' + data.data); // should be string

          const response = JSON.parse(data.data);
          console.log('Reply JSON:', response);
          console.log('Reply requestID:', response.requestID);

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
        hash: tx_info.tx_hash_false, // EIP155 enabled
        //hash: tx_info.tx_hash_true, // EIP155 disabled
        path: path
      };
      const request = JSON.stringify(msg);
      const chainId= tx_info.chainId;
      
      return new Promise((resolve) => {
          // send request to device and keep a ref of the resolve function in a map
          new Promise((resolve2) => {
            console.log('Satochip: resolveMap.size - before:' + this.resolveMap.size);
            this.resolveMap.set(msg.requestID, resolve2);
            ws.send(request);
            console.log('Satochip: request sent:' + request);
            console.log('Satochip: resolveMap.size - after:' + this.resolveMap.size);
          }).then((res) => {
            // extracts usefull data from device response and resolve original promise
            console.log('In satochip-connect-tab: signRawTransaction: res: ', res);
            const payload={ v: (res.v+chainId*2+35), r:res.r, s:res.s}
            //return payload;
            resolve(payload);
            
          });
      });
    });      
  } // end signRawTransaction
  
  signMessage= function(msg, path) {
    console.log('Satochip: signMessage() START');
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
          const combined = '0x'+r + s + v; //addHexPrefix(r + s + v);
          resolve(combined);
        });
      });
    });
  } // end signMessage()
  
/*   _hashPersonalMessage (message) {
    Misc.toBuffer(msg).toString('hex'),
    // message is a hex-string prefixed with 0x
    console.warn('In eth-satochip-keyring: _hashPersonalMessage: START')
    const message_buffer = ethUtil.toBuffer(message);
    const hash_buffer = ethUtil.hashPersonalMessage(message_buffer);
    const hash_hex= hash_buffer.toString('hex');
    console.warn('In eth-satochip-keyring: _hashPersonalMessage: hash_hex: ', hash_hex)
    return hash_hex
  } */
  
  getAccount(idx) {
    console.log('Satochip: getAccount(): START');
    const derivedKey = this.hdKey.derive('m/' + idx);
    // sign tx
    const txSigner = async tx => {
      console.log('Satochip: txSigner: START');
      console.log('Satochip: txSigner: tx: ' + tx);
      tx = new Transaction(tx, {
        common: commonGenerator(store.state.main.network)
      });
      const networkId = tx.getChainId();
/*       const options = {
        path: this.basePath + '/' + idx,
        transaction: getHexTxObject(tx)
      }; */
      
      const tx_serialized= tx.serialize().toString('hex')
      const tx_hash_true= tx.hash(true).toString('hex') // legacy
      const tx_hash_false= tx.hash(false).toString('hex') // EIP155
      //const chainId= tx._chainId;
      const path= this.basePath + '/' + idx;
      const tx_info= {tx_serialized:tx_serialized, tx_hash_true:tx_hash_true, tx_hash_false:tx_hash_false, chainId:networkId}; // debugsatochip
/*       this.signRawTransaction(path, tx, tx_info).then((payload) => {
        console.log('Satochip: signRawTransaction.then(): payload:' + payload);
        // TODO
      });  */
      console.log('Satochip: txSigner: tx_info:' + tx_info);
      //console.log('Satochip: txSigner: chainId:' + chainId);
      const result= await this.signRawTransaction(path, tx, tx_info)
      console.log('Satochip: txSigner: result:' + result);
      
      const signedChainId = calculateChainIdFromV( getBufferFromHex(result.v.toString(16)) );
      console.log('Satochip: txSigner: signedChainId:' + signedChainId);
      console.log('Satochip: txSigner: networkId:' + networkId);
      
      tx.r = getBufferFromHex(result.r);
      console.log('Satochip: txSigner: tx.r:' + tx.r);
      tx.s = getBufferFromHex(result.s);
      console.log('Satochip: txSigner: tx.s:' + tx.s);
      
      const v= result.v+ networkId*2 + 35;
      const signedChainId2 = calculateChainIdFromV( getBufferFromHex(v.toString(16)) );
      console.log('Satochip: txSigner: signedChainId2:' + signedChainId2);
      tx.v = getBufferFromHex(result.v.toString(16)); //getBufferFromHex(result.v.toString(16));
      console.log('Satochip: txSigner: tx.v:' + tx.v);
      
      //const result = {succes:true, payload:{r:'0xa', s:'0xb', v:1}}; 
      //const result=  await Trezor.ethereumSignTransaction(options);
      /* if (!result.success) throw new Error(result.payload.error);
      tx.v = getBufferFromHex(result.payload.v);
      tx.r = getBufferFromHex(result.payload.r);
      tx.s = getBufferFromHex(result.payload.s); */
      
      
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
      console.log('In satochip-connect-tab: msgSigner: START');
      const path= this.basePath + '/' + idx;
      console.log('In satochip-connect-tab: msgSigner: path: ' + path);
/*       const result = await Trezor.ethereumSignMessage({
        path: this.basePath + '/' + idx,
        message: Misc.toBuffer(msg).toString('hex'),
        hex: true
      }); */
/*       this.signMessage(msg, path).then((result) => {
        console.log('Satochip: signMessage.then(): result:' + result);
        // TODO
        return getBufferFromHex(result.payload.signature);
      }); */
      const result= await this.signMessage(msg, path)
      console.log('Satochip: signMessage.then(): result:' + result);
      return getBufferFromHex(result);
/*       const result = {succes:true, payload:{signature:'0x0a0a0a', msg:msg }}; 
      if (!result.success) throw new Error(result.payload.error);
      return getBufferFromHex(result.payload.signature); */
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
/* const getRootPubKey = async (_satochip, _path) => {
  
  const result = await Trezor.ethereumGetPublicKey({ path: _path });
  if (!result.payload) {
    throw new Error('popup failed to open');
  }
  if (!result.success) throw new Error(result.payload.error);
  return {
    publicKey: result.payload.publicKey,
    chainCode: result.payload.chainCode
  };
  
}; */

export default createWallet;
