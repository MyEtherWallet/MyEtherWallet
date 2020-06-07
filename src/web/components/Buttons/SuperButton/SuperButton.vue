<template>
  <v-btn :to="to">
    <slot />
  </v-btn>
</template>

<script>
export default {
  props: { to: { default: () => {}, type: Object } },
  data() {
    return {};
  }
};
</script>
