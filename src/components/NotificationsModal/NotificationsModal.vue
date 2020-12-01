<template>
  <div class="modal-container">
    <b-modal
      ref="notifications"
      :title="$tc('common.notifications.title', 2)"
      hide-footer
      centered
      class="bootstrap-modal nopadding"
      static
      lazy
    >
      <div class="title-notification-count"><p>11</p></div>

      <div class="modal-contents">
        <full-width-dropdown
          :title="$t('interface.config.tx-speed')"
          popup="What is TX speed"
          class="tx-speed"
        >
          <div class="tx-success">
            {{ $t('notifications.your-transaction-amount') }}
            <span>2.100000 {{ $t('common.currency.eth') }}</span>
            {{ $t('notifications.to-address') }}
            <p>0x1d3649b580f77f8fd81a6546398d1926c49eb336</p>
            {{ $t('notifications.successfully-transferred') }}
          </div>
        </full-width-dropdown>
        <full-width-dropdown
          :title="$t('interface.config.import')"
          class="import-config"
        >
        </full-width-dropdown>
        <full-width-dropdown
          :title="$t('interface.config.export')"
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
