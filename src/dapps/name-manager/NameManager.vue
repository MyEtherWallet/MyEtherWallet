<template>
  <div class="mew-component-fix--name-manager">
    <div class="d-flex align-center">
      <register-domain-overlay
        :open="registerOverlay"
        :close="closeRegisterOverlay"
      />
      <div
        class="cursor--pointer font-weight-bold mr-4"
        @click="registerOverlay = true"
      >
        Register Domain Overlay
      </div>

      <add-owned-domain-overlay :open="addOwnedDomainOverlay" />
      <div
        class="cursor--pointer font-weight-bold mr-4"
        @click="addOwnedDomainOverlay = true"
      >
        Add Owned Domain Overlay
      </div>

      <transfer-domain-overlay :open="transferDomainOverlay" />
      <div
        class="cursor--pointer font-weight-bold mr-4"
        @click="transferDomainOverlay = true"
      >
        Transfer Domain Overlay
      </div>
    </div>
    <mew6-white-sheet>
      <mew-banner :text-obj="topBanner" :banner-img="BG" />
      <mew-tabs :items="tabs" has-underline>
        <template v-slot:tabContent1>
          <v-sheet max-width="700px" color="transparent" class="py-12 mx-auto">
            <div class="tab-width">
              <div class="mb-5">
                <div class="mew-heading-2 mb-8">
                  Find your blockchain domain
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
                    title="Register domain"
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
import BG from '@/assets/images/backgrounds/bg-ens.png';
import registerDomainOverlay from '@/modules/wallets/components/ens-manager-register-domain-overlay/RegisterDomainOverlay';
import addOwnedDomainOverlay from '@/modules/wallets/components/ens-manager-add-owned-domain-overlay/AddOwnedDomainOverlay';
import transferDomainOverlay from '@/modules/wallets/components/ens-manager-transfer-domain-overlay/TransferDomainOverlay';
import domainBtn from '@/modules/wallets/components/domain-btn/DomainBtn';

export default {
  components: {
    registerDomainOverlay,
    addOwnedDomainOverlay,
    transferDomainOverlay,
    domainBtn
  },
  data() {
    return {
      registerOverlay: false,
      addOwnedDomainOverlay: false,
      transferDomainOverlay: false,
      domainFunctions: [
        { label: 'Transfer Domain' },
        { label: 'Renew Domain', expire: '07/21/2020' },
        { label: 'ENS Configurations' },
        { label: 'Manage Multicoins' },
        { label: 'Manage Text Records' },
        { label: 'Upload Website' },
        { label: 'Return Funds' }
      ],
      tabs: [{ name: 'Register domain' }, { name: 'Manage domain' }],
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
      BG: BG,
      topBanner: {
        title: 'ENS manager',
        subtext: 'Manage, buy and transfer your ENS assets.'
      },
      tab: 1,
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
    closeRegisterOverlay() {
      this.registerOverlay = false;
    }
  }
};
</script>

<style lang="scss">
// Fix mew-components
.mew-component-fix--name-manager {
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
