<template>
  <div class="bg_blue">
    <BlockTitle :data="titleData">
      <h5 class="white--text ma-0">
        Please select a browser from below.
      </h5>
    </BlockTitle>
    <v-sheet color="transparent" max-width="850px" class="mx-auto px-5">
      <v-row>
        <v-col v-for="(btn, key) in buttons" :key="key" cols="12" sm="6">
          <TextIconButton :label="btn.label" :icon="btn.icon" :to="btn.to" />
        </v-col>
      </v-row>
    </v-sheet>
    <div class="spacer-y-medium" />
  </div>
</template>

<script>
import BlockTitle from '@/web/components/BlockTitle';
import TextIconButton from '@/web/components/Buttons/TextIconButton';

export default {
  name: 'CreateNewWallet',
  components: { BlockTitle, TextIconButton },
  data() {
    return {
      titleData: {
        textProps: 'white--text',
        toptitle: '',
        title: 'Browser extention',
        description: '',
        centered: true
      },
      buttons: [
        {
          label: 'Chrome',
          icon: require('@/assets/images/icons/icon-chrome.svg'),
          to: { name: 'AccessWalletBrowserExtentionInstall', query: {} }
        },
        {
          label: 'Firefox',
          icon: require('@/assets/images/icons/icon-firefox.svg'),
          to: { name: 'AccessWalletBrowserExtentionInstall', query: {} }
        },
        {
          label: 'Opera',
          icon: require('@/assets/images/icons/icon-opera.svg'),
          to: { name: 'AccessWalletBrowserExtentionInstall', query: {} }
        },
        {
          label: 'Brave',
          icon: require('@/assets/images/icons/icon-brave.png'),
          to: { name: 'AccessWalletBrowserExtentionInstall', query: {} }
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped></style>
