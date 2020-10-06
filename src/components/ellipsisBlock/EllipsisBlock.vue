<template>
  <v-sheet :max-width="maxWidth" color="transparent">
    <div
      :class="
        isHovering && expendable
          ? 'word-break--break-all'
          : 'text-overflow--ellipsis'
      "
      @mouseover="isHovering = true"
      @mouseout="isHovering = false"
    >
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <span v-bind="attrs" v-on="on">{{ text }}</span>
        </template>
        <span>{{ text }}</span>
      </v-tooltip>
      <slot />
    </div>
  </v-sheet>
</template>

<script>
export default {
  components: {},
  props: {
    expendable: {
      type: Boolean,
      default: false
    },
    maxWidth: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    }
  },
  data() {
    return { isHovering: false };
  }
};
</script>
