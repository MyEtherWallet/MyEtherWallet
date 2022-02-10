<template>
  <div class="core-components--app-addr-qr">
    <!--
    =====================================================================================
      Title
    =====================================================================================
    -->
    <div class="mew-heading-2 mb-3 mr-3">
      {{ $t('interface.qr.title') }}
    </div>

    <!--
    =====================================================================================
      Subtext
    =====================================================================================
    -->
    <div class="textPrimary--text mb-8">
      {{ $t('interface.qr.desc', { network: getNetwork() }) }}
    </div>
    <!--
    =====================================================================================
      Identicon and acount
    =====================================================================================
    -->
    <div class="d-flex align-center mb-4">
      <mew-blockie :address="address" width="22px" height="22px" />
      <div class="pl-1 mew-body font-weight-bold">
        {{ $t('interface.qr.my-main-account') }}
      </div>
    </div>

    <!--
    =====================================================================================
      QR / Address / Card
    =====================================================================================
    -->
    <div class="wallet-card-container">
      <img
        class="wallet-card"
        :src="'https://mewcard.mewapi.io/?address=' + address"
        alt="MEW Card"
        @load="animateMewCard()"
      />
      <div class="inner-content pa-3 pa-sm-8 d-flex align-center">
        <div class="white pa-1" style="border-radius: 7px">
          <qr-code :data="address" :height="132" :width="132" />
        </div>
        <div class="pl-3">
          <div class="d-block monospace titlePrimary-text container-qr--addr">
            {{ getChecksumAddressString }}
          </div>
          <div
            class="d-inline-flex align-center cursor--pointer mt-4 pa-1"
            @click="copyAddress"
          >
            <v-icon small color="white">mdi-content-copy</v-icon>
            <div class="ml-1 white--text">Copy</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
qr
<script>
import anime from 'animejs/lib/anime.es.js';
import clipboardCopy from 'clipboard-copy';
import { Toast, INFO } from '@/modules/toast/handler/handlerToast';
import { mapState, mapGetters } from 'vuex';
import { toChecksumAddress } from '@/core/helpers/addressUtils';
export default {
  computed: {
    ...mapState('wallet', ['address']),
    ...mapGetters('global', ['network']),
    getChecksumAddressString() {
      return toChecksumAddress(this.address);
    }
  },
  methods: {
    copyAddress() {
      clipboardCopy(this.address);
      Toast(`Copied ${this.address} successfully!`, {}, INFO);
    },
    getNetwork() {
      return this.network ? this.network.type.currencyName : 'ETH';
    },
    animateMewCard() {
      const el = document.querySelector('.mew-card');
      el.style.opacity = 0;
      anime({
        targets: el,
        opacity: 1,
        delay: 1300,
        duration: 500,
        easing: 'easeInOutQuad'
      });
    }
  }
};
</script>

<style lang="scss">
.core-components--app-addr-qr {
  canvas {
    // Replace "inline" with "block" to remove line-height spacing
    display: block !important;
  }
}
</style>

<style lang="scss" scoped>
.wallet-card-container {
  overflow: hidden;
  border-radius: 20px;
  position: relative;
  .container-qr--addr {
    word-break: break-all;
    color: white;
    text-shadow: 0px 2px 8px rgba(0, 0, 0, 0.24),
      0px 1px 4px rgba(0, 0, 0, 0.24);
  }
  .wallet-card {
    width: 100%;
    display: block;
  }
  .inner-content {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
}
</style>
