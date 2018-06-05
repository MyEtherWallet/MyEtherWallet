<template>
  <div class="unlock-wallet">
    <div class="wrap">
      <div class="page-container">
        <div class="title">
          <h2>{{$t("reused.unlockWallet")}}</h2>
          <h5>
            {{$t("reused.noWallet")}}
            <router-link to="/">{{$t("reused.createWallet")}}</router-link>
          </h5>
        </div>
        <div class="blocks">
          <ul>
            <li>
              <h6>{{$t('reused.hardware')}}</h6>
              <p>Ledger wallet; Trezor; Digital bitbox; Secalot</p>
            </li>
            <li>
              <h6>{{$t("reused.jsonF")}}</h6>
              <p>{{$t("unlockWallet.jsonFDesc")}}</p>
            </li>
            <li>
              <h6>{{$t("reused.mnemonicP")}}</h6>
              <p>{{$t("unlockWallet.mnemonicPDesc")}}</p>
            </li>
            <li>
              <h6>MetaMask</h6>
              <p>{{$t("unlockWallet.metamaskDes")}}</p>
            </li>
            <li>
              <h6>{{$t("reused.privKey")}}</h6>
              <p>{{$t("unlockWallet.privKeyDesc")}}</p>
            </li>
          </ul>
        </div>
      </div><!-- .page-container -->
    </div><!-- .wrap -->
  </div><!-- .top-banner -->
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
  @import "UnlockWallet.scss";
</style>
