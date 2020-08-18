<template>
  <mew6-white-sheet>
    <v-sheet width="100%" max-width="600px" class="mx-auto pa-8">
      <div class="d-flex align-center bg_datablock pa-6 border-radius--10px">
        <v-icon class="check-icon emerald--text mr-3">
          mdi-check-circle-outline
        </v-icon>
        <div>
          <div class="mew-heading-2 emerald--text mb-1">Available</div>
          <div class="mew-heading-2">mewdev009.eth</div>
        </div>
      </div>
      <div class="pa-3 mt-3 mb-7 text-center">
        Once you have a domain name, you can tell your friends to send ETH to
        your domain name instead of your address.
      </div>
      <mew-select label="Choose the term to keep your domain" :items="items" />

      <div class="font-weight-bold text-center">Price: 0.0031 ETH ($12.31)</div>
      <div class="d-flex justify-center mt-6">
        <mew-button title="Request registration" button-size="xlarge" />
      </div>
    </v-sheet>
  </mew6-white-sheet>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      items: [
        {
          name: 'ETH',
          subtext: 'Ethereum',
          value: 'Ethereum'
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.check-icon {
  font-size: 65px !important;
}
</style>
