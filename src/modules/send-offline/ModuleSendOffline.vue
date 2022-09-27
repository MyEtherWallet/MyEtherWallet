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
                v-model="selectedCurrency"
                label="Token"
                :items="tokens"
                :is-custom="true"
              />
            </div>
          </v-col>
          <v-col cols="12" sm="6" class="pl-sm-1 pt-0 pb-2 pb-sm-4">
            <div class="position--relative">
              <mew-input
                v-model="amount"
                class="SendOfflineAmountInput"
                label="Amount"
                placeholder="0"
                :error-messages="amountErrors"
                type="number"
              />
            </div>
          </v-col>
          <!--
        =====================================================================================
          Input Address
        =====================================================================================
        -->
          <v-col cols="12" class="pt-4 pb-2">
            <module-address-book
              ref="addressInput"
              class="SendOfflineAddressBook"
              @setAddress="setAddress"
            />
          </v-col>

          <v-col cols="12">
            <mew-input
              v-model="localNonce"
              class="SendOfflineNonceInput"
              :label="$t('sendTx.nonce')"
              placeholder="0"
              type="number"
              :error-messages="nonceErrors"
            />
          </v-col>
          <v-col cols="12">
            <mew-input
              v-model="data"
              label="Data"
              placeholder="0x..."
              :error-messages="dataErrors"
              class="mb-8 SendOFflineDataInput"
              :disabled="disableData"
            />
          </v-col>
          <v-col cols="12">
            <mew-input
              v-model="gasLimit"
              class="SendOfflineGasLimitInput"
              :label="$t('common.gas.limit')"
              :error-messages="gasLimitErrors"
              type="number"
            />
          </v-col>
          <v-col cols="12">
            <mew-input
              v-model="gasPrice"
              class="SendOfflineGasPriceInput"
              label="Gas Price (in wei)"
              :error-messages="gasPriceErrors"
              type="number"
            />
          </v-col>
        </v-row>

        <div class="d-flex flex-column mt-12">
          <div class="text-center">
            <mew-button
              title="Generate Transaction"
              class="SendOfflineGenerateTransactionButton"
              :has-full-width="false"
              btn-size="xlarge"
              :disabled="isDisabledNextBtn"
              @click.native="generateTx"
            />
          </div>
          <div class="text-center">
            <div class="d-flex flex-column justify-center">
              <input
                ref="upload"
                class="SendOfflineUploadInput"
                type="file"
                style="opacity: 0"
                accept="json"
                @change="upload"
              />
              <mew-button
                class="mt-2 display--block mx-auto SendOfflineUploadJsonButton"
                title="Upload JSON file"
                btn-size="small"
                btn-style="transparent"
                @click.native="$refs.upload.click()"
              />
            </div>
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
      title="Signed Transaction"
      :close="() => (isSignedTxOpen = false)"
      content-size="xlarge"
    >
      <div v-if="signedTransaction" style="width: 100%" class="text-center">
        <mew-text-area
          ref="signedTxInput"
          class="SendOfflineSignedTxResultInput"
          style="width: 100%"
          label="Signed Transaction"
          readonly
          :value="signedTransaction.rawTransaction"
        />

        <mew-text-area
          class="mt-12"
          style="width: 100%"
          label="Signed Raw Transaction"
          readonly
          :value="signed"
        />
        <mew-button
          class="mt-5"
          title="Copy And Continue"
          @click.native="copyAndContinue"
        />
        <div class="pt-3">
          <a
            :href="jsonFile"
            :download="jsonFileName"
            rel="noopener noreferrer"
            class="mew-body"
            >Download</a
          >
        </div>
      </div>
    </mew-overlay>
  </div>
</template>

