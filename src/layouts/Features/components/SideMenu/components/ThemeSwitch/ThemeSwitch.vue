<template>
  <v-switch
    v-model="dark"
    hide-details
    inset
    dark
    :label="dark ? 'Dark Mode' : 'Light Mode'"
    color="white"
    background-color="gray"
  ></v-switch>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      dark: this.$vuetify.theme.dark
    };
  },
  watch: {
    dark(newVal) {
      this.$vuetify.theme.dark = newVal;
    }
  }
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables.scss';
</style>
