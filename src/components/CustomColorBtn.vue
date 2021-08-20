<template>
  <v-btn
    style="text-transform: initial"
    :style="hoverColor ? hoverColorStyle : ''"
    depressed
    :color="btnColor"
    :class="`${textColor}--text`"
    :ripple="{ class: `${rippleColor}--text` }"
    :x-large="xLarge"
  >
    <slot />
  </v-btn>
</template>

<script>
export default {
  props: {
    btnColor: {
      type: String,
      default: ''
    },
    textColor: {
      type: String,
      default: ''
    },
    hoverColor: {
      type: String,
      default: ''
    },
    rippleColor: {
      type: String,
      default: ''
    },
    xLarge: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    hoverColorStyle() {
      return {
        '--hover-color': this.hoverColor
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.v-btn:not(.v-btn--round).v-size--x-large {
  height: initial;
  min-height: 52px;
}
.v-btn:before {
  background-color: var(--hover-color, currentColor);
}
</style>
