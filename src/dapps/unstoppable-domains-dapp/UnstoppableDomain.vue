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
      <the-dapp-header
        :dapp-name="bannerText.title"
        :dapp-text="bannerText.subtext"
        :dapp-img="dappImg"
      />
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
                :menu-select="menuSelect"
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
            <div v-if="loading" class="d-flex justify-center">
              <v-progress-circular
                indeterminate
                color="primary"
              ></v-progress-circular>
            </div>
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
                        <div>
                          <mew-button
                            style="height: 100px; max-width: 300px"
                            has-full-width
                            btn-style="light"
                            @click.native="f.open(d)"
                          >
                            <div class="d-flex align-center">
                              <v-icon class="mr-3"
                                >mdi-link-variant-plus</v-icon
                              >
                              <div class="text-left">
                                <div class="black--text font-weight-bold mb-1">
                                  {{ f.label }}
                                </div>
                                <div class="break-word">
                                  <div class="black--text">
                                    {{ f.subtitle }}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </mew-button>
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                </template>
              </mew-expand-panel>
            </div>
          </div>
        </template>
        <template #tabContent3>
          <v-sheet color="transparent" max-width="700px" class="mx-auto py-12">
            <!-- <div class="addressBlock d-flex align-center mb-7">
              <mew-blockie :address="address" />
              <span class="font-weight-heavy pl-15">{{ address }}</span>
            </div> -->
            <div class="mb-5">
              <div class="mb-3">
                <div class="addressBlock d-flex align-center mb-7">
                  <!-- <mew-blockie :address="address" /> -->
                  <!-- <span class="mew-heading-4 font-weight-heavy pl-5">{{
                    address
                  }}</span> -->
                </div>
              </div>
              <div class="d-flex flex-column justify-space-between">
                <div class="mew-heading-3 mb-2">
                  Reverse Resolution for Address
                </div>
                <div class="d-flex justify-space-between">
                  <!-- <mew-select
                    :value="selectedAddress"
                    :filter-placeholder="address"
                    @input="setAddress"
                  >
                  </mew-select> -->
                  <mew-input
                    :value="address"
                    :show-blockie="true"
                    :hide-clear-btn="true"
                    :is-read-only="true"
                    :loading="true"
                    :error-messages="inputErrorMessage"
                    label="Wallet Address"
                    class="mr-3 mt-10 flex-grow-1"
                    @input="setAddress"
                  />
                  <div class="d-flex flex-column justify-space-between">
                    <mew-button
                      :has-full-width="false"
                      btn-size="xlarge"
                      title="Reverse TokenId"
                      class="mb-1"
                      @click.native="reverseTokenId()"
                    />
                    <mew-button
                      :has-full-width="false"
                      btn-size="xlarge"
                      title="Reverse Url"
                      class="mt-1"
                      @click.native="reverseUrl()"
                    />
                  </div>
                </div>
              </div>
              <div v-if="hasTokenIdResults" class="d-flex flex-column mt-2">
                <span class="mew-heading-3 font-weight-heavy"
                  >Reverse Resolve TokenId by Address Result:
                </span>
                <span class="mew-heading-4 font-weight-heavy mt-2">
                  {{ reverseTokenIdResults }}
                </span>
              </div>
              <div v-if="hasUrlResults" class="d-flex flex-column mt-2">
                <span class="mew-heading-3 font-weight-heavy"
                  >Reverse Resolve Url by Address Result:
                </span>
                <span class="mew-heading-4 font-weight-heavy mt-2">
                  {{ reverseUrlResults }}
                </span>
              </div>
            </div>
          </v-sheet>
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
import TheDappHeader from '@/core/components/TheDappHeader';
import DomainTable from './components/UnstoppableDomainTable.vue';
import { mapState, mapGetters } from 'vuex';
import { parseUDRecordToLabel } from './handlers/records';
import { fetchResellerApi, fetchSimillarities } from './handlers/resellerApi';
import Resolution from '@unstoppabledomains/resolution';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';

