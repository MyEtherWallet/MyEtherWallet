<template>
  <div class="mew-component--side-info-network">
    <white-sheet :sideinfo="!mobile" class="py-5">
      <div class="textDark--text px-5 px-lg-7 mew-heading-2 mb-2">
        {{ $t('common.network') }}
      </div>
      <div class="px-3">
        <v-btn
          v-if="show"
          depressed
          color="buttonGrayLight"
          class="title-button"
          width="100%"
          height="70px"
          @click.native="openNetworkOverlay"
        >
          <div
            class="d-flex align-center justify-space-between text-transform--none text-decoration--none"
            style="width: 100%"
          >
            <div class="text-left">
              <div class="mew-heading-3 mb-2">{{ fullName }}</div>
              <div class="textMedium--text">Last Block: {{ lastBlock }}</div>
            </div>
            <div
              class="custom-token-container d-flex align-center justify-center"
            >
              <img width="40px" :src="icon" />
            </div>
          </div>
        </v-btn>
      </div>
    </white-sheet>
  </div>
</template>

<script>
import { ROUTES_HOME, ROUTES_WALLET } from '@/core/configs/configRoutes';

export default {
  beforeRouteLeave(to, from, next) {
    if (to.name == ROUTES_HOME.ACCESS_WALLET.NAME) {
      next({ name: ROUTES_WALLET.DASHBOARD.NAME });
    } else {
      next();
    }
  }
};
</script>

<script setup>
import { computed } from 'vue';

import { formatIntegerToString } from '@/core/helpers/numberFormatHelper';

import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { useExternalStore } from '@/core/store/external';

import WALLET_TYPES from '../access-wallet/common/walletTypes';

import { EventBus } from '@/core/plugins/eventBus';

// props

defineProps({
  mobile: {
    type: Boolean,
    default: false
  }
});

// injections/use
const { network } = useGlobalStore();
const { selectedEIP6963Provider } = useExternalStore();
const { blockNumber, identifier } = useWalletStore();

// computed
const fullName = computed(() => {
  return network.value.type.name_long;
});

const lastBlock = computed(() => {
  return formatIntegerToString(blockNumber.value);
});
const icon = computed(() => {
  return network.value.type.icon;
});
const show = computed(() => {
  let switchNetworkWeb3Supported = false;
  if (selectedEIP6963Provider.value) {
    const isMetaMask =
      selectedEIP6963Provider.value.isMetaMask &&
      !selectedEIP6963Provider.value.hasOwnProperty('isTrust') &&
      !selectedEIP6963Provider.value.hasOwnProperty('isMEWwallet');
    const isMEWwallet =
      selectedEIP6963Provider.value.isMetaMask &&
      selectedEIP6963Provider.value.isMEWwallet &&
      selectedEIP6963Provider.value.isTrust;
    switchNetworkWeb3Supported = isMetaMask || isMEWwallet;
  }

  return (
    identifier.value !== WALLET_TYPES.WEB3_WALLET || switchNetworkWeb3Supported
  );
});

// methods
const openNetworkOverlay = () => {
  EventBus.$emit('openNetwork');
};
</script>

<style lang="scss" scoped>
.custom-token-container {
  border: 2px solid #edf0f5;
  border-radius: 12px;
  width: 52px;
  height: 52px;
  background-color: white;
}
</style>

<style lang="scss">
.mew-component--side-info-network {
  .title-button {
    padding: 8px 16px;
    width: 294px;
    height: 68px;
    border-radius: 8px;

    &:hover {
      .custom-token-container {
        background-color: white;
      }
    }
  }
}
</style>
