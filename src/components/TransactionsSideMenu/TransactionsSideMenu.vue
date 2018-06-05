<template>
  <div class="transactions-side-menu">
    <div class="side-menu">
      <ul>
        <li>
          <p class="active">{{ $t("txSideMenu.send") }} <i class="fa fa-angle-up" aria-hidden="true"></i></p>
          <ul>
          <!-- <li>
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
          <li>
          <router-link to="/dapps">
          <p>Dapps</p>
          </router-link>
          </li> -->
            <li>{{ $t("reused.sendTx") }}</li>
            <li class="active">{{ $t("txSideMenu.offline") }}</li>
          </ul>
        </li>
        <li><p>{{ $t("reused.swap") }}</p></li>
        <li><p>{{ $t("txSideMenu.dapps") }}</p></li>
        <li>
          <p>{{ $t("txSideMenu.contract") }} <i class="fa fa-angle-down" aria-hidden="true"></i></p>
          <ul>
            <li>{{ $t("txSideMenu.interactWcontract") }}</li>
            <li>{{ $t("txSideMenu.depContract") }}</li>
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
  }
}
</script>

<style lang="scss" scoped>
  @import "TransactionsSideMenu.scss";
</style>
