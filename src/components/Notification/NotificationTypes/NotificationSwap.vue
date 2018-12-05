<template lang="html">
  <div class="notification-header">
    <div class="notification-type-status">
      <p class="type">Swap</p>
      <p class="status status-processing">(Processing)</p>
    </div>
    <div class="time-date">
      <p>13:20:23</p>
      <p>04/05/2018</p>
      <div class="expender-icon">
        <i aria-hidden="true" class="fa fa-angle-down"></i>
        <i aria-hidden="true" class="fa fa-angle-up"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import store from 'store';

export default {
  props: {
    details: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      unreadCount: 0
    };
  },
  computed: {
    ...mapGetters({
      notifications: 'notifications',
      wallet: 'wallet'
    }),
    sortedNotifications() {
      this.countUnread();
      if (!this.notifications[this.wallet.getChecksumAddressString()])
        return [];
      // eslint-disable-next-line
      return this.notifications[this.wallet.getChecksumAddressString()].sort(
        (a, b) => {
          a = new Date(a.timestamp);
          b = new Date(b.timestamp);

          return a > b ? -1 : a < b ? 1 : 0;
        }
      );
    }
  },
  watch: {
    notifications() {
      this.countUnread();
    }
  },
  mounted() {
    if (
      this.notifications[this.wallet.getChecksumAddressString()] === undefined
    ) {
      this.notifications[this.wallet.getChecksumAddressString()] = [];
      store.set('notifications', this.notifications);
    }
    this.countUnread();
  },
  methods: {
    countUnread() {
      const self = this;
      self.unreadCount = 0;
      if (
        self.notifications[this.wallet.getChecksumAddressString()] !==
          undefined &&
        self.notifications[this.wallet.getChecksumAddressString()].length > 0
      ) {
        self.notifications[this.wallet.getChecksumAddressString()].map(item => {
          if (item.read === false) {
            self.unreadCount++;
          }
        });
      }
    },
    showNotifications() {
      this.$refs.notification.show();
    },
    expand(idx, notif) {
      const updatedNotif = notif;
      if (notif.expanded !== true) {
        updatedNotif.read = true;
        updatedNotif.expanded = true;
      } else {
        updatedNotif.expanded = false;
      }
      this.$store.dispatch('updateNotification', [
        this.wallet.getChecksumAddressString(),
        idx,
        updatedNotif
      ]);
    }
  }
};
</script>

<style lang="scss" scoped>
@import './Notification.scss';
</style>
