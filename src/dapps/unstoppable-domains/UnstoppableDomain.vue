<template>
  <div class="mew-component-fix--unstoppable-domain">
    <div class="d-flex align-center">
      <buy-overlay :open="buyOverlay" :close="closeBuyOverlay" />
      <manage-records-overlay
        :open="manageRecordsOverlay"
        :close="closeManageRecordsOverlay"
      />
      <upload-ipfs-overlay
        :open="uploadIpfsOverlay"
        :close="closeUploadIpfsOverlay"
      />
    </div>
    <mew6-white-sheet>
      <mew-banner :text-obj="topBanner" :banner-img="BG" />
      <mew-tabs :items="tabs" has-underline>
        <template #tabContent1>
          <v-sheet color="transparent" max-width="700px" class="mx-auto py-12">
            <div class="mb-5">
              <div class="mb-3">
                <div class="mew-heading-3 font-weight-bold">
                  {{ $t('unstoppable.search-domain-prompt') }}
                </div>
              </div>
              <div class="d-flex align-start">
                <mew-input
                  v-model="input"
                  :has-clear-btn="true"
                  right-label=".crypto"
                  label="Domain name"
                  placeholder=" "
                  class="mr-3 flex-grow-1"
                />
                <mew-button
                  :has-full-width="false"
                  btn-size="xlarge"
                  title="Check availability"
                  @click.native="searchDomain"
                />
              </div>
            </div>
            <div>
              <div v-if="searchResults.length !== 0" class="mb-3">
                <div class="mew-heading-3 font-weight-bold">
                  {{ $t('unstoppable.result') }}
                </div>
              </div>
              <div class="py-2"></div>
              <v-list-item
                v-for="(d, key) in searchResults"
                :key="key"
                two-line
                class="px-0"
              >
                <v-list-item-content>
                  <v-card
                    v-if="!d.available"
                    flat
                    color="tableHeader"
                    class="pa-10"
                  >
                    <div class="d-flex align-center justify-space-between mb-8">
                      <div class="mew-heading-1">{{ d.name }}</div>
                      <div class="mew-heading-3 orange--text">
                        {{ $t('unstoppable.unavailable') }}
                      </div>
                    </div>
                    <div v-if="d.records">
                      <v-list-item
                        v-for="(r, recordKey) in d.records"
                        :key="recordKey"
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
                    </div>
                  </v-card>
                  <v-card
                    v-if="d.available"
                    flat
                    color="tableHeader"
                    class="pa-10"
                  >
                    <div class="d-flex justify-space-between align-center">
                      <div>
                        <div class="mew-heading-1 mb-2">{{ d.name }}</div>
                        <div>
                          <span class="font-weight-medium">${{ d.price }}</span>
                        </div>
                      </div>
                      <div class="d-flex align-center">
                        <div class="mew-heading-3 primary--text mr-6">
                          {{ $t('unstoppable.is-available') }}
                        </div>
                        <mew-button
                          :title="$t('unstoppable.buy')"
                          @click.native="() => buyDomain(d)"
                        ></mew-button>
                      </div>
                    </div>
                  </v-card>
                </v-list-item-content>
              </v-list-item>
              <v-progress-linear
                v-if="loading"
                style="margin: 32px auto 40px auto; max-width: 200px"
                indeterminate
                color="primary"
              ></v-progress-linear>
            </div>

            <div class="py-10"></div>
          </v-sheet>
        </template>
        <template #tabContent2>
          <div class="pa-12">
            <div class="d-flex align-center justify-space-between mb-7">
              <h4 class="font-weight-bold">
                {{ $t('unstoppable.my-domains') }}
                <span class="font-weight-regular"
                  >({{ myDomains.length }})</span
                >
              </h4>
            </div>
            <div>
              <mew-expand-panel :panel-items="myDomains">
                <template v-for="(d, id) in myDomains" #[`panelBody${++id}`]>
                  <div :key="id">
                    <div class="header-block bg_datablock mx-auto">
                      <v-row>
                        <v-col cols="6">
                          <div class="d-flex align-center">
                            <div>
                              {{ $t('unstoppable.resolver') }}
                            </div>
                            <mew-blockie
                              width="25px"
                              height="25px"
                              class="mx-3"
                            />
                            <div class="monospace truncate">
                              {{ d.resolver }}
                            </div>
                          </div>
                        </v-col>
                      </v-row>
                    </div>
                    <div>
                      <div
                        class="d-flex align-center justify-space-between border-bottom py-5 px-4"
                      >
                        <div class="mew-heading-3">
                          {{
                            $t('unstoppable.what-do-you-want-to-do-with-domain')
                          }}
                        </div>
                      </div>
                      <v-divider></v-divider>
                      <div class="pa-5">
                        <v-row>
                          <v-col
                            v-for="(f, key) in domainFunctions"
                            :key="key"
                            cols="2"
                            class="text-center"
                            @click="f.open(d)"
                          >
                            <mew-icon icon-name="ensManager" :img-height="75" />
                            <div>{{ f.label }}</div>
                          </v-col>
                        </v-row>
                      </div>
                    </div>
                  </div>
                </template>
              </mew-expand-panel>
            </div>
          </div>
        </template>
      </mew-tabs>
    </mew6-white-sheet>
  </div>
