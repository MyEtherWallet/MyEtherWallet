<template>
  <app-simple-dialog v-model="showInitialPromo" no-padding max-width="460">
    <div class="promo-container py-10 px-12">
      <div class="text-center">
        <img
          src="@/assets/images/icons/icon-enkrypt-logo-white.svg"
          alt="Enkrypt logo"
          height="30"
        />
        <div class="whiteAlways--text mew-heading-4 font-weight-bold my-4">
          Our new multichain browser extension wallet!
        </div>
        <img
          src="@/assets/images/snippets/snippet-enkrypt-nft.png"
          alt="Enkerypt NFT"
          class="width-100"
        />
      </div>
      <div class="mew-heading-4 px-3 mt-4">
        We have a brand spanking new extension. Go everywhere on web3 securely
        from your browser. Manage your NFTs, assets… oh and it also supports
        Polkadot! Download Enkrypt and LFG!
      </div>
      <div class="text-center mt-6">
        <a href="https://enkrypt.com/" target="_blank">
          <mew-button class="mr-3" btn-style="transparent" title="Learn more" />
        </a>
        <a href="https://enkrypt.com/" target="_blank">
          <mew-button color-theme="#7E44F2">
            <img
              class="circle-border mr-2"
              src="@/assets/images/icons/icon-chrome.svg"
              alt="Chrome"
              height="25"
            />
            <div class="mew-body font-weight-medium">Install extension</div>
          </mew-button>
        </a>
      </div>
    </div>
  </app-simple-dialog>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import AppSimpleDialog from '@/core/components/AppSimpleDialog';

export default {
  name: 'TheEnkryptPopupPromo',
  components: { AppSimpleDialog },
  data() {
    return { showInitialPromo: true };
  },
  computed: {
    ...mapState('global', ['showEnkryptPromo'])
  },
  mounted() {
    this.showPromo();
  },
  methods: {
    ...mapActions('global', ['neverShowEnkryptPromo']),
    showPromo() {
      // commented for future use
      /*
      if (this.showEnkryptPromo) {
        this.showInitialPromo = true;
      }
      this.neverShowEnkryptPromo();
      */
    }
  }
};
</script>

<style lang="scss" scoped>
.promo-container {
  background-image: url('~@/assets/images/snippets/snippets-blue-circle-gradient.svg');
  background-size: contain;
}
.width-100 {
  width: 100%;
}
.circle-border {
  border: 2px solid white;
  border-radius: 50%;
}
</style>
