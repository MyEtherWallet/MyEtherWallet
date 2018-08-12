<template>
  <b-modal ref="hardware" hide-footer class="bootstrap-modal modal-hardware"
           title="Access by Hardware" centered>
    <div class="d-block text-center">
      <ul class="button-options hardware-button-options" ref="hardwareList">
        <li @click="select('ledger')" :class="selected === 'ledger'? 'active': ''">
          <!--<img class="icon" :src="selected === 'ledger'? require('@/assets/images/icons/button-ledger.png') : require('@/assets/images/icons/button-ledger-hover.png')">-->
          <img class="icon" src="~@/assets/images/icons/button-ledger.png">
          <img class="icon-hover" src="~@/assets/images/icons/button-ledger-hover.png">
          <span>Ledger Wallet</span>
        </li>
        <li @click="select('trezor')" :class="selected === 'trezor'? 'active': ''">
          <img class="icon" src="~@/assets/images/icons/button-trezor.png">
          <img class="icon-hover" src="~@/assets/images/icons/button-trezor-hover.png">
          <span>Trezor</span>
        </li>
        <li @click="select('bitbox')" :class="selected === 'bitbox'? 'active': ''">
          <img class="icon" src="~@/assets/images/icons/button-bitbox.png">
          <img class="icon-hover" src="~@/assets/images/icons/button-bitbox-hover.png">
          <span>Digital Bitbox</span>
        </li>
        <li @click="select('secalot')" :class="selected === 'secalot'? 'active': ''">
          <img class="icon" src="~@/assets/images/icons/button-secalot.png">
          <img class="icon-hover" src="~@/assets/images/icons/button-secalot-hover.png">
          <span>Secalot</span>
        </li>
      </ul>
    </div>
    <div class="button-container">
      <!--<div class="mid-round-button-green-filled connection-button waiting-for-connection" v-on:click="networkAndAddressOpen">-->
      <!--<div class="mid-round-button-green-filled connection-button waiting-for-connection" @click="continueAccess">-->
      <div :class="[selected !== ''? 'enabled': 'disabled','mid-round-button-green-filled']"
           @click="continueAccess">
        Please Connect With Your Device
      </div>
    </div>
    <div class="support">
      <router-link to="/">
        <div class="support-content">
          <div class="support-icon"><img src="~@/assets/images/icons/help-center.svg"></div>
          <div class="support-label"><h5>Customer Support</h5></div>
        </div>
      </router-link>
    </div>
  </b-modal>
</template>

<script>
import { LedgerWallet, TrezorWallet } from '@/helpers/web3-overide/hardware'

export default {
  props: ['networkAndAddressOpen', 'hardwareWalletOpen'],
  data () {
    return {
      selected: ''
    }
  },
  methods: {
    continueAccess () {
      let wallet = null
      // todo The actual initiation of a hardware wallet should be moved to a specific file to reduce clutter here as the number of offerings increases
      // todo: and to allow for any specialized set-up steps a particular constructor/wallet may require
      switch (this.selected) {
        case 'ledger':
          wallet = new LedgerWallet()
          this.$emit('hardwareWalletOpen', wallet)
          console.log(wallet) // todo remove dev item
          break
        case 'trezor':
          wallet = new TrezorWallet()
          wallet.decryptWallet()
            .then(() => {
              console.log(wallet) // todo remove dev item
              this.$emit('hardwareWalletOpen', wallet)
            })
            .catch((_error) => {
              console.error(_error) // todo replace with proper error
            })
          break
        default:
          console.log('something not right') // todo remove dev item
          break
      }
    },
    select (ref) {
      console.log(this.e) // todo remove dev item
      if (this.selected !== ref) {
        this.selected = ref
      } else {
        this.selected = ''
      }
    },
    hardwareButtonActivate (e) {
      const buttonEls = this.$refs.hardwareList.children
      for (var i = 0; i < buttonEls.length; i++) {
        console.log(buttonEls[i]) // todo remove dev item
        buttonEls[i].classList.remove('active')
      }

      e.target.classList.add('active')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "HardwareModal.scss";
</style>
