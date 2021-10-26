import axios from 'axios';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import BigNumber from 'bignumber.js';
import {
  URL_POST_META,
  URL_POST_MINT,
  URL_POST_TRANSFER,
  IMAGE_PROXY
} from './configs';

const NO_OWNER = '0x0000000000000000000000000000000000000000';
export default class HandlerBlock {
  constructor(_web3, _network, _blockNumber, _currAdr) {
    /**
     * set up the variables
     */
    this.loading = true;
    this.web3 = _web3;
    this.network = _network;
    this.owner = NO_OWNER;
    this.hasOwner = false;
    this.blockNumber = BigNumber(_blockNumber).toNumber();
    this.currAdr = _currAdr;
    //Add to display you are minting this block
    this.pendingTxHash = '';
    //Block Data:
    this.owner = null;
    this.img = '';
    this.mintPrice = '';
    this.description = '';
    this.date = '';
    this.author = '';
    this.transactions = 0;
    this.gasUsed = 0;
    this.uncles = 0;
    this.isMinting = false;
    this.isSending = false;
  }
  /**
   * Get BlockInfo
   */
  setBlockNumber(blockNumber) {
    this.blockNumber = BigNumber(blockNumber).toNumber();
  }

  /**
   * Get Block Info
   */
  getBlock() {
    this.loading = true;
    const payload = {
      blockNumber: this.blockNumber,
      chainId: this.network.type.chainID
    };
    return axios
      .post(URL_POST_META, payload, {
        header: {
          'Content-Type': 'application/json'
        }
      })
      .then(resp => {
        //Set Block Data
        const meta = resp.data.metadata;
        this.hasOwner = resp.data.tokenOwner !== NO_OWNER;
        this.owner = resp.data.tokenOwner;
        this.img = `${IMAGE_PROXY}${meta.image}`;
        this.mintPrice = meta.mintPrice;
        this.description = meta.description;
        this.date = meta.attributes[2].value;
        this.author = meta.attributes[3].value;
        this.transactions = meta.attributes[4].value;
        this.gasUsed = meta.attributes[5].value;
        this.uncles = meta.attributes[6].value;
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
        Toast(err, {}, ERROR);
      });
  }

  mintBlock() {
    if (!this.hasOwner && this.owner) {
      this.isMinting = true;
      const payload = {
        blockNumber: this.blockNumber,
        chainId: this.network.type.chainID,
        to: this.currAdr
      };
      return axios
        .post(URL_POST_MINT, payload, {
          header: {
            'Content-Type': 'application/json'
          }
        })
        .then(resp => {
          //Set Block Data
          if (resp.data && resp.data.txData) {
            const txData = resp.data.txData;
            txData.from = this.currAdr;
            this.web3.eth.sendTransaction(txData);
            this.isMinting = false;
          }
          if (resp.data.error) {
            this.getBlock();
            this.isMinting = false;
            Toast(resp.data.error, {}, ERROR);
          }
        })
        .catch(err => {
          this.isMinting = false;
          Toast(err, {}, ERROR);
        });
    }
  }
  /**
   * Methods posts to transfer url to get Send Tx data for web3
   * @param {string} toAdr - to address in the param
   * @void
   */
  transferBlock(toAdr) {
    if (this.owner === this.currAdr) {
      this.isSending = true;
      const payload = {
        from: this.currAdr,
        to: toAdr,
        chainId: this.network.type.chainID,
        blockNumber: this.blockNumber
      };
      return axios
        .post(URL_POST_TRANSFER, payload, {
          header: {
            'Content-Type': 'application/json'
          }
        })
        .then(resp => {
          if (resp.data && resp.data.txData) {
            resp.data.txData.from = this.currAdr;
            this.web3.eth.sendTransaction(resp.data.txData);
            this.isSending = false;
          }
          if (resp.data.error) {
            this.getBlock();
            this.isSending = false;
            Toast(resp.data.error, {}, ERROR);
          }
        })
        .catch(err => {
          this.isSending = false;
          Toast(err, {}, ERROR);
        });
    }
  }
}
