<template lang="html">
  <div class="initial-state-unstoppable">
    <form class="send-form">
      <div class="title-container">
        <div class="title">
          <h4>
            {{ $t('unstoppable.search-domain-prompt') }}
          </h4>
        </div>
      </div>
      <div class="the-form domain-name">
        <input
          v-model="localDomainName"
          :class="[domainNameErr ? 'errored' : '']"
          :placeholder="$t('unstoppable.ph.six-char')"
          type="text"
          name=""
        />
        <span>.{{ tld }}</span>
      </div>
      <div class="error-message-container">
        <p v-show="domainNameErr" class="erroredMsg">
          <span v-if="!isValidLength && localDomainName !== ''">
            {{ $t('unstoppable.warning.not-enough-char') }}
          </span>
          <span v-else> {{ $t('unstoppable.warning.invalid-symbol') }} </span>
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
          <span v-show="!loading"> {{ $t('unstoppable.check-domain') }} </span>
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
    hostName: {
      type: String,
      default: ''
    },
    tld: {
      type: String,
      default: 'crypto'
    },
    domainNameErr: {
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
    isValidLength() {
      return this.localDomainName.replace(`.${this.tld}`, '').length >= 6;
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
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'InitialUnstoppableStateContainer.scss';
</style>
