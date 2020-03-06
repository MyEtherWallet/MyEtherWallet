<template>
  <div class="position--relative">
    <ChangeAddress :open="openChangeAddress" :close="closeChangeAddress" />
    <v-btn icon @click="openChangeAddress = true">
      <img src="@/assets/images/Icons/notifications.svg" />
    </v-btn>
    <div
      class="notification-count cursor--pointer d-flex align-center justify-center"
      @click="openChangeAddress = true"
    >
      3
    </div>
  </div>
</template>

<script>
import ChangeAddress from '@/components/Overlays/ChangeAddress';

export default {
  components: { ChangeAddress },
  data() {
    return {
      openChangeAddress: false
    };
  },
  methods: {
    closeChangeAddress() {
      this.openChangeAddress = false;
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
