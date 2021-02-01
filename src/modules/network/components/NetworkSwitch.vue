<template>
  <mew-overlay
    :show-overlay="open"
    left-btn-text=""
    right-btn-text="Close"
    @closeOverlay="$emit('close')"
  >
    <template #mewOverlayBody>
      <h2 class="text-center mb-10">Network</h2>
      <button-tabs
        v-model="activeTab"
        :tabs="['Change network', 'Add network / HTTP']"
      />

      <v-sheet
        v-if="activeTab === 1"
        color="transparent"
        max-width="700px"
        width="100%"
        class="mx-auto"
      >
        <mew6-white-sheet full-width class="mt-7">
          <div class="pa-8">
            <v-radio-group v-model="networkSelected">
              <div v-for="(item, i) in typeNames" :key="i">
                <div class="text-uppercase font-weight-bold subtitle-1 mb-1">
                  {{ item }}
                </div>

                <v-row no-gutters>
                  <v-col
                    v-for="network in networks[item]"
                    :key="network.value"
                    cols="12"
                    md="6"
                    class="mt-2"
                  >
                    <v-radio
                      :label="network.name"
                      :value="network.value"
                    ></v-radio>
                  </v-col>
                </v-row>

                <div>{{ item.id }}</div>
                <divider-line v-if="typeNames.length != i + 1" class="my-5" />
              </div>
            </v-radio-group>
          </div>
        </mew6-white-sheet>
      </v-sheet>

      <div v-if="activeTab === 2">
        <mew6-white-sheet class="mt-7">
          <div class="pa-4 pa-md-8">
            <div>
              <mew-address-select label="Network" :items="addresses" />
              <mew-input label="ETH Node Name" placeholder="Type node name" />
              <mew-input label="URL" placeholder="Type URL" />
              <mew-input label="Port" placeholder="Type port number" />

              <mew-expand-panel
                class="mb-7"
                is-toggle
                has-dividers
                :panel-items="exPannel"
              >
                <template #panelBody1>
                  <mew-input label="Username" placeholder=" " />
                  <mew-input label="Password" placeholder=" " />
                </template>
              </mew-expand-panel>

              <div class="d-flex justify-center">
                <mew-button btn-size="xlarge" title="Save" />
              </div>
            </div>
          </div>
        </mew6-white-sheet>
      </div>
    </template>
  </mew-overlay>
</template>

<script>
import dividerLine from '@/components/divider-line/DividerLine';
import buttonTabs from '@/components/tabs/buttonTabs/ButtonTabs';
import * as nodes from '@/utils/networks/nodes';
import * as types from '@/utils/networks/types';
import { mapActions, mapGetters } from 'vuex';
import { Toast, SUCCESS } from '@/components/toast';
export default {
  components: {
    dividerLine,
    buttonTabs
  },
  props: {
    open: { type: Boolean, default: false },
    close: { type: Function, default: () => {} }
  },
  data() {
    return {
      activeTab: 1,
      tabs: [
        {
          name: 'Change network'
        },
        {
          name: 'Add network / HTTP'
        }
      ],
      networkSelected: null,
      types: types,
      nodes: nodes
    };
  },
  computed: {
    ...mapGetters('global', ['network']),
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
    ...mapActions('wallet', ['setWeb3Instance']),
    ...mapActions('global', ['setNetwork'])
  }
};
</script>
