<template>
  <div
    v-b-popover.hover.top="tooltipMsg"
    @click="select(name)"
    @mouseover="isHovered = true"
    @mouseout="isHovered = false"
  >
    <div
      :class="[
        selected ? 'selected' : '',
        'wallet-option-container',
        link !== '' ? 'has-link' : ''
      ]"
    >
      <div class="img-title-container">
        <img :src="hoverIcon ? hoverIcon : regularIcon" class="icon" alt />
        <div class="title-link-container">
          <span>{{ text }}</span>
          <a
            v-show="name === xwalletType"
            class="no-link"
            href="https://xwallet.pundix.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ $t('accessWallet.get-it-now') }} >
          </a>
          <a
            v-show="link !== '' && name !== xwalletType"
            :href="link"
            target="_blank"
            rel="noopener noreferrer"
            @click.stop
          >
            {{ $t('accessWallet.hardware.modal.button-buy') }} >
          </a>
        </div>
      </div>
      <i
        v-show="selected"
        class="fa fa-check-circle good-button"
        aria-hidden="true"
      />
    </div>
  </div>
</template>
<script>
import { XWALLET as XWALLET_TYPE } from '@/wallets/bip44/walletTypes';
export default {
  props: {
    selected: {
      type: Boolean,
      default: false
    },
    hoverIcon: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    tooltipMsg: {
      type: String,
      default: ''
    },
    link: {
      type: String,
      default: ''
    },
    regularIcon: {
      type: String,
      default: ''
    },
    xwalletType: {
      type: String,
      default: XWALLET_TYPE
    }
  },
  data() {
    return {
      isHovered: false
    };
  },
  methods: {
    select(name) {
      this.$emit('updateSelected', name);
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'WalletOption.scss';

.good-button {
  font-size: 30px !important;
  font-weight: bold !important;
}
</style>
