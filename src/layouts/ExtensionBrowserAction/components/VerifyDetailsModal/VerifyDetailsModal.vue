<template>
  <div>
    <b-modal
      ref="verifyDetails"
      :title="actualTitle"
      hide-footer
      centered
      class="bootstrap-modal"
    >
      <form>
        <div class="modal-contents">
          <div class="input-container">
            <label> Your Wallet </label>
            <wallet-view-component
              :should-concat="false"
              :address="address"
              :balance="balance"
            />
          </div>
          <div class="input-container">
            <label> Nickname </label>
            <input v-model="locNickname" />
          </div>
          <div class="submit-button-container">
            <div class="back-button" @click.prevent="back">
              Back
            </div>
            <button
              class="submit-button large-round-button-green-filled"
              type="submit"
              @click.prevent="
                () => {
                  addWallet('wallet');
                }
              "
            >
              <span v-show="!loading"> Add Wallet </span>
              <i v-show="loading" class="fa fa-spinner fa-spin" />
            </button>
          </div>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
import WalletViewComponent from '@/layouts/ExtensionPopup/components/WalletViewComponent';
import { mapState } from 'vuex';
import {
  KEYSTORE as keyStoreType,
  MNEMONIC as mnemonicType,
  PRIV_KEY as privateKeyType
} from '@/wallets/bip44/walletTypes';
import { isAddress } from '@/helpers/addressUtils';
import { Toast } from '@/helpers';

const ACTUAL_TITLES = {};
ACTUAL_TITLES[keyStoreType] = 'Keystore File (UTC/JSON)';
ACTUAL_TITLES[mnemonicType] = 'Mnemonic Phrase';
ACTUAL_TITLES[privateKeyType] = 'Private Key';

export default {
  components: {
    'wallet-view-component': WalletViewComponent
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    wallet: {
      type: Object,
      default: () => {
        return {};
      }
    },
    addWallet: {
      type: Function,
      default: () => {}
    },
    back: {
      type: Function,
      default: () => {}
    },
    nickname: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      locNickname: this.nickname,
      balance: '0'
    };
  },
  computed: {
    ...mapState(['web3']),
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
    locNickname(newVal) {
      this.$emit('nickname', newVal);
    },
    wallet(newVal) {
      if (Object.keys(newVal).length > 0) {
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
