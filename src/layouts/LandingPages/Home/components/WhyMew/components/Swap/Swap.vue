<template>
  <v-card class="pa-8 position--relative" outlined max-width="500">
    <h4 class="link-box-title font-weight-bold mb-4">
      Swap easily
    </h4>
    <p>
      Partnered with
      <span class="font-italic">
        Bity, Kyber Network, Changelly, and Simplex
      </span>
      to allow users to swap fiat to crypto, ETH to BTC, ETH to ERC-20.
    </p>

    <div class="action-block mt-2 ml-n4">
      <v-btn color="teal lighten-3" class="font-weight-bold" text>
        Learn more<v-icon class="ml-1 title">mdi-arrow-right</v-icon>
      </v-btn>
    </div>
    <img
      class="circles"
      src="@/assets/images/icons/mew/icon-half-circle-mew.svg"
    />
  </v-card>
</template>

<script>
export default {
  components: {}
};
</script>

<style lang="scss" scoped>
h4 {
  font-size: 22px;
  letter-spacing: -0.6px;
}

span {
  font-weight: 600;
}

.v-card {
  border-radius: 10px !important;
}

.circles {
  position: absolute;
  bottom: -5px;
  right: -18px;
  height: 110px;
}
</style>