export default {
  components: {
    UnstoppableDomainBuyOverlay,
    UnstoppableManageRecordsOverlay,
    UnstoppableUploadIpfsOverlay,
    TheDappHeader,
    DomainTable,
    UnstoppableInfoCard
  },
  // mixins: [buyMore],
  data() {
    return {
      dappImg: require('@/assets/images/icons/icons-dapp-unstoppable.svg'),
      bannerText: {},
      buyOverlay: false,
      inputtedAddress: null,
      reverseTokenIdResults: '',
      reverseUrlResults: '',
      hasUrlResults: false,
      hasTokenIdResults: false,
      isLoading: false,
      tabs: [
        { name: 'Buy domain' },
        { name: 'Manage domain' },
        { name: 'Reverse Resolver' }
      ],
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
          toggleTitle: '',
          colorTheme: 'greyLight',
          warningBadge: {
            color: 'orangePrimary',
            text: 'Expire soon'
          }
        },
        {
          name: 'mewdev008.eth',
          toggleTitle: '',
          colorTheme: 'greyLight',
          warningBadge: {
            color: 'orangePrimary',
            text: 'Expire soon'
          }
        }
      ],
      manageRecordsOverlay: false,
      uploadIpfsOverlay: false,
      loading: false,
      input: '',
      searchResults: []
      // menuSelect: {
      //   label: 'All extensions',
      //   items: [
      //     {
      //       name: '.x',
      //       value: '.x'
      //     },
      //     {
      //       name: '.crypto',
      //       value: '.crypto'
      //     },
      //     {
      //       name: '.coin',
      //       value: '.coin'
      //     },
      //     {
      //       name: '.wallet',
      //       value: '.wallet'
      //     },
      //     {
      //       name: '.bitcoin',
      //       value: '.bitcoin'
      //     },
      //     {
      //       name: '.888',
      //       value: '.888'
      //     },
      //     {
      //       name: '.nft',
      //       value: '.nft'
      //     },
      //     {
      //       name: '.dao',
      //       value: '.dao'
      //     },
      //     {
      //       name: '.zil',
      //       value: '.zil'
      //     },
      //     {
      //       name: '.blockchain',
      //       value: '.blockchain'
      //     }
      //   ]
      // }
    };
  },
  computed: {
    ...mapGetters('global', ['network']),
    ...mapState('wallet', ['balance', 'web3', 'instance', 'address']),
    inputErrorMessage() {
      if (this.inputtedAddress === '') {
        return `Address input cannot be empty.`;
      }
      return '';
    }
  },
  methods: {
    async reverseTokenId() {
      this.isLoading = true;
      const address = this.inputtedAddress;
      const resolution = new Resolution();
      try {
        const results = await resolution
          .reverseTokenId(address)
          .then(tokenId => {
            const tokenIdRes = tokenId;
            this.reverseTokenIdResults =
              address + ' ' + `reversed to` + ' ' + tokenIdRes;
          });
        this.isLoading = false;
        this.hasTokenIdResults = true;
        return results;
      } catch (e) {
        Toast(e, {}, ERROR);
      }
    },
    async reverseUrl() {
      this.isLoading = true;
      const address = this.inputtedAddress;
      const resolution = new Resolution();
      try {
        const results = await resolution
          .reverse(address, {
            location: 'UNSLayer2'
          })
          .then(domain => {
            const domainRes = domain;
            this.reverseUrlResults =
              address + ' ' + `reversed to` + ' ' + domainRes;
          });
        this.isLoading = false;
        this.hasUrlResults = true;
        return results;
      } catch (e) {
        Toast(e, {}, ERROR);
      }
    },
    setAddress(value) {
      this.inputtedAddress = value;
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
      if (this.searchResults.length > 0) this.searchResults = [];

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
.set-button {
  margin-left: 10px;
}
</style>
