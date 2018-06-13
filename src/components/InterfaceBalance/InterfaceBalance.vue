<template>
  <div class="transaction-info-blocks">
    <interface-balance-modal></interface-balance-modal>
    <div v-on:click="balanceModalOpen" class="wrap">
      <div class="info-block balance">
        <div class="block-image">
          <img class="icon" src="~@/assets/images/icons/balance.svg">
        </div>
        <div class="block-content">
          <h2>{{ $t("reused.balance")}}</h2>
          <h4>7130.000000 ETH</h4>
          <div class="icon-container">
            <img src="~@/assets/images/icons/more.svg">
            <!-- <p class="bottom-button">{{ $t("txBalance.detail")}} <i class="fa fa-chevron-right" aria-hidden="true"></i></p> -->
          </div>
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
    balanceModalOpen () {
      this.$children[0].$refs.balance.show()
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
  @import "InterfaceBalance.scss";
</style>
