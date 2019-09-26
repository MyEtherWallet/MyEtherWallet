<template>
  <div class="modal-container">
    <b-modal
      ref="manageSubscriptionsModal"
      title="My Subscriptions"
      centered
      hide-footer
      static
      lazy
    >
      <div class="modal-contents">
        <div
          v-for="sub in subscriptions"
          :key="sub.key"
          class="subscription-container"
        >
          <div class="info-container">
            <div class="header-txt">
              <span>
                <i class="check-icon fa fa-check" aria-hidden="true" /><span
                  class="active-txt"
                >
                  Active
                </span>
                <span class="next-pay-txt"
                  >(Next payment {{ formatDate(sub.cycleEnd) }})</span
                >
              </span>
              <span>
                <i
                  v-show="moreInfo"
                  class="fa fa-angle-up"
                  aria-hidden="true"
                  @click="toggleMoreInfo"
                />
                <i
                  v-show="!moreInfo"
                  class="fa fa-angle-down"
                  aria-hidden="true"
                  @click="toggleMoreInfo"
                />
              </span>
            </div>
            <div class="info-row">
              <span class="info-title">Receiver wallet</span>
              <span
                ref="receiverWallet"
                :title="sub.receiverWallet"
                class="address-txt prevent-user-select"
                @click="copyToClipboard(sub.receiverWallet)"
              >
                {{ sub.receiverWallet }}
              </span>
            </div>
            <div class="info-row">
              <span class="info-title">Amount</span
              ><span class="info-txt">{{ sub.price }} ETH</span>
            </div>
            <div v-show="moreInfo" class="more-info-container">
              <div v-show="sub.subscriptionInterval" class="info-row">
                <span class="info-title">Current cycle</span
                ><span class="info-txt"
                  >{{ formatDate(sub.cycleStart) }}-{{
                    formatDate(sub.cycleEnd)
                  }}</span
                >
              </div>
              <div v-show="sub.subscriptionInterval" class="info-row">
                <span class="info-title">Interval</span
                ><span class="info-txt"
                  >In every {{ sub.subscriptionInterval }} day(s)</span
                >
              </div>
              <div v-show="sub.subscriptionPlan" class="info-row">
                <span class="info-title">Subscription plan</span
                ><span class="info-txt">{{ sub.subscriptionPlan }}</span>
              </div>
              <div v-show="sub.subscriptionCurrencyCode" class="info-row">
                <span class="info-title">Subscription currency</span
                ><span class="info-txt">{{
                  sub.subscriptionCurrencyCode
                }}</span>
              </div>
              <div v-show="sub.subscriptionStatus" class="info-row">
                <span class="info-title">Subscription status</span
                ><span class="info-txt">{{ sub.subscriptionStatus }}</span>
              </div>
            </div>
          </div>
          <hr v-show="moreInfo" />
          <div v-show="moreInfo" class="btn-container mb-2">
            <button
              @click="unsubscribe(sub.storagePos, sub.smartContractAddress)"
            >
              Unsubscribe
            </button>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { Toast } from '@/helpers';

export default {
  props: {
    subscriptions: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      moreInfo: false
    };
  },
  methods: {
    formatDate(param) {
      return param.split('.').join('/');
    },
    toggleMoreInfo() {
      this.moreInfo = !this.moreInfo;
    },
    copyToClipboard(addr) {
      try {
        navigator.clipboard.writeText(addr);
        Toast.responseHandler('Copied', Toast.INFO);
      } catch (err) {
        Toast.responseHandler('Unable to copy', Toast.ERROR);
      }
    },
    unsubscribe(pos, addr) {
      this.$emit('unsubscribeSub', { pos: pos, addr: addr });
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ManageSubscriptionsModal.scss';
@import '../../AmbrpayGlobal.scss';
</style>
