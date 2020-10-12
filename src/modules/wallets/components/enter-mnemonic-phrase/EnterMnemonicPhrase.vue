<template>
  <div class="mew-component--insert-mnemonic-phrase">
    <v-sheet color="transparent" max-width="800px" class="mx-auto">
      <div v-if="currentPage === 1">
        <h2 class="text-center mb-10">1. Enter your mnemonic phrase</h2>
        <mew6-white-sheet class="border-radius--10px pa-4 pa-sm-12">
          <div class="headline font-weight-bold mb-2">Mnemonic phrase</div>
          <div class="mb-5">
            Please type the mnemonic phrase you wrote down in the right order.
          </div>
          <div class="d-flex align-center justify-end pb-4">
            <v-select
              v-model="phraseSize"
              style="max-width: 150px"
              hide-details
              dense
              item-text="label"
              item-value="value"
              :items="mnemonicOptions"
              label=""
              outlined
              @change="setPhrases"
            ></v-select>
          </div>
          <phrase-block class="mb-8">
            <mnemonic-phrase-input-table :data="phrases" />
          </phrase-block>

          <mew-expand-panel
            is-toggle
            has-dividers
            :panel-items="extraWordsPanel"
          >
            <template #panelBody1>
              <mew-input label="Extra word" placeholder=" " />
            </template>
          </mew-expand-panel>

          <div class="d-flex justify-center mt-6">
            <mew-button
              title="Next"
              button-size="xlarge"
              :has-full-width="false"
              @click.native="currentPage = 2"
            />
          </div>
        </mew6-white-sheet>
      </div>

      <div v-if="currentPage === 2" class="confirm">
        <h2 class="text-center mb-10">2. Confirm network & address</h2>

        <mew-expand-panel :panel-items="changeNetwork" class="mb-2">
          <template #panelBody1>
            <v-radio-group v-model="networkSelected">
              <div v-for="(network, i) in networks" :key="i">
                <div class="text-uppercase font-weight-bold subtitle-1 mb-1">
                  {{ network.label }}
                </div>

                <v-row no-gutters>
                  <v-col
                    v-for="button in network.buttons"
                    :key="button.value"
                    cols="12"
                    sm="6"
                    class="mt-2"
                  >
                    <v-radio
                      :label="button.name"
                      :value="button.value"
                    ></v-radio>
                  </v-col>
                </v-row>

                <div>{{ network.id }}</div>
                <divider-line v-if="networks.length != i + 1" class="my-5" />
              </div>
            </v-radio-group>
          </template>
        </mew-expand-panel>

        <mew-expand-panel :panel-items="addressToInteract">
          <template #panelBody1>
            <mew-table
              style="margin: 0 -24px"
              :table-headers="tableHeaders"
              :table-data="tableData"
              has-select
            />
            <div class="d-flex align-center justify-center mt-5">
              <div class="cursor--pointer mx-4">&lt; Previous</div>
              <div class="cursor--pointer mx-4">Next &gt;</div>
            </div>
          </template>
        </mew-expand-panel>
        <mew-checkbox
          class="mt-5 justify-center"
          label="To access my wallet, I accept"
          :link="linkToTerms"
        />

        <div class="d-flex justify-center mt-2">
          <mew-button
            title="Access my wallet"
            button-size="xlarge"
            :has-full-width="false"
            @click.native="currentPage = 1"
          />
        </div>
      </div>

      <page-indicator-dot class="mt-4" :items="2" :current-item="currentPage" />

      <warning-sheet
        title="NOT RECOMMENDED"
        description='This information is sensitive, and these options should only be used in offline settings by experienced crypto users. And MEW "CAN NOT" change your password. Please "DO NOT FORGET" to save your password, and it is your private key. You will need this "Password + Keystore file" to access your wallet.'
      />
      <div class="spacer-y-medium" />
    </v-sheet>
  </div>
</template>

<script>
import pageIndicatorDot from '@/components/page-indicator-dot/PageIndicatorDot';
import phraseBlock from '../phrase-block/PhraseBlock';
import mnemonicPhraseInputTable from '../mnemonic-phrase-input-table/MnemonicPhraseInputTable';
import MnemonicTools from '@/helpers/mnemonicTools';
import dividerLine from '@/components/divider-line/DividerLine';

export default {
  name: 'EnterMnemonicPhrase',
  components: {
    pageIndicatorDot,
    phraseBlock,
    mnemonicPhraseInputTable,
    dividerLine
  },
  data: () => ({
    currentPage: 1,
    mnemonicOptions: [
      {
        label: '12 words',
        value: 12
      },
      {
        label: '24 words',
        value: 24
      }
    ],
    phrases: [],
    phraseSize: 12,
    extraWordsPanel: [
      {
        name: 'Add extra word',
        subtext: 'Optional',
        tooltip: 'Tooltip'
      }
    ],
    changeNetwork: [
      {
        name: 'Network',
        subtext: 'ETH - myetherapi.com'
      }
    ],
    addressToInteract: [
      {
        name: 'Address to interact with'
      }
    ],
    tableHeaders: [
      {
        text: 'Address',
        value: 'address',
        sortable: false,
        filterable: false,
        width: '100%'
      },
      {
        text: 'Eth Balance',
        value: 'ethBalance',
        sortable: false,
        filterable: false,
        containsLink: true,
        width: '100%'
      },
      {
        text: '#Token',
        value: 'token',
        sortable: false,
        filterable: false,
        containsLink: true,
        width: '100%'
      }
    ],
    tableData: [
      {
        address: '9834759283750173071305',
        ethBalance: '0.0001 ETH',
        token: '21'
      },
      {
        address: '9834759283750173071305ergerthtr',
        ethBalance: '2.23 ETH',
        token: '10'
      },
      {
        address: '9834759283750173071erger305',
        ethBalance: '0.23 ETH',
        token: '8'
      }
    ],
    linkToTerms: {
      title: 'Terms.',
      url: 'https://www.myetherwallet.com/terms-of-service'
    },
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
    ]
  }),
  mounted() {
    this.setPhrases();
  },
  methods: {
    setPhrases() {
      if (this.phraseSize == 12) {
        this.phrases = MnemonicTools.phrase12();
      } else {
        this.phrases = MnemonicTools.phrase24();
      }
    }
  }
};
</script>
