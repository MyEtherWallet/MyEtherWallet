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
    :back="step === 2 ? back : null"
    content-size="medium"
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
          :value="contractAddress"
          placeholder="Contract address"
          @input="setContractAddress"
        />
      </div>
      <!--
    ===================================================
    Step two: display token info
    adds mb-9 for basic info but will add mb-1 if there
    are mew inputs (since there is extra spacing on bottom for mew inputs - 
    I had to do it this way to center everything 
    but TODO: find a better way to do this)
    ===================================================
    -->
      <div v-if="step === 2" class="full-width">
        <v-row
          v-for="(tkn, idx) in tokenDataToDisplay"
          :key="idx"
          no-gutters
          :class="[
            'd-flex align-center mt-0',
            tokenDataToDisplay[idx + 1] &&
            !isIcon(tokenDataToDisplay[idx + 1].name) &&
            !tokenDataToDisplay[idx + 1].value
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
            {{ tkn.name }}
          </v-col>
          <v-col cols="8" class="titlePrimary--text ml-2"
            ><!--
    ===================================================
    displays all token values if it is there except for icon and contract address
    ===================================================
    -->
            <span
              v-if="
                !isIcon(tkn.name) && !isContractAddress(tkn.name) && tkn.value
              "
              >{{ tkn.value }}</span
            >
            <!--
    ===================================================
    transform hash for contract address incase theres not 
    enough space
    ===================================================
    -->
            <mew-transform-hash
              v-if="isContractAddress(tkn.name)"
              justify-start
              :hash="tkn.value"
            />
            <!--
    ===================================================
    displays token icon img or placeholder if there is no src
    ===================================================
    -->
            <img
              v-if="isIcon(tkn.name) && tkn.value"
              height="24px"
              width="23.5px"
              :src="tkn.value"
              alt="token icon"
            />
            <div
              v-if="isIcon(tkn.name) && !tkn.value"
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
              v-if="!isIcon(tkn.name) && !tkn.value"
              :id="idx"
              :error-messages="
                idx === 3 ? symbolLengthTooLong : nameLengthTooLong
              "
              class="mt-8"
              :placeholder="getPlaceholder(tkn.name)"
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
        :loading="loading"
        :disabled="isDisabled"
        :title="step === 1 ? 'Next' : 'Add Token'"
        @click.native="next"
      />
    </div>
  </mew-overlay>
</template>

