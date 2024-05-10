<template>
  <!-- ======================================================================================= -->
  <!-- Side Staking -->
  <!-- ======================================================================================= -->
  <div
    class="mew-component--module-side-apr pa-5 border-radius--10px box-border"
  >
    <div class="d-flex align-top justify-space-between mb-1">
      <div class="d-flex align-center mt-n4">
        <div class="stake-icon mr-2">
          <img
            src="@/dapps/stakewise/assets/icon-stakewise-green.svg"
            alt="Stakewise"
          />
        </div>
        <div class="textLight--text">
          <span class="textMedium--text">Staking</span> - sETH2
        </div>
      </div>
      <div class="text-right">
        <div class="font-weight-bold mew-heading-3 mb-1">
          {{ formattedBalance }}
        </div>
        <div v-if="ethvmSupport" class="textLight--text">
          {{ sethBalanceFiat }}
        </div>
      </div>
    </div>

    <!-- ======================================================================================= -->
    <!-- Pending -->
    <!-- ======================================================================================= -->
    <div v-if="isEthNetwork">
      <div
        v-for="tx in stakewiseTxs.ETH"
        :key="tx.hash"
        class="d-flex justify-space-between flex-wrap mt-4"
      >
        <div class="py-1">
          <v-progress-circular
            indeterminate
            color="greenPrimary"
            :width="2"
            :size="20"
            class="mr-1"
          />
          {{ tx.amount }} {{ currencyName }} Pending
        </div>
        <div
          class="greenPrimary--text font-weight-medium d-flex align-center cursor--pointer py-1"
          @click="checkHash(tx.hash)"
        >
          View on {{ ethvmSupport ? 'EthVM' : 'EtherScan' }}
          <v-icon color="greenPrimary" small class="ml-1"
            >mdi-open-in-new</v-icon
          >
        </div>
      </div>
    </div>
    <div v-else>
      <div
        v-for="tx in stakewiseTxs.GOERLI"
        :key="tx.hash"
        class="d-flex justify-space-between mt-4"
      >
        <div>
          <v-progress-circular
            indeterminate
            color="greenPrimary"
            :width="2"
            :size="20"
            class="mr-1"
          />
          {{ tx.amount }} {{ currencyName }} Pending
        </div>
        <div
          class="greenPrimary--text font-weight-medium d-flex align-center cursor--pointer"
          @click="checkHash(tx.hash)"
        >
          View on {{ ethvmSupport ? 'EthVM' : 'EtherScan' }}
          <v-icon color="greenPrimary" small class="ml-1"
            >mdi-open-in-new</v-icon
          >
        </div>
      </div>
    </div>

    <!-- ======================================================================================= -->
    <!-- Active for Stake currencyName -->
    <!-- ======================================================================================= -->
    <div
      v-if="hasStaked"
      class="d-flex align-center justify-space-between mt-4 flex-wrap-reverse"
    >
      <mew-button
        v-if="isEthNetwork"
        :title="`Redeem to ${currencyName}`"
        btn-style="transparent"
        btn-size="small"
        class="py-1"
        :disabled="enoughToCoverRedeem"
        @click.native="executeSwap"
      />
    </div>

    <!-- ======================================================================================= -->
    <!-- have rewards but not enough to cover tx fee -->
    <!-- ======================================================================================= -->
    <div v-if="enoughToCoverRedeem" class="mt-4 greyPrimary--text">
      You do not have enough ETH to cover transaction fee.
      <a
        rel="noopener noreferrer"
        @click="
          () => {
            openBuySell('StakewiseStaking');
          }
        "
      >
        Buy more ETH</a
      >
    </div>
  </div>
</template>

<script setup>
import {
  defineProps,
  ref,
  computed,
  defineEmits,
  watch,
  onMounted,
  onBeforeUnmount,
  nextTick
} from 'vue';
import { isEmpty } from 'lodash';
import { fromWei } from 'web3-utils';
import BigNumber from 'bignumber.js';

import {
  SETH2_GOERLI_CONTRACT,
  SETH2_MAINNET_CONTRACT
} from '@/dapps/stakewise/handlers/configs.js';
import sEthAbi from '@/dapps/stakewise/handlers/abi/stakedEthToken.js';
import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
import { useBuySell } from '@/core/composables/buyMore';
import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { useExternalStore } from '@/core/store/external';
import { useRoute } from 'vue-router/composables';
import { useStakewiseStore } from '../store';
import { storeToRefs } from 'pinia';

