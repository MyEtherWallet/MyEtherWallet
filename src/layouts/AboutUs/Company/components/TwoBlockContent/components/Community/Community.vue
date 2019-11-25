<template>
  <v-sheet max-width="400px">
    <v-img
      src="@/assets/images/Common/Icons/Community.svg"
      max-width="65px"
      max-height="65px"
      aspect-ratio="1"
      class="mb-5"
    />
    <BlockTitle :data="titleData" />
    <div class="d-flex align-center mt-5">
      <v-btn
        text
        icon
        :color="iconColor"
        :class="buttonClass"
        href="https://t.me/myetherwallet"
        target="_blank"
      >
        <v-icon :class="iconClass">mdi-telegram</v-icon>
      </v-btn>
      <v-btn
        v-if="false"
        text
        icon
        :color="iconColor"
        :class="buttonClass"
        href="https://github.com/myetherwallet"
        target="_blank"
      >
        <v-icon :class="iconClass">mdi-slack</v-icon>
      </v-btn>
      <v-btn
        text
        icon
        :color="iconColor"
        :class="buttonClass"
        href="https://www.reddit.com/r/MyEtherWallet/"
        target="_blank"
      >
        <v-icon :class="iconClass">mdi-reddit</v-icon>
      </v-btn>
      <v-btn
        text
        icon
        :color="iconColor"
        :class="buttonClass"
        href="https://github.com/myetherwallet"
        target="_blank"
      >
        <v-icon :class="iconClass">mdi-github-face</v-icon>
      </v-btn>
    </div>
  </v-sheet>
</template>

<script>
import BlockTitle from '@/layouts/components/BlockTitle';

export default {
  components: { BlockTitle },
  data: () => ({
    titleData: {
      textProps: '',
      toptitle: '',
      title: 'Community',
      description:
        'MEW has partnered with Bity, Kyber Network, and Simplex to allow users to swap fiat to crypto, ETH and BTC.',
      centered: false
    },
    buttonClass: 'mr-4',
    iconClass: 'community-button',
    iconColor: '#003945'
  })
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables';

.community-button {
  i {
    font-size: 37px !important;
  }
}
</style>
