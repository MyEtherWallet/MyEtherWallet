<template>
  <div
    :class="['d-flex align-center justify-center mew-dot', color]"
    :style="{ width: size, height: size, fontSize: fontSize, color: textColor }"
    style="border: 1px solid white !important"
  >
    <slot />
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    size: {
      type: String,
      default: '18px'
    },
    fontSize: {
      type: String,
      default: '9px'
    },
    color: {
      type: String,
      default: 'blue'
    },
    textColor: {
      type: String,
      default: 'white'
    }
  },
  data: () => {
    return {};
  },
  computed: {},
  methods: {}
};
</script>

<style lang="scss" scoped>
.mew-dot {
  border-radius: 50%;
  font-weight: 600;
  z-index: 1;
}
</style>
