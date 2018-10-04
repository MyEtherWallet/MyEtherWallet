<template>
  <div class="domain-sale-container">
    <back-button :reset-view="resetView"/>
    <div class="send-form">
      <div class="title-container">
        <div class="title">
          <h4>{{ $t('interface.domSale') }}</h4>
          <p>{{ $t('interface.domSaleDesc') }}</p>
        </div>
      </div>
      <div class="the-form domain-name">
        <standard-input :options="inputDomain" />
        <span>.eth</span>
      </div>
    </div>

    <div class="submit-button-container">

      <standard-button 
        :options="buttonCheckDomain"        
      />


      <div class="flex-container">
        <div class="title-container">
          <h4 class="modal-title">{{ $t('interface.domSaleBal') }}</h4>
          <popover :popcontent="$t('popover.whatIsSpeedOfTX')"/>
          <div class="margin-left-auto add-custom-network">
            <div class="sliding-switch-white">
              <label class="switch">
                <input
                  type="checkbox"
                  @click="expendDomainCheckForm" >
                <span class="slider round"/>
              </label>
            </div>
          </div>
        </div>
        <div
          ref="domainCheckForm"
          class="domain-check-form hidden">
          <div class="domain-checker">
            <input
              type="number"
              name=""
              value=""
              placeholder="Please Enter Sub Domain Name" >
            <div class="check-button">
              {{ $t('common.check') }}
            </div>
          </div>
        </div>
      </div>
      <interface-bottom-text
        :link-text="$t('interface.learnMore')"
        :question="$t('interface.haveIssues')"
        link="/"/>
    </div>

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
  props: {
    resetView: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {
      buttonCheckDomain: {
        title: 'Check Domain',
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
  methods: {
    expendDomainCheckForm() {
      this.$refs.domainCheckForm.classList.toggle('hidden');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'DomainSaleContainer.scss';
</style>
