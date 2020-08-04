<template>
  <div class="mew-component--theme-switch">
    <v-switch
      v-model="dark"
      inset
      :label="dark ? 'Dark Mode' : 'Light Mode'"
      color="gray"
      off-icon="mdi-alert-circle"
    />
    <!-- For Development Only ------------------------------------------------->
    <div class="dev-only d-flex align-center">
      <div class="white--text mr-5">
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
    <!-- For Development Only ------------------------------------------------->
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
  background-color: #8b8b8b;
  padding: 0 10px;
  border-radius: 0 0 0 10px;
  box-shadow: 0 0 10px #0000004a;
}
</style>

<style lang="scss">
.mew-component--theme-switch {
  .v-input--switch .v-input--switch__track {
    color: #ffffff91 !important;
  }
  .v-label {
    font-size: 14px;
  }
  .theme--light.v-label {
    color: white;
  }
}

.mew-component--theme-switch .theme--light.v-input--switch__thumb::after {
  content: '☀';
  font-size: 20px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  color: black;
  text-align: center;
}

.mew-component--theme-switch .theme--dark.v-input--switch__thumb::after {
  content: '☾';
  font-size: 20px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  color: black;
  text-align: center;
}
</style>
