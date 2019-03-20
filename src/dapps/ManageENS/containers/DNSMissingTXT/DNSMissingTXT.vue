<template lang="html">
  <div class="dns-process-error">
    <div
      v-if="owner === '0x0000000000000000000000000000000000000000'"
      class="dns-process-content"
    >
      <h3>No TXT setup found for {{ domainName }}!</h3>
      <p>
        On your DNS management console, please add a TXT type DNS entry "{{
          '_ens.' + domainName
        }}" with a value containing your Ethereum address in the format of
        "a=YOURETHREUMADDRESS"
      </p>
    </div>
    <div v-else class="dns-process-content">
      <h3>
        This name is currently owned in ENS by {{ owner }} but TXT record is no
        longer available for {{ domainName }}!
      </h3>
      <p>
        You can unclaim this {{ domainName }} from ENS by clicking the following
        button
      </p>
      <div class="claim-dns-button">
        <button
          :class="[
            'large-round-button-green-filled',
            loading ? 'disabled' : ''
          ]"
          @click="claimFunc"
        >
          <span v-show="!loading">
            Unclaim
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
export default {
  components: {
    'interface-bottom-text': InterfaceBottomText
  },
  props: {
    domainName: {
      type: String,
      default: ''
    },
    owner: {
      type: String,
      default: ''
    },
    claimFunc: {
      type: Function,
      default: function() {}
    },
    dnsClaim: {
      type: Object,
      default: () => {
        return {};
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    if (this.domainName === '.') {
      this.$router.push('/interface/dapps/manage-ens');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'DNSMissingTXT.scss';
</style>
