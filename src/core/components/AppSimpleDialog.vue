<template>
  <v-dialog
    :value="isOpen"
    content-class="whitePopup"
    :width="width"
    :max-width="maxWidth"
    :fullscreen="$vuetify.breakpoint.smAndDown"
    @click:outside="closeDialog"
  >
    <div
      v-if="!noPadding"
      :class="$vuetify.breakpoint.smAndDown ? 'pa-3' : 'px-8 py-8'"
    >
      <div
        v-if="!noTitle"
        :class="[
          title ? 'mb-5' : '',
          'd-flex align-start justify-space-between'
        ]"
      >
        <div class="mew-heading-2 pr-5">
          {{ title }}
        </div>
        <v-btn color="textLight" icon class="" @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
      <slot />
    </div>
    <div v-else class="position-relative">
      <v-btn
        class="close-button"
        fab
        color="transparent"
        depressed
        @click="closeDialog"
      >
        <v-icon color="white">mdi-close</v-icon>
      </v-btn>
      <slot />
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: 'AppSimpleDialog',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: ''
    },
    maxWidth: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    noTitle: {
      type: Boolean,
      default: false
    },
    noPadding: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  methods: {
    closeDialog() {
      this.$emit('close');
    }
  }
};
</script>

<style lang="scss" scoped>
.position-relative {
  position: relative;
}
.close-button {
  position: absolute;
  right: 10px;
  top: 10px;
}
</style>
