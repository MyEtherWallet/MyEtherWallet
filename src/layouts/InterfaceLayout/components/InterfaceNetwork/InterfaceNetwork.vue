<template>
  <div>
    <interface-network-modal></interface-network-modal>
    <div v-on:click="networkModalOpen">
      <div class="info-block network">
        <div class="block-image">
          <img class="icon" src="~@/assets/images/icons/network.svg">
        </div>
        <div class="block-content">
          <h2>{{ $t("txNetwork.title") }}</h2>
          <p>{{ $store.state.network.service+"("+$store.state.network.type.name+")" }}</p>
          <p>Last Block#: <span v-show="parsedNetwork !== ''"> {{ parsedNetwork }}</span> <i v-show="parsedNetwork === ''" class="fa fa-spinner fa-spin"></i> </p>
          <div class="icon-container">
            <img src="~@/assets/images/icons/change.svg">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InterfaceNetworkModal from '../InterfaceNetworkModal'

export default {
  props: ['blockNumber'],
  components: {
    'interface-network-modal': InterfaceNetworkModal
  },
  data () {
    return {
      parsedNetwork: ''
    }
  },
  methods: {
    networkModalOpen () {
      this.$children[0].$refs.network.show()
    }
  },
  mounted () {
    if (this.blockNumber && this.blockNumber.result !== undefined) {
      this.parsedNetwork = parseInt(this.blockNumber.result)
    }
  },
  watch: {
    blockNumber (newVal) {
      this.parsedNetwork = parseInt(newVal.result)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "InterfaceNetwork.scss";
</style>
