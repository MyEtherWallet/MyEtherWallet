<template>
  <div class="modal-container">
    <b-modal
      ref="logout"
      hide-footer
      hide-header
      centered
      class="bootstrap-modal nopadding"
    >
      <div class="modal-contents">
        <h2>Are you sure to logout your wallet?</h2>

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
  name: 'Logout',
  data() {
    return {
      buttonNo: {
        title: 'No',
        buttonStyle: 'green-border',
        rightArrow: false,
        leftArrow: false,
        fullWidth: true,
        noMinWidth: true
      },
      buttonYes: {
        title: 'Yes',
        buttonStyle: 'green',
        rightArrow: false,
        leftArrow: false,
        fullWidth: true,
        noMinWidth: true
      }
    };
  },
  methods: {
    logout() {
      this.$store.dispatch('clearWallet');
      this.$refs.logout.hide();
      this.$router.push('/');
    },
    cancel() {
      this.$refs.logout.hide();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'LogoutModal.scss';
</style>
