<template>
  <div class="subscription-container">
    <div class="subscription-content">
      <div class="subscription-form-container">
        <b-container>
          <b-row>
            <span class="label-text">To Address</span>
            <p class="action-text prevent-user-select" @click="copyToClipboard">
              {{ $t('common.copy') }}
            </p>
          </b-row>
          <b-row class="address-block">
            <span class="row-style">
              <blockie
                v-show="isValidAddress"
                :address="hexAddress"
                :size="6"
                :scale="16"
                width="32px"
                height="32px"
                class="blockie-image"
              />
              <input
                v-ens-resolver="'address'"
                ref="address"
                v-model="address"
                :class="isValidAddress ? 'input-address' : ''"
                name="name"
                autocomplete="off"
                type="text"
              />
              <i
                :class="[
                  isValidAddress && hexAddress.length !== 0 ? '' : 'not-good',
                  'fa fa-check-circle good-button'
                ]"
                aria-hidden="true"
              />
            </span>
          </b-row>
          <b-row>
            <b-col class="mt-3" cols="12" md="5">
              <span class="label-text">Type</span>
              <div class="fake-input">
                <p>
                  <img
                    class="currency-icon"
                    src="@/assets/images/currency/eth.svg"
                  />
                  <span class="token-txt">ETH</span>-Ethereum
                </p>
              </div>
            </b-col>
            <b-col class="amount-container mt-3" cols="12" md="7">
              <div class="amount-text">
                <span class="label-text">Amount</span>
                <span class="action-text" @click="sendEntireBalance"
                  >Entire Balance</span
                >
              </div>
              <input
                v-model="sendAmount"
                type="number"
                placeholder="0.01"
                min="0.01"
              />
              <p class="sub-text">1% automation-fee will be added on top</p>
              <p v-show="amountErrMsg" class="sub-text err-msg">
                {{ amountErrMsg }}
              </p>
            </b-col>
          </b-row>
          <b-row class="row-style mt-1 interval-container">
            <span class="label-text">Interval in Every</span>
            <span v-show="intervalDays" class="days-text">Day(s)</span>
            <input
              v-model="intervalDays"
              type="number"
              min="1"
              placeholder="Day(s)"
            />
            <p v-show="intervalErrMsg" class="sub-text err-msg">
              {{ intervalErrMsg }}
            </p>
          </b-row>
          <b-row class="mt-4">
            <b-button
              :class="[isValidInput ? '' : 'disabled', 'mx-auto mew-btn']"
              @click="startSubscription"
              >Start Recurring</b-button
            >
          </b-row>
        </b-container>
      </div>
    </div>
  </div>
</template>

<script>
import Blockie from '@/components/Blockie';
import { mapState } from 'vuex';
import { Toast } from '@/helpers';
import BigNumber from 'bignumber.js';

export default {
  components: {
    blockie: Blockie
  },
  data() {
    return {
      address: '',
      isValidAddress: false,
      hexAddress: '',
      intervalDays: '',
      sendAmount: '',
      amountErrMsg: '',
      intervalErrMsg: ''
    };
  },
  computed: {
    ...mapState(['web3', 'network', 'account']),
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
        this.amountErrMsg = 'The minimum amount is 0.01 or greater';
      } else if (totalVal.gt(accountBalance)) {
        this.amountErrMsg =
          'Amount higher than balance (including 1% automation fee)';
      } else {
        this.amountErrMsg = '';
      }
    },
    intervalDays(newVal) {
      if (newVal.startsWith('0') && newVal.length > 1) {
        this.intervalErrMsg = 'Please enter a correct number';
      } else {
        this.intervalErrMsg = '';
      }
    }
  },
  methods: {
    copyToClipboard() {
      this.$refs.address.select();
      document.execCommand('copy');
      Toast.responseHandler('Copied', Toast.INFO);
    },
    sendEntireBalance() {
      if (this.account) {
        this.sendAmount = this.web3.utils.fromWei(
          new BigNumber(this.account.balance).toFixed(),
          'ether'
        );
      }
    },
    startSubscription() {
      const data = {
        subscriptionPlan: 'sp_SYh4plL76BSu1Y',
        amount: new BigNumber(this.sendAmount).toNumber(),
        receiverWallet: this.address,
        interval: new BigNumber(this.intervalDays).toNumber(),
        transferOut: true,
        network: 'auto'
      };

      this.$emit('startSubscription', data);

      this.$nextTick(() => {
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
