<template>
  <v-sheet class="module-no-balance pa-7" color="white" max-width="100%">
    <div class="pa-12">
      <h2 class="mb-6">My {{ network.type.name }} balance is empty</h2>
      <mew-button
        :has-full-width="false"
        title="Buy ETH with a credit card"
        btn-size="xlarge"
        btn-link="https://ccswap.myetherwallet.com/#/"
      />
      <div class="d-flex align-center mt-4">
        <div>We accept credit card</div>
        <img
          v-if="!$vuetify.theme.dark"
          class="ml-2 mr-1"
          height="21"
          src="@/assets/images/icons/icon-visa-dark.png"
        />
        <img
          v-if="$vuetify.theme.dark"
          class="ml-2 mr-2"
          height="13"
          src="@/assets/images/icons/icon-visa-white.png"
        />
        <img height="18" src="@/assets/images/icons/icon-mastercard-mew.png" />
      </div>
      <div class="text-color--gray1 mt-12">
        Tip: You can also send your ETH here from another wallet!
      </div>
    </div>
  </v-sheet>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('global', ['network'])
  }
};
</script>

<style lang="scss" scoped>
.module-no-balance {
  background-image: url(~@/assets/images/backgrounds/bg-circle-triangle.png);
  background-position: right 60px bottom -1px;
  background-size: 245px;
  border-radius: 12px;
  left: 0;
  top: 0;
  width: 100%;
}
</style>
