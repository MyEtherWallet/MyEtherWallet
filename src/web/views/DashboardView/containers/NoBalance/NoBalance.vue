<template>
  <WhiteSheet>
    <div class="pa-12 content-width">
      <div class="block-title display-1 font-weight-bold mb-6">
        My ETH balance is empty
      </div>
      <StdButton
        buttonclass="button--green"
        size="x-large"
        :minwidth="false"
        fontclass="font-weight-regular"
      >
        Buy ETH with a credit card
      </StdButton>
      <div class="d-flex align-center mt-4">
        <div>We accept credit card</div>
        <img
          class="ml-2"
          height="20"
          src="@/assets/images/icons/icon-visa-white-dark.png"
        />
        <img
          class="ml-1"
          height="18"
          src="@/assets/images/icons/icon-mastercard-mew.png"
        />
      </div>
      <div class="text-color--gray1 mt-12">
        Tip: You can also send your ETH here from another wallet!
      </div>
    </div>
  </WhiteSheet>
</template>

<script>
import WhiteSheet from '@/web/components/Common/WhiteSheet';
import StdButton from '@/web/components/StdButton';

export default {
  components: { WhiteSheet, StdButton },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.content-width {
  max-width: 360px;
}

.block-title {
  line-height: 36px !important;
}
</style>
