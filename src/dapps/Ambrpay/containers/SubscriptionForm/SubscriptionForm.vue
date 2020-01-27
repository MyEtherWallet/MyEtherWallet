<template>
  <div class="subscription-container">
    <div class="subscription-content">
      <div class="subscription-form-container">
        <b-container>
          <b-row class="address-block">
            <dropdown-address-selector
              :clear-address="clearAddress"
              :title="$t('sendTx.to-addr')"
              @toAddress="getToAddress($event)"
            />
          </b-row>
          <b-row>
            <b-col class="mt-3" cols="12" md="5">
              <span class="label-text">{{ $t('sendTx.type') }}</span>
              <div class="fake-input">
                <p>
                  <img
                    class="currency-icon"
                    src="@/assets/images/currency/eth.svg"
                  />
                  <span class="token-txt">{{ $t('common.currency.eth') }}</span
                  >-{{ $t('common.currency.ethereum') }}
                </p>
              </div>
            </b-col>
            <b-col class="amount-container mt-3" cols="12" md="7">
              <div class="amount-text">
                <span class="label-text">{{ $t('sendTx.amount') }}</span>
                <span
                  class="action-text entire-balance"
                  @click="sendEntireBalance"
                  >{{ $t('sendTx.button-entire') }}</span
                >
              </div>
              <input
                v-model="sendAmount"
                type="number"
                placeholder="0.01"
                min="0.01"
              />
              <p class="sub-text">{{ $t('dappsAmbrpay.automation-fee') }}</p>
              <p v-show="amountErrMsg" class="sub-text err-msg">
                {{ amountErrMsg }}
              </p>
            </b-col>
          </b-row>
          <b-row class="row-style mt-1 interval-container">
            <span class="label-text">{{
              $t('dappsAmbrpay.interval-in-every')
            }}</span>
            <span v-show="intervalDays" class="days-text">{{
              $t('dappsAmbrpay.days')
            }}</span>
            <input
              v-model="intervalDays"
              :placeholder="$t('dappsAmbrpay.enter-days')"
              type="number"
              min="1"
              max="365"
            />
            <p v-show="intervalErrMsg" class="sub-text err-msg">
              {{ intervalErrMsg }}
            </p>
          </b-row>
          <b-row class="mt-5 button-container">
            <b-button
              class="active-sub-btn my-subscriptions-container"
              @click="openManageSubModal"
              >{{ $t('dappsAmbrpay.manage-subscriptions.title') }}
            </b-button>
            <b-button
              :class="[isValidInput ? '' : 'disabled']"
              class="mew-btn"
              @click="startSubscription"
              >{{ $t('dappsAmbrpay.start-recurring') }}</b-button
            >
          </b-row>
          <b-row>
            <div class="clear-all-btn mx-auto mt-3" @click="clear()">
              {{ $t('common.clear-all') }}
            </div>
          </b-row>
        </b-container>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import DropDownAddressSelector from '@/components/DropDownAddressSelector';

export default {
  components: {
    'dropdown-address-selector': DropDownAddressSelector
  },
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
      address: '',
      isValidAddress: false,
      hexAddress: '',
      intervalDays: '',
      sendAmount: '',
      amountErrMsg: '',
      intervalErrMsg: '',
      clearAddress: false
    };
  },
  computed: {
    ...mapState('main', ['web3', 'network', 'account']),
    isValidInput() {
      return (
        this.isValidAddress &&
        !this.amountErrMsg &&
        this.sendAmount &&
        this.address &&
        !this.intervalErrMsg
      );
    }
  },
  watch: {
    sendAmount(newVal) {
      const value = new BigNumber(newVal);
      const accountBalance = this.web3.utils.fromWei(
        new BigNumber(this.account.balance).toFixed(),
        'ether'
      );
      const automationFee = new BigNumber(value.times(0.1));
      const totalVal = value.plus(automationFee);

      if (!newVal) {
        return (this.amountErrMsg = '');
      }

      if (value.lt(0.01)) {
        this.amountErrMsg = this.$t('dappsAmbrpay.sub-form.min-greater');
      } else if (totalVal.gt(accountBalance)) {
        this.amountErrMsg = this.$t('dappsAmbrpay.sub-form.higher-than-bal');
      } else {
        this.amountErrMsg = '';
      }
    },
    intervalDays(newVal) {
      if (newVal.startsWith('0') && newVal.length > 1) {
        this.intervalErrMsg = this.$t(
          'dappsAmbrpay.sub-form.enter-correct-num'
        );
      } else if (newVal > 365) {
        this.intervalErrMsg = this.$t('dappsAmbrpay.sub-form.cannot-exceed');
      } else {
        this.intervalErrMsg = '';
      }
    }
  },
  methods: {
    clear() {
      this.address = '';
      this.isValidAddress = false;
      this.hexAddress = '';
      this.intervalDays = '';
      this.sendAmount = '';
      this.amountErrMsg = '';
      this.intervalErrMsg = '';
      this.clearAddress = !this.clearAddress;
    },
    getToAddress(data) {
      this.address = data.address;
      this.hexAddress = data.address;
      this.isValidAddress = data.valid;
    },
    sendEntireBalance() {
      if (this.account) {
        this.sendAmount = this.web3.utils.fromWei(
          new BigNumber(this.account.balance).toFixed(),
          'ether'
        );
      }
    },
    openManageSubModal() {
      this.$emit('openManageSubModal');
    },
    startSubscription() {
      const data = {
        subscriptionPlan: 'sp_f06PoxHvvutJZd',
        amount: new BigNumber(this.sendAmount).toNumber(),
        receiverWallet: this.address,
        interval: new BigNumber(this.intervalDays).toNumber(),
        transferOut: true,
        network: 'auto'
      };

      this.$emit('startSubscription', data);

      this.$nextTick(() => {
        this.clear();
        this.sendAmount = '';
        this.address = '';
        this.intervalDays = '';
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../AmbrpayGlobal.scss';
@import 'SubscriptionForm.scss';
</style>
