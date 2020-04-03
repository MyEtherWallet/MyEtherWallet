<template>
  <WhiteSheet class="content-container">
    <div class="pa-12 content-width">
      <div class="block-title display-1 font-weight-bold mb-6">
        My ETH balance is empty
      </div>
      <StdButton buttonclass="button--green" size="x-large" :minwidth="false">
        Buy ETH with a credit card
      </StdButton>
      <div class="d-flex align-center mt-4">
        <div>We accept credit card</div>
        <img
          v-if="!$vuetify.theme.dark"
          class="ml-2 mr-1"
          height="21"
          src="@/assets/images/icons/icon-visa-dark.png"
        />
        <img
          v-if="$vuetify.theme.dark"
          class="ml-2 mr-2"
          height="13"
          src="@/assets/images/icons/icon-visa-white.png"
        />
        <img height="18" src="@/assets/images/icons/icon-mastercard-mew.png" />
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

.content-container {
  background-image: url(~@/assets/images/backgrounds/bg-circle-triangle.png);
  background-position: right 60px bottom;
  background-size: 245px;
}

.block-title {
  line-height: 36px !important;
}
</style>
