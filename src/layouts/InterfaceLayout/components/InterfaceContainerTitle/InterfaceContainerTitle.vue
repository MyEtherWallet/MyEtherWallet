<template lang="html">
  <div class="content-title">
    <h2>{{ title }} <slot></slot></h2>
    <div class="side-menu-button">
      <round-button title="Change" @click.native="toggleSideMenu" />
    </div>
  </div>
</template>

<script>
import RoundButton from '@/components/Buttons/RoundButton';

export default {
  components: {
    'round-button': RoundButton
  },
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
    toggleSideMenu() {
      this.$store.commit('TOGGLE_SIDEMENU');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'InterfaceContainerTitle.scss';
</style>
