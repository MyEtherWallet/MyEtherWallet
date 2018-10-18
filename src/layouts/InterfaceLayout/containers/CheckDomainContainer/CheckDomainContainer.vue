<template>
  <div class="register-domain-container">
    <back-button 
      :reset-view="resetView" 
      :options="backButtonOptions" />

    <div class="container__content">
      <div class="block__content">
        <div class="domain-availability">
          bestkat1234.eth is available
        </div>
        <div class="domain-info-buttons">
          <div>Bid Information</div>
          <div>Detail Information</div>
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

  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText';
import BackButton from '../../components/BackButton';

export default {
  components: {
    'interface-bottom-text': InterfaceBottomText,
    'back-button': BackButton
  },
  props: {},
  data() {
    return {
      backButtonOptions: {
        titleText: this.$t('common.checkDomain')
      },
      buttonCheckDomain: {
        title: 'Save & Next',
        buttonStyle: 'green',
        rightArrow: false,
        fullWidth: false
      },
      inputDomain: {
        title: '',
        value: '',
        type: 'text',
        buttonCopy: false,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: '',
        popover: '',
        placeHolder: 'Please Enter at Least 7 Characters',
        rightInputText: ''
      }
    };
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'CheckDomainContainer-desktop.scss';
@import 'CheckDomainContainer-tablet.scss';
@import 'CheckDomainContainer-mobile.scss';
</style>
