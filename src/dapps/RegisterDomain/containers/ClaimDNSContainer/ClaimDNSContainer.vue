<template lang="html">
  <div class="claim-dns-container">
    <div class="claim-dns-content">
      <h3>Cheers!</h3>
      <p>{{ fullDomainName }} is claimable!</p>
      <div class="claim-dns-button">
        <button
          :class="[
            'large-round-button-green-filled',
            loading ? 'disabled' : ''
          ]"
          @click="claimDNS"
        >
          <span v-show="!loading">
            Claim
          </span>
          <i v-show="loading" class="fa fa-spinner fa-spin" />
        </button>
      </div>
    </div>
    <interface-bottom-text
      :link-text="$t('interface.helpCenter')"
      :question="$t('interface.haveIssues')"
      link="https://kb.myetherwallet.com"
    />
  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText';
import { mapGetters } from 'vuex';
import utils from 'web3-utils';
import BigNumber from 'bignumber.js';

export default {
  components: {
    'interface-bottom-text': InterfaceBottomText
  },
  props: {
    domainName: {
      type: String,
      default: ''
    },
    claimFunc: {
      type: Function,
      default: function() {}
    },
    loading: {
      type: Boolean,
      default: false
    },
    tld: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters({
      account: 'account',
      gasPrice: 'gasPrice'
    }),
    fullDomainName() {
      return `${this.domainName}.${this.tld}`;
    }
  },
  mounted() {
    if (this.domainName === '') {
      this.$router.push('/interface/dapps/register-domain');
    }
  },
  methods: {
    claimDNS() {
      console.log(this.domainName);
      const gpRounded = new BigNumber(Math.round(this.gasPrice)).toString();
      this.claimFunc({
        from: this.account.address.toLowerCase(),
        gasPrice: utils.toWei(gpRounded, 'gwei'),
        gas: 3000000,
        value: 0
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ClaimDNSContainer.scss';
</style>
