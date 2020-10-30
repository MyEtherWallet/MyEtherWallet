<template>
  <v-sheet :max-width="maxWidth" color="transparent" class="ellipsis">
    <v-tooltip top>
      <template v-if="text" #activator="{ on, attrs }">
        <span v-bind="attrs" v-on="on">{{ text }}</span>
      </template>
      <span v-if="text" :class="white ? 'white--text' : ''">{{ text }}</span>
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
}
</style>
