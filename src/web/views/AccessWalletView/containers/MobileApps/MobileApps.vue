<template>
  <div class="bg_blue">
    <BlockTitle :data="titleData">
      <h5 class="white--text ma-0">
        Please select a method to access your wallet.
      </h5>
      <h5 class="white--text ma-0">
        Don't have a wallet?
        <router-link
          :to="{ name: 'HomeCreateWallet', query: {} }"
          class="text-color--mew-green"
        >
          Get a new wallet
        </router-link>
      </h5>
    </BlockTitle>
    <v-sheet color="transparent" max-width="550px" class="mx-auto">
      <ScanToConnect class="mb-5" />
      <MEWwallet />
    </v-sheet>
    <div class="spacer-y-medium" />
  </div>
</template>

<script>
import BlockTitle from '@/web/components/BlockTitle';
import ScanToConnect from './components/ScanToConnect';
import MEWwallet from './components/MEWwallet';

export default {
  name: 'CreateNewWallet',
  components: { BlockTitle, ScanToConnect, MEWwallet },
  data: () => ({
    titleData: {
      textProps: 'white--text',
      toptitle: '',
      title: 'MEWconnect',
      description: '',
      centered: true
    }
  }),
  methods: {}
};
</script>

<style lang="scss" scoped></style>
