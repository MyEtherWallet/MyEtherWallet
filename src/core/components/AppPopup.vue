<template>
  <v-dialog
    v-model="isOpen"
    max-width="600px"
    content-class="core--components--app-popup"
  >
    <div class="white pa-8 position--relative">
      <v-btn icon class="close-button" @click="isOpen = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <div class="mew-heading-2 text-center mt-4">{{ title }}</div>

      <div class="mt-8">
        <slot />
      </div>
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: 'AppPopup',
  props: {
    value: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    isOpen: false
  }),
  watch: {
    value(newVal) {
      if (newVal === true) {
        this.isOpen = true;
      }
    },
    isOpen(newVal) {
      if (newVal === false) {
        this.$emit('input', false);
      }
    }
  }
};
</script>

<style lang="scss">
.core--components--app-popup {
  border-radius: 10px !important;
  margin: 0 !important;
}
</style>

<style lang="scss" scoped>
.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
}
</style>
