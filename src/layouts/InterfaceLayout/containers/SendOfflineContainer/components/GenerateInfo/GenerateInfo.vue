<template>
  <div class="generate-info">
    <div class="wrap">
      <div class="send-form">
        <div class="title-container">
          <div class="title-and-copy">
            <div>
              <h4>{{ $t('interface.fromAddr') }}</h4>
            </div>
            <div class="form-controller">
              <button
                class="title-button prevent-user-select"
                @click="deleteFromAddress"
              >
                {{ $t('common.clear') }}
              </button>
              <button
                class="title-button prevent-user-select"
                @click="copyFromAddress"
              >
                {{ $t('common.copy') }}
              </button>
            </div>
          </div>
        </div>
        <div class="the-form gas-amount">
          <input
            ref="fromaddress"
            v-model="hexAddress"
            type="text"
            placeholder="From Address"
            autocomplete="off"
          />
          <div class="good-button-container">
            <i
              :class="[
                !isValidAddress ? 'not-good' : '',
                'fa fa-check-circle good-button'
              ]"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
      <tx-speed-input
        v-show="moreInfoGenerated"
        :nonce="nonce"
        :gas-limit="gasLimit"
        :highest-gas="highestGas"
        @gasLimitUpdate="gasLimitUpdated"
        @nonceUpdate="nonceUpdated"
      />
      <div v-if="!moreInfoGenerated" class="submit-button-container">
        <div
          :class="[
            isValidAddress ? 'clickable' : 'disabled',
            'submit-button large-round-button-green-filled'
          ]"
          @click="generateInfo"
        >
          {{ $t('interface.generateInfo') }}
        </div>
      </div>

      <div v-if="moreInfoGenerated" class="submit-button-container">
        <div
          class="submit-button large-round-button-green-filled clickable"
          @click="generateTx"
        >
          {{ $t('common.continue') }}
        </div>
      </div>
      <interface-bottom-text
        link="https://kb.myetherwallet.com"
        question="Have issues?"
        link-text="Help Center"
      />
    </div>
  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText';
import TxSpeedInput from '../TxSpeedInput';
import { mapGetters } from 'vuex';
export default {
  components: {
    'interface-bottom-text': InterfaceBottomText,
    'tx-speed-input': TxSpeedInput
  },
  props: {
    gasLimit: {
      type: Number,
      default: 0
    },
    nonce: {
      type: Number,
      default: 0
    },
    highestGas: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      moreInfoGenerated: false,
      hexAddress: ''
    };
  },
  computed: {
    ...mapGetters({
      web3: 'web3'
    }),
    isValidAddress() {
      return this.web3.utils.isAddress(this.hexAddress);
    }
  },
  watch: {
    hexAddress(newVal, oldVal) {
      if (newVal !== oldVal) this.moreInfoGenerated = false;
    }
  },
  async mounted() {
    this.hexAddress = this.web3.utils.toChecksumAddress(
      await this.web3.eth.getCoinbase()
    );
  },
  methods: {
    async generateInfo() {
      this.nonceUpdated(
        await this.web3.eth.getTransactionCount(this.hexAddress)
      );
      this.moreInfoGenerated = true;
    },
    copyFromAddress() {
      this.$refs.fromaddress.select();
      document.execCommand('copy');
    },
    deleteFromAddress() {
      this.$refs.fromaddress.value = '';
    },
    generateTx() {
      this.$emit('pathUpdate', 'Offline Generate Transaction');
    },
    gasLimitUpdated(e) {
      this.$emit('gasLimitUpdate', e);
    },
    nonceUpdated(e) {
      this.$emit('nonceUpdate', e);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'GenerateInfo.scss';
</style>
