<template>
  <div class="mt-5">
    <mew6-white-sheet class="border-radius--10px pa-4 pa-sm-12">
      <h3 class="mb-6">Enter your private key</h3>
      <!--
      =====================================================================================
        Private Key Input
      =====================================================================================
      -->
      <mew-input
        v-model="privateKey"
        label="Private Key"
        placeholder="Enter your Private Key"
        :rules="privKeyRulles"
        type="password"
      />
      <!--
      =====================================================================================
        Terms Checkbox & Access Button
      =====================================================================================
      -->
      <div class="text-center">
        <mew-checkbox
          v-model="acceptTerms"
          label="To access my wallet, I accept "
          :link="link"
          class="justify-center"
        />
        <v-row dense class="align-center justify-center pt-4">
          <v-col cols="12" sm="4">
            <mew-button
              has-full-width
              title="Access Wallet"
              btn-size="xlarge"
              :disabled="!disableBtn"
              @click.native="unlockBtn"
            />
          </v-col>
        </v-row>
      </div>
    </mew6-white-sheet>
  </div>
</template>

<script>
import { isPrivateKey } from '../handlers/helpers';
import { isValidPrivate } from 'ethereumjs-util';
import {
  getBufferFromHex,
  sanitizeHex
} from '../../../access-wallet/common/utils';
export default {
  name: 'AccessWalletPrivateKey',
  props: {
    handlerAccessWallet: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      privateKey: '',
      acceptTerms: false,
      link: {
        title: 'Terms',
        url: 'https://www.myetherwallet.com/terms-of-service'
      }
    };
  },
  computed: {
    /**
     * Property that controls Access Wallet button
     * Button is enabled when terms were accepted and
     * private key entered is valid
     * @return boolean
     */
    disableBtn() {
      return this.acceptTerms && this.isPrivKey;
    },
    /**
     * Property validates whether or not entered private key is valid
     * @return booelan
     */
    isPrivKey() {
      const _privKey = Buffer.isBuffer(this.actualPrivateKey)
        ? this.actualPrivateKey
        : getBufferFromHex(sanitizeHex(this.actualPrivateKey));
      return isPrivateKey(this.privateKey) && isValidPrivate(_privKey);
    },
    /**
     * @returns actual private without '0x' prefix
     */
    actualPrivateKey() {
      return this.privateKey.substr(0, 2) === '0x'
        ? this.privateKey.replace('0x', '')
        : this.privateKey;
    },
    /**
     * @returns rulles fot the private key input
     */
    privKeyRulles() {
      return [
        value => !!value || 'Required',
        value => isPrivateKey(value) || 'This is not a real private Key'
      ];
    }
  },
  methods: {
    /**
     * Method unlocks private key wallet,
     * Emits to the parent module to enter wallet route
     */
    unlockBtn() {
      this.handlerAccessWallet.unlockPrivateKeyWallet(this.actualPrivateKey);
      this.$emit('unlock');
      this.privateKey = '';
    }
  }
};
</script>
