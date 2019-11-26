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
        <img
          src="@/assets/images/Common/Icons/IconSet4/Telegram.svg"
          :height="iconSize"
        />
      </v-btn>
      <v-btn
        text
        icon
        :color="iconColor"
        :class="buttonClass"
        href="#"
        target="_blank"
      >
        <img
          src="@/assets/images/Common/Icons/IconSet4/Slack.svg"
          :height="iconSize"
        />
      </v-btn>
      <v-btn
        text
        icon
        :color="iconColor"
        :class="buttonClass"
        href="https://www.reddit.com/r/MyEtherWallet/"
        target="_blank"
      >
        <img
          src="@/assets/images/Common/Icons/IconSet4/Reddit.svg"
          :height="iconSize"
        />
      </v-btn>
      <v-btn
        text
        icon
        :color="iconColor"
        :class="buttonClass"
        href="https://github.com/myetherwallet"
        target="_blank"
      >
        <img
          src="@/assets/images/Common/Icons/IconSet4/Github.svg"
          :height="iconSize"
        />
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
    iconSize: '27px'
  })
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables';
</style>
