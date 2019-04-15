<template>
  <div class="interface-address">
    <div class="info-block address">
      <div class="block-image">
        <blockie
          :address="newAddress"
          :size="8"
          :scale="16"
          width="64px"
          height="64px"
          class="blockie-image"
        />
        <input
          ref="copyAddress"
          :value="newAddress"
          class="hidden-input"
          autocomplete="off"
        />
      </div>
      <div class="block-content">
        <div class="information-container">
          <h2>{{ $t('common.address') }}</h2>
          <p class="address">{{ newAddress }}</p>
        </div>
        <div class="icon-container">
          <button
            v-if="hasMultipleAddr"
            id="popover-ref-address"
            class="change-button"
            @click="switchAddr"
          >
            Switch
          </button>
          <b-btn id="popover-ref-qrcode" class="custom-tooltip" @click="qrcode">
            <img src="~@/assets/images/icons/qr-code-white.svg" />
          </b-btn>
          <b-btn id="popover-ref-print" class="custom-tooltip" @click="print">
            <img src="~@/assets/images/icons/printer-white.svg" />
          </b-btn>
          <b-btn id="popover-ref-copy" class="custom-tooltip" @click="copy">
            <img src="~@/assets/images/icons/copy.svg" />
          </b-btn>
          <b-popover
            content="Switch Address"
            target="popover-ref-address"
            placement="top"
            triggers="hover"
            title
          />
          <b-popover
            :content="$t('popover.print')"
            target="popover-ref-print"
            placement="top"
            triggers="hover"
            title
          />
          <b-popover
            :content="$t('popover.copy')"
            target="popover-ref-copy"
            placement="top"
            triggers="hover"
            title
          />
          <b-popover
            :content="$t('popover.switchAddress')"
            target="switch"
            placement="top"
            triggers="hover"
            title
          />
          <b-popover
            content="Address in Qrcode"
            target="popover-ref-qrcode"
            placement="top"
            triggers="hover"
            title
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Blockie from '@/components/Blockie';
import { mapGetters } from 'vuex';
import { Toast } from '@/helpers';
import {
  KEYSTORE,
  PRIV_KEY,
  MEW_CONNECT,
  WEB3_WALLET
} from '@/wallets/bip44/walletTypes';
// import { address } from '../../../../helpers/solidityTypes';

export default {
  components: {
    blockie: Blockie
  },
  props: {
    address: {
      type: String,
      default: ''
    },
    print: {
      type: Function,
      default: function() {}
    },
    switchAddr: {
      type: Function,
      default: function() {}
    },
    qrcode: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {
      hasMultipleAddr: false,
      newAddress: "xdc" + this.$props.address.substring(2),
    };
  },
  computed: {
    ...mapGetters({
      account: 'account'
    })
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
      this.$refs.copyAddress.select();
      document.execCommand('copy');
      Toast.responseHandler('Copied!', Toast.INFO);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'InterfaceAddress.scss';
</style>
