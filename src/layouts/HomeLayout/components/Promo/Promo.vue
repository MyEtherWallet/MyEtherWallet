<template>
  <div class="social">
    <div class="wrap">
      <div class="page-container">
        <div class="flex-col-vertical-center content">
          <div class="title">
            <h2>{{ $t('home.promoTitle') }}</h2>
          </div>
          <div class="buttons">
            <div class="button-block">
              <router-link to="/create-wallet" class="nounderline">
                <span class="large-round-button-white-border">
                  {{ $t('home.createNewWallet') }}
                </span>
              </router-link>
            </div>
            <div class="button-block">
              <router-link
                :to="
                  wallet === null || wallet === undefined
                    ? '/access-my-wallet'
                    : '/interface'
                "
                class="nounderline"
              >
                <span class="large-round-button-white-filled__body-text-color">
                  {{ $t('common.accessMyWallet') }}
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
import { mapGetters } from 'vuex';
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      wallet: 'wallet'
    })
  }
};
</script>

<style lang="scss" scoped>
@import 'Promo.scss';
</style>
