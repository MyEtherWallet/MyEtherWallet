<template>
  <div class="modal-container">
    <b-modal
      ref="logoutWarningModal"
      hide-footer
      hide-header
      centered
      class="bootstrap-modal nopadding"
      static
      lazy
    >
      <div class="modal-contents">
        <h2>{{ $t('interface.oops') }}</h2>
        <p>{{ $t('interface.logout-warning') }}</p>
        <div class="buttons">
          <standard-button
            :options="{
              title: $t('interface.go-back'),
              buttonStyle: 'green-border',
              rightArrow: false,
              leftArrow: false,
              fullWidth: true,
              noMinWidth: true
            }"
            :click-function="cancel"
          />
          <standard-button
            :options="{
              title: $t('interface.logout-wallet'),
              buttonStyle: 'red',
              rightArrow: false,
              leftArrow: false,
              fullWidth: true,
              noMinWidth: true
            }"
            :click-function="logout"
          />
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'LogoutWarning',
  methods: {
    logout() {
      const path = this.$route.fullPath;
      if (path !== '/interface') {
        this.$store.dispatch('setLastPath', path);
      }
      this.$store.dispatch('clearWallet');
      this.$store.dispatch('setLastPath', '');
      this.$refs.logoutWarningModal.hide();
    },
    cancel() {
      this.$router.go(-1);
      this.$refs.logoutWarningModal.hide();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'LogoutWarningModal.scss';
</style>
