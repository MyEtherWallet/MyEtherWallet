<template>
  <mew-stepper :items="stepperItems" :on-step="step">
    <!--
    =====================================================================================
      Step 1: Enter mnemonic
    =====================================================================================
    -->
    <template v-if="step === 1" #stepperContent1>
      <form @submit.prevent="unlockBtn">
        <v-row class="align-end justify-start mb-3 mb-md-5">
          <v-col cols="12">
            <!--
          =====================================================================================
            Title
          =====================================================================================
          -->
            <div class="subtitle-1 font-weight-bold grey--text">STEP 1.</div>
            <div class="headline font-weight-bold">
              Enter your Mnemonic Phrase
            </div>
            <p class="mb-3">
              Please type the mnemonic phrase you wrote down in the right order.
            </p>
            <!--
          =====================================================================================
            Select number of words
          =====================================================================================
          -->
            <div class="d-flex flex-row-reverse pb-4">
              <v-select
                v-model="length"
                style="max-width: 150px"
                hide-details
                dense
                item-text="label"
                item-value="value"
                :items="mnemonicOptions"
                label=""
                outlined
              ></v-select>
            </div>
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
            <!--
          =====================================================================================
            Extra Word
          =====================================================================================
          -->
            <mew-expand-panel
              :has-dividers="true"
              :panel-items="extraWordPanel"
              :idx-to-expand="null"
            >
              <template #panelBody1>
                <div class="px-5">
                  <mew-input
                    v-model="extraWord"
                    type="password"
                    label="Enter Extra word"
                    placeholder="Enter your extra word"
                  />
                </div>
              </template>
            </mew-expand-panel>
            <!--
          =====================================================================================
            Next Button
          =====================================================================================
          -->
            <v-row dense class="pt-4" align="center" justify="center">
              <v-col cols="12" align-self="center" class="text-center">
                <mew-button
                  title="Next"
                  btn-size="xlarge"
                  :disabled="!isValidMnemonic"
                  @click.native="unlockBtn"
                />
              </v-col>
              <v-col cols="12" align-self="center" class="text-center">
                <mew-button
                  title="Clear"
                  btn-size="xlarge"
                  btn-style="transparent"
                  @click.native="clearFields"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </form>
    </template>
    <!--
    =====================================================================================
      Step 2: Select Address and Network
    =====================================================================================
    -->
    <template v-if="step === 2" #stepperContent2>
      <v-row class="align-end justify-start">
        <v-col cols="12">
          <!--
            =====================================================================================
              Title
            =====================================================================================
            -->
          <div class="subtitle-1 font-weight-bold grey--text">STEP 2.</div>
          <div class="headline font-weight-bold mb-5">
            Select Address and Network
          </div>
        </v-col>
      </v-row>
      <access-wallet-address-network
        :handler-wallet="walletInstance"
        :selected-path="selectedPath"
        :paths="parsedPaths"
        :hide-networks="switchAddress"
        @setPath="setPath"
        @unlock="accessWallet"
      />
    </template>
  </mew-stepper>
</template>

