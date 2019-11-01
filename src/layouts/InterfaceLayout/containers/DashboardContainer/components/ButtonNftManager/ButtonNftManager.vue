<template functional>
  <div class="button-nft-manager">
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
        <p class="title">
          {{ $t('nftManager.nft') }}<br />{{ $t('nftManager.manager') }}
        </p>
        <p v-if="props.disabled" class="button-disabled">
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
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ButtonNftManager.scss';
</style>
