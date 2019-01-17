<template>
  <b-modal
    ref="hardware"
    :title="$t('accessWallet.accessByHardware')"
    hide-footer
    class="bootstrap-modal modal-hardware nopadding"
    centered
  >
    <div class="modal-content-container">
      <div class="d-block text-center">
        <b-alert :show="mayNotBeAttached" fade variant="warning"
          >Please make sure your device is connected</b-alert
        >
        <ul ref="hardwareList" class="button-options hardware-button-options">
          <li
            :class="selected === 'ledger' ? 'active' : ''"
            @click="select('ledger')"
          >
            <img class="icon" src="~@/assets/images/icons/button-ledger.png" />
            <img
              class="icon-hover"
              src="~@/assets/images/icons/button-ledger-hover.png"
            />
            <span>Ledger Wallet</span>
          </li>
          <li
            :class="selected === 'bitbox' ? 'active' : ''"
            @click="select('bitbox')"
          >
            <img class="icon" src="~@/assets/images/icons/button-bitbox.png" />
            <img
              class="icon-hover"
              src="~@/assets/images/icons/button-bitbox-hover.png"
            />
            <span>Digital Bitbox</span>
          </li>
          <li
            :class="selected === 'secalot' ? 'active' : ''"
            @click="select('secalot')"
          >
            <img class="icon" src="~@/assets/images/icons/button-secalot.png" />
            <img
              class="icon-hover"
              src="~@/assets/images/icons/button-secalot-hover.png"
            />
            <span>Secalot</span>
          </li>
          <li
            :class="selected === 'trezor' ? 'active' : ''"
            @click="select('trezor')"
          >
            <img class="icon" src="~@/assets/images/icons/button-trezor.png" />
            <img
              class="icon-hover"
              src="~@/assets/images/icons/button-trezor-hover.png"
            />
            <span>Trezor</span>
          </li>
          <li
            :class="selected === 'keepkey' ? 'active' : ''"
            @click="select('keepkey')"
          >
            <img class="icon" src="~@/assets/images/icons/button-keepkey.png" />
            <img
              class="icon-hover"
              src="~@/assets/images/icons/button-keepkey-hover.png"
            />
            <span>KeepKey</span>
          </li>
        </ul>
      </div>
      <div class="button-container">
        <div
          :class="[
            selected !== '' ? 'enabled' : 'disabled',
            'mid-round-button-green-filled'
          ]"
          @click="continueAccess"
        >
          {{ $t('accessWallet.accessDeviceAddresses') }}
        </div>
      </div>
      <customer-support />
    </div>
  </b-modal>
</template>

<script>
import CustomerSupport from '@/components/CustomerSupport';
import {
  LedgerWallet,
  KeepkeyWallet,
  TrezorWallet,
  BitBoxWallet,
  SecalotWallet
} from '@/wallets';
export default {
  components: {
    'customer-support': CustomerSupport
  },
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
      selected: '',
      mayNotBeAttached: false
    };
  },
  mounted() {
    this.$refs.hardware.$on('hidden', () => {
      this.selected = '';
    });
  },
  methods: {
    continueAccess() {
      const showPluggedInReminder = setTimeout(() => {
        this.mayNotBeAttached = true;
      }, 1000);
      switch (this.selected) {
        case 'ledger':
          LedgerWallet().then(_newWallet => {
            clearTimeout(showPluggedInReminder);
            this.$emit('hardwareWalletOpen', _newWallet);
          });
          break;
        case 'trezor':
          TrezorWallet().then(_newWallet => {
            clearTimeout(showPluggedInReminder);
            this.$emit('hardwareWalletOpen', _newWallet);
          });
          break;
        case 'bitbox':
          this.$emit('hardwareRequiresPassword', {
            walletConstructor: BitBoxWallet,
            hardwareBrand: 'DigitalBitbox'
          });
          break;
        case 'secalot':
          this.$emit('hardwareRequiresPassword', {
            walletConstructor: SecalotWallet,
            hardwareBrand: 'Secalot'
          });
          break;
        case 'keepkey':
          KeepkeyWallet(false, this.$eventHub).then(_newWallet => {
            this.$emit('hardwareWalletOpen', _newWallet);
          });
          break;
        default:
          // eslint-disable-next-line
          console.error('something not right'); // todo remove dev item
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
@import 'HardwareModal-desktop.scss';
@import 'HardwareModal-tablet.scss';
@import 'HardwareModal-mobile.scss';
</style>
