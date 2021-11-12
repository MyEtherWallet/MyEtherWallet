<template>
  <div class="mew-component--banner-ads cursor--pointer">
    <mew6-white-sheet>
      <mew-carousel class="box-shadow" carousel-height="155" :total-slides="2">
        <template #slide1>
          <a :href="mobileOrWebLink()" target="_blank">
            <div class="ad1 px-5 d-flex flex-column justify-center">
              <div class="title font-weight-bold mb-n1">MEW wallet App</div>
              <div class="mb-2">Download it today!</div>
              <div class="d-flex align-center pb-3">
                <img
                  class="mr-1"
                  height="23"
                  src="@/assets/images/icons/button-app-store.svg"
                />
                <img
                  class="mr-1"
                  height="23"
                  src="@/assets/images/icons/button-play-store.svg"
                />
              </div>
            </div>
          </a>
        </template>
        <template #slide2>
          <router-link
            :to="{ name: ROUTES_HOME.BUY_HARDWARE_WALLET.NAME }"
            target="_blank"
          >
            <div class="ad2 px-5 d-flex flex-column justify-center">
              <div class="title font-weight-bold mb-n1">Hardware wallets</div>
              <div class="mb-2">Buy a hardware wallet!</div>
              <div class="d-flex align-center">
                <img
                  class="mr-2"
                  height="38"
                  src="@/assets/images/hardware-wallets/bitmap.png"
                />
                <img
                  class="mr-2"
                  height="38"
                  src="@/assets/images/hardware-wallets/bitbox.png"
                />
                <img
                  class="mr-2"
                  height="38"
                  src="@/assets/images/hardware-wallets/billfodl.png"
                />
                <img
                  class="mr-2"
                  height="38"
                  src="@/assets/images/hardware-wallets/finney.png"
                />
                <img
                  class="mr-2"
                  height="38"
                  src="@/assets/images/hardware-wallets/keepkey.png"
                />
              </div>
            </div>
          </router-link>
        </template>
      </mew-carousel>
    </mew6-white-sheet>
  </div>
</template>

<script>
import { ROUTES_HOME } from '@/core/configs/configRoutes';
const platform = require('platform');

export default {
  data: () => ({
    ROUTES_HOME: ROUTES_HOME
  }),
  methods: {
    mobileOrWebLink() {
      if (platform.os.family.includes('iOS')) {
        return 'https://apps.apple.com/app/id1464614025';
      } else if (platform.os.family.includes('Android')) {
        return 'https://play.google.com/store/apps/details?id=com.myetherwallet.mewwallet';
      }
      return 'https://www.mewwallet.com/';
    }
  }
};
</script>

<style lang="scss" scoped>
.mew-component--banner-ads {
  * {
    user-select: none;
    color: var(--v-textDark-base) !important;
  }
}
.ad1 {
  height: 100%;
  background: url('~@/assets/images/snippets/bg-mew-wallet.png');
  background-size: 130px;
  background-position: right -10px bottom -10px;
  background-repeat: no-repeat;
}
.ad2 {
  height: 100%;
  background: url('~@/assets/images/hardware-wallets/ledger.png');
  background-size: 110px;
  background-position: right 0px bottom 0px;
  background-repeat: no-repeat;
}
</style>

<style lang="scss">
.mew-component--banner-ads {
  .v-btn--active:before {
    opacity: 0 !important;
  }
  .v-icon {
    font-size: 10px !important;
  }
  .v-btn--icon {
    margin: 0 !important;
  }
  .v-item-group {
    margin-bottom: -15px;
  }
}
</style>
