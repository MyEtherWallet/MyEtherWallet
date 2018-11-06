<template>
  <div class="full-width-dropdown-menu">
    <div class="wrap">
      <div class="title-container" @click="dropdownOpen = !dropdownOpen">
        <menu-title class="menu-title-component" :title="title" />
        <popover v-if="popup" class="popover-box" :popcontent="popup" />
        <i v-if="!dropdownOpen" class="fa fa-angle-down" aria-hidden="true"></i>
        <i v-if="dropdownOpen" class="fa fa-angle-up" aria-hidden="true"></i>
      </div>

      <div class="contents-container" :class="dropdownOpen ? 'opened' : ''">
        <div class="padding-block">
          <slot></slot>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import MenuTitle from '@/components/MenuTitle';
import PopOver from  '@/components/PopOver';

export default {
  components: {
    'menu-title': MenuTitle,
    'popover': PopOver
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
  methods: {
    
  }
};
</script>

<style lang="scss" scoped>
@import 'FullWidthDropdownMenu.scss';
</style>
