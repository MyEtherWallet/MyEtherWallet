<template lang="html">
  <div class="dns-process-error">
    <div class="dns-process-content">
      <h3>{{ $t('ens.error.dns-sec-not-found') }}</h3>
      <p>{{ $t('ens.enable-dns-sec', { domain: domainName }) }}</p>
    </div>
    <interface-bottom-text
      :link-text="$t('common.help-center')"
      :question="$t('common.have-issues')"
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
      this.$router.push('/interface/dapps/manage-ens');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'DNSProcessErrorContainer.scss';
</style>
