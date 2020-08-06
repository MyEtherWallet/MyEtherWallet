<template>
  <mew-overlay :show-overlay="open" title="Network" right-btn-text="Close">
    <template v-slot:mewComponent>
      <mew-tabs :items="tabs" is-block>
        <template v-slot:tabContent1>
          <mew6-white-sheet>
            <div class="pa-8">
              <div>
                <v-radio-group v-model="networkSelected">
                  <div v-for="(item, i) in networks" :key="i">
                    <div
                      class="text-uppercase font-weight-bold subtitle-1 mb-1"
                    >
                      {{ item.label }}
                    </div>

                    <v-row no-gutters>
                      <v-col
                        v-for="button in item.buttons"
                        :key="button.value"
                        cols="6"
                        class="mt-2"
                      >
                        <v-radio
                          :label="button.name"
                          :value="button.value"
                        ></v-radio>
                      </v-col>
                    </v-row>

                    <div>{{ item.id }}</div>
                    <divider-line
                      v-if="networks.length != i + 1"
                      class="my-5"
                    />
                  </div>
                </v-radio-group>
                <div class="d-flex justify-center">
                  <mew-button
                    button-size="xlarge"
                    title="Change"
                    class="mt-3"
                  />
                </div>
              </div>
            </div>
          </mew6-white-sheet>
        </template>
        <template v-slot:tabContent2>
          <mew6-white-sheet>
            <div class="pa-8">
              <div>
                <!-- <DropdownSelect
      v-model="network"
      label="Network"
      placeholder="Select a network"
      :items="networks"
    /> -->
                <mew-input label="ETH Node Name" placeholder="Type node name" />
                <mew-input label="URL" placeholder="Type URL" />
                <mew-input label="Port" placeholder="Type port number" />

                <mew-expand-panel
                  class="mb-7"
                  is-toggle
                  has-dividers
                  :panel-items="exPannel"
                >
                  <template v-slot:panelBody1>
                    <mew-input label="Username" placeholder=" " />
                    <mew-input label="Password" placeholder=" " />
                  </template>
                </mew-expand-panel>

                <div class="d-flex justify-center">
                  <mew-button button-size="xlarge" title="Save" />
                </div>
              </div>
            </div>
          </mew6-white-sheet>
        </template>
      </mew-tabs>
    </template>
  </mew-overlay>
</template>

<script>
import dividerLine from '@/components/divider-line/DividerLine';

export default {
  components: {
    dividerLine
  },
  props: {
    open: { default: false, type: Boolean }
  },
  data() {
    return {
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
