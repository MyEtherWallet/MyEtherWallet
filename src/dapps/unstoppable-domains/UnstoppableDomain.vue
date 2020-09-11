<template>
  <div class="mew-component-fix--unstoppable-domain">
    <div class="d-flex align-center">
      <buy-overlay :open="buyOverlay" :close="closeBuyOverlay" />
      <div
        class="cursor--pointer font-weight-bold mr-4"
        @click="buyOverlay = true"
      >
        Buy Domain Overlay
      </div>
      <add-owned-domain-overlay :open="addOverlay" :close="closeAddOverlay" />
      <div
        class="cursor--pointer font-weight-bold mr-4"
        @click="addOverlay = true"
      >
        Add Owned Domain
      </div>
      <transfer-domain-overlay
        :open="transferOverlay"
        :close="closeTransferOverlay"
      />
      <div
        class="cursor--pointer font-weight-bold mr-4"
        @click="transferOverlay = true"
      >
        Transfer Domain
      </div>
    </div>
    <mew6-white-sheet>
      <mew-banner :text-obj="topBanner" :banner-img="BG" />
      <mew-tabs :items="tabs" has-underline>
        <template v-slot:tabContent1>
          <v-sheet color="transparent" max-width="700px" class="mx-auto py-12">
            <div class="mb-5">
              <div class="mb-3">
                <div class="mew-heading-3 font-weight-bold">
                  Find your blockchain domain
                </div>
              </div>
              <div class="d-flex align-start">
                <mew-input
                  :has-clear-btn="true"
                  right-label=".ctypto"
                  label="Domain name"
                  placeholder=" "
                  class="mr-3 flex-grow-1"
                />
                <mew-button
                  :has-full-width="false"
                  button-size="xlarge"
                  title="Check availability"
                />
              </div>
            </div>
            <div>
              <div class="mb-3">
                <div class="mew-heading-3 font-weight-bold">Results</div>
              </div>
              <v-card flat color="tableHeader" class="pa-10">
                <div class="d-flex justify-space-between align-center">
                  <div>
                    <div class="mew-heading-1 mb-2">mewwallet.crypto</div>
                    <div>
                      <span class="font-weight-medium">0.0823234234</span>
                      ETH ($40.00)
                    </div>
                  </div>
                  <div class="d-flex align-center">
                    <div class="mew-heading-3 primary--text mr-6">
                      Available
                    </div>
                    <mew-button title="Buy"></mew-button>
                  </div>
                </div>
              </v-card>
              <div class="py-2"></div>
              <v-card flat color="tableHeader" class="pa-10">
                <div class="d-flex align-center justify-space-between mb-8">
                  <div class="mew-heading-1">myetherwallet.crypto</div>
                  <div class="mew-heading-3 orange--text">Unavailable</div>
                </div>

                <v-divider class="mb-5" />

                <v-list-item
                  v-for="(r, key) in results"
                  :key="key"
                  two-line
                  class="px-0"
                >
                  <v-list-item-content>
                    <div
                      class="mew-body font-weight-medium titlePrimary--text mb-2"
                    >
                      {{ r.label }}:
                    </div>
                    <div class="mew-body titlePrimary--text">
                      {{ r.value }}
                    </div>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
            </div>

            <div class="py-10"></div>

            <div>
              <v-card
                flat
                color="tableHeader"
                class="d-flex align-center justify-space-between pa-10 mb-10"
              >
                <div class="mew-heading-1">mewwallet.crypto</div>
                <div>
                  <span class="font-weight-medium">0.0341234234 ETH</span>
                  ($40.00)
                </div>
              </v-card>

              <v-sheet color="transparent" max-width="400px" class="mx-auto">
                <div class="d-flex align-center justify-space-between mb-5">
                  <div class="mew-heading-1">Pay with Crypto</div>
                  <div class="font-weight-medium primary--text">
                    Pay with Credit Card
                  </div>
                </div>

                <v-card
                  outlined
                  color="tableHeader"
                  class="pa-4 d-flex align-center justify-space-between bordered-red"
                  style="border-color: var(--v-error-base) !important;"
                >
                  <div class="d-flex align-center">
                    <img
                      src="@/assets/images/currencies/icon-eth-blue.svg"
                      alt="Crypto"
                    />
                    <div class="font-weight-medium ml-3">
                      0.0341234234
                      <span class="primary--text">ETH</span>
                    </div>
                  </div>
                  <v-icon class="primary--text">mdi-check-circle</v-icon>
                </v-card>

                <div class="error--text mt-3 mb-7 font-weight-medium">
                  Insufficient balance.
                  <a
                    href="https://ccswap.myetherwallet.com/#/"
                    target="_blank"
                    class="text-decoration--underline"
                  >
                    Buy more ETH
                  </a>
                </div>

                <v-card
                  flat
                  color="tableHeader"
                  class="mt-3 pa-4 d-flex align-center justify-space-between"
                >
                  <div class="d-flex align-center">
                    <img
                      src="@/assets/images/icons/icon-fiat-white.svg"
                      alt="Fiat"
                    />
                    <div class="font-weight-medium ml-3">
                      40.23
                      <span class="primary--text">USD</span>
                    </div>
                  </div>
                  <v-icon>mdi-check-circle-outline</v-icon>
                </v-card>

                <div class="d-flex justify-center mt-5">
                  <mew-button
                    title="Back"
                    btn-style="outline"
                    button-size="xlarge"
                    class="mr-3"
                  />
                  <mew-button title="Pay" button-size="xlarge" />
                </div>
              </v-sheet>
            </div>
          </v-sheet>
        </template>
        <template v-slot:tabContent2>
          <div class="pa-12">
            <div class="d-flex align-center justify-space-between mb-7">
              <h4 class="font-weight-bold">
                My domains <span class="font-weight-regular">(1)</span>
              </h4>
              <mew-button
                btn-style="outline"
                title="+ Add domain you own"
                button-size="large"
              />
            </div>
            <div>
              <mew-expand-panel :panel-items="myDomains">
                <template v-slot:panelBody1>
                  <div>
                    <div class="header-block bg_datablock">
                      <v-row>
                        <v-col cols="6">
                          <div class="d-flex align-center">
                            <div>Registrant</div>
                            <blockie width="25px" height="25px" class="mx-3" />
                            <div class="monospace text-overflow--ellipsis">
                              0xD4289C524f3A75b783497EB5a459a54F6F4df8D1aaaaaaaaaaaaaa
                            </div>
                          </div>
                        </v-col>
                        <v-col cols="6">
                          <div class="d-flex align-center">
                            <div>Controller</div>
                            <blockie width="25px" height="25px" class="mx-3" />
                            <div class="monospace text-overflow--ellipsis">
                              0xD4289C524f3A75b783497EB5a459a54F6F4df8D1aaaaaaaaaaaaaa
                            </div>
                          </div>
                        </v-col>
                      </v-row>
                    </div>
                    <div>
                      <div
                        class="d-flex align-center justify-space-between border-bottom py-5 px-0"
                      >
                        <div class="mew-heading-3">
                          What do you want to do with the domain?
                        </div>
                        <div>Parent - ETH</div>
                      </div>
                      <v-divider></v-divider>
                      <div class="pa-5">
                        <v-row>
                          <v-col
                            v-for="(f, key) in domainFunctions"
                            :key="key"
                            cols="2"
                            class="text-center"
                          >
                            <mew-icon icon-name="ensManager" :img-height="75" />
                            <div>{{ f.label }}</div>
                            <div v-if="f.expire" class="orange--text">
                              <div>Expire at</div>
                              <div>{{ f.expire }}</div>
                            </div>
                          </v-col>
                        </v-row>
                      </div>
                    </div>
                  </div>
                </template>
                <template v-slot:panelBody2>
                  <div>
                    <div class="header-block bg_datablock">
                      <v-row>
                        <v-col cols="6">
                          <div class="d-flex align-center">
                            <div>Registrant</div>
                            <blockie width="25px" height="25px" class="mx-3" />
                            <div class="monospace text-overflow--ellipsis">
                              0xD4289C524f3A75b783497EB5a459a54F6F4df8D1aaaaaaaaaaaaaa
                            </div>
                          </div>
                        </v-col>
                        <v-col cols="6">
                          <div class="d-flex align-center">
                            <div>Controller</div>
                            <blockie width="25px" height="25px" class="mx-3" />
                            <div class="monospace text-overflow--ellipsis">
                              0xD4289C524f3A75b783497EB5a459a54F6F4df8D1aaaaaaaaaaaaaa
                            </div>
                          </div>
                        </v-col>
                      </v-row>
                    </div>
                    <div>
                      <div
                        class="d-flex align-center justify-space-between border-bottom py-5 px-0"
                      >
                        <div class="mew-heading-3">
                          What do you want to do with the domain?
                        </div>
                        <div>Parent - ETH</div>
                      </div>
                      <v-divider></v-divider>
                      <div class="pa-5">
                        <v-row>
                          <v-col
                            v-for="(f, key) in domainFunctions"
                            :key="key"
                            cols="2"
                            class="text-center"
                          >
                            <mew-icon icon-name="ensManager" :img-height="75" />
                            <div>{{ f.label }}</div>
                            <div v-if="f.expire" class="orange--text">
                              <div>Expire at</div>
                              <div>{{ f.expire }}</div>
                            </div>
                          </v-col>
                        </v-row>
                      </div>
                    </div>
                  </div>
                </template>
              </mew-expand-panel>
              <domain-btn domain="iamexpired.eth" badge="expired" />
              <domain-btn domain="almostexpired.eth" badge="expired" />
            </div>
          </div>
        </template>
      </mew-tabs>
    </mew6-white-sheet>
  </div>
