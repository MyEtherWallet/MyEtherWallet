<template lang="html">
  <div>
    <b-modal
      ref="expiredNames"
      title="Expired ENS Names!"
      hide-footer
      class="bootstrap-modal nopadding max-height-1"
      centered
      static
      lazy
    >
      <div class="ens-notification-container">
        <h3>
          You have one or more ENS domains expiring soon. You will have a 90 day
          grace period after your expiration date to renew, otherwise they will
          become available to the public for purchase.
        </h3>
        <button class="navigate-btn" @click="navigateToEnsManager">
          Go to ENS Manager
        </button>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    navigateToEnsManager() {
      this.$router.push({ name: 'ensMultiManager' });
      this.$refs.expiredNames.hide();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ExpiredNamesModal.scss';
</style>
