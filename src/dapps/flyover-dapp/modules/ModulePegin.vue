<template>
  <div class="pegin-container">
    <h2 class="text-center text-uppercase font-weight-bold mt-2">
      ↙ BTC to RBTC
    </h2>
    <mew-stepper :items="stepperItems" :on-step="onStep">
      <template #stepperContent1>
        <get-quote v-if="onStep === 1" @onSubmit="onSubmit"></get-quote>
      </template>
      <template #stepperContent2>
        <accept-quote
          v-if="onStep === 2"
          :quote-amount="quoteAmount"
          :confirmations="confirmations"
          :quote-hash="quoteHash"
          :quote-url="quoteUrl"
          :site-key="siteKey"
          @onSubmit="onSubmit"
        ></accept-quote>
      </template>
      <template #stepperContent3>
        <deposit-funds
          v-if="onStep === 3"
          :bitcoin-deposit-address-hash="bitcoinDepositAddressHash"
          :signature="signature"
          :final-amount="finalAmount"
          :btc-address="btcAddress"
          :minimum-age="timeForDeposit"
          :confirmations="confirmations"
        ></deposit-funds>
      </template>
    </mew-stepper>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
import { mapState } from 'vuex';

export default {
  components: {
    GetQuote: () => import('../components/pegin/GetQuote'),
    AcceptQuote: () => import('../components/pegin/AcceptQuote'),
    DepositFunds: () => import('../components/pegin/DepositFunds')
  },
  props: {},
  data() {
    return {
      timeForDeposit: '3600',
      quoteUrl: '',
      btcAddress: '',
      siteKey: '',
      bitcoinDepositAddressHash: '',
      signature: '',
      quoteAmount: 0,
      finalAmount: '0',
      confirmations: '0',
      quoteHash: '',
      onStep: 1,
      stepperItems: [
        {
          step: 1,
          name: 'Get a quote'
        },
        {
          step: 2,
          name: 'Accept a quote'
        },
        {
          step: 3,
          name: 'Deposit'
        }
      ]
    };
  },
  computed: {
    ...mapState('wallet', ['balance', 'address', 'web3'])
  },
  balanceToWei() {
    return this.web3.utils.toWei(BigNumber(this.balance).toString(), 'ether');
  },
  watch: {
    onStep() {}
  },
  mounted() {},
  methods: {
    onSubmit(val) {
      this.onStep += 1;
      if (this.onStep === 2) {
        this.quoteAmount = (val.quote.callFee + val.quote.value) / 10 ** 18;
        this.confirmations = val.quote.confirmations;
        this.quoteHash = val.quoteHash;
        this.quoteUrl = val.quoteUrl;
        this.btcAddress = val.quote.btcRefundAddr;
        this.timeForDeposit = String(val.quote.timeForDeposit);
        this.finalAmount = (val.quote.callFee + val.quote.value) / 10 ** 18;
        this.siteKey = val.siteKey;
      } else if (this.onStep === 3) {
        this.bitcoinDepositAddressHash = val.bitcoinDepositAddressHash;
        this.signature = val.signature;
      }
    }
  }
};
</script>
