<template>
  <v-card class="pa-8 d-flex flex-column" outlined max-width="300">
    <v-spacer />
    <v-img
      class="white--text align-end"
      height="130px"
      contain
      src="@/assets/images/icons/icon-faces-mew.svg"
    />
    <v-spacer />
    <h4 class="link-box-title font-weight-bold mb-4">
      Friendly user interface
    </h4>
    <p>
      Access the Ethereum blockchain's original and most-trusted wallet client,
      now with a host of new features all contained in an elegant, easy and
      friendly interface.
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
//@import '@/assets/styles/GlobalVariables';

h4 {
  font-size: 22px;
  letter-spacing: -0.6px;
}

.v-card {
  border-radius: 10px !important;
}
</style>
