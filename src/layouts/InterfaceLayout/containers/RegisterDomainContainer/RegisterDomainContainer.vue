<template>
  <div class="register-domain-container">
    <back-button :reset-view="resetView"/>

    <div class="send-form">
      <div class="title-container">
        <div class="title">
          <h4>{{ $t('interface.registerDns') }}</h4>
          <p>{{ $t('interface.registerDnsDesc') }}</p>
        </div>
      </div>
      <div class="the-form domain-name">
        <input
          v-model="domainName"
          :class="[domainName.length <= 7 && domainName !== '' ? 'errored' : '']"
          type="text"
          name=""
          placeholder="Please Enter at Least 7 Characters" >
        <span>.eth</span>
      </div>
      <p
        v-show="domainName.length <= 7 && domainName !== ''"
        class="erroredMsg"> Domain name is less than 7 characters. </p>
    </div>

    <div class="submit-button-container">
      <div :class="[domainName.length <= 7 ? 'disabled' : '','submit-button large-round-button-green-filled clickable']">
        {{ $t('interface.checkDomain') }}
      </div>

    </div>
    <div class="flex-container">
      <div class="title-container">
        <h4 class="modal-title">{{ $t('interface.subDomain') }}</h4>
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
        ref="checkForm"
        class="domain-check-form hidden">
        <div class="domain-checker">
          <input
            type="number"
            name=""
            value=""
            placeholder="Enter Domain Name" >
          <div
            class="check-button"
            @click="domainAvailabilityCheck">
            {{ $t('common.check') }}
          </div>
        </div>
      </div>
      <div
        ref="domainList"
        class="sub-domain-list hidden">
        <h4 class="title">{{ $t('interface.allSubDomains') }}</h4>
        <ul>
          <li>
            <p>myetherwallet2018.etherbase.eth</p>
            <div class="buy-button-container">
              <p>0 ETH</p>
              <div
                class="buy-button very-small-circle-button-green-border"
                @click="domainBuyButtonClick($event)">
                {{ $t('common.buy') }}
              </div>
            </div>
          </li>
          <li>
            <p>myetherwallet2018.etherbase.eth</p>
            <div class="buy-button-container">
              <p>0 ETH</p>
              <div
                class="buy-button very-small-circle-button-green-border very-small-circle-button-green-filled"
                @click="domainBuyButtonClick($event)">
                {{ $t('common.buy') }}
              </div>
            </div>
          </li>
          <li>
            <p>myetherwallet2018.etherbase.eth</p>
            <div class="buy-button-container">
              <p>0 ETH</p>
              <div
                class="buy-button very-small-circle-button-green-border"
                @click="domainBuyButtonClick($event)">
                {{ $t('common.buy') }}
              </div>
            </div>
          </li>
          <li>
            <p>myetherwallet2018.etherbase.eth</p>
            <div class="buy-button-container">
              <p>0 ETH</p>
              <div
                class="buy-button very-small-circle-button-green-border"
                @click="domainBuyButtonClick($event)">
                {{ $t('common.buy') }}
              </div>
            </div>
          </li>
          <li>
            <p>myetherwallet2018.etherbase.eth</p>
            <div class="buy-button-container">
              <p>0 ETH</p>
              <div
                class="buy-button very-small-circle-button-green-border"
                @click="domainBuyButtonClick($event)">
                {{ $t('common.buy') }}
              </div>
            </div>
          </li>
          <li>
            <p>myetherwallet2018.etherbase.eth</p>
            <div class="buy-button-container">
              <p>0 ETH</p>
              <div
                class="buy-button very-small-circle-button-green-border"
                @click="domainBuyButtonClick($event)">
                {{ $t('common.buy') }}
              </div>
            </div>
          </li>
          <li>
            <p>myetherwallet2018.etherbase.eth</p>
            <div class="buy-button-container">
              <p>0 ETH</p>
              <div
                class="buy-button very-small-circle-button-green-border"
                @click="domainBuyButtonClick($event)">
                {{ $t('common.buy') }}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <interface-bottom-text
      :link-text="$t('interface.learnMore')"
      :question="$t('interface.haveIssues')"
      link="/"/>

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
      domainName: ''
    };
  },
  methods: {
    expendDomainCheckForm() {
      this.$refs['checkForm'].classList.toggle('hidden');
      this.$refs['domainList'].classList.add('hidden');
    },
    domainAvailabilityCheck() {
      // this.$refs['checkForm'].classList.toggle('hidden')
      this.$refs['domainList'].classList.add('hidden');
    },
    domainBuyButtonClick() {
      // $event.toElement.classList.toggle('very-small-circle-button-green-filled')
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'RegisterDomainContainer.scss';
</style>
