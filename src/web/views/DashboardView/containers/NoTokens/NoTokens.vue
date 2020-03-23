<template>
  <WhiteSheet>
    <div>No Tokens</div>
    <StdButton
      buttonclass="button--green-border"
      size="x-large"
      :minwidth="false"
      fontclass="font-weight-regular"
    >
      Buy ETH with a credit card
    </StdButton>
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
//@import '@/assets/styles/GlobalVariables.scss';
</style>
