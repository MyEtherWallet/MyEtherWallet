<template>
  <!--
    =====================================================================================
      Add Custom Token Overlay
    =====================================================================================
    -->
  <mew-overlay
    :footer="{
      text: 'Need help?',
      linkTitle: 'Contact support',
      link: 'mailto:support@myetherwallet.com'
    }"
    :show-overlay="open"
    title="Add custom token"
    :close="reset"
    content-size="large"
  >
    <div class="full-width">
      <!--
    ===================================================
    Step one: input contract address
    ===================================================
    -->
      <div v-if="step === 1" class="full-width">
        <div class="mew-heading-3 mb-4 titlePrimary--text">
          What is the token contract address?
        </div>
        <mew-input
          placeholder="Enter contract address"
          @input="setContractAddress"
        />
      </div>
      <!--
    ===================================================
    Step two: display token info
    ===================================================
    -->
      <div v-if="step === 2" class="full-width">
        <v-row
          v-for="(token, idx) in tokenData"
          :key="idx"
          no-gutters
          :class="[
            'd-flex align-center mt-0',
            tokenData[idx + 1] &&
            !isIcon(tokenData[idx + 1].name) &&
            !tokenData[idx + 1].value &&
            loaded
              ? 'mb-1'
              : 'mb-9'
          ]"
        >
          <!--
    ===================================================
    token info title
    ===================================================
    -->
          <v-col
            cols="2"
            class="ml-5 captionPrimary--text mew-body font-weight-bold"
          >
            {{ token.name }}
          </v-col>
          <v-col cols="8" class="titlePrimary--text ml-2"
            ><!--
    ===================================================
    displays all token values if it is there except for icon 
    ===================================================
    -->
            <span
              v-if="!isIcon(token.name) && token.value"
              :class="isContractAddress(token.name) ? 'mew-address' : ''"
              >{{ token.value }}</span
            >
            <!--
    ===================================================
    displays token icon img or placeholder if there is no src
    ===================================================
    -->
            <img
              v-if="isIcon(token.name) && token.value"
              height="24px"
              width="23.5px"
              :src="token.value"
              alt="token icon"
            />
            <div
              v-if="isIcon(token.name) && !token.value"
              class="
                token-placeholder
                mew-caption
                d-flex
                align-center
                justify-center
              "
            >
              NA
            </div>
            <!--
    ===================================================
    displays input to enter values if there is no name or symbol
    ===================================================
    -->
            <mew-input
              v-if="!isIcon(token.name) && !token.value && loaded"
              :id="idx"
              :error-messages="
                idx === 3 ? symbolLengthTooLong : nameLengthTooLong
              "
              class="mt-8"
              :placeholder="getPlaceholder(token.name)"
              @input="setInputValue"
            />
          </v-col>
        </v-row>
      </div>
      <!--
    ===================================================
   Add token / next button
    ===================================================
    -->
      <mew-button
        btn-size="xlarge"
        has-full-width
        :disabled="isDisabled"
        :title="step === 1 ? 'Next' : 'Add Token'"
        @click.native="next"
      />
    </div>
  </mew-overlay>
</template>

<script>
import abiERC20 from '../handlers/abiERC20';
import { mapState, mapGetters } from 'vuex';
import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';
import { isAddress } from '@/core/helpers/addressUtils';

