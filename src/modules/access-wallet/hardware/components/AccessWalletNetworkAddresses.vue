<template>
  <v-sheet
    :outlined="true"
    color="white"
    :rounded="true"
    :max-width="740"
    :min-width="475"
    :min-height="340"
    class="border-radius--10px pa-4 pa-md-10"
  >
    <v-container>
      <v-row class="align-end justify-start">
        <v-col cols="12">
          <!--
          =====================================================================================
            Title
          =====================================================================================
          -->
          <div class="subtitle-1 font-weight-bold grey--text">
            STEP {{ step + 1 }}.
          </div>
          <div class="headline font-weight-bold">
            {{ $t('accessWallet.network-addr.select-title') }}
          </div>
          <p class="mb-5">
            {{ $t('accessWallet.network-addr.select') }}
          </p>
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="12">
          <mew-expand-panel
            :interactive-content="true"
            :panel-items="panelItems"
          >
            <!--
            =====================================================================================
             Panel: Select Address
            =====================================================================================
            -->
            <template #panelBody1>
              <div class="network-container custom-scroll-bar ml-3 mr-n3 pr-3">
                <v-radio-group v-model="selectedAddress">
                  <!--
                    =====================================================================================
                      Table - Header
                    =====================================================================================
                    -->
                  <v-row dense class="table-header">
                    <v-col offset="2">
                      <p class="">{{ $t('common.addr') }}</p>
                    </v-col>
                    <v-col cols="4" sm="3">
                      <p>ETH {{ $t('common.balance.string') }}</p>
                    </v-col>
                  </v-row>
                  <!--
                    =====================================================================================
                      Table - Address Row
                    =====================================================================================
                    -->
                  <v-row
                    v-for="acc in accounts"
                    v-show="accounts.length > 0"
                    :key="acc.address"
                    dense
                    class="table-row-class align-center justify-start py-1"
                  >
                    <v-col cols="2" sm="1">
                      <v-radio label="" :value="acc.address" class="mx-2" />
                    </v-col>
                    <v-col cols="6" sm="8">
                      <v-row
                        dense
                        class="
                          align-center
                          justify-start
                          pl-1 pl-sm-3
                          pr-2 pr-sm-3
                        "
                      >
                        <mew-blockie
                          width="25px"
                          height="25px"
                          :address="acc.address"
                          class="mr-2"
                        />
                        <v-col cols="9" class="d-none d-sm-flex">
                          <mew-transform-hash :hash="acc.address" />
                        </v-col>
                        <p class="d-block d-sm-none">
                          {{ acc.address | concatAddress }}
                        </p>
                        <mew-copy
                          is-small
                          :copy-ref="acc.address"
                          tooltip="Copy Address"
                          :copy-value="acc.address"
                          class="ml-2"
                        />
                        <v-icon
                          small
                          class="cursor--pointer ml-2"
                          @click="launchExplorrer(acc.address)"
                          >mdi-launch</v-icon
                        >
                      </v-row>
                    </v-col>
                    <v-col cols="4" sm="3">
                      <p>
                        {{
                          acc.balance === 'Loading..'
                            ? acc.balance
                            : `${acc.balance} ${network.type.name}`
                        }}
                      </p>
                    </v-col>
                  </v-row>
                </v-radio-group>
                <!--
                  =====================================================================================
                   Previous / Next Buttons
                  =====================================================================================
                  -->
                <v-row align="center" justify="center">
                  <div>
                    <mew-button
                      :title="$t('accessWallet.previous')"
                      color-theme="basic"
                      icon="mdi-chevron-left"
                      icon-type="mdi"
                      btn-size="small"
                      icon-align="left"
                      btn-style="transparent"
                      @click.native="previousAddressSet"
                    />
                    <mew-button
                      :title="$t('accessWallet.next')"
                      color-theme="basic"
                      icon="mdi-chevron-right"
                      icon-type="mdi"
                      btn-size="small"
                      icon-align="right"
                      btn-style="transparent"
                      @click.native="nextAddressSet"
                    />
                  </div>
                </v-row>
              </div>
            </template>
            <!--
            =====================================================================================
              Panel: Networks
            =====================================================================================
            -->
            <template #panelBody2>
              <network-switch
                :is-wallet="false"
                :filter-types="filterNetworks"
                @newNetwork="setNetworkPanel"
              />
            </template>
          </mew-expand-panel>
          <!--
          =====================================================================================
            Access Buttons
          =====================================================================================
          -->
          <div class="d-flex align-center flex-column">
            <mew-button
              :title="$t('accessWallet.access-my-wallet')"
              btn-size="large"
              :disabled="!(selectedAddress && acceptTerms)"
              @click.native="
                () => {
                  setHardwareWallet(wallet.account);
                }
              "
            />
            <mew-checkbox
              v-model="acceptTerms"
              :label="$t('accessWallet.accept-terms')"
              :link="link"
              class="justify-center"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script>
