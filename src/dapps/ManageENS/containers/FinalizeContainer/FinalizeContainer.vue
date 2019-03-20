<template>
  <div>
    <div class="finalize-container">
      <h3>{{ $t('dapps.finalizeDesc') }}: {{ domainName }}</h3>
      <button class="finalize-button" @click="finalize">
        {{ $t('dapps.finalize') }}
      </button>
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
    finalize: {
      type: Function,
      default: function() {}
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
@import 'FinalizeContainer.scss';
</style>