<script>
import phraseBlock from '@/components/PhraseBlock';
import { mapActions, mapState } from 'vuex';
import { Toast, ERROR, SENTRY } from '@/modules/toast/handler/handlerToast';
import { isEmpty } from 'underscore';
import AccessWalletAddressNetwork from '@/modules/access-wallet/common/components/AccessWalletAddressNetwork';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import paths from '@/modules/access-wallet/hardware/handlers/bip44';
export default {
  name: 'AccessMnemonic',
  components: {
    phraseBlock,
    AccessWalletAddressNetwork
  },
  props: {
    handlerAccessWallet: {
      type: Object,
      default: () => {
        return {};
      }
    },
    switchAddress: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      /* Stepper Items */
      step: 1,
      stepperItems: [
        {
          step: 1,
          name: 'Enter Phrase'
        },
        {
          step: 3,
          name: 'Address & Network'
        }
      ],
      /*Phrase Items: */
      extraWord: '',
      phrase: {},
      length: 12,
      mnemonicOptions: [
        {
          label: '12 words',
          value: 12
        },
        {
          label: '24 words',
          value: 24
        }
      ],
      /* Derivation Path */
      selectedPath: {
        name: 'Ethereum',
        subtext: "m/44'/60'/0'/0",
        value: "m/44'/60'/0'/0"
      },
      walletInstance: {}
    };
  },
  computed: {
    ...mapState('custom', ['paths']),
    /*------------------------------------
     * STEP 1 ITEMS
    -------------------------------------*/
    /**
     * Property returns panel items for the extra word,used in step 1
     */
    extraWordPanel() {
      return [
        {
          name: 'Do you have an extra word?',
          toggleTitle: 'Add your word'
        }
      ];
    },
    /**
     * Property validates whether or not all words has been entered
     * @return booelan
     */
    isValidMnemonic() {
      return Object.keys(this.phrase).length === this.length;
    },

    /*------------------------------------
     * STEP 2 ITEMS
    -------------------------------------*/
    /**
     * Property returns parsed mnemonic phrase
     * Is used in unlock wallet method
     */
    parsedPhrase() {
      return Object.values(this.phrase).join(' ').toLowerCase();
    },
    /**
     * Property returns default Paths + Custom paths, used in Select Path component
     * Property Interface:
     * {  name = string -> Name of the Path,
     *    subtext = string --> Derivation Path,
     *    value = tring --> Derivation Path
     * }
     */
    parsedPaths() {
      return paths[WALLET_TYPES.MNEMONIC]
        .map(item => {
          const newObj = {};
          newObj['name'] = item['label'];
          newObj['subtext'] = item['path'];
          newObj['value'] = item['path'];
          return newObj;
        })
        .concat(this.paths);
    }
  },
  watch: {
    phrase: {
      deep: true,
      handler: function (newval) {
        if (newval && !isEmpty(newval)) {
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
    },
    selectedPath: {
      handler: function () {
        this.walletInstance = {};
        this.nextStepTwo();
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('global', ['addCustomPath']),
    /**
     * Method unlocks mnemonic phrase;
     * Direct to second step if mnemonic was valid;
     * Shows toast on error
     * Used in STEP 1
     */
    unlockBtn() {
      this.handlerAccessWallet
        .unlockMnemonicWallet(this.parsedPhrase, this.extraWord)
        .then(res => {
          if (res) {
            this.step = 2;
            this.nextStepTwo();
          }
        })
        .catch(e => {
          Toast(e, {}, ERROR);
        });
    },
    setPath(e) {
      this.selectedPath = e;
    },
    nextStepTwo() {
      const defaultPath = this.selectedPath;
      this.handlerAccessWallet
        .updateMnemonicPath(defaultPath.value)
        .catch(e => {
          Toast(e, {}, ERROR);
        });
      this.walletInstance = this.handlerAccessWallet.getWalletInstance();
    },
    /**
     * Clears mnemonic input field
     */
    clearFields() {
      this.phrase = {};
      this.length = 12;
    },
    /**
     * reset component
     */
    reset() {
      this.step = 1;
      /*Phrase Items: */
      this.extraWord = '';
      this.phrase = {};
      this.length = 12;
      /* Derivation Path */
      this.selectedPath = {
        name: 'Ethereum',
        subtext: "m/44'/60'/0'/0",
        value: "m/44'/60'/0'/0"
      };
      this.walletInstance = {};
    },
    /**
     * Methods emits parent to unlock wallet
     * and passes account withinMnemonic Phrase
     * Used in STEP 2
     */
    accessWallet(account) {
      if (account) {
        this.$emit('unlock', account);
        this.reset();
      } else {
        Toast('Something went wrong in mnemonic wallet access', {}, SENTRY);
      }
    }
  }
};
</script>