import { mapGetters } from 'vuex';
import NetworkSwitch from '@/modules/network/components/NetworkSwitch.vue';

export default {
  components: { NetworkSwitch },
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
    step: {
      type: Number,
      default: 0
    },
    accounts: {
      type: Array,
      default: () => {
        return [];
      }
    },
    nextAddressSet: {
      type: Function,
      default: () => {}
    },
    previousAddressSet: {
      type: Function,
      default: () => {}
    },
    setHardwareWallet: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      acceptTerms: false,
      selectedAddress: '',
      panelNetworkSubstring: '',
      link: {
        title: 'Terms',
        url: 'https://www.myetherwallet.com/terms-of-service'
      }
    };
  },
  computed: {
    ...mapGetters('global', ['network']),
    /**
     * Returns the selected address account
     */
    wallet() {
      const wallet = this.accounts.find(item => {
        return item.address === this.selectedAddress;
      });
      return wallet ? wallet : null;
    },
    /**
     * Property returns edited version of the selected address. ie: 0x3453...3a3b
     */
    panelAddressSubstring() {
      return this.selectedAddress && this.selectedAddress !== ''
        ? `${this.selectedAddress.substring(
            0,
            6
          )} ... ${this.selectedAddress.substring(
            this.selectedAddress.length - 4,
            this.selectedAddress.length
          )}`
        : '';
    },
    /**
     * Property returns expand panel items for the Address and Network
     */
    panelItems() {
      return [
        {
          name: 'Address',
          subtext: this.panelAddressSubstring,
          colorTheme: 'superPrimary',
          hasActiveBorder: true
        },
        {
          name: 'Network',
          subtext: this.panelNetworkSubstring,
          colorTheme: 'superPrimary',
          hasActiveBorder: true
        }
      ];
    },
    /**
     * Filter Nerworks based on the walletType
     * @return {string[]}
     */
    filterNetworks() {
      return [];
    }
  },
  watch: {
    accounts: {
      immediate: true,
      handler: function (val) {
        if (val.length > 0 && this.selectedAddress === '') {
          this.selectedAddress = this.accounts[0].address;
        }
      }
    }
  },
  mounted() {
    this.setNetworkPanel();
  },
  methods: {
    /**
     * Method that launches new tab to an explorer with address clicked
     * Used in Address to interact with, Address Row
     */
    launchExplorrer(addr) {
      // eslint-disable-next-line
      window.open(
        this.network.type.blockExplorerAddr.replace('[[address]]', addr),
        '_blank'
      );
    },
    /**
     * Methods sets panelNetworkSubstring  based on the
     * Used Network Panel and on mounted
     * @return {void}
     */
    setNetworkPanel() {
      this.panelNetworkSubstring = `${this.network.type.name} - ${this.network.type.name_long}`;
    }
  }
};
</script>

<style lang="scss" scoped>
table {
  border-spacing: 0;
}

.table-header {
  text-align: center;
  background-color: #f0f0f0;
  th {
    color: #96a8b6;
    font-weight: bold;
    text-transform: uppercase;
  }
}

.table-row-class {
  tr:nth-child(odd) {
    background-color: #f9f9f9;
  }
}

.network-container {
  max-height: 250px;
  overflow: scroll;
}

.address-copy-input {
  opacity: 0;
  position: absolute;
  z-index: -1;
}
</style>
