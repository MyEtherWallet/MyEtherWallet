<template>
  <div class="modal-container">
    <b-modal
      ref="manageSubscriptionsModal"
      :title="$t('dappsAmbrpay.my-subscriptions')"
      centered
      hide-footer
      static
      lazy
    >
      <div class="modal-contents">
        <div v-show="subscriptions.length === 0" class="no-sub-container">
          <p class="mx-auto pl-3">
            {{ $t('dappsAmbrpay.manage-subscriptions.no-active') }}
          </p>
        </div>
        <div
          v-for="sub in subscriptions"
          v-show="subscriptions.length > 0"
          :key="sub.key"
          class="subscription-container"
        >
          <div class="info-container">
            <div class="header-txt">
              <span>
                <i class="check-icon fa fa-check" aria-hidden="true" /><span
                  class="active-txt"
                >
                  {{ $t('dappsAmbrpay.manage-subscriptions.active') }}
                </span>
                <span class="next-pay-txt"
                  >({{ $t('dappsAmbrpay.manage-subscriptions.next-payment') }}
                  {{ formatDate(sub.cycleEnd) }})</span
                >
              </span>
              <span>
                <i
                  v-show="sub.moreInfo"
                  class="fa fa-angle-up"
                  aria-hidden="true"
                  @click="toggleMoreInfo(sub)"
                />
                <i
                  v-show="!sub.moreInfo"
                  class="fa fa-angle-down"
                  aria-hidden="true"
                  @click="toggleMoreInfo(sub)"
                />
              </span>
            </div>
            <div class="info-row">
              <span class="info-title">{{
                $t('dappsAmbrpay.manage-subscriptions.receiver-wallet')
              }}</span>
              <a
                :title="sub.receiverWallet"
                :href="'https://etherscan.io/address/' + sub.receiverWallet"
                rel="noopener noreferrer"
                class="address-txt prevent-user-select"
              >
                {{ sub.receiverWallet }}
              </a>
            </div>
            <div class="info-row">
              <span class="info-title">{{ $t('sendTx.amount') }}</span
              ><span class="info-txt"
                >{{ sub.price }} {{ $t('common.currency.eth') }}</span
              >
            </div>
            <div v-show="sub.moreInfo" class="more-info-container">
              <div v-show="sub.subscriptionInterval" class="info-row">
                <span class="info-title">{{
                  $t('dappsAmbrpay.manage-subscriptions.current-cycle')
                }}</span
                ><span class="info-txt"
                  >{{ formatDate(sub.cycleStart) }}-{{
                    formatDate(sub.cycleEnd)
                  }}</span
                >
              </div>
              <div v-show="sub.subscriptionInterval" class="info-row">
                <span class="info-title">{{ $t('dappsAmbrpay.interval') }}</span
                ><span class="info-txt"
                  >{{ $t('dappsAmbrpay.in-every') }}
                  {{ sub.subscriptionInterval }}
                  {{ $t('dappsAmbrpay.days-lowercase') }}</span
                >
              </div>
              <div v-show="sub.subscriptionPlan" class="info-row">
                <span class="info-title">{{
                  $t('dappsAmbrpay.manage-subscriptions.sub-plan')
                }}</span
                ><span class="info-txt">{{ sub.subscriptionPlan }}</span>
              </div>
              <div v-show="sub.subscriptionCurrencyCode" class="info-row">
                <span class="info-title">{{
                  $t('dappsAmbrpay.manage-subscriptions.sub-currency')
                }}</span
                ><span class="info-txt">{{
                  sub.subscriptionCurrencyCode
                }}</span>
              </div>
              <div v-show="sub.subscriptionStatus" class="info-row">
                <span class="info-title">{{
                  $t('dappsAmbrpay.manage-subscriptions.sub-status')
                }}</span
                ><span class="info-txt">{{ sub.subscriptionStatus }}</span>
              </div>
            </div>
          </div>
          <hr v-show="sub.moreInfo" />
          <div v-show="sub.moreInfo" class="btn-container mb-2">
            <button
              @click="unsubscribe(sub.storagePos, sub.smartContractAddress)"
            >
              {{ $t('dappsAmbrpay.manage-subscriptions.unsubscribe') }}
            </button>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  props: {
    subscriptions: {
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  methods: {
    formatDate(param) {
      if (!param) return '';
      return (
        param.substr(3, 2) + '/' + param.substr(0, 2) + '/' + param.substr(6, 4)
      );
    },
    toggleMoreInfo(sub) {
      sub.moreInfo = !sub.moreInfo;
    },
    unsubscribe(pos, addr) {
      this.$emit('unsubscribeSub', { pos: pos, addr: addr });

      this.$nextTick(() => {
        this.$refs['manageSubscriptionsModal'].hide();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ManageSubscriptionsModal.scss';
@import '../../AmbrpayGlobal.scss';
</style>
