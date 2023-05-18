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

<script>
import { mapGetters, mapState, mapActions } from 'vuex';
import {
  keystoreToBLSExecution,
  mnemonicToBLSExecution
} from '@myetherwallet/eth2-keystore';

import {
  Toast,
  ERROR,
  SUCCESS,
  WARNING
} from '@/modules/toast/handler/handlerToast';
import { SOFTWARE_WALLET_TYPES } from '@/modules/access-wallet/software/handlers/helpers.js';

import { isEmpty } from 'lodash';

export default {
  components: {
    phraseBlock: () => import('@/components/PhraseBlock'),
    ModuleAddressBook: () => import('@/modules/address-book/ModuleAddressBook')
  },
  props: {
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
  },
  data() {
    return {
      step: 1,
      executionAddress: '',
      isValidAddress: false,
      selectedRecoveryType: '',
      file: {},
      password: '',
      blsExecution: '',
      phrase: {},
      length: 24,
      loadingButton: false
    };
  },
  computed: {
    ...mapState('wallet', ['address']),
    ...mapGetters('global', ['network']),
    nextButton() {
      const obj = {
        title: 'Next',
        disabled: false,
        fn: this.nextStep
      };
      if (this.step === 1) {
        return Object.assign({}, obj, {
          disabled: !this.isValidAddress && this.executionAddress !== '',
          fn: this.nextStep
        });
      }
      if (this.step === 3) {
        if (this.isKeystore) {
          return Object.assign({}, obj, {
            disabled: this.loadingButton || !this.validPassword,
            fn: this.validateUserInputs
          });
        }

        return Object.assign({}, obj, {
          disabled: !this.isValidMnemonic,
          fn: this.validateUserInputs
        });
      }
      if (this.step === 4) {
        return Object.assign({}, obj, {
          title: 'Set withdrawal address',
          disabled: this.loadingButton,
          fn: this.setWithdrawalAddress
        });
      }

      return obj;
    },
    phraseToLength() {
      const phrase = Object.values(this.phrase);
      if (phrase.length > this.length) phrase.length = this.length;
      return phrase;
    },
    isValidMnemonic() {
      return this.phraseToLength.length === this.length;
    },
    parsedPhrase() {
      return this.phraseToLength.join(' ').toLowerCase();
    },
    /**
     * @returns array
     * returns button configs
     */
    buttons() {
      return [
        /* Keystore Button */
        {
          label: 'Keystore',
          icon: require('@/assets/images/icons/icon-keystore-file.svg'),
          fn: () => {
            this.userSelectFile();
          }
        },
        /* Mnemonic */
        {
          label: 'Mnemonic Phrase',
          icon: require('@/assets/images/icons/icon-mnemonic.svg'),
          fn: () => {
            this.setType(SOFTWARE_WALLET_TYPES.MNEMONIC);
          }
        }
      ];
    },
    /**
     * @returns string
     * returns currency name from current selected network
     */
    currencyName() {
      return this.network.type.currencyName;
    },
    /**
     * @returns object
     * Returns the left button config for
     * mew popup
     */
    leftBtn() {
      return {
        text: 'Cancel',
        color: 'basic',
        method: this.closeModal
      };
    },
    /**
     * @returns string
     * Returns title based on current step
     */
    modalTitle() {
      return this.step === 1
        ? 'Provide withdrawal address'
        : this.step === 2
        ? 'Choose recovery method'
        : this.step === 3 && this.isKeystore
        ? 'Enter Keystore Password'
        : this.step === 3 && this.isMnemonic
        ? 'Enter Mnemonic Phrase'
        : this.step === 4
        ? 'Verify details'
        : '';
    },
    /**
     * @returns boolean
     * returns whether selected recovery is keystore
     */
    isKeystore() {
      return this.selectedRecoveryType === SOFTWARE_WALLET_TYPES.KEYSTORE;
    },
    /**
     * @returns boolean
     * returns whether selected recovery is keystore
     */
    isMnemonic() {
      return this.selectedRecoveryType === SOFTWARE_WALLET_TYPES.MNEMONIC;
    },
    validPassword() {
      return this.password.length > 3;
    }
  },
  watch: {
    phrase: {
      deep: true,
      handler: function (newval) {
        if (newval && !isEmpty(newval) && !isEmpty(newval[1])) {
          this.checkPhrase(newval);
          const splitVal = newval[1].split(' ');
          if (splitVal.length === 12 || splitVal.length === 24) {
            this.length = splitVal.length;
            const newObj = {};
            splitVal.forEach((item, idx) => {
              newObj[idx + 1] = item.toLowerCase();
            });
            this.phrase = newObj;
          }
        }
      }
    }
  },
  methods: {
    ...mapActions('stakedStore', ['addValidatorIndex']),
    setWithdrawalAddress() {
      const submitSubDomain =
        this.network.type.name === 'ETH' ? 'mainnet' : 'staging';
      const submitEndpoint = `https://${submitSubDomain}.mewwallet.dev/v2/stake/upgrade`;
      this.blsExecution.message.validator_index = parseInt(
        this.blsExecution.message.validator_index
      );
      this.loadingButton = true;
      fetch(submitEndpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          signed: [this.blsExecution]
        })
      })
        .then(res => {
          if (res.ok) {
            this.addValidatorIndex(this.selectedValidator.validator_index);
            Toast('Successfully set withdrawal address!', {}, SUCCESS);
            return;
          }
          return res.json().then(jsonres => {
            if (
              JSON.stringify(jsonres).includes(
                'withdrawal credential prefix is not a BLS prefix'
              )
            ) {
              this.addValidatorIndex(this.selectedValidator.validator_index);
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
          this.clear();
        });
    },
    checkPhrase(val) {
      const testObj = {};
      let changed = false;
      Object.values(val).forEach((item, idx) => {
        if (!isEmpty(item)) testObj[idx + 1] = item.toLowerCase();
        else changed = true;
      });
      if (changed) this.phrase = testObj;
    },
    /**
     * takes the keystore inputs
     * and checks if valid
     */
    async validateUserInputs() {
      this.loadingButton = true;
      try {
        this.validating = true;
        const selectedNetwork =
          this.network.type.name === 'ETH' ? 'mainnet' : 'goerli';
        if (this.isKeystore) {
          this.blsExecution = await keystoreToBLSExecution(
            this.file,
            this.password,
            this.executionAddress,
            this.selectedValidator.validator_index,
            `0x${this.selectedValidator.decoded.withdrawal_credentials}`,
            selectedNetwork
          );
        } else {
          this.blsExecution = await mnemonicToBLSExecution(
            {
              mnemonic: this.parsedPhrase
            },
            this.executionAddress,
            this.selectedValidator.validator_index,
            `0x${this.selectedValidator.decoded.withdrawal_credentials}`,
            selectedNetwork
          );
        }
        this.loadingButton = false;
        this.nextStep();
      } catch (err) {
        this.loadingButton = false;
        Toast(err, {}, ERROR);
        this.clear();
      }
    },
    clear() {
      if (this.$refs.addressInput) {
        this.$refs.addressInput.clear();
      }
      this.step = 1;
      this.executionAddress = this.address;
      this.isValidAddress = false;
      this.selectedRecoveryType = '';
      this.file = {};
      this.password = '';
      this.blsExecution = '';
      this.phrase = {};
      this.loadingButton = false;
      this.reset();
    },
    /**
     * sets selected wallet
     */
    setType(type) {
      this.selectedRecoveryType = type;
      this.nextStep();
    },
    /**
     * upload keystore
     */
    uploadFile(e) {
      const reader = new FileReader();
      reader.onloadend = evt => {
        try {
          this.file = JSON.parse(evt.target.result);
          this.setType(SOFTWARE_WALLET_TYPES.KEYSTORE);
        } catch (err) {
          Toast(err.message, {}, ERROR);
        }
      };
      reader.readAsBinaryString(e.target.files[0]);
    },
    userSelectFile() {
      const jsonInput = this.$refs.jsonInput;
      jsonInput.value = '';
      jsonInput.click();
    },
    /**
     * Increments stepper
     */
    nextStep() {
      this.step += 1;
    },
    /**
     * Increments stepper
     */
    back() {
      const jsonInput = this.$refs.jsonInput;
      switch (this.step) {
        case 2:
          this.selectedRecoveryType = '';
          jsonInput.value = '';
          break;
        case 3:
          this.password = '';
          this.phrase = {};
          this.file = {};
          break;
        default:
          break;
      }
      this.step -= 1;
    },
    /**
     * Sets address passed from addressbook
     */
    setAddress(addr, isValidAddress) {
      this.executionAddress = addr;
      this.isValidAddress = isValidAddress;
    },
    /**
     * Close modal and clear selected validator
     */
    closeModal() {
      this.clear();
    }
  }
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
