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
            <li>Sender: {{ senderAddress }}</li>
            <li>Nonce: {{ nonce }}</li>
            <li>Value: {{ value }} {{ selectedNetwork.type.name }}</li>
            <li>Data: {{ data }}</li>
            <li>Chain ID: {{ chainId }}</li>
            <li>Fee: {{ fee }}</li>
            <li>Gas Limit: {{ gasLimit }}</li>
            <li>Gas Price: {{ gasPrice }}</li>
          </ul>
          <standard-input
            :options="inputTxFee"
            @changedValue="gasLimit = $event"
          />
          <standard-input :options="inputNonce" />
          <div class="button-container">
            <standard-button :options="buttonContinue" />
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
      </div>
    </div>

    <confirmation-modal ref="offlineConfirm" />
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
      invalidSignature: false,
      wrongNetwork: false,
      senderAddress: '',
      rawSigned: '',
      minAccountBalance: 0,
      fee: 0,
      nonce: 0,
      gasPrice: 0,
      gasLimit: 0,
      to: '0x',
      value: 0,
      data: '0x',
      chainId: 0
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
    }
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
      console.log('getTransactionDetails'); // todo remove dev item
      if (this.rawSigned !== '') {
        const sanatizedRawSigned = Misc.sanitizeHex(this.rawSigned);
        const tx = new ethTx(sanatizedRawSigned);
        this.invalidSignature = !tx.verifySignature();
        this.chainId = tx.getChainId();
        this.wrongNetwork = !new BigNumber(
          this.selectedNetwork.type.chainID
        ).eq(new BigNumber(this.chainId));
        this.senderAddress = Misc.sanitizeHex(
          tx.getSenderAddress().toString('hex')
        );
        const asJson = tx.toJSON();
        console.log(tx.toJSON()); // todo remove dev item
        this.gasLimit = new BigNumber(asJson[positions.gasLimit]).toString();
        this.nonce = new BigNumber(asJson[positions.nonce]).toString();
        this.value = web3Utils.fromWei(
          new BigNumber(asJson[positions.value]).toString()
        );
        this.data = asJson[positions.data];

        this.chainId = tx.getChainId();
        this.minAccountBalance = tx.getUpfrontCost().toString();
        this.gasPrice = web3Utils.fromWei(
          new BigNumber(
            Misc.sanitizeHex(tx.gasPrice.toString('hex'))
          ).toString(),
          'gwei'
        );
        this.fee = new BigNumber(this.gasLimit).times(this.gasPrice).toString();
        console.log(this.senderAddress); // todo remove dev item
        console.log(tx); // todo remove dev item
      }
    },
    sendTransaction() {
      this.$refs.offlineConfirm.$refs.sendOfflineConfirmation.show();
    },
    async fetchBalanceData() {
      const url = 'https://cryptorates.mewapi.io/convert/ETH';
      const fetchValues = await fetch(url);
      const values = await fetchValues.json();
      if (!values['DAI']) return 0;
      this.ethPrice = new BigNumber(values['DAI']);
    },
  }
};
</script>

<style lang="scss" scoped>
@import 'SendOfflineHelper.scss';
</style>
