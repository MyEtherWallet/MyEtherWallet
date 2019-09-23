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
          <b-row>
            <blockie
              v-show="isValidAddress"
              :address="address"
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
              name="name"
              autocomplete="off"
              type="text"
            />
          </b-row>
          <b-row>
            <b-col cols="12" md="5">
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
            <b-col class="amount-container" cols="12" md="7">
              <div class="amount-text">
                <span class="label-text">Amount</span>
                <span class="action-text">Entire Balance</span>
              </div>
              <input type="text" placeholder="0.0000" />
              <p class="fee-text">1% automation-fee will be added on top</p>
            </b-col>
          </b-row>
          <b-row>
            <span class="label-text">Interval in Every</span>
            <input type="text" placeholder="Day(s)" />
          </b-row>
          <b-row class="mt-5">
            <b-button class="mx-auto mew-btn">Start Recurring</b-button>
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
import { Toast } from '@/helpers';
import { isAddress } from '@/helpers/addressUtils';

export default {
  components: {
    blockie: Blockie,
    'standard-input': StandardInput
  },
  data() {
    return {
      address: '',
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
    ...mapState(['web3']),
    isValidAddress() {
      return isAddress(this.address);
    }
  },
  isValidAmount() {
    if (!canBeConvertedToWei(this.web3, this.amount.toString())) return false;

    // const enteredAmount = new BigNumber(this.amount);
  },
  methods: {
    copyToClipboard() {
      this.$refs.address.select();
      document.execCommand('copy');
      Toast.responseHandler('Copied', Toast.INFO);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../AmbrpayGlobal.scss';
@import 'SubscriptionForm.scss';
</style>
