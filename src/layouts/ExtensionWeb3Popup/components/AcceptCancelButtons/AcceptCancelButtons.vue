<template functional>
  <div class="buttons-container">
    <button class="reject" @click.prevent.stop="props.funcTwo">
      {{ props.textTwo }}
    </button>
    <button
      :disabled="props.disabled"
      class="sign"
      @click.prevent.stop="props.funcOne"
    >
      {{ props.textOne }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    textOne: {
      type: String,
      default: ''
    },
    textTwo: {
      type: String,
      default: ''
    },
    funcOne: {
      type: Function,
      default: () => {}
    },
    funcTwo: {
      type: Function,
      default: () => {}
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'AcceptCancelButtons.scss';
</style>
