import axios from 'axios';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import {
  URL_POST_META,
  URL_POST_MINT,
  URL_POST_TRANSFER,
  IMAGE_PROXY
} from './configs';
import { toBN } from 'web3-utils';
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
    this.blockNumber = toBN(_blockNumber).toNumber();
    this.currAdr = _currAdr;
    //Add to display you are minting this block
    this.pendingTxHash = '';
    //Block Data:
    this.owner = null;
    this.img = '';
    this.rawImg = '';
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
    this.blockNumber = toBN(blockNumber).toNumber();
  }

  setNetwork(_network) {
    this.network = _network;
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
      .post(URL_POST_META, payload)
      .then(resp => {
        if (resp.data.error) {
          this.loading = false;
          throw new Error(resp.data.error);
        }
        //Set Block Data
        const meta = resp.data.metadata;
        this.hasOwner = resp.data.tokenOwner !== NO_OWNER;
        this.owner = resp.data.tokenOwner;
        this.rawImg = meta.image;
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
        .post(URL_POST_MINT, payload)
        .then(resp => {
          //Set Block Data
          if (resp.data.error) {
            this.getBlock();
            throw new Error(resp.data.error);
          }
          const txData = resp.data.txData;
          txData.from = this.currAdr;
          this.web3.eth.sendTransaction(txData);
          this.isMinting = false;
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
        .post(URL_POST_TRANSFER, payload)
        .then(resp => {
          if (resp.data.error) {
            this.getBlock();
            this.isSending = false;
            throw new Error(resp.data.error);
          }
          resp.data.txData.from = this.currAdr;
          this.web3.eth.sendTransaction(resp.data.txData);
          this.isSending = false;
        })
        .catch(err => {
          this.isSending = false;
          Toast(err, {}, ERROR);
        });
    }
  }
}
