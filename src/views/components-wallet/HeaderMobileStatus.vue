<template>
  <v-tooltip open-on-click :open-on-hover="false" bottom open-delay="0">
    <template #activator="{ on }">
      <div class="user-select--none" v-on="on"><slot /></div>
    </template>
    <v-card color="transparent" width="180px" class="px-1 py-3" flat>
      <div class="d-flex justify-space-between mb-1">
        <div>Status:</div>
        <div class="greenPrimary--text font-weight-bold">Connected</div>
      </div>
      <div class="d-flex justify-space-between mb-1">
        <div>Device:</div>
        <div>iPhone 6</div>
      </div>
      <div class="d-flex justify-space-between mb-3">
        <div>Duration:</div>
        <div>04:23:31</div>
      </div>
      <mew-button btn-size="xlarge" color-theme="error" title="Disconnect" />
    </v-card>
  </v-tooltip>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
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
