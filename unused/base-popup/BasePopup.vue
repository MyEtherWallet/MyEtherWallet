<template>
  <v-tooltip
    :open-on-click="openOnClick"
    :open-on-hover="!openOnClick"
    :right="position == 'right' ? true : false"
    :left="position == 'left' ? true : false"
    :top="position == 'top' ? true : false"
    :bottom="position == 'bottom' ? true : false"
    open-delay="0"
  >
    <template v-slot:activator="{ on }">
      <div v-on="on"><slot /></div>
    </template>
    <v-card color="transparent" :width="width" flat>
      <slot />
    </v-card>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    width: {
      type: String,
      default: ''
    },
    openOnClick: {
      type: Boolean,
      default: false
    },
    position: {
      type: String,
      default: 'top'
    }
  },
  data() {
    return {};
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
