<template>
  <div
    class="dapp--eth-blocks--block-result-component"
    :class="hasBorder ? 'container-border' : ''"
  >
    <div class="py-5 d-flex align-center justify-space-between">
      <v-row v-if="isLoading" dense>
        <v-col class="d-flex">
          <v-skeleton-loader
            width="48px"
            max-height="48px"
            type="image"
            class="mr-6"
          />
          <v-skeleton-loader
            width="100px"
            max-height="48px"
            type="text"
            class="mt-5"
          />
        </v-col>
        <v-col class="d-flex justify-end">
          <v-skeleton-loader
            width="100px"
            max-height="48px"
            type="text"
            class="mt-5"
          />
          <v-skeleton-loader
            v-if="showAdd"
            width="100px"
            max-height="48px"
            type="text"
            class="ml-12 mt-5"
          />
        </v-col>
      </v-row>
      <v-row v-else dense class="block-container">
        <v-col class="d-flex">
          <img :src="img" width="48" height="48" class="mr-6" />
          <div>
            <div
              :class="[
                !showAdd && isUnavailable ? 'redPrimary--text' : '',
                'mew-heading-4 font-weight-bold'
              ]"
            >
              {{ blockNumber }}
            </div>
            <div :class="[showAdd ? '' : 'd-flex']">
              <div
                v-if="!showAdd"
                :class="[
                  isUnavailable ? 'redPrimary--text' : 'textLight--text',
                  'cursor--pointer text-decoration--underline mr-2'
                ]"
                @click="showPanel"
              >
                Remove
              </div>
              <div
                :class="[
                  !showAdd && isUnavailable
                    ? 'redPrimary--text'
                    : 'textLight--text',
                  'cursor--pointer text-decoration--underline'
                ]"
                @click="showBlockQuickView"
              >
                View Block
              </div>
            </div>
          </div>
        </v-col>
        <v-col
          style="max-width: 270px"
          class="d-flex align-center justify-space-between"
        >
          <div v-if="isAvailable" class="pr-md-3">
            <div class="mew-heading-4">{{ mintPrice }}</div>
            <div class="mew-heading-4 textLight--text">
              {{ mintFiatPrice }}
            </div>
          </div>
          <div v-else :class="[blockStatusStyle, 'mew-heading-4']">
            {{ blockStatusText }}
          </div>
          <div
            v-if="showAdd"
            :class="[
              isAvailable
                ? 'primary--text cursor--pointer'
                : 'disabledPrimary--text pointer-event--none',
              'd-flex align-center ml-lg-12 ml-2'
            ]"
            @click="toggleAddRemoveBlock"
          >
            <v-icon
              x-small
              :class="[
                isAvailable
                  ? isAdded
                    ? 'white primary--text pointer-event--none'
                    : 'primary white--text'
                  : 'disabledPrimary white--text',
                'mr-3 d-none d-md-flex d-lg-flex d-xl-flex custom-icon-container'
              ]"
            >
              {{ mdiIcon }}
            </v-icon>
            <v-icon
              medium
              :class="[
                isAvailable
                  ? isAdded
                    ? 'white primary--text pointer-event--none'
                    : 'primary white--text'
                  : 'disabledPrimary white--text',
                'pa-2 d-flex d-md-none d-lg-none d-xl-none custom-icon-container'
              ]"
            >
              {{ mdiIcon }}
            </v-icon>
            <div class="d-none d-md-flex d-lg-flex d-xl-flex">
              {{ addText }}
            </div>
          </div>
        </v-col>
        <v-slide-x-transition v-if="!isLoading">
          <div
            v-if="showRemove"
            class="d-flex align-center justify-space-between remove-container"
          >
            <v-spacer />
            <div class="d-flex">
              <mew-button
                title="Keep"
                btn-style="transparent"
                btn-size="large"
                color-theme="error"
                class="mr-2"
                @click.native="hideRemove"
              />
              <mew-button
                title="Remove"
                btn-style="background"
                btn-size="large"
                color-theme="error"
                @click.native="removeBlock"
              />
            </div>
          </div>
        </v-slide-x-transition>
      </v-row>
    </div>

    <block-quick-view-popup
      :show-block="showBlock"
      :block-handler="blockHandler"
      :is-loading="isLoading"
      @navigate-to-block-info="navigateToBlockInfo"
      @hide-block-quick-view="hideBlockQuickView"
    />
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref, computed } from 'vue';
import BigNumber from 'bignumber.js';
import { fromWei } from 'web3-utils';
import { some, isEmpty } from 'lodash';

