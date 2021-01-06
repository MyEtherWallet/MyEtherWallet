<template>
  <v-sheet
    elevation="10"
    width="100%"
    max-width="600px"
    class="mx-auto pa-8"
    rounded
  >
    <div class="d-flex align-center bg_datablock pa-6 border-radius--10px">
      <v-icon class="check-icon primary--text mr-3">
        {{ getIcon() }}
      </v-icon>
      <div>
        <div class="mew-heading-2 primary--text mb-2">Available</div>
        <div class="mew-heading-2 error--text mb-1">
          Domain has been taken
        </div>
        <div class="mew-heading-2">mewdev009.eth</div>
      </div>
    </div>
    <div class="pa-3 mt-3 mb-7 text-center">
      Once you have a domain name, you can tell your friends to send ETH to your
      domain name instead of your address.
    </div>
    <mew-select label="Choose the term to keep your domain" :items="items" />

    <div class="font-weight-bold text-center">Price: 0.0031 ETH ($12.31)</div>
    <div class="d-flex justify-center mt-6">
      <mew-button title="Request registration" btn-size="xlarge" />
    </div>
  </v-sheet>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      available: false,
      items: [
        {
          name: 'ETH',
          subtext: 'Ethereum',
          value: 'Ethereum'
        }
      ]
    };
  },
  methods: {
    getIcon() {
      return this.available ? 'mdi-check-circle-outline' : 'mdi-do-not-disturb'
    }
  }
};
</script>

<style lang="scss" scoped>
.check-icon {
  font-size: 65px !important;
}
</style>
