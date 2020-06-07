<template>
  <ComponentContainer>
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

    <div class="action-block mt-0 ml-n4">
      <v-btn
        color="teal lighten-3"
        class="font-weight-bold text-transform--initial"
        text
      >
        Learn more<v-icon class="ml-1 title">mdi-arrow-right</v-icon>
      </v-btn>
    </div>
    <img class="circles" src="@/assets/images/icons/icon-half-circle-mew.svg" />
  </ComponentContainer>
</template>

<script>
import ComponentContainer from '../ComponentContainer';
export default {
  components: { ComponentContainer }
};
</script>

<style lang="scss" scoped>
.circles {
  position: absolute;
  bottom: -5px;
  right: -18px;
  height: 110px;
}
</style>
