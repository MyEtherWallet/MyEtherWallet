<template>
  <div class="transactions-side-menu">
    <div class="side-menu">
      <ul>
        <li>
          <p class="active">{{ $t("txSideMenu.title") }} <i class="fa fa-angle-up" aria-hidden="true"></i></p>
          <ul>
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
