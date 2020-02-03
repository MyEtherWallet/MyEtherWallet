<template>
  <div class="component-container">
    <div class="py-9" />
    <v-container>
      <v-sheet max-width="600px" class="mb-12">
        <BlockTitle :data="titleData" class="mb-8" />
      </v-sheet>
      <v-row>
        <v-col
          v-for="content in blockContent"
          :key="content.key"
          cols="4"
          class="pb-12"
        >
          <img :src="content.img" height="60" />
          <div class="mt-3">{{ content.title }}</div>
          <v-sheet max-width="300px" class="mt-3">
            <p class="ma-0">{{ content.description }}</p>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
    <div class="py-4" />
  </div>
</template>

<script>
import BlockTitle from '../../../components/BlockTitle';
import Contract from '@/assets/images/Common/Icons/IconSet3/Contract.svg';
import Message from '@/assets/images/Common/Icons/IconSet3/Message.svg';
import ViewOnlyWallet from '@/assets/images/Common/Icons/IconSet3/ViewOnlyWallet.svg';
import ChromeEx from '@/assets/images/Common/Icons/IconSet3/ChromeEx.svg';
import BuyEth from '@/assets/images/Common/Icons/IconSet3/BuyEth.svg';
import AdvancedTools from '@/assets/images/Common/Icons/IconSet3/AdvancedTools.svg';

export default {
  components: { BlockTitle },
  data: () => ({
    titleData: {
      textProps: '',
      toptitle: '',
      title: 'More tools',
      description:
        'MEW has partnered with Bity, Kyber Network, and Simplex to allow users to swap fiat to crypto, ETH and BTC.',
      centered: false
    },
    blockContent: [
      {
        img: Contract,
        title: 'Contract',
        description:
          'Ipsum dolor diam justo ea gubergren tempor takimata takimata lorem lorem, voluptua ipsum voluptua consetetur sea nonumy.'
      },
      {
        img: Message,
        title: 'Message',
        description:
          'Ipsum dolor diam justo ea gubergren tempor takimata takimata lorem lorem, voluptua ipsum voluptua consetetur sea nonumy.'
      },
      {
        img: ViewOnlyWallet,
        title: 'View Only Wallet',
        description:
          'Ipsum dolor diam justo ea gubergren tempor takimata takimata lorem lorem, voluptua ipsum voluptua consetetur sea nonumy.'
      },
      {
        img: ChromeEx,
        title: 'MEW Chrome Extension',
        description:
          'Ipsum dolor diam justo ea gubergren tempor takimata takimata lorem lorem, voluptua ipsum voluptua consetetur sea nonumy.'
      },
      {
        img: BuyEth,
        title: 'Buy Ethereum',
        description:
          'Ipsum dolor diam justo ea gubergren tempor takimata takimata lorem lorem, voluptua ipsum voluptua consetetur sea nonumy.'
      },
      {
        img: AdvancedTools,
        title: 'More Advanced Tools',
        description:
          'Ipsum dolor diam justo ea gubergren tempor takimata takimata lorem lorem, voluptua ipsum voluptua consetetur sea nonumy.'
      }
    ]
  })
};
</script>

<style lang="scss" scoped></style>
