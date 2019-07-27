<template>
  <div class="crypto-kitties-manager">
    <interface-container-title title="NFT Manager" />
    <div class="inner-side-menu content-container">
      <nft-side-menu :data="sideMenuData">
        <input type="text" placeholder="Search #" />
      </nft-side-menu>
      <div>
        <content-block-title :button-text="kittyCount" title="CryptoKittes" />
        <div class="grid-container">
          <div v-for="kitty in kitties" :key="kitty.key" class="kitty">
            <div class="kitty-img"><img :src="kitty.img" /></div>
            <p>#{{ kitty.number }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="flex--row--align-start mft-manager-content-container"></div>
  </div>
</template>

<script>
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle';
import ContentBlockTitle from '@/layouts/InterfaceLayout/components/ContentBlockTitle';
import NFTSideMenu from '@/layouts/InterfaceLayout/containers/NFTManagerContainer/components/NFTSideMenu';

// Please remove these images after "NFT Manager" development is done. (@/assets/images/temp)
import kitty1 from '@/assets/images/temp/kitty1.svg';
import kitty2 from '@/assets/images/temp/kitty2.svg';
import kitty3 from '@/assets/images/temp/kitty3.svg';
import kitty4 from '@/assets/images/temp/kitty4.svg';
import kitty5 from '@/assets/images/temp/kitty5.svg';
import kitty6 from '@/assets/images/temp/kitty6.svg';

export default {
  components: {
    'content-block-title': ContentBlockTitle,
    'nft-side-menu': NFTSideMenu,
    'interface-container-title': InterfaceContainerTitle
  },
  props: {
    data: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      kitties: [
        { number: 3362, img: kitty1 },
        { number: 3632, img: kitty2 },
        { number: 8362, img: kitty3 },
        { number: 1362, img: kitty4 },
        { number: 8362, img: kitty5 },
        { number: 6362, img: kitty6 }
      ],
      sideMenuData: [
        {
          title: 'CryptoKitties',
          count: 5,
          selected: true
        },
        {
          title: 'Gods Unchained',
          count: 2,
          selected: false
        },
        {
          title: 'CryptoFlowers',
          count: 0,
          selected: false
        },
        {
          title: 'MyCryptoHeros',
          count: 7,
          selected: false
        }
      ]
    };
  },

  computed: {
    kittyCount() {
      return 'You own ' + this.kitties.length + ' CryptoKitties';
    }
  },
  watch: {},
  mounted() {}
};
</script>

<style lang="scss" scoped>
@import 'CryptoKittiesManager.scss';
</style>
