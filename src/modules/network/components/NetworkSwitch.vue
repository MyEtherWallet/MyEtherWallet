<template>
  <mew-overlay
    :show-overlay="open"
    title="Select Network"
    left-btn-text=""
    right-btn-text="Close"
    @closeOverlay="$emit('close')"
  >
    <template #mewOverlayBody>
      <v-sheet color="white" max-width="740px" width="100%" class="mx-auto">
        <!-- <h2 class="text-center mt-13 mb-8">Select Network</h2> -->

        <v-sheet
          color="transparent"
          max-width="516px"
          width="100%"
          class="mx-auto pb-2 pb-am-8 px-3 pt-3 px-sm-0"
        >
          <v-row
            class="
              align-end
              justify-center justify-sm-space-between
              px-0
              pt-5 pt-3
            "
          >
            <!--
            =====================================================================================
              Toggle: Main/Test/All
            =====================================================================================
            -->
            <div
              class="
                align-center align-sm-end
                justify-center
                pr-sm-3
                pb-sm-3
                order-sm-2
              "
            >
              <v-btn-toggle
                v-model="toggleType"
                mandatory
                active-class="titlePrimary white--text alig-end"
              >
                <v-btn small>Main</v-btn>
                <v-btn small>Test</v-btn>
                <v-btn small>All</v-btn>
              </v-btn-toggle>
            </div>
            <!--
            =====================================================================================
              Search Data
            =====================================================================================
            -->
            <v-col cols="12" sm="7" class="order-sm-1">
              <mew-search placeholder="Find Network" :value="searchInput" />
            </v-col>
          </v-row>
          <!--
          =====================================================================================
            Networks
          =====================================================================================
          -->
          <v-radio-group v-model="networkSelected" class="networks-container">
            <v-container
              v-for="(network, i) in networks"
              :key="network.name"
              :class="[
                { 'network-border-bottom': i + 1 < networks.length },
                'py-4 px-5'
              ]"
            >
              <v-row class="pa-0 mew-body align-center justify-start">
                <!--
                =====================================================================================
                  Incon
                =====================================================================================
                -->
                <v-img
                  :src="network.icon"
                  :lazy-src="
                    require('@/assets/images/currencies/icon-eth-grey.svg')
                  "
                  contain
                  max-height="24px"
                  max-width="24px"
                />
                <!--
                =====================================================================================
                  Symbol/Namte
                =====================================================================================
                -->
                <div class="titlePrimary--text Capitalize pl-3">
                  {{ network.name }}
                </div>
                <div class="px-2 textSecondary--text">-</div>
                <div class="textSecondary--text">
                  {{ network.name_long }}
                </div>
                <v-spacer />
                <!--
                =====================================================================================
                  Radio
                =====================================================================================
                -->
                <v-radio :value="network.name" :class="['py-2 mb-0']">
                </v-radio>
              </v-row>
            </v-container>
          </v-radio-group>
        </v-sheet>
      </v-sheet>
    </template>
  </mew-overlay>
</template>

<script>
import * as nodes from '@/utils/networks/nodes';
import * as types from '@/utils/networks/types';
import { mapActions, mapGetters } from 'vuex';
import { Toast, SUCCESS } from '@/modules/toast/handler/handlerToast';
export default {
  name: 'NetworkSwitch',
  props: {
    open: { type: Boolean, default: false },
    close: { type: Function, default: () => {} }
  },
  data() {
    return {
      networkSelected: null,
      types: types,
      nodes: nodes,
      toggleType: 0,
      searchInput: ''
    };
  },
  computed: {
    ...mapGetters('global', ['network']),
    typeNames() {
      const typeNames = Object.keys(types);
      typeNames.splice(typeNames.indexOf('ETH'), 1);
      typeNames.unshift('ETH');
      return typeNames;
    },

    networks() {
      const allNetworks = [];
      this.typeNames.forEach(item => {
        allNetworks.push(types[item]);
      });
      console.log(allNetworks);
      return allNetworks;

      // Object.keys(this.nodes).forEach(item => {
      //   if (this.nodes[item]) {
      //     newObj[this.nodes[item].type.name].push({
      //       name: this.nodes[item].service,
      //       value: this.nodes[item].url
      //     });
      //   }
      // });

      // return newObj;
    }
  },
  watch: {
    networkSelected(value, oldVal) {
      const found = Object.values(this.nodes).filter(item => {
        if (item.url === value) {
          return item;
        }
      });
      if (oldVal) {
        try {
          this.setNetwork(found[0]).then(() => {
            this.setWeb3Instance();
            Toast(
              `Switched network to: ${found[0].type.name} - ${found[0].service}`,
              {},
              SUCCESS
            );
            this.close();
          });
        } catch (e) {
          Toast(`Couldn't network`, {}, SUCCESS);
        }
      }
    }
  },
  mounted() {
    this.networkSelected = this.network.url;
  },
  methods: {
    ...mapActions('wallet', ['setWeb3Instance']),
    ...mapActions('global', ['setNetwork'])
  }
};
</script>
<style lang="scss" scoped>
.networks-container {
  max-width: 516px;
}

.network-border-bottom {
  border-bottom: 1px solid #ececec;
}

.v-radio label {
  left: -8px !important;
}

.v-input--radio-group__input {
  border: 1px solid #ececec;
  box-sizing: border-box;
  border-radius: 4px;
}
</style>
