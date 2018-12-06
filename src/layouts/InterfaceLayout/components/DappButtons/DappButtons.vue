<template>
  <router-link :to="param">
    <div :class="['dapps-button', active ? '' : 'disabled']">
      <img :src="icon" />
      <div class="button-info">
        <h4>{{ title }}</h4>
        <p>{{ desc }}</p>
      </div>
    </div>
  </router-link>
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
    },
    param: {
      type: String,
      default: ''
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'DappButtons.scss';
</style>
