<template lang="html">
  <div>
    <b-modal
      ref="token"
      hide-footer
      class="bootstrap-modal nopadding max-height-1"
      centered
      title="Add Custom Token"
      @hidden="resetCompState"
    >
      <form class="tokens-modal-body">
        <div>
          <input
            v-model="tokenAddress"
            type="text"
            placeholder="Token Contract Address"
            class="custom-input-text-1"
          />
          <input
            v-model="tokenSymbol"
            type="text"
            placeholder="Token Symbol"
            class="custom-input-text-1"
          />
          <input
            v-model="tokenDecimal"
            type="number"
            min="0"
            max="18"
            placeholder="Decimals"
            class="custom-input-text-1"
          />
        </div>
        <div>
          <button
            :class="[
              validAddress && tokenSymbol !== '' && tokenDecimal !== ''
                ? ''
                : 'disabled',
              'save-button large-round-button-green-filled clickable'
            ]"
            type="submit"
            @click.prevent="addToken(tokenAddress, tokenSymbol, tokenDecimal)"
          >
            {{ $t('interface.save') }}
          </button>
          <interface-bottom-text
            :link-text="$t('interface.helpCenter')"
            :question="$t('interface.dontKnow')"
            link="https://kb.myetherwallet.com"
          />
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText';
import { mapGetters } from 'vuex';
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
    ...mapGetters({
      web3: 'web3'
    })
  },
  watch: {
    tokenAddress(newVal) {
      if (newVal !== '' && newVal.length !== 0 && isAddress(newVal)) {
        this.validAddress = true;
      } else {
        this.validAddress = false;
      }
      this.toAddress = newVal;
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
