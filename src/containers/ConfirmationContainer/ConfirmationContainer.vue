<template>
  <div>
    <confirm-modal
      ref="confirmModal"
      :confirm-send-tx="sendTx"
      :signed-tx="signedTx"
      :fee="transactionFee"
      :is-hardware-wallet="isHardwareWallet"
      :gas-price="gasPrice"
      :from="fromAddress"
      :to="toAddress"
      :value="amount"
      :gas="gasLimit"
      :data="data"
      :nonce="nonce"
    />
    <confirm-collection-modal
      ref="confirmCollectionModal"
      :send-batch-transactions="sendBatchTransactions"
      :signed-array="signedArray"
      :un-signed-array="unSignedArray"
      :sending="sending"
    />
    <confirm-modal
      ref="offlineGenerateConfirmModal"
      :confirm-send-tx="generateTx"
      :signed-tx="signedTx"
      :fee="transactionFee"
      :is-hardware-wallet="isHardwareWallet"
      :gas-price="gasPrice"
      :from="fromAddress"
      :to="toAddress"
      :value="amount"
      :gas="gasLimit"
      :data="data"
      :nonce="nonce"
    />
    <confirm-sign-modal
      ref="signConfirmModal"
      :confirm-sign-message="messageReturn"
      :show-success="showSuccessModal"
      :message-to-sign="messageToSign"
      :signed-message="signedMessage"
      :is-hardware-wallet="isHardwareWallet"
      :from="fromAddress"
    />
    <success-modal
      ref="successModal"
      :message="successMessage"
      :link-message="linkMessage"
    />
    <error-modal
      ref="errorModal"
      :message="successMessage"
      :link-message="linkMessage"
    />
  </div>
</template>

<script>
import * as unit from 'ethjs-unit';
import BigNumber from 'bignumber.js';
import ConfirmModal from './components/ConfirmModal';
import ConfirmCollectionModal from './components/ConfirmCollectionModal';
import SuccessModal from './components/SuccessModal';
import ErrorModal from './components/ErrorModal';
import ConfirmSignModal from './components/ConfirmSignModal';
import { mapGetters } from 'vuex';
import PromiEvent from 'web3-core-promievent';

