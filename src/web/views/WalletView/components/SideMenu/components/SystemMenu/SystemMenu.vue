<template>
  <div>
    <v-list color="transparent">
      <v-list-item>
        <div
          class="cursor--pointer d-flex align-center"
          @click="openSettings = true"
        >
          <img
            width="23"
            height="23"
            src="@/assets/images/icons/icon-swap-dark.svg"
            class="mr-3"
          />
          <div>Settings</div>
        </div>
      </v-list-item>
      <v-list-item>
        <div class="cursor--pointer d-flex align-center">
          <img
            width="23"
            height="23"
            src="@/assets/images/icons/icon-swap-dark.svg"
            class="mr-3"
          />
          <div>Log out</div>
        </div>
      </v-list-item>
    </v-list>

    <Settings :open="openSettings" :close="closeSettings" />
  </div>
</template>

<script>
import Settings from '@/components/Overlays/Settings';

export default {
  components: { Settings },
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
div {
  color: white;
}
</style>
