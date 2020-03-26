<template>
  <b-modal
    ref="bitboxSelect"
    :title="$t('accessWallet.bitbox.modal.title')"
    hide-footer
    class="nopadding modal-hardware"
    centered
    static
    lazy
    dialog-class="hardware-wallet-dialog"
  >
    <div class="modal-content-container">
      <div class="d-block text-center">
        <b-alert :show="mayNotBeAttached" fade variant="warning">{{
          $t('accessWallet.hardware.warning.not-connected')
        }}</b-alert>
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
    </div>
  </b-modal>
</template>

<script>
import bitbox from '@/assets/images/icons/HardwareWallet/bitbox.svg';
import WalletOption from '../WalletOption';
import { Toast } from '@/helpers';
import { isSupported } from 'u2f-api';
import { BitBoxWallet, BitBox02Wallet } from '@/wallets';
import {
  BITBOX as BITBOX_TYPE,
  BITBOX02 as BITBOX02_TYPE
} from '@/wallets/bip44/walletTypes';
export default {
  components: {
    'wallet-option': WalletOption
  },
  props: {
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
          name: BITBOX_TYPE,
          imgPath: bitbox,
          text: 'BitBox',
          disabled: false,
          msg: '',
          link: 'https://shiftcrypto.ch/?ref=mew'
        },
        {
          name: BITBOX02_TYPE,
          imgPath: bitbox,
          text: 'BitBox02',
          disabled: false,
          msg: '',
          link: 'https://shiftcrypto.ch/?ref=mew'
        }
      ]
    };
  },
  mounted() {
    isSupported().then(res => {
      this.items.forEach(item => {
        const u2fhw = [BITBOX_TYPE];

        if (u2fhw.includes(item.name)) {
          item.disabled = !res;
          item.msg = !res ? 'errorsGlobal.browser-non-u2f' : '';
        }
      });
    });
    this.$refs.bitboxSelect.$on('hidden', () => {
      this.selected = '';
    });
  },
  methods: {
    continueAccess() {
      switch (this.selected) {
        case BITBOX_TYPE:
          this.$emit('hardwareRequiresPassword', {
            walletConstructor: BitBoxWallet,
            hardwareBrand: 'BitBox'
          });
          break;
        case BITBOX02_TYPE:
          // eslint-disable-next-line no-case-declarations
          let bb02;
          BitBox02Wallet()
            .then(_newWallet => {
              bb02 = _newWallet;
              this.$emit('bitbox02Open', bb02);
              bb02
                .init('')
                .then(() => {
                  this.$emit('hardwareWalletOpen', bb02);
                })
                .catch(e => {
                  BitBox02Wallet.errorHandler(e);
                });
            })
            .catch(e => {
              BitBox02Wallet.errorHandler(e);
            });
          break;
        default:
          Toast.responseHandler(
            new Error('No switch address for given account.'),
            Toast.ERROR
          );
          break;
      }
      this.$refs.bitboxSelect.hide();
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
@import '../HardwareModal/HardwareModal-desktop.scss';
@import '../HardwareModal/HardwareModal-tablet.scss';
@import '../HardwareModal/HardwareModal-mobile.scss';
</style>
