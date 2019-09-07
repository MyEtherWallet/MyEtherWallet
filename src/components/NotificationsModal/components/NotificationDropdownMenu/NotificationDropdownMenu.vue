<template>
  <div class="full-width-dropdown-menu">
    <div class="wrap">
      <div class="title-container" @click="dropdownOpen = !dropdownOpen">
        <p class="notification-title">{{ title }}</p>
        <p class="time">13:20:23&nbsp;&nbsp;11/11/2018</p>
        <i v-if="!dropdownOpen" class="fa fa-angle-down" aria-hidden="true" />
        <i v-if="dropdownOpen" class="fa fa-angle-up" aria-hidden="true" />
      </div>
      <!-- .title-container -->

      <div :class="dropdownOpen ? 'opened' : ''" class="contents-container">
        <div class="padding-block"><slot /></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    title: {
      type: String,
      default: ''
    },
    popup: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dropdownOpen: false
    };
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'NotificationDropdownMenu.scss';
</style>
