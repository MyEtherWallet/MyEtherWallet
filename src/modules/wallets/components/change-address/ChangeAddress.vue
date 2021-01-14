<template>
  <mew-overlay
    :show-overlay="open"
    title="1. Connect with Ledger"
    right-btn-text="Close"
  >
    <!--        <template #panelBody2>
      <div>
        <v-radio-group v-model="selectedAddress">
          <table width="100%">
            <thead>
            <tr class="table-header">
              <th width="50%" class="align-center">Address</th>
              <th width="25%" class="align-center">
                Eth Balance
              </th>
              <th width="25%" class="align-center">
                # of Tokens
              </th>
            </tr>
            </thead>
            <tbody class="table-row-class">
            <tr
              v-for="acc in accounts"
              v-show="accounts.length > 0"
              :key="acc.address"
            >
              <td>
                <v-row justify="space-around">
                  <v-col cols="1">
                    <v-radio label="" :value="acc.address" />
                  </v-col>
                  <v-col cols="8" class="text-truncate">
                    <v-row justify="space-around">
                      <mew-blockie
                        width="25px"
                        height="25px"
                        :address="acc.address"
                      />
                      <span>{{
                          acc.address | concatAddress
                        }}</span>
                    </v-row>
                    <input
                      :ref="acc.address"
                      :value="acc.address"
                      class="address-copy-input"
                    />
                  </v-col>
                  <v-col cols="2">
                    <v-row>
                      <v-icon
                        small
                        class="cursor&#45;&#45;pointer"
                        @click="copy(acc.address)"
                      >mdi-content-copy</v-icon
                      >
                      <v-icon
                        small
                        class="cursor&#45;&#45;pointer"
                        @click="launchExplorrer(acc.address)"
                      >mdi-launch</v-icon
                      >
                    </v-row>
                  </v-col>
                </v-row>
              </td>
              <td>
                {{
                  acc.balance === 'Loading..'
                    ? acc.balance
                    : `${acc.balance} ${network.type.name}`
                }}
              </td>
              <td>{{ acc.tokens }}</td>
            </tr>
            <tr v-show="accounts.length === 0">
              Loading...
            </tr>
            </tbody>
          </table>
        </v-radio-group>
        <br />
        <v-row align="center" justify="center">
          <div>
            <mew-button
              title="Previous"
              color-theme="basic"
              icon="mdi-chevron-left"
              icon-type="mdi"
              :has-full-width="false"
              btn-size="small"
              icon-align="left"
              btn-style="transparent"
              :disabled="addressPage <= 1"
              @click.native="previousAddressSet"
            />
            <mew-button
              title="Next"
              color-theme="basic"
              icon="mdi-chevron-right"
              icon-type="mdi"
              :has-full-width="false"
              btn-size="small"
              icon-align="right"
              btn-style="transparent"
              @click.native="nextAddressSet"
            />
          </div>
        </v-row>
      </div>
    </template>-->
    <template #mewOverlayBody>
      <mew-tabs :items="tabs" is-block>
        <template #tabContent1>
          <mew6-white-sheet>
            <v-radio-group v-model="selectedAddress">
              <table width="100%">
                <thead>
                <tr class="table-header">
                  <th width="50%" class="align-center">Address</th>
                  <th width="25%" class="align-center">Eth Balance</th>
                  <th width="25%" class="align-center"># of Tokens</th>
                </tr>
                </thead>
                <tbody class="table-row-class">
                <tr
                  v-for="acc in accounts"
                  v-show="accounts.length > 0"
                  :key="acc.address"
                >
                  <td>
                    <v-row justify="space-around">
                      <v-col cols="1">
                        <v-radio label="" :value="acc.address" />
                      </v-col>
                      <v-col cols="8" class="text-truncate">
                        <v-row justify="space-around">
                          <mew-blockie
                            width="25px"
                            height="25px"
                            :address="acc.address"
                          />
                          <span>{{ acc.address | concatAddress }}</span>
                        </v-row>
                        <input
                          :ref="acc.address"
                          :value="acc.address"
                          class="address-copy-input"
                        />
                      </v-col>
                      <v-col cols="2">
                        <v-row>
                          <v-icon
                            small
                            class="cursor--pointer"
                            @click="copy(acc.address)"
                          >mdi-content-copy</v-icon
                          >
                          <v-icon
                            small
                            class="cursor--pointer"
                            @click="launchExplorrer(acc.address)"
                          >mdi-launch</v-icon
                          >
                        </v-row>
                      </v-col>
                    </v-row>
                  </td>
                  <td>
                    {{
                      acc.balance === 'Loading..'
                        ? acc.balance
                        : `${acc.balance} ${network.type.name}`
                    }}
                  </td>
                  <td>{{ acc.tokens }}</td>
                </tr>
                <tr v-show="accounts.length === 0">
                  Loading...
                </tr>
                </tbody>
              </table>
            </v-radio-group>
