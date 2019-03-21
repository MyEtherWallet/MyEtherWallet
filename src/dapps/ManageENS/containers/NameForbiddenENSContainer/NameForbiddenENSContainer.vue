<template lang="html">
  <div class="name-forbidden-container">
    <h3>{{ domainName }}.eth {{ $t('dapps.ensNotAvailable') }}!</h3>
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
      this.$router.push('/interface/dapps/manage-ens');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'NameForbiddenENSContainer.scss';
</style>
