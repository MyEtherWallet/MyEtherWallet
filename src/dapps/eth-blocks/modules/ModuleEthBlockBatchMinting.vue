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
            <a
              class="mew-label font-weight-medium"
              @click="
                () => {
                  openBuySell('ETHBlocksBatchMint');
                }
              "
            >
              Buy more {{ network.type.name }}.
            </a>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import {
  defineAsyncComponent,
  ref,
  computed,
  watch,
  onMounted,
  onUnmounted
} from 'vue';
import BigNumber from 'bignumber.js';
import { fromWei, toWei, toBN } from 'web3-utils';

import abi from '../handlers/helpers/multicall.js';
import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';
import handlerBlock from '../handlers/handlerBlock';
import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
import { EventBus } from '@/core/plugins/eventBus';
import { useBuySell } from '@/core/composables/buyMore.js';
import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { useExternalStore } from '@/core/store/external';
import { useEthBlocksTxsStore } from '../store';
import { storeToRefs } from 'pinia';

const BlockResultComponent = defineAsyncComponent(() =>
  import('../components/BlockResultComponent')
);
// injections/use
const { openBuySell } = useBuySell();
const { network, gasPrice, gasPriceByType, getFiatValue } = useGlobalStore();
const { web3, address, balance } = useWalletStore();
const { emptyCart } = useEthBlocksTxsStore();
const { fiatValue } = useExternalStore();

const { gasPriceType } = storeToRefs(useGlobalStore());
const { cart } = storeToRefs(useEthBlocksTxsStore());

// data
const blocks = ref([]);
const blockCache = ref({});
const isLoading = ref(true);
const gasLimit = ref('21000');
const batchMintData = ref([]);
const mintContract = ref({});
const totalMintValue = ref('0');
const localGasPrice = ref('0'); // will be updated in 5 min intervals
const gasPriceInterval = ref(0);

// computed
const notEnoughMessage = computed(() => {
  return `Not enough ${network.type.name} to mint. `;
});
const totalAvailable = computed(() => {
  return blocks.value.filter(item => {
    if (!item.hasOwner) {
      return item;
    }
  }).length;
});
const totalMintPrice = computed(() => {
  const price = blocks.value.reduce((a, b) => {
    return a.add(toBN(b.mintPrice));
  }, toBN(0));

  return formatFloatingPointValue(fromWei(price)).value;
});
const totalMintPriceFiat = computed(() => {
  const value = getFiatValue(
    BigNumber(totalMintPrice.value).times(fiatValue).toFixed(2)
  );
  return value;
});
const totalNetworkFee = computed(() => {
  const val = toBN(gasLimit.value).mul(toBN(localGasPrice.value));
  return formatFloatingPointValue(fromWei(val.toString())).value;
});
const totalNetworkFiatFee = computed(() => {
  const value = getFiatValue(
    BigNumber(totalNetworkFee.value).times(fiatValue).toFixed(2)
  );
  return value;
});
const totalTransactionPrice = computed(() => {
  const val = toBN(gasLimit.value)
    .mul(toBN(localGasPrice.value))
    .add(toBN(toWei(totalMintPrice.value)));
  return formatFloatingPointValue(fromWei(val.toString())).value;
});
const totalTransactionFiatPrice = computed(() => {
  const value = getFiatValue(
    BigNumber(totalTransactionPrice.value).times(fiatValue).toFixed(2)
  );
  return value;
});
const blockCount = computed(() => {
  const cart = cart.ETH;
  return cart.length;
});
const pluralizeBlockCount = computed(() => {
  const cart = cart.ETH;
  return cart.length > 1 ? 'Blocks' : 'Block';
});
const isCartEmpty = computed(() => {
  const cart = cart.ETH;
  return cart.length >= 1 ? false : true;
});
const hasEnoughEth = computed(() => {
  const totalPrice = toBN(gasLimit.value)
    .mul(toBN(localGasPrice.value))
    .add(toBN(toWei(totalMintPrice.value)));
  return totalPrice.lt(balance);
});

// watch
watch(
  () => cart,
  () => {
    fetchBlocks();
  },
  () => ({ deep: true })
);
watch(
  () => gasPriceType,
  () => {
    localGasPrice.value = gasPriceByType(gasPriceType);
  }
);

