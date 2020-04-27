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
    <div class="dev-only d-flex align-center">
      <div class="text-color--dark-sacramento mr-5">
        For development only --->
      </div>
      <v-switch
        v-model="dark"
        hide-details
        inset
        color="white"
        :label="dark ? 'Dark Mode' : 'Light Mode'"
        class="ma-0 pa-0"
      />
    </div>
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
  top: 0px;
  right: 0px;
  z-index: 99999999;
  background-color: #00b9ff;
  padding: 0 10px;
  border-radius: 0 0 0 10px;
  box-shadow: 0 0 10px #0000004a;
}
</style>
