<template>
  <div class="info-block-container">
    <interface-network-modal ref="network" />
    <div class="info-block network">
      <div class="block-image network-type">
        <div class="icon-block">
          <img :src="network.type.icon" class="icon" />
        </div>
      </div>
      <div class="block-content">
        <div class="information-container">
          <div class="title-and-helper">
            <h2>{{ $t('interface.network') }}</h2>
          </div>
          <p v-if="wallet.identifier !== 'web3_wallet'">
            {{ network.service + '(' + network.type.name + ')' }}
          </p>
          <p v-else>{{ 'Web3 Provider' + '(' + network.type.name + ')' }}</p>
          <p>
            {{ $t('interface.lastBlock') }}# :
            <span v-show="parsedNetwork !== ''"> {{ parsedNetwork }}</span>
            <i v-show="parsedNetwork === ''" class="fa fa-spinner fa-spin" />
          </p>
        </div>
        <div class="icon-container">
          <b-btn
            v-if="wallet.identifier !== 'web3_wallet'"
            id="networkModal"
            class="custom-tooltip"
            @click="networkModalOpen"
          >
            <img src="~@/assets/images/icons/change.svg" />
          </b-btn>
          <b-popover
            content="Open Networks"
            target="networkModal"
            placement="top"
            triggers="hover"
            title=""
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InterfaceNetworkModal from '../InterfaceNetworkModal';
import { mapGetters } from 'vuex';

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
      parsedNetwork: 0
    };
  },
  computed: {
    ...mapGetters({
      network: 'network',
      wallet: 'wallet',
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
      if (this.wallet.identifier !== 'web3_wallet') {
        this.$refs.network.$refs.network.show();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'InterfaceNetwork.scss';
</style>
