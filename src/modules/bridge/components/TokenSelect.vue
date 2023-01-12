<template>
  <div class="module-bridge-token-select full-width">
    <!-- ===================================================================================== -->
    <!-- Search Data -->
    <!-- ===================================================================================== -->
    <v-text-field
      v-model="searchInput"
      color="greenPrimary"
      outlined
      prepend-inner-icon="mdi-magnify"
      placeholder="Search"
    />

    <!-- ===================================================================================== -->
    <!-- Empty Search Message -->
    <!-- ===================================================================================== -->
    <app-user-msg-block
      v-if="showEmptySearch"
      :message="emptySearchMes"
      class="mt-5"
    />

    <div v-if="title" class="mew-label mb-2 textMedium--text">{{ title }}</div>

    <!-- ===================================================================================== -->
    <!-- Token Buttons -->
    <!-- ===================================================================================== -->
    <div>
      <div
        v-for="token in tokens"
        :key="token.name"
        class="d-flex align-center token-button"
        @click="tokenBtnClicked(token.name)"
      >
        <!-- ================================================= -->
        <!-- Icon -->
        <!-- ================================================= -->
        <mew-token-container :img="token.img" size="34px" />

        <!-- ================================================= -->
        <!-- Symbol/Name -->
        <!-- ================================================= -->
        <div class="ml-3">
          <div class="textDark--text mew-heading-3" style="margin-bottom: -1px">
            {{ token.name }}
          </div>
          <div class="textLight--text mew-body font-weight-normal">
            {{ token.subtext }}
          </div>
        </div>

        <!-- ================================================= -->
        <!-- Spacer -->
        <!-- ================================================= -->
        <v-spacer />

        <!-- ================================================= -->
        <!-- Balance -->
        <!-- ================================================= -->
        <div class="text-right">
          <div class="textDark--text mew-heading-3 font-weight-medium">
            {{ token.usdBalancef }}
          </div>
          <div class="textLight--text mew-body font-weight-normal">
            {{ token.balancef }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';

export default {
  name: 'TokenSelect',
  components: {
    AppUserMsgBlock: () => import('@/core/components/AppUserMsgBlock')
  },
  mixins: [handlerAnalytics],
  props: {
    tokensList: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tokenSelected: null,
      searchInput: ''
    };
  },
  computed: {
    ...mapGetters('global', ['network']),
    ...mapState('global', ['validNetwork']),
    ...mapState('wallet', ['identifier', 'instance', 'isOfflineApp']),
    /**
     * Property returns sorted token names by fiat value
     * @returns {string[]}
     */
    sortedTokens() {
      const sorted = this.tokensList.length > 0 ? [...this.tokensList] : [];
      sorted.sort(
        (a, b) => parseFloat(b.usdBalance) - parseFloat(a.usdBalance)
      );
      return sorted;
    },
    /**
     * Property returns filter tokens list based on search input
     * @returns {object[]}
     */
    tokens() {
      const allTokens = [...this.tokensList];
      if (this.searchInput && this.searchInput !== '') {
        return allTokens.filter(item =>
          this.hasString(item.symbol, item.subtext)
        );
      }
      return allTokens;
    },
    /**
     * Property shows invalid search if user included input and token length is 0
     * @returns {boolean}
     */
    showEmptySearch() {
      return (
        this.searchInput && this.searchInput !== '' && this.tokens.length === 0
      );
    },
    /**
     * Property shows search input string
     * @returns {object}
     */
    emptySearchMes() {
      if (this.sortedTokens.length === 0) {
        return {
          title: 'This token is not supported on the bridge',
          subtitle: ''
        };
      }
      return {
        title: '',
        subtitle: 'We do not have a token with this name.'
      };
    }
  },
  watch: {
    tokenSelected(value) {
      if (!value) return;
      this.$emit('selectedToken', value);
    },
    searchInput(newVal, oldVal) {
      /**
       * Set current token to prevent undefined tokenSelected value
       */
      if (this.tokens.length > 0) {
        // this.tokenSelected = this.networkSelectedBefore;
      }

      if (newVal != oldVal && (!oldVal || oldVal === '')) {
        // this.toggleType = 2;
      }
    }
  },
  mounted() {
    //this.tokenSelected = this.validNetwork ? this.network.type.name : '';
  },
  methods: {
    /**
     * Method checks whether symbol or name has searchInput substring
     * @returns {boolean}
     */
    hasString(symbol, name) {
      return (
        symbol.toLowerCase().includes(this.searchInput.toLowerCase()) ||
        name.toLowerCase().includes(this.searchInput.toLowerCase())
      );
    },
    tokenBtnClicked(token) {
      this.tokenSelected = token;
      this.$emit('selectedToken', token);
    }
  }
};
</script>

<style lang="scss" scoped>
$borderNetwork: 1px solid #ececec;
.network-border {
  border-bottom: $borderNetwork;
  border-right: $borderNetwork;
  border-left: $borderNetwork;
}
.network-border-first {
  border-top: $borderNetwork;
  border-radius: 4px 4px 0px 0px;
}
.network-border-last {
  border-radius: 0px 0px 4px 4px;
}
.mint-me-color {
  filter: brightness(0) saturate(100%) invert(90%) sepia(3%) saturate(5171%)
    hue-rotate(348deg) brightness(92%) contrast(63%);
}
.token-button {
  border-radius: 5px;
  padding: 12px 15px;
  margin: 0 -15px;
  user-select: none;
  &:hover {
    //background-color: var(--v-greyLight-base);
    background-color: #f5f7fb;
    cursor: pointer;
  }
}
</style>

<style lang="scss">
.module-bridge-token-select {
  .v-input__slot {
    border-radius: 10px !important;
    background-color: var(--v-backgroundGrey-base) !important;
  }
}
</style>
