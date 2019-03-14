<template lang="html">
  <div class="dns-process-error">
    <div class="dns-process-content">
      <h3>No TXT setup found for {{ domainName }}!</h3>
      <p>
        On your DNS management console, please add a TXT type DNS entry "{{
          '_ens.' + domainName
        }}" with a value containing your Ethereum address in the format of
        "a=YOURETHREUMADDRESS"
      </p>
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
    }
  },
  mounted() {
    if (this.domainName === '') {
      this.$router.push('/interface/dapps/register-domain');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'DNSMissingTXT.scss';
</style>
