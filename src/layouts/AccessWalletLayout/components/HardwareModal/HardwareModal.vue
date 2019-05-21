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
            :regular-icon="item.imgPath"
            :text="item.text"
            :name="item.name"
            :disabled="item.disabled"
            :tooltip-msg="item.msg"
            :link="item.link"
            @updateSelected="updateSelected"
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
import ledger from '@/assets/images/icons/HardwareWallet/ledger.svg';
import bitbox from '@/assets/images/icons/HardwareWallet/bitbox.svg';
import secalot from '@/assets/images/icons/HardwareWallet/secalot.svg';
import trezor from '@/assets/images/icons/HardwareWallet/trezor.svg';
import keepkey from '@/assets/images/icons/HardwareWallet/keepkey.svg';
import finney from '@/assets/images/icons/button-finney-hover.png';
import WalletOption from '../WalletOption';
import { Toast } from '@/helpers';
import { isSupported } from 'u2f-api';
import platform from 'platform';
import {
  KeepkeyWallet,
  TrezorWallet,
  BitBoxWallet,
  SecalotWallet
} from '@/wallets';
import {
  LEDGER as LEDGER_TYPE,
  TREZOR as TREZOR_TYPE,
  BITBOX as BITBOX_TYPE,
  SECALOT as SECALOT_TYPE,
  KEEPKEY as KEEPKEY_TYPE
} from '@/wallets/bip44/walletTypes';
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
    },
    ledgerAppOpen: {
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
          name: LEDGER_TYPE,
          imgPath: ledger,
          text: 'Ledger',
          disabled: false,
          msg: '',
          link: 'https://www.ledger.com?r=fa4b'
        },
        {
          name: 'finney',
          imgPath: finney,
          text: 'FINNEY',
          disabled: false,
          msg: '',
          link:
            'http://shop.sirinlabs.com?rfsn=2397639.54fdf&utm_source=refersion&utm_medium=affiliate&utm_campaign=2397639.54fdf'
        },
        {
          name: BITBOX_TYPE,
          imgPath: bitbox,
          text: 'Digital Bitbox',
          disabled: false,
          msg: '',
          link: 'https://digitalbitbox.com/?ref=mew'
        },
        {
          name: TREZOR_TYPE,
          imgPath: trezor,
          text: 'Trezor',
          disabled:
            platform.name.toLowerCase() !== 'chrome' &&
            platform.name.toLowerCase() !== 'firefox',
          msg:
            platform.name.toLowerCase() !== 'chrome' &&
            platform.name.toLowerCase() !== 'firefox'
              ? 'Browser not supported by Trezor'
              : '',
          link: 'https://trezor.io/?offer_id=12&aff_id=2029'
        },
        {
          name: SECALOT_TYPE,
          imgPath: secalot,
          text: 'Secalot',
          disabled: false,
          msg: '',
          link: 'https://www.secalot.com/'
        },
        {
          name: KEEPKEY_TYPE,
          imgPath: keepkey,
          text: 'KeepKey',
          disabled: false,
          msg: '',
          link: 'http://keepkey.go2cloud.org/aff_c?offer_id=1&aff_id=5561'
        }
      ]
    };
  },
  mounted() {
    isSupported().then(res => {
      this.items.forEach(item => {
        const u2fhw = [SECALOT_TYPE, LEDGER_TYPE, BITBOX_TYPE];
        const inMobile = [SECALOT_TYPE, KEEPKEY_TYPE];
        const webUsb = [KEEPKEY_TYPE, LEDGER_TYPE];

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
          item.disabled = !res;
          item.msg = !res ? this.$t('errorsGlobal.browserNonU2f') : '';
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
        case LEDGER_TYPE:
          this.$refs.hardware.hide();
          this.ledgerAppOpen();
          break;
        case TREZOR_TYPE:
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
        case BITBOX_TYPE:
          this.$emit('hardwareRequiresPassword', {
            walletConstructor: BitBoxWallet,
            hardwareBrand: 'DigitalBitbox'
          });
          break;
        case SECALOT_TYPE:
          this.$emit('hardwareRequiresPassword', {
            walletConstructor: SecalotWallet,
            hardwareBrand: 'Secalot'
          });
          break;
        case KEEPKEY_TYPE:
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
      this.$refs.hardware.hide();
    },
    updateSelected(ref) {
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
