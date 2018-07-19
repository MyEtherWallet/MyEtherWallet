<template>
  <div class="register-domain-container">
    <back-button :resetView="resetView"></back-button>

    <div class="send-form">
      <div class="title-container">
        <div class="title">
          <h4>{{ $t('interface.registerDns') }}</h4>
          <p>{{ $t('interface.registerDnsDesc') }}</p>
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
          <h4 class="modal-title">{{ $t('interface.subDomain') }}</h4>
          <div class="margin-left-auto add-custom-network">
            <div class="sliding-switch-white">
              <label class="switch">
                <input v-on:click="expendDomainCheckForm" type="checkbox">
                <span class="slider round"></span>
              </label>
            </div>
          </div>
        </div>
        <div class="domain-check-form hidden" ref="checkForm">
          <div class="domain-checker">
            <input type="number" name="" value="" placeholder="Enter Domain Name">
            <div class="check-button" v-on:click="domainAvailabilityCheck">
              {{ $t('reused.check') }}
            </div>
          </div>
        </div>
        <div class="sub-domain-list hidden" ref="domainList">
          <h4 class="title">{{ $t('interface.allSubDomains') }}</h4>
          <ul>
            <li>
              <p>myetherwallet2018.etherbase.eth</p>
              <div class="buy-button-container">
                <p>0 ETH</p>
                <div v-on:click="domainBuyButtonClick($event)" class="buy-button very-small-circle-button-green-border">
                  {{ $t('reused.buy') }}
                </div>
              </div>
            </li>
            <li>
              <p>myetherwallet2018.etherbase.eth</p>
              <div class="buy-button-container">
                <p>0 ETH</p>
                <div v-on:click="domainBuyButtonClick($event)" class="buy-button very-small-circle-button-green-border very-small-circle-button-green-filled">
                  {{ $t('reused.buy') }}
                </div>
              </div>
            </li>
            <li>
              <p>myetherwallet2018.etherbase.eth</p>
              <div class="buy-button-container">
                <p>0 ETH</p>
                <div v-on:click="domainBuyButtonClick($event)" class="buy-button very-small-circle-button-green-border">
                  {{ $t('reused.buy') }}
                </div>
              </div>
            </li>
            <li>
              <p>myetherwallet2018.etherbase.eth</p>
              <div class="buy-button-container">
                <p>0 ETH</p>
                <div v-on:click="domainBuyButtonClick($event)" class="buy-button very-small-circle-button-green-border">
                  {{ $t('reused.buy') }}
                </div>
              </div>
            </li>
            <li>
              <p>myetherwallet2018.etherbase.eth</p>
              <div class="buy-button-container">
                <p>0 ETH</p>
                <div v-on:click="domainBuyButtonClick($event)" class="buy-button very-small-circle-button-green-border">
                  {{ $t('reused.buy') }}
                </div>
              </div>
            </li>
            <li>
              <p>myetherwallet2018.etherbase.eth</p>
              <div class="buy-button-container">
                <p>0 ETH</p>
                <div v-on:click="domainBuyButtonClick($event)" class="buy-button very-small-circle-button-green-border">
                  {{ $t('reused.buy') }}
                </div>
              </div>
            </li>
            <li>
              <p>myetherwallet2018.etherbase.eth</p>
              <div class="buy-button-container">
                <p>0 ETH</p>
                <div v-on:click="domainBuyButtonClick($event)" class="buy-button very-small-circle-button-green-border">
                  {{ $t('reused.buy') }}
                </div>
              </div>
            </li>
          </ul>
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
      this.$refs['checkForm'].classList.toggle('hidden')
      this.$refs['domainList'].classList.add('hidden')
    },
    domainAvailabilityCheck () {
      // this.$refs['checkForm'].classList.toggle('hidden')
      this.$refs['domainList'].classList.add('hidden')
    },
    domainBuyButtonClick ($event) {
      // $event.toElement.classList.toggle('very-small-circle-button-green-filled')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "RegisterDomainContainer.scss";
</style>
