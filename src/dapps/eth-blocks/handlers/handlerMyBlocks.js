import axios from 'axios';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import { URL_POST_OWNER, IMAGE_PROXY } from './configs';

class SortedBlocks {
  constructor(blocks) {
    this.oldest = [...blocks];
    this.newest = [...blocks].reverse();
    this.ascend = [...this.sort(blocks)];
    this.dscend = [...this.ascend].reverse();
  }

  sort(_blocks) {
    const newBlocks = [..._blocks];
    return [
      ...newBlocks.sort(function (a, b) {
        return a.blockNumber - b.blockNumber;
      })
    ];
  }
}
export default class MyBlocks {
  constructor(web3, network, address) {
    /**
     * set up the variables
     */
    this.loading = true;
    this.web3 = web3;
    this.network = network;
    this.address = address;
    this.blocks = {};
    this.totalBlocks = 0;
  }
  /**
   * Sets network in the class
   * @param {Obeject}_network - network object
   */
  setNetwork(_network) {
    this.network = _network;
  }

  /**
   * Sets network in the class
   * @param {string}_address - current connected address
   */
  setAddress(_address) {
    this.address = _address;
  }

  /**
   * Get Block Info
   */
  getBlocks() {
    this.loading = true;
    const payload = {
      address: this.address,
      chainId: this.network.type.chainID
    };
    return axios
      .post(URL_POST_OWNER, payload)
      .then(resp => {
        if (resp.data.error) {
          this.loading = false;
          throw new Error(resp.data.error);
        }
        //acoutn for empty block array
        this.blocks = new SortedBlocks(
          resp.data.tokens.map(item => {
            const block = item;
            block.image = `${IMAGE_PROXY}${item.image}`;
            return block;
          })
        );
        this.totalBlocks = resp.data.tokens.length;
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
        Toast(err, {}, ERROR);
      });
  }

  /**
   * Methods checks if there is block with specific number
   * @param {string} block
   * @returns {boolean}
   */
  checkHasBlock(block) {
    const filtered = this.blocks.oldest.filter(value =>
      value.blockNumber.toString().toLowerCase().includes(block.toLowerCase())
    );
    return filtered.length > 0;
  }
}
