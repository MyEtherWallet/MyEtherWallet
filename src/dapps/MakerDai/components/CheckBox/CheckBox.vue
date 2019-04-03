<template>
  <div class="check-box">
    <label class="check-box-container">
      <input type="checkbox" @click="checkBoxClicked" /><span
        class="checkmark"
      ></span>
      <slot name="terms"></slot>
    </label>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checkboxChecked: false
    };
  },
  methods: {
    checkBoxClicked() {
      this.checkboxChecked = !this.checkboxChecked;
      this.$emit('changeStatus', this.checkboxChecked);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'CheckBox.scss';
</style>
