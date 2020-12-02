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

      <div v-if="activeTab === 1">
        <mew6-white-sheet class="mt-7">
          <div class="pa-8">
            <v-radio-group v-model="networkSelected">
              <div v-for="(item, i) in networks" :key="i">
                <div class="text-uppercase font-weight-bold subtitle-1 mb-1">
                  {{ item.label }}
                </div>

                <v-row no-gutters>
                  <v-col
                    v-for="button in item.buttons"
                    :key="button.value"
                    cols="12"
                    md="6"
                    class="mt-2"
                  >
                    <v-radio
                      :label="button.name"
                      :value="button.value"
                    ></v-radio>
                  </v-col>
                </v-row>

                <div>{{ item.id }}</div>
                <divider-line v-if="networks.length != i + 1" class="my-5" />
              </div>
            </v-radio-group>
          </div>
        </mew6-white-sheet>
        <div class="d-flex justify-center mt-5">
          <mew-button btn-size="xlarge" title="Change" class="mt-3" />
        </div>
      </div>

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

export default {
  components: {
    dividerLine,
    buttonTabs
  },
  props: {
    open: { default: false, type: Boolean }
  },
  data() {
    return {
      activeTab: 1,
      addresses: [
        {
          address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
          currency: 'ETH',
          nickname: 'My Address',
          resolverAddr: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
        },
        {
          address: '0x43689531907482BEE7e650D18411E284A7337A66',
          currency: 'ETH',
          nickname: 'nickname',
          resolverAddr: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
        }
      ],
      tabs: [
        {
          name: 'Change network'
        },
        {
          name: 'Add network / HTTP'
        }
      ],
      networkSelected: null,
      networks: [
        {
          label: 'eth',
          buttons: [
            { name: 'myetherapi.com', value: 'myetherapi' },
            { name: 'infura.io', value: 'infura' },
            { name: 'giveth.io', value: 'giveth' },
            { name: 'therscan.io', value: 'therscan' }
          ]
        },
        {
          label: 'rop',
          buttons: [
            { name: 'myetherapi.com', value: 'myetherapi1' },
            { name: 'infura.io', value: 'infura1' },
            { name: 'giveth.io', value: 'giveth1' },
            { name: 'therscan.io', value: 'therscan1' }
          ]
        },
        {
          label: 'rin',
          buttons: [
            { name: 'myetherapi.com', value: 'myetherapi2' },
            { name: 'infura.io', value: 'infura2' },
            { name: 'giveth.io', value: 'giveth2' },
            { name: 'therscan.io', value: 'therscan2' }
          ]
        }
      ],
      exPannel: [
        {
          name: 'HTTP basic access authentication'
        }
      ],
      network: ''
    };
  }
};
</script>
