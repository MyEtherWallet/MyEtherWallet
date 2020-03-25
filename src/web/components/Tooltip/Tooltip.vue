<template>
  <v-tooltip top>
    <template v-slot:activator="{ on }">
      <div v-on="on"><slot /></div>
    </template>
    <div>{{ text }}</div>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  },
  methods: {}
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
