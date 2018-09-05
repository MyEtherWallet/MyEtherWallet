<template>
  <div class="tx-status">
    <div class="wrap">

      <div class="page-container">
        <div class="page-title">
          <h2>Transaction Status</h2>
          <p>
            MyEtherWallet is comprised of talented, inspiring, and hardworking
            indivisuals from around the world. We share the passion to code.
          </p>
          <p>
            This is not typically something you can do. It should not be relied upon & will only work when th TX Pools are full. Please read more here.
          </p>
        </div>

        <div class="content-container">
          <dropdown-address-selector></dropdown-address-selector>

          <div type="" name="" class="check-button large-round-button-green-filled">Check</div>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import DropDownAddressSelector from '@/components/DropDownAddressSelector'

export default {
  components: {
    'dropdown-address-selector': DropDownAddressSelector
  },
  data () {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
  @import "TxStatusLayout.scss";
</style>
