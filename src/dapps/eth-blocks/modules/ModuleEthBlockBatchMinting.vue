<template>
  <div
    class="dapps--eth-blocks--module-eth-block-batch-minting py-13 px-5 px-sm-15 px-lg-15"
  >
    <!-- Header titles -->
    <v-row justify-lg="space-between" justify-md="space-between">
      <v-col cols="12" md="6" lg="7">
        <div class="d-flex align-center justify-start">
          <div>
            <div class="pb-3 mew-heading-2">My Batch</div>
            <div v-if="blockCount >= 1" class="mew-body textMedium--text">
              You have added {{ blockCount }} ETH {{ pluralizeBlockCount }} for
              Minting. Please review and click "Proceed to Minting."
            </div>
          </div>
        </div>
        <div v-if="isLoading && !blocks.length">
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
            :remove-me="removeMe"
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
              <div class="mew-label textLight--text text-end">
                {{ totalMintPriceFiat }}
              </div>
            </div>
          </div>
          <div class="d-flex justify-space-between pb-4">
            <div>
              <div class="mew-body">Transaction Fee</div>
              <div
                class="mew-body greenPrimary--text cursor--pointer"
                @click="openSettings"
              >
                Edit Priority
              </div>
            </div>
            <div>
              <div class="mew-body">
                {{ totalNetworkFee }} {{ network.type.currencyName }}
              </div>
              <div class="mew-label textLight--text text-end">
                {{ totalNetworkFiatFee }}
              </div>
            </div>
          </div>
          <div class="d-flex justify-space-between pb-4">
            <div class="mew-heading-3">Total</div>
            <div>
              <div class="mew-heading-3">
                {{ totalTransactionPrice }} {{ network.type.currencyName }}
              </div>
              <div class="mew-body textLight--text text-end">
                {{ totalTransactionFiatPrice }}
              </div>
            </div>
          </div>
          <mew-button
            :title="hasEnoughEth ? 'Proceed to minting' : 'Not enough ETH'"
            has-full-width
            :disabled="!hasEnoughEth || isLoading || isCartEmpty"
            :loading="isLoading"
            @click.native="mintBlocks"
          />

          <!-- =================================================== -->
          <!-- Block is available OR is Owned: not enough ETH -->
          <!-- =================================================== -->
          <div
            v-if="!hasEnoughEth"
            class="d-flex align-center justify-end mt-4"
          >
            <div class="error--text mew-label mr-2">{{ notEnoughMessage }}</div>
            <a class="mew-label font-weight-medium" @click="openBuySell">
              Buy more {{ network.type.name }}.
            </a>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';
import BigNumber from 'bignumber.js';
import { fromWei, toWei, toBN } from 'web3-utils';
import buyMore from '@/core/mixins/buyMore.mixin.js';
import abi from '../handlers/helpers/multicall.js';
import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';
import handlerBlock from '../handlers/handlerBlock';
import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
import { EventBus } from '@/core/plugins/eventBus';

