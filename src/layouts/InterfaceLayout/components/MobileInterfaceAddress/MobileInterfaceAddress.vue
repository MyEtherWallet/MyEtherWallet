<template>
  <div class="mobile-interface-address">
    <address-qrcode-modal ref="qrcode" :address="account.address" />
    <div class="wrap">
      <div class="top-block">
        <div class="blockie-container">
          <blockie
            :address="address"
            :size="8"
            :scale="16"
            class="blockie-image"
          />
        </div>
        <div class="address">{{ account.address }}</div>
        <div class="address-end">
          {{
            account.address.substring(
              account.address.length - 4,
              account.address.length
            )
          }}
        </div>
        <div class="buttons-container">
          <button @click="openQrcode">
            <img src="~@/assets/images/icons/qr-code-white.svg" />
            <div class="floating-barcode">
              <div class="barcode-image"></div>
            </div>
          </button>
          <button @click="copy">
            <img src="~@/assets/images/icons/copy.svg" />
          </button>
          <button v-if="false" @click="print">
            <img src="~@/assets/images/icons/printer-white.svg" />
          </button>
        </div>
      </div>
      <div class="bottom-block">
        <button @click="switchAddr">Change Address</button>
      </div>
    </div>
    <!-- .wrap -->
  </div>
</template>

<script>
import AddressQrcodeModal from '@/components/AddressQrcodeModal';
import Blockie from '@/components/Blockie';
import { mapGetters } from 'vuex';
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
    triggerAlert: {
      type: Function,
      default: function() {}
    },
    print: {
      type: Function,
      default: function() {}
    },
    switchAddr: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {
      hasMultipleAddr: false
    };
  },
  computed: {
    ...mapGetters({
      account: 'account'
    })
  },
  mounted() {
    //this.$refs.addressQrcode.$refs.addressQrcode.show();

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
      this.triggerAlert('Address Copied!');
      this.$refs.copyAddress.select();
      document.execCommand('copy');
    },
    openQrcode() {
      this.$refs.qrcode.$refs.addressQrcode.show();
      //console.log(this.$refs);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'MobileInterfaceAddress.scss';
</style>
