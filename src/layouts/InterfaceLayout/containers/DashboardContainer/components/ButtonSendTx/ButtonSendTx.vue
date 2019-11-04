<template functional>
  <div class="button-send-tx" @click="props.goTo('send-transaction')">
    <div :class="disabled ? 'button-disabled' : ''" class="content-container">
      <img src="~@/assets/images/buttons/send-tx/left.png" class="left" alt />
      <img src="~@/assets/images/buttons/send-tx/right.png" class="right" alt />
      <img
        src="~@/assets/images/buttons/send-tx/spaceman.png"
        class="spaceman"
        alt
      />
      <div class="text-content">
        <p class="title">{{ $t('sendTx.send') }}<br />{{ $t('sendTx.tx') }}</p>
        <p v-if="disabled" class="button-disabled">
          {{ $t('interface.no-avail') }}
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
    },
    goTo: {
      type: Function,
      default: () => {}
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ButtonSendTx.scss';
</style>