export default {
  name: 'ModuleEthBlockBatchMinting',
  components: {
    BlockResultComponent: () => import('../components/BlockResultComponent')
  },
  mixins: [buyMore],
  data() {
    return {
      blocks: [],
      blockCache: {},
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
    ...mapState('wallet', ['web3', 'address', 'balance']),
    ...mapGetters('global', [
      'network',
      'isTestNetwork',
      'gasPrice',
      'gasPriceByType',
      'getFiatValue'
    ]),
    ...mapState('global', ['gasPriceType']),
    ...mapGetters('external', ['fiatValue']),
    notEnoughMessage() {
      return `Not enough ${this.network.type.name} to mint. `;
    },
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
      const value = this.getFiatValue(
        BigNumber(this.totalMintPrice).times(this.fiatValue).toFixed(2)
      );
      return value;
    },
    totalNetworkFee() {
      const val = toBN(this.gasLimit).mul(toBN(this.localGasPrice));
      return formatFloatingPointValue(fromWei(val.toString())).value;
    },
    totalNetworkFiatFee() {
      const value = this.getFiatValue(
        BigNumber(this.totalNetworkFee).times(this.fiatValue).toFixed(2)
      );
      return value;
    },
    totalTransactionPrice() {
      const val = toBN(this.gasLimit)
        .mul(toBN(this.localGasPrice))
        .add(toBN(toWei(this.totalMintPrice)));
      return formatFloatingPointValue(fromWei(val.toString())).value;
    },
    totalTransactionFiatPrice() {
      const value = this.getFiatValue(
        BigNumber(this.totalTransactionPrice).times(this.fiatValue).toFixed(2)
      );
      return value;
    },
    blockCount() {
      const cart = this.cart.ETH;
      return cart.length;
    },
    pluralizeBlockCount() {
      const cart = this.cart.ETH;
      return cart.length > 1 ? 'Blocks' : 'Block';
    },
    isCartEmpty() {
      const cart = this.cart.ETH;
      return cart.length >= 1 ? false : true;
    },
    hasEnoughEth() {
      const totalPrice = toBN(this.gasLimit)
        .mul(toBN(this.localGasPrice))
        .add(toBN(toWei(this.totalMintPrice)));
      return totalPrice.lt(this.balance);
    }
  },
  watch: {
    cart: {
      handler: function () {
        this.fetchBlocks();
      },
      deep: true
    },
    gasPriceType() {
      this.localGasPrice = this.gasPriceByType(this.gasPriceType);
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
    ...mapActions('ethBlocksTxs', ['emptyCart']),
    /**
     * Loop through cart (array of blocks)
     * and fetch information to display
     */
    async fetchBlocks() {
      this.isLoading = true;
      const newResultArray = [];
      const cart = this.cart.ETH;
      this.totalResult = cart.filter(item => {
        if (!item.hasOwner) return item;
      }).length;
      try {
        const foundBlocks = [];
        for (let index = 0; index < cart.length; index++) {
          const found = this.blockCache[cart[index]];
          if (found) {
            foundBlocks.push(found);
            continue;
          }
          const block = new handlerBlock(
            this.web3,
            this.network,
            cart[index],
            this.address
          );
          newResultArray.push(
            block.getBlock().then(() => {
              return block;
            })
          );
        }
        Promise.all(newResultArray).then(values => {
          const combinedArray = [...values, ...foundBlocks];
          this.blocks = combinedArray.sort((a, b) => {
            return a.blockNumber < b.blockNumber
              ? -1
              : a.blockNumber > b.blockNumber
              ? 1
              : 0;
          });
          values.forEach(b => {
            this.blockCache[b.blockNumber] = b;
          });
          this.setupMulticall();
        });
      } catch (e) {
        this.isLoading = false;
        Toast(e, {}, ERROR);
      }
    },
    removeMe(blockNumber) {
      return (this.blocks = this.blocks.filter(block => {
        if (block.blockNumber.toString() !== blockNumber) return block;
      }));
    },
    openSettings() {
      EventBus.$emit('openSettings');
    },
    /**
     * Loop through cart (array of blocks)
     * and setup multicall data necessary for
     * single tx signing and single tx gas estimation
     */
    async setupMulticall() {
      const multicalls = [];
      this.batchMintData = [];
      if (this.blocks.length === 0) this.isLoading = false;
      if (this.blocks.length >= 1) {
        try {
          const foundBlocks = [];
          this.blocks.forEach(block => {
            const found = this.blockCache[block.blockNumber];
            if (!found.mintData) {
              multicalls.push(
                block.generateMintData().then(() => {
                  return block;
                })
              );
            }
            if (found) foundBlocks.push(found);
          });
          Promise.all(multicalls)
            .then(values => {
              // updates blocks with mintData now
              const cached = foundBlocks.filter(
                block => !values.find(b => b.blockNumber === block.blockNumber)
              );
              const combinedArray = [...cached, ...values].filter(block =>
                this.blocks.find(b => b.blockNumber === block.blockNumber)
              );
              this.blocks = combinedArray.sort((a, b) => {
                return a.blockNumber < b.blockNumber
                  ? -1
                  : a.blockNumber > b.blockNumber
                  ? 1
                  : 0;
              });
              if (this.blocks.length === 0) {
                this.isLoading = false;
                return;
              }
              this.batchMintData = this.blocks.map(item => {
                return item.mintData.data;
              });
              this.mintContract = new this.web3.eth.Contract(
                abi,
                this.blocks[0].mintData.to
              );
              const totalValue = this.blocks.reduce((a, b) => {
                return a.add(toBN(b.mintData.value));
              }, toBN(0));
              this.totalMintValue = totalValue.toString();
              this.fetchGasLimits();
            })
            .catch(e => {
              this.isLoading = false;
              Toast(e, {}, ERROR);
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
    async fetchGasLimits() {
      this.mintContract.methods
        .multicall(this.batchMintData)
        .estimateGas({
          value: this.totalMintValue
        })
        .then(res => {
          this.gasLimit = res;
          this.isLoading = false;
        })
        .catch(e => {
          this.isLoading = false;
          Toast(e, {}, ERROR);
        });
    },
    async mintBlocks() {
      this.mintContract.methods
        .multicall(this.batchMintData)
        .send({
          from: this.address,
          gas: this.gasLimit,
          gasPrice: this.localGasPrice,
          value: this.totalMintValue
        })
        .on('transactionHash', () => {
          const network = 'ETH';
          this.emptyCart(network);
          this.isLoading = false;
        })
        .on('error', err => {
          this.isLoading = false;
          Toast(err, {}, ERROR);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.minting-info-container {
  border: 1px solid var(--v-greyMedium-base);
}
</style>
