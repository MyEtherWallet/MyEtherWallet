<template>
  <div class="bg_blue">
    <BlockTitle :data="titleData" />
    <v-sheet color="transparent" max-width="650px" class="mx-auto">
      <KeystoreFile class="cursor--pointer user-select--none mb-5" />
      <MnemonicPhrase class="cursor--pointer user-select--none mb-5" />
      <mew6-warning-not-recommended />
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
