<template>
  <div class="transaction-info-blocks">
    <interface-network-modal></interface-network-modal>
    <div v-on:click="networkModalOpen" class="wrap">
      <div class="info-block network">
        <div class="block-image">
          <img class="icon" src="~@/assets/images/icons/network.svg">
        </div>
        <div class="block-content">
          <h2>{{ $t("txNetwork.title") }}</h2>
          <p>myetherapi.com(ETH)</p>
          <p>Last Block#: 5699679</p>
          <div class="icon-container">
            <img src="~@/assets/images/icons/change.svg">
          </div>
          <!-- <p class="bottom-button">{{ $t("txNetwork.change") }} <i class="fa fa-chevron-right" aria-hidden="true"></i></p> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    networkModalOpen () {
      this.$children[0].$refs.network.show()
    },
    addCustomNetworkToggle () {
      document.querySelector('.network-list').classList.toggle('hidden')
      document.querySelector('.network-add').classList.toggle('hidden')
      document.querySelector('.network').classList.toggle('max-height-1')
    },
    expendAuth () {
      document.querySelector('.auth-form-container').classList.toggle('hidden')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "InterfaceNetwork.scss";
</style>
