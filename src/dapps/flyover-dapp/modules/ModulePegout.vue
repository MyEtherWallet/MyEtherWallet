<template>
  <div class="pegout-container">
    <h2 class="text-center text-uppercase font-weight-bold mt-2">
      ↗ RBTC to BTC
    </h2>
    <mew-stepper :items="stepperItems" :on-step="onStep">
      <template #stepperContent1>
        <get-quote v-if="onStep === 1" @onSubmit="onSubmit"></get-quote>
      </template>
      <template #stepperContent2>
        <accept-quote
          v-if="onStep === 2"
          :quote-amount="finalAmount"
          :confirmations="confirmations"
          :quote-hash="quoteHash"
          :quote-url="quoteUrl"
          :site-key="siteKey"
          @onSubmit="onSubmit"
        ></accept-quote>
      </template>
      <template #stepperContent3>
        <deposit-funds v-if="onStep === 3" :hash="hash"></deposit-funds>
      </template>
    </mew-stepper>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ethers, BigNumber } from 'ethers';
import { hash } from '@chainsafe/persistent-merkle-tree';
import GetQuote from '../components/pegout/GetQuote.vue';
import AcceptQuote from '../components/pegout/AcceptQuote.vue';
import DepositFunds from '../components/pegout/DepositFunds.vue';

// data
const stepperItems = [
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
];
const quoteUrl = ref('');
const siteKey = ref('');
const btcAddress = ref('');
const lbcAddress = ref('');
const signature = ref('');
const quoteAmount = ref(0);
const finalAmount = ref('0');
const confirmations = ref('0');
const quoteHash = ref('');
const onStep = ref(1);

// methods
const onSubmit = val => {
  onStep.value += 1;
  if (onStep.value === 2) {
    const calculatedAmount = ethers.utils.formatEther(
      BigNumber.from(String(val?.quote?.callFee ?? 0)).toBigInt() +
        BigNumber.from(String(val?.quote?.value ?? 0)).toBigInt() +
        BigNumber.from(String(val?.quote?.gasFee ?? 0)).toBigInt() +
        BigNumber.from(String(val?.quote?.productFeeAmount ?? 0)).toBigInt()
    );
    quoteAmount.value = calculatedAmount;
    confirmations.value = val.quote.depositConfirmations;
    quoteHash.value = val.quoteHash;
    quoteUrl.value = val.quoteUrl;
    btcAddress.value = val.quote.btcRefundAddr;
    finalAmount.value = calculatedAmount;
    siteKey.value = val.siteKey;
  } else if (onStep.value === 3) {
    hash.value = val.hash;
    lbcAddress.value = val.lbcAddress;
    signature.value = val.signature;
  }
};
</script>
