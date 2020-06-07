<template>
  <v-card
    class="shadow pa-8 d-flex flex-column"
    outlined
    :max-width="side ? '400px' : ''"
  >
    <slot />
  </v-card>
</template>

<script>
export default {
  components: {},
  props: {
    side: { default: false, type: Boolean }
  }
};
</script>

<style lang="scss" scoped>
.shadow {
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.04);
}
h4 {
  font-size: 22px;
  letter-spacing: -0.6px;
}
.v-card {
  border-radius: 10px !important;
}
</style>
