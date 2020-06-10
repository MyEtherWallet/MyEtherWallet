<template>
  <div class="light-blue darken-4">
    <mew6-bottom-alert :show="true" hide-overlay>
      <div class="d-flex align-center justify-center">
        <h5 class="font-weight-medium mr-4">
          Did you know? Hardware wallets offer the highest security for
          accessing your crypto.
        </h5>
        <mew6-std-btn size="large" outlined color="blue"
          >Buy a hardware wallet</mew6-std-btn
        >
      </div>
    </mew6-bottom-alert>
    <div class="py-8" />
    <BlockTitle :data="titleData" class="mb-10">
      <h5 class="white--text ma-0">
        Please select a method to create a new wallet.
      </h5>
      <h5 class="white--text ma-0">
        Already have a wallet?
        <router-link
          :to="{ name: 'HomeAccessWallet', query: {} }"
          class="text-decoration--underline"
        >
          Access my wallet
        </router-link>
      </h5>
    </BlockTitle>

    <v-sheet color="transparent" max-width="650px" class="mx-auto">
      <MEWwallet class="cursor--pointer user-select--none mb-5" />
      <MEWcx class="cursor--pointer user-select--none mb-5" />
      <Software class="cursor--pointer user-select--none" />
    </v-sheet>
    <div class="py-12" />
  </div>
</template>

<script>
import BlockTitle from '@/web/components/BlockTitle';
import MEWwallet from './components/MEWwallet';
import MEWcx from './components/MEWcx';
import Software from './components/Software';

export default {
  name: 'CreateNewWallet',
  components: { BlockTitle, MEWwallet, MEWcx, Software },
  data: () => ({
    titleData: {
      textProps: 'white--text',
      toptitle: '',
      title: 'Get a New Wallet',
      description: '',
      centered: true
    }
  }),
  methods: {}
};
</script>

<style lang="scss" scoped></style>
