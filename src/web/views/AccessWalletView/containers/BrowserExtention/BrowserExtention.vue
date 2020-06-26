<template>
  <div class="bg_blue">
    <v-sheet color="transparent" max-width="450px" class="mx-auto">
      <BlockTitle :data="titleData">
        <h5 class="white--text ma-0">
          Please select a browser from below.
        </h5>
      </BlockTitle>
    </v-sheet>
    <v-sheet color="transparent" max-width="850px" class="mx-auto px-5">
      <v-row>
        <v-col v-for="(btn, key) in buttons" :key="key" cols="12" sm="6">
          <TextIconButton
            :data="btn"
            @click.native="openOverlay(btn.overlayName)"
          />
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
          overlayName: 'accessWalletLedger'
        },
        {
          label: 'Firefox',
          icon: require('@/assets/images/icons/icon-firefox.svg'),
          overlayName: 'accessWalletBitbox'
        },
        {
          label: 'Opera',
          icon: require('@/assets/images/icons/icon-opera.svg'),
          overlayName: 'accessWalletFinney'
        },
        {
          label: 'Brave',
          icon: require('@/assets/images/icons/icon-brave.png'),
          overlayName: 'accessWalletSecalot'
        }
      ]
    };
  },
  methods: {
    openOverlay(name) {
      this.$store.commit('openOverlay', name);
    }
  }
};
</script>

<style lang="scss" scoped>
.new-wallet-button {
  &:hover {
    box-shadow: 0 0 50px var(--v-police_strobe-base);
  }
}
</style>
