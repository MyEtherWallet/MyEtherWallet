<template functional>
  <div class="loading-sign">
    <div :class="props.color" class="loading-container">
      <div class="lds-spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p v-if="props.loadingmessage1 != ''" class="loading-message1">
        {{ props.loadingmessage1 }}
      </p>
      <p v-if="props.loadingmessage2 != ''" class="loading-message2">
        {{ props.loadingmessage2 }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingSign',
  props: {
    type: {
      type: String,
      default: ''
    },
    loadingmessage1: {
      type: String,
      default: ''
    },
    loadingmessage2: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: 'black'
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'LoadingSign';
</style>
