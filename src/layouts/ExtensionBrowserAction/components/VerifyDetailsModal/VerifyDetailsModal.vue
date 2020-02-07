<template>
  <div>
    <mewcx-modal-wrapper ref="viewWalletModal" direction="up">
      <template v-slot:modalContentTitle>
        View Wallet Detail
      </template>
      <template v-slot:modalCloserButton>
        <div></div>
      </template>
      <div class="verify-details-container">
        <div class="wallet-info-and-code">
          <div class="blockie-and-address">
            <div v-if="Object.keys(wallet).length > 0">
              <blockie
                width="35px"
                height="35px"
                :address="wallet.getAddressString()"
              />
            </div>
            <div class="name-and-address">
              <p>{{ nickname }}</p>
              <p>{{ wallet.getAddressString() }}</p>
            </div>
          </div>
          <div class="qr-code-container"></div>
        </div>
        <div class="balance-container"></div>
        <div class="button-container"></div>
      </div>
    </mewcx-modal-wrapper>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import MewcxModalWrapper from '../../wrappers/MewcxModalWrapper';
import Blockie from '@/components/Blockie';
import {
  KEYSTORE as keyStoreType,
  MNEMONIC as mnemonicType,
  PRIV_KEY as privateKeyType
} from '@/wallets/bip44/walletTypes';
import { Toast } from '@/helpers';

const ACTUAL_TITLES = {};
ACTUAL_TITLES[keyStoreType] = 'Keystore File (UTC/JSON)';
ACTUAL_TITLES[mnemonicType] = 'Mnemonic Phrase';
ACTUAL_TITLES[privateKeyType] = 'Private Key';

export default {
  components: {
    'mewcx-modal-wrapper': MewcxModalWrapper,
    blockie: Blockie
  },
  props: {
    usd: {
      type: Number,
      default: 0
    },
    loading: {
      type: Boolean,
      default: false
    },
    nickname: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      balance: '0'
    };
  },
  computed: {
    ...mapState('main', ['web3', 'wallet']),
    address() {
      const hasWallet = Object.keys(this.wallet).length > 0;
      return hasWallet
        ? this.wallet.hasOwnProperty('isHardware')
          ? '0x'
          : this.wallet.getAddressString()
        : '0x';
    },
    actualTitle() {
      return ACTUAL_TITLES[this.title];
    }
  },
  watch: {
    wallet(newVal) {
      if (Object.keys(newVal).length > 0 && newVal.identifier === 'keystore') {
        this.web3.eth
          .getBalance(newVal.getAddressString())
          .then(res => {
            this.balance = this.web3.utils.fromWei(res, 'ether');
          })
          .catch(e => {
            Toast.responseHandler(e, Toast.ERROR);
          });
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import 'VerifyDetailsModal.scss';
</style>
