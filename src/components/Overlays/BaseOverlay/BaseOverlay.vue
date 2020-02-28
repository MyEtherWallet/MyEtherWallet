<template>
  <v-overlay color="white" opacity="1" :value="overlay" z-index="100">
    <slot />
    <v-btn @click="overlay = false">Close</v-btn>
  </v-overlay>
</template>

<script>
export default {
  props: {
    open: { default: false, type: Boolean }
  },
  data() {
    return {
      overlay: this.open
    };
  },
  watch: {
    open(newVal) {
      this.overlay = newVal;
    }
  }
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables.scss';
.v-overlay {
  border-radius: 0;
}
</style>
