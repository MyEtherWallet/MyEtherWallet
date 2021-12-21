<template>
  <div
    :class="[
      hasBorder ? 'container-border' : '',
      'py-5 d-flex align-center justify-space-between'
    ]"
  >
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
    <v-row v-else dense>
      <v-col class="d-flex">
        <img :src="img" width="48" height="48" class="mr-6" />
        <div>
          <div class="mew-heading-4 font-weight-bold">
            {{ blockNumber }}
          </div>
          <div>
            <div
              class="textLight--text cursor--pointer text-decoration--underline"
              @click="navigateToBlockInfo"
            >
              View Block
            </div>
            <div v-if="!showAdd"></div>
          </div>
        </div>
      </v-col>
      <v-col class="d-flex align-center justify-end">
        <div v-if="isAvailable">
          <div class="mew-heading-4">
            {{ mintPrice }}
          </div>
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
              : 'd-none d-large-flex d-xl-flex disabledPrimary--text pointer-event--none',
            'd-flex align-center ml-12'
          ]"
          @click="addToCart"
        >
          <v-icon
            x-small
            :class="[
              isAvailable
                ? isAdded
                  ? 'white primary--text pointer-event--none'
                  : 'primary white--text'
                : 'disabledPrimary white--text',
              'mr-3 custom-icon-container'
            ]"
          >
            {{ mdiIcon }}
          </v-icon>
          <div>
            {{ addText }}
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapState, mapGetters, mapActions } from 'vuex';
import BigNumber from 'bignumber.js';
import {
  formatFiatValue,
  formatIntegerToString
} from '@/core/helpers/numberFormatHelper';
import { fromWei } from 'web3-utils';
import { ETH_BLOCKS_ROUTE } from '../configsRoutes';
export default {
  name: 'BlockResultComponent',
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
    }
  },
  computed: {
    ...mapState('wallet', ['address']),
    ...mapState('ethBlocksTxs', ['cart']),
    ...mapGetters('external', ['fiatValue']),
    ...mapGetters('global', ['network']),
    isReady() {
      return !_.isEmpty(this.blockHandler) && !this.isLoading;
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
      return this.isReady ? `$ ${formatFiatValue(val).value}` : '';
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
      return !this.isOwned || !this.isUnavailable;
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
      if (this.isReady) {
        const found = this.cart.find(item => {
          return item === this.blockHandler.blockNumber;
        });
        return found;
      }
      return false;
    }
  },
  methods: {
    ...mapActions('ethBlocksTxs', ['addBlockToCart']),
    addToCart() {
      if (this.isAvailable && !this.isAdded) {
        this.addBlockToCart(this.blockHandler.blockNumber);
      }
    },
    navigateToBlockInfo() {
      this.$router.push({
        name: ETH_BLOCKS_ROUTE.BLOCK.NAME,
        params: { blockRef: `${this.blockHandler.blockNumber}` }
      });
    }
  }
};
</script>

<style lang="scss">
.container-border {
  border-bottom: 1px solid var(--v-greyMedium-base);
}

.custom-icon-container {
  padding: 2px;
  border-radius: 50%;
}
</style>
