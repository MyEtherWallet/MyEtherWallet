<template>
  <div class="light-blue darken-4">
    <div class="py-8" />
    <v-container>
      <BlockTitle :data="titleData" class="mb-10">
        <div class="white--text">
          Please select a method to create a new wallet.
        </div>
        <div class="white--text">
          Already have a wallet?
          <router-link to="/" class="text-color--mew-green"
            >Access my wallet</router-link
          >
        </div>
      </BlockTitle>
      <v-sheet
        color="transparent"
        max-width="600px"
        class="mx-auto border-radius--10px"
      >
        <MEWconnect />
        <Software />
      </v-sheet>
    </v-container>
  </div>
</template>

<script>
import BlockTitle from '@/layouts/components/BlockTitle';
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
  })
};
</script>

<style lang="scss" scoped></style>
