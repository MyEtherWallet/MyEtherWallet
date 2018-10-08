<template lang="html">
  <div class="initial-state-ens">
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
          :class="[domainNameErr ? 'errored' : '']"
          type="text"
          name=""
          placeholder="Please Enter at Least 7 Characters" >
        <span>.eth</span>
      </div>
      <p 
        v-show="domainNameErr" 
        class="erroredMsg">
        <span v-if="localDomainName.length < 7 && localDomainName !== ''">
          Domain name is less than 7 characters.
        </span>
        <span v-else>
          Invalid symbols on domain
        </span>
      </p>
      <div class="submit-button-container">
        <button
          :class="[domainNameErr || localDomainName === '' ? 'disabled' : '', 'submit-button large-round-button-green-filled clickable']"
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
    },
    domainNameErr: {
      type: Boolean,
      default: false
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
