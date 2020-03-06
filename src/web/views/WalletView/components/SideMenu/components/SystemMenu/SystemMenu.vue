<template>
  <div>
    <TxConfirmation :open="openSettings" :close="closeSettings" />
    <div @click="openSettings = true">Settings</div>
    <div>Log out</div>
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
