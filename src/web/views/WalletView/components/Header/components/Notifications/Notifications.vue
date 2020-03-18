<template>
  <div class="position--relative">
    <Notifications :open="openNotifications" :close="closeNotifications" />
    <v-btn icon @click="openNotifications = true">
      <img src="@/assets/images/Icons/notifications.svg" />
    </v-btn>
    <div
      class="notification-count cursor--pointer d-flex align-center justify-center"
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
@import '@/assets/styles/GlobalVariables.scss';

.notification-count {
  position: absolute;
  top: 0;
  right: -10px;
  border-radius: 100%;
  background-color: red;
  width: 18px;
  height: 18px;
  color: white;
  font-size: 12px;
}
</style>
