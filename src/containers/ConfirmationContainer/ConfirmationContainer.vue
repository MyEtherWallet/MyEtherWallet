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
      :is-hardware-wallet="isHardwareWallet"
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
      :link-to="linkTo"
      :etherscan-link="etherscanLink"
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
import * as ethTx from 'ethereumjs-tx';
import ConfirmModal from './components/ConfirmModal';
import ConfirmCollectionModal from './components/ConfirmCollectionModal';
import SuccessModal from './components/SuccessModal';
import ErrorModal from './components/ErrorModal';
import ConfirmSignModal from './components/ConfirmSignModal';
import { mapGetters } from 'vuex';
import { type as noticeTypes } from '@/helpers/notificationFormatters';
import { WEB3_WALLET, KEEPKEY } from '@/wallets/bip44/walletTypes';
import { Toast, Misc } from '@/helpers';
import locStore from 'store';

const events = {
  showSuccessModal: 'showSuccessModal',
  showErrorModal: 'showErrorModal',
  showTxConfirmModal: 'showTxConfirmModal',
  showSendSignedTx: 'showSendSignedTx',
  showWeb3Wallet: 'showWeb3Wallet',
  showTxCollectionConfirmModal: 'showTxCollectionConfirmModal',
  showMessageConfirmModal: 'showMessageConfirmModal'
};

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
      advancedExpand: false,
      addressValid: true,
      amount: '',
      amountValid: true,
      nonce: '',
      gasLimit: '21000',
      data: '0x',
      gasAmount: this.gasPrice,
      parsedBalance: 0,
      toAddress: '',
      transactionFee: '',
      raw: {},
      lastRaw: {},
      ens: {},
      signer: {},
      signedTxObject: {},
      signedTx: '',
      messageToSign: '',
      signedMessage: '',
      successMessage: 'Success',
      linkMessage: 'OK',
      linkTo: '/',
      etherscanLink: null,
      dismissed: true,
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
      web3: 'web3',
      account: 'account',
      network: 'network'
    }),
    fromAddress() {
      if (this.account) {
        return this.account.address;
      }
    }
  },
  beforeDestroy() {
    Object.values(events).forEach(evt => {
      this.$eventHub.$off(evt);
    });
  },
  created() {
    this.$eventHub.$on(
      'showSuccessModal',
      (message, linkMessage, etherscanLink) => {
        if (!message) message = null;
        this.showSuccessModal(message, linkMessage, etherscanLink);
      }
    );

    this.$eventHub.$on('showErrorModal', (message, linkMessage) => {
      if (!message) message = null;
      this.showErrorModal(message, linkMessage);
    });

    this.$eventHub.$on('showTxConfirmModal', (tx, resolve) => {
      this.parseRawTx(tx);
      if (tx.hasOwnProperty('ensObj')) {
        delete tx['ensObj'];
      }
      this.isHardwareWallet = this.account.isHardware;
      this.responseFunction = resolve;
      this.successMessage = 'Sending Transaction';

      const signPromise = this.wallet.signTransaction(tx);

      signPromise
        .then(_response => {
          this.signedTxObject = _response;
          this.signedTx = this.signedTxObject.rawTransaction;
        })
        .catch(this.wallet.errorHandler);
      if (this.account.identifier === KEEPKEY) {
        signPromise.then(() => {
          this.confirmationModalOpen();
        });
      } else {
        this.confirmationModalOpen();
      }
    });

    this.$eventHub.$on('showSendSignedTx', (tx, resolve) => {
      const newTx = new ethTx(tx);
      this.isHardwareWallet = this.account.isHardware;
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
      this.parseRawTx(this.signedTxObject.tx);
      this.signedTx = this.signedTxObject.rawTransaction;
      this.confirmationModalOpen();
    });

    this.$eventHub.$on('showWeb3Wallet', (tx, resolve) => {
      this.parseRawTx(tx);
      this.responseFunction = resolve;
      this.successMessage = 'Sending Transaction';
      this.wallet
        .signTransaction(tx)
        .once('transactionHash', hash => {
          this.$store
            .dispatch('addNotification', [
              noticeTypes.TRANSACTION_HASH,
              this.fromAddress,
              this.lastRaw,
              hash
            ])
            .then(() => {
              this.showSuccessModal('Transaction sent!', 'Okay');
            });
        })
        .on('receipt', receipt => {
          this.$store.dispatch('addNotification', [
            noticeTypes.TRANSACTION_RECEIPT,
            this.fromAddress,
            this.lastRaw,
            receipt
          ]);
        })
        .on('error', err => {
          this.$store.dispatch('addNotification', [
            noticeTypes.TRANSACTION_ERROR,
            this.fromAddress,
            this.lastRaw,
            err
          ]);
        })
        .catch(err => {
          Toast.responseHandler(err, Toast.ERROR);
        });
      this.showSuccessModal(
        'Continue transaction with Web3 Wallet Provider.',
        'Close'
      );
    });

    this.$eventHub.$on(
      'showTxCollectionConfirmModal',
      async (tx, signCallback, isHardware) => {
        this.isHardwareWallet = isHardware;
        this.unSignedArray = [];
        this.unSignedArray = tx;
        const signed = [];
        if (!signCallback) signCallback = () => {};
        this.signCallback = signCallback;

        this.confirmationCollectionModalOpen();
        if (this.account.identifier !== WEB3_WALLET) {
          for (let i = 0; i < tx.length; i++) {
            const _signedTx = await this.wallet.signTransaction(tx[i]);
            signed.push(_signedTx);
          }
          this.signedArray = signed;
        } else {
          this.signedArray = this.unSignedArray.map(_tx => {
            return { tx: _tx, rawTransaction: _tx };
          });
        }
      }
    );

    this.$eventHub.$on('showMessageConfirmModal', (data, resolve) => {
      this.responseFunction = resolve;
      this.messageToSign = data;
      const signPromise = this.wallet.signMessage(data).then(_response => {
        this.signedMessage = '0x' + _response.toString('hex');
      });
      if (this.account.identifier === KEEPKEY) {
        signPromise.then(() => {
          this.signConfirmationModalOpen();
        });
      } else {
        this.signConfirmationModalOpen();
      }
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
    showSuccessModal(message, linkMessage, etherscanLink) {
      this.reset();
      if (message !== null) this.successMessage = message;
      if (linkMessage !== null) this.linkMessage = linkMessage;
      if (etherscanLink !== null) this.etherscanLink = etherscanLink;
      this.$refs.successModal.$refs.success.show();
    },
    showErrorModal(message, linkMessage) {
      this.reset();
      if (message !== null) this.successMessage = message;
      if (linkMessage !== null) this.linkMessage = linkMessage;
      this.$refs.errorModal.$refs.errorModal.show();
    },
    parseRawTx(tx) {
      this.raw = tx;
      this.nonce = tx.nonce === '0x' ? 0 : new BigNumber(tx.nonce).toFixed();
      this.data = tx.data;
      this.gasLimit = new BigNumber(tx.gas).toFixed();
      this.toAddress = tx.to;
      this.amount =
        tx.value === '0x' ? '0' : new BigNumber(tx.value).toString();
      this.transactionFee = unit
        .fromWei(new BigNumber(tx.gas).times(tx.gasPrice).toString(), 'ether')
        .toString();
      this.ens = {};
      if (tx.hasOwnProperty('ensObj')) {
        this.ens = Object.assign({}, tx.ensObj);
      }
      this.lastRaw = tx;
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
    async doBatchTransactions() {
      const web3 = this.web3;
      const _method =
        this.account.identifier === WEB3_WALLET
          ? 'sendTransaction'
          : 'sendSignedTransaction';
      const _arr =
        this.account.identifier === WEB3_WALLET
          ? this.signedArray.reverse()
          : this.signedArray;
      const promises = _arr.map(tx => {
        const _tx = tx.tx;
        _tx.from = this.account.address;
        const _rawTx = tx.rawTransaction;
        const onError = err => {
          this.$store.dispatch('addNotification', [
            noticeTypes.TRANSACTION_ERROR,
            _tx.from,
            this.unSignedArray.find(entry =>
              new BigNumber(_tx.nonce).eq(entry.nonce)
            ) || _tx,
            err
          ]);
          Toast.responseHandler(err, Toast.ERROR);
        };
        const promiEvent = web3.eth[_method](_rawTx);
        promiEvent.catch(onError);
        promiEvent.on('error', onError);
        promiEvent.once('transactionHash', hash => {
          this.showSuccessModal(
            'Transaction sent!',
            'Okay',
            this.network.type.blockExplorerTX.replace('[[txHash]]', hash)
          );
          this.$store.dispatch('addNotification', [
            noticeTypes.TRANSACTION_HASH,
            _tx.from,
            this.unSignedArray.find(entry =>
              new BigNumber(_tx.nonce).eq(entry.nonce)
            ),
            hash
          ]);
          const localStoredObj = locStore.get(
            web3.utils.sha3(this.account.address)
          );
          locStore.set(web3.utils.sha3(this.account.address), {
            nonce: Misc.sanitizeHex(
              new BigNumber(localStoredObj.nonce).plus(1).toString(16)
            ),
            timestamp: localStoredObj.timestamp
          });
        });
        promiEvent.then(receipt => {
          this.$store.dispatch('addNotification', [
            noticeTypes.TRANSACTION_RECEIPT,
            _tx.from,
            this.unSignedArray.find(entry =>
              new BigNumber(_tx.nonce).eq(entry.nonce)
            ),
            receipt
          ]);
        });
        return promiEvent;
      });
      this.signCallback(promises);
      this.sending = true;
    },
    sendBatchTransactions() {
      this.$refs.confirmCollectionModal.$refs.confirmCollection.hide();
      this.doBatchTransactions();
    },
    sendTx() {
      this.dismissed = false;
      this.responseFunction(this.signedTxObject);
      this.$refs.confirmModal.$refs.confirmation.hide();

      if (this.raw.generateOnly) return;
      this.showSuccessModal(
        'Transaction sent!',
        'Okay',
        this.network.type.blockExplorerTX.replace(
          '[[txHash]]',
          this.signedTxObject.tx.hash
        )
      );
    },
    reset() {
      this.responseFunction = null;
      this.advancedExpand = false;
      this.addressValid = true;
      this.amount = '';
      this.amountValid = true;
      this.nonce = '';
      this.gasLimit = '21000';
      this.data = '0x';
      this.gasAmount = this.gasPrice;
      this.parsedBalance = 0;
      this.toAddress = '';
      this.transactionFee = '';
      this.raw = {};
      this.signedTx = '';
      this.messageToSign = '';
      this.signedMessage = '';
      this.messageToSign = '';
      this.signedArray = [];
      this.txBatch = null;
      this.sending = false;
      this.signCallback = {};
    }
  }
};
</script>
