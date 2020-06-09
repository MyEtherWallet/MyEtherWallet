<template>
  <div class="light-blue darken-4">
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
      <MEWconnect class="mb-5" />
      <MEWconnect />
      <div class="my-4" />
      <router-link
        v-if="false"
        :to="{ name: 'HomeCreateWalletKeystore', query: { step: '1' } }"
      >
        <Software />
      </router-link>
    </v-sheet>
    <div class="py-12" />
    <div class="py-8" />
  </div>
</template>

<script>
import BlockTitle from '@/web/components/BlockTitle';
import MEWconnect from './components/MEWconnect';
import Software from './components/Software';

export default {
  name: 'CreateNewWallet',
  components: { BlockTitle, MEWconnect, Software },
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
