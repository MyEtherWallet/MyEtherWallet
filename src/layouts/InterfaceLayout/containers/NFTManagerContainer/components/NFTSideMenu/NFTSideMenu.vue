<template>
  <div class="nft-side-menu">
    <div class="desktop-menu">
      <div class="d-flex align-items-center">
        <div>
          <h2 class="mr-4 mb-0">{{ $t('nftManager.avail-nft') }}</h2>
        </div>
        <b-button
          size="sm"
          variant="outline-primary"
          @click="openCustomModal"
          >{{ $t('nftManager.custom') }}</b-button
        >
      </div>
      <p class="mb-4">
        {{ $t('nftManager.select-item') }}
      </p>

      <b-row>
        <b-col
          v-for="v in sortByCount"
          :key="v.key"
          cols="4"
          md="4"
          lg="3"
          class="mb-4"
        >
          <NftProductCard
            :data="v"
            :selected="v.contract === selected ? true : false"
            @click.native="selectNft(v)"
          >
            <i
              v-show="v.customNft"
              class="fa fa-times-circle clickable remove"
              @click="removeCustomEntry(v)"
            />
          </NftProductCard>
        </b-col>
      </b-row>
    </div>
    <div class="mobile-menu">
      <b-dropdown :text="currentProduct">
        <b-dropdown-item
          v-for="v in sortByCount"
          :key="v.key"
          @click.native="selectNft(v)"
        >
          {{ v.name }} ({{ v.tokens.length }})
        </b-dropdown-item>
      </b-dropdown>
    </div>
  </div>
</template>

<script>
import NftProductCard from '../NftProductCard';

export default {
  components: { NftProductCard },
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
    },
    loadingComplete: {
      type: Boolean,
      default: false
    },
    sentUpdate: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      selected: '',
      searchResults: [],
      currentProduct: ''
    };
  },
  computed: {
    sortByCount() {
      return Object.values(this.supportedNftObj).sort((a, b) => {
        if (a.tokens.length < b.tokens.length) {
          return 1;
        }
        if (a.tokens.length > b.tokens.length) {
          return -1;
        }
        return 0;
      });
    }
  },
  watch: {
    loadingComplete() {
      this.setSelectedToTop();
    },
    sentUpdate() {
      this.setSelectedToTop();
    }
  },
  mounted() {
    this.selected = this.initialHighlighted;
  },
  methods: {
    openCustomModal() {
      this.$emit('openCustomModal');
    },
    setSelectedToTop() {
      this.selected = this.sortByCount[0].contract;
      this.$emit('selected', this.selected);
    },
    selectNft(nft) {
      this.currentProduct = nft.name + ' (' + nft.tokens.length + ')';
      this.searchResults = [];
      if (nft.tokens.length > 0) {
        this.selected = nft.contract;
        this.$emit('selected', nft.contract);
      }
    },
    showDetails(nft) {
      this.searchResults = [];
      this.$emit('showTokenDetails', nft);
    },
    removeCustomEntry(nft) {
      this.$emit('removeCustomNft', nft);
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
