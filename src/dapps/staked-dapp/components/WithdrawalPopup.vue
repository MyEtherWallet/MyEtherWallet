<template>
  <!--
    ===================================================
    Staked Status Tab
    ===================================================
    -->
  <mew-popup
    max-width="690px"
    :show="openWithdrawalModal"
    :has-buttons="false"
    :has-body-content="true"
    :title="modalTitle"
    :left-btn="leftBtn"
  >
    <div>
      <!-- Step 1: Ask user for execution address -->
      <div v-if="step === 1" class="text-center">
        <mew-warning-sheet
          class="mb-5"
          title=""
          description="The withdrawal address can only be set once and can never be changed. Please make sure the withdrawal address you are setting is a non-custodial wallet to which you have full access with a recovery phrase or private key. Do NOT use an exchange address or a smart contract wallet."
        />
        <div class="mew-heading-3 mb-3 text-left">Your Withdrawal Address</div>
        <module-address-book
          ref="addressInput"
          class="AddressInput"
          label="Address"
          :preselect-curr-wallet-adr="true"
          :currency="currencyName"
          @setAddress="setAddress"
        />
      </div>
      <!-- Step 2: Ask user for wallet type -->
      <div v-if="step === 2" class="text-center">
        <div v-for="(btn, key) in buttons" :key="key" class="mb-5">
          <mew-button
            :class="btn.class"
            has-full-width
            color-theme="greyMedium"
            btn-style="outline"
            style="height: 160px"
            @click.native="btn.fn"
          >
            <div
              class="text-left d-flex align-center justify-space-between px-2"
              style="width: 100%"
            >
              <div class="mew-heading-2 textDark--text">
                {{ btn.label }}
              </div>
              <img width="80" class="mr-4 d-none d-sm-block" :src="btn.icon" />
            </div>
          </mew-button>
        </div>
        <input
          ref="jsonInput"
          type="file"
          name="file"
          style="display: none"
          @change="uploadFile"
        />
      </div>
      <!-- Step 3: Ask user for wallet inputs -->
      <div v-if="step === 3" class="text-center">
        <!--
          ===================================================
          Keystore
          ===================================================
          -->
        <div v-if="isKeystore">
          <mew-input
            ref="passwordInput"
            v-model="password"
            label="Enter Password"
            placeholder="Enter my keystore password"
            type="password"
          />
        </div>
        <!--
          ===================================================
          Mnemonic
          ===================================================
          -->
        <div v-if="isMnemonic">
          <!--
          =====================================================================================
            Enter Phrase Block
          =====================================================================================
          -->
          <phrase-block class="mb-8">
            <v-row>
              <v-col
                v-for="n in length"
                :key="`mnemonicInput${n}`"
                cols="6"
                lg="3"
                md="3"
                sm="4"
              >
                <v-text-field
                  :ref="`mnemonicInput${n}`"
                  v-model="phrase[n]"
                  :name="`mnemonicInput${n}`"
                  :label="`${n}.`"
                  autocomplete="off"
                  :autofocus="n === 1"
                ></v-text-field>
              </v-col>
            </v-row>
          </phrase-block>
        </div>
      </div>
      <!-- Step 4: Warning -->
      <div v-if="step === 4" class="mb-2">
        <mew-sheet class="pa-4">
          <div class="mew-heading-3 black--text">
            Setting address: {{ executionAddress }} as the withdrawal address.
          </div>
        </mew-sheet>
        <mew-warning-sheet
          class="my-4"
          title="Please verify"
          description="The withdrawal address can only be set once. Please make sure you are setting the correct address."
        />
      </div>
      <!-- Next and Back Buttons -->
      <div class="mb-2 text-center d-flex align-center justify-center">
        <mew-button
          v-if="step > 1"
          class="mr-2"
          title="Back"
          btn-style="outline"
          btn-size="xlarge"
          @click.native="
            () => {
              back();
            }
          "
        />
        <mew-button
          v-if="step != 2"
          :title="nextButton.title"
          :disabled="nextButton.disabled"
          :loading="loadingButton"
          btn-size="xlarge"
          @click.native="
            () => {
              nextButton.fn();
            }
          "
        />
      </div>
    </div>
  </mew-popup>
</template>

<script setup>
import { defineAsyncComponent, defineProps, ref, computed, watch } from 'vue';
import {
  keystoreToBLSExecution,
  mnemonicToBLSExecution
} from '@myetherwallet/eth2-keystore';
import { isEmpty } from 'lodash';

