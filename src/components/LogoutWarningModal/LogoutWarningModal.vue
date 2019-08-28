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
        <h2>{{ $t('common.oops') }}</h2>
        <p>{{ $t('common.logoutWarning') }}</p>
        <div class="buttons">
          <standard-button :options="buttonNo" @click.native="cancel" />
          <standard-button :options="buttonYes" @click.native="logout" />
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'LogoutWarning',
  data() {
    return {
      buttonNo: {
        title: this.$t('common.goBack'),
        buttonStyle: 'green-border',
        rightArrow: false,
        leftArrow: false,
        fullWidth: true,
        noMinWidth: true
      },
      buttonYes: {
        title: this.$t('common.logOutWallet'),
        buttonStyle: 'red',
        rightArrow: false,
        leftArrow: false,
        fullWidth: true,
        noMinWidth: true
      }
    };
  },
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
      this.$router.push('interface');
      this.$refs.logoutWarningModal.hide();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'LogoutWarningModal.scss';
</style>
