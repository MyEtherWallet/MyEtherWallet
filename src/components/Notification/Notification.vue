<template lang="html">
  <div class="notification-container">
    <div class="notification-logo" @click="showNotifications">
      <img class="logo-large" src="~@/assets/images/icons/notification.svg" />
      <div v-show="unreadCount > 0" class="notification-dot" />
    </div>
    <b-modal
      ref="notification"
      hide-footer
      centered
      no-padding
      class="bootstrap-modal-wide nopadding"
      @show="countUnread"
    >
      <template slot="modal-title">
        {{ unreadCount > 1 ? 'Notifications' : 'Notification' }}
        <div v-show="unreadCount >= 0" class="notification-count">
          <span>{{ unreadCount }}</span>
        </div>
      </template>
      <div class="notification-item-container">
        <ul>
          <li>
            <div class="notification-header">
              <div class="notification-type-status">
                <p class="type">Transaction</p>
                <p class="status status-succeed">(Succeed)</p>
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
          </li>
          <li>
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
            <div class="notification-content">
              <ul>
                <li>
                  <p>Amount:</p>
                  <p>2.100000 ETH</p>
                </li>
                <li>
                  <p>To Address:</p>
                  <p>
                    <a href="/" target="_blank">
                      0xbfe394bf28b7cbf72e7656e0e6740b196521b074
                    </a>
                  </p>
                </li>
                <li>
                  <p>TX Fee:</p>
                  <p>0.100000346482 ETH ($0.09)</p>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <div class="notification-header">
              <div class="notification-type-status">
                <p class="type">Transaction</p>
                <p class="status status-failed">(Failed)</p>
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
          </li>
        </ul>
        <div
          v-if="
            sortedNotifications !== undefined && sortedNotifications.length > 0
          "
        >
          <div
            v-for="(notification, idx) in sortedNotifications"
            :key="notification.title + notification.timestamp + idx"
            class="notification-item"
          >
            <div
              class="notification-header"
              @click="expand(idx, notification, $event)"
            >
              <p :class="[notification.read ? '' : 'unread']">
                {{ notification.title }}
              </p>
              <p :class="[notification.read ? '' : 'unread']">
                {{ notification.timestamp }}
              </p>
            </div>
            <div
              :class="[
                notification.expanded ? '' : 'unexpanded',
                'notification-body'
              ]"
            >
              {{ notification.body }}
            </div>
          </div>
        </div>
        <div v-else class="notification-no-item">No notifications found :(</div>
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
