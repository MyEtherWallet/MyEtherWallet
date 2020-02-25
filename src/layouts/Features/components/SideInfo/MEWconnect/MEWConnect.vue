<template>
  <WhiteSheet class="pa-7">
    <h4 class="text-color--dark-space bold">
      {{ $t('common.mewconnect.string') }}
    </h4>
    <StdButton class="mt-2" :button-class="'button--dark-space-border'">
      {{ $t('interface.download') }}
    </StdButton>
    <!-- <img src="@/assets/images/Common/Icons/wallet.svg" alt="ethereum" /> -->
  </WhiteSheet>
</template>

<script>
import WhiteSheet from '@/components/Common/WhiteSheet';
import StdButton from '@/components/StdButton';

export default {
  components: { WhiteSheet, StdButton }
};
</script>

<style lang="scss" scoped>
.std-button {
  opacity: 0.5;
}
</style>
