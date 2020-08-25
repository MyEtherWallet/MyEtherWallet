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
    <v-sheet color="transparent" max-width="650px" class="mx-auto">
      <Hardware class="mb-5" />
      <BrowserExtention class="mb-5" />
      <MobileApps class="mb-5" />
      <Software />
    </v-sheet>
    <div class="spacer-y-medium" />
  </div>
</template>

<script>
import BlockTitle from '@/web/components/BlockTitle';
import Hardware from './components/Hardware';
import BrowserExtention from './components/BrowserExtention';
import MobileApps from './components/MobileApps';
import Software from './components/Software';

export default {
  name: 'CreateNewWallet',
  components: {
    BlockTitle,
    Hardware,
    BrowserExtention,
    MobileApps,
    Software
  },
  data: () => ({
    titleData: {
      textProps: 'white--text',
      toptitle: '',
      title: 'Access My Wallet',
      description: '',
      centered: true
    }
  }),
  methods: {}
};
</script>

<style lang="scss" scoped>
.new-wallet-button {
  &:hover {
    box-shadow: 0 0 50px var(--v-police_strobe-base);
  }
}
</style>