<!--            <div class="pa-8">-->
<!--              <div class="mt-2 mb-9 text-center">-->
<!--                <mew-icon icon-name="ETH" img-height="100"></mew-icon>-->
<!--              </div>-->
<!--              <mew-select-->
<!--                :items="apps"-->
<!--                select-label="Choose your coin"-->
<!--                placeholder="Search..."-->
<!--                class="mb-1"-->
<!--              />-->
<!--              <mew-select-->
<!--                :items="path"-->
<!--                select-label="HD derivation path"-->
<!--                placeholder="Search..."-->
<!--                class="mb-1"-->
<!--              />-->

<!--              <div class="text-center">-->
<!--                <mew-button title="Connect with Ledger" btn-size="xlarge" />-->
<!--              </div>-->
<!--            </div>-->
          </mew6-white-sheet>
        </template>
        <template #tabContent2>
          <v-sheet max-width="750px">
            <mew-expand-panel :panel-items="panelItems">
              <template #panelBody1>
one
              </template>
              <template #panelBody2>
                two
<!--                <mew-table-->
<!--                  has-select-->
<!--                  has-color-->
<!--                  :table-select-headers="tableHeaders"-->
<!--                  :table-select-data="tableData"-->
<!--                />-->
              </template>
            </mew-expand-panel>
          </v-sheet>
          <div class="pa-8">
            <div class="text-center">
              <mew-button title="Access My Wallet" btn-size="xlarge" />
            </div>
          </div>
        </template>
      </mew-tabs>
    </template>
  </mew-overlay>
</template>

<script>
import { mapState } from 'vuex';

const MAX_ADDRESSES = 5;

export default {
  filters: {
    concatAddress(val) {
      // should probably be moved globablly
      return `${val.substring(0, 11)}...${val.substring(
        val.length - 4,
        val.length
      )}`;
    }
  },
  props: {
    open: { default: false, type: Boolean },
    close: {
      default: function () {
        return {};
      },
      type: Function
    }
  },
  data() {
    return {
      // resettable
      step: 0,
      steps: {},
      hwWalletInstance: {},
      selectedPath: null,
      walletType: '',
      selectedLedgerApp: {
        name: '',
        value: ''
      },
      selectedAddress: '',
      password: '',
      selectedNetwork: '',
      accounts: [],
      currentIdx: 0,
      acceptTerms: false,
      addressPage: 0,
      qrcode: '',
      bcvaultLoading: false,
      walletInstance: {},
      tabs: [
        {
          name: 'Tab 1'
        },
        {
          name: 'Tab 2'
        }
      ],
      appSelected: '',
      apps: [
        { name: 'Ethereum', value: 'eth' },
        { name: 'Ethereum2', value: 'eth2' },
        { name: 'Ethereum3', value: 'eth3' }
      ],
      pathSelected: '',
      path: [
        { name: "m/44'/60'/0'", value: '1' },
        { name: "m/44'/60'/2'", value: '2' }
      ],
      panelItems: [
        {
          name: 'Network',
          subtext: 'ETH - myetherwallet.com'
        },
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
          width: '40%'
        },
        {
          text: '#Token',
          value: 'token',
          sortable: false,
          filterable: false,
          containsLink: true,
          width: '30%'
        }
      ],
      tableData: [
        {
          ethBalance: '0.0001 ETH',
          token: '21',
          address: '0xAECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
        },
        {
          ethBalance: '2.23 ETH',
          token: '10',
          address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
        },
        {
          ethBalance: '0.23 ETH',
          token: '8',
          address: '0xAECFF9CD2367cdbb726E904cD6397eDFcAe6068D',
          edit: 'Edit'
        }
      ]
    };
  },
  computed: {
    ...mapState('wallet', [
      'balance',
      'currency',
      'network',
      'address',
      'instance'
    ])
  },
  mounted(){
    console.log(this.instance); // todo remove dev item
  },
  methods: {
    async setAddresses() {
      try {
        this.accounts = [];
        for (
          let i = this.currentIdx;
          i < this.currentIdx + MAX_ADDRESSES;
          i++
        ) {
          const account = await this.instance.getAccount(i);
          this.accounts.push({
            address: account.getAddressString(),
            account: account,
            idx: i,
            balance: 'Loading..',
            tokens: 'Loading..'
          });
        }

        this.addressPage += 1;
        this.currentIdx += MAX_ADDRESSES;
        this.selectedAddress = this.accounts[0].address;
      } catch (e) {
        this.instance.errorHandler(e);
      }
    },
    nextAddressSet() {
      this.setAddresses();
    },
    previousAddressSet() {
      const pageDeductor = this.currentIdx / MAX_ADDRESSES;
      const idxDeductor = this.addressPage * MAX_ADDRESSES;
      this.addressPage -=
        this.currentIdx <= 10 ? pageDeductor : pageDeductor - 1;
      this.currentIdx -=
        this.currentIdx <= 10 ? idxDeductor : idxDeductor - MAX_ADDRESSES;
      this.setAddresses();
    }
  }
};
</script>
