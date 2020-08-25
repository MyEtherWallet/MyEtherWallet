<template>
  <v-sheet max-width="400px">
    <v-img
      src="@/assets/images/icons/icon-message2-mew.svg"
      max-width="65px"
      max-height="65px"
      aspect-ratio="1"
      class="mb-5"
    />
    <BlockTitle no-page-title :data="titleData" />
    <mew-button
      class="mt-5"
      btn-link="https://www.mewtopia.com/"
      :has-full-width="false"
      title="Contact Support"
      button-size="xlarge"
    />
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
