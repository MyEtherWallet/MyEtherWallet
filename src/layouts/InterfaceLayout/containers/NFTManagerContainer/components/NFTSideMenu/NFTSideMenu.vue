<template>
  <div class="nft-side-menu">
    <div class="desktop-menu">
      <input-search class="input-search-container">
        <slot />
      </input-search>
      <ul>
        <li
          v-for="i in data"
          :key="i.key"
          :class="i.contract === selected ? 'selected' : ''"
          @click="selectNft(i)"
        >
          {{ i.title }} ({{ i.count }})
        </li>
      </ul>
    </div>
    <div class="mobile-menu">
      <input-search class="input-search-container">
        <slot />
      </input-search>
      <b-dropdown text="CryptoKitties (5)">
        <b-dropdown-item v-for="i in data" :key="i.key" href="#">
          {{ i.title }} ({{ i.count }})
        </b-dropdown-item>
      </b-dropdown>
    </div>
  </div>
</template>

<script>
import InputSearch from '@/components/Inputs/InputSearch';

export default {
  components: {
    'input-search': InputSearch
  },
  props: {
    // selected:{
    //   type: String,
    //   default: ''
    // },
    data: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      selected: '0x06012c8cf97bead5deae237070f9587f8e7a266d'
    };
  },

  computed: {},
  watch: {
    data() {}
  },
  mounted() {},
  methods: {
    selectNft(nft) {
      this.selected = nft.contract;
      this.$emit('selected', nft.contract);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'NFTSideMenu.scss';
</style>
<style lang="scss">
@import '~@/scss/GlobalVariables';

.nft-side-menu .mobile-menu {
  .btn-group {
    width: 100%;
  }
  .btn-secondary,
  .btn-secondary:active {
    background-color: white;
    color: $dark-blue-2;
    border: 1px solid $light-grey-7;
    padding: 15px 25px;
    font-size: 18px;
    font-weight: 600;
    text-align: left;
  }
  .dropdown-menu {
    width: 100%;
    border: 1px solid $light-grey-7;
  }
  .dropdown-item {
    padding: 15px 30px;
  }
}
</style>
