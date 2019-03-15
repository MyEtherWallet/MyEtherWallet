<template>
  <b-modal
    ref="hardware"
    :title="$t('accessWallet.accessByHardware')"
    hide-footer
    class="bootstrap-modal modal-hardware nopadding"
    centered
  >
    <div class="modal-content-container">
      <finney-modal ref="finney" />
      <div class="d-block text-center">
        <b-alert :show="mayNotBeAttached" fade variant="warning"
          >Please make sure your device is connected</b-alert
        >
        <div class="button-options hardware-button-options">
          <wallet-option
            v-for="(item, idx) in items"
            :key="item.name + idx"
            :selected="selected === item.name"
            :select="select"
            :regular-icon="item.imgPath"
            :hover-icon="item.imgHoverPath"
            :text="item.text"
            :name="item.name"
            :disabled="item.disabled"
            :tooltip-msg="item.msg"
          />
        </div>
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
import FinneyModal from '../FinneyModal';
import CustomerSupport from '@/components/CustomerSupport';
import ledger from '@/assets/images/icons/button-ledger.png';
import ledgerHov from '@/assets/images/icons/button-ledger-hover.png';
import bitbox from '@/assets/images/icons/button-bitbox.png';
import bitboxHov from '@/assets/images/icons/button-bitbox-hover.png';
import secalot from '@/assets/images/icons/button-secalot.png';
import secalotHov from '@/assets/images/icons/button-secalot-hover.png';
import trezor from '@/assets/images/icons/button-trezor.png';
import trezorHov from '@/assets/images/icons/button-trezor-hover.png';
import keepkey from '@/assets/images/icons/button-keepkey.png';
import keepkeyHov from '@/assets/images/icons/button-keepkey-hover.png';
import finney from '@/assets/images/icons/button-finney.png';
import finneyHov from '@/assets/images/icons/button-finney-hover.png';
import WalletOption from '../WalletOption';
import { Toast } from '@/helpers';
import { isSupported } from 'u2f-api';
import platform from 'platform';
import {
  LedgerWallet,
  KeepkeyWallet,
  TrezorWallet,
  BitBoxWallet,
  SecalotWallet
} from '@/wallets';
export default {
  components: {
    'customer-support': CustomerSupport,
    'wallet-option': WalletOption,
    'finney-modal': FinneyModal
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
      mayNotBeAttached: false,
      isU2FSupported: false,
      items: [
        {
          name: 'ledger',
          imgPath: ledger,
          imgHoverPath: ledgerHov,
          text: 'Ledger',
          disabled: false,
          msg: ''
        },
        {
          name: 'finney',
          imgPath: finney,
          imgHoverPath: finneyHov,
          text: 'FINNEY',
          disabled: false,
          msg: ''
        },
        {
          name: 'bitbox',
          imgPath: bitbox,
          imgHoverPath: bitboxHov,
          text: 'Digital Bitbox',
          disabled: false,
          msg: ''
        },
        {
          name: 'secalot',
          imgPath: secalot,
          imgHoverPath: secalotHov,
          text: 'Secalot',
          disabled: false,
          msg: ''
        },
        {
          name: 'trezor',
          imgPath: trezor,
          imgHoverPath: trezorHov,
          text: 'Trezor',
          disabled:
            platform.name.toLowerCase() !== 'chrome' &&
            platform.name.toLowerCase() !== 'firefox',
          msg:
            platform.name.toLowerCase() !== 'chrome' &&
            platform.name.toLowerCase() !== 'firefox'
              ? 'Browser not supported by Trezor'
              : ''
        },
        {
          name: 'keepkey',
          imgPath: keepkey,
          imgHoverPath: keepkeyHov,
          text: 'KeepKey',
          disabled: false,
          msg: ''
        }
      ]
    };
  },
  mounted() {
    isSupported().then(res => {
      this.items.forEach(item => {
        const u2fhw = ['secalot', 'ledger', 'bitbox'];
        const inMobile = ['secalot', 'keepkey'];
        const webUsb = ['keepkey'];

        if (webUsb.includes(item.name)) {
          const disable =
            window.location.protocol !== 'https:' ||
            !window ||
            !window.navigator ||
            !window.navigator.usb;
          item.disabled = disable;
          item.msg = disable ? this.$t('errorsGlobal.browserNonWebUsb') : '';
        }

        if (u2fhw.includes(item.name)) {
          const disable =
            (platform.name.toLowerCase() === 'chrome' ||
              platform.name.toLowerCase() === 'opera') &&
            res;
          item.disabled = !disable;
          item.msg = !disable ? this.$t('errorsGlobal.browserNonU2f') : '';
        }

        if (this.isMobile()) {
          const disable = !inMobile.includes(item.name);
          item.disabled = disable;
          item.msg = disable ? this.$t('errorsGlobal.noMobileSupport') : '';
        }
      });
    });
    this.$refs.hardware.$on('hidden', () => {
      this.selected = '';
    });
  },
  methods: {
    isMobile() {
      return (
        typeof window.orientation !== 'undefined' ||
        navigator.userAgent.indexOf('IEMobile') !== -1
      );
    },
    continueAccess() {
      const showPluggedInReminder = setTimeout(() => {
        this.mayNotBeAttached = true;
      }, 1000);
      switch (this.selected) {
        case 'ledger':
          LedgerWallet()
            .then(_newWallet => {
              clearTimeout(showPluggedInReminder);
              this.$emit('hardwareWalletOpen', _newWallet);
            })
            .catch(e => {
              this.mayNotBeAttached = true;
              LedgerWallet.errorHandler(e);
            });
          break;
        case 'trezor':
          TrezorWallet()
            .then(_newWallet => {
              clearTimeout(showPluggedInReminder);
              this.$emit('hardwareWalletOpen', _newWallet);
            })
            .catch(e => {
              this.mayNotBeAttached = true;
              TrezorWallet.errorHandler(e);
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
          KeepkeyWallet(false, this.$eventHub)
            .then(_newWallet => {
              this.$emit('hardwareWalletOpen', _newWallet);
            })
            .catch(e => {
              this.mayNotBeAttached = true;
              KeepkeyWallet.errorHandler(e);
            });
          break;
        case 'finney':
          this.$refs.finney.$refs.finneyModal.show();
          break;
        default:
          Toast.responseHandler(
            new Error('No switch address for given account.'),
            Toast.ERROR
          );
          break;
      }
    },
    select(ref) {
      if (this.selected !== ref) {
        this.selected = ref;
      } else {
        this.selected = '';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'HardwareModal-desktop.scss';
@import 'HardwareModal-tablet.scss';
@import 'HardwareModal-mobile.scss';
</style>
