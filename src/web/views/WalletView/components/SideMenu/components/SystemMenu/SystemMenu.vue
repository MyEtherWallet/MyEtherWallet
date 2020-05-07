<template>
  <div>
    <div
      class="menu-item cursor--pointer d-flex align-center px-3 py-2"
      @click="openSettings = true"
    >
      <img
        width="26"
        height="26"
        src="@/assets/images/icons/icon-setting-disable.png"
        class="mr-3 dark"
      />
      <img
        width="26"
        height="26"
        src="@/assets/images/icons/icon-setting-enable.png"
        class="mr-3 light"
      />
      <div>Settings</div>
    </div>
    <LogoutDialog>
      <div class="menu-item cursor--pointer d-flex align-center px-3 py-2">
        <img
          width="26"
          height="26"
          src="@/assets/images/icons/icon-logout-disable.png"
          class="mr-3 dark"
        />
        <img
          width="26"
          height="26"
          src="@/assets/images/icons/icon-logout-enable.png"
          class="mr-3 light"
        />
        <div>Log out</div>
      </div>
    </LogoutDialog>

    <Settings :open="openSettings" :close="closeSettings" />
  </div>
</template>

<script>
import Settings from '@/components/Overlays/Settings';
import LogoutDialog from '@/components/Dialogs/LogoutDialog';

export default {
  components: { Settings, LogoutDialog },
  data() {
    return {
      openSettings: false
    };
  },
  methods: {
    closeSettings() {
      this.openSettings = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables.scss';

.menu-item {
  color: $gray-1;
}

.light {
  display: none;
}

.menu-item:hover {
  color: white;
  background-color: #0000001f;
  .light {
    display: block;
  }
  .dark {
    display: none;
  }
}
</style>
