<template>
  <tippy-component
    class="mew-tooltip-popover"
    style="display: inline-block"
    arrow
    theme="light"
    :max-width="maxWidth"
    :content="content"
  >
    <!-- Popover trigger -->
    <template #trigger>
      <slot name="trigger" />
    </template>

    <!-- Popover content -->
    <slot />
  </tippy-component>
</template>

<script>
import { TippyComponent } from 'vue-tippy';

export default {
  components: {
    TippyComponent
  },
  props: {
    maxWidth: {
      type: String,
      default: '450px'
    },
    content: {
      type: String,
      default: ''
    }
  }
};
</script>

<style lang="scss">
.tippy-tooltip.light-theme {
  /* Your styling here. Example: */
  background-color: white;
  color: initial;
  padding: 6px 10px !important;
  border: 1px solid var(--v-greyMedium-base);

  .tippy-arrow {
    border-top-color: white;
  }

  .tippy-content {
    word-break: break-all;
  }
}
</style>
