<template>
  <b-modal
    ref="scantodownload"
    :title="$t('createWallet.scanToDownload')"
    hide-footer
    centered
    class="bootstrap-modal no-padding"
  >
    <div class="qr-divider">
      <div class="ios">
        <div class="qr-image">
          <img src="@/assets/images/etc/qr-code-apple.png" />
        </div>
        <div class="store-name-container">
          <div class="store-name">
            <img src="@/assets/images/icons/apple.svg" />
            <p>iOS</p>
          </div>
        </div>
        <p>{{ $t('createWallet.iosVersions') }}</p>
      </div>
      <div class="android">
        <div class="qr-image">
          <img src="@/assets/images/etc/qr-code-android.png" />
        </div>
        <div class="store-name-container">
          <div class="store-name">
            <img src="@/assets/images/icons/android.svg" />
            <p>Android</p>
          </div>
        </div>
        <p>{{ $t('createWallet.androidVersions') }}</p>
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
