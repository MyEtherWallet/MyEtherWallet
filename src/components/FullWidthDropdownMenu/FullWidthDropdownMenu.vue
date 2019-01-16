<template>
  <div class="full-width-dropdown-menu">
    <div class="wrap">
      <div class="title-container" @click="dropdownOpen = !dropdownOpen">
        <menu-title :title="title" class="menu-title-component" />
        <popover v-if="popup" :popcontent="popup" class="popover-box" />
        <i v-if="!dropdownOpen" class="fa fa-angle-down" aria-hidden="true" />
        <i v-if="dropdownOpen" class="fa fa-angle-up" aria-hidden="true" />
      </div>

      <div :class="dropdownOpen ? 'opened' : ''" class="contents-container">
        <div class="padding-block"><slot /></div>
      </div>
    </div>
  </div>
</template>

<script>
import MenuTitle from '@/components/MenuTitle';
import PopOver from '@/components/PopOver';

export default {
  components: {
    'menu-title': MenuTitle,
    popover: PopOver
  },
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
@import 'FullWidthDropdownMenu.scss';
</style>
