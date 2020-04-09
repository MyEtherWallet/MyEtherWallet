<template>
  <div>
    <v-col class="d-flex" cols="12" sm="6">
      <v-select
        v-model="network"
        label="Network"
        placeholder="Choose your network"
        outlined
        color="teal accent-4"
        :clearable="false"
        :items="items"
        item-text="name"
        item-value="value"
      ></v-select>
    </v-col>

    <StdButton size="x-large" fullwidth>
      Save
    </StdButton>
  </div>
</template>

<script>
import StdButton from '@/web/components/StdButton';

export default {
  components: { StdButton },
  data() {
    return {
      network: {},
      items: [
        { name: 'ETH - Ethereum', value: 'eth' },
        { name: 'BTC - Bitcoin', value: 'btc' }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables.scss';
</style>
