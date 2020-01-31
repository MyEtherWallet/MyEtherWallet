<template>
  <div class="modal-container">
    <b-modal
      ref="confirmationModal"
      :title="
        isCollateralModal
          ? $t('dappsAave.usage-collateral')
          : $t('dappsAave.confirmation')
      "
      centered
      hide-footer
      static
      lazy
    >
      <div class="modal-contents">
        <div v-if="!isCollateralModal" class="header-container">
          <div class="left-container">
            <p class="title">
              {{
                activeDepositTab
                  ? $t('dappsAave.amount-to-deposit')
                  : $t('dappsAave.amount-to-borrow')
              }}
            </p>
            <p class="amount mt-2">
              {{ amount }} <span class="token-name"> {{ token.name }} </span>
            </p>
            <p class="usd-amount mt-2">${{ convertToUSD(amount) }}</p>
          </div>
          <div class="right-container">
            <img
              class="icon"
              src="~@/assets/images/currency/coins/AllImages/DAI.svg"
            />
          </div>
        </div>
        <div class="body-container">
          <div v-if="activeDepositTab" class="health-container">
            <div class="left-container">
              <p v-if="isCollateralModal">{{ $t('dappsAave.currency') }}</p>
              <p class="mt-4">
                {{ $t('dappsAave.current-health') }}
                <popover class="ml-1" popcontent="CHANGE THIS" />
              </p>
              <p class="mt-4">
                {{ $t('dappsAave.next-health') }}
                <popover class="ml-1" popcontent="CHANGE THIS" />
              </p>
            </div>
            <div class="right-container">
              <!-- placeholder -->
              <p v-if="isCollateralModal" class="currency-title">ETH</p>
              <p class="mt-4">{{ userSummary.healthFactor }}</p>
              <!-- placeholder -->
              <p class="mt-4">22323</p>
            </div>
          </div>
          <div v-if="!activeDepositTab" class="rate-container">
            <div class="left-container">
              <p>{{ $t('dappsAave.interest-apr') }}</p>
              <p class="mt-4">{{ $t('dappsAave.interest-rate-type') }}</p>
            </div>
            <div class="right-container">
              <p>{{ apr }}%</p>
              <p class="mt-4">{{ rateType }}</p>
            </div>
          </div>
          <hr class="mt-4 mb-4" />
          <div class="btn-container">
            <i18n
              v-if="!isCollateralModal"
              tag="button"
              path="dappsAave.confirm-to"
              @click="takeAction()"
            >
              <span slot="action">
                {{
                  activeDepositTab
                    ? $tc('dappsAave.deposit', 1)
                    : $t('dappsAave.borrow')
                }}
              </span>
            </i18n>
            <button v-if="isCollateralModal">
              {{ $t('dappsAave.confirm') }}
            </button>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import PopOver from '@/components/PopOver';
import BigNumber from 'bignumber.js';
import * as unit from 'ethjs-unit';

export default {
  components: {
    popover: PopOver
  },
  props: {
    userSummary: {
      type: Object,
      default: () => {
        return {};
      }
    },
    activeDepositTab: {
      type: Boolean,
      default: false
    },
    isCollateralModal: {
      type: Boolean,
      default: false
    },
    amount: {
      type: String,
      default: ''
    },
    token: {
      type: Object,
      default: () => {
        return {};
      }
    },
    apr: {
      type: String,
      default: ''
    },
    rateType: {
      type: String,
      default: ''
    }
  },
  methods: {
    takeAction() {
      const param = {
        address: this.token.address,
        amount: new BigNumber(unit.toWei(this.amount, 'ether')).toString()
      };

      if (!this.activeDepositTab) {
        param['rate'] = this.selectStable ? 0 : 1;
      }

      param['referral'] = 0; // do  i need to put referral code? is 0 mean no referral?

      this.$emit('emitTakeAction', param);
    },
    convertToUSD(balance) {
      let usdBalance = 0;

      if (balance) {
        usdBalance = new BigNumber(
          new BigNumber(balance).times(new BigNumber(this.ethPrice))
        ).toFixed(2);
      }
      return usdBalance;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ConfirmationModal.scss';
</style>
