<template>
  <div class="bg_blue">
    <BlockTitle :data="titleData">
      <h5 class="white--text ma-0">
        Please select a browser from below.
      </h5>
    </BlockTitle>

    <v-sheet
      color="white"
      max-width="450px"
      class="mx-auto pa-12 border-radius--10px"
    >
      <div class="d-flex align-center justify-center flex-column">
        <img
          src="@/assets/images/icons/icon-mew-cx.png"
          alt="MEW Extention"
          height="80"
        />
        <h5 class="mt-7 font-weight-bold">Install MEW chrome extention</h5>
        <router-link
          :to="{ name: 'AccessWalletBrowserExtentionAccess', query: {} }"
        >
          <mew-button button-size="xlarge" title="Install" class="mt-7" />
        </router-link>
      </div>
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
        title: 'Install browser extention',
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
