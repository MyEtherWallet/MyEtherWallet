<template lang="html">
  <div class="claim-dns-container">
    <div class="claim-dns-content">
      <h3>Cheers!</h3>
      <p>{{ domainName }} is claimable!</p>
      <div class="claim-dns-button">
        <button class="large-round-button-green-filled" @click="claimDNS">
          Claim
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
    }
  },
  computed: {
    ...mapGetters({
      account: 'account',
      gasPrice: 'gasPrice'
    })
  },
  mounted() {
    if (this.domainName === '') {
      this.$router.push('/interface/dapps/register-domain');
    }
  },
  methods: {
    claimDNS() {
      const gpRounded = new BigNumber(Math.round(this.gasPrice)).toString();
      this.claimFunc({
        from: this.account.address,
        gasPrice: utils.toWei(gpRounded, 'gwei'),
        gas: 5000000
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ClaimDNSContainer.scss';
</style>
