<template>
  <div>
    <interface-network-modal ref="network" />
    <div @click="networkModalOpen">
      <div class="info-block network">
        <div class="block-image">
          <img :src="network.type.icon" class="icon" />
        </div>
        <div class="block-content">
          <div class="helper">
            <popover
              :popcontent="$t('popover.whatIsMessageContent')"
              :popovertype="'A'"
            />
          </div>
          <div class="information-container">
            <h2>{{ $t('interface.network') }}</h2>
            <p>{{ network.service + '(' + network.type.name + ')' }}</p>
            <p>
              {{ $t('interface.lastBlock') }}: #
              <span v-show="parsedNetwork !== ''"> {{ parsedNetwork }}</span>
              <i v-show="parsedNetwork === ''" class="fa fa-spinner fa-spin" />
            </p>
          </div>
          <div class="icon-container">
            <img src="~@/assets/images/icons/change.svg" />
          </div>
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
      network: 'network'
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
      this.$refs.network.$refs.network.show();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'InterfaceNetwork.scss';
</style>
