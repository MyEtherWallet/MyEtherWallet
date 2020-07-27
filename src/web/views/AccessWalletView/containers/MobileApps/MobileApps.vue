<template>
  <div class="bg_blue">
    <BlockTitle :data="titleData">
      <h5 class="white--text ma-0">
        Select a app that you want to use to connect MEW.
      </h5>
    </BlockTitle>
    <v-sheet color="transparent" max-width="450px" class="mx-auto px-5">
      <v-row>
        <v-col v-for="(btn, key) in buttons" :key="key" cols="12" sm="12">
          <router-link :to="btn.to" class="display--block">
            <mew-super-button
              :title="btn.label"
              :subtitle="btn.description"
              :right-icon="btn.icon"
              icon-type="img"
            />
          </router-link>
        </v-col>
      </v-row>
    </v-sheet>
    <div class="spacer-y-medium" />
  </div>
</template>

<script>
import BlockTitle from '@/web/components/BlockTitle';

export default {
  name: 'CreateNewWallet',
  components: { BlockTitle },
  data() {
    return {
      titleData: {
        textProps: 'white--text',
        toptitle: '',
        title: 'Mobile apps',
        description: '',
        centered: true
      },
      buttons: [
        {
          label: 'WalletConnet',
          description: 'Connect wallet with Walletconnet',
          icon: require('@/assets/images/icons/icon-wallet-connect.svg'),
          to: { name: 'AccessWalletBrowserExtentionInstall', query: {} }
        },
        {
          label: 'Wallet Link',
          description: 'Connect wallet with Wallet Link ',
          icon: require('@/assets/images/icons/icon-wallet-link.png'),
          to: { name: 'AccessWalletBrowserExtentionInstall', query: {} }
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped></style>