<script>
import clipboardCopy from 'clipboard-copy';
import { toBN, isHexStrict, toWei, hexToNumberString } from 'web3-utils';
import { mapActions, mapGetters, mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import { isValidAddress } from 'ethereumjs-util';
import { debounce, isEmpty } from 'lodash';
import * as nodes from '@/utils/networks/nodes';

import sanitizeHex from '@/core/helpers/sanitizeHex';
import { ERROR, SUCCESS, Toast } from '../toast/handler/handlerToast';
import { toBNSafe } from '@/core/helpers/numberFormatHelper';
export default {
  components: {
    ModuleAddressBook: () => import('@/modules/address-book/ModuleAddressBook')
  },
  data() {
    return {
      isSignedTxOpen: false,
      localNonce: '0',
      gasLimit: '21000',
      gasPrice: '0',
      toAddress: '',
      isValidAddress: false,
      amount: '0',
      selectedCurrency: {},
      data: '0x',
      userInputType: '',
      defaultGasLimit: '21000',
      gasLimitError: '',
      amountError: '',
      signed: null,
      raw: null,
      signedTransaction: null,
      jsonFileName: '',
      jsonFile: null,
      tokens: [],
      nodes: nodes,
      chainID: 1
    };
  },
  computed: {
    ...mapState('wallet', ['address', 'instance']),
    ...mapGetters('global', ['network']),
    networkToken() {
      return {
        symbol: this.network.type.currencyName,
        name: this.network.type.name
      };
    },
    isDisabledNextBtn() {
      return (
        this.nonceErrors !== '' ||
        this.dataErrors !== '' ||
        this.gasLimitErrors !== '' ||
        this.gasPriceErrors !== '' ||
        this.amountErrors !== '' ||
        !this.validAddress
      );
    },
    nonceErrors() {
      if (
        BigNumber(this.localNonce).lt(0) ||
        this.localNonce === '' ||
        this.localNonce === null
      ) {
        return 'Nonce has to be greater than or equal to 0!';
      }
      return '';
    },
    dataErrors() {
      if (isHexStrict(this.data)) {
        return '';
      }
      return 'Invalid data hex';
    },
    gasLimitErrors() {
      if (!this.gasLimit) {
        return 'Required';
      }
      if (BigNumber(this.gasLimit).lte(0)) {
        return 'Gas limit must be greater than 0';
      } else if (BigNumber(this.gasLimit).dp() > 0) {
        return 'Gas limit can not have decimal points';
      } else if (toBN(this.gasLimit).lt(toBN(this.defaultGasLimit))) {
        return 'Amount too low. Transaction will fail';
      }
      return '';
    },
    gasPriceErrors() {
      if (!this.gasPrice) {
        return 'Required';
      } else if (BigNumber(this.gasPrice).lte(0)) {
        return 'Gas price must be greater than 0';
      }

      return '';
    },
    amountErrors() {
      if (!this.amount) {
        return 'Required';
      } else if (BigNumber(this.amount).lt(0)) {
        return 'Amount must be greater than or equal to 0';
      }
      return '';
    },
    disableData() {
      return this.selectedCurrency.symbol !== this.network.type.currencyName;
    },
    validAddress() {
      return this.toAddress !== '' && isValidAddress(this.toAddress);
    },
    canGenerate() {
      return (
        this.validAddress &&
        !isEmpty(this.selectedCurrency) &&
        this.selectedCurrency.symbol !== this.network.type.currencyName
      );
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
    selectedCurrency: {
      handler: function () {
        if (this.canGenerate) {
          this.generateData();
        }
      },
      deep: true
    },
    toAddress() {
      if (this.canGenerate) {
        this.generateData();
      }
    },
    network() {
      this.selectedCurrency = this.networkToken;
      this.generateTokens();
    }
  },
  mounted() {
    this.selectedCurrency = this.networkToken;
    this.generateTokens();
  },
  methods: {
    ...mapActions('wallet', ['setWeb3Instance']),
    ...mapActions('global', ['setNetwork']),
    ...mapActions('external', ['setTokenAndEthBalance']),
    generateTokens() {
      const networkToken = [this.networkToken];
      this.network.type.tokens.then(tokens => {
        this.tokens = networkToken.concat(tokens);
      });
    },
    generateData() {
      const web3 = new Web3(this.network.url);
      const jsonInterface = [
        {
          constant: false,
          inputs: [
            { name: '_to', type: 'address' },
            { name: '_amount', type: 'uint256' }
          ],
          name: 'transfer',
          outputs: [{ name: '', type: 'bool' }],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ];
      const contract = new web3.eth.Contract(
        jsonInterface,
        this.selectedCurrency.address
      );
      const amount = toBN(this.amount);
      this.data = contract.methods
        .transfer(this.toAddress.toLowerCase(), amount)
        .encodeABI();
    },
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
      this.selectedCurrency = this.networkToken;
      this.isValidAddress = false;
      this.amount = '0';
      this.data = '0x';
      this.userInputType = '';
      this.localNonce = '0';
      this.gasPrice = '0';
      this.defaultGasLimit = '21000';
      this.gasLimitError = '';
      this.amountError = '';
    },
    setAddress(addr, isValidAddress, userInputType) {
      this.toAddress = addr;
      this.isValidAddress = isValidAddress;
      this.userInputType = userInputType;
    },
    upload({ target: { files } }) {
      const reader = new FileReader();
      const self = this;
      reader.onloadend = function ({ target: { result } }) {
        try {
          const file = JSON.parse(result);
          if (file.nonce) {
            self.localNonce = hexToNumberString(file.nonce);
            self.gasPrice = hexToNumberString(file.gasPrice);
            self.chainID = hexToNumberString(file.chainID);
            self.setNetworkDebounced(self.chainID);
            self.$refs.upload.value = '';
            return;
          }
          Toast('Malformed File', {}, 'error');
        } catch {
          Toast('Incorrect File Type', {}, 'error');
        }
      };
      if (files[0]) reader.readAsBinaryString(files[0]);
    },
    async generateTx() {
      const symbol = this.network.type.currencyName;
      const isToken = this.selectedCurrency.symbol !== symbol;
      const amtWei = toWei(this.amount, 'ether');
      const raw = {
        nonce: sanitizeHex(toBNSafe(this.localNonce).toString(16)),
        gasLimit: sanitizeHex(toBNSafe(this.gasLimit).toString(16)),
        gasPrice: sanitizeHex(toBNSafe(this.gasPrice).toString(16)),
        to: isToken
          ? this.selectedCurrency.address
          : this.toAddress.toLowerCase().trim(),
        value: isToken
          ? sanitizeHex(toBNSafe(0).toString(16))
          : sanitizeHex(toBNSafe(amtWei).toString(16)),
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
    },
    /**
     * Debounce network switch from user input
     * @return {void}
     */
    setNetworkDebounced: debounce(function (value) {
      const found = Object.values(this.nodes).filter(item => {
        if (item.type.chainID == value) {
          return item;
        }
      });
      this.setNetwork({
        network: found[0],
        walletType: this.instance?.identifier || ''
      })
        .then(() => {
          const provider = this.setWeb3Instance();
          provider.then(() => {
            this.setTokenAndEthBalance();
          });
          Toast(`Switched network to: ${found[0].type.name}`, {}, SUCCESS);
        })
        .catch(e => {
          Toast(e, {}, ERROR);
        });
    }, 1000)
  }
};
</script>
