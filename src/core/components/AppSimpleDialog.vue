<template>
  <!--
  ==================================================================
  Use (:value=""), (@close="")
  or (v-model="") to control dialog
  ==================================================================
  -->
  <v-dialog v-model="isDialogOpen" :width="width">
    <div class="white pa-8">
      <div class="d-flex align-start justify-space-between mb-7">
        <div class="mew-heading-2 pr-5">
          {{ title }}
        </div>
        <v-btn
          color="textSecondary"
          icon
          class="mt-n2 mr-n2"
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
    width: {
      type: String,
      default: '600'
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
    value(val) {
      if (val === true && this.isDialogOpen === false) {
        this.isDialogOpen = true;
      }
    },
    isDialogOpen(val) {
      if (val === false && this.value === true) {
        this.closeDialog();
      }
    }
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
