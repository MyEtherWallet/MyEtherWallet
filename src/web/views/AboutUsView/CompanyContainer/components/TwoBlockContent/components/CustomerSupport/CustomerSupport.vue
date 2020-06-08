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
    <mew6-std-btn
      size="x-large"
      buttonclass="button--green-border"
      class="mt-5"
    >
      Contact Support
    </mew6-std-btn>
  </v-sheet>
</template>

<script>
import BlockTitle from '@/web/components/BlockTitle';

export default {
  components: { BlockTitle },
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
