<template>
  <the-wrapper-wallet :total-left-col-items="1" :total-right-col-items="2">
    <template #leftColItem1>
      <module-swap
        :is-available="hasSwap"
        :from-token="fromToken"
        :to-token="toToken"
        :amount="amount"
      />
    </template>
    <template #rightColItem1>
      <module-tokens-value />
    </template>
    <template v-if="hasSwap" #rightColItem2>
      <module-transfer-history :is-custom="true" />
    </template>
  </the-wrapper-wallet>
</template>

<script>
import TheWrapperWallet from '@/core/components/TheWrapperWallet';
import ModuleSwap from '@/modules/swap/ModuleSwap';
import ModuleTokensValue from '@/modules/balance/ModuleTokensValue';
import ModuleTransferHistory from '@/modules/transfer-history/ModuleTransferHistory';
import { mapGetters } from 'vuex';

const ETH_TOKEN = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
const DAI_TOKEN = '0x6b175474e89094c44da98b954eedeac495271d0f';

export default {
  components: {
    TheWrapperWallet,
    ModuleSwap,
    ModuleTokensValue,
    ModuleTransferHistory
  },
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
  },
  computed: {
    ...mapGetters('global', ['hasSwap'])
  }
};
</script>
