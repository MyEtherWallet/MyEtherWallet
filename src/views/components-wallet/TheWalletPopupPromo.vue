<template>
  <app-modal
    width="420"
    :show="showWalletPromo"
    :close="setHidePopUp"
    title="Introducing ETH Blocks NFTs"
    has-body-content
    :has-buttons="false"
  >
    <template #dialogBody>
      <v-img
        src="@/dapps/eth-blocks/assets/eth-blocks-qrs.svg"
        height="130"
        contain
        class="mt-8 mb-6"
      />
      <div class="textMedium--text mb-6 text-center mew-heading-4">
        Own a piece of history by minting your very own unique NFT of a specific
        block on the Ethereum blockchain. Only available in MEW!
      </div>
      <mew-button
        title="Mint ETH Blocks now"
        has-full-width
        btn-size="xlarge"
        @click.native="goToPromo()"
      />
    </template>
  </app-modal>
</template>

<script>
import AppModal from '@/core/components/AppModal';
import { mapActions, mapState } from 'vuex';
import { ETH_BLOCKS_ROUTE } from '@/dapps/eth-blocks/configsRoutes';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';

export default {
  name: 'TheWalletPopupPromo',
  components: { AppModal },
  mixins: [handlerAnalytics],
  data() {
    return {};
  },
  computed: {
    ...mapState('global', ['showWalletPromo'])
  },
  methods: {
    /**NEW */
    ...mapActions('global', ['neverShowPromo']),
    /**
     * Hides promo popup forever
     */
    setHidePopUp() {
      this.neverShowPromo();
    },

    /**
     * Hides promo popup forever and navigates to the promo link.
     * Edit this function to route to new link
     */
    goToPromo() {
      this.setHidePopUp();
      this.trackDapp('ethBlocksFromPromo');
      this.$router.push({ name: ETH_BLOCKS_ROUTE.CORE.NAME });
    }
  }
};
</script>
