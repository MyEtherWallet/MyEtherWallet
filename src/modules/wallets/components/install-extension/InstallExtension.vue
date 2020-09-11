<template>
  <div class="expandHeader">
    <block-title :data="titleData">
      <h5 class="white--text ma-0">Please select a browser from below.</h5>
    </block-title>

    <v-sheet
      color="white"
      max-width="450px"
      class="mx-auto pa-12 border-radius--10px"
    >
      <div class="d-flex align-center justify-center flex-column">
        <img
          src="@/assets/images/icons/icon-mew-cx.png"
          alt="MEW Extension"
          height="80"
        />
        <h5 class="mt-7 font-weight-bold">Install MEW chrome Extension</h5>
        <router-link
          :to="{ name: 'AccessWalletBrowserExtensionAccess', query: {} }"
        >
          <mew-button button-size="xlarge" title="Install" class="mt-7" />
        </router-link>
      </div>
    </v-sheet>
    <div class="spacer-y-medium" />
  </div>
</template>

<script>
import blockTitle from '@/components/block-title/BlockTitle';

export default {
  name: 'CreateNewWallet',
  components: { blockTitle },
  data() {
    return {
      titleData: {
        textProps: 'white--text',
        toptitle: '',
        title: 'Install browser Extension',
        description: '',
        centered: true
      }
    };
  },
  methods: {
    openOverlay(name) {
      this.$store.commit('openOverlay', name);
    }
  }
};
</script>

<style lang="scss" scoped></style>
