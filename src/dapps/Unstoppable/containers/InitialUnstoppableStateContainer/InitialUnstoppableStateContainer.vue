<template lang="html">
  <div class="initial-state-unstoppable">
    <form class="send-form">
      <div class="title-container">
        <div class="title">
          <span>
            {{ $t('unstoppable.search-domain-prompt') }}
          </span>
        </div>
      </div>
      <div class="the-form">
        <div class="domain-name">
          <input
            v-model="localDomainName"
            :class="[domainNameErr ? 'errored' : '']"
            :placeholder="$t('unstoppable.ph.six-char')"
            type="text"
            name=""
          />
          <span :class="localDomainName !== '' ? 'move-right' : ''"
            >.{{ tld }}</span
          >
          <img
            v-if="localDomainName !== ''"
            class="close"
            src="@/assets/images/icons/close.png"
            @click="clearInput()"
          />
        </div>
        <div class="submit-button-container">
          <button
            :class="[
              domainNameErr || localDomainName === '' ? 'disabled' : '',
              'submit-button large-round-button-green-filled clickable'
            ]"
            @click.prevent="checkDomain"
          >
            <span v-show="!loading">
              {{ $t('unstoppable.check-domain') }}
            </span>
            <i v-show="loading" class="fa fa-spinner fa-spin" />
          </button>
        </div>
      </div>
      <div class="error-message-container">
        <p v-show="domainNameErr" class="erroredMsg">
          <span v-if="!isValidLength && localDomainName !== ''">
            {{ $t('unstoppable.warning.not-enough-char') }}
          </span>
          <span v-else> {{ $t('unstoppable.warning.invalid-symbol') }} </span>
        </p>
      </div>
    </form>

    <div
      v-if="isDomainAvail.checked === true && localDomainName !== ''"
      class="result-wrapper"
    >
      <div class="result-title">
        <span>{{ $t('unstoppable.result') }}</span>
      </div>
      <div
        :class="[
          'result-container',
          isDomainAvail.isAvailable ? 'avail-container' : 'unavail-container'
        ]"
      >
        <div class="left-container">
          <span class="domain-name">{{ localDomainName }}.crypto</span>
          <span v-if="isDomainAvail.isAvailable">
            <span class="eth-text"
              >{{ convertedEthPrice }} {{ $t('common.currency.eth') }}</span
            >
            <span class="price-text">(${{ domainPrice }})</span>
          </span>
        </div>
        <div class="right-container">
          <div
            :class="[
              'title',
              isDomainAvail.isAvailable ? 'avail-text' : 'unavail-text'
            ]"
          >
            {{
              isDomainAvail.isAvailable
                ? $t('unstoppable.is-available')
                : $t('unstoppable.unavailable')
            }}
          </div>
          <button
            v-if="isDomainAvail.isAvailable"
            class="mid-round-button-green-filled buy-btn"
            @click="registerDomain()"
          >
            {{ $t('unstoppable.buy') }}
          </button>
        </div>
      </div>
    </div>

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
import { Toast } from '@/helpers';
import BigNumber from 'bignumber.js';

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
    },
    isDomainAvail: {
      type: Object,
      default: function () {
        return {
          isChecked: false,
          isAvailable: false
        };
      }
    },
    domainPrice: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      localDomainName: this.hostName,
      ethPrice: 0
    };
  },
  computed: {
    ...mapState('main', ['online']),
    isValidLength() {
      return this.localDomainName.replace(`.${this.tld}`, '').length >= 6;
    },
    convertedEthPrice() {
      let ethConvertPrice = 0;
      if (this.domainPrice > 0) {
        ethConvertPrice = new BigNumber(this.domainPrice)
          .dividedBy(this.ethPrice)
          .toFixed(8);
      }
      return ethConvertPrice;
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
  mounted() {
    if (this.online) this.getEthPrice();
  },
  methods: {
    registerDomain() {
      this.$router.push({ path: 'unstoppable/buy/payment-method' });
    },
    clearInput() {
      this.localDomainName = '';
    },
    async getEthPrice() {
      const price = await fetch(
        'https://cryptorates.mewapi.io/ticker?filter=ETH'
      )
        .then(res => {
          return res.json();
        })
        .catch(e => {
          Toast.responseHandler(e, Toast.ERROR);
        });
      this.ethPrice =
        typeof price === 'object' ? price.data.ETH.quotes.USD.price : 0;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'InitialUnstoppableStateContainer.scss';
</style>
