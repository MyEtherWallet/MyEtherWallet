<template>
  <!--
  ==================================================================
  Use (:value=""), (@close="")
  or (v-model="") to control dialog
  ==================================================================
  -->
  <v-dialog
    v-model="isDialogOpen"
    content-class="whitePopup"
    :width="width"
    :max-width="maxWidth"
    :fullscreen="$vuetify.breakpoint.smAndDown"
  >
    <div
      v-if="!noPadding"
      :class="$vuetify.breakpoint.smAndDown ? 'pa-3' : 'pa-8 pt-5'"
    >
      <div
        v-if="!noTitle"
        :class="[
          title ? 'mb-7' : '',
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
        @click="isDialogOpen = false"
      >
        <v-icon color="white">mdi-close</v-icon>
      </v-btn>
      <slot />
    </div>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';

// emits
const emit = defineEmits(['close', 'input']);

// props
const props = defineProps({
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
  },
  noTitle: {
    type: Boolean,
    default: false
  },
  noPadding: {
    type: Boolean,
    default: false
  }
});

// data
const isDialogOpen = ref(false);

// watch
watch(
  () => props.value,
  newVal => {
    if (newVal === true && isDialogOpen.value === false) {
      isDialogOpen.value = true;
    }
    if (newVal === false && isDialogOpen.value === true) {
      isDialogOpen.value = false;
    }
  }
);

watch(
  () => props.isOpen,
  newVal => {
    if (newVal === true && isDialogOpen.value === false) {
      isDialogOpen.value = true;
    }
    if (newVal === false && isDialogOpen.value === true) {
      isDialogOpen.value = false;
    }
  }
);

watch(
  () => isDialogOpen.value,
  val => {
    if (val === false && props.value === true) {
      closeDialog();
    }
  }
);

// methods

const closeDialog = () => {
  isDialogOpen.value = false;
  emit('input', false);
  emit('close');
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
