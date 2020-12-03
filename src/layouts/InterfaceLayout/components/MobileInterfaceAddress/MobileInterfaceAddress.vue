<template>
  <div>
    <address-qrcode-modal ref="qrcode" :address="account.address" />
    <div class="wrap d-flex align-items-center">
      <blockie :address="newAddress" :size="8" :scale="16" class="blockie-image" />
      <div class="address-contents">
        <div class="title">{{ $t('common.addr') }}</div>
        <div class="d-flex address">
          <div class="address-begin">
            {{
              newAddress !== null && newAddress !== ''
                ? newAddress.substring(0, newAddress.length - 4)
                : ''
            }}
          </div>
          <div class="address-end">
            {{
              newAddress !== null && newAddress !== ''
                ? newAddress.substring(newAddress.length - 4, newAddress.length)
                : ''
            }}
          </div>
          <input
            ref="mobileCopyAddress"
            :value="address"
            class="mobile-hidden-input"
            autocomplete="off"
          />
        </div>
      </div>
      <div class="buttons-container">
        <button @click="copy">
          <img alt src="~@/assets/images/icons/copy.svg" />
        </button>
        <button class="qrcode ml-2" @click="openQrcode">
          <img alt src="~@/assets/images/icons/qr-code-white.svg" />
          <div class="floating-barcode">
            <div class="barcode-image"></div>
          </div>
        </button>
        <button class="ml-2" @click="print">
          <img alt src="~@/assets/images/icons/printer-white.svg" />
        </button>
      </div>

      <div v-if="hasMultipleAddr" class="bottom-block">
        <button @click="switchAddr">{{ $t('interface.change-addr') }}</button>
      </div>
    </div>
    <!-- .wrap -->
  </div>
</template>

<script>
import AddressQrcodeModal from '@/components/AddressQrcodeModal';
import Blockie from '@/components/Blockie';
import { mapState } from 'vuex';
import { Toast } from '@/helpers';
import {
  KEYSTORE,
  PRIV_KEY,
  MEW_CONNECT,
  WEB3_WALLET
} from '@/wallets/bip44/walletTypes';

export default {
  components: {
    blockie: Blockie,
    'address-qrcode-modal': AddressQrcodeModal
  },
  props: {
    address: {
      type: String,
      default: ''
    },
    print: {
      type: Function,
      default: function () {}
    },
    switchAddr: {
      type: Function,
      default: function () {}
    }
  },
  data() {
    return {
      hasMultipleAddr: false,
      newAddress: 'xdc' + this.$props.address.substring(2)

    };
  },
  computed: {
    ...mapState('main', ['account'])
  },
  mounted() {
    if (this.account.address !== null) {
      if (
        this.account.identifier !== KEYSTORE &&
        this.account.identifier !== PRIV_KEY &&
        this.account.identifier !== MEW_CONNECT &&
        this.account.identifier !== WEB3_WALLET
      ) {
        this.hasMultipleAddr = true;
      } else {
        this.hasMultipleAddr = false;
      }
    }
  },
  methods: {
    copy() {
      this.$refs.mobileCopyAddress.select();
      document.execCommand('copy');
      Toast.responseHandler(this.$t('common.copied'), Toast.INFO);
    },
    openQrcode() {
      this.$refs.qrcode.$refs.addressQrcode.show();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'MobileInterfaceAddress.scss';
</style>
