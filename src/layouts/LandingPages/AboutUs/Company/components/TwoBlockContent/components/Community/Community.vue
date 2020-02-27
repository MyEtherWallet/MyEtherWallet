<template>
  <v-sheet max-width="400px">
    <v-img
      src="@/assets/images/icons/mew/icon-community-mew.svg"
      max-width="65px"
      max-height="65px"
      aspect-ratio="1"
      class="mb-5"
    />
    <BlockTitle :data="titleData" />
    <div class="d-flex align-center mt-5">
      <v-btn
        v-for="(i, key) in icons"
        :key="key"
        text
        icon
        :color="iconColor"
        :class="buttonClass"
        :href="i.link"
        target="_blank"
      >
        <img :src="i.img" :height="iconSize" />
      </v-btn>
    </div>
  </v-sheet>
</template>

<script>
import Vars from '@/plugins/variables.js';
import BlockTitle from '../../../../../../components/BlockTitle';

import Telegram from '@/assets/images/Common/Icons/IconSet4/Telegram.svg';
import Slack from '@/assets/images/Common/Icons/IconSet4/Slack.svg';
import Reddit from '@/assets/images/Common/Icons/IconSet4/Reddit.svg';
import Github from '@/assets/images/Common/Icons/IconSet4/Github.svg';

export default {
  components: { BlockTitle },
  data: () => ({
    icons: [
      {
        link: 'https://t.me/myetherwallet',
        img: Telegram
      },
      {
        link: '#',
        img: Slack
      },
      {
        link: 'https://www.reddit.com/r/MyEtherWallet/',
        img: Reddit
      },
      {
        link: 'https://github.com/myetherwallet',
        img: Github
      }
    ],
    titleData: {
      textProps: '',
      toptitle: '',
      title: 'Community',
      description:
        'MEW has partnered with Bity, Kyber Network, and Simplex to allow users to swap fiat to crypto, ETH and BTC.',
      centered: false
    },
    buttonClass: 'mr-4',
    iconSize: '27px',
    iconColor: Vars.colors.iconColor
  })
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables';
</style>
