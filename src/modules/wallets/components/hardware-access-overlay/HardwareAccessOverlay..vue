<template>
  <mew-overlay
    :show-overlay="open"
    :title="title"
    right-btn-text="Cancel"
    :back="accessBack"
    :close="overlayClose"
  >
    <template v-slot:mewOverlayBody>
      <div v-if="!step">
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
                    @click.native="nextStep(button.type)"
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
      </div>
      <mew6-white-sheet v-else-if="step === 1">
        <div class="overlay-content pa-8">
          <div class="text-center mb-8">
            <img :src="icon" alt="Network Icon" height="60" />
          </div>
          <div>
            <mew-select
              v-if="walletType === 'ledger'"
              v-model="selectedLedgerApp"
              label="Opened Ledger App"
              :items="ledgerApps"
            />
            <mew-select
              v-model="selectedPath"
              label="HD derivation path"
              :items="paths"
            />
          </div>
          <mew-button
            button-size="xlarge"
            title="Unlock wallet"
            has-full-width
            @click.native="nextStep"
          />
        </div>
      </mew6-white-sheet>
    </template>
  </mew-overlay>
</template>

<script>
import bcvaultWallet from '@/modules/wallets/utils/hardware/bcvault';
import bitboxWallet from '@/modules/wallets/utils/hardware/bitbox';
import bitbox02Wallet from '@/modules/wallets/utils/hardware/bitbox02';
import coolwalletWallet from '@/modules/wallets/utils/hardware/coolwallet';
import keepkeyWallet from '@/modules/wallets/utils/hardware/keepkey';
import ledgerWallet from '@/modules/wallets/utils/hardware/ledger';
import secalotWallet from '@/modules/wallets/utils/hardware/secalot';
import trezorWallet from '@/modules/wallets/utils/hardware/trezor';
import mewconnectWallet from '@/modules/wallets/utils/hybrid/MEWconnect';

import appPaths from '@/modules/wallets/utils/hardware/ledger/appPaths.js';
import allPaths from '@/modules/wallets/utils/bip44';
import { mapState } from 'vuex';

const parsedAppPaths = appPaths.map(item => {
  const newObj = {
    name: item.network.name_long
  };

  return newObj;
});
import {
  LEDGER as ledgerType,
  TREZOR as trezorType,
  BITBOX as bitboxType,
  BITBOX02 as bitbox02Type,
  SECALOT as secalotType,
  KEEPKEY as keepkeyType,
  FINNEY as finneyType,
  XWALLET as xwalletType,
  BCVAULT as bcvaultType,
  COOLWALLET as coolwalletType
} from '@/modules/wallets/utils/bip44/walletTypes.js';

const walletHolder = {
  [ledgerType]: {
    create: ledgerWallet,
    when: 2,
    hasPaths: true,
    requiresPassword: false
  },
  [trezorType]: {
    create: trezorWallet,
    when: 1,
    hasPaths: true,
    requiresPassword: false
  },
  [bitboxType]: {
    create: bitboxWallet,
    when: 2,
    hasPaths: true,
    requiresPassword: true
  },
  [bitbox02Type]: {
    create: bitbox02Wallet,
    when: 2,
    hasPaths: true,
    requiresPassword: false
  },
  [secalotType]: {
    create: secalotWallet,
    when: 2,
    hasPaths: true,
    requiresPassword: true
  },
  [keepkeyType]: {
    create: keepkeyWallet,
    when: 1,
    hasPaths: true,
    requiresPassword: false
  },
  [finneyType]: {
    create: mewconnectWallet,
    when: 2,
    hasPaths: false,
    requiresPassword: false
  },
  [xwalletType]: {
    create: mewconnectWallet,
    when: 2,
    hasPaths: false,
    requiresPassword: false
  },
  [bcvaultType]: {
    create: bcvaultWallet,
    when: 1,
    hasPaths: false,
    requiresPassword: false
  },
  [coolwalletType]: {
    create: coolwalletWallet,
    when: 2,
    hasPaths: false,
    requiresPassword: true
  }
};

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
          type: ledgerType
        },
        {
          label: 'Bitbox',
          icon: require('@/assets/images/icons/hardware-wallets/icon-bitbox.svg'),
          type: bitboxType
        },
        {
          label: 'FINNEY',
          icon: require('@/assets/images/icons/hardware-wallets/icon-finney.svg'),
          type: finneyType
        },
        {
          label: 'Secalot',
          icon: require('@/assets/images/icons/hardware-wallets/icon-secalot.svg'),
          type: secalotType
        },
        {
          label: 'KeepKey',
          icon: require('@/assets/images/icons/hardware-wallets/icon-keepkey.svg'),
          type: keepkeyType
        },
        {
          label: 'Trezor',
          icon: require('@/assets/images/icons/hardware-wallets/icon-trezor.svg'),
          type: trezorType
        },
        {
          label: 'CoolWallet',
          icon: require('@/assets/images/icons/hardware-wallets/icon-coolwallet.svg'),
          type: coolwalletType
        },
        {
          label: 'BC Vault',
          icon: require('@/assets/images/icons/hardware-wallets/icon-bcvault.svg'),
          type: bcvaultType
        },
        {
          label: 'XWallet',
          icon: require('@/assets/images/icons/hardware-wallets/icon-xwallet.svg'),
          type: xwalletType
        }
      ],
      step: 0,
      steps: {},
      hwWalletInstance: {},
      selectedPath: null,
      wallets: walletHolder,
      walletInstance: {},
      walletType: '',
      selectedLedgerApp: '',
      ledgerApps: parsedAppPaths
    };
  },
  computed: {
    ...mapState(['network']),
    icon() {
      if (this.selectedLedgerApp !== '') {
        const found = appPaths.find(item => {
          return item.network.name_long === this.selectedLedgerApp.name;
        });

        return found ? found.network.icon : appPaths[0].network.icon;
      }

      return appPaths[0].network.icon;
    },
    paths() {
      const newArr = [];
      if (this.walletType === ledgerType) {
        if (this.selectedLedgerApp !== '') {
          const found = appPaths.find(item => {
            return item.network.name_long === this.selectedLedgerApp.name;
          });
          const path = found ? found.paths : appPaths[0].paths;
          path.forEach(item => {
            newArr.push({
              name: item.label,
              value: item.path
            });
          });

          return newArr;
        }

        appPaths[0].paths.forEach(item => {
          newArr.push({
            name: item.label,
            value: item.path
          });
        });
      }

      if (this.wallets[this.walletType].hasPaths) {
        allPaths[this.walletType].forEach(item => {
          newArr.push({
            name: item.label,
            value: item.path
          });
        });
      }

      return newArr;
    },
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
      try {
        const actualString =
          typeof str === 'string' && str !== '' ? str : this.walletType;
        if (!this.step) {
          this.walletType = actualString;
        }
        this.step += 1;
        this.steps[this.step] = actualString;
        if (this.wallets[actualString].when === this.step) {
          this.walletInstance = this.wallets[actualString].create();
        }
      } catch (e) {
        console.log(e);
      }
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
