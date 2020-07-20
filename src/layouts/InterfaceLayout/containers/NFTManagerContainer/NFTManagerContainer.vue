<template>
  <div class="crypto-kitties-manager">
    <interface-container-title :title="$t('nftManager.title')" />
    <div v-if="!isReady && isOnlineAndEth">
      <loading-sign :loadingmessage1="$t('common.loading')" />
    </div>

    <div v-if="isReady && hasNfts" class="content-container">
      <nft-side-menu
        :supported-nft-obj="nftConfig"
        :nft-config="nftConfig"
        :initial-highlighted="selectedContract"
        :loading-complete="countsRetrieved"
        :sent-update="sentUpdate"
        :nft-card-url="nftUrl"
        @selected="changeSelectedContract"
        @openCustomModal="openCustomModal"
        @removeCustomNft="openRemovalConfirmModal"
      ></nft-side-menu>

      <div class="block-divider" />

      <div v-if="showDetails">
        <nft-details
          :nft="detailsFor"
          :selected-title="nftTitle"
          :nft-card-url="nftUrl"
          :get-image="getImage"
          @nftTransferred="removeSentNft"
          @resetNFT="resetNFT"
          @back="comeBack"
        ></nft-details>
      </div>

      <div v-if="!showDetails">
        <content-block-title :button-text="ntfCount" :title="nftTitle" />

        <div v-if="nftToShow.length === 0">
          <loading-sign :loadingmessage1="$t('common.loading')" />
        </div>

        <b-row v-show="!fetchingOwnedTokens || collectionLoading">
          <!--        <b-row >-->
          <b-col
            v-for="nft in nftToShow"
            :key="nft.key"
            cols="6"
            lg="4"
            md="4"
            class="mb-4"
          >
            <nft-token-card
              :nft="nft"
              :nft-card-url="nftUrl"
              @showNftDetails="showNftDetails"
            ></nft-token-card>
          </b-col>
        </b-row>

        <div
          class="pagination-container"
          :class="collectionLoading ? 'loading' : ''"
        >
          <nav
            v-show="selectedNft.count > 9"
            aria-label="Page navigation example"
          >
            <ul class="pagination justify-content-center">
              <li
                v-show="startIndex > 0"
                class="page-item"
                @click="getPrevious()"
              >
                <div class="page-link prev-button">Previous</div>
              </li>
              <li class="page-item">
                <div
                  v-if="startIndex + 1 != endIndex"
                  class="page-link page-index-button"
                >
                  {{
                    $t('nftManager.showing-range', {
                      first: startIndex + 1,
                      last: endIndex,
                      count: endIndex - startIndex
                    })
                  }}
                </div>
                <div
                  v-if="startIndex + 1 == endIndex"
                  class="page-link page-index-button"
                >
                  {{
                    $t('nftManager.showing', {
                      first: startIndex + 1,
                      count: endIndex - startIndex
                    })
                  }}
                </div>
              </li>
              <li v-show="showNextButton" class="page-item" @click="getNext()">
                <div class="page-link next-button">Next</div>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
    <div v-if="isReady && !hasNfts" class="inner-side-menu content-container">
      <div v-show="!reLoading">
        <h3 class="no-nft-notice">{{ $t('nftManager.no-nft') }}</h3>
        <standard-button
          :options="{
            title: $t('nftManager.add-custom'),
            buttonStyle: 'green',
            helpCenter: false,
            noMinWidth: true,
            fullWidth: false
          }"
          :click-function="openCustomModal"
        />
      </div>
      <span v-show="reLoading">{{ $t('nftManager.reloading') }}</span>
    </div>

    <div v-if="!isOnlineAndEth">
      <div v-show="!online">{{ $t('nftManager.nft-are') }}</div>
      <div v-show="online" class="not-supported-txt">
        {{ $t('nftManager.not-supported', { value: network.type.name_long }) }}
      </div>
    </div>
    <div class="flex--row--align-start mft-manager-content-container"></div>
    <nft-custom-add-modal
      ref="customModal"
      :add-token="addCustom"
      :active-address="activeAddress"
    ></nft-custom-add-modal>
    <nft-custom-confirm-remove-modal
      ref="customRemoveModal"
      :for-removal="forRemoval"
      @remove="removeCustomNft"
    ></nft-custom-confirm-remove-modal>
  </div>
</template>

