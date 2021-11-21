<template>
  <div class="d-flex align-center py-4 px-1">
    <div class="ml-auto d-flex align-center">
      <div class="align-center d-none d-lg-block">
        <notification-overlay />
      </div>
    </div>
  </div>
</template>

<script>
// import mobileStatus from './HeaderMobileStatus';
import notificationOverlay from '@/modules/notifications/ModuleNotifications';
import { mapState } from 'vuex';
export default {
  components: {
    notificationOverlay
    // mobileStatus
  },
  computed: {
    ...mapState('wallet', ['identifier'])
  }
};
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
  color: var(--v-primary-base) !important;
  font-weight: 500;
}

.mew-connect-text > div {
  font-size: 12px;
  line-height: 15px;
  font-weight: 500;
  color: var(--v-primary-base);
}
</style>

<style lang="scss"></style>