import {
  Toast,
  ERROR,
  SUCCESS,
  WARNING
} from '@/modules/toast/handler/handlerToast';
import { SOFTWARE_WALLET_TYPES } from '@/modules/access-wallet/software/handlers/helpers.js';
import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { useStakedStore } from '../store';

const PhraseBlock = defineAsyncComponent(() =>
  import('@/core/components/PhraseBlock')
);
const ModuleAddressBook = defineAsyncComponent(() =>
  import('@/modules/address-book/ModuleAddressBook')
);

// injections
const { network } = useGlobalStore();
const { address } = useWalletStore();
const { addValidatorIndex } = useStakedStore();

// props
const props = defineProps({
  reset: {
    type: Function,
    default: () => {}
  },
  openWithdrawalModal: {
    type: Boolean,
    default: false
  },
  selectedValidator: {
    type: Object,
    default: () => {}
  }
});

// data
const step = ref(1);
const executionAddress = ref('');
const isValidAddress = ref(false);
const selectedRecoveryType = ref('');
const file = ref({});
const password = ref('');
const blsExecution = ref('');
const phrase = ref({});
const length = ref(24);
const loadingButton = ref(false);
const addressInput = ref(null);
const jsonInput = ref(null);

// computed
const nextButton = computed(() => {
  const obj = {
    title: 'Next',
    disabled: false,
    fn: nextStep
  };
  if (step.value === 1) {
    return Object.assign({}, obj, {
      disabled: !isValidAddress.value && executionAddress.value !== '',
      fn: nextStep
    });
  }
  if (step.value === 3) {
    if (isKeystore.value) {
      return Object.assign({}, obj, {
        disabled: loadingButton.value || !validPassword.value,
        fn: validateUserInputs
      });
    }

    return Object.assign({}, obj, {
      disabled: !isValidMnemonic.value,
      fn: validateUserInputs
    });
  }
  if (step.value === 4) {
    return Object.assign({}, obj, {
      title: 'Set withdrawal address',
      disabled: loadingButton.value,
      fn: setWithdrawalAddress
    });
  }

  return obj;
});
const phraseToLength = computed(() => {
  const locPhrase = Object.values(phrase.value);
  if (locPhrase.length > length.value) locPhrase.length = length;
  return locPhrase;
});
const isValidMnemonic = computed(() => {
  return phraseToLength.value.length === length.value;
});
const parsedPhrase = computed(() => {
  return phraseToLength.value.join(' ').toLowerCase();
});
/**
 * @returns array
 * returns button configs
 */
const buttons = computed(() => {
  return [
    /* Keystore Button */
    {
      label: 'Keystore',
      icon: require('@/assets/images/icons/icon-keystore-file.svg'),
      fn: () => {
        userSelectFile();
      }
    },
    /* Mnemonic */
    {
      label: 'Mnemonic Phrase',
      icon: require('@/assets/images/icons/icon-mnemonic.svg'),
      fn: () => {
        setType(SOFTWARE_WALLET_TYPES.MNEMONIC);
      }
    }
  ];
});
/**
 * @returns string
 * returns currency name from current selected network
 */
const currencyName = computed(() => {
  return network.type.currencyName;
});
/**
 * @returns object
 * Returns the left button config for
 * mew popup
 */
const leftBtn = computed(() => {
  return {
    text: 'Cancel',
    color: 'basic',
    method: closeModal
  };
});
/**
 * @returns string
 * Returns title based on current step
 */
const modalTitle = computed(() => {
  return step.value === 1
    ? 'Provide withdrawal address'
    : step.value === 2
    ? 'Choose recovery method'
    : step.value === 3 && isKeystore.value
    ? 'Enter Keystore Password'
    : step.value === 3 && isMnemonic.value
    ? 'Enter Mnemonic Phrase'
    : step.value === 4
    ? 'Verify details'
    : '';
});
/**
 * @returns boolean
 * returns whether selected recovery is keystore
 */
const isKeystore = computed(() => {
  return selectedRecoveryType.value === SOFTWARE_WALLET_TYPES.KEYSTORE;
});
/**
 * @returns boolean
 * returns whether selected recovery is keystore
 */
const isMnemonic = computed(() => {
  return selectedRecoveryType.value === SOFTWARE_WALLET_TYPES.MNEMONIC;
});
const validPassword = computed(() => {
  return password.value.length > 3;
});

// watch
watch(
  () => phrase,
  newval => {
    if (newval && !isEmpty(newval) && !isEmpty(newval[1])) {
      checkPhrase(newval);
      const splitVal = newval[1].split(' ');
      if (splitVal.length === 12 || splitVal.length === 24) {
        length.value = splitVal.length;
        const newObj = {};
        splitVal.forEach((item, idx) => {
          newObj[idx + 1] = item.toLowerCase();
        });
        phrase.value = newObj;
      }
    }
  },
  () => ({ deep: true })
);