<script>
import store from 'store';
import LoadingSign from '@/components/LoadingSign';
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle';
import ContentBlockTitle from '@/layouts/InterfaceLayout/components/ContentBlockTitle';
import NFTSideMenu from '@/layouts/InterfaceLayout/containers/NFTManagerContainer/components/NFTSideMenu';
import NftTokenCard from '@/layouts/InterfaceLayout/containers/NFTManagerContainer/components/NftTokenCard';
import NftDetails from './components/NftDetails';
import NftCustomAddModal from './components/NftCustomAddModal';
import NftCustomConfirmRemove from './components/NftCustomConfirmRemove';
import { mapState } from 'vuex';
import { nftABI } from './abis';
import StandardButton from '@/components/Buttons/StandardButton';
// import placeholderImage from '@/assets/images/icons/defaultToken.png';
import utils from 'web3-utils';
const endPointUrl = '';
export default {
  components: {
    'nft-custom-add-modal': NftCustomAddModal,
    'nft-custom-confirm-remove-modal': NftCustomConfirmRemove,
    'loading-sign': LoadingSign,
    'content-block-title': ContentBlockTitle,
    'nft-side-menu': NFTSideMenu,
    'interface-container-title': InterfaceContainerTitle,
    'nft-details': NftDetails,
    'standard-button': StandardButton,
    'nft-token-card': NftTokenCard
  },
  filters: {
    ConcatToken(value) {
      if (!value) return '';
      if (value.length > 20)
        return `${value.substr(0, 15)}...${value.substr(value.length - 6)}`;
      return value;
    }
  },
  data() {
    return {
      nftABI,
      nftUrl: `${endPointUrl}getImage`,
      openSeaLambdaUrl: endPointUrl,
      countPerPage: 9,
      currentPage: 1,
      nftConfig: {},
      countsRetrieved: false,
      showDetails: false,
      reLoading: false,
      selectedContract: '',
      detailsFor: {},
      nftTokens: {},
      ownedTokens: [],
      sentUpdate: 0,
      customNFTs: [],
      forRemoval: {},
      collectionLoading: false,
      fetchingOwnedTokens: true,
      nftObjectClone: {},
      nftToShowList: [],
      retryCount: 0
    };
  },
  computed: {
    ...mapState('main', ['account', 'online', 'network']),
    nftTitle() {
      if (this.nftConfig[this.selectedContract]) {
        if (
          this.nftConfig[this.selectedContract].symbol === 'UNKNOWN' &&
          !this.nftConfig[this.selectedContract].custom
        ) {
          return `${this.$t('nftManager.unknown-token-title', {
            address: this.nftConfig[this.selectedContract].name
          })}`;
        }
        return this.nftConfig[this.selectedContract].name;
      }
      return `${this.$t('common.loading')}`;
    },
    startIndex() {
      if (this.collectionLoading) {
        return (this.currentPage - 1) * this.countPerPage - this.countPerPage;
      }
      return this.currentPage * this.countPerPage - this.countPerPage;
    },
    endIndex() {
      if (this.collectionLoading) {
        return (this.currentPage - 1) * this.countPerPage;
      }
      if (this.fetchingOwnedTokens || this.nftToShowList.length === 0) {
        return (this.currentPage - 1) * this.countPerPage;
      }
      if (this.nftConfig[this.selectedContract]) {
        if (this.nftConfig[this.selectedContract].tokens) {
          if (this.nftConfig[this.selectedContract].tokens.length) {
            if (
              this.nftConfig[this.selectedContract].tokens.length <
                this.currentPage * this.countPerPage &&
              this.nftConfig[this.selectedContract].count <
                this.currentPage * this.countPerPage
            ) {
              return this.nftConfig[this.selectedContract].count;
            }
            return this.currentPage * this.countPerPage;
          }
        }
      }

      return this.currentPage * this.countPerPage;
    },
    nftToShow() {
      if (this.collectionLoading) {
        return this.nftToShowList;
      }
      if (this.fetchingOwnedTokens) return [];

      return this.selectNftsToShow();
    },
    loadingPlaceholders() {
      const count = this.endIndex - this.startIndex;

      for (let i = 0; i < count; i++) {}
    },
    ntfCount() {
      if (
        this.nftConfig[this.selectedContract] !== undefined &&
        this.nftConfig[this.selectedContract].tokens !== undefined
      ) {
        return this.$t('nftManager.per-page-count', {
          perPage: this.countPerPage,
          count: this.nftConfig[this.selectedContract].count
        });
      }
      if (this.fetchingOwnedTokens || this.nftToShowList.length === 0) {
        return this.$t('common.loading');
      }
      return this.$t('nftManager.none-owned');
    },
    selectedNft() {
      if (this.selectedContract) {
        return this.nftConfig[this.selectedContract];
      }
      return { tokens: [] };
    },
    showNextButton() {
      if (this.fetchingOwnedTokens || this.nftToShowList.length === 0) {
        return false;
      }
      if (this.nftConfig[this.selectedContract]) {
        if (!this.nftConfig[this.selectedContract].tokens) return false;
        const ids_retrieved = this.nftConfig[this.selectedContract].count;
        return (
          this.endIndex !== ids_retrieved && this.endIndex <= ids_retrieved
        );
      }
      return null;
    },
    activeAddress() {
      return '0xf4b0e07b1010b9dc23d369069ab4f2192651d474';
      // return this.account.address;
    },
    hasNfts() {
      return Object.values(this.nftConfig).length > 0;
    },
    isReady() {
      return this.isOnlineAndEth && this.countsRetrieved;
    },
    isOnlineAndEth() {
      return this.online && this.network.type.name === 'ETH';
    }
  },
  watch: {
    async selectedContract(newer) {
      this.currentPage = 1;
      if (
        !this.nftConfig[newer].tokens ||
        this.nftConfig[newer].tokens.length === 0
      ) {
        await this.getNftDetails(this.selectedContract).then(results => {
          this.nftConfig[this.selectedContract].tokens = results;
          this.getNftsToShow();
        });
      } else {
        this.getNftsToShow();
      }
    }
  },
  async mounted() {
    await this.setup();
  },
  //======================================================================
  methods: {
    selectNftsToShow() {
      try {
        if (this.nftConfig[this.selectedContract]) {
          if (!this.nftConfig[this.selectedContract].tokens) return [];
          return this.nftConfig[this.selectedContract].tokens.length >
            this.countPerPage
            ? this.nftConfig[this.selectedContract].tokens.slice(
                this.startIndex,
                this.endIndex
              )
            : this.nftConfig[this.selectedContract].tokens;
        }
        return [];
      } catch (e) {
        // eslint-disable-next-line
      console.error(e);
        return [];
      }
    },
    addCustom(address, symbol) {
      this.reLoading = true;
      this.customNFTs.push({
        ERC721Extension: true,
        contract: address,
        customNft: true,
        title: symbol
      });
      this.$refs.customModal.$refs.modal.hide();
      store.set('customNFTs', this.customNFTs);
      this.sentUpdate += 1;
      this.setup();
    },
    removeCustomNft(item) {
      this.reLoading = true;
      const customNFTs = store.get('customNFTs');
      if (customNFTs !== undefined && customNFTs !== null) {
        const entryIndex = customNFTs.findIndex(
          entry => item.contract === entry.contract
        );
        customNFTs.splice(entryIndex, 1);
        store.set('customNFTs', customNFTs);
        this.setup();
        this.sentUpdate += 1;
      }
    },
    openRemovalConfirmModal(item) {
      this.forRemoval = item;
      this.$refs.customRemoveModal.$refs.modal.show();
    },
    openCustomModal() {
      this.$refs.customModal.$refs.modal.show();
    },
    hasLoaded(nft) {
      this.$set(nft, 'loaded', true);
    },
    hasImage(nft) {
      if (nft.customNft || nft.image === '') {
        return true;
      }
      if (nft.loaded) {
        return true;
      }
    },
    getImage(nft) {
      // if (nft.customNft || nft.image === '') {
      //   return placeholderImage;
      // }
      return `${this.nftCardUrl}?contract=${nft.contract}&tokenId=${nft.token_id}`;
    },
    removeSentNft(nft) {
      this.nftObjectClone = utils._.clone(this.nftConfig[nft.contract]);
      const afterSent = this.nftConfig[nft.contract].tokens.filter(entry => {
        return entry.id !== nft.id;
      });
      this.$set(this.nftConfig[nft.contract], 'tokens', afterSent);
      if (this.nftConfig[nft.contract].tokens) {
        if (this.nftConfig[nft.contract].tokens.length === 0)
          this.sentUpdate += 1;
      }
      this.showDetails = false;
    },
    resetNFT(nft) {
      if (Object.keys(this.nftObjectClone).length > 0) {
        this.nftConfig[nft.contract] = this.nftObjectClone;
      }
    },
    changeSelectedContract(selectedContract) {
      this.selectedContract = selectedContract;
      this.showDetails = false;
    },
    comeBack() {
      this.showDetails = false;
    },

    async getTokens() {
      return new Promise((resolve, reject) => {
        fetch(`${this.openSeaLambdaUrl}getOwned`, {
          mode: 'cors',
          cache: 'no-cache',
          method: 'POST',
          'Cache-Control': 'no-cache',
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: '',
            params: {
              address: this.activeAddress
            },
            id: 83
          })
        })
          .then(data => data.json())
          .then(newData => {
            resolve(newData.result);
          })
          .catch(error => {
            // eslint-disable-next-line
        console.error(error);
            this.retryCount++;
            if (this.retryCount < 3) {
              setTimeout(() => {
                resolve(this.getTokens());
              }, 1000);
            } else {
              reject(error);
            }
          });
      });
    },

    async setup() {
      const nftData = {};
      let selectedContract;
      if (this.network.type.name === 'ETH') {
        const configData = await this.getTokens();
        if (!configData.error) {
          configData.tokenContracts.forEach(data => {
            nftData[data.contractIdAddress] = data;

            if (nftData[data.contractIdAddress]) {
              nftData[data.contractIdAddress].contract = data.contractIdAddress;
              nftData[data.contractIdAddress].count = data.owned_asset_count;
              nftData[data.contractIdAddress].startIndex = 0;
              nftData[data.contractIdAddress].priorIndex = 0;
              nftData[data.contractIdAddress].currentIndex = 0;
              nftData[data.contractIdAddress].loadedTo = 0;
            }
          });
          this.nftConfig = { ...nftData };
          selectedContract = Object.keys(this.nftConfig)[0];
          this.selectedContract = Object.keys(this.nftConfig)[0];

          this.reLoading = false;
          this.countsRetrieved = true;
          this.getNftDetails(selectedContract).then(result => {
            this.nftConfig[this.selectedContract].tokens = result;
            this.getNftDetails(selectedContract, 9, 18, true).then(result => {
              this.nftConfig[selectedContract].tokens = result;
            });
          });
        }
      }
    },
    async getNftDetails(
      contract,
      startIndex = -1,
      endIndex = -1,
      preFetch = false
    ) {
      if (!preFetch) this.fetchingOwnedTokens = true;
      let params;
      if (startIndex >= 0 && endIndex >= 0) {
        params = {
          address: this.activeAddress,
          contractAddresses: this.nftConfig[contract].contracts,
          startIndex,
          endIndex
        };
      } else {
        params = {
          address: this.activeAddress,
          contractAddresses: this.nftConfig[contract].contracts
        };
      }
      return await fetch(`${this.openSeaLambdaUrl}getCollections`, {
        mode: 'cors',
        cache: 'no-cache',
        method: 'POST',
        'Cache-Control': 'no-cache',
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: '',
          params,
          id: 83
        })
      })
        .then(data => data.json())
        .then(data => {
          return data.result.tokenContracts.find(item => {
            return item.contractIdAddress === contract;
          });
        })
        .then(data => {
          let allTokens = [];
          allTokens = data.tokens.map(item => {
            return {
              description: item.description,
              name: item.name,
              token_id: item.token_id,
              contract: item.contract
            };
          });

          if (!preFetch) this.fetchingOwnedTokens = false;
          this.nftConfig[contract].tokens = allTokens;
          return allTokens;
        });
    },

    async getNftsToShow() {
      this.nftToShowList = this.selectNftsToShow();
    },
    incrementTokenList() {
      const startIndex =
        this.currentPage * this.countPerPage - this.countPerPage;
      const endIndex = this.currentPage * this.countPerPage;
      const selectedContract = this.selectedContract;
      this.getNftDetails(selectedContract, startIndex, endIndex).then(
        result => {
          this.nftConfig[selectedContract].tokens = result;
          this.collectionLoading = false;
        }
      );
    },
    getNext() {
      this.getNftsToShow();
      this.currentPage++;
      if (
        this.nftConfig[this.selectedContract].tokens.length <
        this.currentPage * this.countPerPage
      ) {
        this.collectionLoading = true;
        this.incrementTokenList();
      }
    },
    getPrevious() {
      if (this.currentPage >= 1) {
        this.currentPage--;
      }
    },
    showNftDetails(nft) {
      this.detailsFor = nft;
      this.showDetails = true;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'NFTManagerContainer.scss';
</style>
