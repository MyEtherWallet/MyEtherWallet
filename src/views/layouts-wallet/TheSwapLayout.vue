<template>
  <the-wrapper-wallet :total-left-col-items="1">
    <template #leftColItem1>
      <module-swap
        :from-token="fromToken"
        :to-token="toToken"
        :amount="amount"
      />
    </template>
    <template #rightColItem1>
      <module-tokens-value />
    </template>
  </the-wrapper-wallet>
</template>

<script>
import TheWrapperWallet from '@/core/components/TheWrapperWallet';
import ModuleSwap from '@/modules/swap/ModuleSwap';
import ModuleTokensValue from '@/modules/tokens-value/ModuleTokensValue';
const ETH_TOKEN = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
const DAI_TOKEN = '0x6b175474e89094c44da98b954eedeac495271d0f';

export default {
  components: { TheWrapperWallet, ModuleSwap, ModuleTokensValue },
  props: {
    fromToken: {
      type: String,
      default: ETH_TOKEN
    },
    toToken: {
      type: String,
      default: DAI_TOKEN
    },
    amount: {
      type: String,
      default: ''
    }
  }
};
</script>
