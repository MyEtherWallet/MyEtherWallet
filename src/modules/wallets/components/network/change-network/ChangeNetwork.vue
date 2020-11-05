<template>
  <mew-overlay
    :show-overlay="open"
    title="Change Network"
    left-btn-text=""
    right-btn-text="Close"
    :close="close"
  >
    <template #mewOverlayBody>
      <mew6-white-sheet>
        <v-sheet color="white" min-width="500px" class="mx-auto pa-8">
          <div>
            <v-radio-group v-model="networkSelected">
              <div v-for="(item, i) in typeNames" :key="i">
                <div class="text-uppercase font-weight-bold subtitle-1 mb-1">
                  {{ item }}
                </div>

                <v-row no-gutters>
                  <v-col
                    v-for="network in networks[item]"
                    :key="network.value"
                    cols="6"
                    class="mt-2"
                  >
                    <v-radio
                      :label="network.name"
                      :value="network.value"
                    ></v-radio>
                  </v-col>
                </v-row>

                <div>{{ item.id }}</div>
                <divider-line v-if="types.length != i + 1" class="my-5" />
              </div>
            </v-radio-group>
          </div>
        </v-sheet>
      </mew6-white-sheet>
    </template>
  </mew-overlay>
</template>

<script>
import dividerLine from '@/components/divider-line/DividerLine';
import * as nodes from '@/utils/networks/nodes';
import * as types from '@/utils/networks/types';
import { mapState, mapActions } from 'vuex';
import { Toast, SUCCESS } from '@/components/toast';
export default {
  components: {
    dividerLine
  },
  props: {
    open: { type: Boolean, default: false },
    close: { type: Function, default: () => {} }
  },
  data() {
    return {
      networkSelected: null,
      types: types,
      nodes: nodes
    };
  },
  computed: {
    ...mapState('wallet', ['network']),
    typeNames() {
      return ['ETH', 'ROP', 'RIN', 'GOERLI', 'KOV', 'ETC'];
    },
    networks() {
      const newObj = {};
      Object.keys(this.types).forEach(item => {
        newObj[item] = [];
      });

      Object.keys(this.nodes).forEach(item => {
        if (this.nodes[item]) {
          newObj[this.nodes[item].type.name].push({
            name: this.nodes[item].service,
            value: this.nodes[item].url
          });
        }
      });

      return newObj;
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
    ...mapActions('wallet', ['setNetwork', 'setWeb3Instance'])
  }
};
</script>
