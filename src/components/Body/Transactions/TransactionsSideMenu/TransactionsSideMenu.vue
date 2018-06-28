<template>
  <div class="transactions-side-menu">
    <div class="side-menu">
      <ul>
        <li>
          <div class="menu-group-title">
            <img src="~@/assets/images/sidemenu/send-2.svg">
            <p class="active">Send</p>
            <i class="fa fa-angle-up" aria-hidden="true"></i>
          </div>
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
            <div class="menu-group-title">
              <img src="~@/assets/images/sidemenu/swap-2.svg">
              <p>Swap</p>
            </div>
          </router-link>
        </li>
        <li>
          <router-link to="/dapps">
            <div class="menu-group-title">
              <img src="~@/assets/images/sidemenu/dapps-2.svg">
              <p>Dapps</p>
            </div>
          </router-link>
        </li>
        <li>
          <div class="menu-group-title">
            <img src="~@/assets/images/sidemenu/contract-2.svg">
            <p>Contract</p>
            <i class="fa fa-angle-down" aria-hidden="true"></i>
          </div>
          <ul>
            <li>
              <router-link to="/interact-with-contract">
                Interact With Contract
              </router-link>
            </li>
            <li>
              <router-link to="/interact-with-contract">
                Deploy Contract
              </router-link>
            </li>
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
