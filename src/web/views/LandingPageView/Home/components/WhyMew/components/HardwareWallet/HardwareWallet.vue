<template>
  <ComponentContainer>
    <h4 class="link-box-title font-weight-bold mb-4">
      Hardware wallet support
    </h4>
    <p>
      MEW offers support for all major hardware wallets including Leder, Trezor,
      and many more.
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
  </ComponentContainer>
</template>

<script>
import ComponentContainer from '../ComponentContainer';
export default {
  components: { ComponentContainer }
};
</script>
