<template>
  <div class="mb-1">
    <!--
    ===================================================
      Claim TITLE:
    ===================================================
    -->
    <div class="mew-heading-2 mb-2">
      {{ $t('ens.claim-token-desc') }}
    </div>
    <div class="textLight--text mb-4">
      {{ $t('ens.claim.desc') }}
      <a
        href="https://ens.mirror.xyz/-eaqMv7XPikvXhvjbjzzPNLS4wzcQ8vdOgi9eNXeUuY"
        target="_blank"
        >{{ $t('common.learn-more') }}.</a
      >
    </div>
    <!--
    ===================================================
      Claim Balance:
    ===================================================
    -->
    <div
      class="border-container rounded-lg pa-5 mb-4 d-flex justify-space-between claim-border-container"
    >
      <v-row class="align-center justify-start" no-gutters>
        <v-col cols="12">
          <div
            :class="[
              { 'mb-4': hasBalance },
              hasBalance ? 'greenPrimary--text' : 'bluePrimary--text',
              'font-weight-bold'
            ]"
          >
            <span>
              <v-icon
                :class="[
                  hasBalance ? 'greenPrimary--text' : 'bluePrimary--text',
                  'mr-1'
                ]"
                size="16px"
                >{{ alertIcon }}</v-icon
              ></span
            >
            {{ eligibaleString }}
          </div>
        </v-col>
        <v-col v-if="hasBalance" cols="12" sm="4" class="d-flex align-center">
          <div class="textLight--text">{{ recivedString }}</div>
        </v-col>
        <v-col v-if="hasBalance" cols="12" sm="8">
          <v-row class="align-center justify-end mr-2">
            <img
              src="https://img.mewapi.io/?image=https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/ENS-0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72.png"
              height="24"
              class="mr-2"
              contain
            />
            <div class="mew-heading-2 textDark--text text-right">
              {{ ensTokenBalance }}
            </div>
          </v-row>
        </v-col>
      </v-row>
    </div>
    <!--
    ===================================================
      Delegator:
    ===================================================
    -->
    <div v-if="isEligable">
      <div class="mew-heading-3 font-weight-bold mt-8 mb-2">
        {{ $t('ens.delegator.title') }}
      </div>
      <div class="textLight--text mb-4">
        {{ $t('ens.delegator.desc-one') }}
        <a href="https://sybil.org/#/delegates/ens" target="_blank">{{
          $t('common.here')
        }}</a
        >.
        {{ $t('ens.delegator.desc-two') }}
        <a
          href="https://ens.mirror.xyz/cfvfKRpQSPtZJjPQOprWqEeqv2rytE7tQkxDg6ht7Oo"
          target="_blank"
          >{{ $t('common.here') }}</a
        >.
      </div>
    </div>
  </div>
</template>

<script>
import { fromWei } from 'web3-utils';
import { toBN } from 'web3-utils';

export default {
  props: {
    claimed: {
      type: Boolean,
      defualt: false
    },
    balance: {
      type: String,
      default: '0'
    }
  },
  computed: {
    ensTokenBalance() {
      return fromWei(this.balance);
    },
    isEligable() {
      return !this.claimed && this.hasBalance;
    },
    hasBalance() {
      return toBN(this.balance).gt(toBN(0));
    },
    eligibaleString() {
      if (this.claimed) {
        return this.$t('ens.claim.eligibale-claimed');
      }
      if (this.hasBalance) {
        return this.$t('ens.claim.eligibale');
      }
      return this.$t('ens.claim.non-eligibale');
    },
    recivedString() {
      if (this.claimed) {
        return this.$t('ens.claim.recieved');
      }

      return this.$t('ens.claim.recieve');
    },
    alertIcon() {
      return this.hasBalance ? 'mdi-checkbox-marked-circle' : 'mdi-information';
    }
  }
};
</script>
