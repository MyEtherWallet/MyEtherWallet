<template>
  <div class="bg_blue">
    <BlockTitle :data="titleData" />
    <v-sheet color="transparent" max-width="650px" class="mx-auto">
      <KeystoreFile class="cursor--pointer user-select--none mb-5" />
      <MnemonicPhrase class="cursor--pointer user-select--none mb-5" />
      <warning-sheet
        title="NOT RECOMMENDED"
        description='This information is sensitive, and these options should only be used in offline settings by experienced crypto users. And MEW "CAN NOT" change your password. Please "DO NOT FORGET" to save your password, and it is your private key. You will need this "Password + Keystore file" to access your wallet.'
      />
    </v-sheet>
    <div class="spacer-y-medium" />
  </div>
</template>

<script>
import BlockTitle from '@/web/components/BlockTitle';
import KeystoreFile from './components/KeystoreFile';
import MnemonicPhrase from './components/MnemonicPhrase';

export default {
  name: 'Software',
  components: { BlockTitle, KeystoreFile, MnemonicPhrase },
  data: () => ({
    titleData: {
      textProps: 'white--text',
      toptitle: '',
      title: 'Software',
      titleMaxWidth: '',
      description: 'This would be most simplest way to create your wallet!',
      descriptionMaxWidth: '400px',
      centered: true
    }
  })
};
</script>
