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
          <h5 class="font-weight-bold mt-3">{{ $t(content.title) }}</h5>
          <div class="mt-3 pr-md-12">{{ $t(content.description) }}</div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import AppBlockTitle from '@/core/components/AppBlockTitle';
import Contract from '@/assets/images/icons/icon-contract-mew.svg';
import Message from '@/assets/images/icons/icon-message-mew.svg';
import BuyEth from '@/assets/images/icons/icon-buy-eth-mew.svg';

export default {
  components: { AppBlockTitle },
  data: () => ({
    titleData: {
      textProps: '',
      toptitle: '',
      title: 'More tools',
      description: '',
      centered: false
    },
    blockContent: [
      {
        img: Contract,
        title: 'Smart Contracts',
        description:
          'Interact with any smart contract on Ethereum, whether we’ve integrated it or not!'
      },
      {
        img: Message,
        title: 'Messages',
        description:
          'Send or verify messages from the MEW interface to verify ownership of your wallet.'
      },
      {
        img: BuyEth,
        title: 'Buy ETH',
        description:
          'Purchase Ether with a credit card through our provider Simplex.'
      }
    ]
  })
};
</script>
