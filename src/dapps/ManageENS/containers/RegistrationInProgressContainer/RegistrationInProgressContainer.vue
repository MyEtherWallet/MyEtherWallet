<template lang="html">
  <div class="registration-in-progress-container">
    <div class="registration-in-progress-content">
      <div id="wait-container" class="commitment-wait">
        <div class="circles-container">
          <div class="circle" />
          <div class="circle" />
          <div class="circle" />
        </div>
        <h3>
          Registration in progress for <br />
          <span class="domain-name"> {{ fullDomainName }}... </span>
        </h3>
      </div>
    </div>
    <interface-bottom-text
      :link-text="$t('common.help-center')"
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
    hostName: {
      type: String,
      default: ''
    },
    tld: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  },
  computed: {
    fullDomainName() {
      return `${this.hostName}.${this.tld}`;
    }
  },
  mounted() {
    if (this.hostName === '') this.$router.push('/interface/dapps/manage-ens');
  }
};
</script>

<style lang="scss" scoped>
@import 'RegistrationInProgressContainer.scss';
</style>
