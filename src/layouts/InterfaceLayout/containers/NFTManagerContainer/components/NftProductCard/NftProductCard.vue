<template>
  <b-card
    class="text-center"
    :class="[
      data.count > 0 ? 'active' : 'inactive',
      selected ? 'selected' : ''
    ]"
  >
    <div class="card-image mb-2">
      <img v-if="data.itemName" :src="getImgUrl(data.itemName)" />
      <img v-else :src="getImgUrl(data.title)" />
    </div>
    <div class="count text-dark">{{ data.count }}</div>
    <p class="nft-name font-weight-bold text-dark">{{ data.title }}</p>
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
