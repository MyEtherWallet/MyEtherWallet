<template>
  <div class="py-13 px-15">
    <!-- Header titles -->
    <div class="d-flex align-center justify-start">
      <div>
        <div class="mew-heading-2">My Batch</div>
        <div class="mew-body textMedium--text">
          You have added {{ cart.length }} ETH {{ pluralizeBlockCount }} for
          Minting. Please review and click "Proceed to Minting."
        </div>
      </div>
    </div>
    <v-row justify-lg="space-between" justify-md="space-between">
      <v-col cols="12" md="6" lg="7">
        <div v-if="isLoading">
          <block-result-component
            v-for="(block, idx) in 3"
            :key="`loadingBlockBatchResult` + block"
            is-loading
            :show-add="false"
            :has-border="idx != 2"
          />
        </div>
        <div v-else-if="blocks.length === 0" class="mt-3">
          <mew-alert
            title="No Eth Blocks added to batch minting!"
            description='To mint blocks in batches, find a block and click on "Add to Batch"'
            theme="info"
            has-white-background
            hide-close-icon
          />
        </div>
        <div v-else>
          <block-result-component
            v-for="(block, idx) in blocks"
            :key="block.blockNumber"
            :block-handler="block"
            :is-loading="false"
            :show-add="false"
            :has-border="idx != blocks.length - 1"
          />
        </div>
      </v-col>
      <v-col cols="12" md="5" lg="4">
        <div class="minting-info-container pa-5 border-radius--5px">
          <div class="d-flex justify-space-between pb-4">
            <div class="mew-body">{{ totalAvailable }} Blocks</div>
            <div>
              <div class="mew-body">
                {{ totalMintPrice }} {{ network.type.currencyName }}
              </div>
              <div class="mew-label textLight--text">
                {{ totalMintPriceFiat }}
              </div>
            </div>
          </div>
          <div class="d-flex justify-space-between pb-4">
            <div>
              <div class="mew-body">Network Fee</div>
              <div class="mew-body greenPrimary--text">Edit Priority</div>
            </div>
            <div>
              <div class="mew-body">
                {{ totalMintPrice }} {{ network.type.currencyName }}
              </div>
              <div class="mew-label textLight--text">
                {{ totalMintPriceFiat }}
              </div>
            </div>
          </div>
          <div class="d-flex justify-space-between pb-4">
            <div class="mew-heading-3">Total</div>
            <div>
              <div class="mew-heading-3">
                {{ totalTransactionPrice }} {{ network.type.currencyName }}
              </div>
              <div class="mew-body textLight--text">
                {{ totalTransactionFiatPrice }}
              </div>
            </div>
          </div>
          <mew-button title="Proceed to Minting" has-full-width />
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import abi from '../handlers/helpers/multicall.js';
import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';
import handlerBlock from '../handlers/handlerBlock';
import BlockResultComponent from '../components/BlockResultComponent';
import {
  formatFiatValue,
  formatFloatingPointValue
} from '@/core/helpers/numberFormatHelper';
import BigNumber from 'bignumber.js';
import { fromWei, toWei, toBN } from 'web3-utils';
export default {
  name: 'ModuleEthBlockBatchMinting',
  components: {
    BlockResultComponent
  },
  data() {
    return {
      blocks: [],
      isLoading: true,
      gasLimit: '21000',
      batchMintData: [],
      mintContract: {},
      totalMintValue: '0',
      localGasPrice: '0', // will be updated in 5 min intervals
      gasPriceInterval: 0
    };
  },
  computed: {
    ...mapState('ethBlocksTxs', ['cart']),
    ...mapState('wallet', ['web3', 'address']),
    ...mapGetters('global', ['network', 'gasPrice']),
    ...mapGetters('external', ['fiatValue']),
    totalAvailable() {
      return this.blocks.filter(item => {
        if (!item.hasOwner) {
          return item;
        }
      }).length;
    },
    totalMintPrice() {
      const price = this.blocks.reduce((a, b) => {
        return a.add(toBN(b.mintPrice));
      }, toBN(0));

      return formatFloatingPointValue(fromWei(price)).value;
    },
    totalMintPriceFiat() {
      const value = formatFiatValue(
        BigNumber(this.totalMintPrice).times(this.fiatValue).toFixed(2)
      ).value;
      return `$ ${value}`;
    },
    totalTransactionPrice() {
      const val = toBN(this.gasLimit)
        .mul(toBN(this.localGasPrice))
        .add(toBN(toWei(this.totalMintPrice)));
      return formatFloatingPointValue(fromWei(val.toString())).value;
    },
    totalTransactionFiatPrice() {
      const value = formatFiatValue(
        BigNumber(this.totalTransactionPrice).times(this.fiatValue).toFixed(2)
      ).value;
      return `$ ${value}`;
    },
    pluralizeBlockCount() {
      return this.cart.length > 1 ? 'Blocks' : 'Block';
    }
  },
  watch: {
    cart: {
      handler: function () {
        this.fetchBlocks();
      },
      deep: true
    }
  },
  mounted() {
    const timer = 5 * 60 * 1000;
    this.fetchBlocks();
    this.localGasPrice = this.gasPrice;
    this.gasPriceInterval = setInterval(() => {
      this.localGasPrice = this.gasPrice;
    }, timer);
  },
  destroyed() {
    clearInterval(this.gasPriceInterval);
  },
  methods: {
    /**
     * Loop through cart (array of blocks)
     * and fetch information to display
     */
    async fetchBlocks() {
      this.isLoading = true;
      const newResultArray = [];
      this.blocks = [];
      this.totalResult = this.cart.filter(item => {
        if (!item.hasOwner) return item;
      }).length;
      try {
        for (let index = 0; index < this.cart.length; index++) {
          const block = new handlerBlock(
            this.web3,
            this.network,
            this.cart[index],
            this.address
          );

          newResultArray.push(
            block.getBlock().then(() => {
              return block;
            })
          );
        }
        Promise.all(newResultArray).then(values => {
          this.blocks = values.sort((a, b) => {
            return a.blockNumber < b.blockNumber
              ? -1
              : a.blockNumber > b.blockNumber
              ? 1
              : 0;
          });
          this.setupMulticall();
        });
      } catch (e) {
        this.isLoading = false;
        Toast(e, {}, ERROR);
      }
    },
    /**
     * Loop through cart (array of blocks)
     * and setup multicall data necessary for
     * single tx signing and single tx gas estimation
     */
    async setupMulticall() {
      const multicalls = [];
      this.batchMintData = [];
      if (this.blocks.length >= 1) {
        try {
          this.blocks.forEach(block => {
            multicalls.push(
              block.generateMintData().then(() => {
                return block;
              })
            );
          });
          Promise.all(multicalls).then(values => {
            // updates blocks with mintData now
            this.blocks = values.sort((a, b) => {
              return a.blockNumber < b.blockNumber
                ? -1
                : a.blockNumber > b.blockNumber
                ? 1
                : 0;
            });
            this.batchMintData = values.map(item => {
              return item.mintData.data;
            });
            this.mintContract = new this.web3.eth.Contract(
              abi,
              values[0].mintData.to
            );
            const totalValue = values.reduce((a, b) => {
              const parsedValue = b.mintData.value;
              return a.add(toBN(parsedValue));
            }, toBN(0));
            this.totalMintValue = totalValue.toString();
            // this.fetchGasLimits();
            this.fetchGasLimits2();
          });
        } catch (e) {
          this.isLoading = false;
          Toast(e, {}, ERROR);
        }
      }
    },
    /**
     * uses previously initialized contract
     * to fetch gaslimit for mint batch tx
     * using previously setup batch data
     */
    // async fetchGasLimits() {
    //   this.mintContract.methods
    //     .multicall(this.batchMintData)
    //     .estimateGas({
    //       value: this.totalMintValue
    //     })
    //     .then(res => {
    //       this.gasLimit = res;
    //       this.isLoading = false;
    //     })
    //     .catch(e => {
    //       this.isLoading = false;
    //       Toast(e, {}, ERROR);
    //     });
    // },
    async fetchGasLimits2() {
      console.log(this.batchMintData, this.totalMintValue);
      const response = this.mintContract.methods.multicall(this.batchMintData);
      const res = await response.estimateGas({ value: this.totalMintValue });
      console.log(res);
    }
  }
};
</script>

<style lang="scss">
.minting-info-container {
  border: 1px solid var(--v-greyMedium-base);
}
</style>
