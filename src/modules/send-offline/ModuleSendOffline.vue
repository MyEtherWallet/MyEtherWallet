<template>
  <div>
    <mew-module
      class="d-flex flex-grow-1 pt-6"
      title="Send Offline"
      :has-elevation="true"
      :has-indicator="true"
    >
      <template #moduleBody>
        <!--
      =====================================================================================
        Tokens / Amount to Swap / Token Balance
      =====================================================================================
      -->
        <v-row class="mt-5">
          <v-col cols="12" sm="6" class="pr-sm-1 pt-0 pb-0 pb-sm-4">
            <div class="position--relative">
              <mew-select
                ref="mewSelect"
                label="Token"
                :items="[]"
                :is-custom="true"
                :value="selectedCurrency"
              />
            </div>
          </v-col>
          <v-col cols="12" sm="6" class="pl-sm-1 pt-0 pb-2 pb-sm-4">
            <div class="position--relative">
              <mew-input
                label="Amount"
                placeholder="0"
                :value="amount"
                type="number"
                :persistent-hint="true"
                @input="setAmount"
              />
            </div>
          </v-col>
          <!--
        =====================================================================================
          Input Address
        =====================================================================================
        -->
          <v-col cols="12" class="pt-4 pb-2">
            <module-address-book ref="addressInput" @setAddress="setAddress" />
          </v-col>

          <v-col cols="12">
            <mew-input
              v-model="localNonce"
              :label="$t('sendTx.nonce')"
              placeholder="0"
              type="number"
              :rules="isInteger"
            />
          </v-col>

          <!--
      =====================================================================================
        Advanced:
      =====================================================================================
      -->
          <v-col cols="12" class="py-4">
            <mew-expand-panel
              ref="expandPanel"
              is-toggle
              has-dividers
              :panel-items="expandPanel"
              @toggled="closeToggle"
            >
              <template #panelBody1>
                <!-- Warning Sheet -->
                <div
                  class="pa-5 warning textBlack2--text border-radius--5px mb-8"
                >
                  <div class="d-flex font-weight-bold mb-2">
                    <v-icon class="textBlack2--text mew-body mr-1">
                      mdi-alert-outline</v-icon
                    >For advanced users only
                  </div>
                  <div>
                    Please don’t edit these fields unless you are an expert user
                    & know what you’re doing. Entering the wrong information
                    could result in your transaction failing or getting stuck.
                  </div>
                </div>
                <div class="d-flex align-center justify-end pa-3">
                  <div
                    class="mew-body primary--text cursor--pointer"
                    @click="setGasLimit(defaultGasLimit)"
                  >
                    Reset to default: {{ 21000 }}
                  </div>
                </div>

                <mew-input
                  :value="gasLimit"
                  :label="$t('common.gas.limit')"
                  placeholder=""
                  :error-messages="gasLimitError"
                  type="number"
                />

                <mew-input
                  v-model="data"
                  :label="$t('sendTx.add-data')"
                  placeholder="0x..."
                  :rules="dataRules"
                  class="mb-8"
                />
              </template>
            </mew-expand-panel>
          </v-col>
        </v-row>

        <div class="d-flex flex-column mt-12">
          <div class="text-center">
            <mew-button
              :title="$t('sendTx.generate-tx')"
              :has-full-width="false"
              btn-size="xlarge"
              :disabled="isDisabledNextBtn"
              @click.native="generateTx"
            />
          </div>
          <div class="text-center mt-4">
            <mew-button
              :title="$t('common.clear-all')"
              :has-full-width="false"
              btn-size="small"
              btn-style="transparent"
              @click.native="clear()"
            />
          </div>
        </div>
      </template>
    </mew-module>
    <mew-overlay
      :show-overlay="isSignedTxOpen"
      :title="$t('sendTx.signed.tx')"
      :close="() => (isSignedTxOpen = false)"
      content-size="xlarge"
    >
      <div v-if="signedTransaction" style="width: 100%" class="text-center">
        <mew-text-area
          ref="signedTxInput"
          style="width: 100%"
          :label="$t('sendTx.signed.tx')"
          :value="signedTransaction.rawTransaction"
        />

        <div class="mb-3">{{ $t('sendTx.signed.scan') }}</div>
        <!-- <qrcode-vue
          class="mb-3"
          :value="signedTransaction.rawTransaction"
          :size="200"
          level="H"
        /> -->
        <div>or</div>
        <a
          :href="jsonFile"
          :download="jsonFileName"
          rel="noopener noreferrer"
          >{{ $t('sendTx.signed.download') }}</a
        >
        <mew-text-area
          class="mt-12"
          style="width: 100%"
          :label="$t('sendTx.signed.raw')"
          :value="signed"
        />
        <mew-button
          class="mt-5"
          :title="$t('sendTx.signed.button-copy-cont')"
          @click.native="copyAndContinue"
        ></mew-button>
      </div>
    </mew-overlay>
  </div>
</template>

