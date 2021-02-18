<template>
  <!--
    =====================================================================================
        Overlay - access using software
    =====================================================================================
    -->
  <mew-overlay
    :show-overlay="open"
    :title="title"
    right-btn-text="Close"
    :back="accessBack"
    :close="close"
    :left-btn-text="backBtnText"
  >
    <template #mewOverlayBody>
      <v-sheet color="transparent" max-width="650px" class="mx-auto">
        <!--
        =====================================================================================
         Overview: prompts user to select options
        =====================================================================================
        -->
        <v-row v-if="walletType === types[3]">
          <v-col v-for="(btn, key) in buttons" :key="key" cols="12" sm="12">
            <mew-super-button
              btn-mode="small-right-image"
              :title="btn.label"
              :subtitle="btn.description"
              :right-icon="btn.icon"
              icon-type="img"
              color-theme="basic"
              @click.native="btn.fn"
            />
          </v-col>
          <!--
          =====================================================================================
            Overview Warning
          =====================================================================================
          -->
          <v-col cols="12" sm="12">
            <mew-warning-sheet
              title="Not Recommended"
              description="This information is sensetive, and these options should only be used in offline settings by experienced crypto users."
              :link-obj="warningSheetObj"
            />
          </v-col>
        </v-row>
        <!--
        =====================================================================================
         Access With Keystore
        =====================================================================================
        -->
        <access-wallet-keystore
          v-if="walletType === types[0]"
          :handler-access-wallet="accessHandler"
          @unlock="unclockWallet"
        />
      </v-sheet>

      <!-- <v-sheet color="transparent" max-width="650px" class="mx-auto">
        <v-row v-if="!step">
          <v-col v-for="(btn, key) in buttons" :key="key" cols="12" sm="12">
            <mew-super-button
              btn-mode="small-right-image"
              :title="btn.label"
              :subtitle="btn.description"
              :right-icon="btn.icon"
              icon-type="img"
              color-theme="basic"
              @click.native="btn.fn"
            />
          </v-col>
        </v-row>
        <access-keystore
          v-else-if="showKeystore"
          :btn-call="btnCall"
          :unlock-keystore-wallet="unlockKeystoreWallet"
          :step="step"
          @keystore="handleKeystoreUpload"
          @updateStep="handleStep"
        />
        <access-mnemonic
          v-else-if="showMnemonic"
          :btn-call="btnCall"
          :unlock-mnemonic-wallet="unlockMnemonicWallet"
          :step="step"
          :set-mnemonic-path="setMnemonicPath"
          :hw-wallet-instance="hwWalletInstance"
          :set-address="setAddress"
        />
        <access-private-key
          v-else-if="showPrivKey"
          :unlock-private-key-wallet="unlockPrivateKeyWallet"
        />
        <v-col cols="12" sm="12">
          <mew-warning-sheet
            title="Not Recommended"
            description="This information is sensetive, and these options should only be used in offline settings by experienced crypto users."
            :link-obj="warningSheetObj"
          />
        </v-col>
      </v-sheet> -->
      <div class="spacer-y-medium" />
    </template>
  </mew-overlay>
</template>

<script>
import mewSuperButton from '@/components/mewSuperButton/MewSuperButton';
import AccessWalletKeystore from './software/components/AccessWalletKeystore';
import accessMnemonic from './software/components/AccessMnemonic';
import accessPrivateKey from './software/components/AccessPrivateKey';
import { mapActions, mapState } from 'vuex';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import { SOFTWARE_WALLET_TYPES } from './software/handlers/helpers';
import hadlerAccessWalletSoftware from './software/handlers/hadlerAccessWalletSoftware';

export default {
  name: 'ModuleAccessWalletSoftware',
  components: {
    AccessWalletKeystore,
    accessMnemonic,
    accessPrivateKey,
    mewSuperButton
  },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    close: {
      type: Function,
      default: () => {}
    },
    walletType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      types: SOFTWARE_WALLET_TYPES,
      warningSheetObj: {
        title: 'Learn More',
        url: 'https://kb.myetherwallet.com/en/offline/using-mew-offline'
      },
      buttons: [
        /* Keystore Button */
        {
          label: 'Keystore',
          description: 'Access via Keystore',
          icon: require('@/assets/images/icons/icon-keystore-file.svg'),
          fn: () => {
            this.setType(SOFTWARE_WALLET_TYPES[0]);
          }
        },
        /* Mnemonic */
        {
          label: 'Mnemonic Phrase',
          description: 'Access via Mnemonic Phrase',
          icon: require('@/assets/images/icons/icon-mnemonic.svg'),
          fn: () => {
            this.setType(SOFTWARE_WALLET_TYPES[1]);
          }
        },
        /* Private Key */
        {
          label: 'Private Key',
          description: 'Access via Private Key',
          icon: require('@/assets/images/icons/icon-private-key-grey.svg'),
          fn: () => {
            this.setType(SOFTWARE_WALLET_TYPES[2]);
          }
        }
      ],
      accessHandler: {},
      hwWalletInstance: {}
    };
  },

  computed: {
    /**
     * @returns back button text
     * if overview, button text is empty
     */
    backBtnText() {
      return this.walletType === SOFTWARE_WALLET_TYPES[3]
        ? ''
        : 'Select Another Software';
    },
    /**
     * @returns correct title of the overlay according to the wallet type selected
     */
    title() {
      switch (this.walletType) {
        case SOFTWARE_WALLET_TYPES[0]:
          return 'Access Wallet with Keystore File';
        case SOFTWARE_WALLET_TYPES[1]:
          return 'Access Wallet with Mnemonic Pharse';
        case SOFTWARE_WALLET_TYPES[2]:
          return 'Access Wallet with Private Key';
        default:
          return 'Select Software Wallet';
      }
    },
    ...mapState('external', ['path'])
  },
  /**
   * Lifecucle hooks to create and destroy access wallet handler
   */
  mounted() {
    this.accessHandler = new hadlerAccessWalletSoftware();
  },
  destroyed() {
    this.accessHandler = {};
  },
  methods: {
    /**
     * Sets Wallet in the store
     */
    ...mapActions('wallet', ['setWallet']),

    /**
     * Sets Wallet and Pushes new route query param
     * Used in overlay back button
     */
    unclockWallet() {
      try {
        this.setWallet([this.accessHandler.getWalletInstance()])
          .then(() => {
            if (this.path !== '') {
              this.$router.push({ path: this.path });
            } else {
              this.$router.push({ name: 'Wallets' });
            }
          })
          .catch(e => {
            Toast(e, {}, ERROR);
          });
      } catch (e) {
        Toast(e, {}, ERROR);
      }
    },

    /**
     * Directs user back to software overview
     * Pushes new route query param
     * Used in overlay back button
     */
    accessBack() {
      if (this.walletType !== SOFTWARE_WALLET_TYPES[3]) {
        try {
          this.$router.push({
            query: { type: 'overview' }
          });
        } catch (e) {
          Toast(e, {}, ERROR);
        }
      }
    },

    /**
     * Sets a wallet type, pushes new route
     * This method is used in create overview block
     * @type - must be one of the SOFTWARE_WALLET_TYPES
     */
    setType(newType) {
      if (SOFTWARE_WALLET_TYPES.includes(newType)) {
        try {
          this.$router.push({
            query: { type: newType }
          });
        } catch (e) {
          Toast(e, {}, ERROR);
        }
      } else {
        throw new Error('Not a valid type!');
      }
    }
  }
};
</script>
