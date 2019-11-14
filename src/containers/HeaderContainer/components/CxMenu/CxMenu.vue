<template>
  <div class="cx-menu-container">
    <div class="cx-menu d-flex">
      <div class="d-flex logo-block">
        <img
          :src="require(`@/assets/images/short-hand-logo-mewcx.png`)"
          alt
          height="50"
        />
        <p>Chrome Extension</p>
      </div>
      <div class="spacer"></div>
      <div class="d-flex">
        <div class="d-flex menu-items">
          <a href="https://ccswap.myetherwallet.com/#/" target="_blank">
            <div class="d-flex buy-eth">
              <img
                alt
                class="buy-eth-icon"
                src="@/assets/images/icons/buy-eth.svg"
                height="24"
              />
              <p>Buy ETH</p>
            </div>
          </a>
          <a data-v-2fc56d39="" href="#/" class="nav-link" target="_self">
            <p>Home</p>
          </a>
          <extension-notification
            v-if="
              isMewCx &&
                !$route.fullPath.includes('view-wallet-info') &&
                !$route.fullPath.includes('interface')
            "
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ExtensionNotification from '@/layouts/ExtensionBrowserAction/containers/ExtensionNotification';
import { Misc } from '@/helpers';

export default {
  components: {
    'extension-notification': ExtensionNotification
  },
  data() {
    const isMewCx = Misc.isMewCx();
    return { isMewCx: isMewCx };
  }
};
</script>

<style lang="scss" scoped>
@import 'CxMenu.scss';
</style>
