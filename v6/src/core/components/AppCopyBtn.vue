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

<script>
export default {
  name: 'AppCopyBtn',
  props: {
    copyValue: {
      type: String,
      default: ''
    },
    successToast: {
      type: String,
      default: 'Copied!'
    }
  },
  methods: {
    copy(value) {
      return new Promise((resolve, reject) => {
        navigator.clipboard.writeText(value).then(resolve).catch(reject);
      });
    },
    copyToClipboard() {
      this.copy(this.copyValue);
      document.activeElement.blur();
      this.$refs.toast.showToast();
    }
  }
};
</script>
