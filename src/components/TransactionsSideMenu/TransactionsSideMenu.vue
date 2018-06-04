<template>
  <div class="transactions-side-menu">
    <div class="side-menu">
      <ul>
        <li>
          <p class="active">Send <i class="fa fa-angle-up" aria-hidden="true"></i></p>
          <ul>
            <li>Send ETH and Tokens</li>
            <li class="active">Send Offline</li>
          </ul>
        </li>
        <li><p>Swap</p></li>
        <li><p>Dapps</p></li>
        <li>
          <p>Contract <i class="fa fa-angle-down" aria-hidden="true"></i></p>
          <ul>
            <li>Interact With Contract</li>
            <li>Deploy Contract</li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
  @import "TransactionsSideMenu.scss";
</style>
