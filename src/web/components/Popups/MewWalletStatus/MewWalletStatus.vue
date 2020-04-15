<template>
  <v-tooltip v-model="show" bottom open-delay="0">
    <template v-slot:activator="{ on }">
      <div v-on="on"><slot /></div>
    </template>
    <v-card width="180px" class="px-1 py-3" flat>
      <div class="d-flex justify-space-between mb-1">
        <div>Status:</div>
        <div class="emerald--text font-weight-bold">Connected</div>
      </div>
      <div class="d-flex justify-space-between mb-1">
        <div>Device:</div>
        <div>iPhone 6</div>
      </div>
      <div class="d-flex justify-space-between mb-3">
        <div>Duration:</div>
        <div>04:23:31</div>
      </div>
      <StdButton fullwidth no-min-width size="x-large" color="light_red">
        Disconnect
      </StdButton>
    </v-card>
  </v-tooltip>
</template>

<script>
import StdButton from '@/web/components/StdButton';

export default {
  components: { StdButton },
  props: { open: { default: false, type: Boolean } },
  data() {
    return { show: false };
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables.scss';

.theme--light .v-tooltip__content {
  color: #383838;
  background: white;
  box-shadow: 0 0 20px #00000040;
  opacity: 1 !important;
}

.theme--dark .v-tooltip__content {
  color: White;
  background: black;
  box-shadow: 0 0 20px #ffffff40;
  opacity: 1 !important;
}
</style>
