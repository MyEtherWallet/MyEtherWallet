<template>
  <div>
    <!-- ===================================================================================== -->
    <!-- Add Custom Token Overlay -->
    <!-- ===================================================================================== -->
    <v-dialog :value="open" max-width="330" @click:outside="reset">
      <div class="bgWalletBlock pa-7">
        <div v-if="step === 1" class="full-width">
          <div class="mew-heading-2 mb-10">Add custom token</div>
          <mew-input
            :value="contractAddress"
            placeholder="Contract address"
            @input="setContractAddress"
          />
        </div>

        <!-- ============================================================================= -->
        <!-- Step two: display token info -->
        <!-- adds mb-9 for basic info but will add mb-1 if there -->
        <!-- are mew inputs (since there is extra spacing on bottom for mew inputs -->
        <!-- I had to do it way to center everything -->
        <!-- but TODO: find a better way to do  -->
        <!-- ============================================================================= -->
        <div v-if="step === 2" class="full-width">
          <div
            v-for="(tkn, idx) in tokenDataToDisplay"
            :key="idx"
            no-gutters
            class="mb-9"
            :class="[
              tokenDataToDisplay[idx + 1] &&
              !isIcon(tokenDataToDisplay[idx + 1].name) &&
              !tokenDataToDisplay[idx + 1].value
                ? 'mb-1'
                : 'mb-9'
            ]"
          >
            <!-- =================================================== -->
            <!-- token info title -->
            <!-- =================================================== -->
            <div
              class="textLight--text mew-body font-weight-bold align-self-center"
            >
              {{ tkn.name }}
            </div>
            <div class="textDark--text">
              <!-- ============================================================================= -->
              <!-- displays all token values if it is there except for icon and contract address -->
              <!-- ============================================================================= -->
              <span
                v-if="
                  !isIcon(tkn.name) &&
                  !isContractAddress(tkn.name) &&
                  !isSymbol(tkn.name) &&
                  tkn.value
                "
              >
                {{ tkn.value }}
              </span>

              <!-- ============================================================================= -->
              <!-- transform hash for contract address incase theres not -->
              <!-- enough space -->
              <!-- ============================================================================= -->
              <mew-transform-hash
                v-if="isContractAddress(tkn.name)"
                justify-start
                :hash="tkn.value"
              />

              <!-- ============================================================================= -->
              <!-- displays token icon img or placeholder if there is no src -->
              <!-- ============================================================================= -->
              <img
                v-if="isIcon(tkn.name) && tkn.value"
                height="24px"
                width="23.5px"
                :src="tkn.value"
                alt="token icon"
              />
              <div
                v-if="isIcon(tkn.name) && !tkn.value"
                class="token-placeholder mew-caption d-flex align-center justify-center"
              >
                NA
              </div>

              <!-- ============================================================================= -->
              <!-- displays input to enter values if there is no name or symbol -->
              <!-- ============================================================================= -->
              <mew-input
                v-if="(!isIcon(tkn.name) && !tkn.value) || isSymbol(tkn.name)"
                :id="idx"
                :error-messages="
                  idx === 3 ? symbolLengthTooLong : nameLengthTooLong
                "
                :class="isSymbol(tkn.name) ? 'mt-0 mb-n4' : 'mb-n8'"
                :value="tkn.value"
                :placeholder="getPlaceholder(tkn.name)"
                @input="setInputValue"
              />
            </div>
          </div>
        </div>

        <!-- =================================================== -->
        <!-- Add token / next button -->
        <!-- =================================================== -->
        <div class="d-flex align-center mt-5">
          <mew-button
            class="flex-grow-1 mr-1"
            style="flex-basis: 0"
            btn-size="large"
            btn-style="outline"
            title="Cancel"
            @click.native="reset"
          />
          <mew-button
            class="flex-grow-1 ml-1"
            style="flex-basis: 0"
            btn-size="large"
            :loading="loading"
            :disabled="isDisabled"
            :title="step === 1 ? 'Next' : 'Add Token'"
            @click.native="next"
          />
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script setup>
import { defineProps, ref, computed } from 'vue';
import { debounce } from 'lodash';
import BigNumber from 'bignumber.js';

