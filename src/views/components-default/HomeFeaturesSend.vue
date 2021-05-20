<template>
  <mew6-white-sheet
    class="mew-component--features-send pa-6 pa-md-10"
    max-width="700px"
  >
    <div class="mew-heading-1 mb-3">Send transaction</div>
    <div>
      MEW puts the Ethereum Blockchain at your fingertips, use MEW to send the
      transaction in a simple way.
    </div>
    <div class="mt-10">
      <v-row>
        <v-col cols="12" md="6">
          <mew-select label="Type" :items="tokens" />
        </v-col>
        <v-col cols="12" md="6">
          <mew-input
            v-model="data"
            placeholder="0x..."
            :label="$t('sendTx.add-data')"
          />
        </v-col>
        <v-col cols="12" class="mt-n5">
          <module-address-book is-home-page />
        </v-col>
      </v-row>
      <mew-button
        title="Send"
        btn-size="xlarge"
        class="mx-auto mt-5 d-block"
        @click.native="$router.push({ name: 'AccessWallet', params: {} })"
      />
    </div>
  </mew6-white-sheet>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import ModuleAddressBook from '@/modules/address-book/ModuleAddressBook';

export default {
  name: 'HomeFeaturesSend',
  components: { ModuleAddressBook },
  data: () => ({
    data: '0'
  }),
  computed: {
    ...mapState('wallet', ['balance', 'web3', 'address']),
    ...mapState('global', ['online']),
    ...mapGetters('global', ['network', 'gasPrice']),
    ...mapGetters('wallet', ['balanceInETH', 'tokensList']),
    tokens() {
      const eth = {
        name: this.network.type.name,
        symbol: this.network.type.name,
        subtext: this.network.type.name_long,
        value: this.network.type.name_long,
        balance: this.balance,
        img: this.network.type.icon,
        decimals: 18,
        market_cap: null,
        price_change_percentage_24h: null
      };

      const copiedTokens = this.tokensList.slice();
      copiedTokens.unshift(eth);
      return copiedTokens;
    }
  }
};
</script>

<style lang="scss" scoped></style>
