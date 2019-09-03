<template lang="html">
  <div>
    <b-modal
      ref="modal"
      hide-footer
      class="bootstrap-modal nopadding max-height-1"
      centered
      title="Add Custom Token"
      @hidden="resetCompState"
    >
      <form class="tokens-modal-body" @keydown.enter.prevent>
        <div>
          <input
            v-validate="'required'"
            v-model="contractAddress"
            :class="[
              'custom-input-text-1',
              contractAddress !== '' && !validAddress ? 'invalid-address' : ''
            ]"
            name="Address"
            type="text"
            placeholder="Token Contract Address"
          />
          <span
            v-show="contractAddress !== '' && !validAddress"
            class="error-message"
          >
            Invalid address given.
          </span>
          <span v-show="nonStandardMessage">
            NFT token contract doesn't include a required method to add as a custom NFT.
          </span>
          <input
            v-validate="'required'"
            v-model="tokenSymbol"
            name="Symbol"
            type="text"
            placeholder="NFT name"
            class="custom-input-text-1"
          />
        </div>
        <div class="button-block">
          <button
            :class="[
              allFieldsValid ? '' : 'disabled',
              'save-button large-round-button-green-filled clickable'
            ]"
            @click.prevent="addCustom(contractAddress, tokenSymbol)"
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
    },
    activeAddress: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      contractAddress: '',
      tokenSymbol: '',
      tokenDecimal: '',
      validAddress: false,
      nonStandardMessage: false
    };
  },
  computed: {
    ...mapState(['web3']),
    allFieldsValid() {
      if (!this.validAddress) return false;
      if (this.tokenSymbol === '') return false;
      if (this.errors.has('address') || this.errors.has('symbol')) return false;
      return true;
    }
  },
  watch: {
    contractAddress(newVal) {
      const strippedWhitespace = newVal.toLowerCase().trim();
      const regTest = new RegExp(/[a-zA-Z0-9]/g);
      this.validAddress =
        regTest.test(strippedWhitespace) && isAddress(strippedWhitespace);
      this.toAddress = strippedWhitespace;
      this.contractAddress = strippedWhitespace;
    },
    tokenSymbol(newVal) {
      this.tokenSymbol = newVal;
    }
  },
  methods: {
    resetCompState() {
      this.contractAddress = '';
      this.tokenSymbol = '';
      this.tokenDecimal = '';
      this.validAddress = false;
      this.nonStandardMessage = false;
    },
    async addCustom(address, symbol) {
      const result = await this.checkIfStandard(address);
      if(result) this.addToken(address, symbol);
      else {
        this.nonStandardMessage = true;
      }
    },
    openCustomModal() {
      this.$refs.customModal.$refs.modal.show();
    },
    checkIfStandard(address) {
      return new Promise((resolve) =>{
        const tokenContract = new this.web3.eth.Contract([
          {
            constant: true,
            inputs: [
              { name: '_owner', type: 'address' },
              { name: '_index', type: 'uint256' }
            ],
            name: 'tokenOfOwnerByIndex',
            outputs: [{ name: '', type: 'uint256' }],
            payable: false,
            stateMutability: 'view',
            type: 'function'
          }
        ]);
        tokenContract.options.address = address;
        tokenContract.methods.tokenOfOwnerByIndex(this.activeAddress,0)
          .call()
          .then(result =>{
            console.log(result); // todo remove dev item
            resolve(true)
          })
          .catch(err =>{
            console.log('error'); // todo remove dev item
            console.log(err); // todo remove dev item
            resolve(false)
          })
      })
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'NftCustomAddModal.scss';
</style>
