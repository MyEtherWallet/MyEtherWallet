<template>
  <b-modal
    ref="walletLaunch"
    class="wallet-launch-modal"
    hide-footer
    hide-header
    centered
    static
    lazy
  >
    <div>
      <div class="close-container">
        <button
          type="button"
          aria-label="Close"
          class="close pr-3 pt-2"
          @click="closeModal()"
        >
          X
        </button>
      </div>
      <div class="modal-container">
        <div class="left-container">
          <div class="header-container">
            <span>{{ $t('home.mew-wallet-modal.title') }}</span>
          </div>
          <i18n class="pb-4 body-txt" tag="p" path="home.mew-wallet-modal.text">
            <a
              slot="learn-more"
              target="_blank"
              href="https://www.mewwallet.com/"
            >
              {{ $t('home.mew-wallet-modal.learn-more') }}...
            </a>
          </i18n>
          <div class="btn-container">
            <a v-for="(btn, idx) in storeButtons" :key="idx" :href="btn.url">
              <img :src="btn.src" alt="App button" />
            </a>
          </div>
          <p class="footer-txt pt-4">
            {{ $t('home.mew-wallet-modal.footer-text') }}
          </p>
        </div>
        <div class="right-container">
          <img
            src="@/assets/images/icons/snippet-mew-wallet.png"
            alt="MEW wallet screenshot"
          />
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import appStore from '@/assets/images/icons/button-app-store.png';
import googlePlay from '@/assets/images/icons/button-google-play-color.png';
import galaxyStore from '@/assets/images/icons/button-galaxy-store-color.png';

export default {
  data() {
    return {
      storeButtons: [
        {
          src: appStore,
          url: 'https://itunes.apple.com/app/id1464614025'
        },
        {
          src: googlePlay,
          url: ''
        },
        {
          src: galaxyStore,
          url: ''
        }
      ]
    };
  },
  methods: {
    closeModal() {
      this.$refs.walletLaunch.hide();
    }
  }
};
</script>

<style lang="scss">
@import 'WalletLaunchedModal.scss';

.wallet-launch-modal {
  .modal-body {
    padding: 0;
  }
  .modal-dialog {
    max-width: 820px;
  }
}

@media screen and (max-width: 820px) {
  .wallet-launch-modal {
    .modal-dialog {
      max-width: 500px !important;
    }
  }
}
</style>
