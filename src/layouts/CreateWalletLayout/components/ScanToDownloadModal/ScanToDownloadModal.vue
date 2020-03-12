<template>
  <b-modal
    ref="scantodownload"
    :title="$t('createWallet.mew-wallet.scan')"
    hide-footer
    centered
    class="bootstrap-modal no-padding"
    static
    lazy
  >
    <div class="qr-divider">
      <div class="ios">
        <div class="qr-image">
          <img alt src="@/assets/images/etc/qr-code-apple.png" />
        </div>
        <div class="store-name-container">
          <div class="store-name">
            <img alt src="@/assets/images/icons/apple.svg" />
            <p>{{ $t('createWallet.mew-wallet.ios') }}</p>
          </div>
        </div>
        <p>{{ $t('createWallet.mew-wallet.version.ios') }}</p>
      </div>
      <div class="android">
        <div class="qr-image">
          <img alt src="@/assets/images/etc/qr-code-android.png" />
        </div>
        <div class="store-name-container">
          <div class="store-name">
            <img alt src="@/assets/images/icons/android.svg" />
            <p>{{ $t('createWallet.mew-wallet.android') }}</p>
          </div>
        </div>
        <p>{{ $t('createWallet.mew-wallet.version.android') }}</p>
      </div>
    </div>
  </b-modal>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import 'ScanToDownloadModal.scss';
</style>
