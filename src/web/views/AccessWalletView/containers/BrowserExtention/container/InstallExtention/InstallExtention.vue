<template>
  <div class="bg_blue">
    <BlockTitle :data="titleData">
      <h5 class="white--text ma-0">
        Please select a browser from below.
      </h5>
    </BlockTitle>

    <v-sheet color="transparent" max-width="450px" class="mx-auto px-5">
      <mew6-flexible-btn>
        <div class="d-flex align-center justify-center flex-column">
          <img
            src="@/assets/images/icons/icon-mew-cx.png"
            alt="MEW Extention"
            height="80"
          />
          <h5 class="mt-7 font-weight-bold">Install MEW chrome extention</h5>
          <mew6-std-btn
            class="mt-7"
            :to="{ name: 'AccessWalletBrowserExtentionAccess', query: {} }"
          >
            Install
          </mew6-std-btn>
        </div>
      </mew6-flexible-btn>
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
