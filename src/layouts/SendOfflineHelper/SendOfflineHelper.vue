<template>
  <div class="send-offline-helper">
    <div class="wrap">
      <div class="page-title">
        <page-title :options="titleOptions" />
      </div>
      <div class="page-content-container">
        <div class="collapse-container">
          <accordion-menu
            :greytitle="false"
            :isopen="showNetwork"
            :title="$t('withoutWallet.selectNetwork')"
            :right-text="networkTitle"
            number="1"
            @titleClicked="showNetwork = !showNetwork"
          >
            <ul class="networks">
              <li
                v-for="(key, index) in Object.keys(reorderNetworkList)"
                :key="$router.path + key + index"
              >
                <div class="network-title">
                  <img :src="Networks[key][0].type.icon" />
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
                <accordion-menu
          :greytitle="false"
          :editbutton="true"
          :isopen="showGenerateInfo"
          :title="$t('withoutWallet.generateInfo')"
          number="2"
          @titleClicked="showGenerateInfo = !showGenerateInfo"
        >
          <dropdown-address-selector title="From Address" />
          <div class="button-container">
            <standard-button :options="buttonContinue" />
          </div>
        </accordion-menu>
        <accordion-menu
          :greytitle="false"
          :isopen="showSignedInput"
          :title="$t('withoutWallet.signedTx')"
          number="2"
          @titleClicked="showSignedInput = !showSignedInput"
        >
          <standard-input
            :options="inputSignedTx"
            @changedValue="getTransactionDetails($event)"
          />
          <p v-if="invalidSignature">Invalid Signature</p>
          <p v-if="wrongNetwork">
            Signed Chain ID does not match chain id for selected network
          </p>
          <expending-option title="Raw Transaction">
            <standard-input :options="inputRawTx" class="no-margin" />
          </expending-option>
          <div class="button-container">
            <standard-button :options="buttonUploadJson" />
            <standard-button
              :options="buttonSendTx"
              @click.native="
                showTxDetails = true;
                showSignedInput = false;
              "
            />
          </div>
        </accordion-menu>
        <accordion-menu
          :greytitle="false"
          :editbutton="true"
          :isopen="showTxDetails"
          :title="$t('withoutWallet.txDetails')"
          number="3"
          @titleClicked="showTxDetails = !showTxDetails"
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
              <span class="detail-text"> {{ nonce }} </span>
            </li>
            <li class="detail-container">
              <span class="detail-name">Value:</span>
              <span class="detail-text">
                {{ toEth(value) }} {{ selectedNetwork.type.name }}
              </span>
            </li>
            <li class="detail-container">
              <span class="detail-name">Data:</span>
              <span class="detail-text">
                {{ truncateData(data) }}
                <span class="show-all-btn" @click="showAllData = !showAllData">
                  Show All
                </span>
              </span>

              <span v-if="showAllData" class="data-all">{{ data }}</span>
            </li>

            <li class="detail-container with-divider">
              <span class="detail-name">Chain ID:</span>
              <span class="detail-text"
                >{{ chainId }} ({{ selectedNetwork.type.name_long }})</span
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
                {{ toEth(fee) }} {{ selectedNetwork.type.name }} ($
                {{ calculateCost(fee) }})
              </span>
            </li>
          </ul>
          <div class="button-container">
            <standard-button
              :options="buttonContinue"
              @click.native="showConfirmation()"
            />
          </div>
        </accordion-menu>
        <!--        <accordion-menu
          :greytitle="false"
          :editbutton="true"
          :isopen="showFee"
          :title="$t('withoutWallet.txFeeAndNonce')"
          number="3"
          @titleClicked="showFee = !showFee"
        >
          <standard-input
            :options="inputTxFee"
            @changedValue="gasLimit = $event"
          />
          <standard-input :options="inputNonce" />
          <div class="button-container">
            <standard-button :options="buttonContinue" />
          </div>
        </accordion-menu>-->

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
import { mapGetters } from 'vuex';
import Misc from '@/helpers/misc';
import BigNumber from 'bignumber.js';
import web3Utils from 'web3-utils';

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
      selectedNetwork: this.$store.state.network,
      showNetwork: false,
      showGenerateInfo: false,
      showFee: false,
      showTxDetails: false,
      showSignedInput: true,
      titleOptions: {
        title: 'Send Offline Helper',
        boldSubTitle: '',
        textContent: [
          'Customize actions, debug reveals, and more with this set of advance tools. Please be mindful of the capabilities and limitations of these tools before using.'
        ]
      },
      buttonContinue: {
        title: 'Continue',
        buttonStyle: 'green',
        noWalletTerms: true,
        rightArrow: true
      },
      buttonSendTx: {
        title: 'Continue',
        buttonStyle: 'green',
        noWalletTerms: true
      },
      buttonUploadJson: {
        title: 'Upload JSON File',
        buttonStyle: 'green-border',
        noWalletTerms: true,
        noMinWidth: true
      },
      inputTxFee: {
        title: this.$t('withoutWallet.txFee'),
        topTextInfo: '0.00031 ($1.34)',
        rightInputText: 'Gwei'
      },
      inputNonce: {
        title: this.$t('withoutWallet.nonce'),
        popover: 'Nonce is Nonce!'
      },
      inputSignedTx: {
        title: this.$t('withoutWallet.signedTx'),
        isTextarea: true,
        buttonClear: true,
        buttonCopy: true
      },
      inputRawTx: {
        isTextarea: true,
        buttonClear: true,
        buttonCopy: true
      },
      showAllData: false,
      invalidSignature: false,
      wrongNetwork: false,
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
      chainId: 0,
      ethPrice: 0
    };
  },
  computed: {
    ...mapGetters({
      network: 'network',
      Networks: 'Networks',
      customPaths: 'customPaths',
      path: 'path',
      web3: 'web3',
      wallet: 'wallet'
    }),
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
        chainId: this.chainId
      };
    },
    envDetails() {
      return {
        network: this.selectedNetwork,
        ethPrice: this.ethPrice
      };
    }
  },
  mounted() {
    this.fetchBalanceData();
  },
  methods: {
    switchNetwork(network) {
      this.$store.dispatch('switchNetwork', network).then(() => {
        this.selectedNetwork = network;
        this.$store.dispatch('setWeb3Instance');
        this.showNetwork = false;
        this.showGenerateInfo = true;
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
        const sanatizedRawSigned = Misc.sanitizeHex(this.rawSigned);
        const tx = new ethTx(sanatizedRawSigned);
        this.invalidSignature = !tx.verifySignature();
        this.chainId = tx.getChainId();
        this.wrongNetwork = !new BigNumber(
          this.selectedNetwork.type.chainID
        ).eq(new BigNumber(this.chainId));
        this.from = Misc.sanitizeHex(tx.getSenderAddress().toString('hex'));
        const asJson = tx.toJSON();
        this.to = asJson[positions.to];
        this.gasLimit = new BigNumber(asJson[positions.gasLimit]).toString();
        this.nonce = new BigNumber(asJson[positions.nonce]).toString();
        this.value = new BigNumber(asJson[positions.value]).toString();
        // this.data = asJson[positions.data];
        this.data =
          '0xf86d82021184b2d05e00825208947676e10eefc7311970a12387518442136ea14d81880de0b6b3a7640000802aa02e6304c2419f279bb50d224bd5387befd89f9bcc362cab96c20293745498f4aba07bb13b394265fcd71bf2b5eac7e3c5ed1923f5ccd1b700448027f9dd3edbfe17';

        this.chainId = tx.getChainId();

        this.minAccountBalance = tx.getUpfrontCost().toString();
        this.gasPrice = new BigNumber(
          Misc.sanitizeHex(tx.gasPrice.toString('hex'))
        ).toString();

        this.fee = new BigNumber(this.gasLimit).times(this.gasPrice).toString();
      }
    },
    showConfirmation() {
      this.$refs.offlineConfirm.$refs.sendOfflineConfirmation.show();
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
      if (!val) return 0;
      return web3Utils.fromWei(new BigNumber(val).toString());
    },
    toGwei(val) {
      if (!val) return 0;
      return web3Utils.fromWei(new BigNumber(val).toString(), 'gwei');
    },
    calculateCost(inWei) {
      return new BigNumber(this.ethPrice)
        .times(this.toEth(inWei))
        .precision(2, BigNumber.ROUND_UP)
        .toNumber();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SendOfflineHelper.scss';
</style>
