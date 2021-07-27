<template>
  <v-row class="align-start justify-start" dense>
    <!--
    =====================================================================================
      Title
    =====================================================================================
    -->
    <v-col cols="10">
      <div class="mew-heading-2">{{ $t('interface.qr.title') }}</div>
    </v-col>
    <!--
    =====================================================================================
      Subtext
    =====================================================================================
    -->
    <v-col cols="12">
      <div class="textPrimary--text">
        {{ $t('interface.qr.desc') }}
      </div>
    </v-col>
    <!--
    =====================================================================================
      Identicon and acount
    =====================================================================================
    -->
    <v-col cols="12" class="pt-7 mb-2">
      <div class="d-flex align-center justify-start">
        <mew-blockie
          :address="address"
          width="22px"
          height="22px"
          class="inline-block"
        />
        <div class="pl-1 mew-body font-weight-bold inline-block">
          {{ $t('interface.qr.my-main-account') }}
        </div>
      </div>
    </v-col>
    <!--
    =====================================================================================
      QR / Address / Card
    =====================================================================================
    -->
    <v-col cols="12" class="mb-4">
      <div class="component--wallet-card">
        <div class="mew-card">
          <img
            :src="'https://mewcard.mewapi.io/?address=' + address"
            alt="MEW Card"
            @load="animateMewCard()"
          />
        </div>
        <div class="info-container d-flex align-center justify-start pa-3">
          <div class="qr-container pa-1">
            <qr-code
              :data="address"
              :height="132"
              :width="132"
              :margin="-4"
              class="d-inline-block"
            />
          </div>

          <div class="d-inline-block pl-3">
            <div class="d-block monospace titlePrimary-text container-qr--addr">
              {{ getChecksumAddressString }}
            </div>
            <mew-button
              title="Copy"
              color-theme="white"
              btn-size="small"
              btn-style="transparent"
              icon="mdi-content-copy"
              icon-type="mdi"
              class="ml-n4 mt-3 mew-label"
              @click.native="copyAddress"
            />
          </div>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import anime from 'animejs/lib/anime.es.js';
import clipboardCopy from 'clipboard-copy';
import { Toast, INFO } from '@/modules/toast/handler/handlerToast';
import { mapState } from 'vuex';
import { toChecksumAddress } from '@/core/helpers/addressUtils';

export default {
  computed: {
    ...mapState('wallet', ['address']),
    getChecksumAddressString() {
      return toChecksumAddress(this.address);
    }
  },
  methods: {
    copyAddress() {
      clipboardCopy(this.address);
      Toast(`Copied ${this.address} successfully!`, {}, INFO);
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

<style lang="scss" scoped>
.container-qr--addr {
  max-width: 128px;
  overflow-wrap: break-word;
  color: white;
  text-shadow: 0px 2px 8px rgba(0, 0, 0, 0.24), 0px 1px 4px rgba(0, 0, 0, 0.24);

  @media (max-width: 370px) {
    max-width: 90px;
  }
}

.component--wallet-card {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  position: relative;
  width: 100%;
  .mew-card {
    border-radius: 16px;
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    height: 100%;
    img {
      height: 100%;
      width: 100%;
    }
  }
  .info-container {
    background-color: rgba(0, 0, 0, 0.08);
    min-height: 164px;
    width: 100%;
    border-radius: 16px;
    position: relative;
    top: 0;
    left: 0;
    z-index: 1;
    flex-wrap: nowrap;
  }
  .qr-container {
    border-radius: 8px;
    background-color: white;
    height: 140px;
    width: 140px;
  }
}
</style>
