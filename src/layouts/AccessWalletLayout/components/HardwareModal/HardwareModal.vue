<template>
  <b-modal
    ref="hardware"
    hide-footer
    class="bootstrap-modal modal-hardware"
    title="Access by Hardware"
    centered>
    <div class="d-block text-center">
      <ul
        ref="hardwareList"
        class="button-options hardware-button-options">
        <li
          :class="selected === 'ledger'? 'active': ''"
          @click="select('ledger')">
          <!--<img class="icon" :src="selected === 'ledger'? require('@/assets/images/icons/button-ledger.png') : require('@/assets/images/icons/button-ledger-hover.png')">-->
          <img
            class="icon"
            src="~@/assets/images/icons/button-ledger.png">
          <img
            class="icon-hover"
            src="~@/assets/images/icons/button-ledger-hover.png">
          <span>Ledger Wallet</span>
        </li>
        <li
          :class="selected === 'trezor'? 'active': ''"
          @click="select('trezor')">
          <img
            class="icon"
            src="~@/assets/images/icons/button-trezor.png">
          <img
            class="icon-hover"
            src="~@/assets/images/icons/button-trezor-hover.png">
          <span>Trezor</span>
        </li>
        <li
          :class="selected === 'bitbox'? 'active': ''"
          @click="select('bitbox')">
          <img
            class="icon"
            src="~@/assets/images/icons/button-bitbox.png">
          <img
            class="icon-hover"
            src="~@/assets/images/icons/button-bitbox-hover.png">
          <span>Digital Bitbox</span>
        </li>
        <li
          :class="selected === 'secalot'? 'active': ''"
          @click="select('secalot')">
          <img
            class="icon"
            src="~@/assets/images/icons/button-secalot.png">
          <img
            class="icon-hover"
            src="~@/assets/images/icons/button-secalot-hover.png">
          <span>Secalot</span>
        </li>
      </ul>
    </div>
    <div class="button-container">
      <!--<div class="mid-round-button-green-filled connection-button waiting-for-connection" v-on:click="networkAndAddressOpen">-->
      <!--<div class="mid-round-button-green-filled connection-button waiting-for-connection" @click="continueAccess">-->
      <div
        :class="[selected !== ''? 'enabled': 'disabled','mid-round-button-green-filled']"
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
import {
  LedgerWallet,
  TrezorWallet,
  DigitalBitboxWallet,
  SecalotWallet
} from '@/wallets';

export default {
  props: {
    networkAndAddressOpen: {
      type: Function,
      default: function() {}
    },
    hardwareWalletOpen: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {
      selected: ''
    };
  },
  mounted() {
    this.$refs.hardware.$on('hidden', () => {
      this.selected = '';
    });
  },
  methods: {
    continueAccess() {
      // todo The actual initiation of a hardware wallet should be moved to a specific file to reduce clutter here as the number of offerings increases
      // todo: and to allow for any specialized set-up steps a particular constructor/wallet may require
      switch (this.selected) {
        case 'ledger':
          LedgerWallet.unlock()
            .then(wallet => {
              this.$emit('hardwareWalletOpen', wallet);
            })
            .catch(_error => {
              // eslint-disable-next-line
              console.error(_error); // todo replace with proper error
            });
          break;
        case 'trezor':
          TrezorWallet.unlock()
            .then(wallet => {
              this.$emit('hardwareWalletOpen', wallet);
            })
            .catch(_error => {
              // eslint-disable-next-line
              console.error(_error); // todo replace with proper error
            });
          break;
        case 'bitbox':
          this.$emit('hardwareRequiresPassword', {
            walletConstructor: DigitalBitboxWallet,
            hardwareBrand: 'DigitalBitbox'
          });
          break;
        case 'secalot':
          this.$emit('hardwareRequiresPassword', {
            walletConstructor: SecalotWallet,
            hardwareBrand: 'Secalot'
          });
          break;
        default:
          // eslint-disable-next-line
          console.log('something not right'); // todo remove dev item
          break;
      }
    },
    select(ref) {
      if (this.selected !== ref) {
        this.selected = ref;
      } else {
        this.selected = '';
      }
    },
    hardwareButtonActivate(e) {
      const buttonEls = this.$refs.hardwareList.children;
      for (let i = 0; i < buttonEls.length; i++) {
        buttonEls[i].classList.remove('active');
      }

      e.target.classList.add('active');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'HardwareModal.scss';
</style>
