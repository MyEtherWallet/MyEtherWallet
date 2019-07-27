<template>
  <div class="crypto-kitties-details">
    <!--    <interface-container-title title="NFT Manager" />-->
    <div class="crypto-kitties-details-content-container">
      <back-button @click.native="goBack" />
      <div class="grid-container">
        <div class="kitty-image">
          <img :src="nft.image" />
        </div>
        <div class="kitty-text">
          <h3>Send My CryptoKitty</h3>
          <p>#{{ nft.token }}</p>
        </div>
      </div>
      <div class="address-input-container">
        <address-selector title="To Address" />
        <div class="send-button-container">
          <standard-button :options="sendButton" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle';
import SmallBackButton from '@/layouts/InterfaceLayout/components/SmallBackButton';
import DropDownAddressSelector from '@/components/DropDownAddressSelector';
import StandardButton from '@/components/Buttons/StandardButton';

// Please remove these images after "NFT Manager" development is done. (@/assets/images/temp)
import kitty1 from '@/assets/images/temp/kitty1.svg';

export default {
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'back-button': SmallBackButton,
    'address-selector': DropDownAddressSelector,
    'standard-button': StandardButton
  },
  props: {
    nft: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      kitty: { number: 3362, img: kitty1 },
      sendButton: {
        title: 'Send',
        buttonStyle: 'green',
        helpCenter: true,
        noMinWidth: true,
        fullWidth: true
      }
    };
  },

  computed: {},
  watch: {},
  mounted() {},
  methods: {
    goBack() {
      console.log('back'); // todo remove dev item
      this.$emit('back');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'NftDetails.scss';
</style>
