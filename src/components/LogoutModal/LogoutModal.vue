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
        <h2>Are you sure you want to logout of your wallet?</h2>

        <div class="buttons">
          <button class="no" @click="cancel">No</button>
          <button class="yes" @click="logout">Yes</button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'Logout',
  data() {
    return {};
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
