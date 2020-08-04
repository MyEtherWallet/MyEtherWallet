<template>
  <div>
    <mew-overlay :show-overlay="open" :title="typeTitle">
      <template v-slot:mewOverlayBody>
        <v-sheet
          v-if="type === '' && step === 0"
          color="transparent"
          max-width="650px"
          class="mx-auto"
        >
          <div class="mb-5">
            <mew-super-button
              color-theme="basic"
              title="Keystore File"
              subtitle="Keystore file contains all the sensitive information of your wallet.
                  We don't recommand using this method to create your wallet."
              icon-type="img"
              :right-icon="
                require('@/assets/images/icons/icon-keystore-file.svg')
              "
              @click.native="
                () => {
                  createType('keystore');
                }
              "
            />
          </div>
          <div class="mb-5">
            <mew-super-button
              class="mb-1"
              color-theme="basic"
              title="Mnemonic phrase"
              subtitle="Mnemonic Phrase can be lost or stolen by someone else. We don't
                  recommand using this method to create your wallet."
              icon-type="img"
              :right-icon="require('@/assets/images/icons/icon-mnemonic.svg')"
              @click.native="
                () => {
                  createType('mnemonic');
                }
              "
            />
          </div>
          <warning-sheet
            title="NOT RECOMMENDED"
            description='This information is sensitive, and these options should only be used in offline settings by experienced crypto users. And MEW "CAN NOT" change your password. Please "DO NOT FORGET" to save your password, and it is your private key. You will need this "Password + Keystore file" to access your wallet.'
          />
        </v-sheet>
        <div v-else-if="type === 'keystore'">
          <keystore :update-step="updateStep" :step="step" />
        </div>
        <div v-else-if="type === 'mnemonic'">
          <mnemonic-phrase :update-step="updateStep" :step="step" />
        </div>
      </template>
    </mew-overlay>
  </div>
</template>

<script>
import Keystore from '@/modules/wallets/components/Keystore';
import MnemonicPhrase from '@/modules/wallets/components/MnemonicPhrase';

export default {
  name: 'Software',
  components: { keystore: Keystore, 'mnemonic-phrase': MnemonicPhrase },
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    type: '',
    step: 0
  }),
  computed: {
    typeTitle() {
      return this.type === ''
        ? 'Software'
        : this.type === 'keystore'
        ? 'Keystore File'
        : 'Mnemonic Phrase';
    }
  },
  watch: {
    type(newVal) {
      if (newVal === '') {
        this.step = 0;
      } else {
        this.step = 1;
      }
    },
    step(newVal) {
      console.log(newVal);
    }
  },
  methods: {
    createType(type) {
      this.type = type ? type : '';
    },
    updateStep(step) {
      this.step = step ? step : 0;
    }
  }
};
</script>
