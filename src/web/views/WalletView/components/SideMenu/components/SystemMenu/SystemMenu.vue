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
          <div>Log out</div>
        </div>
      </v-list-item>
    </v-list>

    <TxConfirmation :open="openSettings" :close="closeSettings" />
  </div>
</template>

<script>
import TxConfirmation from '@/components/Overlays/TxConfirmation';

export default {
  components: { TxConfirmation },
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