// mounted
onMounted(() => {
  const timer = 5 * 60 * 1000;
  fetchBlocks();
  localGasPrice.value = gasPrice;
  gasPriceInterval.value = setInterval(() => {
    localGasPrice.value = gasPrice;
  }, timer);
});

// destroyed
onUnmounted(() => {
  clearInterval(gasPriceInterval);
});

// methods
/**
 * Loop through cart (array of blocks)
 * and fetch information to display
 */
const fetchBlocks = async () => {
  isLoading.value = true;
  const newResultArray = [];
  const cart = cart.ETH;
  try {
    const foundBlocks = [];
    for (let index = 0; index < cart.length; index++) {
      const found = blockCache[cart[index]];
      if (found) {
        foundBlocks.push(found);
        continue;
      }
      const block = new handlerBlock(web3, network, cart[index], address);
      newResultArray.push(
        block.getBlock().then(() => {
          return block;
        })
      );
    }
    Promise.all(newResultArray).then(values => {
      const combinedArray = [...values, ...foundBlocks];
      blocks.value = combinedArray.sort((a, b) => {
        return a.blockNumber < b.blockNumber
          ? -1
          : a.blockNumber > b.blockNumber
          ? 1
          : 0;
      });
      values.forEach(b => {
        blockCache[b.blockNumber] = b;
      });
      setupMulticall();
    });
  } catch (e) {
    isLoading.value = false;
    Toast(e, {}, ERROR);
  }
};
const removeMe = blockNumber => {
  return (blocks.value = blocks.value.filter(block => {
    if (block.blockNumber.toString() !== blockNumber) return block;
  }));
};
const openSettings = () => {
  EventBus.$emit('openSettings');
};
/**
 * Loop through cart (array of blocks)
 * and setup multicall data necessary for
 * single tx signing and single tx gas estimation
 */
const setupMulticall = async () => {
  const multicalls = [];
  batchMintData.value = [];
  if (blocks.value.length === 0) isLoading.value = false;
  if (blocks.value.length >= 1) {
    try {
      const foundBlocks = [];
      blocks.value.forEach(block => {
        const found = blockCache[block.blockNumber];
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
            blocks.value.find(b => b.blockNumber === block.blockNumber)
          );
          blocks.value = combinedArray.sort((a, b) => {
            return a.blockNumber < b.blockNumber
              ? -1
              : a.blockNumber > b.blockNumber
              ? 1
              : 0;
          });
          if (blocks.value.length === 0) {
            isLoading.value = false;
            return;
          }
          batchMintData.value = blocks.value.map(item => {
            return item.mintData.data;
          });
          mintContract.value = new web3.eth.Contract(
            abi,
            blocks.value[0].mintData.to
          );
          const totalValue = blocks.value.reduce((a, b) => {
            return a.add(toBN(b.mintData.value));
          }, toBN(0));
          totalMintValue.value = totalValue.toString();
          fetchGasLimits();
        })
        .catch(e => {
          isLoading.value = false;
          Toast(e, {}, ERROR);
        });
    } catch (e) {
      isLoading.value = false;
      Toast(e, {}, ERROR);
    }
  }
};
/**
 * uses previously initialized contract
 * to fetch gaslimit for mint batch tx
 * using previously setup batch data
 */
const fetchGasLimits = async () => {
  mintContract.value.methods
    .multicall(batchMintData.value)
    .estimateGas({
      value: totalMintValue.value
    })
    .then(res => {
      gasLimit.value = res;
      isLoading.value = false;
    })
    .catch(e => {
      isLoading.value = false;
      Toast(e, {}, ERROR);
    });
};
const mintBlocks = async () => {
  mintContract.value.methods
    .multicall(batchMintData.value)
    .send({
      from: address,
      gas: gasLimit,
      gasPrice: localGasPrice.value,
      value: totalMintValue.value
    })
    .on('transactionHash', () => {
      const network = 'ETH';
      emptyCart(network);
      isLoading.value = false;
    })
    .on('error', err => {
      isLoading.value = false;
      Toast(err, {}, ERROR);
    });
};
</script>

<style lang="scss" scoped>
.minting-info-container {
  border: 1px solid var(--v-greyMedium-base);
}
</style>