export default {
  components: {
    'confirm-modal': ConfirmModal,
    'confirm-collection-modal': ConfirmCollectionModal,
    'success-modal': SuccessModal,
    'error-modal': ErrorModal,
    'confirm-sign-modal': ConfirmSignModal
  },
  props: {
    active: {
      type: Boolean,
      default: false
    },
    rawTx: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      isHardwareWallet: false,
      responseFunction: null,
      advancedExpend: false,
      addressValid: true,
      amount: 0,
      amountValid: true,
      nonce: 0,
      gasLimit: 21000,
      data: '0x',
      gasAmount: this.gasPrice,
      parsedBalance: 0,
      toAddress: '',
      transactionFee: 0,
      selectedCurrency: { symbol: 'ETH', name: 'Ethereum' },
      raw: {},
      ens: {},
      signer: {},
      signedTxObject: {},
      signedTx: '',
      messageToSign: '',
      signedMessage: '',
      successMessage: 'Success',
      linkMessage: 'OK',
      dismissed: true,
      web3WalletHash: '',
      web3WalletRes: '',
      signedArray: [],
      txBatch: null,
      sending: false,
      unSignedArray: [],
      signCallback: {}
    };
  },
  computed: {
    ...mapGetters({
      gasPrice: 'gasPrice',
      wallet: 'wallet',
      web3: 'web3'
    }),
    fromAddress() {
      if (this.wallet) {
        return this.wallet.getChecksumAddressString();
      }
    }
  },
  watch: {
    web3WalletHash(newVal) {
      console.log('web3WalletHash', newVal); // todo remove dev item
      this.$store.dispatch('addNotification', [
        this.fromAddress,
        newVal,
        'Transaction Hash'
      ]);
      const pollReceipt = setInterval(() => {
        this.web3.eth.getTransactionReceipt(newVal).then(res => {
          if (res !== null) {
            this.web3WalletRes = res;
            this.showSuccessModal('Transaction sent!', 'Okay');
            clearInterval(pollReceipt);
          }
        });
      }, 500);
    },
    web3WalletRes(newVal) {
      console.log('web3WalletRes', newVal); // todo remove dev item
      this.$store.dispatch('addNotification', [
        this.fromAddress,
        newVal,
        'Transaction Receipt'
      ]);
    }
  },
  created() {
    this.$eventHub.$on('showSuccessModal', (message, linkMessage) => {
      if (!message) message = null;
      this.showSuccessModal(message, linkMessage);
    });

    this.$eventHub.$on('showTxConfirmModal', (tx, resolve) => {
      this.parseRawTx(tx);
      if (tx.hasOwnProperty('ensObj')) {
        delete tx['ensObj'];
      }

      this.isHardwareWallet = this.wallet.isHardware;
      this.responseFunction = resolve;
      this.successMessage = 'Sending Transaction';
      this.wallet.signTransaction(tx).then(_response => {
        this.signedTxObject = _response;
        this.signedTx = this.signedTxObject.rawTransaction;
      });

      this.confirmationModalOpen();
    });

    this.$eventHub.$on('showSendSignedTx', (tx, resolve) => {
      const newTx = new ethTx(tx);
      this.isHardwareWallet = this.wallet.isHardware;
      this.responseFunction = resolve;
      this.successMessage = 'Sending Transaction';
      this.signedTxObject = {
        rawTransaction: tx,
        tx: {
          to: `0x${newTx.to.toString('hex')}`,
          from: `0x${newTx.from.toString('hex')}`,
          value: `0x${newTx.value.toString('hex')}`,
          gas: `0x${newTx.gasPrice.toString('hex')}`,
          gasLimit: `0x${newTx.gasLimit.toString('hex')}`,
          data: `0x${newTx.data.toString('hex')}`,
          nonce: `0x${newTx.nonce.toString('hex')}`,
          v: `0x${newTx.v.toString('hex')}`,
          r: `0x${newTx.r.toString('hex')}`,
          s: `0x${newTx.s.toString('hex')}`
        }
      };
      this.signedTx = this.signedTxObject.rawTransaction;
      this.confirmationModalOpen();
    });

    this.$eventHub.$on('showWeb3Wallet', (tx, resolve) => {
      this.parseRawTx(tx);
      this.responseFunction = resolve;
      this.successMessage = 'Sending Transaction';
      this.wallet.signTransaction(tx).then(_response => {
        this.web3WalletHash = _response;
      });
      this.showSuccessModal(
        'Continue transaction with Web3 Wallet Provider.',
        'Close'
      );
    });

    this.$eventHub.$on(
      'showTxCollectionConfirmModal',
      async (tx, signCallback, isHardware) => {
        this.unSignedArray = [];
        this.unSignedArray = tx;

        if (!signCallback) signCallback = () => {};
        this.signCallback = signCallback;
        const popAndSign = async (origTxArray, signed) => {
          const txArray = [...origTxArray];

          if (signed === undefined) signed = [];
          const _signedTx = await this.wallet.signTransaction(txArray.shift());
          signed.push(_signedTx);
          if (txArray.length > 0) {
            return popAndSign(txArray, signed);
          }
          return signed;
        };

        this.confirmationCollectionModalOpen();
        this.signedArray = await popAndSign(tx);
      }
    );

    this.$eventHub.$on('showMessageConfirmModal', (data, resolve) => {
      this.responseFunction = resolve;
      this.messageToSign = data;
      this.wallet.signMessage(data).then(_response => {
        this.signedMessage = '0x' + _response.toString('hex');
      });
      this.signConfirmationModalOpen();
    });
  },
  mounted() {
    this.$refs.confirmModal.$refs.confirmation.$on('hidden', () => {
      if (this.dismissed) {
        this.reset();
      }
    });

    this.$refs.successModal.$refs.success.$on('hide', () => {
      this.successMessage = '';
      this.linkMessage = 'OK';
    });
  },
  methods: {
    confirmationModalOpen() {
      window.scrollTo(0, 0);
      this.$refs.confirmModal.$refs.confirmation.show();
    },
    confirmationCollectionModalOpen() {
      window.scrollTo(0, 0);
      this.$refs.confirmCollectionModal.$refs.confirmCollection.show();
    },
    confirmationOfflineGenerateModalOpen() {
      window.scrollTo(0, 0);
      this.$refs.offlineGenerateConfirmModal.$refs.confirmation.show();
    },
    signConfirmationModalOpen() {
      window.scrollTo(0, 0);
      this.$refs.signConfirmModal.$refs.signConfirmation.show();
    },
    showSuccessModal(message, linkMessage) {
      this.reset();
      if (message !== null) this.successMessage = message;
      if (linkMessage !== null) this.linkMessage = linkMessage;
      this.$refs.successModal.$refs.success.show();
    },
    showErrorModal(message, linkMessage) {
      this.reset();
      if (message !== null) this.successMessage = message;
      if (linkMessage !== null) this.linkMessage = linkMessage;
      this.$refs.errorModal.$refs.success.show();
    },
    parseRawTx(tx) {
      this.raw = tx;
      this.nonce = +tx.nonce;
      this.data = tx.data;
      this.gasLimit = +tx.gas;
      this.toAddress = tx.to;
      this.amount = +tx.value;
      this.transactionFee = Number(
        unit.fromWei(
          new BigNumber(tx.gasPrice).times(tx.gas).toString(),
          'ether'
        )
      );
      this.ens = {};
      if (tx.hasOwnProperty('ensObj')) {
        this.ens = Object.assign({}, tx.ensObj);
      }
    },
    messageReturn() {
      this.dismissed = false;
      this.responseFunction(this.signedMessage);
      this.$refs.signConfirmModal.$refs.signConfirmation.hide();
      this.showSuccessModal();
    },
    generateTx() {
      this.dismissed = false;
      this.responseFunction(this.signedTxObject);
      this.$refs.confirmModal.$refs.confirmation.hide();
    },
    async sendBatchTransactions() {
      const web3 = this.web3;
      const batch = new web3.eth.BatchRequest();
      const promises = this.signedArray.map(tx => {
        return new Promise((res, rej) => {
          const _tx = tx.tx;
          const req = web3.eth.sendSignedTransaction.request(
            tx.rawTransaction,
            (err, data) => {
              console.log(err, data); // todo remove dev item
              // was falling through on success
              if (err !== null) {
                this.$store.dispatch('addNotification', [
                  'Error',
                  this.unSignedArray.find(entry => _tx.nonce === entry.nonce),
                  err
                ]);
                this.showErrorModal('Transaction Error!', 'Return');
                rej(err);
              }

              // was falling through on error
              if (err === null) {
                console.log('NO ERROR'); // todo remove dev item
                this.$store
                  .dispatch('addNotification', [
                    'Batch_Hash',
                    this.unSignedArray.find(entry => _tx.nonce === entry.nonce),
                    data
                  ])
                  .then(() => {
                    this.showSuccessModal('Transaction sent!', 'Okay');
                  });

                const pollReceipt = setInterval(() => {
                  if (data == undefined) clearInterval(pollReceipt);
                  web3.eth.getTransactionReceipt(data).then(res => {
                    if (res !== null) {
                      this.$store.dispatch('addNotification', [
                        'Batch_Receipt',
                        this.unSignedArray.find(
                          entry => _tx.nonce === entry.nonce
                        ),
                        res
                      ]);
                      clearInterval(pollReceipt);
                    }
                  });
                }, 500);
                res(data);
              }
            }
          );
          batch.add(req);
        });
      });

      this.signCallback(promises);
      batch.execute();
      this.sending = true;
    },
    sendTx() {
      this.dismissed = false;
      this.responseFunction(this.signedTxObject);
      this.$refs.confirmModal.$refs.confirmation.hide();
      if (this.raw.generateOnly) return;
      this.showSuccessModal('Transaction sent!', 'Okay');
    },
    reset() {
      this.responseFunction = null;
      this.advancedExpend = false;
      this.addressValid = true;
      this.amount = 0;
      this.amountValid = true;
      this.nonce = 0;
      this.gasLimit = 21000;
      this.data = '0x';
      this.gasAmount = this.gasPrice;
      this.parsedBalance = 0;
      this.toAddress = '';
      this.transactionFee = 0;
      this.selectedCurrency = { symbol: 'ETH', name: 'Ethereum' };
      this.raw = {};
      this.signedTx = '';
      this.messageToSign = '';
      this.signedMessage = '';
      this.messageToSign = '';
      this.signedArray = [];
      this.web3WalletHash = '';
      this.web3WalletRes = '';
      this.txBatch = null;
      this.sending = false;
      this.signCallback = {};
    }
  }
};
</script>

<style scoped></style>
