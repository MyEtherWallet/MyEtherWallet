<template>
  <b-card
    class="text-center"
    :class="[
      data.count > 0 ? 'active' : 'inactive',
      selected ? 'selected' : ''
    ]"
  >
    <div v-if="!imgError" class="card-image mb-2">
      <img :src="getImgUrl(data.contract)" @error="imageError"/>
      <!--      <img v-if="data.itemName" :src="getImgUrl(data.itemName)" />-->
      <!--      <img v-else :src="getImgUrl(data.title)" />-->
    </div>
    <div v-if="imgError" class="card-image mb-2">
      <img :src="placeholderImage" @error="imageError"/>
      <!--      <img v-if="data.itemName" :src="getImgUrl(data.itemName)" />-->
      <!--      <img v-else :src="getImgUrl(data.title)" />-->
    </div>
    <div class="count text-dark">{{ data.count }}</div>
    <p class="nft-name font-weight-bold text-dark">{{ data.name }}</p>
  </b-card>
</template>

<script>
import placeholderImage from '@/assets/images/icons/defaultToken.png';
export default {
  components: {},
  props: {
    data: {
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
      placeholderImage
    };
  },
  methods: {
    getImgUrl(name) {
      return `${this.nftCardUrl}?contract=${name}&tokenId=cardImage`;
    },
    imageError(error){
      console.log(error); // todo remove dev item
      this.imgError = true;
      }
  }
};
</script>

<style lang="scss" scoped>
.count {
  font-size: 25px;
  font-weight: 700;
}

.nft-name {
  font-size: 10px;
}

.card-image img {
  width: 80px;
  height: 80px;
}

.card {
  height: 100%;
  border-color: transparent;
}

.card-body {
  background-color: #f1f1f1;
  border-radius: 0.25rem;
}

.inactive {
  opacity: 0.3;
}

.active {
  opacity: 1;
  cursor: pointer;
}

.selected {
  border-color: black;
  .card-body {
    background-color: #e0e0e0;
  }
}
</style>
