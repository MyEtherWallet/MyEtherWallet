<template>
  <div class="expandHeader">
    <block-title :data="titleData">
      <h5 class="white--text ma-0">Please select a browser from below.</h5>
    </block-title>
    <v-sheet color="transparent" max-width="400px" class="mx-auto px-5">
      <div v-for="(btn, key) in buttons" :key="key" class="mb-3">
        <router-link :to="btn.to" class="display--block">
          <div
            class="white titlePrimary--text d-flex align-center justify-space-between py-6 px-6 text-transform--initial border-radius--5px"
            style="width: 100%; height: initial; letter-spacing: initial"
          >
            <div class="d-flex align-center">
              <img
                class="mr-2"
                :src="btn.icon"
                :alt="btn.label"
                style="height: 38px"
              />
              <div>{{ btn.label }}</div>
            </div>
            <div>Install</div>
          </div>
        </router-link>
      </div>
    </v-sheet>
    <div class="spacer-y-medium" />
  </div>
</template>

<script>
import blockTitle from '@/components/block-title/BlockTitle';

export default {
  name: 'CreateNewWallet',
  components: { blockTitle },
  data() {
    return {
      titleData: {
        textProps: 'white--text',
        toptitle: '',
        title: 'Browser Extension',
        description: '',
        centered: true
      },
      buttons: [
        {
          label: 'Chrome',
          icon: require('@/assets/images/icons/icon-chrome.svg'),
          to: { name: 'BrowserExtensionInstall', query: {} }
        },
        {
          label: 'Firefox',
          icon: require('@/assets/images/icons/icon-firefox.svg'),
          to: { name: 'BrowserExtensionInstall', query: {} }
        },
        {
          label: 'Opera',
          icon: require('@/assets/images/icons/icon-opera.svg'),
          to: { name: 'BrowserExtensionInstall', query: {} }
        },
        {
          label: 'Brave',
          icon: require('@/assets/images/icons/icon-brave.png'),
          to: { name: 'BrowserExtensionInstall', query: {} }
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped></style>
