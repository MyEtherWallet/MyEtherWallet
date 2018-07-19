<template>
  <div class="domain-sale-container">
    <back-button :resetView="resetView"></back-button>
    <div class="send-form">
      <div class="title-container">
        <div class="title">
          <h4>{{ $t('interface.domSale') }}</h4>
          <p>{{ $t('interface.domSaleDesc') }}</p>
        </div>
      </div>
      <div class="the-form domain-name">
        <input type="number" name="" value="" placeholder="Please Enter at Least 7 Characters">
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
          <div class="margin-left-auto add-custom-network">
            <div class="sliding-switch-white">
              <label class="switch">
                <input v-on:click="expendDomainCheckForm" type="checkbox">
                <span class="slider round"></span>
              </label>
            </div>
          </div>
        </div>
        <div class="domain-check-form hidden" ref="domainCheckForm">
          <div class="domain-checker">
            <input type="number" name="" value="" placeholder="Please Enter Sub Domain Name">
            <div class="check-button">
              {{ $t('reused.check') }}
            </div>
          </div>
        </div>
      </div>
      <interface-bottom-text link="/" :linkText="$t('interface.learnMore')" :question="$t('interface.haveIssues')"></interface-bottom-text>
    </div>

  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText'
import BackButton from '../../components/BackButton'

export default {
  props: ['resetView'],
  components: {
    'interface-bottom-text': InterfaceBottomText,
    'back-button': BackButton
  },
  data () {
    return {
    }
  },
  methods: {
    expendDomainCheckForm () {
      this.$refs.domainCheckForm.classList.toggle('hidden')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "DomainSaleContainer.scss";
</style>
