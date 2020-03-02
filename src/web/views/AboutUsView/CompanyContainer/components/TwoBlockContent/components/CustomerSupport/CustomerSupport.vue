<template>
  <v-sheet max-width="400px">
    <v-img
      src="@/assets/images/icons/icon-message2-mew.svg"
      max-width="65px"
      max-height="65px"
      aspect-ratio="1"
      class="mb-5"
    />
    <BlockTitle :data="titleData" />
    <StdButton buttonclass="button--green-border" class="mt-5"
      >Contact Support</StdButton
    >
  </v-sheet>
</template>

<script>
import BlockTitle from '@/web/components/BlockTitle';
import StdButton from '@/web/components/StdButton';

export default {
  components: { BlockTitle, StdButton },
  data: () => ({
    titleData: {
      textProps: '',
      toptitle: '',
      title: 'Customer support',
      description:
        'MEW has partnered with Bity, Kyber Network, and Simplex to allow users to swap fiat to crypto, ETH and BTC.',
      centered: false
    }
  })
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables';
</style>
