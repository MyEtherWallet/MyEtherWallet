<template>
  <div class="domain-sale-container">
    <back-button/>
    <div class="send-form">
      <div class="title-container">
        <div class="title">
          <h4>{{ $t('interface.domSale') }}</h4>
          <p>{{ $t('interface.domSaleDesc') }}</p>
        </div>
      </div>
      <div class="the-form domain-name">
        <input
          type="number"
          name=""
          value=""
          placeholder="Please Enter at Least 7 Characters" >
        <span>.eth</span>
      </div>
    </div>

    <div class="submit-button-container">
      <div class="submit-button large-round-button-green-filled clickable">
        {{ $t('interface.checkDomain') }}
      </div>

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
import BackButton from '@/layouts/InterfaceLayout/components/BackButton';

export default {
  components: {
    'interface-bottom-text': InterfaceBottomText,
    'back-button': BackButton
  },
  data() {
    return {};
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