</template>

<script>
import BG from '@/assets/images/backgrounds/bg-unstoppable-domain.png';
import domainBtn from '@/modules/wallets/components/domain-btn/DomainBtn';
import buyOverlay from '@/modules/wallets/components/unstoppable-domain-buy-overlay/UnstoppableDomainBuyOverlay';
import addOwnedDomainOverlay from '@/modules/wallets/components/unstoppable-add-owned-domain-overlay/UnstoppableAddOwnedDomainOverlay';
import transferDomainOverlay from '@/modules/wallets/components/unstoppable-transfer-domain-overlay/UnstoppableTransferDomainOverlay';

export default {
  components: {
    domainBtn,
    buyOverlay,
    addOwnedDomainOverlay,
    transferDomainOverlay
  },
  data() {
    return {
      buyOverlay: false,
      addOverlay: false,
      transferOverlay: false,
      tabs: [{ name: 'Buy domain' }, { name: 'Manage domain' }],
      domainFunctions: [
        { label: 'Transfer Domain' },
        { label: 'Renew Domain', expire: '07/21/2020' },
        { label: 'ENS Configurations' },
        { label: 'Manage Multicoins' },
        { label: 'Manage Text Records' },
        { label: 'Upload Website' },
        { label: 'Return Funds' }
      ],
      myDomains: [
        {
          name: 'mewdev009.eth',
          subtext: '',
          colorTheme: 'superPrimary',
          warningBadge: {
            color: 'warning darken-2',
            text: 'Expire soon'
          }
        },
        {
          name: 'mewdev008.eth',
          subtext: '',
          colorTheme: 'superPrimary',
          warningBadge: {
            color: 'warning darken-2',
            text: 'Expire soon'
          }
        }
      ],
      warning: {
        color: 'red',
        text: 'Expire soon'
      },
      BG: BG,
      topBanner: {
        title: 'Unstoppable Domain',
        subtext: 'Replace cryptocurrency addresses with a human readable name.'
      },
      results: [
        {
          label: 'Labelhash (mewwallet)',
          value: '0x527b9715d99aCfB7E1b01C6C864DC8402fC6C864DC8402f2a3C3b'
        },
        {
          label: 'Namehash (mewwallet.eth)',
          value: '0x527b9715d99aCfB7E1b01C6C864DC8402fC6C864DC8402f2a3C3b'
        },
        {
          label: 'Owner',
          value: '0x527b9715d99aCfB7E1b01C6C864DC8402f2a3C3b'
        },
        {
          label: 'Multi-coin',
          value: 'None'
        },
        {
          label: 'ETH address',
          value: '0x502e119bbf7b476a449a67fdabfa35f486194c9a'
        }
      ]
    };
  },
  methods: {
    closeBuyOverlay() {
      this.buyOverlay = false;
    },
    closeAddOverlay() {
      this.addOverlay = false;
    },
    closeTransferOverlay() {
      this.transferOverlay = false;
    }
  }
};
</script>

<style lang="scss">
// Fix mew-components
.mew-component-fix--unstoppable-domain {
  .mew-banner {
    min-height: 180px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    .exit-container {
      display: none;
    }
    .banner-content {
      > div:nth-child(2) {
        margin-top: 9px;
        max-width: 700px;
        padding: 0 20px !important;
      }
    }
    .mew-subtitle {
      font-size: 36px !important;
    }
  }
  .v-tab {
    letter-spacing: -0.1px;
  }
  .v-tabs-bar {
    height: 70px;
  }
  .mew-expand-panel .v-expansion-panel-content {
    background-color: var(--v-mewBg-base) !important;
  }
  .header-block {
    margin: 0 -24px;
    margin-top: 0px;
    padding: 5px 28px !important;
    border-top: 1px solid rgba(0, 0, 0, 0.12);
    background-color: var(--v-superPrimary-base) !important;
  }
}
</style>
