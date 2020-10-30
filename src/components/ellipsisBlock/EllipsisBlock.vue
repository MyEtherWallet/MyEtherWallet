<template>
  <v-sheet
    :class="white ? 'white--text' : ''"
    :max-width="maxWidth"
    color="transparent"
    class="ellipsis position--relative"
  >
    <v-tooltip top>
      <template v-if="text" #activator="{ on, attrs }">
        <span class="front-digits monospace" v-bind="attrs" v-on="on">
          {{ text.slice(0, -4) }}
        </span>
        <div class="last-digits monospace">
          {{ text.slice(text.length - 4) }}
        </div>
      </template>
      <span v-if="text">{{ text }}</span>
    </v-tooltip>
    <slot />
  </v-sheet>
</template>

<script>
export default {
  components: {},
  props: {
    maxWidth: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    white: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return { isHovering: false };
  }
};
</script>

<style lang="scss" scoped>
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 2.2rem;
}
.last-digits {
  position: absolute;
  right: 0.1rem;
  top: 0;
}
</style>
