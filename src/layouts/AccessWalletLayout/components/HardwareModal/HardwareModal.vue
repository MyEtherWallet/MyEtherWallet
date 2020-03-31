<template>
  <b-modal
    ref="hardware"
    :title="$t('accessWallet.hardware.modal.title')"
    hide-footer
    class="modal-hardware nopadding"
    centered
    static
    lazy
    no-padding
    dialog-class="hardware-wallet-dialog"
  >
    <div class="modal-content-container">
      <div class="d-block text-center">
        <b-alert :show="mayNotBeAttached" fade variant="warning">
          {{ $t('accessWallet.hardware.warning.not-connected') }}
        </b-alert>
        <div class="button-options hardware-button-options">
          <wallet-option
            v-for="(item, idx) in items"
            :key="item.name + idx"
            :selected="selected === item.name"
            :regular-icon="item.imgPath"
            :text="item.text"
            :name="item.name"
            :disabled="item.disabled"
            :tooltip-msg="$t(item.msg)"
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
          {{ $t('accessWallet.hardware.modal.button-choose') }}
        </div>
      </div>
      <customer-support />
    </div>
  </b-modal>
</template>

<script>
import CustomerSupport from '@/components/CustomerSupport';
import ledger from '@/assets/images/icons/HardwareWallet/ledger.svg';
import bitbox from '@/assets/images/icons/HardwareWallet/bitbox.svg';
import secalot from '@/assets/images/icons/HardwareWallet/secalot.svg';
import trezor from '@/assets/images/icons/HardwareWallet/trezor.svg';
import keepkey from '@/assets/images/icons/HardwareWallet/keepkey.svg';
import finney from '@/assets/images/icons/button-finney-hover.png';
import xwallet from '@/assets/images/icons/HardwareWallet/xwallet.svg';
import bcvault from '@/assets/images/icons/HardwareWallet/bcvault.svg';
import coolwallet from '@/assets/images/icons/HardwareWallet/coolwallet.svg';
import WalletOption from '../WalletOption';
import { Toast } from '@/helpers';
import { isSupported } from 'u2f-api';
import platform from 'platform';
import {
  KeepkeyWallet,
  TrezorWallet,
  SecalotWallet,
  BCVaultWallet,
  CoolWallet
} from '@/wallets';
import {
  LEDGER as LEDGER_TYPE,
  TREZOR as TREZOR_TYPE,
  SECALOT as SECALOT_TYPE,
  KEEPKEY as KEEPKEY_TYPE,
  XWALLET as XWALLET_TYPE,
  FINNEY as FINNEY_TYPE,
  COOLWALLET as COOLWALLET_TYPE,
  BCVAULT as BCVAULT_TYPE
} from '@/wallets/bip44/walletTypes';
export default {
  components: {
    'customer-support': CustomerSupport,
    'wallet-option': WalletOption
  },
  props: {
    networkAndAddressOpen: {
      type: Function,
      default: () => {}
    },
    hardwareWalletOpen: {
      type: Function,
      default: () => {}
    },
    bitboxSelectOpen: {
      type: Function,
      default: function() {}
    },
    ledgerAppOpen: {
      type: Function,
      default: () => {}
    },
    openFinney: {
      type: Function,
      default: () => {}
    },
    openXwallet: {
      type: Function,
      default: () => {}
    },
    openBcVault: {
      type: Function,
      default: () => {}
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
          name: KEEPKEY_TYPE,
          imgPath: keepkey,
          text: 'KeepKey',
          disabled: false,
          msg: '',
          link: 'http://lddy.no/a4im'
        },
        {
          name: COOLWALLET_TYPE,
          imgPath: coolwallet,
          text: 'CoolWallet',
          disabled: false,
          msg: '',
          link: 'https://coolwallet.io/product/coolwallet/?ref=myetherwallet'
        },
        {
          name: FINNEY_TYPE,
          imgPath: finney,
          text: 'FINNEY',
          disabled: false,
          msg: '',
          link:
            'http://shop.sirinlabs.com?rfsn=2397639.54fdf&utm_source=refersion&utm_medium=affiliate&utm_campaign=2397639.54fdf'
        },
        {
          name: 'BitBox',
          imgPath: bitbox,
          text: 'BitBox',
          disabled: false,
          msg: '',
          link: 'https://shiftcrypto.ch/?ref=mew'
        },
        {
          name: XWALLET_TYPE,
          imgPath: xwallet,
          text: 'XWallet',
          disabled: false,
          msg: '',
          link: 'https://xwallet.pundix.com'
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
          name: BCVAULT_TYPE,
          imgPath: bcvault,
          text: 'BC Vault',
          disabled: platform.name.toLowerCase() === 'firefox',
          msg:
            platform.name.toLowerCase() === 'firefox'
              ? 'Browser not supported by Trezor'
              : '',
          link: 'https://bc-vault.com/?wpam_id=53'
        }
      ]
    };
  },
  mounted() {
    isSupported().then(res => {
      this.items.forEach(item => {
        const u2fhw = [SECALOT_TYPE, LEDGER_TYPE];
        const inMobile = [SECALOT_TYPE, KEEPKEY_TYPE];
        const webUsb = [KEEPKEY_TYPE, LEDGER_TYPE];

        if (webUsb.includes(item.name)) {
          const disable =
            window.location.protocol !== 'https:' ||
            !window ||
            !window.navigator ||
            !window.navigator.usb;
          item.disabled = disable;
          item.msg = disable ? 'errorsGlobal.browser-non-web-usb' : '';
        }
        if (u2fhw.includes(item.name)) {
          item.disabled = !res;
          item.msg = !res ? 'errorsGlobal.browser-non-u2f' : '';
        }
        if (this.isMobile()) {
          const disable = !inMobile.includes(item.name);
          item.disabled = disable;
          item.msg = disable ? 'errorsGlobal.no-mobile-support' : '';
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
        case 'BitBox':
          this.bitboxSelectOpen();
          this.$refs.hardware.hide();
          break;
        case SECALOT_TYPE:
          this.$emit('hardwareRequiresPassword', {
            walletConstructor: SecalotWallet
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
        case FINNEY_TYPE:
          this.openFinney();
          this.$refs.hardware.hide();
          break;
        case XWALLET_TYPE:
          this.openXwallet();
          this.$refs.hardware.hide();
          break;
        case BCVAULT_TYPE:
          // eslint-disable-next-line
          const bcvaultInstance = BCVaultWallet();
          bcvaultInstance
            .init()
            .then(res => {
              if (res && res.length >= 1) {
                this.openBcVault(res, bcvaultInstance);
              }
            })
            .catch(e => {
              BCVaultWallet.errorHandler(e);
            });
          break;
        case COOLWALLET_TYPE:
          this.$emit('hardwareRequiresPassword', {
            walletConstructor: CoolWallet
          });
          break;
        default:
          Toast.responseHandler(
            new Error(this.$t('errosGlobal.something-went-wrong')),
            Toast.ERROR
          );
          break;
      }
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

<style>
.hardware-wallet-dialog {
  max-width: 700px !important;
}
</style>