import abiERC20 from '../handlers/abiERC20';
import { ERROR, SUCCESS, Toast } from '@/modules/toast/handler/handlerToast';
import { isAddress } from '@/core/helpers/addressUtils';
import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';

import {
  global as useGlobalStore,
  wallet as useWalletStore,
  external as useExternalStore,
  custom as useCustomStore
} from '@/core/store/index.js';

// injections/use
const { getFiatValue } = useGlobalStore();
const { web3, address, tokensList } = useWalletStore();
const { contractToToken } = useExternalStore();
const { customTokens, setCustomToken } = useCustomStore();

// props
const props = defineProps({
  open: {
    default: false,
    type: Boolean
  },
  close: {
    default: () => {},
    type: Function
  }
});

// data
const contractAddress = ref('');
const customName = ref('');
const customSymbol = ref('');
const symbolLengthTooLong = ref('');
const nameLengthTooLong = ref('');
const loading = ref(false);
const step = ref(1);
const token = ref({});

// computed
/**
 * @returns token data to display on form
 */
const tokenDataToDisplay = computed(() => {
  return [
    { name: 'Contract', value: contractAddress.value },
    { name: 'Icon', value: token.value.img },
    { name: 'Name', value: token.value.name },
    { name: 'Symbol', value: token.value.symbol }
  ];
});
/**
 * @returns boolean
 * disables button if there are error messages and no values
 */
const isDisabled = computed(() => {
  return (
    loading.value ||
    (step.value === 1 && !contractAddress.value) ||
    (step.value === 1 && !isAddress(contractAddress.value)) ||
    (step.value === 2 &&
      (symbolLengthTooLong.value.length > 0 ||
        nameLengthTooLong.value.length > 0 ||
        !hasName.value ||
        !hasSymbol.value))
  );
});
/**
 * checks if there is token name
 */
const hasName = computed(() => {
  return tokenDataToDisplay.value[2].value || customName;
});
/**
 * checks if there is symbol name
 */
const hasSymbol = computed(() => {
  return customSymbol.value;
});

// methods
/**
 * set input value for custom name (idx = 2) or symbol (idx = 3)
 * if symbol then will double check if it is already in the list
 * will throw toast error if so
 * also will set error messages if value lengths are too long
 */
const setInputValue = debounce((inputVal, idx) => {
  if (idx == 3) {
    if (inputVal && inputVal.length > 8) {
      symbolLengthTooLong.value = 'Symbol cannot exceed 8 characters';
      return;
    }
    symbolLengthTooLong.value = '';
    let foundSymbol = false;

    customTokens.concat(tokensList).find(token => {
      if (inputVal === token.symbol) {
        foundSymbol = true;
        return;
      }
    });
    if (foundSymbol) {
      customSymbol.value = '';
      Toast(
        'A token with the symbol ' + inputVal + ' already exists.',
        {},
        ERROR
      );
      return;
    }
    customSymbol.value = inputVal;
  } else {
    if (inputVal && inputVal.length > 24) {
      nameLengthTooLong.value = 'Name cannot exceed 24 characters';
      return;
    }
    nameLengthTooLong.value = '';
    customName.value = inputVal;
  }
}, 100);
/**
 * @returns if token info displays contract address
 */
const isContractAddress = name => {
  return name === tokenDataToDisplay.value[0].name;
};
/**
 * @returns if token info displays icon
 */
const isIcon = name => {
  return name === tokenDataToDisplay.value[1].name;
};
/**
 * @returns if symbol info displays icon
 */
const isSymbol = name => {
  return name === tokenDataToDisplay.value[3].name;
};
/**
 * @returns mew input placeholders
 * if there is no value for name or symbol
 */
const getPlaceholder = name => {
  if (name === tokenDataToDisplay.value[2].name) {
    return 'Enter the token’s name';
  }
  return 'Enter up to 8 characters';
};
/**
 * resets data and closes overlay on close button click
 */
