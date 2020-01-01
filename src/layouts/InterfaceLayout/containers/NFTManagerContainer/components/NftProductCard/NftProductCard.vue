<template>
  <b-card class="text-center" :class="data.count > 0 ? 'active' : 'inactive'">
    <div class="card-image mb-2">
      <img v-if="data.itemName" :src="getImgUrl(data.itemName)" />
      <img v-else :src="getImgUrl(data.title)" />
    </div>
    <div class="count text-dark">{{ data.count }}</div>
    <p class="font-weight-bold text-dark">{{ data.title }}</p>
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
.count {
  font-size: 30px;
  font-weight: 500;
}

.card-image img {
  width: 100px;
  height: 100px;
}

.card {
  height: 100%;
}

.card-body {
  background-color: #f1f1f1;
  border-radius: 0.25rem;
}

.inactive {
  opacity: 0.4;
}

.active {
  opacity: 1;
  cursor: pointer;
}
</style>
