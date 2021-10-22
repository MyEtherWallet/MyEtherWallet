import axios from 'axios';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import BigNumber from 'bignumber.js';
import { URL_POST_META, IMAGE_PROXY } from './configs';

const NO_OWNER = '0x0000000000000000000000000000000000000000';
export default class HandlerBlockInfo {
  constructor(web3, network, blockNumber) {
    /**
     * set up the variables
     */
    this.loading = true;
    this.web3 = web3;
    this.network = network;
    this.owner = NO_OWNER;
    this.hasOwner = false;
    this.blockNumber = BigNumber(blockNumber).toNumber();
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
}
