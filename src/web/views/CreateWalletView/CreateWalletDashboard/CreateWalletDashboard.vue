<template>
  <div class="bg_blue">
    <toast
      ref="toast"
      can-close
      :link-obj="toastLink"
      text="Did you know? Hardware wallets offer the highest security for accessing your crypto."
      toast-type="info"
    />
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
    toastLink: {
      title: 'Buy a hardware wallet',
      url: '/'
    },
    titleData: {
      textProps: 'white--text',
      toptitle: '',
      title: 'Get a New Wallet',
      description: '',
      centered: true
    }
  }),
  mounted() {
    this.$refs.toast.showToast();
  },
  methods: {}
};
</script>

<style lang="scss" scoped></style>
