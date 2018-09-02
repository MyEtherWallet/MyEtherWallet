<template>
  <b-modal 
    ref="scantodownload" 
    hide-footer 
    centered 
    class="bootstrap-modal no-padding" 
    title="Scan To Download">

    <div class="qr-divider">
      <div class="ios">
        <div class="qr-image">
          <img src="@/assets/images/etc/qr-code.png">
        </div>
        <div class="store-name-container">
          <div class="store-name">
            <img src="@/assets/images/icons/apple.svg">
            <p>iOS</p>
          </div>
        </div>
        <p>iOS 9.0 or up</p>
      </div>
      <div class="android">
        <div class="qr-image">
          <img src="@/assets/images/etc/qr-code.png">
        </div>
        <div class="store-name-container">
          <div class="store-name">
            <img src="@/assets/images/icons/android.svg">
            <p>Android</p>
          </div>
        </div>
        <p>Android 8.0 or up</p>
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
