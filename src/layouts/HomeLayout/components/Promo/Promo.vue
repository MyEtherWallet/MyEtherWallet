<template>
  <div class="social">
    <div class="wrap">
      <div class="page-container">
        <div class="flex-col-vertical-center content">
          <div class="title">
            <h2>{{ $t("promo.title1") }}<br>{{ $t("promo.title2") }}</h2>
          </div>
          <div class="buttons">
            <div class="button-block">
              <router-link to="/create-wallet" class="nounderline">
                <span class="large-round-button-white-border">
                  {{ $t("reused.getAFreeWallet") }}
                </span>
              </router-link>
            </div>
            <div class="button-block">
              <router-link :to="$store.state.wallet === null || $store.state.wallet === undefined ? '/access-my-wallet' : '/interface'" class="nounderline">
                <span class="large-round-button-white-filled green-text-color">
                  {{ $t("reused.accessMyWallet") }}
                </span>
              </router-link>
            </div>
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
  }
}
</script>

<style lang="scss" scoped>
  @import "Promo.scss";
</style>
