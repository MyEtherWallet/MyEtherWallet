<template lang="html">
  <div class="already-owned-dns-container">
    <div class="already-owned-dns-content">
      <h3>{{ domainName }} is already owned!</h3>
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
@import 'AlreadyOwnedDNSContainer.scss';
</style>
