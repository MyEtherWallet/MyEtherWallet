<template>
  <div class="expandHeader">
    <v-container>
      <block-title :data="titleData">
        <h5 class="white--text ma-0">
          Select a app that you want to use to connect MEW.
        </h5>
      </block-title>
      <v-sheet color="transparent" max-width="450px" class="mx-auto">
        <v-row>
          <v-col v-for="(btn, key) in buttons" :key="key" cols="12" sm="12">
            <mew-super-button
              color-theme="white"
              btn-mode="small-right-image"
              :title="btn.label"
              :subtitle="btn.description"
              :right-icon="btn.icon"
              @click.native="btn.fn"
            />
          </v-col>
        </v-row>
      </v-sheet>
      <div class="spacer-y-medium" />
    </v-container>
  </div>
</template>

<script>
import mewSuperButton from '@/components/mewSuperButton/MewSuperButton';
import blockTitle from '@/components/block-title/BlockTitle';
import { Toast, SENTRY } from '@/components/toast';
import { WalletConnectWallet, WalletLinkWallet } from '@/modules/wallets/utils';
import { mapActions } from 'vuex';

export default {
  name: 'MobileAccess',
  components: { mewSuperButton, blockTitle },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    close: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      titleData: {
        textProps: 'white--text',
        toptitle: '',
        title: 'Mobile apps',
        description: '',
        centered: true
      },
      buttons: [
        {
          label: 'WalletConnet',
          description: 'Connect wallet with Walletconnet',
          icon: require('@/assets/images/icons/icon-wallet-connect.svg'),
          fn: () => {
            this.openWalletConnect();
          }
        },
        {
          label: 'Wallet Link',
          description: 'Connect wallet with Wallet Link ',
          icon: require('@/assets/images/icons/icon-wallet-link.png'),
          fn: () => {
            this.openWalletLink();
          }
        }
      ]
    };
  },
  methods: {
    ...mapActions('wallet', ['setWallet']),
    openWalletConnect() {
      try {
        WalletConnectWallet()
          .then(_newWallet => {
            this.setWallet([_newWallet]).then(() => {
              this.$router.push({ name: 'Dashboard' });
            });
          })
          .catch(e => {
            WalletConnectWallet.errorHandler(e);
          });
      } catch (e) {
        Toast(e.message, {}, SENTRY);
      }
    },
    openWalletLink() {
      try {
        WalletLinkWallet()
          .then(_newWallet => {
            this.setWallet([_newWallet]).then(() => {
              this.$router.push({ name: 'Dashboard' });
            });
          })
          .catch(e => {
            WalletLinkWallet.errorHandler(e);
          });
      } catch (e) {
        Toast(e.message, {}, SENTRY);
      }
    },
    overlayClose() {
      this.close('showMobile');
    }
  }
};
</script>
