<template functional>
  <div class="button-send-tx" @click="props.goTo('send-transaction')">
    <div :class="disabled ? 'button-disabled' : ''" class="content-container">
      <img
        src="~@/assets/images/buttons/send-tx/send-tx-left.png"
        class="left"
        alt
      />
      <img
        src="~@/assets/images/buttons/send-tx/send-tx-right.png"
        class="right"
        alt
      />
      <img
        src="~@/assets/images/buttons/send-tx/send-tx-spaceman.png"
        class="spaceman"
        alt
      />
      <div class="text-content">
        <i18n class="title" tag="div" path="sendTx.send-tx-break">
          <p slot="transaction" class="title">
            {{ parent.$t('sendTx.tx') }}
          </p>
        </i18n>
        <p v-if="disabled" class="button-disabled">
          {{ parent.$t('interface.no-avail') }}
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
