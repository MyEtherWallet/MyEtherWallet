<template>
  <div class="modal-container">
    <b-modal
      ref="switchInterest"
      :title="$t('dappsAave.switch-interest')"
      centered
      hide-footer
      static
      lazy
    >
      <div v-if="token.user" class="modal-contents">
        <div class="switch-container">
          <div class="current-container">
            <p class="title">{{ $t('dappsAave.current-interest') }}</p>
            <p
              :class="[
                'percent-title',
                token.user.borrowRateMode === 'Stable'
                  ? 'stable-percent'
                  : 'variable-percent'
              ]"
            >
              {{ convertToFixed(token.user.borrowRate * 100) }}%
            </p>
            <p
              :class="[
                'rate-title',
                token.user.borrowRateMode === 'Stable'
                  ? 'stable-percent'
                  : 'variable-percent'
              ]"
            >
              {{ token.user.borrowRateMode }}
            </p>
          </div>
          <div class="icon-container">
            <i class="fa fa-long-arrow-right" aria-hidden="true" />
          </div>
          <div class="next-container">
            <p class="title">{{ $t('dappsAave.next-interest') }}</p>
            <p
              :class="[
                'percent-title',
                token.user.borrowRateMode === 'Stable'
                  ? 'variable-percent'
                  : 'stable-percent'
              ]"
            >
              {{
                token.user.borrowRateMode === 'Stable'
                  ? convertToFixed(token.variableBorrowRate * 100)
                  : convertToFixed(token.stableBorrowRate * 100)
              }}%
            </p>
            <p
              :class="[
                'rate-title',
                token.user.borrowRateMode === 'Stable'
                  ? 'variable-percent'
                  : 'stable-percent'
              ]"
            >
              {{
                token.user.borrowRateMode === 'Stable'
                  ? $t('dappsAave.variable')
                  : $t('dappsAave.stable')
              }}
            </p>
          </div>
        </div>
        <hr />
        <div class="currency-container">
          <span class="currency-title">
            {{ $t('dappsAave.currency') }}
          </span>
          <span class="currency-type">
            <img
              v-if="!getIcon(token.symbol)"
              class="token-icon"
              :src="iconFetcher(token.symbol)"
            />
            <span
              v-if="getIcon(token.symbol)"
              :class="[
                'cc',
                getIcon(token.symbol),
                'cc-icon',
                'currency-symbol',
                'token-icon'
              ]"
            ></span>
            {{ token.symbol }}
          </span>
        </div>
        <hr />
        <div class="btn-container mt-4 mb-4">
          <button @click="confirmSwitch()">
            {{ $t('dappsAave.confirm-switch') }}
          </button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { hasIcon } from '@/partners';
import '@/assets/images/currency/coins/asFont/cryptocoins.css';
import '@/assets/images/currency/coins/asFont/cryptocoins-colors.css';
import BigNumber from 'bignumber.js';

export default {
  props: {
    token: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  watch: {
    token(newVal) {
      this.token = newVal;
    }
  },
  methods: {
    iconFetcher(currency) {
      let icon;
      try {
        // eslint-disable-next-line
        icon = require(`@/assets/images/currency/coins/AllImages/${currency.toUpperCase()}.svg`);
      } catch (e) {
        // eslint-disable-next-line
        return require(`@/assets/images/icons/web-solution.svg`);
      }
      return icon;
    },
    confirmSwitch() {
      this.$emit('emitTakeAction', {
        symbol: this.token.symbol,
        type: 'SwitchRate',
        data: { reserve: this.token.id }
      });
    },
    getIcon(currency) {
      return hasIcon(currency);
    },
    convertToFixed(val) {
      if (!val) {
        return 0;
      }
      return new BigNumber(val).toFixed(2).toString();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SwitchInterestModal.scss';
</style>
