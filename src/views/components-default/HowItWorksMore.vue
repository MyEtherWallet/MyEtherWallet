<template>
  <div class="component-container">
    <div class="py-6 py-md-12" />

    <v-container>
      <v-sheet max-width="600px" class="mb-12">
        <app-block-title no-page-title :data="titleData" class="mb-8" />
      </v-sheet>
      <v-row>
        <v-col
          v-for="content in blockContent"
          :key="content.key"
          cols="12"
          sm="6"
          md="6"
          lg="4"
          class="pb-12"
        >
          <img :src="content.img" height="60" />
          <h5 class="font-weight-bold mt-3">{{ content.title }}</h5>
          <div class="mt-3 pr-md-12">{{ content.description }}</div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import AppBlockTitle from '@/core/components/AppBlockTitle';
import Contract from '@/assets/images/icons/icon-contract-mew.svg';
import Message from '@/assets/images/icons/icon-message-mew.svg';
import ViewOnlyWallet from '@/assets/images/icons/icon-view-only-mew.svg';
import ChromeEx from '@/assets/images/icons/icon-cx-mew.svg';
import BuyEth from '@/assets/images/icons/icon-buy-eth-mew.svg';
import AdvancedTools from '@/assets/images/icons/icon-advanced-tools-mew.svg';

export default {
  components: { AppBlockTitle },
  data: () => ({
    titleData: {
      textProps: '',
      toptitle: '',
      title: 'More tools',
      description:
        'We are always expanding to keep up with the constantly evolving technology of the Ethereum blockchain.',
      centered: false
    },
    blockContent: [
      {
        img: Contract,
        title: 'Smart Contract',
        description:
          'Interact with any smart contract on Ethereum, whether we’ve integrated it or not!'
      },
      {
        img: Message,
        title: 'Messages',
        description:
          'Send or Verify Messages from the MEW interface to verify ownership of your wallet.'
      },
      {
        img: ViewOnlyWallet,
        title: 'View Only Wallet',
        description:
          'Search your Public Address without accessing your wallet, so you can keep track of your balances quickly and easily.'
      },
      {
        img: ChromeEx,
        title: 'MEW CX',
        description:
          'Connect with our Web-3 enabled Chrome Extension wallet, capable of third-party DApp interaction right from your browser.'
      },
      {
        img: BuyEth,
        title: 'Buy Eth',
        description:
          'Purchase Ether with a credit card through our provider, Simplex.'
      },
      {
        img: AdvancedTools,
        title: 'Advanced Tools',
        description:
          'MEW’s functionality ranges from Beginner to Expert, with everything in-between.'
      }
    ]
  })
};
</script>
