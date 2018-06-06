<template>
  <div class="transactions-side-menu">
    <div class="side-menu">
      <ul>
        <li>
          <p class="active">Send <i class="fa fa-angle-up" aria-hidden="true"></i></p>
          <ul>
            <li>
              <router-link to="/send-eth-and-tokens">
                Send ETH & Tokens
              </router-link>
            </li>
            <li class="active">
              <router-link to="/send-offline">
                Send Offline
              </router-link>
            </li>
          </ul>
        </li>
        <li>
          <router-link to="/swap">
            <p>Swap</p>
          </router-link>
        </li>
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
