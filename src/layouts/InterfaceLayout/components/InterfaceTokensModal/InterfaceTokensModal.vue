<template lang="html">
  <div>
    <b-modal
      ref="token"
      hide-footer
      class="bootstrap-modal nopadding max-height-1"
      centered
      :title="$t('interface.tokens.modal.title')"
      static
      lazy
      @hidden="resetCompState"
    >
      <form class="tokens-modal-body" @keydown.enter.prevent>
        <div>
          <input
            v-validate="'required'"
            v-model="tokenAddress"
            :class="[
              'custom-input-text-1',
              tokenAddress !== '' && !validAddress ? 'invalid-address' : ''
            ]"
            name="Address"
            type="text"
            :placeholder="$t('interface.tokens.modal.ph-contract-addr')"
          />
          <span
            v-show="tokenAddress !== '' && !validAddress"
            class="error-message"
          >
            {{$t('interface.tokens.modal.error.addr')}}
          </span>
          <input
            v-validate="'required'"
            v-model="tokenSymbol"
            name="Symbol"
            type="text"
            :placeholder="$t('interface.tokens.modal.ph-symbol')"
            class="custom-input-text-1"
          />
          <input
            v-validate="'required|numeric'"
            v-model="tokenDecimal"
            name="Decimal"
            type="number"
            min="0"
            max="18"
            :placeholder="$t('interface.tokens.modal.ph-decimals')"
            class="custom-input-text-1"
          />
          <span
            v-show="tokenDecimal < 0 || tokenDecimal > 18"
            class="error-message"
          >
            {{$t('interface.tokens.modal.error.decimals')}}
          </span>
        </div>
        <div class="button-block">
          <button
            :class="[
              allFieldsValid ? '' : 'disabled',
              'save-button large-round-button-green-filled clickable'
            ]"
            @click.prevent="addToken(tokenAddress, tokenSymbol, tokenDecimal)"
          >
            {{ $t('common.save') }}
          </button>
          <interface-bottom-text
            :link-text="$t('common.help-center')"
            :question="$t('common.dont-know')"
            link="https://kb.myetherwallet.com"
          />
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText';
import { mapState } from 'vuex';
import { isAddress } from '@/helpers/addressUtils';

export default {
  components: {
    'interface-bottom-text': InterfaceBottomText
  },
  props: {
    addToken: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {
      tokenAddress: '',
      tokenSymbol: '',
      tokenDecimal: '',
      validAddress: false
    };
  },
  computed: {
    ...mapState(['web3']),
    allFieldsValid() {
      if (!this.validAddress) return false;
      if (this.tokenSymbol === '') return false;
      if (
        this.tokenDecimal < 0 ||
        this.tokenDecimal > 18 ||
        this.tokenDecimal === ''
      )
        return false;
      if (
        this.errors.has('address') ||
        this.errors.has('symbol') ||
        this.errors.has('decimal')
      )
        return false;
      return true;
    }
  },
  watch: {
    tokenAddress(newVal) {
      const strippedWhitespace = newVal.toLowerCase().trim();
      const regTest = new RegExp(/[a-zA-Z0-9]/g);
      this.validAddress =
        regTest.test(strippedWhitespace) && isAddress(strippedWhitespace);
      this.toAddress = strippedWhitespace;
      this.tokenAddress = strippedWhitespace;
    },
    tokenSymbol(newVal) {
      this.tokenSymbol = newVal.substr(0, 7);
    }
  },
  methods: {
    resetCompState() {
      this.tokenAddress = '';
      this.tokenSymbol = '';
      this.tokenDecimal = '';
      this.validAddress = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'InterfaceTokensModal.scss';
</style>