// emits
const emit = defineEmits(['scroll', 'redeem-to-eth', 'set-max']);
// injections
const { openBuySell } = useBuySell();
const { web3, address, balance } = useWalletStore();
const { network, isEthNetwork, getFiatValue } = useGlobalStore();
const {
  rethBalance,
  sethBalance,
  removePendingTxs,
  removePendingTxsGoerli,
  setStakeBalance
} = useStakewiseStore();
const { fiatValue } = useExternalStore();
const route = useRoute();

const { stakewiseTxs } = storeToRefs(useStakewiseStore());

// props
const props = defineProps({
  txFee: {
    type: String,
    default: ''
  },
  hasEnoughBalance: {
    type: Boolean,
    default: false
  }
});

// data
const intervals = ref({});

// computed
const currencyName = computed(() => {
  return network.type.currencyName;
});
const ethvmSupport = computed(() => {
  return network.type.isEthVMSupported.supported;
});
const enoughToCoverRedeem = computed(() => {
  if (!hasStaked.value && !hasPending.value) {
    return false;
  }
  if (!props.hasEnoughBalance) {
    return true;
  }
  if (!BigNumber(rethBalance).gt(0) || !BigNumber(sethBalance).gt(0)) {
    return false;
  }
  if (BigNumber(balance).gt(props.txFee)) {
    return false;
  }
  return true;
});
const linkUrl = computed(() => {
  return network.type.blockExplorerTX;
});
const hasPending = computed(() => {
  const txList = isEthNetwork ? stakewiseTxs.ETH : stakewiseTxs.GOERLI;
  return txList.length > 0;
});
const formattedBalance = computed(() => {
  return formatFloatingPointValue(sethBalance).value;
});
const sethBalanceFiat = computed(() => {
  return getFiatValue(BigNumber(sethBalance).times(fiatValue).toString());
});
const seth2Contract = computed(() => {
  return isEthNetwork ? SETH2_MAINNET_CONTRACT : SETH2_GOERLI_CONTRACT;
});
const hasStaked = computed(() => {
  if (ethvmSupport.value) {
    return BigNumber(sethBalance).gt(0);
  }
  return BigNumber(sethBalance).gt(0);
});

// watch
watch(
  () => stakewiseTxs,
  newVal => {
    const txList = isEthNetwork ? newVal.ETH : newVal.GOERLI;
    if (txList.length > 0) {
      txList.forEach(item => {
        fetcher(item.hash);
      });
    }
  },
  { deep: true }
);
watch(
  () => route.from.query.module,
  val => {
    if (val === 'stake') {
      nextTick(() => {
        emit('scroll');
        emit('set-max');
      });
    }
  },
  { deep: true, immediate: true }
);

onMounted(() => {
  const txList = isEthNetwork ? stakewiseTxs.ETH : stakewiseTxs.GOERLI;
  if (txList.length > 0) {
    txList.forEach(item => {
      fetcher(item.hash);
    });
  }
});
onBeforeUnmount(() => {
  // clear intervals that may have been setup
  if (isEmpty(intervals.value)) {
    Object.values(intervals.value).forEach(item => {
      clearInterval(item);
    });
  }
});

// methods

const executeSwap = () => {
  emit('redeem-to-eth', 'seth', sethBalance);
};
const fetchBalance = () => {
  const contract = new web3.eth.Contract(sEthAbi, seth2Contract);
  contract.methods
    .balanceOf(address)
    .call()
    .then(res => setStakeBalance(fromWei(res)));
};
const checkHash = hash => {
  // eslint-disable-next-line
  window.open(linkUrl.replace('[[txHash]]', hash), '_blank');
};
const fetcher = hash => {
  intervals.value[hash] = setInterval(() => {
    web3.eth.getTransactionReceipt(hash).then(res => {
      if (res) {
        clearInterval(intervals.value[hash]);
        isEthNetwork ? removePendingTxs(hash) : removePendingTxsGoerli(hash);
        fetchBalance();
      }
    });
  }, 10000);
};
</script>

<style lang="scss" scoped>
.box-border {
  border: 1px solid var(--v-greyMedium-base);
}

.stake-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--v-borderInput-base) !important;
  border-radius: 50% !important;
  width: 32px;
  height: 32px;
  background-color: var(--v-alwaysWhite-base);

  img {
    height: 28px;
  }
}
</style>
