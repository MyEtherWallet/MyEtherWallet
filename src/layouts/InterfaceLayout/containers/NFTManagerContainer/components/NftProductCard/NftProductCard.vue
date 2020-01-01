<template>
  <div class="nft-card p-3">
    <div class="card-image">
      <img v-if="data.itemName" :src="getImgUrl(data.itemName)" />
      <img v-else :src="getImgUrl(data.title)" />
    </div>
    <p>{{ data.itemName }}</p>
    <p>{{ data.title }}</p>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    data: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  methods: {
    getImgUrl(name) {
      if (name == 'Kitties')
        return require('@/assets/images/nft/products/Kitties.png');
      if (name == 'Stamp')
        return require('@/assets/images/nft/products/Stamp.png');
      if (name == 'Cards')
        return require('@/assets/images/nft/products/Cards.png');
      if (name == 'Flowers')
        return require('@/assets/images/nft/products/Flowers.png');
      if (name == 'Etheremon')
        return require('@/assets/images/nft/products/Ethermon.png');
      if (name == 'Crabs')
        return require('@/assets/images/nft/products/Cryptantcrab.png');
      if (name == 'parcels')
        return require('@/assets/images/nft/products/Decentraland.png');
    }
  }
};
</script>

<style lang="scss" scoped>
.nft-card {
  border: 1px solid black;
  border-radius: 10px;
}

.card-image img {
  width: 100px;
  height: 100px;
}
</style>
