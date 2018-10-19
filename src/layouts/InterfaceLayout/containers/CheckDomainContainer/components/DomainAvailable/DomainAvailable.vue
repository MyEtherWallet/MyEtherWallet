<template>
  <div class="domain-available">
    <div class="container__content">
      <div class="block__content">
        <div class="domain-availability">
          bestkat1234.eth is available
        </div>
        <div class="dropdown-information">
          <dropdown-bid-info />
        </div>
      </div>

      <div class="block__submit-button">
        <standard-button 
          :options="buttonCheckDomain"
          class="the-submit-button"
          @click.native="modalStatusDomainTaken = 'show'"
        />
        <interface-bottom-text
          :link-text="$t('interface.etherscanIO')"
          :question="$t('interface.ethNodeProvidedBy')"
          link="/"/>
      </div>
    </div><!-- .content-container -->

    <domain-confirm-modal />
    <success-modal />
  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText';
import DropdownBidInfo from '../DropdownBidInfo';
import DomainConfirmModal from '@/containers/ConfirmationContainer/components/DomainConfirmModal';
import SuccessModal from '@/containers/ConfirmationContainer/components/SuccessModal';

export default {
  components: {
    'interface-bottom-text': InterfaceBottomText,
    'dropdown-bid-info': DropdownBidInfo,
    'domain-confirm-modal': DomainConfirmModal,
    'success-modal': SuccessModal
  },
  props: {},
  data() {
    return {
      buttonCheckDomain: {
        title: 'Save & Next',
        buttonStyle: 'green',
        rightArrow: false,
        fullWidth: false,
        isThisMobileBottomButton: false
      }
    };
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'DomainAvailable-desktop.scss';
@import 'DomainAvailable-tablet.scss';
@import 'DomainAvailable-mobile.scss';
</style>
