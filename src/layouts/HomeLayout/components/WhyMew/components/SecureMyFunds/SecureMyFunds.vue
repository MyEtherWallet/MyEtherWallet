<template>
  <v-card class="pa-8" outlined max-width="300">
    <h4 class="link-box-title font-weight-bold mb-4">
      Secure my funds
    </h4>
    <div>
      MEWconnect, an official, free companion app for MEW that helps you secure
      your funds as never before.
    </div>

    <div class="action-block mt-2 ml-n4">
      <v-btn color="teal lighten-3" class="font-weight-bold" text>
        Learn more<v-icon class="ml-1 title">mdi-arrow-right</v-icon>
      </v-btn>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'FriendlyToUse',
  components: {}
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables';

h4 {
  font-size: 22px;
  letter-spacing: -0.6px;
}

.v-card {
  border-radius: 10px !important;
}
</style>