import { formatIntegerToString } from '@/core/helpers/numberFormatHelper';
import { ETH_BLOCKS_ROUTE } from '../configsRoutes';
import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { useExternalStore } from '@/core/store/external';
import { useRouter } from 'vue-router/composables';
import { useEthBlocksTxsStore } from '../store';

const BlockQuickViewPopup = defineAsyncComponent(() =>
  import('./BlockQuickViewPopup')
);

// injections/use
const { network, getFiatValue } = useGlobalStore();
const { address } = useWalletStore();
const { fiatValue } = useExternalStore();
const { addBlockToCart, removeBlockFromCart } = useEthBlocksTxsStore();
const router = useRouter();

// props
const props = defineProps({
  blockHandler: {
    type: Object,
    default: () => {}
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  showAdd: {
    type: Boolean,
    default: true
  },
  hasBorder: {
    type: Boolean,
    default: true
  },
  removeMe: {
    type: Function,
    default: () => {}
  }
});

// data
const showRemove = ref(false);
const showBlock = ref(false);

// computed
const isReady = computed(() => {
  return !isEmpty(props.blockHandler) && !props.isLoading;
});
const img = computed(() => {
  return isReady.value ? props.blockHandler.img : '';
});
const blockNumber = computed(() => {
  return isReady.value
    ? formatIntegerToString(props.blockHandler.blockNumber)
    : '0';
});
const convertedPrice = computed(() => {
  return isReady.value ? fromWei(props.blockHandler.mintPrice) : 0;
});
const mintPrice = computed(() => {
  return isReady.value
    ? `${BigNumber(convertedPrice).toString()} ${
        network.value.type.currencyName
      }`
    : '';
});
const mintFiatPrice = computed(() => {
  const val = BigNumber(convertedPrice).times(fiatValue.value).toString();
  return isReady.value ? getFiatValue(val) : '';
});
const isOwned = computed(() => {
  return isReady.value ? props.blockHandler.owner === address.value : false;
});
const isUnavailable = computed(() => {
  return isReady.value ? props.blockHandler.hasOwner : false;
});
const blockStatusStyle = computed(() => {
  if (isOwned.value) {
    return 'bluePrimary--text';
  } else if (!props.showAdd && isUnavailable.value) {
    return 'redPrimary--text';
  } else if (isUnavailable.value) {
    return 'orangePrimary--text';
  }
  return '';
});
const blockStatusText = computed(() => {
  return isOwned.value
    ? 'You own this'
    : isUnavailable.value
    ? 'Unavailable'
    : '';
});
const isAvailable = computed(() => {
  return isOwned.value || !isUnavailable.value;
});
const addText = computed(() => {
  return isAdded.value && isAvailable.value ? 'Added to batch' : 'Add to batch';
});
const mdiIcon = computed(() => {
  return isAdded.value && isAvailable.value ? 'mdi-check' : 'mdi-plus';
});
const isAdded = computed(() => {
  const cart = cart.ETH;
  if (isReady.value) {
    const found = some(cart, block => {
      return block === props.blockHandler.blockNumber.toString();
    });
    return found;
  }
  return false;
});

const showPanel = () => {
  showRemove.value = true;
};
const hideRemove = () => {
  showRemove.value = false;
};
const removeBlock = () => {
  const block = props.blockHandler.blockNumber.toString();
  props.removeMe(block);
  removeBlockFromCart(block);
};
const addToCart = () => {
  const block = props.blockHandler.blockNumber.toString();
  if (isAvailable.value && !isAdded.value) {
    addBlockToCart(block);
  }
};
const toggleAddRemoveBlock = () => {
  if (isAvailable.value && isAdded) {
    removeBlock();
  } else {
    addToCart();
  }
};
const navigateToBlockInfo = () => {
  router.push({
    name: ETH_BLOCKS_ROUTE.BLOCK.NAME,
    params: { blockRef: `${props.blockHandler.blockNumber}` }
  });
};
const showBlockQuickView = () => {
  showBlock.value = true;
};
const hideBlockQuickView = () => {
  showBlock.value = false;
};
</script>

<style lang="scss" scoped>
.container-border {
  border-bottom: 1px solid var(--v-greyMedium-base);
}

.custom-icon-container {
  border-radius: 50%;
  padding: 2px;
}

.remove-container {
  position: absolute;
  width: 100%;
  height: 100%;
}
.block-container {
  position: relative;
}
</style>
