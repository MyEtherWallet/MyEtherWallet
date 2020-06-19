<template>
  <div class="bg_blue">
    <mew6-bottom-alert-buy-hardware-wallet :show="true" hide-overlay />
    <BlockTitle :data="titleData">
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
      <MEWwallet class="mb-5" />
      <MEWcx class="mb-5" />
      <Software />
    </v-sheet>
    <div class="spacer-y-medium" />
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