<script>
import clipboardCopy from 'clipboard-copy';
import { toBN, isHexStrict, toWei } from 'web3-utils';
import { mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import ModuleAddressBook from '@/modules/address-book/ModuleAddressBook';
import sanitizeHex from '@/core/helpers/sanitizeHex';
export default {
  components: {
    ModuleAddressBook
  },
  data() {
    return {
      isSignedTxOpen: false,
      localNonce: '0',
      gasLimit: '21000',
      toAddress: '',
      isValidAddress: false,
      amount: '0',
      selectedCurrency: {},
      data: '0x',
      userInputType: '',
      expandPanel: [
        {
          name: this.$t('common.advanced'),
          subtext: 'Gas Limit & Data'
        }
      ],
      localGasPrice: '0',
      localGasType: 'economy',
      defaultGasLimit: '21000',
      gasLimitError: '',
      amountError: '',
      signed: null,
      raw: null,
      signedTransaction: null,
      jsonFileName: '',
      jsonFile: null
    };
  },
  computed: {
    ...mapState('wallet', ['address', 'instance']),
    isValidGasLimit() {
      if (this.gasLimit) {
        return (
          BigNumber(this.gasLimit).gt(0) &&
          BigNumber(this.gasLimit).dp() < 1 &&
          toBN(this.gasLimit).gte(toBN(this.defaultGasLimit))
        );
      }
      return false;
    },
    isInteger() {
      return [BigNumber(this.nonce).isInteger() || 'Need integer value.'];
    },
    dataRules() {
      return [
        value => {
          return isHexStrict(value);
        }
      ];
    },
    isDisabledNextBtn() {
      return false;
    }
  },
  watch: {
    signed(newVal) {
      const parsedVal = JSON.parse(newVal);
      const string = JSON.stringify(parsedVal);
      const blob = new Blob([string], {
        type: 'mime'
      });
      this.jsonFileName = `signedTransactionObject-${+new Date()}.json`;
      this.jsonFile = window.URL.createObjectURL(blob);
    },
    amount() {},
    data() {},
    gasLimit() {}
  },
  methods: {
    copyAndContinue() {
      clipboardCopy(this.$refs.signedTxInput.value);
      this.isSignedTxOpen = false;
    },
    /**
     * Resets values to default
     */
    clear() {
      if (this.$refs && this.$refs.addressInput)
        this.$refs.addressInput.clear();
      this.toAddress = '';
      this.selectedCurrency = {};
      this.isValidAddress = false;
      this.amount = '0';
      this.data = '0x';
      this.userInputType = '';
      this.localGasPrice = '0';
      this.localGasType = 'economy';
      this.defaultGasLimit = '21000';
      this.gasLimitError = '';
      this.amountError = '';
    },
    /**
     * Method sets gas limit to default when Advanced closed , ONLY IF gasLimit was invalid
     */
    closeToggle() {
      if (!this.isValidGasLimit) {
        this.gasLimit = this.defaultGasLimit;
        this.setGasLimitError(this.gasLimit);
      }
    },
    /**
     * Method sets gasLimitError based on the user input
     * Has to be set manualy and debouned otherwise error message is not displayed when tokens are switched and gas limit input component is out of focus
     * @param value {string}
     */
    setGasLimitError(value) {
      if (value) {
        if (BigNumber(value).lte(0))
          this.gasLimitError = 'Gas limit must be greater than 0';
        else if (BigNumber(value).dp() > 0)
          this.gasLimitError = 'Gas limit can not have decimal points';
        else if (toBN(value).lt(toBN(this.defaultGasLimit)))
          this.gasLimitError = 'Amount too low. Transaction will fail';
        else {
          this.gasLimitError = '';
        }
      } else {
        this.gasLimitError = 'Required';
      }
    },
    setAddress(addr, isValidAddress, userInputType) {
      this.toAddress = addr;
      this.isValidAddress = isValidAddress;
      this.userInputType = userInputType;
    },
    setAmount(value) {
      this.amount = value;
    },
    setGasLimit(value) {
      this.gasLimit = value;
    },
    async generateTx() {
      const symbol = this.network.type.currencyName;
      const isToken = this.selectedCurrency.symbol !== symbol;
      const amtWei = toWei(this.amount, 'ether');

      const raw = {
        nonce: sanitizeHex(new BigNumber(this.localNonce).toString(16)),
        gasLimit: sanitizeHex(new BigNumber(this.gasLimit).toString(16)),
        gasPrice: sanitizeHex(
          new BigNumber(toWei(this.localGasPrice, 'gwei')).toString(16)
        ),
        to: isToken
          ? this.selectedCurrency.address
          : this.address.toLowerCase().trim(),
        value: isToken
          ? sanitizeHex(new BigNumber(0).toString(16))
          : sanitizeHex(new BigNumber(amtWei).toString(16)),
        data: this.data,
        chainId: this.network.type.chainID
      };

      this.raw = raw;
      const signed = await this.instance.signTransaction(this.raw);
      this.signedTransaction = signed;
      this.signed = JSON.stringify(signed);
      window.scrollTo(0, 0);
      this.clear();
      this.isSignedTxOpen = true;
    }
  }
};
</script>
