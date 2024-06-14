<template>
  <div>
    <div @click="copyToClipboard">
      <slot />
    </div>
    <mew-toast
      ref="toast"
      :duration="2000"
      toast-type="success"
      :text="successToast"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
const props = defineProps({
  copyValue: {
    type: String,
    default: ''
  },
  successToast: {
    type: String,
    default: 'Copied!'
  }
});

// data
const toast = ref(null);

// methods
const copy = value => {
  return new Promise((resolve, reject) => {
    navigator.clipboard.writeText(value).then(resolve).catch(reject);
  });
};

const copyToClipboard = () => {
  copy(props.copyValue);
  document.activeElement.blur();
  toast.value.showToast();
};
</script>
