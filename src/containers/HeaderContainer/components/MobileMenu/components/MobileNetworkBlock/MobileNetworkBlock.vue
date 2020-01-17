<template>
  <div class="mobile-info-block">
    <interface-network-modal ref="interfaceNetworkModal" />

    <div class="network-block-contents d-flex align-items-center">
      <div>
        <div class="info-block-title font-reset-disabled text-uppercase mb-1">
          {{ $t('common.current-network') }}
        </div>

        <div
          v-if="account.identifier !== identifier"
          class="info-block-value text-monospace pl-3"
        >
          {{ network.service + '(' + network.type.name + ')' }}
        </div>

        <div class="last-block font-reset-disabled pl-3">
          <i class="fa fa-angle-right" aria-hidden="true"></i>
          {{ $t('interface.network-modal.last-block') }}#:
          <span class="text-monospace ">{{ blockNumber }}</span>
        </div>
      </div>

      <div class="ml-auto" @click="networkModalOpen">
        <i class="setting fa fa-ellipsis-v" aria-hidden="true"></i>
      </div>
    </div>

    <i v-show="parsedNetwork === ''" class="fa fa-spinner fa-spin" />
  </div>
</template>

<script>
import InterfaceNetworkModal from '@/layouts/InterfaceLayout/components/InterfaceNetworkModal';
import { mapState } from 'vuex';
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
    ...mapState(['network', 'account', 'web3'])
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
