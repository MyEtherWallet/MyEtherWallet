<template>
  <div class="send-offline-helper">
    <div class="page-container">
      <div class="wrap">
        <div class="page-title">
          <page-title
            :options="{
              title: 'Send Offline Helper',
              boldSubTitle: '',
              textContent: [
                'Customize actions, debug reveals, and more with this set of advance tools. Please be mindful of the capabilities and limitations of these tools before using.'
              ]
            }"
          />
        </div>
        <div class="page-content-container">
          <!-- Select Network-->
          <div class="collapse-container">
            <accordion-menu
              :greytitle="false"
              :isopen="stage1"
              :title="$t('withoutWallet.selectNetwork')"
              :right-text="networkTitle"
              number="1"
              @titleClicked="stage1 = !stage1"
            >
              <ul class="networks">
                <li
                  v-for="(key, index) in Object.keys(reorderNetworkList)"
                  :key="$router.path + key + index"
                >
                  <div class="network-title">
                    <div class="network-icon">
                      <img
                        v-if="Networks[key][0].type.icon"
                        :src="Networks[key][0].type.icon"
                      />
                      <div v-if="!Networks[key][0].type.icon" class="no-icon">
                        <p>No</p>
                        <p>Icon</p>
                      </div>
                    </div>
                    <p>{{ key }}</p>
                  </div>
                  <div class="network-content">
                    <p
                      v-for="net in Networks[key]"
                      :key="net.service"
                      :class="
                        net.service === selectedNetwork.service &&
                        net.type &&
                        net.type.name === selectedNetwork.type.name
                          ? 'current-network'
                          : ''
                      "
                      @click="switchNetwork(net)"
                    >
                      {{ net.service }}
                    </p>
                  </div>
                </li>
              </ul>
            </accordion-menu>
          </div>

          <!-- Generate Info -->
          <accordion-menu
            :greytitle="false"
            :editbutton="true"
            :isopen="stage2"
            :title="$t('withoutWallet.generateInfo')"
            number="2"
            @titleClicked="stage2 = !stage2"
          >
            <dropdown-address-selector
              title="From Address"
              @toAddress="generateInformation($event)"
            />
            <div v-if="informationGenerated">
              <ul>
                <li class="detail-container">
                  <span class="detail-name">Sender:</span>
                  <span class="detail-text">{{ genInfo.address }}</span>
                </li>
                <li class="detail-container">
                  <span class="detail-name">Nonce:</span>
                  <span class="detail-text">{{ genInfo.nonce }}</span>
                </li>
                <li class="detail-container">
                  <span class="detail-name">Chain ID:</span>
                  <span class="detail-text"
                    >{{ genInfo.chainID }} ({{ genInfo.networkName }})</span
                  >
                </li>
                <li class="detail-container with-divider">
                  <span class="detail-name">Current Gas Price:</span>
                  <span class="detail-text"
                    >{{ toGwei(genInfo.gasPrice) }} Gwei</span
                  >
                </li>
                <li class="detail-container">
                  <span class="detail-name">Retrieved:</span>
                  <span class="detail-text">{{
                    dateTimeDisplay(genInfo.timestamp)
                  }}</span>
                </li>
                <li class="detail-container">
                  <span class="detail-name">at block:</span>
                  <span class="detail-text">{{ genInfo.blockNumber }}</span>
                </li>
              </ul>
            </div>
            <div v-show="informationGenerated" class="button-container">
              <a
                ref="generatedDownloadLink"
                :href="generatedJson"
                :download="exportFileName"
              >
                <standard-button
                  :options="{
                    title: 'Export JSON File',
                    buttonStyle: 'green-border',
                    noWalletTerms: true,
                    noMinWidth: true
                  }"
                />
              </a>

              <standard-button
                :options="{
                  title: 'Continue',
                  buttonStyle: 'green',
                  noWalletTerms: true,
                  rightArrow: true
                }"
                @click.native="stage2Btn"
              />
            </div>
          </accordion-menu>

          <!-- Paste/Upload Signed Tx-->
          <accordion-menu
            :greytitle="false"
            :isopen="stage3"
            :title="$t('withoutWallet.signedTx')"
            number="3"
            @titleClicked="stage3 = !stage3"
          >
            <textarea v-model="rawSigned" class="no-margin raw-tx-input" />
            <p v-if="invalidSignature">Invalid Signature</p>
            <p v-if="wrongNetwork && correctNetwork === ''">
              Signed Chain ID does not match chain id for selected network
            </p>
            <p v-if="wrongNetwork && correctNetwork !== ''">
              Signed Chain ID ({{ correctNetwork }}) does not match chain id for
              selected network
            </p>
            <expending-option title="Raw Transaction">
              <textarea
                :value="JSON.stringify(rawTx)"
                class="no-margin raw-tx-input"
                disabled
              />
            </expending-option>
            <div class="button-container">
              <input
                ref="jsonInput"
                type="file"
                name="file"
                style="display: none"
                @change="uploadFile"
              />
              <standard-button
                :options="{
                  title: 'Upload JSON File',
                  buttonStyle: 'green-border',
                  noWalletTerms: true,
                  noMinWidth: true
                }"
                @click.native="uploadClick()"
              />
              <standard-button
                :options="{
                  title: 'Continue',
                  buttonStyle: 'green',
                  noWalletTerms: true
                }"
                @click.native="stage3Btn"
              />
            </div>
          </accordion-menu>

          <!-- Review and Send-->
          <accordion-menu
            :greytitle="false"
            :editbutton="false"
            :isopen="stage4"
            :title="$t('withoutWallet.txDetails')"
            number="4"
            @titleClicked="stage4 = !stage4"
          >
            <ul>
              <li class="detail-container">
                <span class="detail-name">Sender:</span>
                <span class="detail-text">{{ from }}</span>
              </li>
              <li class="detail-container">
                <span class="detail-name">Receiver:</span>
                <span class="detail-text">{{ to }}</span>
              </li>
              <li class="detail-container">
                <span class="detail-name">Nonce:</span>
                <span class="detail-text">{{ nonce }}</span>
              </li>
              <li class="detail-container">
                <span class="detail-name">Value:</span>
                <span class="detail-text">
                  {{ toEth(value) }}
                  {{ selectedNetwork.type.currencyName }}
                </span>
              </li>
              <li class="detail-container">
                <span class="detail-name">Data:</span>
                <span v-if="data !== '0x'" class="detail-text">
                  {{ truncateData(data) }}
                  <span class="show-all-btn" @click="showAllData = !showAllData"
                    >Show All</span
                  >
                </span>
                <span v-else class="data-all">{{ data }}</span>
                <span v-if="showAllData" class="data-all">{{ data }}</span>
              </li>

              <li class="detail-container with-divider">
                <span class="detail-name">Chain ID:</span>
                <span class="detail-text"
                  >{{ chainID }} ({{ selectedNetwork.type.name_long }})</span
                >
              </li>
              <li class="detail-container">
                <span class="detail-name">Gas Limit:</span>
                <span class="detail-text">{{ gasLimit }}</span>
              </li>
              <li class="detail-container">
                <span class="detail-name">Gas Price:</span>
                <span class="detail-text">{{ toGwei(gasPrice) }} Gwei</span>
              </li>
              <li class="detail-container">
                <span class="detail-name">Fee:</span>
                <span class="detail-text">
                  {{ toEth(fee) }}
                  {{ selectedNetwork.type.currencyName }}
                  ($ {{ calculateCost(fee) }})
                </span>
              </li>
            </ul>
            <div class="button-container">
              <standard-button
                :options="{
                  title: 'Send',
                  buttonStyle: 'green',
                  noWalletTerms: true,
                  rightArrow: true
                }"
                @click.native="stage4Btn"
              />
            </div>
          </accordion-menu>

          <!-- Sent Tx Details & Hash-->
          <accordion-menu
            :greytitle="false"
            :editbutton="false"
            :isopen="stage5"
            :title="$t('withoutWallet.txStatus')"
            number="5"
            @titleClicked="stage5 = !stage5"
          >
            <ul v-if="error === ''">
              <li class="tx-hash-container">
                <p>Transaction Hash:</p>
                <a
                  :href="replaceUrl('', txHash)"
                  class="detail-text"
                  target="_blank"
                  rel="noopener noreferrer"
                  >{{ txHash }}</a
                >
              </li>
              <li class="tx-receipt-container">
                <p>Transaction Receipt:</p>
                <div
                  v-if="Object.keys(txReceipt).length > 0"
                  class="tx-receipt-items"
                >
                  <div
                    v-for="(item, idx) in Object.keys(txReceipt)"
                    :key="item + idx"
                  >
                    <span>{{ item }}</span>
                    <a
                      v-if="item === 'transactionHash'"
                      :href="replaceUrl('', txReceipt[item])"
                      target="_blank"
                      class="right-side"
                      >{{ txReceipt[item] }}</a
                    >
                    <a
                      v-else-if="item === 'contractAddress'"
                      :href="replaceUrl('address', txReceipt[item])"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="right-side"
                      >{{ txReceipt[item] }}</a
                    >
                    <span v-else class="right-side">{{ txReceipt[item] }}</span>
                  </div>
                </div>
                <div v-else class="loading">Loading....</div>
              </li>
            </ul>
            <div v-else>{{ error }}</div>
          </accordion-menu>
        </div>
      </div>
    </div>

    <confirmation-modal
      ref="offlineConfirm"
      :raw-tx="rawTx"
      :signed-tx="rawSigned"
      :env-details="envDetails"
    />
  </div>
