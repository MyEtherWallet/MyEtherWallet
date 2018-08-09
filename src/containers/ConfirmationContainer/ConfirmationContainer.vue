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
    console.log(this.$on('hide', () => {
      console.log('modal hidden') // todo remove dev item
    })) // todo remove dev item

    this.$eventHub.$on('signedTxDetails', (tx, signedDetails) => {
      this.parseRawTx(tx)
    })

    this.$eventHub.$on('showTxConfirmModal', (tx, signer, resolve, reject) => {
      this.parseRawTx(tx)
      console.log('showTxConfirmModal', resolve) // todo remove dev item
      console.log('signer', signer) // todo remove dev item

      this.responseFunction = resolve
      this.signer = signer

      this.confirmationModalOpen()
      // console.log(this.$refs.confirmationModals) // todo remove dev item
    })

    // this.$on.
  },
  methods: {
    confirmationModalOpen () {
      window.scrollTo(0, 0)
      console.log(this.$children[0].$refs.confirmation) // todo remove dev item
      // this.$emit('showConfirmModal', this.raw)
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
      console.log('signer', this.signer) // todo remove dev item

      this.signer(this.raw)
        .then(_response => {
          this.responseFunction(_response)
          console.log(this.$children[0].$refs.confirmation.onLeave) // todo remove dev item
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
