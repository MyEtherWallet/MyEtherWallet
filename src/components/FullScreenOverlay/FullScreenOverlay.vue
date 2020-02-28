<template>
  <div>
    <v-overlay
      :absolute="absolute"
      :opacity="opacity"
      :value="overlay"
      :z-index="zIndex"
    >
      <v-btn color="primary" @click="overlay = false">
        Hide Overlay
      </v-btn>
    </v-overlay>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    width: { default: false, type: Boolean }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables.scss';
</style>