</template>

<script>
import ethTx from 'ethereumjs-tx';
import { mapState } from 'vuex';
import Misc from '@/helpers/misc';
import BigNumber from 'bignumber.js';
import web3Utils from 'web3-utils';
import * as networkTypes from '@/networks/types';

import TitleTextContentsLayout from '@/layouts/InformationPages/Components/TitleTextContentsLayout';
import AccordionMenu from '@/components/AccordionMenu';
import DropDownAddressSelector from '@/components/DropDownAddressSelector';
import StandardButton from '@/components/Buttons/StandardButton';
import StandardInput from '@/components/StandardInput';
import ExpendingOption from '@/components/ExpendingOption';
import ConfirmationModal from './components/ConfirmationModal';

export default {
  components: {
    'page-title': TitleTextContentsLayout,
    'accordion-menu': AccordionMenu,
    'dropdown-address-selector': DropDownAddressSelector,
    'standard-button': StandardButton,
    'standard-input': StandardInput,
    'expending-option': ExpendingOption,
    'confirmation-modal': ConfirmationModal
  },
  data() {
    return {
      networkTypes: Object.values(networkTypes),
      selectedNetwork: this.$store.state.network,
      stage1: false, // Select Network
      stage2: true, // Generate Information
      stage3: false, // Enter/Upload Signed Transaction
      stage4: false, // Review and Send
      stage5: false, // Show Transaction Hash and Transaction Receipt
      showAllData: false,
      informationGenerated: false,
      downloadable: false,
      from: '0x',
      rawSigned: '',
      minAccountBalance: 0,
      fee: 0,
      nonce: 0,
      gasPrice: 0,
      gasLimit: 0,
      to: '0x',
      value: 0,
      data: '0x',
      chainID: 0,
      ethPrice: 0,
      genInfo: {
        address: '0x',
        gasPrice: 0,
        nonce: 0,
        chainID: this.$store.state.network.type.chainID,
        networkName: this.$store.state.network.type.name_long
      },
      generatedJson: {},
      file: '',
      exportFileName: 'Generated Information',
      //Error Flags
      invalidSignature: false,
      wrongNetwork: false,
      correctNetwork: '',
      txHash: '',
      txReceipt: {},
      error: ''
    };
  },
  computed: {
    ...mapState([
      'network',
      'Networks',
      'customPaths',
      'path',
      'web3',
      'wallet',
      'online'
    ]),
    reorderNetworkList() {
      return Misc.reorderNetworks();
    },
    networkTitle() {
      return `${this.selectedNetwork.type.name} - ${
        this.selectedNetwork.service
      } `;
    },
    rawTx() {
      return {
        from: this.from,
        nonce: this.nonce,
        gasPrice: this.toGwei(this.gasPrice),
        gasLimit: this.gasLimit,
        to: this.to,
        value: this.toEth(this.value),
        data: this.data,
        chainID: this.chainID
      };
    },
    envDetails() {
      return {
        network: this.selectedNetwork,
        ethPrice: this.ethPrice
      };
    }
  },
  watch: {
    rawSigned(newVal) {
      this.getTransactionDetails(newVal);
    }
  },
  mounted() {
    this.switchNetwork(this.$store.state.network);
    if (this.online) {
      this.fetchBalanceData();
    }
  },
  methods: {
    replaceUrl(type, hash) {
      if (type === 'address') {
        return this.network.type.blockExplorerAddr.replace('[[address]]', hash);
      }
      return this.network.type.blockExplorerTX.replace('[[txHash]]', hash);
    },
    stage1Btn() {
      this.stage1 = false;
      this.stage2 = true;
    },
    stage2Btn() {
      this.stage2 = false;
      this.stage3 = true;
    },
    stage3Btn() {
      this.stage3 = false;
      this.stage4 = true;
    },
    stage4Btn() {
      this.stage4 = false;
      this.stage5 = true;
      if (this.rawSigned !== '') {
        this.error = this.txHash = '';
        this.txReceipt = {};
        this.web3.eth
          .sendSignedTransaction(this.rawSigned)
          .once('transactionHash', hash => {
            this.txHash = hash;
          })
          .then(receipt => {
            this.txReceipt = receipt;
          })
          .catch(e => {
            this.error = e;
          });
      }
    },
    switchNetwork(network) {
      this.$store.dispatch('switchNetwork', network).then(() => {
        this.selectedNetwork = network;
        this.$store.dispatch('setWeb3Instance');
        this.stage1Btn();
        this.getTransactionDetails();
      });
    },
    truncateData(data) {
      if (!data) return '';
      return `${data.slice(0, 20)}...${data.slice(-10)}`;
    },
    getTransactionDetails(rawSigned) {
      const positions = {
        nonce: 0,
        gasPrice: 1,
        gasLimit: 2,
        to: 3,
        value: 4,
        data: 5,
        v: 6,
        r: 7,
        s: 8
      };
      if (rawSigned) this.rawSigned = rawSigned;
      if (this.rawSigned !== '') {
        const sanitizedRawSigned = Misc.sanitizeHex(this.rawSigned);
        const tx = new ethTx(sanitizedRawSigned);
        this.invalidSignature = !tx.verifySignature();
        this.chainID = tx.getChainId();
        this.wrongNetwork = !new BigNumber(
          this.selectedNetwork.type.chainID
        ).eq(new BigNumber(this.chainID));
        this.chainID = tx.getChainId();

        if (this.wrongNetwork) {
          const correctNetwork = this.networkTypes.filter(
            entry => entry.chainID === this.chainID
          );
          if (correctNetwork) this.correctNetwork = correctNetwork[0].name_long;
        }
        this.from = Misc.sanitizeHex(tx.getSenderAddress().toString('hex'));
        const asJson = tx.toJSON();
        this.to = asJson[positions.to];
        this.gasLimit = new BigNumber(asJson[positions.gasLimit]).toFixed();
        this.nonce = new BigNumber(asJson[positions.nonce]).toFixed();
        this.value = new BigNumber(asJson[positions.value]).toFixed();

        this.data = asJson[positions.data];
        this.minAccountBalance = tx.getUpfrontCost().toString();
        this.gasPrice = new BigNumber(
          Misc.sanitizeHex(tx.gasPrice.toString('hex'))
        ).toFixed();
        this.fee = new BigNumber(this.toGwei(this.gasPrice))
          .times(this.gasLimit)
          .toFixed();
      }
    },
    async fetchBalanceData() {
      const url = 'https://cryptorates.mewapi.io/ticker';
      const fetchValues = await fetch(url);
      const result = await fetchValues.json();
      const values = result.data;
      if (!values['ETH']) return 0;
      this.ethPrice = new BigNumber(values['ETH'].quotes.USD.price);
    },
    toEth(val) {
      if (!val || isNaN(val)) return 0;
      return web3Utils.fromWei(new BigNumber(val).toFixed(), 'ether');
    },
    toWei(val) {
      if (!val) return 0;
      return web3Utils.toWei(new BigNumber(val).toFixed(), 'gwei');
    },
    toGwei(val) {
      if (!val) return 0;
      return web3Utils.fromWei(new BigNumber(val).toFixed(), 'gwei');
    },
    dateTimeDisplay(unixTimeStamp) {
      return new Date(unixTimeStamp).toString();
    },
    calculateCost(inGwei) {
      const fromGweiToWei = this.toWei(inGwei);
      return new BigNumber(this.ethPrice)
        .times(this.toEth(fromGweiToWei))
        .precision(2, BigNumber.ROUND_UP)
        .toNumber();
    },
    async generateInformation(address) {
      if (address === '') return;
      this.genInfo.address = address;
      this.genInfo.gasPrice = await this.web3.eth.getGasPrice();
      this.genInfo.nonce = await this.web3.eth.getTransactionCount(address);
      this.genInfo.blockNumber = await this.web3.eth.getBlockNumber();
      this.genInfo.chainID = this.selectedNetwork.type.chainID;
      this.genInfo.timestamp = Date.now(); //;
      this.exportGeneratedInfo();
      this.informationGenerated = true;
    },
    exportGeneratedInfo() {
      const createBlob = (mime, str) => {
        const string = typeof str === 'object' ? JSON.stringify(str) : str;
        if (string === null) return '';
        const blob = new Blob([string], {
          type: mime
        });
        this.downloadable = true;
        return window.URL.createObjectURL(blob);
      };
      this.generatedJson = createBlob(this.genInfo, 'mime');
      this.exportFileName = `generated-offline-tx-${Date.now()}.json`;
    },
    uploadClick() {
      const jsonInput = this.$refs.jsonInput;
      jsonInput.value = '';
      jsonInput.click();
    },
    uploadFile(e) {
      const self = this;
      const reader = new FileReader();
      reader.onloadend = function(evt) {
        self.file = JSON.parse(evt.target.result);
        self.getTransactionDetails(self.file.rawTransaction);
      };
      reader.readAsBinaryString(e.target.files[0]);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SendOfflineHelper.scss';
</style>
