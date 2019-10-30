<template functional>
  <div class="button-send-tx">
    <div :class="disabled ? 'button-disabled' : ''" class="content-container">
      <img src="~@/assets/images/buttons/send-tx/left.png" class="left" alt />
      <img src="~@/assets/images/buttons/send-tx/right.png" class="right" alt />
      <img
        src="~@/assets/images/buttons/send-tx/spaceman.png"
        class="spaceman"
        alt
      />
      <div class="text-content">
        <p class="title">Send<br />Transaction</p>
        <p v-if="disabled" class="button-disabled">
          This function is not available.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ButtonSendTx.scss';
</style>
