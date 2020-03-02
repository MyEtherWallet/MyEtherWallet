<template>
  <div class="light-blue darken-4">
    <div class="py-8" />
    <v-container>
      <BlockTitle :data="titleData" class="mb-10">
        <p class="white--text ma-0">
          Please select a method to create a new wallet.
        </p>
        <p class="white--text ma-0">
          Already have a wallet?
          <router-link
            :to="{ name: 'HomeAccessWallet', query: {} }"
            class="text-color--mew-green"
          >
            Access my wallet
          </router-link>
        </p>
      </BlockTitle>
      <v-sheet color="transparent" max-width="600px" class="mx-auto">
        <router-link
          :to="{ name: 'HomeCreateWalletMewConnect', query: { step: '1' } }"
          class="text-decoration--none"
        >
          <MEWconnect
            class="cursor--pointer user-select--none new-wallet-button"
          />
        </router-link>
        <div class="my-4" />
        <router-link
          :to="{ name: 'HomeCreateWalletKeystore', query: { step: '1' } }"
          class="text-decoration--none"
        >
          <Software
            class="cursor--pointer user-select--none new-wallet-button"
          />
        </router-link>
      </v-sheet>
    </v-container>
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

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables';

.new-wallet-button {
  //transition: all 0.1s ease;
  &:hover {
    //box-shadow: 0 0 50px rgba(0, 0, 0, 0.2);
    box-shadow: 0 0 50px $police-strobe;
  }
}
</style>
