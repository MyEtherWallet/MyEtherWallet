<template>
  <div>
    <BaseOverlay :open="open">
      <BlockTitle
        :data="
          type === ''
            ? softwareTitle
            : type === 'keystore'
            ? keyStoreTitle
            : mnemonicTtitle
        "
      />
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
                updateStep(1);
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
          />
        </div>
        <warning-sheet
          title="NOT RECOMMENDED"
          description='This information is sensitive, and these options should only be used in offline settings by experienced crypto users. And MEW "CAN NOT" change your password. Please "DO NOT FORGET" to save your password, and it is your private key. You will need this "Password + Keystore file" to access your wallet.'
        />
      </v-sheet>
      <div v-else-if="type === 'keystore'">
        <Keystore :update-step="updateStep" :step="step" />
      </div>
      <div v-else-if="type === 'mnem'"></div>
    </BaseOverlay>
  </div>
</template>

<script>
import BlockTitle from '@/components/BlockTitle';
import BaseOverlay from '@/components/Overlays/BaseOverlay';
import Keystore from '../Keystore';

export default {
  name: 'Software',
  components: { BlockTitle, BaseOverlay, Keystore },
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    softwareTitle: {
      textProps: 'black--text',
      title: 'Software',
      description: 'This would be most simplest way to create your wallet!',
      descriptionMaxWidth: '400px',
      centered: true
    },
    keyStoreTitle: {
      textProps: 'black--text',
      title: 'Keystore file',
      description:
        'An official, free companion App for MyEtherWallet that helps you secure your funds as never before.',
      descriptionMaxWidth: '400px',
      centered: true
    },
    mnemonicTtitle: {
      textProps: 'black--text',
      title: 'Mnemonic Phrase',
      description: 'This would be most simplest way to create your wallet!',
      descriptionMaxWidth: '400px',
      centered: true
    },
    type: '',
    step: 0
  }),
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
