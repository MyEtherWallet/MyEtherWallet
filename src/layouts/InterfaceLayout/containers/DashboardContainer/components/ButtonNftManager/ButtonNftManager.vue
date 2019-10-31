<template functional>
  <div
    class="button-nft-manager"
    @click="props.goTo('nft-manager', props.disabled)"
  >
    <div
      :class="props.disabled ? 'button-disabled' : ''"
      class="content-container"
    >
      <img
        src="~@/assets/images/buttons/nft-manager/crypto-kitties.png"
        class="kitties"
        alt="kitties"
      />
      <div class="text-content">
        <p class="title">NFT<br />Manager</p>
        <p v-if="props.disabled" class="button-disabled">
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
    },
    goTo: {
      type: Function,
      default: () => {}
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ButtonNftManager.scss';
</style>
