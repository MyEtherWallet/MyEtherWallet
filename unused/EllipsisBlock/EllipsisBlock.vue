<template>
  <div
    :class="isHovering ? 'word-break--break-all' : 'text-overflow--ellipsis'"
    @mouseover="isHovering = true"
    @mouseout="isHovering = false"
  >
    <slot />
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return { isHovering: false };
  }
};
</script>
