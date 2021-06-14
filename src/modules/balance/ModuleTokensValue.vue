<template>
  <mew6-white-sheet class="px-5 px-lg-7 py-5 d-flex justify-space-between">
    <v-row no-gutters>
      <v-col cols="12">
        <div class="mew-heading-2 mb-3">{{ tokenTitle }}</div>
      </v-col>
      <v-col cols="12">
        <div class="mew-heading-3">$ {{ totalTokenValues }}</div>
      </v-col>
      <v-col v-if="showTokens" cols="12" class="mt-3">
        <v-row justify="space-between">
          <v-col v-for="(img, idx) in tokenImages" :key="idx + img" cols="2">
            <img :src="img" height="32px" />
          </v-col>
          <v-col v-if="moreTokensCount > 0" cols="2">
            <div class="circled-total align-center justify-end">
              +{{ moreTokensCount }}
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </mew6-white-sheet>
</template>

<script>
import { mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import { formatFiatValue } from '@/core/helpers/numberFormatHelper';
export default {
  name: 'ModuleTokensValue',
  computed: {
    ...mapGetters('wallet', ['tokensList']),
    tokenTitle() {
      return `My Token${this.tokensList.length > 1 ? 's' : ''} Value`;
    },
    totalTokenValues() {
      let total = BigNumber(0);
      this.tokensList.forEach(token => {
        const value = token.totalBalanceRaw ? token.totalBalanceRaw : 0;
        total = total.plus(value);
      });
      return formatFiatValue(total).value;
    },
    tokenImages() {
      const firstFive = this.tokensList.slice(0, 5);
      return firstFive.map(item => {
        return item.img;
      });
    },
    moreTokensCount() {
      return this.tokensList.length - this.tokenImages.length;
    },
    showTokens() {
      return this.tokensList.length > 0;
    }
  }
};
</script>
<style lang="scss" scoped>
.circled-total {
  border-radius: 50%;
  width: 32px;
  height: 32px;
  padding-top: 5px !important;
  color: #05c0a5;
  border: 1px dashed #05c0a5;
  text-align: center;
}
</style>
