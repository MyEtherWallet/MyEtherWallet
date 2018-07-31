<template lang="html">
  <div class="notification-container">
    <div class="notification-logo" @click="showNotifications">
      <img class="logo-large" src="~@/assets/images/icons/notification.svg">
      <div class="notification-dot" v-show="unreadCount > 0"></div>
    </div>
    <b-modal ref="notification" hide-footer centered class="bootstrap-modal-wide nopadding" v-on:show="countUnread">
      <template slot="modal-title">
        <h5 class="modal-title"> {{unreadCount > 1 ? 'Notifications':'Notification'}} <div class="notification-count" v-show="unreadCount > 0"><span>{{ unreadCount }}</span></div></h5>
      </template>
      <div class="notification-item-container">
        <div v-if="sortedNotifications !== undefined && sortedNotifications.length > 0" v-for="(notification, idx) in sortedNotifications" class="notification-item" :key="notification.title + notification.timestamp + idx" @click="expand(idx, notification, $event)">
          <div class="notification-header">
            <p :class="[notification.read? '': 'unread']"> {{ notification.title }} </p>
            <p :class="[notification.read? '': 'unread']"> {{ notification.timestamp }}</p>
          </div>
          <div :class="[notification.expanded?'':'unexpanded', 'notification-body']">
            <code>
              {{ notification.body }}
            </code>
          </div>
        </div>
        <div class="notification-no-item" v-else>
          No notifications found :(
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      unreadCount: 0
    }
  },
  methods: {
    countUnread () {
      const self = this
      self.unreadCount = 0
      if (self.notifications[self.$store.state.wallet.getAddressString()] !== undefined && self.notifications[self.$store.state.wallet.getAddressString()].length > 0) {
        self.notifications[self.$store.state.wallet.getAddressString()].map(item => {
          if (item.read === false) {
            self.unreadCount++
          }
        })
      }
    },
    showNotifications () {
      this.$refs.notification.show()
    },
    expand (idx, notif, e) {
      // e.target.nextElementSibling.classList.contains('unexpanded') ? e.target.nextElementSibling.classList.remove('unexpanded') : e.target.nextElementSibling.classList.add('unexpanded')
      const updatedNotif = notif
      if (notif.expanded !== true) {
        updatedNotif.read = true
        updatedNotif.expanded = true
      } else {
        updatedNotif.expanded = false
      }
      this.$store.dispatch('updateNotification', [this.$store.state.wallet.getAddressString(), idx, updatedNotif])
    }
  },
  mounted () {
    this.countUnread()
  },
  watch: {
    notifications (newVal) {
      this.countUnread()
    }
  },
  computed: {
    ...mapGetters({
      notifications: 'notifications'
    }),
    sortedNotifications () {
      this.countUnread()
      // eslint-disable-next-line
      return this.notifications[this.$store.state.wallet.getAddressString()].sort((a, b) => {
        a = new Date(a.timestamp)
        b = new Date(b.timestamp)

        return a > b ? -1 : a < b ? 1 : 0
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./Notification.scss";
</style>
