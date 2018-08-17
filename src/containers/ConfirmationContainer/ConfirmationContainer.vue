<template>
  <div>
    <confirm-modal ref="confirmModal" :confirmSendTx="sendTx" :showSuccess="showSuccessModal"
                   :signedTx="signedTx"
                   :fee="transactionFee" :isHardwareWallet="isHardwareWallet"
                   :gasPrice="$store.state.gasPrice" :from="fromAddress"
                   :to="toAddress" :value="amount" :gas="gasLimit" :data="data"
                   :nonce="nonce + 1"></confirm-modal>
    <confirm-sign-modal ref="signConfirmModal" :confirmSignMessage="messageReturn"
                        :showSuccess="showSuccessModal" :messageToSign="messageToSign" :signedMessage="signedMessage"
                        :isHardwareWallet="isHardwareWallet"
                        :from="fromAddress"
    ></confirm-sign-modal>
    <success-modal ref="successModal" message="" linkMessage="Close"></success-modal>
  </div>
</template>

<script>
import ConfirmModal from './components/ConfirmModal'
import SuccessModal from './components/SuccessModal'
import ConfirmSignModal from './components/ConfirmSignModal'

export default {
  props: ['active', 'rawTx'],
  components: {
    'confirm-modal': ConfirmModal,
    'success-modal': SuccessModal,
    'confirm-sign-modal': ConfirmSignModal
  },
  data () {
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
      gasAmount: this.$store.state.gasPrice,
      parsedBalance: 0,
      toAddress: '',
      transactionFee: 0,
      selectedCurrency: {symbol: 'ETH', name: 'Ethereum'},
      raw: {},
      signer: {},
      signedTxObject: {},
      signedTx: '',
      messageToSign: '',
      signedMessage: '',
      successMessage: '',
      dismissed: true
    }
  },
  created () {
    this.$eventHub.$on('showSuccessModal', (message) => {
      if (!message) message = null
      this.showSuccessModal(message)
    })

    this.$eventHub.$on('showTxConfirmModal', (tx, isHardware, signer, resolve) => {
      this.parseRawTx(tx)
      this.isHardwareWallet = isHardware
      this.responseFunction = resolve
      this.successMessage = 'Sending Transaction'
      // this.signer = signer(tx)
      signer(tx)
        .then(_response => {
          this.signedTxObject = _response
          this.signedTx = this.signedTxObject.rawTransaction
        })
      this.confirmationModalOpen()
    })

    this.$eventHub.$on('showMessageConfirmModal', (data, isHardware, signer, resolve) => {
      this.responseFunction = resolve
      this.messageToSign = data
      signer(data)
        .then(_response => {
          this.signedMessage = _response
        })
      // this.signer = signer(data)
      this.signConfirmationModalOpen()
    })

    this.$on('bv::modal::hide', () => {
      console.log('modal hidden') // todo remove dev item
      if (this.dismissed) {
        this.reset()
      }
    })
  },
  methods: {
    confirmationModalOpen () {
      window.scrollTo(0, 0)
      this.$refs.confirmModal.$refs.confirmation.show()
    },
    signConfirmationModalOpen () {
      window.scrollTo(0, 0)
      this.$refs.signConfirmModal.$refs.signConfirmation.show()
    },
    showSuccessModal (message) {
      this.$refs.successModal.$refs.success.$on('hide', () => {
        this.successMessage = ''
        console.log('success modal hidden') // todo remove dev item
      })
      this.reset()
      if (message !== null) this.successMessage = message
      this.$refs.successModal.$refs.success.show()
    },
    parseRawTx (tx) {
      this.raw = tx
      this.nonce = tx.nonce
      this.data = tx.data
      this.gasLimit = tx.gas
      this.toAddress = tx.to
      this.amount = tx.value
      // this.signedTx = this.signedTxObject.rawTransaction
    },
    messageReturn () {
      this.dismissed = false
      this.responseFunction(this.signedMessage)
      this.$refs.signConfirmModal.$refs.signConfirmation.hide()
      this.showSuccessModal()
    },
    sendTx () {
      this.dismissed = false
      this.responseFunction(this.signedTxObject)
      this.$refs.confirmModal.$refs.confirmation.hide()
      this.showSuccessModal()
    },
    reset () {
      this.responseFunction = null
      this.advancedExpend = false
      this.addressValid = true
      this.amount = 0
      this.amountValid = true
      this.nonce = 0
      this.gasLimit = 21000
      this.data = '0x'
      this.gasAmount = this.$store.state.gasPrice
      this.parsedBalance = 0
      this.toAddress = ''
      this.transactionFee = 0
      this.selectedCurrency = {symbol: 'ETH', name: 'Ethereum'}
      this.raw = {}
      this.signedTx = ''
      this.messageToSign = ''
      this.signedMessage = ''
      this.messageToSign = ''
    }
  },
  computed: {
    fromAddress () {
      if (this.$store.state.wallet) {
        return this.$store.state.wallet.getAddressString()
      }
    }
  }
}
</script>

<style scoped>

</style>
