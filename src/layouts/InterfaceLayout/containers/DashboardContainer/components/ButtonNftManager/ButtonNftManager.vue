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
        :alt="parent.$t('common.kitties')"
        src="~@/assets/images/buttons/nft-manager/crypto-kitties.png"
        class="kitties"
      />
      <div class="text-content">
        <p class="title">
          {{ parent.$t('nftManager.nft') }}<br />{{
            parent.$t('nftManager.manager')
          }}
        </p>
        <p v-if="props.disabled" class="button-disabled">
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
@import 'ButtonNftManager.scss';
</style>
