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
import store from '@/core/store';

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
    //Block Data:
    this.img = '';
    this.rawImg = '';
    this.mintPrice = '';
    this.description = '';
    this.date = '';
    this.author = '';
    this.mintData = '';
    this.transactions = 0;
    this.gasUsed = 0;
    this.uncles = 0;
    this.isMinting = false;
    this.isSending = false;
    this.pendignInterval = null;
    this.extra = [];
    //Add to display you are minting this block
  }
  /**
   * Get BlockInfo
   */
  setBlockNumber(blockNumber) {
    this.owner = null;
    this.img = '';
    this.rawImg = '';
    this.mintPrice = '';
    this.description = '';
    this.date = '';
    this.author = '';
    this.mintData = '';
    this.transactions = 0;
    this.gasUsed = 0;
    this.uncles = 0;
    this.isMinting = false;
    this.isSending = false;
    this.blockNumber = toBN(blockNumber).toNumber();
  }

  /**
   * Sets network in the class
   * @param {Obeject}_network - network object
   */
  setNetwork(_network) {
    this.description = '';
    this.network = _network;
  }
  /**
   * Sets network in the class
   * @param {string}_address - current connected address
   */
  setAddress(_address) {
    this.currAdr = _address;
  }

  /**
   * Get Block Info
   */
  getBlock() {
    if (this.description === '') {
      this.loading = true;
      this.extra = [];
    }

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
        this.extra = [];
        const meta = resp.data.metadata;
        this.hasOwner =
          this.blockNumber === 13784390
            ? true
            : resp.data.tokenOwner !== NO_OWNER;
        this.owner =
          this.blockNumber === 13784390
            ? '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
            : resp.data.tokenOwner;
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
        if (meta.attributes.length > 7) {
          meta.attributes.forEach((item, index) => {
            if (index > 6) {
              this.extra.push(item);
            }
          });
        }
      })
      .catch(err => {
        this.loading = false;
        Toast(err, {}, ERROR);
      });
  }

  generateMintData() {
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
        this.mintData = resp.data.txData;
      })
      .catch(err => {
        Toast(err, {}, ERROR);
      });
  }

  mintBlock(_balanceinWei, _gasprice) {
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
          if (
            this.hasEnoughBalance(_balanceinWei, resp.data.txData, _gasprice)
          ) {
            this.web3.eth
              .sendTransaction(txData)
              .on('transactionHash', hash => {
                const _block = {
                  blockNumber: this.blockNumber.toString(),
                  hash: hash,
                  network: this.network.type.name
                };
                store.dispatch('ethBlocksTxs/addEthBlockTx', _block);
              })
              .catch(err => {
                this.isMinting = false;
                Toast(err, {}, ERROR);
              });
            this.isMinting = false;
          } else {
            this.isMinting = false;
            Toast(
              `Your balance is too low to mint. Please buy more ${this.network.type.name}`,
              {},
              ERROR
            );
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
  transferBlock(toAdr, _balanceinWei, _gasprice) {
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
          if (
            this.hasEnoughBalance(_balanceinWei, resp.data.txData, _gasprice)
          ) {
            this.web3.eth
              .sendTransaction(resp.data.txData)
              .on('transactionHash', hash => {
                const _block = {
                  blockNumber: this.blockNumber.toString(),
                  hash: hash,
                  network: this.network.type.name
                };
                store.dispatch('ethBlocksTxs/addEthBlockTx', _block);
              })
              .catch(err => {
                this.isSending = false;
                Toast(err, {}, ERROR);
              });
            this.isSending = false;
          } else {
            this.isSending = false;
            Toast(
              `Your balance is too low to transfer. Please buy more ${this.network.type.name}`,
              {},
              ERROR
            );
          }
        })
        .catch(err => {
          this.isSending = false;
          Toast(err, {}, ERROR);
        });
    }
  }

  hasEnoughBalance(_balanceinWei, txData, _gasprice) {
    const txFee = toBN(txData.gas).mul(toBN(_gasprice));
    const total = txFee.add(toBN(txData.value));
    return !toBN(_balanceinWei).sub(total).isNeg();
  }
}