<script>
import abiERC20 from '../handlers/abiERC20';
import { mapState, mapGetters, mapActions } from 'vuex';
import { ERROR, SUCCESS, Toast } from '@/modules/toast/handler/handlerToast';
import { isAddress } from '@/core/helpers/addressUtils';
import { _ } from 'web3-utils';
import BigNumber from 'bignumber.js';
import {
  formatFloatingPointValue,
  formatFiatValue
} from '@/core/helpers/numberFormatHelper';

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
      contractAddress: '',
      customName: '',
      customSymbol: '',
      symbolLengthTooLong: '',
      nameLengthTooLong: '',
      loading: false,
      step: 1,
      token: {}
    };
  },
  computed: {
    ...mapState('wallet', ['web3', 'address']),
    ...mapGetters('wallet', ['tokensList']),
    ...mapGetters('external', ['contractToToken']),
    ...mapGetters('custom', ['customTokens']),
    /**
     * @returns token data to display on form
     */
    tokenDataToDisplay() {
      return [
        { name: 'Contract', value: this.contractAddress },
        { name: 'Icon', value: this.token.img },
        { name: 'Name', value: this.token.name },
        { name: 'Symbol', value: this.token.symbol }
      ];
    },
    /**
     * @returns boolean
     * disables button if there are error messages and no values
     */
    isDisabled() {
      return (
        this.loading ||
        (this.step === 1 && !this.contractAddress) ||
        (this.step === 2 &&
          (this.symbolLengthTooLong.length > 0 ||
            this.nameLengthTooLong.length > 0 ||
            !this.hasName ||
            !this.hasSymbol))
      );
    },
    /**
     * checks if there is token name
     */
    hasName() {
      return this.tokenDataToDisplay[2].value || this.customName;
    },
    /**
     * checks if there is symbol name
     */
    hasSymbol() {
      return this.tokenDataToDisplay[3].value || this.customSymbol;
    }
  },
  methods: {
    ...mapActions('custom', ['setCustomToken']),
    /**
     * set input value for custom name (idx = 2) or symbol (idx = 3)
     * if symbol then will double check if it is already in the list
     * will throw toast error if so
     * also will set error messages if value lengths are too long
     */
    setInputValue: _.debounce(function (value, idx) {
      if (idx == 3) {
        if (value && value.length > 6) {
          this.symbolLengthTooLong = 'Symbol cannot exceed 6 characters';
          return;
        }
        this.symbolLengthTooLong = '';
        let foundSymbol = false;

        this.customTokens.concat(this.tokensList).find(token => {
          if (value === token.symbol) {
            foundSymbol = true;
            return;
          }
        });
        if (foundSymbol) {
          this.customSymbol = '';
          Toast(
            'A token with the symbol ' + value + ' already exists.',
            {},
            ERROR
          );
          return;
        }
        this.customSymbol = value;
      } else {
        if (value && value.length > 24) {
          this.nameLengthTooLong = 'Name cannot exceed 24 characters';
          return;
        }
        this.nameLengthTooLong = '';
        this.customName = value;
      }
    }, 500),
    /**
     * @returns if token info displays contract address
     */
    isContractAddress(name) {
      return name === this.tokenDataToDisplay[0].name;
    },
    /**
     * @returns if token info displays icon
     */
    isIcon(name) {
      return name === this.tokenDataToDisplay[1].name;
    },
    /**
     * @returns mew input placeholders
     * if there is no value for name or symbol
     */
    getPlaceholder(name) {
      if (name === this.tokenDataToDisplay[2].name) {
        return 'Enter the token’s name';
      }
      return 'Enter up to 4 characters';
    },
    /**
     * resets data and closes overlay on close button click
     */
    reset() {
      this.close();
      this.step = 1;
      this.token = {};
      this.contractAddress = '';
      this.customName = '';
      this.customSymbol = '';
      this.symbolLengthTooLong = '';
      this.nameLengthTooLong = '';
      this.loading = false;
    },
    /**
     * next (step one) and add token methods (step two) for button
     * on step one, it will check if contract address is valid
     * on step two, it will add the custom token
     */
    next() {
      if (this.step === 1) {
        this.loading = true;
        this.checkIfValidAddress();
        return;
      }
      this.token.name = !this.token.name ? this.customName : this.token.name;
      this.token.symbol = !this.token.symbol
        ? this.customSymbol
        : this.token.symbol;
      this.setCustomToken(this.token);
      Toast(
        'The token ' + this.token.name + ' was added to your token list!',
        {},
        SUCCESS
      );
      this.reset();
    },
    back() {
      this.step = 1;
    },
    /**
     * sets the contract address that user inputs
     * (index 0 of token data)
     */
    setContractAddress(address) {
      this.contractAddress = address;
    },
    /**
     * checks if the contract address is valid
     * if it is then it will check if it already exists in the tokenList
     * otherwise it will throw toast error
     */
    checkIfValidAddress() {
      if (this.contractAddress && isAddress(this.contractAddress)) {
        this.checkIfTokenExistsAlready();
      } else {
        this.loading = false;
        this.contractAddress = '';
        Toast('This is not a valid contract address', {}, ERROR);
        return;
      }
    },
    /**
     * checks if the token contract already exists in tokenList
     * will return toast error if it does
     * otherwise it will get more info
     */
    checkIfTokenExistsAlready() {
      let foundToken = false;
      this.customTokens.concat(this.tokensList).find(token => {
        if (
          this.contractAddress.toLowerCase() === token.contract?.toLowerCase()
        ) {
          foundToken = true;
          return;
        }
      });
      if (foundToken) {
        this.contractAddress = '';
        this.loading = false;
        Toast('A token with this address already exists!', {}, ERROR);
        return;
      }
      this.findTokenInfo();
    },
    /**
     * finds more token info
     * will first use web3 to get the contract and
     * then use getter contractToToken to check for more info and calculate correct usd balance
     * if not will check web3 to get name and symbol
     * then will assign the correct values to the token object.
     * if it enters the catch then will just assign contract address.
     */
    async findTokenInfo() {
      const contract = new this.web3.eth.Contract(
        abiERC20,
        this.contractAddress
      );
      this.token = this.contractToToken(this.contractAddress) || {};
      try {
        const balance = await contract.methods.balanceOf(this.address).call(),
          decimals = await contract.methods.decimals().call();
        if (this.token) {
          const denominator = new BigNumber(10).pow(decimals);
          this.token.usdBalance = new BigNumber(balance)
            .div(denominator)
            .times(this.token.price)
            .toString();
          this.token.usdBalancef = formatFiatValue(this.token.usdBalance).value;
        } else {
          this.token.name = await contract.methods.name().call();
          this.token.symbol = await contract.methods.symbol().call();
          this.token.usdBalancef = '0.00';
          this.token.contract = this.contractAddress;
        }
        this.token.balancef = this.getTokenBalance(balance, decimals).value;
        this.loading = false;
        this.step = 2;
      } catch {
        this.token.contract = this.contractAddress;
        this.token.balancef = '0';
        this.token.usdBalancef = '0.00';
        this.loading = false;
        this.step = 2;
      }
    },
    /**
     * gets token balance by dividing by token decimals
     */
    getTokenBalance(balance, decimals) {
      let n = new BigNumber(balance);
      if (decimals) {
        n = n.div(new BigNumber(10).pow(decimals));
        n = formatFloatingPointValue(n);
      }
      return n;
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