export default {
  props: {
    open: {
      default: false,
      type: Boolean
    },
    close: {
      default: () => {},
      type: Function
    }
  },
  data() {
    return {
      customName: '',
      customSymbol: '',
      symbolLengthTooLong: '',
      nameLengthTooLong: '',
      loaded: false,
      step: 1,
      tokenData: [
        { name: 'Contract', value: '' },
        { name: 'Icon', value: '' },
        { name: 'Name', value: '' },
        { name: 'Symbol', value: '' }
      ]
    };
  },
  computed: {
    ...mapState('wallet', ['web3']),
    ...mapGetters('wallet', ['tokensList']),
    ...mapGetters('external', ['contractToToken']),
    isDisabled() {
      return (
        this.step === 2 &&
        (this.symbolLengthTooLong.length > 0 ||
          this.nameLengthTooLong.length > 0) &&
        (!this.tokenData[2].value || !this.tokenData[3].value)
      );
    }
  },
  methods: {
    /**
     * set input value for custom name (idx = 2) or symbol (idx = 3)
     * if symbol then will double check if it is already in the list
     * will throw toast error if so
     * also will set error messages if value lengths are too long
     */
    setInputValue(value, idx) {
      if (idx == 3) {
        if (value && value.length > 6) {
          this.symbolLengthTooLong = 'Symbol cannot exceed 6 characters';
          return;
        }
        this.symbolLengthTooLong = '';
        let foundSymbol = false;

        this.tokensList.find(token => {
          if (value === token.symbol) {
            foundSymbol = true;
            return;
          }
        });
        foundSymbol
          ? Toast('A token with the symbol “ETH” already exists.', {}, ERROR)
          : (this.customSymbol = value);
      } else {
        if (value && value.length > 24) {
          this.nameLengthTooLong = 'Name cannot exceed 24 characters';
          return;
        }
        this.nameLengthTooLong = '';
        this.customName = value;
      }
    },
    /**
     * @returns if token info displays contract address
     */
    isContractAddress(name) {
      return name === this.tokenData[0].name;
    },
    /**
     * @returns if token info displays icon
     */
    isIcon(name) {
      return name === this.tokenData[1].name;
    },
    /**
     * @returns mew input placeholders
     * if there is no value for name or symbol
     */
    getPlaceholder(name) {
      if (name === this.tokenData[2].name) {
        return 'Enter the token’s name';
      }
      return 'Enter up to 4 characters';
    },
    /**
     * resets and closes overlay on close button click
     */
    reset() {
      this.step = 1;
      this.tokenData = [
        { name: 'Contract', value: '' },
        { name: 'Icon', value: '' },
        { name: 'Name', value: '' },
        { name: 'Symbol', value: '' }
      ];
      this.close();
    },
    /**
     * next (step one) and add token methods (step two) for button
     * on step one, it will check if contract address is valid
     * on step two, it will add the custom token
     */
    next() {
      if (this.step === 1) {
        this.checkIfValidAddress();
      }
    },
    /**
     * sets the contract address that user inputs
     * (index 0 of token data)
     */
    setContractAddress(address) {
      this.tokenData[0].value = address;
    },
    /**
     * checks if the contract address is valid
     * if it is then it will check if it already exists in the tokenList
     * otherwise it will throw toast error
     */
    checkIfValidAddress() {
      if (this.tokenData[0].value && isAddress(this.tokenData[0].value)) {
        this.checkIfTokenExistsAlready();
      } else {
        Toast('This is not a valid contract address', {}, ERROR);
        return;
      }
    },
    /**
     * checks if the token already exists in tokenList
     * will return toast error if it does
     * otherwise it will get more info
     */
    checkIfTokenExistsAlready() {
      let foundToken = false;
      this.tokensList.find(token => {
        if (this.tokenData[0].value.toLowerCase() === token.contract) {
          foundToken = true;
          return;
        }
      });
      foundToken
        ? Toast('A token with this address already exists!', {}, ERROR)
        : this.findTokenInfo();
    },
    /**
     * finds more token info
     * will use getter contractToToken to first check for info if not will check web3
     * and then will assign the correct value to each tokenData object.
     * index 0 is contract address, 1 is icon, 2 is name, 3 is symbol
     * will throw toast error if they both cannot find any info
     */
    async findTokenInfo() {
      this.step = 2;
      try {
        const token = this.contractToToken(this.tokenData[0].value);
        if (token) {
          console.error('token', token);
          this.tokenData[1].value = token.img;
          this.tokenData[2].value = token.subtext;
          this.tokenData[3].value = token.symbol;
        } else {
          const contract = new this.web3.eth.Contract(
            abiERC20,
            this.tokenData[0].value
          );
          this.tokenData[2].value = await contract.methods.name().call();
          this.tokenData[3].value = await contract.methods.symbol().call();
        }
        this.loaded = true;
      } catch {
        this.loaded = true;
        Toast('This is not a valid contract address', {}, ERROR);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.token-placeholder {
  color: var(--v-textBlack2-base);
  background-color: var(--v-disabled-base);
  border-radius: 24px;
  height: 24px;
  width: 24px;
}
</style>
