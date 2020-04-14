<template lang="html">
  <div class="initial-state-ens">
    <form class="send-form">
      <div class="title-container">
        <div class="title">
          <h4>
            {{ $t('ens.title') }}
          </h4>
          <p>{{ $t('ens.search-domain-desc') }}</p>
        </div>
      </div>
      <div class="the-form domain-name">
        <input
          v-model="localDomainName"
          :class="[domainNameErr ? 'errored' : '']"
          :placeholder="$t('ens.ph.three-char')"
          type="text"
          name=""
        />
        <span v-show="!multiTld">.{{ tld }}</span>
      </div>
      <div class="error-message-container">
        <p
          v-show="contractInitiated === false"
          class="contract-loading-warning"
        >
          {{ $t('ens.warning.contract-not-ready') }}
        </p>
        <p v-show="domainNameErr" class="erroredMsg">
          <span v-if="!isValidLength && localDomainName !== ''">
            {{ $t('ens.warning.not-enough-char') }}
          </span>
          <span v-else> {{ $t('ens.warning.invalid-symbol') }} </span>
        </p>
      </div>
      <div class="submit-button-container">
        <button
          :class="[
            domainNameErr || localDomainName === '' ? 'disabled' : '',
            'submit-button large-round-button-green-filled clickable'
          ]"
          @click.prevent="checkDomain"
        >
          <span v-show="!loading"> {{ $t('ens.check-domain') }} </span>
          <i v-show="loading" class="fa fa-spinner fa-spin" />
        </button>
      </div>
    </form>

    <interface-bottom-text
      :link-text="$t('common.help-center')"
      :question="$t('common.have-issues')"
      link="https://kb.myetherwallet.com"
    />
  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText';
import { mapState } from 'vuex';
export default {
  components: {
    'interface-bottom-text': InterfaceBottomText
  },
  props: {
    checkDomain: {
      type: Function,
      default: function () {}
    },
    loading: {
      type: Boolean,
      default: false
    },
    contractInitiated: {
      type: Boolean,
      default: false
    },
    hostName: {
      type: String,
      default: ''
    },
    tld: {
      type: String,
      default: ''
    },
    domainNameErr: {
      type: Boolean,
      default: false
    },
    multiTld: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      localDomainName: this.hostName
    };
  },
  computed: {
    ...mapState('main', ['network']),
    isValidLength() {
      return (
        this.localDomainName.replace(
          '.' + this.network.type.ens.registrarTLD,
          ''
        ).length >= 3
      );
    }
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
