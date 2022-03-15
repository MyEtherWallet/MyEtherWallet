<template>
  <!--
  =====================================================================================
    Overlay - access using software
  =====================================================================================
  -->
  <mew-overlay
    :footer="{
      text: 'Need help?',
      linkTitle: 'Contact support',
      link: 'mailto:support@myetherwallet.com'
    }"
    content-size="large"
    :show-overlay="open"
    :title="title"
    :back="showBackBtn && !switchAddress ? accessBack : null"
    :close="close"
  >
    <!--
    =====================================================================================
      Overview: prompts user to select options
    =====================================================================================
    -->
    <div
      v-if="walletType === types.OVERVIEW"
      style="max-width: 650px; width: 100%"
      class="mx-auto"
    >
      <div v-for="(btn, key) in buttons" :key="key" class="mb-5">
        <mew-button
          has-full-width
          color-theme="greyMedium"
          btn-style="outline"
          style="height: 160px"
          @click.native="btn.fn"
        >
          <div
            class="text-left d-flex align-center justify-space-between px-2"
            style="width: 100%"
          >
            <div class="mew-heading-2 textDark--text">
              {{ btn.label }}
            </div>
            <img width="80" class="mr-4 d-none d-sm-block" :src="btn.icon" />
          </div>
        </mew-button>
      </div>
    </div>
    <!--
    =====================================================================================
      Access With Keystore
    =====================================================================================
    -->
    <access-wallet-keystore
      v-if="walletType === types.KEYSTORE"
      :handler-access-wallet="accessHandler"
      class="mb-6"
      @unlock="unlockWallet"
    />
    <!--
    =====================================================================================
      Access With Mnemonic
    =====================================================================================
    -->
    <access-wallet-mnemonic
      v-if="walletType === types.MNEMONIC"
      :handler-access-wallet="accessHandler"
      :switch-address="switchAddress"
      class="mb-6"
      @unlock="unlockWallet"
    />
    <!--
    =====================================================================================
      Access With PrivateKey
    =====================================================================================
    -->
    <access-wallet-private-key
      v-else-if="walletType === types.PRIVATE_KEY"
      :handler-access-wallet="accessHandler"
      class="mb-6"
      @unlock="unlockWallet"
    />
    <!--
    =====================================================================================
      Warning
    =====================================================================================
    -->
    <mew-warning-sheet
      title="Not Recommended"
      description="This information is sensitive, and these options should only be used in offline settings by experienced crypto users."
      :link-obj="warningSheetObj"
      class="mt-0 mb-0"
    />
  </mew-overlay>
</template>

<script>
import AccessWalletKeystore from './software/components/AccessWalletKeystore';
import AccessWalletMnemonic from './software/components/AccessWalletMnemonic';
import AccessWalletPrivateKey from './software/components/AccessWalletPrivateKey';
import { mapActions, mapState } from 'vuex';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import { SOFTWARE_WALLET_TYPES } from './software/handlers/helpers';
import handlerAccessWalletSoftware from './software/handlers/handlerAccessWalletSoftware';
import { ROUTES_WALLET } from '../../core/configs/configRoutes';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';

export default {
  name: 'ModuleAccessWalletSoftware',
  components: {
    AccessWalletKeystore,
    AccessWalletMnemonic,
    AccessWalletPrivateKey
  },
  mixins: [handlerAnalytics],
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
    },
    switchAddress: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      type: '',
      types: SOFTWARE_WALLET_TYPES,
      warningSheetObj: {
        title: 'Learn More',
        url: 'https://help.myetherwallet.com/en/articles/5380611-using-mew-offline-cold-storage'
      },
      buttons: [
        /* Keystore Button */
        {
          label: 'Keystore',
          icon: require('@/assets/images/icons/icon-keystore-file.svg'),
          fn: () => {
            this.setType(SOFTWARE_WALLET_TYPES.KEYSTORE);
          }
        },
        /* Mnemonic */
        {
          label: 'Mnemonic Phrase',
          icon: require('@/assets/images/icons/icon-mnemonic.svg'),
          fn: () => {
            this.setType(SOFTWARE_WALLET_TYPES.MNEMONIC);
          }
        },
        /* Private Key */
        {
          label: 'Private Key',
          icon: require('@/assets/images/icons/icon-private-key-grey.png'),
          fn: () => {
            if (process.env.VUE_APP_PRIV_KEY) {
              this.accessHandler.unlockPrivateKeyWallet(
                process.env.VUE_APP_PRIV_KEY
              );
              this.unlockWallet();
            } else {
              this.setType(SOFTWARE_WALLET_TYPES.PRIVATE_KEY);
            }
          }
        }
      ],
      accessHandler: {}
    };
  },

  computed: {
    /**
     * @returns if the back button on overlay should be displayed
     */
    showBackBtn() {
      return this.walletType !== SOFTWARE_WALLET_TYPES.OVERVIEW;
    },
    /**
     * @returns correct title of the overlay according to the wallet type selected
     */
    title() {
      if (this.switchAddress) return 'Switch Address';
      switch (this.walletType) {
        case SOFTWARE_WALLET_TYPES.KEYSTORE:
          return 'Access Wallet with Keystore File';
        case SOFTWARE_WALLET_TYPES.MNEMONIC:
          return 'Access Wallet with Mnemonic Phrase';
        case SOFTWARE_WALLET_TYPES.PRIVATE_KEY:
          return 'Access Wallet with Private Key';
        default:
          return 'Select Software Wallet';
      }
    },
    ...mapState('external', ['path']),
    ...mapState('wallet', ['identifier'])
  },
  watch: {
    open(newVal) {
      if (this.identifier && this.switchAddress && newVal) {
        this.setType(this.identifier);
      }
    }
  },
  /**
   * Lifecycle hooks to create and destroy access wallet handler
   */
  mounted() {
    this.accessHandler = new handlerAccessWalletSoftware();
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
     * account is defined in Mnemonic phrase access
     */
    unlockWallet(account = undefined) {
      try {
        const wallet = !account
          ? this.accessHandler.getWalletInstance()
          : account;
        this.setWallet([wallet])
          .then(() => {
            if (this.switchAddress) {
              this.close();
              return;
            }
            if (this.path !== '') {
              this.$router.push({ path: this.path });
            } else {
              this.$router.push({ name: ROUTES_WALLET.WALLETS.NAME });
            }
            this.trackAccessWallet(this.type);
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
      if (this.walletType !== SOFTWARE_WALLET_TYPES.OVERVIEW) {
        try {
          this.$router.push({
            query: { type: SOFTWARE_WALLET_TYPES.OVERVIEW }
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
      if (Object.values(SOFTWARE_WALLET_TYPES).includes(newType)) {
        try {
          this.type = newType;
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
