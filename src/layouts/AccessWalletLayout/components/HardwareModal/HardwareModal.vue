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
import WalletOption from '../WalletOption';
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
    'wallet-option': WalletOption
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
      items: [
        {
          name: 'ledger',
          imgPath: ledger,
          imgHoverPath: ledgerHov,
          text: 'Ledger'
        },
        {
          name: 'bitbox',
          imgPath: bitbox,
          imgHoverPath: bitboxHov,
          text: 'Digital Bitbox'
        },
        {
          name: 'secalot',
          imgPath: secalot,
          imgHoverPath: secalotHov,
          text: 'Secalot'
        },
        {
          name: 'trezor',
          imgPath: trezor,
          imgHoverPath: trezorHov,
          text: 'Trezor'
        },
        {
          name: 'keepkey',
          imgPath: keepkey,
          imgHoverPath: keepkeyHov,
          text: 'KeepKey'
        }
      ]
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
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'HardwareModal-desktop.scss';
@import 'HardwareModal-tablet.scss';
@import 'HardwareModal-mobile.scss';
</style>
