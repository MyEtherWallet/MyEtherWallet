<template>
  <div class="pa-6">
    <v-sheet color="transparent" max-width="550px" class="mb-7 locale-config">
      <mew-select
        ref="mewSelect"
        label="Currency"
        class="testing"
        filter-placeholder="Search currency"
        :items="currencies"
        :value="currency"
        :is-custom="true"
        @input="setCurrencyType"
      />
    </v-sheet>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import currencyList from './currencyList';
export default {
  name: 'SettingsLocaleConfig',
  data() {
    return {
      currencyList,
      currency: {}
    };
  },
  computed: {
    ...mapState('global', ['locale', 'preferredCurrency']),
    currencies() {
      const imgs = this.currencyList.map(c => c.img);
      return [
        {
          imgs,
          divider: true
        },
        ...this.currencyList
      ];
    },
    getCurrentCurrency() {
      return this.currencyList.find(c => c.value === this.preferredCurrency);
    }
  },
  mounted() {
    this.currency = this.getCurrentCurrency;
  },
  methods: {
    ...mapActions('global', ['setLocale', 'setPreferredCurrency']),
    ...mapActions('external', ['setCurrency']),
    setCurrencyType(value) {
      this.setPreferredCurrency(value.value);
      this.setCurrency(value.value);
    }
  }
};
</script>

<style lang="scss" scoped>
.locale-config >>> .v-menu__content .align-end {
  display: none !important;
}
</style>
