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

    <div
      class="menu-item cursor--pointer d-flex align-center px-3 py-2"
      @click="logoutOpen = true"
    >
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

    <mew-popup
      :is-open="logoutOpen"
      title="Are you sure you want to log out?"
      :button-left="logout.btnLeft"
      :button-right="logout.btnRight"
    ></mew-popup>
    <Settings :open="openSettings" :close="closeSettings" />
  </div>
</template>

<script>
import Settings from '@/components/Overlays/Settings';

export default {
  components: { Settings },
  data() {
    return {
      logoutOpen: false,
      logout: {
        btnLeft: {
          name: 'Cancel',
          colorTheme: 'basic'
        },
        btnRight: {
          name: 'Log out',
          colorTheme: 'error'
        }
      },
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
.menu-item {
  color: var(--v-gray_text-base);
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
