<template>
  <div class="modal-container">
    <b-modal
      ref="notifications"
      title="Notifications"
      hide-footer
      centered
      class="bootstrap-modal nopadding"
    >
      <div class="title-notification-count"><p>11</p></div>

      <div class="modal-contents">
        <full-width-dropdown
          title="Transaction Speed"
          popup="What is TX speed"
          class="tx-speed"
        >
          <div class="tx-success">
            Your transaction amount <span>2.100000 ETH</span> to address
            <p>0x1d3649b580f77f8fd81a6546398d1926c49eb336</p>
            has been successfully transferred.
          </div>
        </full-width-dropdown>
        <full-width-dropdown
          title="Import Configurations"
          class="import-config"
        >
        </full-width-dropdown>
        <full-width-dropdown
          title="Export Configurations"
          class="export-config"
        >
        </full-width-dropdown>
      </div>
      <!-- .modal-contents -->
    </b-modal>
  </div>
</template>

<script>
import NotificationDropdownMenu from './components/NotificationDropdownMenu';

export default {
  name: 'Settings',
  components: {
    'full-width-dropdown': NotificationDropdownMenu
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    modalOpen() {
      this.$refs.notifications.show();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'NotificationsModal.scss';
</style>
