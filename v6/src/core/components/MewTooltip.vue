<template>
  <tippy-component
    class="mew-tooltip"
    style="line-height: initial"
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
      <slot name="activatorSlot" class="d-flex" />
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
.tippy-tooltip.light-theme {
  background-color: rgb(255, 255, 255);
  color: initial;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #dadada;
  padding: 10px;

  .tippy-arrow {
    border-top-color: rgb(255, 255, 255);
  }

  .tippy-arrow::after {
    content: '';
    position: absolute;
    z-index: -1;
    border-color: transparent;
    border-style: solid;
    border-top-color: #dadada;
    border-width: 7px 7px 0;
    top: -6px;
    left: -7px;
  }

  .tippy-content {
    word-break: break-all;
  }
}
.tippy-tooltip.light-theme .tippy-content {
  word-break: break-word !important;
  text-align: left !important;
}
</style>
