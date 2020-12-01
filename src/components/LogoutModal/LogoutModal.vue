<template>
  <div class="modal-container">
    <b-modal
      ref="logout"
      hide-footer
      hide-header
      centered
      class="bootstrap-modal nopadding"
      static
      lazy
    >
      <div class="modal-contents">
        <h2>{{ $t('common.confirm-logout') }}</h2>

        <div class="buttons">
          <button class="no" @click="cancel">{{ $t('common.no') }}</button>
          <button class="yes" @click="logout">{{ $t('common.yes') }}</button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  name: 'Logout',
  data() {
    return {};
  },
  methods: {
    ...mapActions('main', ['clearWallet']),
    logout() {
      this.clearWallet('clearWallet');
      this.$refs.logout.hide();
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
