<template>
  <div class="mobile-network-block">
    <interface-network-modal ref="interfaceNetworkModal" />
    <div class="wrap">
      <div class="top-block">
        <div class="block-title">
          {{ $t('common.network') }}
        </div>
        <button class="change-button" @click="networkModalOpen">
          {{ $t('common.change') }}
        </button>
      </div>
      <div class="bottom-block">
        <p v-if="account.identifier !== identifier" class="network">
          {{ network.service + '(' + network.type.name + ')' }}
        </p>
        <!--<p v-show="parsedNetwork !== ''" class="network">M{{ parsedNetwork }}</p>-->

        <p class="last-block">
          {{ $t('interface.lastBlock') }}# : {{ blockNumber }}
        </p>
        <i v-show="parsedNetwork === ''" class="fa fa-spinner fa-spin" />
      </div>
    </div>
  </div>
</template>

<script>
import InterfaceNetworkModal from '@/layouts/InterfaceLayout/components/InterfaceNetworkModal';
import { mapGetters } from 'vuex';
import { WEB3_WALLET } from '@/wallets/bip44/walletTypes';

export default {
  components: {
    'interface-network-modal': InterfaceNetworkModal
  },
  props: {
    blockNumber: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      parsedNetwork: 0,
      identifier: WEB3_WALLET
    };
  },
  computed: {
    ...mapGetters({
      network: 'network',
      account: 'account',
      web3: 'web3'
    })
  },
  watch: {
    blockNumber(newVal) {
      this.parsedNetwork = parseInt(newVal);
    }
  },
  mounted() {
    if (this.blockNumber && this.blockNumber !== undefined) {
      this.parsedNetwork = parseInt(this.blockNumber);
    }
  },
  methods: {
    networkModalOpen() {
      if (this.account.identifier !== this.identifier) {
        this.$refs.interfaceNetworkModal.$refs.network.show();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'MobileNetworkBlock.scss';
</style>
