<template lang="html">
  <div class="content-title">
    <h2>{{ title }}</h2>
    <div class="side-menu-button"><round-button title="Change" /></div>
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
  }
};
</script>

<style lang="scss" scoped>
@import 'InterfaceContainerTitle.scss';
</style>
