<template>
  <div>
    <confirm-modal :confirmSendTx="sendTx" :showSuccess="showSuccessModal" :signedTx="signedTx"
                   :fee="transactionFee"
                   :gasPrice="$store.state.gasPrice" :from="fromAddress"
                   :to="toAddress" :value="amount" :gas="gasLimit" :data="data"
                   :nonce="nonce + 1"></confirm-modal>
    <success-modal message="Sending Transaction" linkMessage="Close"></success-modal>
  </div>
</template>

<script>
import ConfirmModal from '@/components/ConfirmModal'
import SuccessModal from '@/components/SuccessModal'

export default {
  props: ['active', 'rawTx'],
  components: {
    'confirm-modal': ConfirmModal,
    'success-modal': SuccessModal
  },
  data () {
    return {
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
      signedTx: ''
    }
  },
  created () {
    this.$eventHub.$on('signedTxDetails', (tx, signedDetails) => {
      this.parseRawTx(tx)
    })

    this.$eventHub.$on('showTxConfirmModal', (tx, signer, resolve) => {
      this.parseRawTx(tx)
      this.responseFunction = resolve
      this.signer = signer(tx)
      this.confirmationModalOpen()
    })

    this.$eventHub.$on('showMessageConfirmModal', (data, signer, resolve) => {
      this.responseFunction = resolve
      this.signer = signer(data)
      this.confirmationModalOpen()
    })

    this.$on('bv::modal::hide', () => {
      console.log('modal hidden') // todo remove dev item

      this.reset()
    })
  },
  methods: {
    confirmationModalOpen () {
      window.scrollTo(0, 0)
      this.$children[0].$refs.confirmation.show()
    },
    showSuccessModal () {
      this.reset()
      this.$children[1].$refs.success.show()
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
    sendTx () {
      // this.signer(this.raw)
      this.signer
        .then(_response => {
          this.responseFunction(_response)
          this.$children[0].$refs.confirmation.hide()
          this.showSuccessModal()
        })
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
      this.signedTxObject = {}
      this.signedTx = ''
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
