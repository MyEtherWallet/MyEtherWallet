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
    },
    nftCardUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  },
  methods: {
    getImgUrl(name) {
      return `${this.nftCardUrl}tokenImage?token=${name}`;
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
