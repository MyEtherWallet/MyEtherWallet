<template>
  <div class="module-network-switch full-width">
    <v-row class="align-end justify-center justify-sm-space-between pa-0">
      <!-- ===================================================================================== -->
      <!-- Search Data -->
      <!-- ===================================================================================== -->
      <v-col cols="12" class="order-sm-1 full-width">
        <mew-search
          placeholder="Search"
          :value="searchInput"
          @input="setSearch"
        />
      </v-col>
    </v-row>

    <!-- ===================================================================================== -->
    <!-- Empty Search Message -->
    <!-- ===================================================================================== -->
    <app-user-msg-block
      v-if="showEmptySearch"
      :message="emptySearchMes"
      class="mt-5"
    />

    <!-- ===================================================================================== -->
    <!-- Tokens -->
    <!-- ===================================================================================== -->
    <v-radio-group v-model="tokenSelected">
      <v-container
        v-for="(token, i) in tokensList"
        :key="token.name"
        :class="[
          { 'network-border-first': i === 0 },
          { 'network-border-last': i + 1 === tokensList.length },
          'py-4 px-5 network-border'
        ]"
      >
        <v-row class="pa-0 mew-body align-center justify-start">
          <!-- ===================================================================================== -->
          <!-- Icon -->
          <!-- ===================================================================================== -->
          <mew-token-container :img="token.img" size="24px" />
          <!-- ===================================================================================== -->
          <!-- Symbol/Name -->
          <!-- ===================================================================================== -->
          <div class="textDark--text Capitalize pl-3">
            {{ token.name }}
          </div>
          <div class="px-2 textLight--text">-</div>
          <div class="textLight--text">
            {{ token.subtext }}
          </div>
          <v-spacer />

          <!-- ===================================================================================== -->
          <!-- Radio -->
          <!-- ===================================================================================== -->
          <v-radio :value="token.name" :class="['py-2 mb-0']"> </v-radio>
        </v-row>
      </v-container>
    </v-radio-group>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';

import * as types from '@/utils/networks/types';

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
     * Property returns sorted network names alphabetically in this order: ETH, main and then test networks
     * @returns {string[]}
     */
    typeNames() {
      const unsorted = this.tokensList.length > 0 ? [...this.tokensList] : [];
      const EthIdx = unsorted.indexOf('ETH');
      if (EthIdx !== -1) unsorted.splice(EthIdx, 1);
      unsorted.sort();
      if (EthIdx !== -1) unsorted.unshift('ETH');
      return unsorted;
    },
    /**
     * Property returns filter networks list based on search input and toggle  type
     * @returns {object[]}
     */
    tokens() {
      let allNetworks = [];
      this.typeNames.forEach(item => {
        allNetworks.push(types[item]);
      });
      allNetworks = allNetworks.filter(
        item =>
          item.name === types.ETH.name ||
          item.name === types.BSC.name ||
          item.name === types.MATIC.name
      );
      if (this.searchInput && this.searchInput !== '') {
        return allNetworks.filter(item =>
          this.hasString(item.name, item.name_long)
        );
      }
      return allNetworks;
    },
    /**
     * Property shows invalid search if user included input and networks length is 0
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
      if (this.typeNames.length === 0) {
        return {
          title: 'This token is not supported on the bridge',
          subtitle: ''
        };
      }
      return {
        title: '',
        subtitle: 'We do not have a network with this name.'
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
       * Set current network to prevent undefined tokenSelected value
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
    this.tokenSelected = this.validNetwork ? this.network.type.name : '';
  },
  methods: {
    ...mapActions('wallet', ['setWeb3Instance']),
    ...mapActions('global', ['setNetwork']),
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
    /**
     * Method sets SearchInout on mew-search input event
     * @returns {boolean}
     */
    setSearch(newVal) {
      this.searchInput = newVal;
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
</style>
