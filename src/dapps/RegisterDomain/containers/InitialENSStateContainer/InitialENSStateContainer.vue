<template lang="html">
  <div>
    <form class="send-form">
      <div class="title-container">
        <div class="title">
          <h4>{{ $t('interface.registerDns') }}</h4>
          <p>{{ $t('interface.registerDnsDesc') }}</p>
        </div>
      </div>
      <div class="the-form domain-name">
        <input
          v-model="localDomainName"
          :class="[localDomainName.length < 7 && localDomainName !== '' ? 'errored' : '']"
          type="text"
          name=""
          placeholder="Please Enter at Least 7 Characters" >
        <span>.eth</span>
      </div>
      <p
        v-show="localDomainName.length < 7 && localDomainName !== ''"
        class="erroredMsg"> Domain name is less than 7 characters. </p>
      <div class="submit-button-container">
        <button
          :class="[localDomainName.length < 7 ? 'disabled' : '', 'submit-button large-round-button-green-filled clickable']"
          @click.prevent="checkDomain">
          <span v-show="!loading"> {{ $t('interface.checkDomain') }} </span>
          <i
            v-show="loading"
            class="fa fa-spinner fa-spin"/>
        </button>

      </div>
      <p
        v-show="contractInitiated === false"
        class="contract-loading-warning">Contract is not ready yet, transaction might fail.</p>
    </form>

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
      <!-- <div
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
                @click="domainBuyButtonClick">
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
                @click="domainBuyButtonClick">
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
                @click="domainBuyButtonClick">
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
                @click="domainBuyButtonClick">
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
                @click="domainBuyButtonClick">
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
                @click="domainBuyButtonClick">
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
                @click="domainBuyButtonClick">
                {{ $t('common.buy') }}
              </div>
            </div>
          </li>
        </ul>
      </div> -->
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
    checkDomain: {
      type: Function,
      default: function() {}
    },
    loading: {
      type: Boolean,
      default: false
    },
    contractInitiated: {
      type: Boolean,
      default: false
    },
    domainName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      localDomainName: this.domainName
    };
  },
  watch: {
    localDomainName(newVal) {
      this.$emit('domainNameChange', newVal);
    },
    domainName(newVal) {
      this.localDomainName = newVal;
    }
  },
  methods: {
    expendDomainCheckForm() {
      this.$refs['checkForm'].classList.toggle('hidden');
      this.$refs['domainList'].classList.add('hidden');
    },
    domainAvailabilityCheck() {
      this.$refs['domainList'].classList.add('hidden');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'InitialENSStateContainer.scss';
</style>