const reset = () => {
  props.close();
  step.value = 1;
  token.value = {};
  contractAddress.value = '';
  customName.value = '';
  customSymbol.value = '';
  symbolLengthTooLong.value = '';
  nameLengthTooLong.value = '';
  loading.value = false;
};
/**
 * next (step one) and add token methods (step two) for button
 * on step one, it will check if contract address is valid
 * on step two, it will add the custom token
 */
const next = () => {
  if (step.value === 1) {
    loading.value = true;
    checkIfValidAddress();
    return;
  }
  token.value.name = !token.value.name ? customName.value : token.value.name;
  token.value.symbol = customSymbol.value || token.value.symbol;
  token.value.contract = contractAddress;
  setCustomToken(token);
  Toast(
    'The token ' + token.value.name + ' was added to your token list!',
    {},
    SUCCESS
  );
  reset();
};
/**
 * sets the contract address that user inputs
 * (index 0 of token data)
 */
const setContractAddress = address => {
  contractAddress.value = address;
};
/**
 * checks if the contract address is valid
 * if it is then it will check if it already exists in the tokenList
 * otherwise it will throw toast error
 */
const checkIfValidAddress = async () => {
  const codeHash = await web3.eth.getCode(contractAddress.value.toLowerCase());
  if (
    contractAddress.value &&
    isAddress(contractAddress.value) &&
    codeHash !== '0x'
  ) {
    checkIfTokenExistsAlready();
  } else {
    loading.value = false;
    contractAddress.value = '';
    Toast('is not a valid contract address', {}, ERROR);
  }
};
/**
 * checks if the token contract already exists in tokenList
 * will return toast error if it does
 * otherwise it will get more info
 */
const checkIfTokenExistsAlready = () => {
  let foundToken = false;
  customTokens.concat(tokensList).find(token => {
    if (contractAddress.value.toLowerCase() === token.contract?.toLowerCase()) {
      foundToken = true;
    }
  });
  if (foundToken) {
    contractAddress.value = '';
    loading.value = false;
    Toast('A token with address already exists!', {}, ERROR);
  } else {
    findTokenInfo();
  }
};
/**
 * finds more token info
 * will first use web3 to get the contract and
 * then use getter contractToToken to check for more info and calculate correct usd balance
 * if not will check web3 to get name and symbol
 * then will assign the correct values to the token object.
 * if it enters the catch then will just assign contract address.
 */
const findTokenInfo = async () => {
  const contract = new web3.eth.Contract(
    abiERC20,
    contractAddress.value.toLowerCase()
  );
  token.value = contractToToken(contractAddress.value) || {};
  try {
    const balance = await contract.methods.balanceOf(address).call(),
      decimals = await contract.methods.decimals().call();
    if (token.value) {
      const denominator = new BigNumber(10).pow(decimals);
      token.value.usdBalance = new BigNumber(balance)
        .div(denominator)
        .times(token.value.price)
        .toString();
      token.value.usdBalancef = getFiatValue(token.value.usdBalance)
        ? getFiatValue(token.value.usdBalance)
        : getFiatValue(0);
    } else {
      token.value.name = await contract.methods.name().call();
      token.value.symbol = await contract.methods.symbol().call();
      token.value.usdBalancef = '0.00';
      token.value.contract = contractAddress;
    }
    token.value.decimals = parseInt(decimals);
    token.value.balance = balance;
    token.value.balancef = getTokenBalance(balance, decimals).value;
    loading.value = false;
    step.value = 2;
  } catch {
    token.value.contract = contractAddress;
    token.value.balancef = '0';
    token.value.usdBalancef = '0.00';
    loading.value = false;
    step.value = 2;
  }
};
/**
 * gets token balance by dividing by token decimals
 */
const getTokenBalance = (balance, decimals) => {
  let n = new BigNumber(balance);
  if (decimals) {
    n = n.div(new BigNumber(10).pow(decimals));
    n = formatFloatingPointValue(n);
  }
  return n;
};
</script>
<style lang="scss" scoped>
.token-placeholder {
  color: var(--v-textMedium-base);
  background-color: var(--v-disabledMedium-base);
  border-radius: 24px;
  height: 24px;
  width: 24px;
}
</style>
