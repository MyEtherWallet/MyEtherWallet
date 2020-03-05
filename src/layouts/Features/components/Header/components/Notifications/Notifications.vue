<template>
  <div>
    <ChangeAddress :open="openChangeAddress" :close="closeChangeAddress" />
    <v-btn icon @click="openChangeAddress = true">
      <img src="@/assets/images/Icons/notifications.svg" />
    </v-btn>
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

a {
  text-decoration: none;
  color: $emerald !important;
  font-weight: 500;
}
</style>
