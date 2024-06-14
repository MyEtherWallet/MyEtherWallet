<template>
  <!--
  =====================================================================================
    Mew Checkbox
  =====================================================================================
  -->
  <div class="d-flex align-center mew-checkbox">
    <v-checkbox
      v-model="isChecked"
      hide-details
      :dense="dense"
      off-icon="mdi-circle-outline"
      on-icon="mdi-check-circle"
      class="titlePrimary--text"
    />
    <span :class="['mr-2 cursor-pointer', className]" @click="toggleCheckbox"
      >{{ label }}
      <a v-if="link.url && link.title" target="_blank" :href="link.url">{{
        link.title
      }}</a>
      <slot name="contentSlot" />
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// emits
const emits = defineEmits(['input']);

// props
const props = defineProps({
  className: {
    type: String,
    default: 'titlePrimary--text'
  },
  label: {
    type: String,
    default: ''
  },
  link: {
    type: Object,
    default: () => {
      return { title: '', url: '' };
    }
  },
  id: {
    type: Number,
    default: null
  },
  value: {
    type: Boolean,
    default: false
  },
  dense: {
    type: Boolean,
    default: false
  }
});

// computed
const isChecked = computed({
  get: () => props.value,
  set: val => {
    emits('input', val, props.id);
  }
});

// methods
const toggleCheckbox = () => {
  emits('input', !props.value, props.id);
};
</script>
<style lang="scss" scoped>
.mew-checkbox {
  .v-input--checkbox {
    margin-top: 0;
    padding-top: 0;
  }
}
</style>
