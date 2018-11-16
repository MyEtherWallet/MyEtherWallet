<template>
  <div>
    <div class="finalize-container">
      <h3>{{ $t('dapps.finalizeDesc') }}: {{ domainName }}.eth</h3>
      <button class="finalize-button" @click="finalize">
        {{ $t('dapps.finalize') }}
      </button>
    </div>
    <interface-bottom-text
      :link-text="$t('interface.learnMore')"
      :question="$t('interface.haveIssues')"
      link="mailto:support@myetherwallet.com"
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
  }
};
</script>
<style lang="scss" scoped>
@import 'FinalizeContainer.scss';
</style>
