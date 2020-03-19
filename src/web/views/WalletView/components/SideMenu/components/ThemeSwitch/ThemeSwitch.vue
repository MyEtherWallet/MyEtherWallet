<template>
  <div>
    <v-switch
      v-model="dark"
      hide-details
      inset
      dark
      :label="dark ? 'Dark Mode' : 'Light Mode'"
      color="white"
      background-color="gray"
    />
    <v-switch
      v-model="dark"
      hide-details
      inset
      color="white"
      :label="dark ? 'Dark Mode' : 'Light Mode'"
      class="dev-only"
    />
  </div>
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
.dev-only {
  position: fixed;
  bottom: 10px;
  left: 10px;
  z-index: 99999999;
  background-color: orange;
  padding: 10px;
  border-radius: 20px;
}
</style>