// methods
const setWithdrawalAddress = () => {
  const submitSubDomain = network.type.name === 'ETH' ? 'mainnet' : 'staging';
  const submitEndpoint = `https://${submitSubDomain}.mewwallet.dev/v2/stake/upgrade`;
  blsExecution.value.message.validator_index = parseInt(
    blsExecution.value.message.validator_index
  );
  loadingButton.value = true;
  fetch(submitEndpoint, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      signed: [blsExecution.value]
    })
  })
    .then(res => {
      if (res.ok) {
        addValidatorIndex(props.selectedValidator.validator_index);
        Toast('Successfully set withdrawal address!', {}, SUCCESS);
        return;
      }
      return res.json().then(jsonres => {
        if (
          JSON.stringify(jsonres).includes(
            'withdrawal credential prefix is not a BLS prefix'
          )
        ) {
          addValidatorIndex(props.selectedValidator.validator_index);
          Toast(
            'Withdrawal credentials are already set for this validator',
            {},
            WARNING
          );
        } else {
          Toast(jsonres.error ? jsonres.error : jsonres.msg, {}, ERROR);
        }
      });
    })
    .finally(() => {
      clear();
    });
};
const checkPhrase = val => {
  const testObj = {};
  let changed = false;
  Object.values(val).forEach((item, idx) => {
    if (!isEmpty(item)) testObj[idx + 1] = item.toLowerCase();
    else changed = true;
  });
  if (changed) phrase.value = testObj;
};
/**
 * takes the keystore inputs
 * and checks if valid
 */
const validateUserInputs = async () => {
  loadingButton.value = true;
  try {
    const selectedNetwork = network.type.name === 'ETH' ? 'mainnet' : 'goerli';
    if (isKeystore.value) {
      blsExecution.value = await keystoreToBLSExecution(
        file.value,
        password.value,
        executionAddress.value,
        props.selectedValidator.validator_index,
        `0x${props.selectedValidator.decoded.withdrawal_credentials}`,
        selectedNetwork
      );
    } else {
      blsExecution.value = await mnemonicToBLSExecution(
        {
          mnemonic: parsedPhrase.value
        },
        executionAddress.value,
        props.selectedValidator.validator_index,
        `0x${props.selectedValidator.decoded.withdrawal_credentials}`,
        selectedNetwork
      );
    }
    loadingButton.value = false;
    nextStep();
  } catch (err) {
    loadingButton.value = false;
    Toast(err, {}, ERROR);
    clear();
  }
};
const clear = () => {
  if (addressInput.value) {
    addressInput.value.clear();
  }
  step.value = 1;
  executionAddress.value = address;
  isValidAddress.value = false;
  selectedRecoveryType.value = '';
  file.value = {};
  password.value = '';
  blsExecution.value = '';
  phrase.value = {};
  loadingButton.value = false;
  props.reset();
};
/**
 * sets selected wallet
 */
const setType = type => {
  selectedRecoveryType.value = type;
  nextStep();
};
/**
 * upload keystore
 */
const uploadFile = e => {
  const reader = new FileReader();
  reader.onloadend = evt => {
    try {
      file.value = JSON.parse(evt.target.result);
      setType(SOFTWARE_WALLET_TYPES.KEYSTORE);
    } catch (err) {
      Toast(err.message, {}, ERROR);
    }
  };
  reader.readAsBinaryString(e.target.files[0]);
};
const userSelectFile = () => {
  const jsonInput = jsonInput.value;
  jsonInput.value = '';
  jsonInput.click();
};
/**
 * Increments stepper
 */
const nextStep = () => {
  step.value += 1;
};
/**
 * Increments stepper
 */
const back = () => {
  const jsonInput = jsonInput.value;
  switch (step.value) {
    case 2:
      selectedRecoveryType.value = '';
      jsonInput.value = '';
      break;
    case 3:
      password.value = '';
      phrase.value = {};
      file.value = {};
      break;
    default:
      break;
  }
  step.value -= 1;
};
/**
 * Sets address passed from addressbook
 */
const setAddress = (addr, isValidAddress) => {
  executionAddress.value = addr;
  isValidAddress.value = isValidAddress;
};
/**
 * Close modal and clear selected validator
 */
const closeModal = () => {
  clear();
};
</script>

<style lang="scss" scoped>
.staked-status-container {
  max-width: 500px;
}
.border-container {
  border: 1px solid var(--v-greyLight-base);
}
</style>
