<template>
  <div class="component-container">
    <div class="py-9" />
    <v-container>
      <v-sheet max-width="600px" class="mb-12">
        <BlockTitle no-page-title :data="titleData" class="mb-8" />
      </v-sheet>
      <v-row>
        <v-col
          v-for="content in blockContent"
          :key="content.key"
          cols="4"
          class="pb-12"
        >
          <img :src="content.img" height="60" />
          <h5 class="font-weight-bold mt-3">{{ content.title }}</h5>
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
import BlockTitle from '@/web/components/BlockTitle';
import Contract from '@/assets/images/icons/icon-contract-mew.svg';
import Message from '@/assets/images/icons/icon-message-mew.svg';
import ViewOnlyWallet from '@/assets/images/icons/icon-view-only-mew.svg';
import ChromeEx from '@/assets/images/icons/icon-cx-mew.svg';
import BuyEth from '@/assets/images/icons/icon-buy-eth-mew.svg';
import AdvancedTools from '@/assets/images/icons/icon-advanced-tools-mew.svg';

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
        title: 'Smart Contract',
        description:
          'Interact with any smart contract on the Ethereum Blockchain.'
      },
      {
        img: Message,
        title: 'Message',
        description:
          'MEWconnect, an official, free companion app for MEW that helps you secure your funds as never before.'
      },
      {
        img: ViewOnlyWallet,
        title: 'View Only Wallet',
        description:
          'MEWconnect, an official, free companion app for MEW that helps you secure your funds as never before.'
      },
      {
        img: ChromeEx,
        title: 'MEW CX',
        description:
          'MUse our Web3-enabled Chrome Extension to interact with Dapps right in your browser.'
      },
      {
        img: BuyEth,
        title: 'Buy Eth',
        description:
          'Purchase Ether using only a credit card through our partner Simplex.'
      },
      {
        img: AdvancedTools,
        title: 'Advanced Tools',
        description:
          'MEWconnect, an official, free companion app for MEW that helps you secure your funds as never before.'
      }
    ]
  })
};
</script>
