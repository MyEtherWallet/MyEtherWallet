<template>
  <div class="light-blue darken-4 py-12">
    <BlockTitle :data="titleData" class="mb-10" />
    <v-sheet color="transparent" max-width="650px" class="mx-auto">
      <KeystoreFile class="cursor--pointer user-select--none mb-5" />
      <MnemonicPhrase class="cursor--pointer user-select--none mb-5" />
      <NotRecommended class="border-radius--10px" />
    </v-sheet>

    <div class="py-6" />
  </div>
</template>

<script>
import BlockTitle from '@/web/components/BlockTitle';
import KeystoreFile from './components/KeystoreFile';
import MnemonicPhrase from './components/MnemonicPhrase';
import NotRecommended from '@/web/components/NotRecommended';

export default {
  name: 'Software',
  components: { BlockTitle, KeystoreFile, MnemonicPhrase, NotRecommended },
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
