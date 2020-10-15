<template>
  <mew-overlay
    :show-overlay="open"
    title="Mobile App"
    right-btn-text="Cancel"
    :close="overlayClose"
    left-btn-text=""
  >
    <template #mewOverlayBody>
      <v-sheet color="transparent" max-width="450px" class="mx-auto px-5">
        <v-row>
          <v-col v-for="(btn, key) in buttons" :key="key" cols="9" sm="12">
            <mew-super-button
              :title="btn.label"
              :subtitle="btn.description"
              color-theme="basic"
              @click.native="btn.fn"
            >
              <template #contentSlot>
                <img class="icon" :src="btn.icon" />
              </template>
            </mew-super-button>
          </v-col>
        </v-row>
      </v-sheet>
    </template>
  </mew-overlay>
</template>

<script>
import { WalletConnectWallet, WalletLinkWallet } from '@/modules/wallets/utils';
import { mapActions } from 'vuex';
export default {
  name: 'MobileAccessOverlay',
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
    ...mapActions(['setWallet']),
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
        console.log(e);
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
        console.log(e);
      }
    },
    overlayClose() {
      this.close('showMobile');
    }
  }
};
</script>

<style lang="scss" scoped></style>
