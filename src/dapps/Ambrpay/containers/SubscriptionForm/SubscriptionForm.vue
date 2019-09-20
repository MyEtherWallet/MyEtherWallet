<template>
  <div class="ambrpay-container">
    <div class="ambrpay-content">
      <div class="ambrpay-form-container">
        <b-container>
          <b-row>
            <span class="label-text">To Address</span>
            <p
              class="action-text prevent-user-select"
              @click="copyToCsAliSDFDSpboard('address')"
            >
              {{ $t('common.copy') }}
            </p>
          </b-row>
          <b-row>
            <input ref="address" type="text" />
          </b-row>
          <b-row>
            <b-col cols="12" md="5">
              <span class="label-text">Type</span>
              <input id="" type="text" name="" />
            </b-col>
            <b-col class="amount-container" cols="12" md="7">
              <div class="amount-text">
                <span class="label-text">Amount</span>
                <span class="action-text">Copy Balance</span>
              </div>
              <input type="text" />
              <p class="fee-text">1% automation-fee will be added on top</p>
            </b-col>
          </b-row>
          <b-row>
            <span class="label-text">Interval in Every</span>
            <input type="text" placeholder="Day(s)" />
          </b-row>
          <b-row class="mt-4">
            <b-button class="mx-auto start-btn">Start Recurring</b-button>
          </b-row>
          <b-row>
            <b-button class="mx-auto active-sub-btn"
              >My Active Subscriptions</b-button
            >
          </b-row>
        </b-container>
      </div>
    </div>
  </div>
</template>

<script>
import Blockie from '@/components/Blockie';
import StandardInput from '@/components/StandardInput';
import { mapState } from 'vuex';
import { canBeConvertedToWei } from '../../AmbrpayHelpers';
// import BigNumber from 'bignumber.js';

export default {
  components: {
    blockie: Blockie,
    'standard-input': StandardInput
  },
  data() {
    return {
      amount: 0,
      amountInputOptions() {
        return {
          title: 'Amount',
          value: this.amount,
          type: 'number'
        };
      }
    };
  },
  computed: {
    ...mapState(['web3'])
  },
  isValidAmount() {
    if (!canBeConvertedToWei(this.web3, this.amount.toString())) return false;

    // const enteredAmount = new BigNumber(this.amount);
  },
  methods: {
    copyToClipboard(ref) {
      this.$refs[ref].select();
      document.execCommand('copy');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SubscriptionForm.scss';
</style>
