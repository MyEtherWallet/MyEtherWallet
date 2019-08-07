<template>
  <div class="nft-side-menu">
    <div class="desktop-menu">
      <ul class="listing-container">
        <li
          v-for="i in sortByCount"
          :key="i.key"
          :class="i.contract === selected ? 'selected' : ''"
          @click="selectNft(i)"
        >
          {{ i.title }} ({{ i.count }})
        </li>
      </ul>
    </div>
    <div class="mobile-menu">
      <b-dropdown text="CryptoKitties (5)">
        <b-dropdown-item v-for="i in sortByCount" :key="i.key" href="#">
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
    supportedNftObj: {
      type: Object,
      default: function() {
        return {};
      }
    },
    initialHighlighted: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      selected: '',
      searchResults: []
    };
  },
  computed: {
    sortByCount() {
      return Object.values(this.supportedNftObj).sort((a, b) => {
        if (a.count < b.count) {
          return -1;
        }
        if (a.count > b.count) {
          return 1;
        }
        return 0;
      });
    }
  },
  watch: {},
  mounted() {
    this.selected = this.initialHighlighted; //Object.keys(this.data)[0];
    // this.$emit('selected', this.selected);
  },
  methods: {
    selectNft(nft) {
      this.searchResults = [];
      if (nft.count > 0) {
        this.selected = nft.contract;
        this.$emit('selected', nft.contract);
      }
    },
    showDetails(nft) {
      this.searchResults = [];
      this.$emit('showTokenDetails', nft);
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
