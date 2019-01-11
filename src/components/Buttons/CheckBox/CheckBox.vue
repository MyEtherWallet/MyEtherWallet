<template>
  <div class="check-box">
    <label class="check-box-container">
      <input type="checkbox" @click="checkBoxClicked" /><span
        class="checkmark"
      ></span>
      <span v-if="terms" class="terms">
        To access my wallet, I accept
        <router-link :to="{ name: 'TermsAndConditionsLayout' }" target="_blank">
          Terms
        </router-link>
        .</span
      >
    </label>
  </div>
</template>

<script>
export default {
  props: {
    terms: {
      type: Boolean,
      default: false
    }
  },
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
