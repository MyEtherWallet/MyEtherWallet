<template>
  <tippy-component
    class="mew-tooltip"
    style="line-height: 1px"
    arrow
    theme="light"
    :max-width="maxWidth"
    :content="text"
  >
    <!-- Popover trigger -->
    <template #trigger>
      <v-icon v-if="!hideIcon" class="cursor-pointer" color="searchText" small>
        mdi-information
      </v-icon>
      <slot name="activatorSlot" />
    </template>
    <!-- Popover content -->
    <slot name="contentSlot" />
  </tippy-component>
</template>

<script>
import { TippyComponent } from 'vue-tippy';
export default {
  name: 'MewTooltip',
  components: {
    TippyComponent
  },
  props: {
    maxWidth: {
      type: String,
      default: '450px'
    },
    text: {
      type: String,
      default: ''
    },
    hideIcon: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss">
.mew-tooltip > div {
  display: inline-block;
}
.tippy-tooltip.light-theme {
  background-color: rgb(255, 255, 255);
  color: initial;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.4);
  .tippy-arrow {
    border-top-color: rgb(255, 255, 255);
  }
  .tippy-content {
    word-break: break-all;
  }
}
</style>
