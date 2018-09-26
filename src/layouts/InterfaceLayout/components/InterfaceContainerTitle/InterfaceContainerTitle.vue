<template lang="html">
  <div class="content-title">
    <h2>{{ title }}</h2>
    <p 
      class="side-menu-button" 
      @click="toggleSidemenu">Change</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  },

  methods: {
    toggleSidemenu() {
      this.$store.state.Transactions.sidemenuOpen = !this.$store.state
        .Transactions.sidemenuOpen;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'InterfaceContainerTitle.scss';
</style>
