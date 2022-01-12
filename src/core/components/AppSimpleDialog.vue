<template>
  <!--
  ==================================================================
  Use (:value=""), (@close="")
  or (v-model="") to control dialog
  ==================================================================
  -->
  <v-dialog v-model="isDialogOpen" :width="width" :max-width="maxWidth">
    <div class="white pa-8 pt-5">
      <div
        class="d-flex align-start justify-space-between"
        :class="title ? 'mb-7' : ''"
      >
        <div class="mew-heading-2 pr-5">
          {{ title }}
        </div>
        <v-btn
          color="textSecondary"
          icon
          class="mt-n2 mr-n4"
          @click="closeDialog"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
      <slot />
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: 'AppDialog',
  props: {
    value: {
      type: Boolean,
      default: false
    },
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
    }
  },
  data() {
    return { isDialogOpen: false };
  },
  watch: {
    // "value" for model
    value(newVal) {
      // Open when dialog is already closed to prevent Infinite Loop
      if (newVal === true && this.isDialogOpen === false) {
        this.isDialogOpen = true;
      }
      // Close when dialog is already open to prevent Infinite Loop
      if (newVal === false && this.isDialogOpen === true) {
        this.isDialogOpen = false;
      }
    },
    // Same as "value", but more user friendly option name
    isOpen(newVal) {
      // Open when dialog is already closed to prevent Infinite Loop
      if (newVal === true && this.isDialogOpen === false) {
        this.isDialogOpen = true;
      }
      // Close when dialog is already open to prevent Infinite Loop
      if (newVal === false && this.isDialogOpen === true) {
        this.isDialogOpen = false;
      }
    },
    isDialogOpen(val) {
      if (val === false && this.value === true) {
        this.closeDialog();
      }
    }
  },
  mounted() {
    // Apply initial v-model value
    this.isDialogOpen = this.value;
  },
  methods: {
    closeDialog() {
      // Close the dialog
      this.isDialogOpen = false;

      // Emit v-model
      this.$emit('input', false);

      // Emit @close event
      this.$emit('close');
    }
  }
};
</script>

<style lang="scss" scoped></style>
