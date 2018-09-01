<template lang="html">
  <div class="notification-container">
    <div
      class="notification-logo"
      @click="showNotifications">
      <img
        class="logo-large"
        src="~@/assets/images/icons/notification.svg">
      <div
        v-show="unreadCount > 0"
        class="notification-dot"/>
    </div>
    <b-modal
      ref="notification"
      hide-footer
      centered
      class="bootstrap-modal-wide nopadding"
      @show="countUnread">
      <template slot="modal-title">
        <h5 class="modal-title"> {{ unreadCount > 1 ? 'Notifications':'Notification' }}
          <div
            v-show="unreadCount > 0"
            class="notification-count"><span>{{ unreadCount }}</span>
          </div>
        </h5>
      </template>
      <div class="notification-item-container">
        <div v-if="sortedNotifications !== undefined && sortedNotifications.length > 0">
          <div
            v-for="(notification, idx) in sortedNotifications"
            :key="notification.title + notification.timestamp + idx"
            class="notification-item">
            <div
              class="notification-header"
              @click="expand(idx, notification, $event)">
              <p :class="[notification.read? '': 'unread']"> {{ notification.title }} </p>
              <p :class="[notification.read? '': 'unread']"> {{ notification.timestamp }}</p>
            </div>
            <div :class="[notification.expanded?'':'unexpanded', 'notification-body']">
              {{ notification.body }}
            </div>
          </div>
        </div>
        <div
          v-else
          class="notification-no-item">
          No notifications found :(
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import store from 'store';

export default {
  data() {
    return {
      unreadCount: 0
    };
  },
  computed: {
    ...mapGetters({
      notifications: 'notifications'
    }),
    sortedNotifications() {
      this.countUnread();

      if (!this.notifications[this.$store.state.wallet.getAddressString()])
        return [];
      // eslint-disable-next-line
      return this.notifications[this.$store.state.wallet.getAddressString()].sort((a, b) => {
        a = new Date(a.timestamp);
        b = new Date(b.timestamp);

        return a > b ? -1 : a < b ? 1 : 0;
      });
    }
  },
  watch: {
    notifications() {
      this.countUnread();
    }
  },
  mounted() {
    if (
      this.notifications[this.$store.state.wallet.getAddressString()] ===
      undefined
    ) {
      this.notifications[this.$store.state.wallet.getAddressString()] = [];
      store.set('notifications', this.notifications);
    }
    this.countUnread();
  },
  methods: {
    countUnread() {
      const self = this;
      self.unreadCount = 0;
      if (
        self.notifications[self.$store.state.wallet.getAddressString()] !==
          undefined &&
        self.notifications[self.$store.state.wallet.getAddressString()].length >
          0
      ) {
        self.notifications[self.$store.state.wallet.getAddressString()].map(
          item => {
            if (item.read === false) {
              self.unreadCount++;
            }
          }
        );
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
        this.$store.state.wallet.getAddressString(),
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
