<template lang="html">
  <div class="notification-container">
    <div class="notification-logo" @click="showNotifications">
      <img class="logo-large" src="~@/assets/images/icons/notification.svg">
      <div class="notification-dot" v-show="unreadCount > 0"></div>
    </div>
    <b-modal ref="notification" hide-footer centered class="bootstrap-modal-wide nopadding" v-on:show="countUnread">
      <template slot="modal-title">
        <h5 class="modal-title"> {{unreadCount > 1 ?'Notifications':'Notification'}} <div class="notification-count" v-show="unreadCount > 0"><span>{{ unreadCount }}</span></div></h5>
      </template>
      <div class="notification-item-container">
        <div v-if="notifications[$store.state.wallet.getAddressString()] !== undefined && notifications[$store.state.wallet.getAddressString()].length > 0" v-for="(notification, idx) in notifications[$store.state.wallet.getAddressString()]" class="notification-item" :key="notification.title + notification.timestamp + idx" @click="expand(idx, notification, $event)">
          <div class="notification-header">
            <p> {{ notification.title }} </p>
            <p> {{ notification.timestamp }}</p>
          </div>
          <div class="notification-body unexpanded">
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
        self.notifications[self.$store.state.wallet.getAddressString()].reverse().forEach(item => {
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
      e.target.nextElementSibling.classList.contains('unexpanded') ? e.target.nextElementSibling.classList.remove('unexpanded') : e.target.nextElementSibling.classList.add('unexpanded')
      const updatedNotif = notif
      updatedNotif.read = true
      this.$store.dispatch('updateNotification', [this.$store.state.wallet.getAddressString(), idx, updatedNotif])
    }
  },
  mounted () {
    this.countUnread()
  },
  watch: {
    unreadCount (newVal) {
      this.unreadCount = newVal
    },
    notifications (newVal) {
      this.countUnread()
    }
  },
  computed: {
    ...mapGetters({
      notifications: 'notifications'
    })
  }
}
</script>

<style lang="scss" scoped>
@import "./Notification.scss";
</style>
