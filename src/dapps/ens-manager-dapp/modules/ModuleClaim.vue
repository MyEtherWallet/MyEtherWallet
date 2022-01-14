<template>
  <v-sheet
    max-width="500px"
    color="transparent"
    class="px-3 py-8 py-md-13 mx-auto"
  >
    <claim-balance :balance="ensTokens.balance" :claimed="ensTokens.claimed" />
    <form
      v-if="!ensTokens.claimed && hasEnsTokenBalance"
      @submit.prevent="claimTokens"
    >
      <module-address-book
        :label="$t('ens.delegator.addr')"
        :is-valid-address-func="isValidDelegatorAddress"
        preselect-curr-wallet-adr
        @setAddress="setDelegatorAddress"
      />
      <mew-button
        :loading="loading"
        :disabled="isClaimDisabled"
        :has-full-width="true"
        btn-size="xlarge"
        :title="$t('ens.claim-token-title')"
        @click.native="claimTokens"
      />
    </form>
  </v-sheet>
</template>

<script>
import ModuleAddressBook from '@/modules/address-book/ModuleAddressBook';
import ClaimBalance from '../components/claim/ClaimBalance';
import { isAddress } from '@/core/helpers/addressUtils';
import { hasClaimed, submitClaim } from '../handlers/handlerENSTokenClaim';
import { mapState } from 'vuex';
import { toBN } from 'web3-utils';

export default {
  components: {
    ModuleAddressBook,
    ClaimBalance
  },
  data() {
    return {
      delegatorAddress: '',
      ensTokens: {
        claimed: false,
        balance: '0',
        proof: ''
      }
    };
  },
  computed: {
    ...mapState('wallet', ['address', 'web3']),
    hasEnsTokenBalance() {
      return toBN(this.ensTokens.balance).gt(toBN(0));
    },
    delegatorErrors() {
      if (!isAddress(this.delegatorAddress)) {
        return 'Invalid address!';
      }
      return '';
    },
    isClaimDisabled() {
      return (
        this.ensTokens.claimed ||
        this.delegatorErrors !== '' ||
        this.delegatorAddress === ''
      );
    }
  },
  mounted() {
    hasClaimed(this.address, this.web3).then(data => {
      this.ensTokens.claimed = data.claimed;
      this.ensTokens.balance = data.balance;
      this.ensTokens.proof = data.proof;
    });
  },
  methods: {
    claimTokens() {
      submitClaim(
        this.ensTokens.balance,
        this.ensTokens.proof,
        this.delegatorAddress,
        this.web3
      );
    },
    setDelegatorAddress(address) {
      this.delegatorAddress = address;
    },
    isValidDelegatorAddress(address) {
      return isAddress(address);
    }
  }
};
</script>
