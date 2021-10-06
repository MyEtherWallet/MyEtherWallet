<template>
  <div class="mew-component--theme-switch">
    <v-switch
      v-model="dark"
      inset
      :label="dark ? 'Dark Mode' : 'Light Mode'"
      color="gray"
      off-icon="mdi-alert-circle"
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

<style lang="scss">
.mew-component--theme-switch,
.matomo-tracking-switch {
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
