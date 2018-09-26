<template lang="html">
  <div class="name-forbidden-container">
    <h3>{{ domainName }}.eth is not available yet!</h3>
    <div class="back-button">
      <button @click="cancel">{{ $t('common.back') }}</button>
    </div>
    <interface-bottom-text
      :link-text="$t('interface.learnMore')"
      :question="$t('interface.haveIssues')"
      link="/"/>
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
    cancel: {
      type: Function,
      default: function() {}
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'NameForbiddenContainer.scss';
</style>
