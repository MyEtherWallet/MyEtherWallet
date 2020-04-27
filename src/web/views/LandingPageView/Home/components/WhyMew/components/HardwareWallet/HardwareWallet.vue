<template>
  <v-card class="pa-8" outlined max-width="500">
    <h4 class="link-box-title font-weight-bold mb-4">
      Hardware wallet support
    </h4>
    <p>
      MEW offers support for all major hardware wallets including Leder, Trezor,
      and many more.
    </p>

    <div class="action-block mt-2 ml-n4">
      <v-btn color="teal lighten-3" class="font-weight-bold" text>
        Learn more<v-icon class="ml-1 title">mdi-arrow-right</v-icon>
      </v-btn>
    </div>
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
</style>
