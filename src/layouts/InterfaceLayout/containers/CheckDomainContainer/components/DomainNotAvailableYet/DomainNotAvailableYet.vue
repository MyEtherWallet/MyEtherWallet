<template>
  <div class="domain-not-available-yet">
    <div class="container__content">
      <div class="block__content">
        <div class="domain-availability">
          bestkat1234.eth is already owned
        </div>
      </div><!-- .block__content -->

      <div class="bottom-text-block">
        <interface-bottom-text
          :link-text="$t('interface.etherscanIO')"
          :question="$t('interface.ethNodeProvidedBy')"
          link="/"/>
      </div>
    </div><!-- .content-container -->
  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText';

export default {
  components: {
    'interface-bottom-text': InterfaceBottomText
  },
  props: {},
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'DomainNotAvailableYet-desktop.scss';
@import 'DomainNotAvailableYet-tablet.scss';
@import 'DomainNotAvailableYet-mobile.scss';
</style>
