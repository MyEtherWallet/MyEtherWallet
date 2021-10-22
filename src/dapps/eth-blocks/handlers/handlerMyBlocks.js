import axios from 'axios';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import { URL_POST_OWNER, IMAGE_PROXY } from './configs';

export default class MyBlocks {
  constructor(web3, network, address) {
    /**
     * set up the variables
     */
    this.loading = true;
    this.web3 = web3;
    this.network = network;
    this.address = address;
    this.ownedBlocks = [];
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
      .post(URL_POST_OWNER, payload, {
        header: {
          'Content-Type': 'application/json'
        }
      })
      .then(resp => {
        this.ownedBlocks = resp.data.tokens.map(item => {
          const block = item;
          block.image = `${IMAGE_PROXY}${item.image}`;
          return block;
        });

        console.log(this.ownedBlocks);
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
        Toast(err, {}, ERROR);
      });
  }
}
