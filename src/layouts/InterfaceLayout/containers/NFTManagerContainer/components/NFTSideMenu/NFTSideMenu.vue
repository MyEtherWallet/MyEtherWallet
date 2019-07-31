<template>
  <div class="nft-side-menu">
    <div class="desktop-menu">
<!--      <input-search class="input-search-container">-->
<!--        <input v-model="vals" />-->
<!--        <ul>-->
<!--          <li-->
<!--            v-for="item in searchResults"-->
<!--            :key="item.token"-->
<!--            @click="showDetails(item)"-->
<!--          >-->
<!--            {{ item.token }}-->
<!--          </li>-->
<!--        </ul>-->
<!--      </input-search>-->
      <ul class="listing-container">
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
<!--      <input-search class="input-search-container">-->
<!--        <slot />-->
<!--      </input-search>-->
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
    data: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      vals: '',
      selected: '0x06012c8cf97bead5deae237070f9587f8e7a266d',
      searchResults: []
    };
  },

  computed: {
    selectedContractTokens() {
      if (this.data[this.selected]) {
        return this.data[this.selected].details;
      }
      return [];
    }
  },
  watch: {
    vals(newVal) {
      if (newVal === '') {
        this.searchResults = [];
      } else {
        this.searchForToken(newVal);
      }
      console.log('vals', newVal); // todo remove dev item
    },
    data() {}
  },
  mounted() {},
  methods: {
    selectNft(nft) {
      this.searchResults = [];
      if(nft.count > 0){
        this.selected = nft.contract;
        this.$emit('selected', nft.contract);
      }
    },
    showDetails(nft) {
      this.searchResults = [];
      console.log(nft); // todo remove dev item
      this.$emit('showTokenDetails', nft);
    },
    searchForToken(val) {
      this.searchResults = this.selectedContractTokens.filter(entry => {
        if (entry.token) {
          console.log(entry.token); // todo remove dev item
          // return false;
          return entry.token.toString().includes(val);
        }
        return false;
      });
      // this.searchResults = raw.map(entry => entry.token);
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