</template>

<script>
import BG from '@/assets/images/backgrounds/bg-unstoppable-domain.png';
import buyOverlay from './components/UnstoppableDomainBuyOverlay';
import manageRecordsOverlay from './components/UnstoppableManageRecordsOverlay';
import uploadIpfsOverlay from './components/UnstoppableUploadIpfsOverlay';
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import { parseUDRecordToLabel } from './handlers/records';
import { fetchResellerApi, fetchSimillarities } from './handlers/resellerApi';
export default {
  components: {
    buyOverlay,
    manageRecordsOverlay,
    uploadIpfsOverlay
  },
  data() {
    return {
      buyOverlay: false,
      manageRecordsOverlay: false,
      uploadIpfsOverlay: false,
      loading: false,
      tabs: [
        { name: this.$t('unstoppable.buyDomain') },
        { name: this.$t('unstoppable.manage-domain') }
      ],
      input: '',
      searchResults: [],
      domainFunctions: [
        {
          label: this.$t('unstoppable.manage-crypto-records'),
          open: this.openManageRecordsOverlay
        },
        {
          label: this.$t('unstoppable.manage-ipfs-website'),
          open: this.openUploadIpfsOverlay
        }
      ],
      BG: BG,
      topBanner: {
        title: this.$t('unstoppable.title'),
        subtext: this.$t('unstoppable.subtitle')
      },
      results: []
    };
  },
  computed: {
    ...mapState('wallet', ['balance', 'address', 'web3']),
    resolution() {
      return this.getResolution();
    },
    myDomains() {
      return this.getMyDomains();
    },
    resellerId() {
      return this.getResellerId();
    }
  },
  watch: {
    input: function () {
      this.searchResults = [];
      this.clearDomain();
      this.loading = false;
    }
  },
  async mounted() {
    if (this.myDomains.length === 0) {
      this.fetchMyDomains(this.address);
    }
  },
  methods: {
    ...mapMutations('unstoppable', [
      'setCurrentDomain',
      'clearDomain',
      'setManageRecordDomain',
      'setActiveOverlay'
    ]),
    ...mapActions('unstoppable', ['fetchMyDomains', 'fetchIpfsHash']),
    ...mapGetters('unstoppable', [
      'getDomain',
      'getBaseUrl',
      'getResellerId',
      'getMyDomains',
      'getResolution'
    ]),
    openManageRecordsOverlay(domain) {
      this.setActiveOverlay({ value: 'ManageRecordsOverlay' });
      this.setManageRecordDomain({ value: domain });
      this.manageRecordsOverlay = true;
    },
    async openUploadIpfsOverlay(domain) {
      this.setActiveOverlay({ value: 'UploadIpfsOverlay' });
      this.setManageRecordDomain({ value: domain });
      await this.fetchIpfsHash();
      this.uploadIpfsOverlay = true;
    },
    closeBuyOverlay() {
      this.buyOverlay = false;
    },
    closeManageRecordsOverlay() {
      this.manageRecordsOverlay = false;
      this.setManageRecordDomain({ value: { name: '' } });
    },
    closeUploadIpfsOverlay() {
      this.uploadIpfsOverlay = false;
      this.setManageRecordDomain({ value: { name: '' } });
    },
    async buyDomain(domain) {
      this.setCurrentDomain({ value: domain });
      this.buyOverlay = true;
    },
    async searchDomain() {
      const desiredDomain = this.input.endsWith('.crypto')
        ? this.input
        : this.input + '.crypto';
      this.loading = true;
      const { domain } = await fetchResellerApi({
        domain: desiredDomain,
        resellerId: this.resellerId
      });
      if (domain.owner) {
        const records = await this.resolution.getAllRecords(domain.name);
        const cryptoRecords = Object.entries(records)
          .map(([key, value]) => {
            if (value) {
              return { label: parseUDRecordToLabel(key), value };
            }
          })
          .filter(v => !!v && !!v.label)
          .sort(a => (a.label.endsWith('Address') ? 1 : -1));

        const ownerLabel = {
          label:
            this.address === domain.owner
              ? this.$t('unstoppable.owner-you')
              : this.$t('unstoppable.owner'),
          value: domain.owner
        };

        this.searchResults.push({
          name: domain.name,
          available: false,
          records: [
            ownerLabel,
            {
              label: this.$t('unstoppable.namehash'),
              value: this.resolution.namehash(domain.name)
            },
            ...cryptoRecords
          ]
        });
      } else {
        this.searchResults.push({
          name: domain.name,
          available: !!domain?.reselling?.price,
          price: domain?.reselling?.price || 0
        });
      }
      const simillarities = await fetchSimillarities({
        domain: desiredDomain,
        resellerId: this.resellerId
      });
      simillarities.forEach(simillarity => {
        this.searchResults.push({
          name: `${simillarity.label}.${simillarity.extension}`,
          available: true,
          price: simillarity.price / 100
        });
      });
      this.loading = false;
    }
  }
};
</script>
