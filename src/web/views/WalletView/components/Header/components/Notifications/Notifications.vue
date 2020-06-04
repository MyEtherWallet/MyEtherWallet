<template>
  <div class="position--relative">
    <Notifications :open="openNotifications" :close="closeNotifications" />
    <v-btn icon @click="openNotifications = true">
      <img src="@/assets/images/icons/icon-notifications.svg" />
    </v-btn>
    <div
      class="notification-count cursor--pointer d-flex align-center justify-center white--text light_red"
      @click="openNotifications = true"
    >
      3
    </div>
  </div>
</template>

<script>
import Notifications from '@/components/Overlays/Notifications';

export default {
  components: { Notifications },
  data() {
    return {
      openNotifications: false
    };
  },
  methods: {
    closeNotifications() {
      this.openNotifications = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.notification-count {
  position: absolute;
  top: 0;
  right: -10px;
  border-radius: 100%;
  width: 18px;
  height: 18px;
  font-size: 12px;
}
</style>
