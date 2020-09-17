<template>
  <mew-overlay
    :show-overlay="open"
    :title="title"
    right-btn-text="Cancel"
    :back="accessBack"
    :close="overlayClose"
  >
    <template v-slot:mewOverlayBody>
      <div class="text-center">
        Select a hardware wallet to access. Make sure <br />
        your device is connected and unlocked
      </div>
      <v-sheet
        :outlined="true"
        color="transparent"
        :rounded="true"
        :max-width="740"
        :min-width="475"
        :min-height="340"
      >
        <v-container>
          <v-row justify="start">
            <v-col v-for="button in buttons" :key="button.label" cols="6">
              <div class="button-container">
                <mew-super-button
                  :title="button.label"
                  :cols-num="6"
                  color-theme="basic"
                  @clock.native="button.fnc"
                >
                  <template v-slot:contentSlot>
                    <img :src="button.icon" />
                  </template>
                </mew-super-button>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-sheet>
    </template>
  </mew-overlay>
</template>

<script>
import secalotWallet from '@/modules/wallets/utils/hardware/secalot';
import bitboxWallet from '@/modules/wallets/utils/hardware/bitbox';
import bitbox02Wallet from '@/modules/wallets/utils/hardware/bitbox02';
import keepkeyWallet from '@/modules/wallets/utils/hardware/keepkey';
import trezorWallet from '@/modules/wallets/utils/hardware/trezor';
import bcvaultWallet from '@/modules/wallets/utils/hardware/bcvault';
import coolwalletWallet from '@/modules/wallets/utils/hardware/coolwallet';

export default {
  name: 'HardwareAccessOverlay',
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
          label: 'Ledger',
          icon: require('@/assets/images/icons/hardware-wallets/icon-ledger.svg'),
          fnc: () => {
            this.nextStep('Ledger');
          }
        },
        {
          label: 'Bitbox',
          icon: require('@/assets/images/icons/hardware-wallets/icon-bitbox.svg'),
          fnc: () => {
            this.nextStep('Bitbox');
          }
        },
        {
          label: 'FINNEY',
          icon: require('@/assets/images/icons/hardware-wallets/icon-finney.svg'),
          fnc: () => {
            this.nextStep('FINNEY');
          }
        },
        {
          label: 'Secalot',
          icon: require('@/assets/images/icons/hardware-wallets/icon-secalot.svg'),
          fnc: () => {
            this.nextStep('Secalot');
          }
        },
        {
          label: 'KeepKey',
          icon: require('@/assets/images/icons/hardware-wallets/icon-keepkey.svg'),
          fnc: () => {
            this.nextStep('KeepKey');
          }
        },
        {
          label: 'Trezor',
          icon: require('@/assets/images/icons/hardware-wallets/icon-trezor.svg'),
          fnc: () => {
            this.nextStep('Trezor');
          }
        },
        {
          label: 'CoolWallet',
          icon: require('@/assets/images/icons/hardware-wallets/icon-coolwallet.svg'),
          fnc: () => {
            this.nextStep('CoolWallet');
          }
        },
        {
          label: 'BC Vault',
          icon: require('@/assets/images/icons/hardware-wallets/icon-bcvault.svg'),
          fnc: () => {
            this.nextStep('BC Vault');
          }
        },
        {
          label: 'XWallet',
          icon: require('@/assets/images/icons/hardware-wallets/icon-xwallet.svg'),
          fnc: () => {
            this.nextStep('XWallet');
          }
        }
      ],
      step: 0,
      steps: {}
    };
  },
  computed: {
    title() {
      return !this.step ? 'Hardware Wallets' : this.steps[this.step];
    }
  },
  methods: {
    accessBack() {
      !this.step ? this.close() : (this.step -= 1);
    },
    overlayClose() {
      this.close();
    },
    nextStep(str) {
      this.step += 1;
      this.steps[this.step] = str;
    }

    // this.unlockLedger
    // this.unlockBitbox
    // this.unlockFinney
    // this.unlockSecalot
    // this.unlockKeepKey
    // this.unlockTrezor
    // this.unlockCoolWallet
    // this.unlockBcVault
    // this.unlockXWallet
  }
};
</script>

<style lang="scss" scoped>
.button-container {
  height: 100px;
}
</style>
