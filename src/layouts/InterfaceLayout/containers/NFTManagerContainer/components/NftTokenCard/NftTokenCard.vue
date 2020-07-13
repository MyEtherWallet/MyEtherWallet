<template>
  <div
    class="text-center cursor-pointer"
    @click="showNftDetails(nft)"
  >
    <div
      v-if="!hasImage(nft)"
      class="spinner-box d-flex justify-content-center align-items-center"
    >
      <b-spinner
        label="Large Spinner"
        variant="secondary"
        style="width: 50px; height: 50px;"
      ></b-spinner>
    </div>
    <div v-if="!imgError" class="product-img">
      <img
        :src="getImgUrl(nft)"
        alt
        @load="hasLoaded(nft)"
        @error="imageError"
      />
    </div>
    <div v-if="imgError && imgLoaded" class="product-img">
      <img :src="placeholderImage" alt />
    </div>
    <p class="text-monospace">#{{ nft.name | ConcatToken }}</p>
  </div>
</template>

<script>
import placeholderImage from '@/assets/images/icons/defaultToken.png';
export default {
  filters: {
    ConcatToken(value) {
      if (!value) return '';
      if (value.length > 20)
        return `${value.substr(0, 15)}...${value.substr(value.length - 6)}`;
      return value;
    }
  },
  props: {
    nft: {
      type: Object,
      default: function () {
        return {};
      }
    },
    selected: {
      type: Boolean,
      default: false
    },
    nftCardUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      imgError: false,
      imgLoaded: false,
      awaitingData: true,
      placeholderImage,
      contract: '',
      imageSrc: placeholderImage
    };
  },
  watch: {
    async nft(newer, old) {
      this.reset();
      this.imageSrc = `${this.nftCardUrl}?contract=${newer.contract}&tokenId=${newer.tokenId}`
      console.log(old, newer); // todo remove dev item
    }
  },
  // async mounted() {
  //   console.log('MOUNTED'); // todo remove dev item
  // },
  methods: {
    hasLoaded(nft) {
      this.$set(nft, 'loaded', true);
      this.imgLoaded = true;
    },
    hasImage(nft) {
      if (nft.customNft || nft.image === '') {
        return true;
      }
      if (nft.loaded) {
        return true;
      }
      if (this.imgLoaded) {
        return true;
      }
    },
    getImgUrl(nft) {
      if (!nft.tokenId) {
        this.imgLoaded = false;
        return placeholderImage;
      }
      this.awaitingData = false;
      console.log(
        `${this.nftCardUrl}?contract=${nft.contract}&tokenId=${nft.tokenId}`
      ); // todo remove dev item
      return `${this.nftCardUrl}?contract=${nft.contract}&tokenId=${nft.tokenId}`;
    },
    imageError(error) {
      console.log(error); // todo remove dev item
      if (!this.awaitingData) {
        this.imgError = true;
        this.imgLoaded = true;
      }
    },
    showNftDetails(){
      this.$emit('showNftDetails', this.nft);
    },
    reset(){
      this.imgError = false;
      this.imgLoaded = false;
      this.awaitingData = true;
    }
  }
};
</script>

<style lang="scss" scoped>
  @import 'NftTokenCard.scss';
</style>
