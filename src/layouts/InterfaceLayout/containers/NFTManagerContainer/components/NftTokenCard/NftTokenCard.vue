<template>
  <div class="text-center cursor-pointer" @click="showNftDetails(nft)">
    <div
      v-if="!nft.contract && !nft.token_id"
      class="spinner-box d-flex justify-content-center align-items-center"
    >
      <b-spinner
        label="Large Spinner"
        variant="secondary"
        style="width: 50px; height: 50px;"
      ></b-spinner>
    </div>
    <div v-if="!imgError" class="product-img">
      <img :src="imageUrl" alt @load="hasLoaded(nft)" @error="imageError" />
    </div>
    <div v-if="imgError && imgLoaded" class="product-img">
      <img :src="placeholderImage" alt />
    </div>
    <p class="text-monospace">#{{ nft.token_id | ConcatToken }}</p>
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
      loadingImage: true,
      imgError: false,
      imgLoaded: false,
      awaitingData: true,
      placeholderImage,
      contract: '',
      imageSrc: placeholderImage
    };
  },
  computed: {
    imageUrl() {
      return `${this.nftCardUrl}?contract=${this.nft.contract}&tokenId=${
        this.nft.token_id || this.nft.token_id
      }`;
    }
  },
  watch: {
    async nft(newer) {
      this.reset();
      this.imageSrc = `${this.nftCardUrl}?contract=${newer.contract}&tokenId=${newer.token_id}`;
      this.loadingImage = !(newer.contract && newer.token_id);
    }
  },
  methods: {
    hasLoaded() {
      this.imgLoaded = true;
      this.imgError = false;
    },
    getImgUrl(nft) {
      if (!nft.token_id) {
        this.imgLoaded = false;
        return placeholderImage;
      }
      this.awaitingData = false;
      return `${this.nftCardUrl}?contract=${nft.contract}&tokenId=${nft.token_id}`;
    },
    imageError(error) {
      this.imgError = true;
      this.imgLoaded = true;
    },
    showNftDetails() {
      this.$emit('showNftDetails', this.nft);
    },
    reset() {
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
