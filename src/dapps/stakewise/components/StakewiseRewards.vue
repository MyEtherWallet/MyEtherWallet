<template>
  <!-- ======================================================================================= -->
  <!-- Side Rewards -->
  <!-- ======================================================================================= -->
  <div
    class="mew-component--module-side-apr pa-5 border-radius--10px box-border"
  >
    <div class="d-flex align-top justify-space-between mb-1">
      <div class="d-flex align-center mt-n4">
        <div class="stake-icon mr-2">
          <img
            src="@/dapps/stakewise/assets/icon-stakewise-red.svg"
            alt="Stakewise"
          />
        </div>
        <div class="textLight--text">
          <span class="textMedium--text">Rewards</span> - rETH2
        </div>
      </div>
      <div class="text-right">
        <div class="font-weight-bold mew-heading-3 mb-1">
          {{ formattedBalance }}
        </div>
        <div v-if="ethvmSupport" class="textLight--text">
          {{ rethBalanceFiat }}
        </div>
      </div>
    </div>

    <!-- ======================================================================================= -->
    <!-- not earned any rewards yet user message -->
    <!-- ======================================================================================= -->
    <div v-if="hasStakedNoRewards" class="mt-4">
      You have not earned any rewards yet. Please wait 24 hours after staking to
      start earning rewards.
    </div>

    <!-- ======================================================================================= -->
    <!-- Active for Stake ETH -->
    <!-- ======================================================================================= -->
    <div
      v-if="hasBalance"
      class="d-flex align-center justify-space-between flex-wrap-reverse mt-4"
    >
      <mew-button
        v-if="isEthNetwork"
        title="Redeem to ETH"
        btn-style="transparent"
        btn-size="small"
        class="mew-body"
        :disabled="!hasBalance || enoughToCoverRedeem"
        @click.native="executeSwap"
      />
    </div>

    <!-- ======================================================================================= -->
    <!-- have rewards but not enough to cover tx fee -->
    <!-- ======================================================================================= -->
    <div v-if="enoughToCoverRedeem" class="mt-4 greyPrimary--text">
      You do not have enough ETH to cover transaction fee.
    </div>
  </div>
</template>

<script setup>
import { computed, watch, nextTick } from 'vue';
import BigNumber from 'bignumber.js';

import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { useExternalStore } from '@/core/store/external';
import { useRoute } from 'vue-router/composables';
import { useStakewiseStore } from '../store';

const emit = defineEmits(['scroll', 'set-max', 'redeem-to-eth']);

// injections/use
const { isEthNetwork, network, getFiatValue } = useGlobalStore();
const { balance } = useWalletStore();
const { fiatValue } = useExternalStore();
const { rethBalance, sethBalance } = useStakewiseStore();
const route = useRoute();

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

// computed
const hasStakedNoRewards = computed(() => {
  return (
    BigNumber(sethBalance.value).gt(0) && BigNumber(rethBalance.value).eq(0)
  );
});
const hasBalance = computed(() => {
  return BigNumber(rethBalance.value).gt(0);
});
const enoughToCoverRedeem = computed(() => {
  if (hasStakedNoRewards.value) {
    return false;
  }
  if (!hasBalance.value) {
    return false;
  }
  if (BigNumber(balance.value).gt(props.txFee)) {
    return false;
  }
  if (!props.hasEnoughBalance) {
    return true;
  }
  return true;
});
const ethvmSupport = computed(() => {
  return network.value.type.isEthVMSupported.supported;
});
const formattedBalance = computed(() => {
  return formatFloatingPointValue(rethBalance.value).value;
});
const rethBalanceFiat = computed(() => {
  return getFiatValue(
    BigNumber(rethBalance.value).times(fiatValue.value).toString()
  );
});

// watch
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

const executeSwap = () => {
  emit('redeem-to-eth', 'reth', rethBalance);
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
