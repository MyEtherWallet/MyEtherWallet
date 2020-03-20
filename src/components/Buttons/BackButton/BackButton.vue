<template>
  <v-btn
    text
    class="text-transform--initial body-2 theme--light-text--dark-space dark-text-blue"
    height="50px"
  >
    <v-icon class="mr-1 display-1">mdi-arrow-left-circle-outline</v-icon
    >{{ text }}
  </v-btn>
</template>

<script>
export default {
  props: {
    text: { default: '', type: String }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables.scss';

#app.theme--dark .dark-text-blue {
  color: #7d92b7 !important;
}
</style>
