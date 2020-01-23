<template>
  <b-card
    class="text-center"
    :class="[
      data.tokens.length > 0 ? 'active' : 'inactive',
      selected ? 'selected' : ''
    ]"
  >
    <pre v-if="false">{{ data }}</pre>
    <div class="card-image mb-2">
      <img :src="getImgUrl(data.contract)" />
      <!--      <img v-if="data.itemName" :src="getImgUrl(data.itemName)" />-->
      <!--      <img v-else :src="getImgUrl(data.title)" />-->
    </div>
    <div class="count text-dark">{{ data.tokens.length }}</div>
    <p class="nft-name font-weight-bold text-dark">{{ data.name }}</p>
  </b-card>
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
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  methods: {
    getImgUrl(name) {
      switch (name) {
        case '0x06012c8cf97bead5deae237070f9587f8e7a266d':
          return require('@/assets/images/nft/products/Kitties.png');
        case '0x7e789e2dd1340971de0a9bca35b14ac0939aa330':
          return require('@/assets/images/nft/products/Stamp.png');
        case '0x6ebeaf8e8e946f0716e6533a6f2cefc83f60e8ab':
          return require('@/assets/images/nft/products/Cards.png');
        case '0x8bc67d00253fd60b1afcce88b78820413139f4c6':
          return require('@/assets/images/nft/products/Flowers.png');
        case '0x5d00d312e171be5342067c09bae883f9bcb2003b':
          return require('@/assets/images/nft/products/Ethermon.png');
        case 'Crabs':
          return require('@/assets/images/nft/products/Cryptantcrab.png');
        case '0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d':
          return require('@/assets/images/nft/products/Decentraland.png');
        case '0x4f41d10f7e67fd16bde916b4a6dc3dd101c57394':
          return require('@/assets/images/nft/products/Flowerpatch.png');
        default:
          return require('@/assets/images/icons/defaultToken.png');
      }
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
