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
        <v-col class="d-flex align-center justify-end">
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
            <div class="font-weight-bold">Remove?</div>
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

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import BigNumber from 'bignumber.js';
import { formatIntegerToString } from '@/core/helpers/numberFormatHelper';
import { fromWei } from 'web3-utils';
import { ETH_BLOCKS_ROUTE } from '../configsRoutes';
import { some, isEmpty } from 'lodash';
import BlockQuickViewPopup from './BlockQuickViewPopup';
export default {
  name: 'BlockResultComponent',
  components: {
    BlockQuickViewPopup
  },
  props: {
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
  },
  data() {
    return {
      showRemove: false,
      showBlock: false
    };
  },
  computed: {
    ...mapState('wallet', ['address']),
    ...mapState('ethBlocksTxs', ['cart']),
    ...mapGetters('external', ['fiatValue']),
    ...mapGetters('global', ['network', 'isTestNetwork', 'getFiatValue']),
    isReady() {
      return !isEmpty(this.blockHandler) && !this.isLoading;
    },
    img() {
      return this.isReady ? this.blockHandler.img : '';
    },
    blockNumber() {
      return this.isReady
        ? formatIntegerToString(this.blockHandler.blockNumber)
        : '0';
    },
    convertedPrice() {
      return this.isReady ? fromWei(this.blockHandler.mintPrice) : 0;
    },
    mintPrice() {
      return this.isReady
        ? `${BigNumber(this.convertedPrice).toString()} ${
            this.network.type.currencyName
          }`
        : '';
    },
    mintFiatPrice() {
      const val = BigNumber(this.convertedPrice)
        .times(this.fiatValue)
        .toString();
      return this.isReady ? this.getFiatValue(val) : '';
    },
    isOwned() {
      return this.isReady ? this.blockHandler.owner === this.address : false;
    },
    isUnavailable() {
      return this.isReady ? this.blockHandler.hasOwner : false;
    },
    blockStatusStyle() {
      if (this.isOwned) {
        return 'bluePrimary--text';
      } else if (!this.showAdd && this.isUnavailable) {
        return 'redPrimary--text';
      } else if (this.isUnavailable) {
        return 'orangePrimary--text';
      }
      return '';
    },
    blockStatusText() {
      return this.isOwned
        ? 'You own this'
        : this.isUnavailable
        ? 'Unavailable'
        : '';
    },
    isAvailable() {
      return this.isOwned || !this.isUnavailable;
    },
    addText() {
      return this.isAdded && this.isAvailable
        ? 'Added to batch'
        : 'Add to batch';
    },
    mdiIcon() {
      return this.isAdded && this.isAvailable ? 'mdi-check' : 'mdi-plus';
    },
    isAdded() {
      const cart = this.isTestNetwork ? this.cart.RIN : this.cart.ETH;
      if (this.isReady) {
        const found = some(cart, block => {
          return block === this.blockHandler.blockNumber.toString();
        });
        return found;
      }
      return false;
    }
  },
  methods: {
    ...mapActions('ethBlocksTxs', [
      'addBlockToCart',
      'addTestBlockToCart',
      'removeBlockFromCart',
      'removeTestBlockFromCart'
    ]),
    showPanel() {
      this.showRemove = true;
    },
    hideRemove() {
      this.showRemove = false;
    },
    removeBlock() {
      const block = this.blockHandler.blockNumber.toString();
      this.removeMe(block);
      this.isTestNetwork
        ? this.removeTestBlockFromCart(block)
        : this.removeBlockFromCart(block);
    },
    addToCart() {
      const block = this.blockHandler.blockNumber.toString();
      if (this.isAvailable && !this.isAdded) {
        this.isTestNetwork
          ? this.addTestBlockToCart(block)
          : this.addBlockToCart(block);
      }
    },
    toggleAddRemoveBlock() {
      if (this.isAvailable && this.isAdded) {
        this.removeBlock();
      } else {
        this.addToCart();
      }
    },
    navigateToBlockInfo() {
      this.$router.push({
        name: ETH_BLOCKS_ROUTE.BLOCK.NAME,
        params: { blockRef: `${this.blockHandler.blockNumber}` }
      });
    },
    showBlockQuickView() {
      this.showBlock = true;
    },
    hideBlockQuickView() {
      this.showBlock = false;
    }
  }
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
  background-color: #fff;
}
.block-container {
  position: relative;
}
</style>
