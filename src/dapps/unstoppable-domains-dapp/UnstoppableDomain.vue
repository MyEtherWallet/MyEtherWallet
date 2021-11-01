<template>
  <div class="mew-component-fix--unstoppable-domain">
    <div class="d-flex align-center">
      <unstoppable-domain-buy-overlay
        :open="buyOverlay"
        :close="closeBuyOverlay"
      />
      <unstoppable-manage-records-overlay
        :open="manageRecordsOverlay"
        :close="closeManageRecordsOverlay"
      />
      <unstoppable-upload-ipfs-overlay
        :open="uploadIpfsOverlay"
        :close="closeUploadIpfsOverlay"
      />
    </div>
    <mew6-white-sheet>
      <unstoppable-banner />
      <mew-tabs
        :items="tabs"
        has-underline
        background="backgroundGrey"
        active-color="blue500"
      >
        <template #tabContent1>
          <v-sheet color="transparent" max-width="700px" class="mx-auto py-12">
            <div class="mb-5">
              <!-- <mew-search
                v-model="input"
                placeholder="Search for your domain"
                is-search-block
                @click.native="searchDomain"
              /> -->
              <div class="d-flex align-start">
                <mew-input
                  v-model="input"
                  :has-clear-btn="true"
                  right-label=".crypto"
                  :label="$t('unstoppable.search-domain-prompt')"
                  placeholder=" "
                  class="mr-3 flex-grow-1"
                />
                <mew-button
                  :has-full-width="false"
                  btn-size="xlarge"
                  title="Search"
                  @click.native="searchDomain"
                />
              </div>
            </div>
            <div>
              <domain-table
                v-if="searchResults.length !== 0"
                :search-results="searchResults"
                :buy-domain="buyDomain"
              />
            </div>
            <v-progress-circular
              v-if="loading"
              style="margin: 32px auto 40px auto; max-width: 200px"
              indeterminate
              color="primary"
            ></v-progress-circular>
            <unstoppable-info-card v-if="searchResults.length === 0" />
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
            <div v-if="myDomains.length === 0">
              <mew-alert
                :title="$t('unstoppable.alert.title')"
                :description="$t('unstoppable.alert.description')"
              />
            </div>
            <div>
              <mew-expand-panel :panel-items="myDomains" is-grey-theme>
                <template v-for="(d, id) in myDomains" #[`panelBody${++id}`]>
                  <div :key="id" class="pa-5">
                    <v-row>
                      <v-col
                        v-for="(f, key) in domainFunctions"
                        :key="key"
                        cols="4"
                        class="text-center"
                        @click="f.open(d)"
                      >
                        <mew-super-button
                          style="max-height: 108px"
                          title="Resolve Domains"
                          :subtitle="f.subtitle"
                          font-class="mew-heading-3"
                          right-icon-type="mdi"
                          :right-icon="f.icon"
                          right-cols-num="3"
                          left-cols-num="9"
                          @click.native="f.open(d)"
                        />
                      </v-col>
                    </v-row>
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
import UnstoppableDomainBuyOverlay from './components/UnstoppableDomainBuyOverlay';
import UnstoppableManageRecordsOverlay from './components/UnstoppableManageRecordsOverlay';
import UnstoppableUploadIpfsOverlay from './components/UnstoppableUploadIpfsOverlay';
import UnstoppableInfoCard from './components/UnstoppableInfoCard.vue';
import UnstoppableBanner from './components/UnstoppableBanner.vue';
import DomainTable from './components/UnstoppableDomainTable.vue';
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import { parseUDRecordToLabel } from './handlers/records';
import { fetchResellerApi, fetchSimillarities } from './handlers/resellerApi';
export default {
  components: {
    UnstoppableDomainBuyOverlay,
    UnstoppableManageRecordsOverlay,
    UnstoppableUploadIpfsOverlay,
    DomainTable,
    UnstoppableInfoCard,
    UnstoppableBanner
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
          label: this.$t('unstoppable.resolve-domain'),
          subtitle: this.$t('unstoppable.link-your-wallets'),
          open: this.openManageRecordsOverlay,
          icon: 'mdi-link-variant-plus'
        },
        {
          label: this.$t('unstoppable.manage-ipfs-website'),
          subtitle: this.$t('unstoppable.publish-your-website'),
          open: this.openUploadIpfsOverlay,
          icon: 'mdi-web'
        }
      ]
    };
  },
  computed: {
    ...mapState('wallet', ['balance', 'address', 'web3']),
    ...mapGetters('unstoppable', ['resellerId', 'myDomains', 'resolution'])
  },
  watch: {
    input: function () {
      this.searchResults = [];
      this.CLEAR_DOMAIN();
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
      'SET_CURRENT_DOMAIN',
      'CLEAR_DOMAIN',
      'SET_MANAGE_RECORD',
      'SET_ACTIVE_OVERLAY'
    ]),
    ...mapActions('unstoppable', ['fetchMyDomains', 'fetchIpfsHash']),
    openManageRecordsOverlay(domain) {
      this.SET_ACTIVE_OVERLAY({ value: 'ManageRecordsOverlay' });
      this.SET_MANAGE_RECORD({ value: domain });
      this.manageRecordsOverlay = true;
    },
    async openUploadIpfsOverlay(domain) {
      this.SET_ACTIVE_OVERLAY({ value: 'UploadIpfsOverlay' });
      this.SET_MANAGE_RECORD({ value: domain });
      await this.fetchIpfsHash();
      this.uploadIpfsOverlay = true;
    },
    closeBuyOverlay() {
      this.buyOverlay = false;
    },
    closeManageRecordsOverlay() {
      this.manageRecordsOverlay = false;
      this.SET_MANAGE_RECORD({ value: { name: '' } });
    },
    closeUploadIpfsOverlay() {
      this.uploadIpfsOverlay = false;
      this.SET_MANAGE_RECORD({ value: { name: '' } });
    },
    async buyDomain(domain) {
      this.SET_CURRENT_DOMAIN({ value: domain });
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

<style lang="scss" scoped>
// ==================================================================================================
// Replace with mew-components color variables when mew-components is updated.
// ==================================================================================================
$greyMedium: #d7dae3;
$bluePrimary: #4b83e8;
$backgroundGrey: #f8f9fb;
</style>
