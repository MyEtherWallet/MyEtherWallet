<template>
  <div>
    <interface-network-modal/>
    <div @click="networkModalOpen">
      <div class="info-block network">
        <div class="block-image">
          <img
            :src="$store.state.network.type.icon"
            class="icon">
        </div>
        <div class="block-content">
          <div class="helper">
            <popover
              :popcontent="$t('popover.whatIsMessageContent')"
              :popovertype="'A'" />
          </div>
          <div class="information-container">
            <h2>{{ $t("interface.txNetworkTitle") }}</h2>
            <p>{{ $store.state.network.service+"("+$store.state.network.type.name+")" }}</p>
            <p>Last Block#: <span v-show="parsedNetwork !== ''"> {{ parsedNetwork }}</span> <i
              v-show="parsedNetwork === ''"
              class="fa fa-spinner fa-spin"/> </p>
          </div>
          <div class="icon-container">
            <img src="~@/assets/images/icons/change.svg">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InterfaceNetworkModal from '../InterfaceNetworkModal';

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
      this.$children[0].$refs.network.show();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'InterfaceNetwork.scss';
</style>
