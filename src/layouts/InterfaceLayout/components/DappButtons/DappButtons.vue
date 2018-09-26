<template>
  <div @click.prevent="switcher">
    <div :class="['dapps-button', active ? '': 'disabled']">
      <img :src="icon">
      <h4>{{ title }}</h4>
      <p>{{ desc }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    switcher() {
      this.$emit('click');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'DappButtons.scss';
</style>
