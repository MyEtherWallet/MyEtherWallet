<template>
  <div class="ambrpay-container">
    <div class="ambrpay-content">
      <div class="ambrpay-form-container">
        <b-container>
          <b-row>
            <b-col cols="12" md="4">
              <div class="">
                <!-- add the currency -->
              </div>
            </b-col>
            <b-col cols="12" md="4">
              <!-- <standard-input
                :options="amountInputOptions()"
                @changedValue="amount = $event"
              /> -->
              <!-- <div v-show="!isValidAmount" class="text-danger">
                Amount higher than balance
              </div>
              <div v-show="!hasEnoughEthToSchedule" class="text-danger">
                Not enough ETH on account to schedule
              </div> -->
            </b-col>
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
  }
};
</script>

<style lang="scss" scoped>
@import 'SubscriptionForm.scss';
</style>
